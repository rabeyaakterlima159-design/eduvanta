-- ==============================================================================
-- 00006_assignments_and_materials.sql
-- Migration: Homework Assignments, Student Submissions & Digital Study Materials
-- ==============================================================================

-- 1. Assignments
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES public.academic_sessions(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    attachment_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
    due_date TIMESTAMPTZ NOT NULL,
    total_points NUMERIC(6, 2) NOT NULL DEFAULT 100.00,
    allow_late_submission BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_assignments_section ON public.assignments(section_id);
CREATE INDEX IF NOT EXISTS idx_assignments_due_date ON public.assignments(due_date);

-- 2. Student Submissions
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    submission_text TEXT,
    attachment_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    status VARCHAR(30) NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'late', 'graded', 'resubmit_requested')),
    obtained_points NUMERIC(6, 2),
    feedback TEXT,
    graded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    graded_at TIMESTAMPTZ,
    CONSTRAINT uq_student_assignment_submission UNIQUE (assignment_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON public.assignment_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON public.assignment_submissions(student_id);

-- 3. Digital Study Materials
CREATE TABLE IF NOT EXISTS public.study_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- pdf, docx, mp4, pptx
    file_size_bytes BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_materials_class_subject ON public.study_materials(class_id, subject_id);
