-- ==============================================================================
-- 00001_initial_platform_and_tenants.sql
-- Migration: Platform Administration & Multi-Tenant School Infrastructure
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Custom Enums
DO $$ BEGIN
    CREATE TYPE platform_role_enum AS ENUM ('super_admin', 'platform_admin', 'support_agent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE school_status_enum AS ENUM ('pending', 'active', 'suspended', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE subscription_tier_enum AS ENUM ('free', 'basic', 'pro', 'enterprise', 'custom');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE billing_cycle_enum AS ENUM ('monthly', 'quarterly', 'annual');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Subscription Plans
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    tier subscription_tier_enum NOT NULL UNIQUE,
    description TEXT,
    price_monthly NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    price_annual NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    max_students INTEGER NOT NULL DEFAULT 100,
    max_teachers INTEGER NOT NULL DEFAULT 15,
    max_storage_gb INTEGER NOT NULL DEFAULT 5,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Platform Admins (EDUVANTA platform operators)
CREATE TABLE IF NOT EXISTS public.platform_admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role platform_role_enum NOT NULL DEFAULT 'platform_admin',
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_platform_admin_user UNIQUE (user_id)
);

-- 3. Schools (Tenants)
CREATE TABLE IF NOT EXISTS public.schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    website VARCHAR(255),
    address_line1 TEXT,
    address_line2 TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) NOT NULL DEFAULT 'Bangladesh',
    status school_status_enum NOT NULL DEFAULT 'active',
    subscription_plan_id UUID REFERENCES public.subscription_plans(id) ON DELETE SET NULL,
    subscription_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_schools_status ON public.schools(status);
CREATE INDEX IF NOT EXISTS idx_schools_slug ON public.schools(slug);

-- 4. School Settings & Dynamic Branding
CREATE TABLE IF NOT EXISTS public.school_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    timezone VARCHAR(50) NOT NULL DEFAULT 'Asia/Dhaka',
    currency VARCHAR(10) NOT NULL DEFAULT 'BDT',
    currency_symbol VARCHAR(10) NOT NULL DEFAULT '৳',
    academic_year_start_month SMALLINT NOT NULL DEFAULT 1 CHECK (academic_year_start_month BETWEEN 1 AND 12),
    date_format VARCHAR(20) NOT NULL DEFAULT 'YYYY-MM-DD',
    time_format VARCHAR(10) NOT NULL DEFAULT '12h' CHECK (time_format IN ('12h', '24h')),
    enable_online_admissions BOOLEAN NOT NULL DEFAULT true,
    enable_online_payments BOOLEAN NOT NULL DEFAULT true,
    enable_sms_notifications BOOLEAN NOT NULL DEFAULT false,
    enable_email_notifications BOOLEAN NOT NULL DEFAULT true,
    enable_push_notifications BOOLEAN NOT NULL DEFAULT true,
    attendance_mode VARCHAR(30) NOT NULL DEFAULT 'daily' CHECK (attendance_mode IN ('daily', 'subject_wise', 'biometric')),
    grading_system VARCHAR(30) NOT NULL DEFAULT 'gpa_5' CHECK (grading_system IN ('letter_grade', 'gpa_5', 'percentage')),
    branding JSONB NOT NULL DEFAULT '{
        "logoUrl": null,
        "faviconUrl": null,
        "primaryColor": "#102A56",
        "secondaryColor": "#2563EB",
        "accentColor": "#F5B82E",
        "bannerUrl": null,
        "motto": "Excellence in Education"
    }'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_school_settings UNIQUE (school_id)
);

-- 5. School Custom Domains
CREATE TABLE IF NOT EXISTS public.school_domains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    domain VARCHAR(255) NOT NULL UNIQUE,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    ssl_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (ssl_status IN ('pending', 'active', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. School Subscriptions History & Invoices
CREATE TABLE IF NOT EXISTS public.school_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
    billing_cycle billing_cycle_enum NOT NULL DEFAULT 'annual',
    status VARCHAR(30) NOT NULL DEFAULT 'active' CHECK (status IN ('trial', 'active', 'past_due', 'canceled', 'expired')),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    auto_renew BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.subscription_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID NOT NULL REFERENCES public.school_subscriptions(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    invoice_number VARCHAR(100) NOT NULL UNIQUE,
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'BDT',
    payment_method VARCHAR(50),
    transaction_reference VARCHAR(255),
    status VARCHAR(30) NOT NULL DEFAULT 'paid' CHECK (status IN ('unpaid', 'paid', 'failed', 'refunded')),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Platform Global Settings
CREATE TABLE IF NOT EXISTS public.platform_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Platform Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_audit_school_id ON public.audit_logs(school_id);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON public.audit_logs(created_at DESC);
