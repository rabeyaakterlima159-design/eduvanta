-- ==============================================================================
-- 00013_super_admin_seed.sql
-- Migration: Provision Official Platform Super Admin & Role Infrastructure
-- ==============================================================================

-- 1. Create Super Admin Profile in public.profiles
-- Email: Sohel229229@gmail.com
-- Role: super_admin

DO $$
DECLARE
    v_admin_id UUID := '00000000-0000-0000-0000-000000000001';
BEGIN
    -- Check if user already exists in auth.users, otherwise insert placeholder
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'Sohel229229@gmail.com') THEN
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            role,
            aud
        ) VALUES (
            v_admin_id,
            '00000000-0000-0000-0000-000000000000',
            'Sohel229229@gmail.com',
            crypt('shariar123', gen_salt('bf', 10)),
            timezone('utc'::text, now()),
            '{"provider":"email","providers":["email"]}'::jsonb,
            '{"first_name":"Sohel","last_name":"Shariar","role":"super_admin"}'::jsonb,
            timezone('utc'::text, now()),
            timezone('utc'::text, now()),
            'authenticated',
            'authenticated'
        );
    ELSE
        SELECT id INTO v_admin_id FROM auth.users WHERE email = 'Sohel229229@gmail.com';
    END IF;

    -- Ensure Profile exists
    INSERT INTO public.profiles (
        id,
        email,
        first_name,
        last_name,
        phone_number,
        created_at,
        updated_at
    ) VALUES (
        v_admin_id,
        'Sohel229229@gmail.com',
        'Sohel',
        'Shariar',
        '+8801700000000',
        timezone('utc'::text, now()),
        timezone('utc'::text, now())
    )
    ON CONFLICT (email) DO UPDATE SET
        first_name = 'Sohel',
        last_name = 'Shariar';

    -- Ensure Platform Admin membership
    INSERT INTO public.platform_admins (
        user_id,
        role,
        status,
        created_at,
        updated_at
    ) VALUES (
        v_admin_id,
        'super_admin',
        'active',
        timezone('utc'::text, now()),
        timezone('utc'::text, now())
    )
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'super_admin',
        status = 'active';

END $$;

-- 2. Audit Log Entry for Initial Super Admin Provisioning
INSERT INTO public.audit_logs (
    actor_id,
    action,
    entity_type,
    metadata
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'PLATFORM_SUPER_ADMIN_PROVISIONED',
    'platform_admins',
    '{"email":"Sohel229229@gmail.com","role":"super_admin","system":"EDUVANTA Core"}'::jsonb
);
