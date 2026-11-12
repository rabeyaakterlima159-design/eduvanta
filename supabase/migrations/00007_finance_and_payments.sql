-- ==============================================================================
-- 00007_finance_and_payments.sql
-- Migration: Tuition Fees, Bangladesh Gateways (bKash/Nagad/SSLCommerz) & Receipts
-- ==============================================================================

DO $$ BEGIN
    CREATE TYPE fee_status_enum AS ENUM ('unpaid', 'partial', 'paid', 'overdue', 'waived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_gateway_enum AS ENUM ('bkash', 'nagad', 'sslcommerz', 'cash', 'bank_transfer', 'manual');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_status_enum AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Fee Categories
CREATE TABLE IF NOT EXISTS public.fee_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    is_recurring BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_school_fee_category UNIQUE (school_id, name)
);

-- 2. Fee Structures (Class-level default rates)
CREATE TABLE IF NOT EXISTS public.fee_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES public.academic_sessions(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.fee_categories(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL,
    due_day_of_month SMALLINT DEFAULT 10,
    late_fine_amount NUMERIC(12, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_class_session_fee UNIQUE (session_id, class_id, category_id)
);

-- 3. Student Invoices (Student Fees)
CREATE TABLE IF NOT EXISTS public.student_fees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES public.academic_sessions(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.fee_categories(id) ON DELETE CASCADE,
    invoice_number VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    base_amount NUMERIC(12, 2) NOT NULL,
    discount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    fine NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_payable NUMERIC(12, 2) NOT NULL,
    amount_paid NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    balance_due NUMERIC(12, 2) NOT NULL,
    due_date DATE NOT NULL,
    status fee_status_enum NOT NULL DEFAULT 'unpaid',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_student_fees_student ON public.student_fees(student_id);
CREATE INDEX IF NOT EXISTS idx_student_fees_status ON public.student_fees(school_id, status);

-- 4. Payment Transactions
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    student_fee_id UUID REFERENCES public.student_fees(id) ON DELETE SET NULL,
    payer_id UUID NOT NULL REFERENCES public.profiles(id),
    gateway payment_gateway_enum NOT NULL,
    gateway_transaction_id VARCHAR(150),
    merchant_invoice_number VARCHAR(100) NOT NULL UNIQUE,
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'BDT',
    status transaction_status_enum NOT NULL DEFAULT 'pending',
    gateway_raw_response JSONB DEFAULT '{}'::jsonb,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_transactions_school ON public.payment_transactions(school_id);
CREATE INDEX IF NOT EXISTS idx_transactions_payer ON public.payment_transactions(payer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.payment_transactions(status);

-- 5. Digital Receipts
CREATE TABLE IF NOT EXISTS public.receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    student_fee_id UUID NOT NULL REFERENCES public.student_fees(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES public.payment_transactions(id) ON DELETE SET NULL,
    receipt_number VARCHAR(100) NOT NULL UNIQUE,
    amount_paid NUMERIC(12, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    issued_to_student_id UUID NOT NULL REFERENCES public.profiles(id),
    received_by UUID REFERENCES public.profiles(id), -- Null if automated gateway
    receipt_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_receipts_student ON public.receipts(issued_to_student_id);
