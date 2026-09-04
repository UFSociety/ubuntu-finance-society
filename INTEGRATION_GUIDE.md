# Integration Guide: Lovable UI ↔ Netlify Backend

## Quick Start

### For Lovable Developers

1. **Import the API Client**
   ```typescript
   import { api } from '../api/client.ts';
   ```

2. **Use API Methods**
   ```typescript
   // Record a contribution
   const response = await api.recordContribution(
     memberId: "member_123",
     amount: 500,
     description: "Monthly contribution"
   );

   // Request a loan
   const loan = await api.requestLoan(
     memberId: "member_456",
     amount: 5000,
     interestRate: 0.05
   );

   // Open a vote
   const vote = await api.openVote(
     title: "Q4 Distribution Proposal",
     description: "Should we distribute 20% of funds?",
     openedBy: "admin_001",
     requiredApproval: 0.75
   );
   ```

3. **Handle Responses**
   ```typescript
   const { success, data, error } = await api.recordContribution(...);
   
   if (success) {
     // Process data
     console.log('Contribution recorded:', data.id);
   } else {
     // Handle error
     console.error('Failed:', error);
   }
   ```

### Environment Configuration

1. **Copy environment template**
   ```bash
   cp .env.example .env
   ```

2. **Verify API URL** (should already be set)
   ```
   REACT_APP_API_URL=https://1ubuntufinancesociety.netlify.app/.netlify/functions
   ```

3. **Update if needed** (when deploying to different Netlify site)

## API Reference

### Contributions
```typescript
// Record new contribution
api.recordContribution(memberId, amount, description)
  → { success: true, data: { id, memberId, amount, date, verified } }

// Get member contributions
api.getContributions(memberId)
  → { success: true, data: [Contribution] }
```

### Loans
```typescript
// Request new loan
api.requestLoan(memberId, amount, interestRate)
  → { success: true, data: { id, status: "requested", ... } }

// Approve loan
api.approveLoan(loanId, approvedBy)
  → { success: true, data: { status: "approved", approvalDate, ... } }

// Record loan repayment
api.repayLoan(loanId)
  → { success: true, data: { status: "repaid", repaymentDate, ... } }

// Query loans by status
api.getLoans(status?, memberId?)
  → { success: true, data: [Loan] }
```

### Voting
```typescript
// Open new vote
api.openVote(title, description, openedBy, requiredApproval)
  → { success: true, data: { id, status: "open", ... } }

// Close vote (pass or reject)
api.passVote(voteId)  // status becomes "passed"
  → { success: true, data: { status: "passed", closeDate, ... } }

// Get votes
api.getVotes(status?)
  → { success: true, data: [Vote] }
```

### Members
```typescript
// Add new member
api.addMember(name, email, role)
  → { success: true, data: { id, status: "active", ... } }

// Remove member
api.removeMember(memberId)
  → { success: true, data: { status: "removed", ... } }

// List members
api.getMembers(status?)
  → { success: true, data: [Member] }
```

### Distributions
```typescript
// Approve distribution
api.approveDistribution(name, totalAmount, approvedBy, distributions)
  → { success: true, data: { id, status: "approved", ... } }

// Get distributions
api.getDistributions(status?)
  → { success: true, data: [Distribution] }
```

### Announcements
```typescript
// Publish announcement
api.publishAnnouncement(title, content, publishedBy)
  → { success: true, data: { id, status: "published", ... } }

// Get announcements
api.getAnnouncements()
  → { success: true, data: [Announcement] }
```

### Audit & Reversals
```typescript
// Log audit entry
api.logAuditEntry(action, actor, entityType, entityId, changes)
  → { success: true, data: { id, timestamp, ... } }

// Get audit trail
api.getAuditLog(entityType?, entityId?, actor?)
  → { success: true, data: [AuditEntry] }

// Reverse transaction
api.reverseTransaction(transactionId, reason)
  → { success: true, data: { status: "reversed", ... } }
```

## Common Workflows

### Workflow 1: Approve a Loan Request

```typescript
// 1. User submits loan request (already done)
// 2. Admin reviews pending loans
const loans = await api.getLoans("requested");

// 3. Admin approves loan
const approved = await api.approveLoan(
  loans[0].id,
  "admin_001"
);

// 4. System logs audit entry
await api.logAuditEntry(
  action: "loan_approved",
  actor: "admin_001",
  entityType: "loan",
  entityId: loans[0].id,
  changes: { status: "approved" }
);

// 5. UI updates to show approved status
```

### Workflow 2: Process Monthly Distribution

```typescript
// 1. Admin initiates distribution
const distribution = await api.approveDistribution(
  name: "September 2024 Distribution",
  totalAmount: 10000,
  approvedBy: "treasurer_001",
  distributions: [
    { memberId: "member_1", amount: 2500 },
    { memberId: "member_2", amount: 2500 },
    // ... more members
  ]
);

// 2. Log for audit trail
await api.logAuditEntry(
  action: "distribution_approved",
  actor: "treasurer_001",
  entityType: "distribution",
  entityId: distribution.id,
  changes: { status: "approved" }
);

// 3. Announce to members
await api.publishAnnouncement(
  title: "September Distribution Approved",
  content: "Your distribution has been processed. Check your account.",
  publishedBy: "system"
);
```

### Workflow 3: Correct an Error (Reversal)

```typescript
// 1. Identify erroneous transaction
const auditTrail = await api.getAuditLog(
  entityType: "contribution",
  entityId: "contrib_123"
);

// 2. Reverse the transaction
const reversed = await api.reverseTransaction(
  transactionId: "contrib_123",
  reason: "Duplicate entry - correcting in new transaction"
);

// 3. Record corrective action
await api.logAuditEntry(
  action: "transaction_reversed",
  actor: "admin_001",
  entityType: "contribution",
  entityId: "contrib_123",
  changes: { 
    status: "reversed",
    reason: "Duplicate entry - correcting in new transaction"
  }
);

// 4. Create new correct transaction
await api.recordContribution(
  memberId: "member_123",
  amount: 500,
  description: "Correction for reversed transaction contrib_123"
);
```

## Error Handling

```typescript
try {
  const result = await api.recordContribution(...);
  
  if (!result.success) {
    // API returned error
    console.error('Error:', result.error);
    // Show user-friendly message
    showErrorNotification(result.error);
    return;
  }
  
  // Process successful response
  showSuccessNotification(`Contribution recorded: ${result.data.id}`);
  
} catch (err) {
  // Network or other error
  console.error('Network error:', err);
  showErrorNotification('Failed to connect to server');
}
```

## Testing the Integration

### Test 1: Basic Connectivity
```typescript
// Test if backend is reachable
try {
  const members = await api.getMembers();
  console.log('✅ Backend is reachable');
} catch (err) {
  console.error('❌ Cannot reach backend:', err);
}
```

### Test 2: Create Test Data
```typescript
// Create test member
const member = await api.addMember(
  name: "Test Member",
  email: "test@example.com",
  role: "member"
);

// Record test contribution
const contrib = await api.recordContribution(
  member.data.id,
  100,
  "Test contribution"
);

console.log('✅ Test data created:', { member, contrib });
```

### Test 3: Verify Audit Trail
```typescript
const audit = await api.getAuditLog(
  entityType: "contribution"
);

console.log('✅ Audit trail:', audit.data);
```

## Troubleshooting

### Issue: CORS Error
**Problem**: `Access-Control-Allow-Origin` error in browser console
**Solution**: 
- Verify Lovable URL matches origin in netlify.toml
- Check Netlify function logs for errors
- Ensure browser is accessing https://group-governance-aid.lovable.app

### Issue: 404 Not Found
**Problem**: API endpoints return 404
**Solution**:
- Verify Netlify functions are deployed (`/api/audit`, etc. should exist)
- Check Netlify build logs
- Ensure API_URL in .env is correct
- Run `npm run build` locally and check `netlify/functions/` directory

### Issue: Slow Responses
**Problem**: API calls taking >5 seconds
**Solution**:
- Check Netlify function logs for timeout
- Verify Netlify cold start (first call may be slow)
- Consider upgrading Netlify plan for better performance

### Issue: Data Not Persisting
**Problem**: Data disappears after refresh
**Solution**:
- Current implementation uses in-memory storage
- This is temporary until database is configured
- For production, follow "Database Setup" section

## Database Setup (Future)

Current implementation stores data in memory (resets on redeployment).

**For Production**:
1. Choose database (PostgreSQL, MongoDB, etc.)
2. Update connection string in environment variables
3. Modify each function to use database client instead of arrays
4. Add database migration scripts

Example (PostgreSQL):
```typescript
import { createPool } from '@vercel/postgres';

const pool = createPool();

// In function:
const result = await pool.query(
  'INSERT INTO contributions (member_id, amount) VALUES ($1, $2)',
  [memberId, amount]
);
```

## Support & Feedback

- **Issues**: Report in GitHub repo
- **Questions**: Check ARCHITECTURE.md for detailed docs
- **Improvements**: Submit PRs to enhance API

---

**Last Updated**: September 4, 2026
**Status**: ✅ Ready for Lovable Integration
