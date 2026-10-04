# Gyan Sthali School ERP — API & RPC Catalogue (Flutter Contract)

> **Important**: This document defines the shared API contract between the Next.js Web app, Supabase Backend, and the future Flutter Mobile app. Both clients must use these exact queries, RPC signatures, and payloads.

---

## 1. Authentication Endpoints

### 1.1 Phone OTP Login (Parent & Student)
- **Supabase Auth SDK**: `supabase.auth.signInWithOtp({ phone })`
- **Request**:
  ```json
  {
    "phone": "+919876543210"
  }
  ```
- **Response**:
  ```json
  { "messageId": "msg_otp_sent_xyz" }
  ```

### 1.2 Verify Phone OTP
- **Supabase Auth SDK**: `supabase.auth.verifyOtp({ phone, token, type: 'sms' })`
- **Request**:
  ```json
  {
    "phone": "+919876543210",
    "token": "482910",
    "type": "sms"
  }
  ```
- **Response**:
  ```json
  {
    "session": {
      "access_token": "eyJhbGciOi...",
      "refresh_token": "...",
      "user": {
        "id": "33333333-3333-3333-3333-333333333331",
        "phone": "+919876543210"
      }
    }
  }
  ```

### 1.3 Staff Email / Password Login (Teacher & Admin)
- **Supabase Auth SDK**: `supabase.auth.signInWithPassword({ email, password })`

---

## 2. Priority Feature Endpoints & RPCs

### 2.1 Notices & Announcements (Priority #1)
#### `getNotices(audience?: string)`
- **Query**:
  ```sql
  SELECT * FROM notices 
  WHERE audience = 'all' OR audience = :audience
  ORDER BY published_at DESC;
  ```
- **Response Shape**:
  ```json
  [
    {
      "id": "not00000-0000-0000-0000-000000000001",
      "title": "CBSE Half-Yearly Examination Schedule",
      "title_hi": "सीबीएसई अर्धवार्षिक परीक्षा समय-सारणी",
      "content": "Examinations commence October 15...",
      "category": "exam",
      "priority": "urgent",
      "audience": "all",
      "attachment_url": null,
      "published_at": "2026-10-02T10:00:00Z"
    }
  ]
  ```

### 2.2 Student Profile & Multi-Child Switcher (Priority #2 & #4)
#### `getParentChildren(guardianProfileId: string)`
- **Query**:
  ```sql
  SELECT s.*, sec.name as section_name, c.name as class_name, att.attendance_percentage, fee.balance_due
  FROM students s
  JOIN student_guardians sg ON s.id = sg.student_id
  JOIN guardians g ON sg.guardian_id = g.id
  JOIN sections sec ON s.section_id = sec.id
  JOIN classes c ON sec.class_id = c.id
  LEFT JOIN v_student_attendance_summary att ON s.id = att.student_id
  LEFT JOIN v_student_fee_summary fee ON s.id = fee.student_id
  WHERE g.profile_id = :guardianProfileId;
  ```

### 2.3 Attendance (Priority #3)
#### `getStudentAttendanceHistory(studentId: string, month?: number, year?: number)`
- **Response Shape**:
  ```json
  {
    "studentId": "std00000-0000-0000-0000-000000000001",
    "percentage": 94.2,
    "totalWorkingDays": 134,
    "daysPresent": 126,
    "daysAbsent": 6,
    "daysLate": 2,
    "isExamEligible": true,
    "records": [
      {
        "date": "2026-10-04",
        "status": "present",
        "remarks": "On time"
      }
    ]
  }
  ```

#### `submitAttendanceRollCall(sectionId: string, date: string, rollCall: AttendanceItem[])`
- **Request**:
  ```json
  {
    "sectionId": "s0000000-0000-0000-0000-00000000005a",
    "date": "2026-10-04",
    "items": [
      { "studentId": "std00000-...", "status": "present" },
      { "studentId": "std00000-...", "status": "absent", "remarks": "Fever" }
    ]
  }
  ```

### 2.4 Homework / Assignments (Priority #5)
#### `getHomeworkBySection(sectionId: string)`
- **Response**:
  ```json
  [
    {
      "id": "hw000000-0000-0000-0000-000000000001",
      "subjectName": "Mathematics",
      "title": "Chapter 6: Fractions Exercise 6.3",
      "description": "Complete Q1 to Q12...",
      "dueDate": "2026-10-06"
    }
  ]
  ```

### 2.5 Timetable (Priority #6)
#### `getTimetable(sectionId: string)`
- Returns weekly matrix grouped by `day_of_week` (1=Mon ... 6=Sat) and sorted by `period_number`.

### 2.6 School Calendar & Events (Priority #7)
#### `getCalendarEvents(year: number, month?: number)`
- Returns list of events (`holiday`, `exam`, `celebration`, `meeting`).

---

## 3. Server RPC Functions

### `rpc/get_student_attendance_pct`
- **Method**: `POST /rest/v1/rpc/get_student_attendance_pct`
- **Params**: `{ "student_id_param": "uuid", "month_param": 10, "year_param": 2026 }`
- **Returns**: `94.20`

### `rpc/calculate_fee_due`
- **Method**: `POST /rest/v1/rpc/calculate_fee_due`
- **Params**: `{ "student_id_param": "uuid" }`
- **Returns**: `6450.00`
