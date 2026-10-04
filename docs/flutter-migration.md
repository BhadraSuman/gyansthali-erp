# Flutter Migration Pack — Gyan Sthali School ERP

> **Purpose**: This document guarantees that a native Flutter mobile app can be built on top of the exact same Supabase backend, database tables, RPCs, design tokens, and translations **without modifying a single line of backend or business logic**.

---

## 1. Screen Registry, Routes, and Role Permissions

| # | Screen Name | Route (Web) | Flutter Screen / Widget | Data Layer Function | Accessible Roles |
|---|---|---|---|---|---|
| 1 | Parent Dashboard | `/portal/parent` | `ParentDashboardScreen` | `getParentChildren()`, `getNotices()` | Parent |
| 2 | Child Attendance & Calendar | `/portal/parent/attendance` | `ParentAttendanceScreen` | `getStudentAttendanceHistory()` | Parent |
| 3 | Homework & Classwork | `/portal/parent/homework` | `ParentHomeworkScreen` | `getHomeworkBySection()` | Parent, Student |
| 4 | Notices & Announcements | `/portal/notices` | `NoticesListScreen` | `getNotices()` | Parent, Teacher, Student |
| 5 | Timetable & Periods | `/portal/timetable` | `TimetableScreen` | `getTimetable()` | Parent, Teacher, Student |
| 6 | School Calendar & Events | `/portal/calendar` | `SchoolCalendarScreen` | `getCalendarEvents()` | All Roles |
| 7 | Student 360 Profile | `/portal/student/profile` | `StudentProfileScreen` | `getStudentProfile()` | Parent, Student, Admin |
| 8 | Fees & Receipts | `/portal/parent/fees` | `ParentFeesScreen` | `getStudentInvoices()`, `getStudentPayments()` | Parent |
| 9 | Teacher Roll Call | `/portal/teacher/attendance` | `TeacherRollCallScreen` | `submitAttendanceRollCall()`, `getClassRollCallList()` | Teacher |
| 10 | Teacher Post Homework | `/portal/teacher/homework` | `TeacherCreateHomeworkScreen` | `createHomework()` | Teacher |
| 11 | Login (Phone OTP) | `/login` | `PhoneOtpLoginScreen` | `signInWithOtp()`, `verifyOtp()` | Parent, Student |
| 12 | Staff Login (Email) | `/login/staff` | `StaffLoginScreen` | `signInWithPassword()` | Teacher, Admin |

> **Decision Note**: The Administrative Console (`/admin/*`) stays on Web permanently. Flutter mobile targets Parent, Teacher, and Student workflows.

---

## 2. API / RPC Catalogue for Flutter

### 2.1 Supabase Client Initialization in Flutter
```dart
import 'package:supabase_flutter/supabase_flutter.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Supabase.initialize(
    url: 'https://your-project.supabase.co',
    anonKey: 'eyJhbGciOi...',
  );
  runApp(const GyanSthaliApp());
}
```

### 2.2 Calling the Server Business Logic from Flutter
```dart
// 1. Fetch Attendance Percentage (Server RPC)
final pct = await Supabase.instance.client.rpc(
  'get_student_attendance_pct',
  params: {
    'student_id_param': currentStudentId,
    'month_param': 10,
    'year_param': 2026,
  },
);

// 2. Fetch Notices with Audience Filter
final notices = await Supabase.instance.client
  .from('notices')
  .select()
  .or('audience.eq.all,audience.eq.parents')
  .order('published_at', ascending: false);

// 3. Mark Roll Call (Row-Level Security enforces teacher's section)
await Supabase.instance.client
  .from('attendance')
  .upsert(attendanceRecordsList);
```

---

## 3. Auth Flow Description

1. **User enters 10-digit mobile number**:
   - `supabase.auth.signInWithOtp(phone: '+91$phone');`
2. **User enters 6-digit SMS OTP**:
   - `supabase.auth.verifyOTP(phone: '+91$phone', token: otp, type: OtpType.sms);`
3. **Session refresh & Profile lookup**:
   - Supabase SDK automatically refreshes the JWT in local secure storage.
   - Look up the user's role from `profiles` table:
     ```dart
     final profile = await Supabase.instance.client
       .from('profiles')
       .select('role')
       .eq('id', Supabase.instance.client.auth.currentUser!.id)
       .single();
     ```
   - Route to `ParentDashboardScreen` if `role == 'parent'`, or `TeacherDashboardScreen` if `role == 'teacher'`.

---

## 4. Design Tokens Mapping to Flutter ThemeData

All tokens from `packages/design-tokens/tokens.json` directly map to Flutter:

```dart
final ThemeData gyanSthaliTheme = ThemeData(
  useMaterial3: true,
  fontFamily: 'PlusJakartaSans',
  colorScheme: ColorScheme(
    brightness: Brightness.light,
    primary: Color(0xFF1E3A8A),        // Institutional Royal Navy
    onPrimary: Colors.white,
    secondary: Color(0xFFF59E0B),      // Parent Accent Amber
    onSecondary: Colors.white,
    error: Color(0xFFDC2626),          // Danger / Absent
    onError: Colors.white,
    surface: Color(0xFFFFFFFF),        // Cards
    onSurface: Color(0xFF0F172A),      // Slate Ink
  ),
  scaffoldBackgroundColor: const Color(0xFFF6F7FB), // Background canvas
  cardTheme: CardTheme(
    elevation: 1,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(16.0), // 16px radius
      side: const BorderSide(color: Color(0xFFE2E8F0)),
    ),
  ),
);
```

---

## 5. i18n Mapping (JSON to Flutter ARB)

The translations in `packages/i18n/messages/en.json` and `hi.json` convert directly to `.arb` files via a simple node script (`intl_utils`):

- `packages/i18n/messages/en.json` -> `lib/l10n/app_en.arb`
- `packages/i18n/messages/hi.json` -> `lib/l10n/app_hi.arb`

Flutter usage:
```dart
Text(AppLocalizations.of(context)!.schoolName);
```

---

## 6. Push Notification Setup for Android & iOS

1. Use Firebase Cloud Messaging (`firebase_messaging` Flutter package).
2. Register APNs credentials (iOS) and `google-services.json` (Android).
3. On device login, obtain FCM Device Token:
   ```dart
   final fcmToken = await FirebaseMessaging.instance.getToken();
   ```
4. Store device token in Supabase table `user_push_tokens` (linked to `auth.uid()`).
5. When a teacher marks a student absent or posts homework, Supabase Database Webhook calls the Edge Function `notifications-dispatcher` which triggers FCM.

---

## 7. Recommended Flutter Stack

| Responsibility | Recommended Package |
|---|---|
| Supabase Backend SDK | `supabase_flutter: ^2.8.0` |
| State Management | `flutter_riverpod: ^2.6.1` |
| Routing & Deep Links | `go_router: ^14.8.0` |
| Data Models | `freezed: ^2.5.7` + `json_serializable: ^6.9.0` |
| Offline Cache | `drift: ^2.24.0` (SQLite for timetable, notices, cached profile) |
| Localization | `flutter_localizations` + ARB |
| Push Notifications | `firebase_messaging: ^15.2.0` |

---

## 8. Screen Build Order for Flutter

1. **Sprint 1 (Parent Experience - High Daily Value)**:
   - Phone OTP Login
   - Child Switcher Pill Bar
   - Parent Dashboard (Today's status, Quick stats, Notice ticker)
   - Attendance Calendar & Monthly %
   - Homework List & Details
2. **Sprint 2 (Teacher Utilities - Daily Roll Call)**:
   - Teacher Attendance Roll Call (Big tap buttons: Present/Absent/Late)
   - Homework Creation Form
3. **Sprint 3 (Student Portal)**:
   - Homework photo submission
   - Timetable & Resource Library
