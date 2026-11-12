-- ==============================================================================
-- 00002_users_and_memberships.sql
-- Migration: User Profiles, Roles, Multi-Tenant Memberships & RBAC Functions
-- ==============================================================================

DO $$ BEGIN
    CREATE TYPE school_role_enum AS ENUM (
        'school_owner',
        'school_admin',
        'principal',
        'accountant',
        'teacher',
        'class_teacher',
        'student',
        'parent',
        'librarian',
        'transport_manager',
        'receptionist',
        'staff'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE membership_status_enum AS ENUM ('pending', 'active', 'suspended', 'inactive');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. User Profiles (Mirrors auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL DEFAULT '',
    last_name VARCHAR(100) NOT NULL DEFAULT '',
    full_name VARCHAR(200) GENERATED ALWAYS AS (
        TRIM(first_name || ' ' || last_name)
    ) STORED,
    phone_number VARCHAR(30),
    avatar_url TEXT,
    gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other')),
    date_of_birth DATE,
    blood_group VARCHAR(10),
    national_id VARCHAR(50),
    address TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(30),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 2. School Memberships (Supports multi-school affiliation & varied roles)
CREATE TABLE IF NOT EXISTS public.school_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role school_role_enum NOT NULL,
    status membership_status_enum NOT NULL DEFAULT 'active',
    designation VARCHAR(100),
    department VARCHAR(100),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    valid_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_school_user_role UNIQUE (school_id, user_id, role)
);

CREATE INDEX IF NOT EXISTS idx_memberships_school ON public.school_memberships(school_id);
CREATE INDEX IF NOT EXISTS idx_memberships_user ON public.school_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_role ON public.school_memberships(role);

-- 3. Parent-Student Links
CREATE TABLE IF NOT EXISTS public.parent_student_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    relationship VARCHAR(30) NOT NULL DEFAULT 'guardian' CHECK (relationship IN ('father', 'mother', 'guardian')),
    is_primary_contact BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_parent_student_link UNIQUE (school_id, parent_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_ps_parent ON public.parent_student_links(parent_id);
CREATE INDEX IF NOT EXISTS idx_ps_student ON public.parent_student_links(student_id);

-- 4. User Devices (For Firebase Cloud Messaging & Secure Session Tracking)
CREATE TABLE IF NOT EXISTS public.user_devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    fcm_token TEXT NOT NULL,
    device_type VARCHAR(30) NOT NULL DEFAULT 'android' CHECK (device_type IN ('android', 'ios', 'web')),
    device_model VARCHAR(100),
    os_version VARCHAR(50),
    app_version VARCHAR(30),
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_user_device_token UNIQUE (user_id, fcm_token)
);

-- 5. Login Activity
CREATE TABLE IF NOT EXISTS public.login_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'failed')),
    failure_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- SECURITY DEFINER HELPER FUNCTIONS FOR ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------------------------

-- Check if current authenticated user is Super Admin or Platform Admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.platform_admins
        WHERE user_id = auth.uid()
          AND role IN ('super_admin', 'platform_admin')
          AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if user is an active member of the specified school
CREATE OR REPLACE FUNCTION public.is_member_of_school(check_school_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    IF public.is_super_admin() THEN
        RETURN TRUE;
    END IF;

    RETURN EXISTS (
        SELECT 1 FROM public.school_memberships
        WHERE user_id = auth.uid()
          AND school_id = check_school_id
          AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if user has one of the allowed roles in the school
CREATE OR REPLACE FUNCTION public.has_school_role(check_school_id UUID, allowed_roles school_role_enum[])
RETURNS BOOLEAN AS $$
BEGIN
    IF public.is_super_admin() THEN
        RETURN TRUE;
    END IF;

    RETURN EXISTS (
        SELECT 1 FROM public.school_memberships
        WHERE user_id = auth.uid()
          AND school_id = check_school_id
          AND role = ANY(allowed_roles)
          AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if authenticated parent is linked to student
CREATE OR REPLACE FUNCTION public.is_parent_of(child_student_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    IF public.is_super_admin() THEN
        RETURN TRUE;
    END IF;

    RETURN EXISTS (
        SELECT 1 FROM public.parent_student_links
        WHERE parent_id = auth.uid()
          AND student_id = child_student_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Auto-create profile trigger on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'first_name', ''),
        COALESCE(new.raw_user_meta_data->>'last_name', '')
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        updated_at = timezone('utc'::text, now());
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
