# Ubuntu Finance Society - Priority Roadmap

## 🎯 Quick Priority Decision Tree

```
What's your biggest immediate need?
│
├─ "Users need to START using the system"
│  └─ Go to: PHASE 1 (Authentication & Launch)
│
├─ "We have bank transactions coming in"
│  └─ Go to: Bank Integration (below)
│
├─ "Members are confused about their contributions"
│  └─ Go to: Dashboard & Reporting (below)
│
├─ "We need to make financial decisions"
│  └─ Go to: Voting & Governance (below)
│
└─ "We're losing data/having technical issues"
   └─ Go to: Database & Reliability (below)
```

---

## 🔴 HIGHEST PRIORITY (Do First)

### Authentication & User Management
**Why**: Without this, only one person can use the system

**What to build**:
- Login screen in Lovable
- Signup/invite workflow
- Password reset
- Session management
- User profile page

**Implementation**:
1. Set up Auth0 (easiest) or Clerk
2. Add login component to Lovable
3. Link auth user to `rbac.RoleMember`
4. Protect all routes with auth guard

**Time**: 2-3 hours
**Effort**: Medium
**Impact**: High (blocks all other features)

**Test**:
```typescript
// Test login flow
1. Visit Lovable app
2. See login screen
3. Sign up with email
4. Get redirected to dashboard
5. See your profile
```

---

### Member Dashboard
**Why**: Users need to see "what's happening"

**What to build**:
- Profile card (name, role, contributions)
- Recent transactions (contributions, loans, distributions)
- Upcoming votes
- Balance summary
- Quick actions (contribute, request loan, vote)

**Implementation**:
1. Create `/dashboard` route
2. Fetch `rbac.getUserProfile(userId)`
3. Fetch `api.getContributions(memberId)`
4. Fetch `api.getLoans("requested", memberId)` - your loans
5. Fetch `api.getVotes("open")` - current votes
6. Display with real data

**Time**: 3-4 hours
**Effort**: Medium
**Impact**: High (visibility)

**Code**:
```typescript
// Dashboard component
const [profile, setProfile] = useState(null);
const [contributions, setContributions] = useState([]);
const [loans, setLoans] = useState([]);
const [votes, setVotes] = useState([]);

useEffect(() => {
  async function loadData() {
    const p = await rbac.getUserProfile(userId);
    const c = await api.getContributions(userId);
    const l = await api.getLoans("requested", userId);
    const v = await api.getVotes("open");
    
    setProfile(p.data);
    setContributions(c.data);
    setLoans(l.data);
    setVotes(v.data);
  }
  loadData();
}, [userId]);
```

---

### Contribution Recording (Treasurer)
**Why**: Core financial function, needs to work first

**What to build**:
- Form to record contribution
- Member lookup/selection
- Amount input
- Verification button
- Success confirmation
- History view

**Implementation**:
```typescript
// Contribution form
const [memberId, setMemberId] = useState('');
const [amount, setAmount] = useState('');

const handleSubmit = async () => {
  // Step 1: Verify treasurer has permission
  const canApprove = await rbac.checkPermission(
    userId,
    'contributions',
    'approve'
  );
  
  if (!canApprove) {
    alert('You do not have permission to approve contributions');
    return;
  }
  
  // Step 2: Record contribution
  const result = await api.recordContribution(
    memberId,
    parseFloat(amount),
    'Manual deposit record'
  );
  
  if (result.success) {
    // Step 3: Log audit trail
    await rbac.recordSourceOfTruth(
      'contribution_recorded',
      'system',
      userId,
      'contribution',
      result.data.id,
      { amount, memberId }
    );
    
    alert('✅ Contribution recorded and verified');
    setAmount('');
  }
};
```

**Time**: 2-3 hours
**Effort**: Medium
**Impact**: Critical (financial tracking)

---

## 🟡 HIGH PRIORITY (Week 1)

### Database Setup
**Why**: In-memory storage will reset on deploy, losing all data

**Recommended**: Vercel Postgres or Supabase

**Steps**:
1. Create database cluster
2. Add connection string to `.env`
3. Update all functions to use database
4. Test that data persists

**Migration Path**:
```typescript
// Old (in-memory):
const contributions = [];
contributions.push(newContribution);

// New (database):
const result = await pool.query(
  'INSERT INTO contributions (member_id, amount) VALUES ($1, $2)',
  [memberId, amount]
);
```

**Time**: 4-6 hours
**Effort**: High (many functions to update)
**Impact**: Critical (data persistence)

---

### Bank Webhook Integration
**Why**: Without this, treasurers must manually enter all contributions

**Steps**:
1. Contact your bank
2. Get API credentials (Stitch, Plaid, FNB API, etc.)
3. Set up webhook endpoint
4. Test bank transaction → ledger flow
5. Create admin page to verify received transactions

**Webhook Handler** (already built):
```typescript
POST /.netlify/functions/ledger

{
  transactionId: "BANK-123",
  amount: 500,
  bankName: "Standard Bank",
  accountNumber: "1234567890",
  description: "Contribution from John"
}
```

**Time**: 4-8 hours (depends on bank API)
**Effort**: High (bank API complexity)
**Impact**: High (automation)

---

### Treasurer Approval Workflow
**Why**: Treasurer needs to verify bank transactions before they become official ledger entries

**What to build**:
- Pending transactions view
- Treasurer can click "verify" or "reject"
- Triggers ledger.verifyLedgerEntry()
- Immutable entry created
- Member notified

**Implementation**:
```typescript
// Treasurer approval page
const pendingTransactions = await api.getBankTransactions('received');

const handleApprove = async (bankTxnId) => {
  // Create stitch event linking bank txn to member
  const stitch = await ledger.createStitchEvent(
    bankTxnId,
    memberId, // treasurer selects which member
    'contribution',
    amount
  );
  
  // Verify and create immutable ledger entry
  const ledgerEntry = await ledger.verifyLedgerEntry(
    stitch.data.id,
    userId, // treasurer ID
    ['bank_verified', 'no_duplicate']
  );
  
  // Audit trail auto-recorded
  console.log('✅ Verified and immutable');
};
```

**Time**: 3-4 hours
**Effort**: Medium
**Impact**: Critical (financial accuracy)

---

### Voting System UI
**Why**: Governance decisions need transparent voting

**What to build**:
- View open votes
- Vote form (yes/no/abstain)
- Vote results
- Vote history
- Only active members can vote

**Implementation**:
```typescript
// Vote page
const openVotes = await api.getVotes('open');

const handleVote = async (voteId, choice) => {
  // Check permission
  const isMember = profile.status === 'active';
  if (!isMember) {
    alert('Only active members can vote');
    return;
  }
  
  // Record vote (backend should track who voted)
  await api.vote(voteId, userId, choice);
  
  alert('✅ Your vote was recorded');
};
```

**Time**: 2-3 hours
**Effort**: Medium
**Impact**: High (governance)

---

## 🟢 MEDIUM PRIORITY (Week 2)

- [ ] Loan request & approval workflow
- [ ] Distribution creation & management
- [ ] Email notifications
- [ ] Member directory with search
- [ ] Financial reports & CSV export
- [ ] Audit log viewer for admin
- [ ] Member statement generation
- [ ] Role management (admin only)

---

## 🔵 NICE-TO-HAVE (Week 3+)

- [ ] Mobile app (React Native or PWA)
- [ ] Dark mode
- [ ] Multi-language support
- [ ] SMS notifications
- [ ] API webhooks for integration
- [ ] Analytics & dashboards
- [ ] Payment gateway (Stripe, PayFast)
- [ ] Blockchain verification (future)

---

## 📋 Getting Started Checklist

- [ ] Push all code to GitHub (DONE ✅)
- [ ] Verify Netlify deployment
  ```
  curl https://1ubuntufinancesociety.netlify.app/.netlify/functions/members
  ```
- [ ] Add Auth0/Clerk to Lovable
- [ ] Build login screen in Lovable
- [ ] Create admin account
- [ ] Build member dashboard
- [ ] Build contribution recording form
- [ ] Set up database
- [ ] Set up bank webhook
- [ ] Build treasurer approval interface

---

## 🚀 Launch Checklist (When Ready)

- [ ] All core features tested
- [ ] Database has backups
- [ ] Authentication working
- [ ] CORS enabled
- [ ] Admin trained
- [ ] Members trained
- [ ] Support system ready
- [ ] Monitoring set up

---

## Quick Wins (1-2 Hours Each)

1. **Add member count widget** → `api.getMembers().data.length`
2. **Add total contributions** → Sum all `getContributions()`
3. **Add pending loans count** → Filter `getLoans('requested')`
4. **Add recent activity feed** → Last 10 from `getSourceOfTruth()`
5. **Add member status badge** → Color-coded active/inactive

---

## Who Should Do What

| Task | Owner | Time |
|------|-------|------|
| Authentication setup | Developer | 2-3 hrs |
| Dashboard UI | Frontend Dev | 3-4 hrs |
| Database setup | DevOps/Developer | 4-6 hrs |
| Bank integration | Developer + Bank | 4-8 hrs |
| Treasurer workflow | Treasurer + Dev | 3-4 hrs |
| Voting UI | Frontend Dev | 2-3 hrs |
| Admin manual | Administrator | 2-3 hrs |
| User training | Administrator | 1-2 hrs |

---

**Next Step**: Pick your highest priority from above and start building!
