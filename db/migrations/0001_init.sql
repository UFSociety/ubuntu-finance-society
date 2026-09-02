-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Groups (Stokvels)
CREATE TABLE stokvel_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    charter_acknowledged BOOLEAN NOT NULL DEFAULT TRUE,
    compliance_notice_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Member Roles
CREATE TYPE member_role AS ENUM ('CHAIRPERSON', 'TREASURER', 'SECRETARY', 'AUDITOR', 'MEMBER');

CREATE TABLE group_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES stokvel_groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role member_role NOT NULL DEFAULT 'MEMBER',
    joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(group_id, user_id)
);

-- Ledger Entry Types
CREATE TYPE ledger_type AS ENUM ('CONTRIBUTION', 'PAYOUT', 'ADJUSTMENT', 'REVERSAL');

-- Append-Only Transactional Ledger
CREATE TABLE ledger_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES stokvel_groups(id),
    user_id UUID REFERENCES group_memberships(id),
    type ledger_type NOT NULL,
    amount_cents BIGINT NOT NULL, -- Stored in integer minor units (cents)
    currency VARCHAR(3) DEFAULT 'ZAR',
    reference VARCHAR(255) NOT NULL, -- Stitch Transaction / Payment ID
    cryptographic_hash VARCHAR(64) NOT NULL, -- SHA-256 (prev_hash + entry_data)
    prev_hash VARCHAR(64),
    source VARCHAR(50) NOT NULL DEFAULT 'stitch_webhook',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Prevent UPDATES and DELETES on ledger_entries (Append-Only Invariant)
CREATE OR REPLACE FUNCTION verify_ledger_immutability()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Ledger entries are immutable and cannot be updated or deleted.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_ledger_immutability
BEFORE UPDATE OR DELETE ON ledger_entries
FOR EACH ROW EXECUTE FUNCTION verify_ledger_immutability();

-- Webhook Ingress Logging for Idempotency
CREATE TABLE webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id VARCHAR(255) UNIQUE NOT NULL,
    provider VARCHAR(50) NOT NULL DEFAULT 'stitch',
    payload JSONB NOT NULL,
    processed_at TIMESTAMPTZ,
    status VARCHAR(50) NOT NULL DEFAULT 'RECEIVED',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
