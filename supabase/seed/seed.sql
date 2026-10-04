-- Seed Script: supabase/seed/seed.sql
-- Gyan Sthali Public School ERP Demo Seed Data
-- 2 classes (Class 5-A, Class 6-A), 20 students, 3 teachers, 1 admin, sample attendance, homework, notices, fees

-- 1. Academic Year
INSERT INTO academic_years (id, name, start_date, end_date, is_current)
VALUES 
    ('a0000000-0000-0000-0000-000000000001', '2024-2025', '2024-04-01', '2025-03-31', true)
ON CONFLICT (name) DO NOTHING;

-- 2. Classes & Sections
INSERT INTO classes (id, name, order_index)
VALUES 
    ('c0000000-0000-0000-0000-000000000005', 'Class 5', 5),
    ('c0000000-0000-0000-0000-000000000006', 'Class 6', 6)
ON CONFLICT DO NOTHING;

INSERT INTO sections (id, class_id, name, room_number)
VALUES 
    ('s0000000-0000-0000-0000-00000000005a', 'c0000000-0000-0000-0000-000000000005', 'A', 'Room 204'),
    ('s0000000-0000-0000-0000-00000000006a', 'c0000000-0000-0000-0000-000000000006', 'A', 'Room 205')
ON CONFLICT DO NOTHING;

-- 3. Subjects
INSERT INTO subjects (id, class_id, name, code)
VALUES
    ('sub00000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000005', 'Mathematics', 'MATH-5'),
    ('sub00000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000005', 'Hindi', 'HIN-5'),
    ('sub00000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000005', 'English', 'ENG-5'),
    ('sub00000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000005', 'Environmental Studies', 'EVS-5'),
    ('sub00000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000006', 'Mathematics', 'MATH-6'),
    ('sub00000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000006', 'Science', 'SCI-6')
ON CONFLICT DO NOTHING;

-- 4. Auth Profiles (Admin, Teachers, Parent)
INSERT INTO profiles (id, role, full_name, phone, email, avatar_url)
VALUES 
    -- 1 Admin (Principal)
    ('11111111-1111-1111-1111-111111111111', 'admin', 'Dr. R.K. Srivastava', '+919800000001', 'principal@gyansthali.edu', NULL),
    -- 3 Teachers
    ('22222222-2222-2222-2222-222222222221', 'teacher', 'Sunita Mishra', '+919800000002', 'sunita.mishra@gyansthali.edu', NULL),
    ('22222222-2222-2222-2222-222222222222', 'teacher', 'Rajesh Verma', '+919800000003', 'rajesh.verma@gyansthali.edu', NULL),
    ('22222222-2222-2222-2222-222222222223', 'teacher', 'Pooja Pandey', '+919800000004', 'pooja.pandey@gyansthali.edu', NULL),
    -- 1 Demo Parent (Father of Aarav Sharma and Ananya Sharma)
    ('33333333-3333-3333-3333-333333333331', 'parent', 'Ramesh Sharma', '+919876543210', 'ramesh.sharma@example.com', NULL),
    -- 1 Demo Student (Aarav Sharma)
    ('44444444-4444-4444-4444-444444444441', 'student', 'Aarav Sharma', '+919876543211', 'aarav.sharma@student.gyansthali.edu', NULL)
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

-- 5. Staff Records
INSERT INTO staff (id, profile_id, employee_id, designation, qualification, is_active)
VALUES
    ('st000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222221', 'EMP-T01', 'Class 5-A Teacher & Math In-charge', 'M.Sc., B.Ed.', true),
    ('st000000-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'EMP-T02', 'Science Teacher', 'M.Sc. Physics, B.Ed.', true),
    ('st000000-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222223', 'EMP-T03', 'Hindi & Social Studies Teacher', 'M.A. Hindi, B.Ed.', true)
ON CONFLICT (employee_id) DO NOTHING;

-- Assign Class Teacher
INSERT INTO class_teachers (staff_id, section_id, academic_year_id)
VALUES
    ('st000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-00000000005a', 'a0000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

-- 6. Guardians
INSERT INTO guardians (id, profile_id, first_name, last_name, relation, phone, email, occupation)
VALUES
    ('g0000000-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333331', 'Ramesh', 'Sharma', 'father', '+919876543210', 'ramesh.sharma@example.com', 'Civil Engineer • PWD Dept')
ON CONFLICT DO NOTHING;

-- 7. 20 Demo Students (10 in Class 5-A, 10 in Class 6-A)
INSERT INTO students (
    id, profile_id, admission_number, first_name, last_name, first_name_hi, last_name_hi,
    roll_number, section_id, academic_year_id, date_of_birth, gender, blood_group, category, is_rte, bus_route, emergency_phone, address
)
VALUES
    -- Class 5-A (Students 1 to 10)
    ('std00000-0000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444441', 'GSPS-2021-482', 'Aarav', 'Sharma', 'आरव', 'शर्मा', 1, 's0000000-0000-0000-0000-00000000005a', 'a0000000-0000-0000-0000-000000000001', '2014-05-12', 'male', 'O+', 'GEN', false, 'Bus Route #4 (Sec 12)', '+919876543210', 'Quarter 42, Kalajharia, Jamtara'),
    ('std00000-0000-0000-0000-000000000002', NULL, 'GSPS-2021-483', 'Priya', 'Kumari', 'प्रिया', 'कुमारी', 2, 's0000000-0000-0000-0000-00000000005a', 'a0000000-0000-0000-0000-000000000001', '2014-08-20', 'female', 'B+', 'OBC', true, 'Walking / Local', '+919876543202', 'Station Road, Karmatanr'),
    ('std00000-0000-0000-0000-000000000003', NULL, 'GSPS-2021-484', 'Rohan', 'Verma', 'रोहन', 'वर्मा', 3, 's0000000-0000-0000-0000-00000000005a', 'a0000000-0000-0000-0000-000000000001', '2014-02-15', 'male', 'A+', 'GEN', false, 'Bus Route #2', '+919876543203', 'Vidyasagar Pally, Jamtara'),
    ('std00000-0000-0000-0000-000000000004', NULL, 'GSPS-2021-485', 'Sneha', 'Murmu', 'स्नेहा', 'मुर्मू', 4, 's0000000-0000-0000-0000-00000000005a', 'a0000000-0000-0000-0000-000000000001', '2014-11-04', 'female', 'O+', 'ST', true, 'Bus Route #4', '+919876543204', 'Santhali Tola, Kalajharia'),
    ('std00000-0000-0000-0000-000000000005', NULL, 'GSPS-2021-486', 'Vikram', 'Singh', 'विक्रम', 'सिंह', 5, 's0000000-0000-0000-0000-00000000005a', 'a0000000-0000-0000-0000-000000000001', '2014-06-18', 'male', 'AB+', 'GEN', false, 'Bus Route #1', '+919876543205', 'Main Bazaar, Karmatanr'),
    ('std00000-0000-0000-0000-000000000006', NULL, 'GSPS-2021-487', 'Ananya', 'Sharma', 'अनन्या', 'शर्मा', 6, 's0000000-0000-0000-0000-00000000005a', 'a0000000-0000-0000-0000-000000000001', '2014-05-12', 'female', 'O+', 'GEN', false, 'Bus Route #4', '+919876543210', 'Quarter 42, Kalajharia, Jamtara'),
    ('std00000-0000-0000-0000-000000000007', NULL, 'GSPS-2021-488', 'Ayush', 'Pandey', 'आयुष', 'पांडेय', 7, 's0000000-0000-0000-0000-00000000005a', 'a0000000-0000-0000-0000-000000000001', '2014-09-09', 'male', 'B+', 'GEN', false, 'Walking / Local', '+919876543207', 'Near Kali Mandir, Kalajharia'),
    ('std00000-0000-0000-0000-000000000008', NULL, 'GSPS-2021-489', 'Kavita', 'Bauri', 'कविता', 'बाउरी', 8, 's0000000-0000-0000-0000-00000000005a', 'a0000000-0000-0000-0000-000000000001', '2014-03-25', 'female', 'O-', 'SC', true, 'Walking / Local', '+919876543208', 'Gram Panchayat Kalajharia'),
    ('std00000-0000-0000-0000-000000000009', NULL, 'GSPS-2021-490', 'Deepak', 'Yadav', 'दीपक', 'यादव', 9, 's0000000-0000-0000-0000-00000000005a', 'a0000000-0000-0000-0000-000000000001', '2014-07-30', 'male', 'A+', 'OBC', false, 'Bus Route #3', '+919876543209', 'Dairy Farm Road, Karmatanr'),
    ('std00000-0000-0000-0000-000000000010', NULL, 'GSPS-2021-491', 'Megha', 'Das', 'मेघा', 'दास', 10, 's0000000-0000-0000-0000-00000000005a', 'a0000000-0000-0000-0000-000000000001', '2014-12-14', 'female', 'B-', 'SC', false, 'Bus Route #1', '+919876543210', 'Hospital Colony, Jamtara'),

    -- Class 6-A (Students 11 to 20)
    ('std00000-0000-0000-0000-000000000011', NULL, 'GSPS-2020-350', 'Aditya', 'Kumar', 'आदित्य', 'कुमार', 1, 's0000000-0000-0000-0000-00000000006a', 'a0000000-0000-0000-0000-000000000001', '2013-04-10', 'male', 'O+', 'GEN', false, 'Bus Route #2', '+919876543211', 'Court Road, Jamtara'),
    ('std00000-0000-0000-0000-000000000012', NULL, 'GSPS-2020-351', 'Kriti', 'Sen', 'कृति', 'सेन', 2, 's0000000-0000-0000-0000-00000000006a', 'a0000000-0000-0000-0000-000000000001', '2013-06-22', 'female', 'A+', 'GEN', false, 'Walking / Local', '+919876543212', 'Kalajharia-1'),
    ('std00000-0000-0000-0000-000000000013', NULL, 'GSPS-2020-352', 'Rahul', 'Marandi', 'राहुल', 'मरांडी', 3, 's0000000-0000-0000-0000-00000000006a', 'a0000000-0000-0000-0000-000000000001', '2013-01-18', 'male', 'B+', 'ST', true, 'Bus Route #4', '+919876543213', 'Marandi Tola, Karmatanr'),
    ('std00000-0000-0000-0000-000000000014', NULL, 'GSPS-2020-353', 'Tanvi', 'Jha', 'तन्वी', 'झा', 4, 's0000000-0000-0000-0000-00000000006a', 'a0000000-0000-0000-0000-000000000001', '2013-08-05', 'female', 'AB+', 'GEN', false, 'Bus Route #3', '+919876543214', 'Shastri Nagar, Jamtara'),
    ('std00000-0000-0000-0000-000000000015', NULL, 'GSPS-2020-354', 'Manish', 'Gupta', 'मनीष', 'गुप्ता', 5, 's0000000-0000-0000-0000-00000000006a', 'a0000000-0000-0000-0000-000000000001', '2013-10-11', 'male', 'O+', 'OBC', false, 'Walking / Local', '+919876543215', 'Karmatanr Chowk'),
    ('std00000-0000-0000-0000-000000000016', NULL, 'GSPS-2020-355', 'Pooja', 'Soren', 'पूजा', 'सोरेन', 6, 's0000000-0000-0000-0000-00000000006a', 'a0000000-0000-0000-0000-000000000001', '2013-05-19', 'female', 'B-', 'ST', true, 'Bus Route #4', '+919876543216', 'Soren Dih, Kalajharia'),
    ('std00000-0000-0000-0000-000000000017', NULL, 'GSPS-2020-356', 'Siddharth', 'Roy', 'सिद्धार्थ', 'रॉय', 7, 's0000000-0000-0000-0000-00000000006a', 'a0000000-0000-0000-0000-000000000001', '2013-09-29', 'male', 'A-', 'GEN', false, 'Bus Route #1', '+919876543217', 'Gandhi Pally, Jamtara'),
    ('std00000-0000-0000-0000-000000000018', NULL, 'GSPS-2020-357', 'Ritu', 'Kishku', 'रितु', 'किस्कू', 8, 's0000000-0000-0000-0000-00000000006a', 'a0000000-0000-0000-0000-000000000001', '2013-11-23', 'female', 'O+', 'ST', true, 'Bus Route #4', '+919876543218', 'Kalajharia-2'),
    ('std00000-0000-0000-0000-000000000019', NULL, 'GSPS-2020-358', 'Vivek', 'Choudhary', 'विवेक', 'चौधरी', 9, 's0000000-0000-0000-0000-00000000006a', 'a0000000-0000-0000-0000-000000000001', '2013-03-08', 'male', 'B+', 'OBC', false, 'Bus Route #2', '+919876543219', 'Block Road, Karmatanr'),
    ('std00000-0000-0000-0000-000000000020', NULL, 'GSPS-2020-359', 'Simran', 'Kaur', 'सिमरन', 'कौर', 10, 's0000000-0000-0000-0000-00000000006a', 'a0000000-0000-0000-0000-000000000001', '2013-07-17', 'female', 'O+', 'GEN', false, 'Bus Route #1', '+919876543220', 'Guru Nanak Colony, Jamtara')
ON CONFLICT (admission_number) DO NOTHING;

-- Link Demo Parent (Ramesh Sharma) to Aarav (std 1) and Ananya (std 6)
INSERT INTO student_guardians (student_id, guardian_id, is_primary)
VALUES
    ('std00000-0000-0000-0000-000000000001', 'g0000000-0000-0000-0000-000000000001', true),
    ('std00000-0000-0000-0000-000000000006', 'g0000000-0000-0000-0000-000000000001', true)
ON CONFLICT DO NOTHING;

-- 8. Sample Attendance (Month of October 2026 & recent school days)
-- Student 1 (Aarav): 94.2% attendance (Present most days)
-- Student 2 (Priya): 88% attendance
-- Student 8 (Kavita): Low attendance alert (<75%)
INSERT INTO attendance (student_id, date, status, marked_by, remarks)
VALUES
    ('std00000-0000-0000-0000-000000000001', CURRENT_DATE, 'present', 'st000000-0000-0000-0000-000000000001', 'On time'),
    ('std00000-0000-0000-0000-000000000002', CURRENT_DATE, 'present', 'st000000-0000-0000-0000-000000000001', NULL),
    ('std00000-0000-0000-0000-000000000003', CURRENT_DATE, 'present', 'st000000-0000-0000-0000-000000000001', NULL),
    ('std00000-0000-0000-0000-000000000004', CURRENT_DATE, 'late', 'st000000-0000-0000-0000-000000000001', 'School bus delayed by 15 mins'),
    ('std00000-0000-0000-0000-000000000005', CURRENT_DATE, 'present', 'st000000-0000-0000-0000-000000000001', NULL),
    ('std00000-0000-0000-0000-000000000006', CURRENT_DATE, 'present', 'st000000-0000-0000-0000-000000000001', NULL),
    ('std00000-0000-0000-0000-000000000007', CURRENT_DATE, 'present', 'st000000-0000-0000-0000-000000000001', NULL),
    ('std00000-0000-0000-0000-000000000008', CURRENT_DATE, 'absent', 'st000000-0000-0000-0000-000000000001', 'Fever reported by guardian'),
    ('std00000-0000-0000-0000-000000000009', CURRENT_DATE, 'present', 'st000000-0000-0000-0000-000000000001', NULL),
    ('std00000-0000-0000-0000-000000000010', CURRENT_DATE, 'present', 'st000000-0000-0000-0000-000000000001', NULL)
ON CONFLICT (student_id, date) DO NOTHING;

-- 9. Notices & Announcements (Priority #1)
INSERT INTO notices (id, title, title_hi, content, content_hi, category, priority, audience, published_by, published_at)
VALUES
    (
        'not00000-0000-0000-0000-000000000001',
        'CBSE Half-Yearly Examination Schedule & Admit Card Distribution',
        'सीबीएसई अर्धवार्षिक परीक्षा समय-सारणी एवं प्रवेश पत्र वितरण',
        'Half-yearly examinations for Classes 1 to 8 will commence from October 15, 2026. Hall tickets will be issued only upon clearance of Q2 school fee dues. Detailed timetable attached.',
        'कक्षा 1 से 8 की अर्धवार्षिक परीक्षाएं 15 अक्टूबर 2026 से प्रारंभ होंगी। द्वितीय तिमाही शुल्क क्लीयरेंस के पश्चात ही प्रवेश पत्र जारी किए जाएंगे।',
        'exam', 'urgent', 'all',
        '11111111-1111-1111-1111-111111111111', now() - interval '2 days'
    ),
    (
        'not00000-0000-0000-0000-000000000002',
        'Parent-Teacher Meeting (PTM) for Term-1 Evaluation',
        'प्रथम सत्र मूल्यांकन हेतु अभिभावक-शिक्षक बैठक (पीटीएम)',
        'Quarterly PTM is scheduled for Saturday, 10:00 AM to 1:30 PM. Parents can review answer sheets and attendance progress with class teachers.',
        'त्रैमासिक पीटीएम शनिवार को प्रातः 10:00 बजे से दोपहर 1:30 बजे तक आयोजित की जाएगी। अभिभावक उत्तर पुस्तिकाओं की समीक्षा कर सकते हैं।',
        'academic', 'high', 'parents',
        '11111111-1111-1111-1111-111111111111', now() - interval '4 days'
    ),
    (
        'not00000-0000-0000-0000-000000000003',
        'Annual Sports Meet 2026 Trials Selection',
        'वार्षिक खेलकूद प्रतियोगिता 2026 ट्रायल चयन',
        'Inter-house athletics, football, and kabaddi selection trials will begin this Friday on the school playground. PT uniform mandatory.',
        'इंटर-हाउस एथलेटिक्स, फुटबॉल एवं कबड्डी चयन ट्रायल शुक्रवार से स्कूल खेल मैदान पर शुरू होंगे। पीटी ड्रेस अनिवार्य है।',
        'sports', 'normal', 'students',
        '22222222-2222-2222-2222-222222222221', now() - interval '6 days'
    )
ON CONFLICT DO NOTHING;

-- 10. Homework & Assignments (Priority #5)
INSERT INTO homework (id, section_id, subject_id, teacher_id, title, description, due_date)
VALUES
    (
        'hw000000-0000-0000-0000-000000000001',
        's0000000-0000-0000-0000-00000000005a',
        'sub00000-0000-0000-0000-000000000001',
        'st000000-0000-0000-0000-000000000001',
        'Chapter 6: Fractions & Mixed Numbers Exercise 6.3',
        'Complete Q1 to Q12 from NCERT textbook page 84 in your fair homework notebook. Show step-by-step LCM calculation.',
        CURRENT_DATE + interval '2 days'
    ),
    (
        'hw000000-0000-0000-0000-000000000002',
        's0000000-0000-0000-0000-00000000005a',
        'sub00000-0000-0000-0000-000000000002',
        'st000000-0000-0000-0000-000000000003',
        'पाठ 5: संज्ञा एवं सर्वनाम के भेद (अभ्यास कार्य)',
        'अपनी व्याकरण पुस्तिका में दिए गए अभ्यास प्रश्न 1 से 5 हल करें एवं 10 वाक्यों में संज्ञा शब्दों को रेखांकित करें।',
        CURRENT_DATE + interval '1 day'
    )
ON CONFLICT DO NOTHING;

-- 11. Timetables (Priority #6) - Monday to Saturday
INSERT INTO timetables (section_id, subject_id, staff_id, day_of_week, period_number, start_time, end_time, academic_year_id)
VALUES
    ('s0000000-0000-0000-0000-00000000005a', 'sub00000-0000-0000-0000-000000000001', 'st000000-0000-0000-0000-000000000001', 1, 1, '08:30', '09:15', 'a0000000-0000-0000-0000-000000000001'),
    ('s0000000-0000-0000-0000-00000000005a', 'sub00000-0000-0000-0000-000000000002', 'st000000-0000-0000-0000-000000000003', 1, 2, '09:15', '10:00', 'a0000000-0000-0000-0000-000000000001'),
    ('s0000000-0000-0000-0000-00000000005a', 'sub00000-0000-0000-0000-000000000003', 'st000000-0000-0000-0000-000000000001', 1, 3, '10:15', '11:00', 'a0000000-0000-0000-0000-000000000001'),
    ('s0000000-0000-0000-0000-00000000005a', 'sub00000-0000-0000-0000-000000000004', 'st000000-0000-0000-0000-000000000002', 1, 4, '11:00', '11:45', 'a0000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

-- 12. School Calendar & Events (Priority #7)
INSERT INTO calendar_events (id, title, title_hi, description, event_type, start_date, end_date, audience)
VALUES
    ('cal00000-0000-0000-0000-000000000001', 'Durga Puja & Dussehra Vacation', 'दुर्गा पूजा व दशहरा अवकाश', 'School remains closed for festival holidays. Homework sent via ERP.', 'holiday', '2026-10-18', '2026-10-24', 'all'),
    ('cal00000-0000-0000-0000-000000000002', 'CBSE Term-1 Half Yearly Exams', 'सीबीएसई प्रथम सत्र अर्धवार्षिक परीक्षा', 'Written examinations in offline mode.', 'exam', '2026-10-28', '2026-11-06', 'all'),
    ('cal00000-0000-0000-0000-000000000003', 'Children''s Day Celebration', 'बाल दिवस समारोह', 'Cultural functions, speech competitions, and sports day.', 'celebration', '2026-11-14', '2026-11-14', 'all')
ON CONFLICT DO NOTHING;

-- 13. Fees & Invoices
INSERT INTO fee_invoices (id, student_id, quarter, academic_year_id, total_amount, paid_amount, due_date, status)
VALUES
    ('inv00000-0000-0000-0000-000000000001', 'std00000-0000-0000-0000-000000000001', 'Q1', 'a0000000-0000-0000-0000-000000000001', 6450.00, 6450.00, '2024-05-10', 'paid'),
    ('inv00000-0000-0000-0000-000000000002', 'std00000-0000-0000-0000-000000000001', 'Q2', 'a0000000-0000-0000-0000-000000000001', 6450.00, 6450.00, '2024-08-10', 'paid'),
    ('inv00000-0000-0000-0000-000000000003', 'std00000-0000-0000-0000-000000000001', 'Q3', 'a0000000-0000-0000-0000-000000000001', 6450.00, 0.00, '2024-11-10', 'pending')
ON CONFLICT DO NOTHING;

INSERT INTO fee_payments (id, invoice_id, student_id, amount, payment_method, transaction_id, receipt_number, paid_at)
VALUES
    ('pay00000-0000-0000-0000-000000000001', 'inv00000-0000-0000-0000-000000000001', 'std00000-0000-0000-0000-000000000001', 6450.00, 'online_razorpay', 'pay_NzkX918472', 'REC-8922', now() - interval '90 days'),
    ('pay00000-0000-0000-0000-000000000002', 'inv00000-0000-0000-0000-000000000002', 'std00000-0000-0000-0000-000000000001', 6450.00, 'upi', 'upi_8829471928', 'REC-9104', now() - interval '20 days')
ON CONFLICT DO NOTHING;
