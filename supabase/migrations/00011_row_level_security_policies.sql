-- ==============================================================================
-- 00011_row_level_security_policies.sql
-- Migration: Row Level Security (RLS) Policies for Multi-Tenant Isolation
-- ==============================================================================

-- Enable RLS across all tables
ALTER TABLE public.platform_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_student_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_activity ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.academic_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetables ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.grading_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.examinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_results ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.fee_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_assignments ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.app_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuration_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_settings ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 1. PLATFORM LEVEL POLICIES
-- ------------------------------------------------------------------------------

-- Platform Admins table: only platform operators can read/write
CREATE POLICY "platform_admins_policy" ON public.platform_admins
    FOR ALL USING (public.is_super_admin());

-- Subscription Plans: Public can view active plans; super admin can manage
CREATE POLICY "subscription_plans_read" ON public.subscription_plans
    FOR SELECT USING (is_active = true OR public.is_super_admin());

CREATE POLICY "subscription_plans_manage" ON public.subscription_plans
    FOR ALL USING (public.is_super_admin());

-- Platform Settings: Super admins only
CREATE POLICY "platform_settings_policy" ON public.platform_settings
    FOR ALL USING (public.is_super_admin());

-- Audit logs: Super admin views all; School admin views their school's logs
CREATE POLICY "audit_logs_read" ON public.audit_logs
    FOR SELECT USING (
        public.is_super_admin()
        OR (school_id IS NOT NULL AND public.has_school_role(school_id, ARRAY['school_owner', 'school_admin']::school_role_enum[]))
    );

CREATE POLICY "audit_logs_insert" ON public.audit_logs
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ------------------------------------------------------------------------------
-- 2. SCHOOLS & TENANTS POLICIES
-- ------------------------------------------------------------------------------

CREATE POLICY "schools_select" ON public.schools
    FOR SELECT USING (
        public.is_super_admin()
        OR status = 'active'
    );

CREATE POLICY "schools_manage" ON public.schools
    FOR ALL USING (
        public.is_super_admin()
        OR public.has_school_role(id, ARRAY['school_owner', 'school_admin']::school_role_enum[])
    );

CREATE POLICY "school_settings_select" ON public.school_settings
    FOR SELECT USING (
        public.is_super_admin()
        OR public.is_member_of_school(school_id)
        OR true -- Public branding readable for login/portal
    );

CREATE POLICY "school_settings_update" ON public.school_settings
    FOR UPDATE USING (
        public.is_super_admin()
        OR public.has_school_role(school_id, ARRAY['school_owner', 'school_admin']::school_role_enum[])
    );

-- ------------------------------------------------------------------------------
-- 3. PROFILES & MEMBERSHIPS POLICIES
-- ------------------------------------------------------------------------------

CREATE POLICY "profiles_select" ON public.profiles
    FOR SELECT USING (
        id = auth.uid()
        OR public.is_super_admin()
        OR EXISTS (
            SELECT 1 FROM public.school_memberships m1
            JOIN public.school_memberships m2 ON m1.school_id = m2.school_id
            WHERE m1.user_id = auth.uid() AND m2.user_id = profiles.id
        )
    );

CREATE POLICY "profiles_update" ON public.profiles
    FOR UPDATE USING (id = auth.uid() OR public.is_super_admin());

CREATE POLICY "memberships_select" ON public.school_memberships
    FOR SELECT USING (
        user_id = auth.uid()
        OR public.is_super_admin()
        OR public.has_school_role(school_id, ARRAY['school_owner', 'school_admin', 'principal', 'teacher', 'staff']::school_role_enum[])
    );

CREATE POLICY "memberships_manage" ON public.school_memberships
    FOR ALL USING (
        public.is_super_admin()
        OR public.has_school_role(school_id, ARRAY['school_owner', 'school_admin']::school_role_enum[])
    );

CREATE POLICY "parent_student_links_select" ON public.parent_student_links
    FOR SELECT USING (
        parent_id = auth.uid()
        OR student_id = auth.uid()
        OR public.is_super_admin()
        OR public.has_school_role(school_id, ARRAY['school_owner', 'school_admin', 'principal', 'teacher']::school_role_enum[])
    );

CREATE POLICY "user_devices_policy" ON public.user_devices
    FOR ALL USING (user_id = auth.uid() OR public.is_super_admin());

-- ------------------------------------------------------------------------------
-- 4. ACADEMIC & TIMETABLE POLICIES (TENANT RESTRICTED)
-- ------------------------------------------------------------------------------

CREATE POLICY "academic_sessions_select" ON public.academic_sessions
    FOR SELECT USING (public.is_member_of_school(school_id));

CREATE POLICY "academic_sessions_manage" ON public.academic_sessions
    FOR ALL USING (public.has_school_role(school_id, ARRAY['school_owner', 'school_admin', 'principal']::school_role_enum[]));

CREATE POLICY "classes_select" ON public.classes
    FOR SELECT USING (public.is_member_of_school(school_id));

CREATE POLICY "classes_manage" ON public.classes
    FOR ALL USING (public.has_school_role(school_id, ARRAY['school_owner', 'school_admin', 'principal']::school_role_enum[]));

CREATE POLICY "sections_select" ON public.sections
    FOR SELECT USING (public.is_member_of_school(school_id));

CREATE POLICY "sections_manage" ON public.sections
    FOR ALL USING (public.has_school_role(school_id, ARRAY['school_owner', 'school_admin', 'principal']::school_role_enum[]));

CREATE POLICY "subjects_select" ON public.subjects
    FOR SELECT USING (public.is_member_of_school(school_id));

CREATE POLICY "subjects_manage" ON public.subjects
    FOR ALL USING (public.has_school_role(school_id, ARRAY['school_owner', 'school_admin', 'principal']::school_role_enum[]));

CREATE POLICY "student_enrollments_select" ON public.student_enrollments
    FOR SELECT USING (
        student_id = auth.uid()
        OR public.is_parent_of(student_id)
        OR public.has_school_role(school_id, ARRAY['school_owner', 'school_admin', 'principal', 'teacher', 'staff']::school_role_enum[])
    );

CREATE POLICY "student_enrollments_manage" ON public.student_enrollments
    FOR ALL USING (public.has_school_role(school_id, ARRAY['school_owner', 'school_admin', 'principal']::school_role_enum[]));

CREATE POLICY "timetables_select" ON public.timetables
    FOR SELECT USING (public.is_member_of_school(school_id));

CREATE POLICY "timetables_manage" ON public.timetables
    FOR ALL USING (public.has_school_role(school_id, ARRAY['school_owner', 'school_admin', 'principal']::school_role_enum[]));

-- ------------------------------------------------------------------------------
-- 5. ATTENDANCE POLICIES
-- ------------------------------------------------------------------------------

CREATE POLICY "attendance_records_select" ON public.attendance_records
    FOR SELECT USING (
        student_id = auth.uid()
        OR public.is_parent_of(student_id)
        OR public.has_school_role(school_id, ARRAY['school_owner', 'school_admin', 'principal', 'teacher', 'class_teacher']::school_role_enum[])
    );

CREATE POLICY "attendance_records_manage" ON public.attendance_records
    FOR ALL USING (
        public.has_school_role(school_id, ARRAY['school_owner', 'school_admin', 'principal', 'teacher', 'class_teacher']::school_role_enum[])
    );

CREATE POLICY "leave_requests_select" ON public.leave_requests
    FOR SELECT USING (
        user_id = auth.uid()
        OR public.is_parent_of(user_id)
        OR public.has_school_role(school_id, ARRAY['school_owner', 'school_admin', 'principal', 'teacher']::school_role_enum[])
    );

CREATE POLICY "leave_requests_insert" ON public.leave_requests
    FOR INSERT WITH CHECK (user_id = auth.uid() OR public.is_parent_of(user_id));

CREATE POLICY "leave_requests_manage" ON public.leave_requests
    FOR UPDATE USING (
        public.has_school_role(school_id, ARRAY['school_owner', 'school_admin', 'principal']::school_role_enum[])
    );

-- ------------------------------------------------------------------------------
-- 6. EXAMINATIONS & MARKS POLICIES
-- ------------------------------------------------------------------------------

CREATE POLICY "examinations_select" ON public.examinations
    FOR SELECT USING (public.is_member_of_school(school_id));

CREATE POLICY "examinations_manage" ON public.examinations
    FOR ALL USING (public.has_school_role(school_id, ARRAY['school_owner', 'school_admin', 'principal']::school_role_enum[]));

CREATE POLICY "exam_marks_select" ON public.exam_marks
    FOR SELECT USING (
        student_id = auth.uid()
        OR public.is_parent_of(student_id)
        OR public.has_school_role(school_id, ARRAY['school_owner', 'school_admin', 'principal', 'teacher']::school_role_enum[])
    );

CREATE POLICY "exam_marks_manage" ON public.exam_marks
    FOR ALL USING (
        public.has_school_role(school_id, ARRAY['school_owner', 'school_admin', 'principal', 'teacher']::school_role_enum[])
    );

CREATE POLICY "exam_results_select" ON public.exam_results
    FOR SELECT USING (
        student_id = auth.uid()
        OR public.is_parent_of(student_id)
        OR public.has_school_role(school_id, ARRAY['school_owner', 'school_admin', 'principal', 'teacher']::school_role_enum[])
    );

-- ------------------------------------------------------------------------------
-- 7. ASSIGNMENTS & STUDY MATERIALS POLICIES
-- ------------------------------------------------------------------------------

CREATE POLICY "assignments_select" ON public.assignments
    FOR SELECT USING (public.is_member_of_school(school_id));

CREATE POLICY "assignments_manage" ON public.assignments
    FOR ALL USING (public.has_school_role(school_id, ARRAY['school_owner', 'school_admin', 'principal', 'teacher']::school_role_enum[]));

CREATE POLICY "submissions_select" ON public.assignment_submissions
    FOR SELECT USING (
        student_id = auth.uid()
        OR public.is_parent_of(student_id)
        OR public.has_school_role(school_id, ARRAY['school_owner', 'school_admin', 'principal', 'teacher']::school_role_enum[])
    );

CREATE POLICY "submissions_student_insert" ON public.assignment_submissions
    FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "submissions_grade_manage" ON public.assignment_submissions
    FOR UPDATE USING (
        student_id = auth.uid()
        OR public.has_school_role(school_id, ARRAY['school_owner', 'school_admin', 'principal', 'teacher']::school_role_enum[])
    );

CREATE POLICY "study_materials_select" ON public.study_materials
    FOR SELECT USING (public.is_member_of_school(school_id));

CREATE POLICY "study_materials_manage" ON public.study_materials
    FOR ALL USING (public.has_school_role(school_id, ARRAY['school_owner', 'school_admin', 'principal', 'teacher']::school_role_enum[]));

-- ------------------------------------------------------------------------------
-- 8. FINANCE & PAYMENTS POLICIES
-- ------------------------------------------------------------------------------

CREATE POLICY "fee_categories_select" ON public.fee_categories
    FOR SELECT USING (public.is_member_of_school(school_id));

CREATE POLICY "student_fees_select" ON public.student_fees
    FOR SELECT USING (
        student_id = auth.uid()
        OR public.is_parent_of(student_id)
        OR public.has_school_role(school_id, ARRAY['school_owner', 'school_admin', 'principal', 'accountant']::school_role_enum[])
    );

CREATE POLICY "student_fees_manage" ON public.student_fees
    FOR ALL USING (public.has_school_role(school_id, ARRAY['school_owner', 'school_admin', 'accountant']::school_role_enum[]));

CREATE POLICY "transactions_select" ON public.payment_transactions
    FOR SELECT USING (
        payer_id = auth.uid()
        OR public.has_school_role(school_id, ARRAY['school_owner', 'school_admin', 'accountant']::school_role_enum[])
    );

CREATE POLICY "receipts_select" ON public.receipts
    FOR SELECT USING (
        issued_to_student_id = auth.uid()
        OR public.is_parent_of(issued_to_student_id)
        OR public.has_school_role(school_id, ARRAY['school_owner', 'school_admin', 'accountant']::school_role_enum[])
    );

-- ------------------------------------------------------------------------------
-- 9. SERVER-DRIVEN UI POLICIES
-- ------------------------------------------------------------------------------

-- App configurations: Anyone can select active configs (anonymous/auth for rendering)
CREATE POLICY "app_configurations_select" ON public.app_configurations
    FOR SELECT USING (is_active = true OR public.is_super_admin());

CREATE POLICY "app_configurations_manage" ON public.app_configurations
    FOR ALL USING (
        public.is_super_admin()
        OR (school_id IS NOT NULL AND public.has_school_role(school_id, ARRAY['school_owner', 'school_admin']::school_role_enum[]))
    );

CREATE POLICY "feature_flags_select" ON public.feature_flags
    FOR SELECT USING (true);

CREATE POLICY "feature_flags_manage" ON public.feature_flags
    FOR ALL USING (public.is_super_admin());

CREATE POLICY "app_versions_select" ON public.app_versions
    FOR SELECT USING (true);

CREATE POLICY "app_versions_manage" ON public.app_versions
    FOR ALL USING (public.is_super_admin());
