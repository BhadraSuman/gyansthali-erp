# Gyan Sthali Public School ERP (Web First, Flutter-Ready)

> Comprehensive, responsive, installable School ERP (PWA) and digital learning portal for **Gyan Sthali Public School, Kalajharia, Karmatanr Vidyasagar, Jamtara, Jharkhand**.
> Architected with a **"Backend-First, Thin UI"** strategy so a native Flutter mobile app can be introduced later without rewriting database schemas, business logic, design tokens, or translations.

---

## 🏛️ School Verification & Institutional Meta

| Attribute | Verified Public Record |
|---|---|
| **School Name** | Gyan Sthali Public School (GSPS) |
| **UDISE Code** | **20191509702** |
| **Location** | Kalajharia-1, Karmatanr Vidyasagar, Jamtara, Jharkhand – 815352 |
| **Year Established** | 2007 |
| **CBSE Affiliation** | Institutional Standard Affiliation #3430198 |
| **Level** | LKG to Class 8 (Primary with Upper Primary) |
| **RTE 12(1)(c) Quota** | Compliant (25% entry level intake) |

---

## 🎯 Architecture & Monorepo Structure

```
gyansthali_app/
├── apps/
│   └── web/                               # Next.js App Router UI (Thin Client)
│       ├── public/                        # School emblem crest (logo.svg), PWA manifest
│       └── src/
│           ├── app/                       # App Router routes (/, /login, /portal/*)
│           ├── components/
│           │   ├── providers/             # LocaleProvider, RoleSessionProvider, QueryProvider
│           │   ├── shell/                 # Header, ChildSwitcher, BottomNav, AdminSidebar
│           │   └── ui/                    # StatusChip, Badges, Cards
│           ├── data/                      # Unified Data Layer (mirrored by Flutter data layer)
│           │   ├── attendance.ts
│           │   ├── auth.ts
│           │   ├── calendar.ts
│           │   ├── fees.ts
│           │   ├── homework.ts
│           │   ├── notices.ts
│           │   ├── students.ts
│           │   └── timetable.ts
│           └── lib/                       # Supabase client & utilities
├── packages/
│   ├── design-tokens/                     # Shared tokens (tokens.json, CSS, Dart theme tokens)
│   ├── i18n/                              # Bilingual dictionaries (en.json, hi.json)
│   └── api-types/                         # TypeScript database & model types
├── supabase/
│   ├── config.toml                        # Supabase local environment config
│   ├── functions/                         # Supabase Edge Functions (Razorpay, FCM notifications)
│   ├── migrations/                        # Core schema, RLS policies, computed functions
│   │   ├── 20261004000001_core_schema.sql
│   │   ├── 20261004000002_rls_policies.sql
│   │   └── 20261004000003_computed_functions.sql
│   └── seed/
│       └── seed.sql                       # 20 fake demo students, 3 teachers, 1 admin, attendance
├── docs/
│   ├── api.md                             # Flutter API / RPC contract
│   ├── data-model.md                      # Database schemas, Mermaid ER diagram, RLS rules
│   └── flutter-migration.md               # Complete Flutter migration pack
└── tests/
    ├── rls.test.ts                        # Automated test proving parent data isolation
    └── i18n.test.ts                       # Automated bilingual dictionary parity test
```

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js >= 20.x
- pnpm >= 9.x (`npm install -g pnpm`)

### 1. Installation
```bash
pnpm install
```

### 2. Build Design Tokens
```bash
pnpm build:tokens
```

### 3. Run Development Server
```bash
pnpm dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser or mobile device.

### 4. Run Automated Test Suite
```bash
pnpm test
```

### 5. Production Build Verification
```bash
pnpm build
```

---

## 🔑 Demo Logins & Role Switcher

For seamless local evaluation, the application includes a **1-click Role Switcher** in the top navigation header and on `/login`:

| Role | Demo Identity | Contact / Login | Key Features & Access |
|---|---|---|---|
| **Parent** | Ramesh Sharma | Phone: `9876543210` (OTP: `123456`) | Child Switcher (Aarav / Ananya), attendance calendar, homework, fee ledger, exam eligibility |
| **Teacher** | Sunita Mishra (Class 5-A) | `sunita.mishra@gyansthali.edu` / `password123` | Daily attendance roll call (big toggles), create homework, post notices |
| **Principal / Admin** | Dr. R.K. Srivastava | `principal@gyansthali.edu` / `password123` | Executive stats, student master directory, low attendance alerts, timetable builder |
| **Student** | Aarav Sharma (Class 5-A, Roll 1) | Phone: `9876543211` (OTP: `123456`) | Student learning hub, homework submissions, class schedule |

---

## 🛡️ Database & Security Guarantees

1. **Row Level Security (RLS) on Every Table**:
   - Parents can query **only** their linked children via `student_guardians` junction.
   - Teachers can modify attendance **only** for sections they are assigned to.
   - Verified by test suite (`tests/rls.test.ts`).
2. **Server-Side Computed Logic**:
   - `get_student_attendance_pct(student_id, month, year)` calculates attendance % in SQL.
   - `v_student_attendance_summary` enforces CBSE 75% examination eligibility flag.
   - `calculate_fee_due(student_id)` calculates outstanding dues on the server.
3. **No Secrets in Client Code**:
   - Supabase Service Role and webhook secrets remain in server environment and Edge Functions.

---

## 📋 Phase 0 & Phase 1 (MVP) Completion Status

### ✅ What's Done in Phase 0 (Foundation)
- [x] Monorepo setup with `pnpm`, TypeScript strict mode, Vitest.
- [x] Design tokens compiled from Stitch project `16455743899925835810` (CSS variables, TS exports, Flutter Dart theme tokens).
- [x] Bilingual i18n package (`en.json`, `hi.json`) with instant English/Hindi switcher.
- [x] Supabase Postgres schema migrations (3 SQL migration files) + demo seed data.
- [x] Automated test suite proving parent data isolation and i18n parity (100% passing).
- [x] Unified data access layer in `/apps/web/src/data/*.ts`.
- [x] Responsive PWA app shell with Header, Child Switcher, Mobile Bottom Nav, and Desktop Admin Sidebar.
- [x] Complete Flutter Migration Pack in `/docs/flutter-migration.md`, `/docs/api.md`, `/docs/data-model.md`.

### ✅ What's Done in Phase 1 (MVP Delivery)
- [x] **Admin Academic Management**: Academic sessions, Class LKG to 8 structure, sections, and curricula syllabi (`/portal/admin/academics`).
- [x] **Staff & Faculty Allocation**: Employee directory, contact ledger, and class teacher assignments (`/portal/admin/staff`).
- [x] **Student Admissions & CSV Batch Importer**: Single admission form and CSV bulk importer with instant validation, error reporting, and export (`/portal/students`).
- [x] **Teacher Daily Attendance Roll Call**: Single-tap toggles (P/A/L), mark all present with 1 click, and auto-dispatch absence alerts (`/portal/attendance`).
- [x] **Teacher Homework & Notices**: Assignment posting with due dates, subject categorization, and audience-targeted circulars.
- [x] **Parent Multi-Child Experience**: Instant child switcher (Aarav / Ananya), attendance calendar with CBSE 75% exam eligibility warning, and fee summary with receipts.
- [x] **Real-Time In-App Notifications**: Notification drawer (`/portal/notifications`) handling absence alerts, new homework assignments, and official circulars.
- [x] **PWA Offline Shell**: Service worker (`sw.js`) with cache fallback for offline access.
- [x] **Full Automated Testing**: 10 tests across 3 test suites passing (`rls.test.ts`, `i18n.test.ts`, `phase1-features.test.ts`).

---

### 🔜 What's Next in Phase 2 (Upon Approval)
1. **Online Fee Payment**: Razorpay server-side order generation and webhook verification.
2. **Resource Library**: Educational PDF upload, tags, search, and bookmarks.
3. **Exams & Report Cards**: Marks entry grid, result computation, and PDF report cards.
4. **Parent-Teacher Messaging**: Real-time communication between guardians and class teachers.
5. **Leave Applications**: Digital leave requests with teacher approval workflow.

---

### 📝 `[EDIT]` Items Needed from School Management
- [ ] Confirm finalized quarterly fee heads and tuition breakdown for Nursery - Class 8.
- [ ] Confirm list of official school holidays and Term-1 examination dates for 2026–27.
- [ ] Provide authorized list of teaching faculty and class teacher assignments.
