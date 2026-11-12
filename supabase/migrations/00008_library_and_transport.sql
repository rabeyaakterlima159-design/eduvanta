-- ==============================================================================
-- 00008_library_and_transport.sql
-- Migration: Digital Library Management & Campus Transport Fleet System
-- ==============================================================================

-- 1. Library Books Catalog
CREATE TABLE IF NOT EXISTS public.library_books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(50),
    category VARCHAR(100) NOT NULL,
    publisher VARCHAR(150),
    edition VARCHAR(50),
    shelf_location VARCHAR(50),
    total_copies INTEGER NOT NULL DEFAULT 1,
    available_copies INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_books_school ON public.library_books(school_id);
CREATE INDEX IF NOT EXISTS idx_books_title ON public.library_books(title);

-- 2. Library Issues and Returns
CREATE TABLE IF NOT EXISTS public.library_issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES public.library_books(id) ON DELETE CASCADE,
    borrower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    return_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'issued' CHECK (status IN ('issued', 'returned', 'overdue', 'lost')),
    fine_amount NUMERIC(8, 2) DEFAULT 0.00,
    issued_by UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_library_borrower ON public.library_issues(borrower_id);

-- 3. Transport Vehicles
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    vehicle_number VARCHAR(50) NOT NULL, -- e.g. "Dhaka Metro GA-11-2345"
    model VARCHAR(100) NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 30,
    driver_name VARCHAR(150) NOT NULL,
    driver_phone VARCHAR(30) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_school_vehicle_number UNIQUE (school_id, vehicle_number)
);

-- 4. Transport Routes
CREATE TABLE IF NOT EXISTS public.routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL, -- e.g. "Route 1: Uttara - Banani"
    start_location VARCHAR(150) NOT NULL,
    end_location VARCHAR(150) NOT NULL,
    stops JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{ name, time, fee }]
    monthly_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Student Transport Assignments
CREATE TABLE IF NOT EXISTS public.transport_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    route_id UUID NOT NULL REFERENCES public.routes(id) ON DELETE CASCADE,
    pickup_stop VARCHAR(100) NOT NULL,
    dropoff_stop VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'canceled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_student_active_transport UNIQUE (school_id, student_id, route_id)
);
