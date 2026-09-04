/**
 * Role-Based Access Control (RBAC) Client
 * Manages user roles, permissions, and source-of-truth governance
 */

const RBAC_API_BASE = process.env.REACT_APP_API_URL || 'https://1ubuntufinancesociety.netlify.app/.netlify/functions';

export type UserRole = 'member' | 'treasurer' | 'secretary' | 'administrator' | 'committee_member';
export type PermissionAction = 'read' | 'create' | 'approve' | 'reverse' | 'audit';
export type ResourceType = 'contributions' | 'loans' | 'distributions' | 'votes' | 'members' | 'announcements' | 'ledger' | 'audit_logs';
export type EventSource = 'bank' | 'member' | 'constitution' | 'system';

interface Permission {
  resource: ResourceType;
  action: PermissionAction;
  description: string;
}

interface Role {
  id: string;
  name: UserRole;
  displayName: string;
  permissions: Permission[];
  description: string;
}

interface GroupMembership {
  id: string;
  userId: string;
  groupId: string;
  role: UserRole;
  joinDate: string;
  status: 'active' | 'inactive' | 'removed';
  permissions: Permission[];
}

interface RoleMember {
  id: string;
  userId: string;
  groupId: string;
  displayName: string;
  email: string;
  roles: UserRole[];
  groupMembership: GroupMembership;
  permissions: Permission[];
  joinDate: string;
  status: 'active' | 'inactive' | 'removed';
  lastActivityDate?: string;
}

interface SourceOfTruthEntry {
  id: string;
  timestamp: string;
  eventType: string;
  source: EventSource;
  actor: string;
  actorRole: UserRole;
  entityType: string;
  entityId: string;
  changes: Record<string, unknown>;
  immutable: true;
  hash: string;
}

class RBACClient {
  private baseUrl: string;
  private currentUser?: RoleMember;

  constructor(baseUrl: string = RBAC_API_BASE) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<{ success: boolean; data?: T; error?: string; permitted?: boolean }> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('RBAC API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get all available roles
   */
  async getRoles() {
    return this.request<Role[]>('/rbac/roles');
  }

  /**
   * Create new group membership
   */
  async createMembership(userId: string, groupId: string, role: UserRole) {
    if (!this.currentUser || !this.hasPermission(this.currentUser.permissions, 'members', 'approve')) {
      return { success: false, error: 'Insufficient permissions' };
    }

    return this.request<GroupMembership>('/rbac/membership', {
      method: 'POST',
      body: JSON.stringify({ userId, groupId, role }),
    });
  }

  /**
   * Update membership (change role or remove)
   */
  async updateMembership(membershipId: string, role?: UserRole, action?: 'remove') {
    if (!this.currentUser || !this.hasPermission(this.currentUser.permissions, 'members', 'approve')) {
      return { success: false, error: 'Insufficient permissions' };
    }

    return this.request<GroupMembership>('/rbac/membership', {
      method: 'PATCH',
      body: JSON.stringify({ membershipId, role, action }),
    });
  }

  /**
   * Create role member (full user with roles)
   */
  async createRoleMember(
    userId: string,
    groupId: string,
    displayName: string,
    email: string,
    role: UserRole
  ) {
    if (!this.currentUser || !this.hasPermission(this.currentUser.permissions, 'members', 'create')) {
      return { success: false, error: 'Insufficient permissions' };
    }

    const result = await this.request<RoleMember>('/rbac/role-member', {
      method: 'POST',
      body: JSON.stringify({ userId, groupId, displayName, email, role }),
    });

    if (result.success) {
      // Record in source of truth
      await this.recordSourceOfTruth(
        'member_added',
        'system',
        this.currentUser.userId,
        'member',
        (result.data as RoleMember).id,
        { role, displayName, email }
      );
    }

    return result;
  }

  /**
   * Get role members
   */
  async getRoleMembers(userId?: string, groupId?: string, role?: UserRole) {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (groupId) params.append('groupId', groupId);
    if (role) params.append('role', role);
    const query = params.toString() ? `?${params.toString()}` : '';

    return this.request<RoleMember[]>(`/rbac/role-member${query}`);
  }

  /**
   * Set current user (for permission checking)
   */
  setCurrentUser(user: RoleMember) {
    this.currentUser = user;
  }

  /**
   * Check if user has permission
   */
  async checkPermission(userId: string, resource: ResourceType, action: PermissionAction) {
    const result = await this.request<{ permitted: boolean; roles: UserRole[] }>('/rbac/permission-check', {
      method: 'POST',
      body: JSON.stringify({ userId, resource, action }),
    });

    return result.permitted || false;
  }

  /**
   * Helper: check permission against permission array
   */
  private hasPermission(permissions: Permission[], resource: ResourceType, action: PermissionAction): boolean {
    return permissions.some(p => p.resource === resource && p.action === action);
  }

  /**
   * SOURCE OF TRUTH: Record event in append-only ledger
   * Never modified, only appended to
   */
  async recordSourceOfTruth(
    eventType: string,
    source: EventSource,
    actor: string,
    entityType: string,
    entityId: string,
    changes: Record<string, unknown>
  ) {
    const member = this.currentUser || (await this.getRoleMembers(actor)).data?.[0];

    return this.request<SourceOfTruthEntry>('/rbac/source-of-truth', {
      method: 'POST',
      body: JSON.stringify({
        eventType,
        source,
        actor,
        actorRole: member?.roles[0] || 'member',
        entityType,
        entityId,
        changes,
      }),
    });
  }

  /**
   * Get source of truth ledger entries
   * Immutable, append-only record
   */
  async getSourceOfTruth(eventType?: string, actor?: string, entityType?: string) {
    const params = new URLSearchParams();
    if (eventType) params.append('eventType', eventType);
    if (actor) params.append('actor', actor);
    if (entityType) params.append('entityType', entityType);
    const query = params.toString() ? `?${params.toString()}` : '';

    return this.request<SourceOfTruthEntry[]>(`/rbac/source-of-truth${query}`);
  }

  /**
   * Governance: Add member to group
   */
  async addMember(
    userId: string,
    groupId: string,
    displayName: string,
    email: string,
    initialRole: UserRole = 'member'
  ) {
    console.log(`👤 Adding member: ${displayName} (${email})`);

    const result = await this.createRoleMember(userId, groupId, displayName, email, initialRole);

    if (result.success) {
      console.log(`✅ Member added and recorded in source of truth`);
    }

    return result;
  }

  /**
   * Governance: Remove member from group
   */
  async removeMember(membershipId: string) {
    if (!this.currentUser || !this.hasPermission(this.currentUser.permissions, 'members', 'approve')) {
      return { success: false, error: 'Insufficient permissions' };
    }

    const result = await this.updateMembership(membershipId, undefined, 'remove');

    if (result.success) {
      await this.recordSourceOfTruth(
        'member_removed',
        'constitution',
        this.currentUser.userId,
        'member',
        membershipId,
        { status: 'removed' }
      );
    }

    return result;
  }

  /**
   * Governance: Change member role
   */
  async changeRole(membershipId: string, newRole: UserRole) {
    if (!this.currentUser || !this.hasPermission(this.currentUser.permissions, 'members', 'approve')) {
      return { success: false, error: 'Insufficient permissions' };
    }

    const result = await this.updateMembership(membershipId, newRole);

    if (result.success) {
      await this.recordSourceOfTruth(
        'role_changed',
        'constitution',
        this.currentUser.userId,
        'member',
        membershipId,
        { newRole }
      );
    }

    return result;
  }

  /**
   * Get member details with all permissions
   */
  async getMemberDetails(userId: string) {
    const members = await this.getRoleMembers(userId);
    if (members.success && members.data && members.data.length > 0) {
      return { success: true, data: members.data[0] };
    }
    return { success: false, error: 'Member not found' };
  }

  /**
   * Verify user can perform action
   */
  async requirePermission(userId: string, resource: ResourceType, action: PermissionAction) {
    const permitted = await this.checkPermission(userId, resource, action);

    if (!permitted) {
      console.error(`❌ Access denied: ${userId} cannot ${action} ${resource}`);
      throw new Error(`Access denied: Cannot ${action} ${resource}`);
    }

    return true;
  }

  /**
   * Get governance audit trail
   * Shows all governance events (member adds/removes, role changes)
   */
  async getGovernanceAuditTrail() {
    return this.getSourceOfTruth('member_added,member_removed,role_changed');
  }

  /**
   * Summary: User's role and permissions
   */
  async getUserProfile(userId: string) {
    const member = await this.getMemberDetails(userId);

    if (!member.success) {
      return member;
    }

    const data = member.data as RoleMember;

    return {
      success: true,
      data: {
        id: data.id,
        displayName: data.displayName,
        email: data.email,
        roles: data.roles,
        permissions: data.permissions,
        status: data.status,
        joinDate: data.joinDate,
        permissionSummary: {
          canApproveTransactions: data.permissions.some(p => p.action === 'approve' && ['contributions', 'loans', 'distributions'].includes(p.resource as string)),
          canManageMembers: data.permissions.some(p => p.action === 'approve' && p.resource === 'members'),
          canViewLedger: data.permissions.some(p => p.action === 'read' && p.resource === 'ledger'),
          canCreateVotes: data.permissions.some(p => p.action === 'create' && p.resource === 'votes'),
          canAudit: data.permissions.some(p => p.action === 'audit'),
        },
      },
    };
  }
}

export const rbac = new RBACClient();
export default RBACClient;
