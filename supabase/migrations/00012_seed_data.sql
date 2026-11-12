-- ==============================================================================
-- 00012_seed_data.sql
-- Migration: Production Starter Seed Data for Plans, Tenants, SDUI & Academics
-- ==============================================================================

-- 1. Subscription Plans
INSERT INTO public.subscription_plans (id, name, tier, description, price_monthly, price_annual, max_students, max_teachers, max_storage_gb, features, is_active)
VALUES
    ('11111111-1111-1111-1111-111111111101', 'Free Starter', 'free', 'Ideal for pilot campuses and testing the EDUVANTA ecosystem', 0.00, 0.00, 100, 10, 2, '["attendance", "student_portal", "basic_reports"]'::jsonb, true),
    ('11111111-1111-1111-1111-111111111102', 'Basic Campus', 'basic', 'Standard schools managing academics, fees, and communication', 2500.00, 25000.00, 500, 35, 20, '["attendance", "student_portal", "teacher_portal", "fees", "notices", "sms_alerts"]'::jsonb, true),
    ('11111111-1111-1111-1111-111111111103', 'Pro Campus', 'pro', 'Comprehensive solution with online payments, library, and examinations', 6500.00, 65000.00, 2500, 150, 100, '["all_basic_features", "online_payments", "library", "transport", "sdui_customizer", "digital_receipts", "advanced_analytics"]'::jsonb, true),
    ('11111111-1111-1111-1111-111111111104', 'Enterprise Multi-Branch', 'enterprise', 'Full ecosystem with unlimited students, priority support, and custom branding', 15000.00, 150000.00, 10000, 500, 500, '["all_pro_features", "custom_domains", "biometric_sync", "dedicated_database", "sla_guarantee", "super_admin_api"]'::jsonb, true)
ON CONFLICT (tier) DO UPDATE SET
    price_monthly = EXCLUDED.price_monthly,
    price_annual = EXCLUDED.price_annual,
    features = EXCLUDED.features;

-- 2. Seed Schools (Tenants)
INSERT INTO public.schools (id, code, name, slug, email, phone, website, city, country, status, subscription_plan_id, subscription_expires_at)
VALUES
    ('22222222-2222-2222-2222-222222222201', 'SCH-DPIS-01', 'Dhaka Premier International School', 'dhaka-premier', 'admin@dhakapremier.edu.bd', '+8801711000001', 'https://dhakapremier.edu.bd', 'Dhaka', 'Bangladesh', 'active', '11111111-1111-1111-1111-111111111103', timezone('utc'::text, now() + interval '365 days')),
    ('22222222-2222-2222-2222-222222222202', 'SCH-CMC-02', 'Chittagong Model College', 'chittagong-model', 'info@cmc.edu.bd', '+8801811000002', 'https://cmc.edu.bd', 'Chittagong', 'Bangladesh', 'active', '11111111-1111-1111-1111-111111111102', timezone('utc'::text, now() + interval '180 days')),
    ('22222222-2222-2222-2222-222222222203', 'SCH-SGA-03', 'Sylhet Global Academy', 'sylhet-academy', 'contact@sylhetglobal.edu.bd', '+8801911000003', 'https://sylhetglobal.edu.bd', 'Sylhet', 'Bangladesh', 'active', '11111111-1111-1111-1111-111111111101', timezone('utc'::text, now() + interval '30 days'))
ON CONFLICT (code) DO NOTHING;

-- 3. School Settings & Brand Colors
INSERT INTO public.school_settings (school_id, timezone, currency, currency_symbol, branding)
VALUES
    ('22222222-2222-2222-2222-222222222201', 'Asia/Dhaka', 'BDT', '৳', '{
        "primaryColor": "#102A56",
        "secondaryColor": "#2563EB",
        "accentColor": "#F5B82E",
        "motto": "One Platform. Every Campus. Smarter Education."
    }'::jsonb),
    ('22222222-2222-2222-2222-222222222202', 'Asia/Dhaka', 'BDT', '৳', '{
        "primaryColor": "#0F3D3E",
        "secondaryColor": "#100F0F",
        "accentColor": "#E2D786",
        "motto": "Discipline, Knowledge, Excellence"
    }'::jsonb),
    ('22222222-2222-2222-2222-222222222203', 'Asia/Dhaka', 'BDT', '৳', '{
        "primaryColor": "#1B2A4A",
        "secondaryColor": "#3B82F6",
        "accentColor": "#F59E0B",
        "motto": "Inspiring Future Leaders"
    }'::jsonb)
ON CONFLICT (school_id) DO NOTHING;

-- 4. Global App Version Policy
INSERT INTO public.app_versions (platform, latest_version, min_supported_version, force_update, update_title, update_message, store_url)
VALUES
    ('android', '1.0.0', '1.0.0', false, 'EDUVANTA Android Update', 'Experience the latest smart campus features and performance improvements.', 'https://play.google.com/store/apps/details?id=com.eduvanta.app'),
    ('ios', '1.0.0', '1.0.0', false, 'EDUVANTA iOS Update', 'Update to the latest version for improved attendance and grade cards.', 'https://apps.apple.com/app/eduvanta/id123456789'),
    ('web', '1.0.0', '1.0.0', false, 'Web Portal Version', 'Latest portal release deployed.', 'https://eduvanta.com')
ON CONFLICT (platform) DO UPDATE SET
    latest_version = EXCLUDED.latest_version,
    min_supported_version = EXCLUDED.min_supported_version;

-- 5. Default Server-Driven UI Configuration
INSERT INTO public.app_configurations (id, school_id, role_target, version, is_active, layout_data)
VALUES (
    '33333333-3333-3333-3333-333333333301',
    NULL, -- Global default
    NULL, -- All roles
    1,
    true,
    '{
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
                "title": "My Overview",
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
                    "columns": 4,
                    "items": [
                        { "id": "classes", "label": "My Classes", "icon": "book-open", "route": "/classes", "color": "#2563EB" },
                        { "id": "attendance", "label": "Attendance", "icon": "calendar-check", "route": "/attendance", "color": "#F59E0B" },
                        { "id": "results", "label": "Results", "icon": "award", "route": "/results", "color": "#3B82F6" },
                        { "id": "assignments", "label": "Assignments", "icon": "file-text", "route": "/assignments", "color": "#EC4899" },
                        { "id": "library", "label": "Library", "icon": "book", "route": "/library", "color": "#8B5CF6" },
                        { "id": "fees", "label": "Fee Status", "icon": "credit-card", "route": "/fees", "color": "#10B981" },
                        { "id": "notices", "label": "Notifications", "icon": "bell", "route": "/notices", "color": "#EF4444" },
                        { "id": "more", "label": "More", "icon": "grid", "route": "/more", "color": "#6B7280" }
                    ]
                }
            },
            {
                "id": "upcoming_events",
                "type": "AnnouncementFeed",
                "title": "Upcoming Events",
                "order": 4,
                "visible": true,
                "rolesAllowed": ["student", "parent", "teacher", "staff", "school_admin"],
                "props": {
                    "maxItems": 4
                }
            }
        ]
    }'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 6. Academic Sessions
INSERT INTO public.academic_sessions (id, school_id, name, start_date, end_date, is_current)
VALUES
    ('44444444-4444-4444-4444-444444444401', '22222222-2222-2222-2222-222222222201', '2026-2027 Academic Year', '2026-01-01', '2026-12-31', true),
    ('44444444-4444-4444-4444-444444444402', '22222222-2222-2222-2222-222222222202', '2026-2027 Session', '2026-01-01', '2026-12-31', true)
ON CONFLICT (school_id, name) DO NOTHING;

-- 7. Classes & Sections for Dhaka Premier International School
INSERT INTO public.classes (id, school_id, name, numeric_level)
VALUES
    ('55555555-5555-5555-5555-555555555501', '22222222-2222-2222-2222-222222222201', 'Class 10', 10),
    ('55555555-5555-5555-5555-555555555502', '22222222-2222-2222-2222-222222222201', 'Class 9', 9),
    ('55555555-5555-5555-5555-555555555503', '22222222-2222-2222-2222-222222222201', 'Class 8', 8)
ON CONFLICT (school_id, name) DO NOTHING;

INSERT INTO public.sections (id, school_id, class_id, name, capacity, room_number)
VALUES
    ('66666666-6666-6666-6666-666666666601', '22222222-2222-2222-2222-222222222201', '55555555-5555-5555-5555-555555555501', 'Section A (Science)', 40, 'Room 301'),
    ('66666666-6666-6666-6666-666666666602', '22222222-2222-2222-2222-222222222201', '55555555-5555-5555-5555-555555555501', 'Section B (Commerce)', 40, 'Room 302')
ON CONFLICT (class_id, name) DO NOTHING;

-- 8. Subjects
INSERT INTO public.subjects (id, school_id, name, code, is_elective, credits, pass_marks, total_marks)
VALUES
    ('77777777-7777-7777-7777-777777777701', '22222222-2222-2222-2222-222222222201', 'Higher Mathematics', 'MATH-101', false, 4.0, 33.0, 100.0),
    ('77777777-7777-7777-7777-777777777702', '22222222-2222-2222-2222-222222222201', 'Physics', 'PHY-102', false, 3.0, 33.0, 100.0),
    ('77777777-7777-7777-7777-777777777703', '22222222-2222-2222-2222-222222222201', 'Chemistry', 'CHEM-103', false, 3.0, 33.0, 100.0),
    ('77777777-7777-7777-7777-777777777704', '22222222-2222-2222-2222-222222222201', 'English Literature', 'ENG-104', false, 3.0, 33.0, 100.0),
    ('77777777-7777-7777-7777-777777777705', '22222222-2222-2222-2222-222222222201', 'Biology', 'BIO-105', true, 3.0, 33.0, 100.0)
ON CONFLICT (school_id, code) DO NOTHING;

-- 9. Standard GPA 5.0 Grading System
INSERT INTO public.grading_systems (school_id, name, grade_name, min_percentage, max_percentage, grade_point, remarks)
VALUES
    ('22222222-2222-2222-2222-222222222201', 'National Curriculum GPA Scale', 'A+', 80.00, 100.00, 5.00, 'Outstanding'),
    ('22222222-2222-2222-2222-222222222201', 'National Curriculum GPA Scale', 'A', 70.00, 79.99, 4.00, 'Excellent'),
    ('22222222-2222-2222-2222-222222222201', 'National Curriculum GPA Scale', 'A-', 60.00, 69.99, 3.50, 'Very Good'),
    ('22222222-2222-2222-2222-222222222201', 'National Curriculum GPA Scale', 'B', 50.00, 59.99, 3.00, 'Good'),
    ('22222222-2222-2222-2222-222222222201', 'National Curriculum GPA Scale', 'C', 40.00, 49.99, 2.00, 'Satisfactory'),
    ('22222222-2222-2222-2222-222222222201', 'National Curriculum GPA Scale', 'D', 33.00, 39.99, 1.00, 'Pass'),
    ('22222222-2222-2222-2222-222222222201', 'National Curriculum GPA Scale', 'F', 0.00, 32.99, 0.00, 'Fail')
ON CONFLICT (school_id, grade_name) DO NOTHING;

-- 10. Fee Categories
INSERT INTO public.fee_categories (id, school_id, name, description, is_recurring)
VALUES
    ('88888888-8888-8888-8888-888888888801', '22222222-2222-2222-2222-222222222201', 'Monthly Tuition Fee', 'Regular monthly academic tuition charges', true),
    ('88888888-8888-8888-8888-888888888802', '22222222-2222-2222-2222-222222222201', 'Examination Fee', 'Term examination registration and materials', false),
    ('88888888-8888-8888-8888-888888888803', '22222222-2222-2222-2222-222222222201', 'Campus Transport Fee', 'Monthly school bus transportation charge', true)
ON CONFLICT (school_id, name) DO NOTHING;
