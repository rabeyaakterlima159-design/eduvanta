-- ==============================================================================
-- 00010_server_driven_ui.sql
-- Migration: Server-Driven UI (SDUI), Remote Configuration, Feature Flags & Version Policy
-- ==============================================================================

-- 1. App Configurations (Active configuration per scope)
CREATE TABLE IF NOT EXISTS public.app_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE, -- NULL indicates global platform default
    role_target school_role_enum, -- NULL indicates all roles
    version INTEGER NOT NULL DEFAULT 1,
    layout_data JSONB NOT NULL DEFAULT '{
        "theme": {
            "primaryColor": "#102A56",
            "secondaryColor": "#2563EB",
            "accentColor": "#F5B82E",
            "backgroundColor": "#F5F8FC",
            "appBarTitle": "EDUVANTA",
            "logoUrl": null
        },
        "navigation": [
            { "id": "home", "label": "Home", "route": "/home", "icon": "home", "order": 1, "rolesAllowed": ["student", "parent", "teacher", "staff", "school_admin"] },
            { "id": "timetable", "label": "Timetable", "route": "/timetable", "icon": "calendar", "order": 2, "rolesAllowed": ["student", "teacher"] },
            { "id": "notices", "label": "Notices", "route": "/notices", "icon": "bell", "order": 3, "rolesAllowed": ["student", "parent", "teacher", "staff", "school_admin"] },
            { "id": "profile", "label": "Profile", "route": "/profile", "icon": "user", "order": 4, "rolesAllowed": ["student", "parent", "teacher", "staff", "school_admin"] }
        ],
        "widgets": [
            {
                "id": "hero_banner",
                "type": "HeroBanner",
                "title": "Welcome to Eduvanta",
                "order": 1,
                "visible": true,
                "rolesAllowed": ["student", "parent", "teacher", "staff", "school_admin"],
                "props": {
                    "tagline": "Learn • Grow • Excel",
                    "ctaLabel": "Explore More",
                    "ctaRoute": "/notices"
                }
            },
            {
                "id": "quick_stats",
                "type": "QuickStats",
                "title": "Overview",
                "order": 2,
                "visible": true,
                "rolesAllowed": ["student", "parent"],
                "props": {
                    "showAttendance": true,
                    "showAssignments": true,
                    "showResults": true,
                    "showFees": true
                }
            },
            {
                "id": "action_grid",
                "type": "ActionGrid",
                "title": "Quick Actions",
                "order": 3,
                "visible": true,
                "rolesAllowed": ["student", "parent", "teacher", "staff"],
                "props": {
                    "columns": 4
                }
            },
            {
                "id": "upcoming_events",
                "type": "AnnouncementFeed",
                "title": "Upcoming Events & Notices",
                "order": 4,
                "visible": true,
                "rolesAllowed": ["student", "parent", "teacher", "staff", "school_admin"],
                "props": {
                    "maxItems": 5
                }
            }
        ]
    }'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    published_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Configuration Versions (Enables instant rollback and complete audit trail)
CREATE TABLE IF NOT EXISTS public.configuration_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    configuration_id UUID NOT NULL REFERENCES public.app_configurations(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    layout_data JSONB NOT NULL,
    published_by UUID REFERENCES public.profiles(id),
    change_summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_config_version UNIQUE (configuration_id, version)
);

-- 3. Dynamic Feature Flags (Toggle modules per plan or specific school)
CREATE TABLE IF NOT EXISTS public.feature_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE, -- NULL for platform default
    feature_key VARCHAR(100) NOT NULL,
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    rules JSONB DEFAULT '{}'::jsonb,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_school_feature_key UNIQUE (school_id, feature_key)
);

-- 4. App Versions & Force Update Policy
CREATE TABLE IF NOT EXISTS public.app_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform VARCHAR(20) NOT NULL CHECK (platform IN ('android', 'ios', 'web')),
    latest_version VARCHAR(30) NOT NULL,
    min_supported_version VARCHAR(30) NOT NULL,
    force_update BOOLEAN NOT NULL DEFAULT false,
    update_title VARCHAR(150) NOT NULL DEFAULT 'Update Available',
    update_message TEXT NOT NULL DEFAULT 'A new version of EDUVANTA is available. Please update to continue.',
    store_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_platform_version UNIQUE (platform)
);

-- 5. Maintenance Mode Settings
CREATE TABLE IF NOT EXISTS public.maintenance_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE, -- NULL for entire SaaS platform
    is_maintenance_mode BOOLEAN NOT NULL DEFAULT false,
    title VARCHAR(150) NOT NULL DEFAULT 'Scheduled System Maintenance',
    message TEXT NOT NULL DEFAULT 'EDUVANTA is undergoing scheduled maintenance to improve your experience. We will be back shortly.',
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    allowed_roles school_role_enum[] DEFAULT ARRAY['school_owner', 'school_admin']::school_role_enum[],
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
