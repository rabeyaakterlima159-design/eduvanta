-- ==============================================================================
-- tenant_isolation_test.sql
-- Automated PostgreSQL Test Suite: Multi-Tenant Isolation & RLS Verification
-- ==============================================================================

BEGIN;

-- Create pgTAP or test harnesses
DO $$
DECLARE
    school_a_id UUID := '22222222-2222-2222-2222-222222222201';
    school_b_id UUID := '22222222-2222-2222-2222-222222222202';
    test_user_a UUID := uuid_generate_v4();
    test_user_b UUID := uuid_generate_v4();
    visible_count INTEGER;
BEGIN
    RAISE NOTICE '=== EDUVANTA TEST SUITE: MULTI-TENANT ISOLATION ===';

    -- 1. Verify RLS is enabled on all critical tables
    ASSERT (
        SELECT relrowsecurity FROM pg_class WHERE relname = 'schools'
    ) = true, 'RLS must be enabled on schools';

    ASSERT (
        SELECT relrowsecurity FROM pg_class WHERE relname = 'student_enrollments'
    ) = true, 'RLS must be enabled on student_enrollments';

    ASSERT (
        SELECT relrowsecurity FROM pg_class WHERE relname = 'attendance_records'
    ) = true, 'RLS must be enabled on attendance_records';

    ASSERT (
        SELECT relrowsecurity FROM pg_class WHERE relname = 'exam_marks'
    ) = true, 'RLS must be enabled on exam_marks';

    ASSERT (
        SELECT relrowsecurity FROM pg_class WHERE relname = 'student_fees'
    ) = true, 'RLS must be enabled on student_fees';

    RAISE NOTICE '[TEST 1 PASSED]: All core tenant tables have Row Level Security enabled.';

    -- 2. Verify Helper Functions
    -- is_super_admin() with empty auth context must return false
    ASSERT public.is_super_admin() = false, 'Unauthenticated session must not be super_admin';
    RAISE NOTICE '[TEST 2 PASSED]: Unauthenticated session is safely rejected by is_super_admin().';

    -- 3. Verify School Membership Checks
    ASSERT public.is_member_of_school(school_a_id) = false, 'Unauthenticated user cannot claim membership to School A';
    RAISE NOTICE '[TEST 3 PASSED]: Cross-school membership properly isolated for unauthenticated context.';

    -- 4. Verify Parent-Child Relationship Helper
    ASSERT public.is_parent_of(uuid_generate_v4()) = false, 'Arbitrary student access rejected for non-parents';
    RAISE NOTICE '[TEST 4 PASSED]: is_parent_of() correctly restricts access.';

    RAISE NOTICE '=== ALL AUTOMATED TENANT ISOLATION TESTS PASSED SUCCESSFULLY ===';
END $$;

ROLLBACK;
