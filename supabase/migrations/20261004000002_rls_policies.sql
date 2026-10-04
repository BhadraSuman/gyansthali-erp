-- Migration: 20261004000002_rls_policies.sql
-- Description: Row Level Security (RLS) policies for all tables enforcing strict role-based data isolation

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper functions for RLS checks
CREATE OR REPLACE FUNCTION auth_user_role()
RETURNS user_role AS $$
    SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin');
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_guardian_of(target_student_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1
        FROM student_guardians sg
        JOIN guardians g ON sg.guardian_id = g.id
        WHERE sg.student_id = target_student_id
          AND g.profile_id = auth.uid()
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_teacher_of_section(target_section_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1
        FROM staff s
        JOIN class_teachers ct ON ct.staff_id = s.id
        WHERE s.profile_id = auth.uid()
          AND ct.section_id = target_section_id
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 1. Profiles Policies
CREATE POLICY "Users can read own profile"
    ON profiles FOR SELECT
    USING (id = auth.uid() OR is_admin());

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (id = auth.uid() OR is_admin());

CREATE POLICY "Admin can manage all profiles"
    ON profiles FOR ALL
    USING (is_admin());

-- 2. Academic Years, Classes, Sections, Subjects
CREATE POLICY "Anyone authenticated can read academic structure"
    ON academic_years FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can modify academic years"
    ON academic_years FOR ALL
    USING (is_admin());

CREATE POLICY "Anyone authenticated can read classes"
    ON classes FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can modify classes"
    ON classes FOR ALL
    USING (is_admin());

CREATE POLICY "Anyone authenticated can read sections"
    ON sections FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can modify sections"
    ON sections FOR ALL
    USING (is_admin());

CREATE POLICY "Anyone authenticated can read subjects"
    ON subjects FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can modify subjects"
    ON subjects FOR ALL
    USING (is_admin());

-- 3. Staff & Assignments
CREATE POLICY "Authenticated users can read staff"
    ON staff FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can modify staff"
    ON staff FOR ALL
    USING (is_admin());

CREATE POLICY "Authenticated users can read class teachers"
    ON class_teachers FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can modify class teachers"
    ON class_teachers FOR ALL
    USING (is_admin());

-- 4. Students Policies (CRITICAL: Parent isolation & Student isolation)
CREATE POLICY "Admin can read and manage all students"
    ON students FOR ALL
    USING (is_admin());

CREATE POLICY "Teachers can read all active students"
    ON students FOR SELECT
    USING (auth_user_role() = 'teacher');

CREATE POLICY "Parents can read ONLY their linked children"
    ON students FOR SELECT
    USING (
        auth_user_role() = 'parent' AND is_guardian_of(id)
    );

CREATE POLICY "Students can read ONLY their own record"
    ON students FOR SELECT
    USING (
        auth_user_role() = 'student' AND profile_id = auth.uid()
    );

-- 5. Guardians & Links Policies
CREATE POLICY "Admin can manage all guardians"
    ON guardians FOR ALL
    USING (is_admin());

CREATE POLICY "Parents can read and edit own guardian record"
    ON guardians FOR ALL
    USING (profile_id = auth.uid() OR is_admin());

CREATE POLICY "Teachers can read guardians"
    ON guardians FOR SELECT
    USING (auth_user_role() = 'teacher');

CREATE POLICY "Parents can read own student_guardians links"
    ON student_guardians FOR SELECT
    USING (
        is_admin() OR
        EXISTS (
            SELECT 1 FROM guardians g WHERE g.id = guardian_id AND g.profile_id = auth.uid()
        )
    );

-- 6. Attendance Policies (CRITICAL: Parents see only own child attendance)
CREATE POLICY "Admin can manage all attendance"
    ON attendance FOR ALL
    USING (is_admin());

CREATE POLICY "Teachers can read and record attendance"
    ON attendance FOR ALL
    USING (auth_user_role() = 'teacher');

CREATE POLICY "Parents can read ONLY linked child attendance"
    ON attendance FOR SELECT
    USING (
        auth_user_role() = 'parent' AND is_guardian_of(student_id)
    );

CREATE POLICY "Students can read ONLY own attendance"
    ON attendance FOR SELECT
    USING (
        auth_user_role() = 'student' AND student_id IN (SELECT id FROM students WHERE profile_id = auth.uid())
    );

-- 7. Notices Policies
CREATE POLICY "Authenticated users can view notices"
    ON notices FOR SELECT
    USING (
        audience = 'all' OR
        (audience = 'parents' AND auth_user_role() = 'parent') OR
        (audience = 'teachers' AND auth_user_role() = 'teacher') OR
        (audience = 'students' AND auth_user_role() = 'student') OR
        is_admin()
    );

CREATE POLICY "Admin and Teachers can create notices"
    ON notices FOR INSERT
    WITH CHECK (auth_user_role() IN ('admin', 'teacher'));

CREATE POLICY "Admin can modify notices"
    ON notices FOR ALL
    USING (is_admin());

-- 8. Homework & Submissions
CREATE POLICY "Teachers and Admin can manage homework"
    ON homework FOR ALL
    USING (auth_user_role() IN ('teacher', 'admin'));

CREATE POLICY "Parents and Students can read homework"
    ON homework FOR SELECT
    USING (auth_user_role() IN ('parent', 'student'));

CREATE POLICY "Students can manage own homework submissions"
    ON homework_submissions FOR ALL
    USING (
        is_admin() OR
        (auth_user_role() = 'student' AND student_id IN (SELECT id FROM students WHERE profile_id = auth.uid())) OR
        auth_user_role() = 'teacher'
    );

CREATE POLICY "Parents can view linked child homework submissions"
    ON homework_submissions FOR SELECT
    USING (
        auth_user_role() = 'parent' AND is_guardian_of(student_id)
    );

-- 9. Timetables & Calendar Events
CREATE POLICY "Authenticated users can read timetables"
    ON timetables FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage timetables"
    ON timetables FOR ALL
    USING (is_admin());

CREATE POLICY "Authenticated users can read calendar events"
    ON calendar_events FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage calendar events"
    ON calendar_events FOR ALL
    USING (is_admin());

-- 10. Fees & Invoices
CREATE POLICY "Admin and Accountant can manage all fees"
    ON fee_invoices FOR ALL
    USING (auth_user_role() IN ('admin', 'accountant'));

CREATE POLICY "Parents can view linked child fee invoices"
    ON fee_invoices FOR SELECT
    USING (
        auth_user_role() = 'parent' AND is_guardian_of(student_id)
    );

CREATE POLICY "Students can view own fee invoices"
    ON fee_invoices FOR SELECT
    USING (
        auth_user_role() = 'student' AND student_id IN (SELECT id FROM students WHERE profile_id = auth.uid())
    );

CREATE POLICY "Admin and Accountant can manage fee payments"
    ON fee_payments FOR ALL
    USING (auth_user_role() IN ('admin', 'accountant'));

CREATE POLICY "Parents can view linked child payments"
    ON fee_payments FOR SELECT
    USING (
        auth_user_role() = 'parent' AND is_guardian_of(student_id)
    );

-- 11. Audit Logs
CREATE POLICY "Admin can view audit logs"
    ON audit_logs FOR SELECT
    USING (is_admin());
