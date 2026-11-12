-- ==============================================================================
-- 00004_attendance_and_leaves.sql
-- Migration: Student & Staff Attendance Tracking and Leave Management
-- ==============================================================================

DO $$ BEGIN
    CREATE TYPE attendance_status_enum AS ENUM ('present', 'absent', 'late', 'half_day', 'excused');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE leave_status_enum AS ENUM ('pending', 'approved', 'rejected', 'canceled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Student Attendance Records
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES public.academic_sessions(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE, -- Null for daily attendance
    date DATE NOT NULL,
    status attendance_status_enum NOT NULL DEFAULT 'present',
    remarks TEXT,
    recorded_by UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_student_attendance_entry UNIQUE (section_id, student_id, date, subject_id)
);

CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON public.attendance_records(student_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_section_date ON public.attendance_records(section_id, date);

-- 2. Staff Attendance Records
CREATE TABLE IF NOT EXISTS public.staff_attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status attendance_status_enum NOT NULL DEFAULT 'present',
    check_in_time TIME,
    check_out_time TIME,
    remarks TEXT,
    recorded_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_staff_attendance_date UNIQUE (school_id, user_id, date)
);

-- 3. Leave Requests
CREATE TABLE IF NOT EXISTS public.leave_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    leave_type VARCHAR(50) NOT NULL CHECK (leave_type IN ('sick', 'casual', 'emergency', 'vacation', 'other')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status leave_status_enum NOT NULL DEFAULT 'pending',
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    review_remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_leave_school_user ON public.leave_requests(school_id, user_id);
CREATE INDEX IF NOT EXISTS idx_leave_status ON public.leave_requests(school_id, status);
