-- ==============================================================================
-- 00005_examinations_and_grades.sql
-- Migration: Examinations, Schedules, Marks Entry, Grading Scales & Results
-- ==============================================================================

-- 1. Grading Systems (Configurable per school)
CREATE TABLE IF NOT EXISTS public.grading_systems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- e.g. "Standard GPA Scale"
    grade_name VARCHAR(10) NOT NULL, -- A+, A, A-, B, C, D, F
    min_percentage NUMERIC(5, 2) NOT NULL,
    max_percentage NUMERIC(5, 2) NOT NULL,
    grade_point NUMERIC(4, 2) NOT NULL,
    remarks VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_school_grade UNIQUE (school_id, grade_name)
);

-- 2. Examinations
CREATE TABLE IF NOT EXISTS public.examinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES public.academic_sessions(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL, -- e.g., "First Term Final Exam 2026"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'published')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_exams_school ON public.examinations(school_id);

-- 3. Exam Subjects (Schedule per class and subject)
CREATE TABLE IF NOT EXISTS public.exam_subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    exam_id UUID NOT NULL REFERENCES public.examinations(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    exam_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_marks NUMERIC(6, 2) NOT NULL DEFAULT 100.00,
    pass_marks NUMERIC(6, 2) NOT NULL DEFAULT 33.00,
    room_number VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_exam_class_subject UNIQUE (exam_id, class_id, subject_id)
);

-- 4. Exam Marks (Individual student marks entry)
CREATE TABLE IF NOT EXISTS public.exam_marks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    exam_subject_id UUID NOT NULL REFERENCES public.exam_subjects(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    obtained_marks NUMERIC(6, 2) NOT NULL,
    letter_grade VARCHAR(10),
    gpa NUMERIC(4, 2),
    remarks TEXT,
    evaluated_by UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_student_exam_subject UNIQUE (exam_subject_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_marks_student ON public.exam_marks(student_id);

-- 5. Consolidated Exam Results
CREATE TABLE IF NOT EXISTS public.exam_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    exam_id UUID NOT NULL REFERENCES public.examinations(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
    total_obtained_marks NUMERIC(8, 2) NOT NULL,
    total_max_marks NUMERIC(8, 2) NOT NULL,
    gpa NUMERIC(4, 2),
    final_grade VARCHAR(10),
    class_rank INTEGER,
    status VARCHAR(20) NOT NULL DEFAULT 'passed' CHECK (status IN ('passed', 'failed', 'withheld')),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_student_final_result UNIQUE (exam_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_results_student ON public.exam_results(student_id);
CREATE INDEX IF NOT EXISTS idx_results_section ON public.exam_results(section_id);
