-- Migration: 20261004000003_computed_functions.sql
-- Description: Server-side business logic: attendance calculations, fee dues, views and RPCs

-- 1. Calculate Student Attendance Percentage Function
CREATE OR REPLACE FUNCTION get_student_attendance_pct(
    student_id_param UUID,
    month_param INT DEFAULT NULL,
    year_param INT DEFAULT NULL
)
RETURNS NUMERIC AS $$
DECLARE
    total_days INT;
    attended_days NUMERIC;
    pct NUMERIC;
BEGIN
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE status = 'present') + 
        (COUNT(*) FILTER (WHERE status IN ('late', 'half_day')) * 0.5)
    INTO total_days, attended_days
    FROM attendance
    WHERE student_id = student_id_param
      AND (month_param IS NULL OR EXTRACT(MONTH FROM date) = month_param)
      AND (year_param IS NULL OR EXTRACT(YEAR FROM date) = year_param);

    IF total_days = 0 OR total_days IS NULL THEN
        RETURN 100.00;
    END IF;

    pct := ROUND((attended_days / total_days) * 100, 2);
    RETURN pct;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 2. Calculate Student Fee Dues Function
CREATE OR REPLACE FUNCTION calculate_fee_due(student_id_param UUID)
RETURNS NUMERIC AS $$
DECLARE
    total_billed NUMERIC;
    total_paid NUMERIC;
BEGIN
    SELECT 
        COALESCE(SUM(total_amount), 0),
        COALESCE(SUM(paid_amount), 0)
    INTO total_billed, total_paid
    FROM fee_invoices
    WHERE student_id = student_id_param;

    RETURN (total_billed - total_paid);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 3. View: Attendance Summary View
CREATE OR REPLACE VIEW v_student_attendance_summary AS
SELECT 
    s.id AS student_id,
    s.admission_number,
    COUNT(a.id) AS total_recorded_days,
    COUNT(a.id) FILTER (WHERE a.status = 'present') AS present_days,
    COUNT(a.id) FILTER (WHERE a.status = 'absent') AS absent_days,
    COUNT(a.id) FILTER (WHERE a.status = 'late') AS late_days,
    CASE 
        WHEN COUNT(a.id) = 0 THEN 100.00
        ELSE ROUND(
            ((COUNT(a.id) FILTER (WHERE a.status = 'present') + 
              (COUNT(a.id) FILTER (WHERE a.status IN ('late', 'half_day')) * 0.5))::NUMERIC 
             / COUNT(a.id)::NUMERIC) * 100, 1
        )
    END AS attendance_percentage,
    CASE 
        WHEN COUNT(a.id) = 0 THEN true
        WHEN (((COUNT(a.id) FILTER (WHERE a.status = 'present') + 
              (COUNT(a.id) FILTER (WHERE a.status IN ('late', 'half_day')) * 0.5))::NUMERIC 
             / COUNT(a.id)::NUMERIC) * 100) >= 75.0 THEN true
        ELSE false
    END AS is_cbse_exam_eligible
FROM students s
LEFT JOIN attendance a ON s.id = a.student_id
GROUP BY s.id, s.admission_number;

-- 4. View: Fee Summary View
CREATE OR REPLACE VIEW v_student_fee_summary AS
SELECT 
    s.id AS student_id,
    s.admission_number,
    COALESCE(SUM(fi.total_amount), 0) AS total_fee_amount,
    COALESCE(SUM(fi.paid_amount), 0) AS total_paid_amount,
    COALESCE(SUM(fi.total_amount), 0) - COALESCE(SUM(fi.paid_amount), 0) AS balance_due,
    CASE 
        WHEN (COALESCE(SUM(fi.total_amount), 0) - COALESCE(SUM(fi.paid_amount), 0)) <= 0 THEN 'paid'
        WHEN BOOL_OR(fi.status = 'overdue' OR fi.due_date < CURRENT_DATE) THEN 'overdue'
        ELSE 'pending'
    END AS overall_fee_status
FROM students s
LEFT JOIN fee_invoices fi ON s.id = fi.student_id
GROUP BY s.id, s.admission_number;

-- 5. View: Student 360 Directory View (Powers Admin Student Directory & Profiles)
CREATE OR REPLACE VIEW v_student_directory AS
SELECT 
    s.id,
    s.profile_id,
    s.admission_number,
    s.first_name,
    s.last_name,
    s.first_name_hi,
    s.last_name_hi,
    s.roll_number,
    s.date_of_birth,
    s.gender,
    s.blood_group,
    s.category,
    s.is_rte,
    s.bus_route,
    s.emergency_phone,
    s.address,
    s.avatar_url,
    c.name AS class_name,
    sec.name AS section_name,
    sec.room_number,
    ay.name AS academic_year,
    g.first_name || ' ' || g.last_name AS primary_guardian_name,
    g.relation AS primary_guardian_relation,
    g.phone AS primary_guardian_phone,
    g.occupation AS primary_guardian_occupation,
    att.attendance_percentage,
    att.is_cbse_exam_eligible,
    fee.balance_due,
    fee.overall_fee_status
FROM students s
JOIN sections sec ON s.section_id = sec.id
JOIN classes c ON sec.class_id = c.id
JOIN academic_years ay ON s.academic_year_id = ay.id
LEFT JOIN student_guardians sg ON s.id = sg.student_id AND sg.is_primary = true
LEFT JOIN guardians g ON sg.guardian_id = g.id
LEFT JOIN v_student_attendance_summary att ON s.id = att.student_id
LEFT JOIN v_student_fee_summary fee ON s.id = fee.student_id;
