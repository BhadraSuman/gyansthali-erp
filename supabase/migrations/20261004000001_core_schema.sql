-- Migration: 20261004000001_core_schema.sql
-- Description: Core tables, indexes, checks, and foreign keys for Gyan Sthali ERP

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Roles Enum & Profiles
CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'parent', 'student', 'accountant');

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'parent',
    full_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for phone and role lookups
CREATE INDEX idx_profiles_phone ON profiles(phone);
CREATE INDEX idx_profiles_role ON profiles(role);

-- 3. Academic Years
CREATE TABLE academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE, -- e.g. '2024-2025'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Classes & Sections
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL, -- e.g. 'Class 5', 'Class 6', 'LKG'
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g. 'A', 'B'
    room_number TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_class_section UNIQUE (class_id, name)
);

CREATE INDEX idx_sections_class_id ON sections(class_id);

-- 5. Subjects
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g. 'Mathematics', 'Hindi', 'Science'
    code TEXT NOT NULL, -- e.g. 'MATH-5', 'HIN-5'
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_class_subject UNIQUE (class_id, code)
);

CREATE INDEX idx_subjects_class_id ON subjects(class_id);

-- 6. Staff & Faculty
CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    employee_id TEXT NOT NULL UNIQUE,
    designation TEXT NOT NULL,
    qualification TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_staff_profile_id ON staff(profile_id);

-- Class Teacher Assignment
CREATE TABLE class_teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_section_academic_year UNIQUE (section_id, academic_year_id)
);

CREATE INDEX idx_class_teachers_staff_id ON class_teachers(staff_id);
CREATE INDEX idx_class_teachers_section_id ON class_teachers(section_id);

-- 7. Students & Guardians
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    admission_number TEXT NOT NULL UNIQUE, -- e.g. 'GSPS-2021-482'
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    first_name_hi TEXT,
    last_name_hi TEXT,
    roll_number INTEGER NOT NULL,
    section_id UUID NOT NULL REFERENCES sections(id) ON DELETE RESTRICT,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE RESTRICT,
    date_of_birth DATE NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    blood_group TEXT,
    category TEXT NOT NULL DEFAULT 'GEN' CHECK (category IN ('GEN', 'OBC', 'SC', 'ST', 'EWS')),
    is_rte BOOLEAN NOT NULL DEFAULT false,
    bus_route TEXT,
    emergency_phone TEXT NOT NULL,
    address TEXT,
    avatar_url TEXT,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_section_roll_number UNIQUE (section_id, roll_number)
);

CREATE INDEX idx_students_section_id ON students(section_id);
CREATE INDEX idx_students_academic_year_id ON students(academic_year_id);
CREATE INDEX idx_students_profile_id ON students(profile_id);
CREATE INDEX idx_students_admission_number ON students(admission_number);

CREATE TABLE guardians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    relation TEXT NOT NULL CHECK (relation IN ('father', 'mother', 'guardian')),
    phone TEXT NOT NULL,
    email TEXT,
    occupation TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_guardians_profile_id ON guardians(profile_id);
CREATE INDEX idx_guardians_phone ON guardians(phone);

CREATE TABLE student_guardians (
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    guardian_id UUID NOT NULL REFERENCES guardians(id) ON DELETE CASCADE,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    PRIMARY KEY (student_id, guardian_id)
);

CREATE INDEX idx_student_guardians_guardian_id ON student_guardians(guardian_id);

-- 8. Attendance (Priority #3)
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'half_day', 'excused');

CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    status attendance_status NOT NULL DEFAULT 'present',
    remarks TEXT,
    marked_by UUID NOT NULL REFERENCES staff(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_student_date_attendance UNIQUE (student_id, date)
);

CREATE INDEX idx_attendance_student_id ON attendance(student_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_student_date ON attendance(student_id, date);

-- 9. Notices & Announcements (Priority #1)
CREATE TYPE notice_category AS ENUM ('academic', 'exam', 'holiday', 'administrative', 'sports');
CREATE TYPE notice_priority AS ENUM ('normal', 'high', 'urgent');
CREATE TYPE notice_audience AS ENUM ('all', 'parents', 'teachers', 'students', 'class');

CREATE TABLE notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    title_hi TEXT,
    content TEXT NOT NULL,
    content_hi TEXT,
    category notice_category NOT NULL DEFAULT 'academic',
    priority notice_priority NOT NULL DEFAULT 'normal',
    audience notice_audience NOT NULL DEFAULT 'all',
    target_class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    attachment_url TEXT,
    published_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    published_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_notices_published_at ON notices(published_at DESC);
CREATE INDEX idx_notices_audience ON notices(audience);

-- 10. Homework & Assignments (Priority #5)
CREATE TABLE homework (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES staff(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    due_date DATE NOT NULL,
    attachment_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_homework_section_id ON homework(section_id);
CREATE INDEX idx_homework_due_date ON homework(due_date);

CREATE TABLE homework_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    homework_id UUID NOT NULL REFERENCES homework(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'graded')),
    submission_text TEXT,
    file_url TEXT,
    submitted_at TIMESTAMPTZ,
    marks_obtained NUMERIC(5,2),
    teacher_feedback TEXT,
    CONSTRAINT uq_homework_student UNIQUE (homework_id, student_id)
);

CREATE INDEX idx_homework_subs_student_id ON homework_submissions(student_id);

-- 11. Timetables (Priority #6)
CREATE TABLE timetables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE RESTRICT,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 6), -- 1=Monday, 6=Saturday
    period_number INTEGER NOT NULL CHECK (period_number BETWEEN 1 AND 8),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    CONSTRAINT uq_section_schedule UNIQUE (section_id, day_of_week, period_number, academic_year_id),
    CONSTRAINT uq_teacher_schedule UNIQUE (staff_id, day_of_week, period_number, academic_year_id)
);

CREATE INDEX idx_timetables_section_id ON timetables(section_id);
CREATE INDEX idx_timetables_staff_id ON timetables(staff_id);

-- 12. School Calendar & Events (Priority #7)
CREATE TABLE calendar_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    title_hi TEXT,
    description TEXT,
    event_type TEXT NOT NULL CHECK (event_type IN ('holiday', 'exam', 'celebration', 'meeting', 'sports')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    audience TEXT NOT NULL DEFAULT 'all',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_calendar_events_dates ON calendar_events(start_date, end_date);

-- 13. Fees & Invoices
CREATE TABLE fee_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    quarter TEXT NOT NULL CHECK (quarter IN ('Q1', 'Q2', 'Q3', 'Q4')),
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE RESTRICT,
    total_amount NUMERIC(10,2) NOT NULL,
    paid_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    due_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('paid', 'partial', 'pending', 'overdue')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_student_quarter_invoice UNIQUE (student_id, quarter, academic_year_id)
);

CREATE INDEX idx_fee_invoices_student_id ON fee_invoices(student_id);

CREATE TABLE fee_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES fee_invoices(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'online_razorpay', 'upi', 'cheque')),
    transaction_id TEXT,
    receipt_number TEXT NOT NULL UNIQUE,
    paid_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_fee_payments_student_id ON fee_payments(student_id);
CREATE INDEX idx_fee_payments_invoice_id ON fee_payments(invoice_id);

-- 14. Audit Log (DPDP Act Compliance & Security)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_table_record ON audit_logs(table_name, record_id);
