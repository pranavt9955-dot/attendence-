# Apex Academy — Student Attendance Management System

A production-ready, responsive, full-stack Student Attendance Management System built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **SQLite (via Prisma ORM)**.

The system features two completely separated, role-guarded portals inside a single unified web application:
1. **Admin Portal** (For College Administration & Faculty)
2. **Student Portal** (Self-service academic attendance, percentages & coursework)

---

## 🚀 Key Features

### 1. 🛡️ Authentication & Role-Based Access Control
- Unified login screen with seamless one-click demo credentials filler.
- Dual-role guard (`ADMIN` vs `STUDENT`).
- Secure HTTP-only cookies with JWT tokens and bcrypt password hashing.
- Student accounts are strictly restricted from accessing administrative modules or other students' records.

### 2. 👨‍💼 Admin Portal Modules
- **Interactive Dashboard**: Real-time KPI summary cards (Total Students, Active Batches, Today's Sessions, Institutional Avg Attendance %, Published Assignments, Recent Enrollments, and Recent Attendance Activity).
- **Add Student**: Multi-section registration form (Personal, Academic, Contact, Credentials & Remarks).
  - Photo upload with immediate preview.
  - Client & server validation preventing duplicate Admission Numbers.
  - "Generate Admission Number" automatic generator.
  - Saves atomically to database and auto-refreshes student directory.
- **Attendance Management**:
  - Session form with Date, Course, Department, Class, Section, Semester, Subject, Faculty, Period, and Lecture Times.
  - Dynamic student roster loading based on selected filters.
  - Individual status toggle buttons: **Present**, **Absent**, **Late**, **Leave**.
  - One-click **Mark All Present** and **Mark All Absent** buttons.
  - Automatic duplicate session prevention for identical date, class, section, subject, and period.
  - Saved history table with date, class, subject, and status filters.
  - Full audit trail recorded for attendance creations and edits.
- **Live Attendance Room**:
  - Real-time roll-call mode with instant database synchronization as faculty taps student statuses.
  - Live progress indicators and dial gauge displaying attendance percentage and counts.
  - Ability to finalize and close sessions with safety confirmations.
- **Assignment Management**:
  - Create and distribute assignments targeted by Course, Class, Section, and Subject.
  - Multi-attachment uploads supporting PDF, Word (.docx), PowerPoint (.pptx), and Images.
  - Embedded in-app PDF and Image preview modals with direct file downloads.
  - Draft, Publish, and Archive status management.
- **Delete Student Records & Data Retention**:
  - Searchable, filterable student roster with row selection checkboxes.
  - **Select All** / **Deselect All** controls.
  - **Delete Selected** button with modal confirmation.
  - **Delete All Records** button requiring typed confirmation (`DELETE ALL`).
  - Safe soft-deletion with **Restore** capability preserving historical attendance integrity.
- **Reports & PDF Export**:
  - Filterable attendance ledgers by date range, course, class, and subject.
  - One-click **Export to CSV**.
  - Clean print stylesheet formatted with official college header for **Print to PDF**.
- **Audit Logs**: Full activity log tracking logins, roll calls, student additions, and deletions.

### 3. 🎓 Student Portal Modules
- **Student Dashboard**: Personalized greeting, admission number, roll number, course, class, section, today's roll call status, cumulative attendance percentage, and upcoming assignment deadlines.
- **My Attendance**:
  - **Today's Attendance**: Live status of today's lecture periods.
  - **All Attendance**: Complete attendance history with filters (date range, subject, status).
  - Attendance metrics: Total Classes, Classes Attended, Missed, Late Arrivals, and Overall Attendance Percentage `(Attended ÷ Total) × 100`.
  - Visual progress bar with policy warning indicator (&gt;75% required).
- **My Assignments**: Targeted published coursework with instructions, deadlines, max marks, in-browser PDF/image previews, and document downloads.
- **My Profile**: Complete academic and personal enrollment information.

---

## 🔑 Default Login Credentials

| Role | Login Identifier | Password | Access Portal |
|---|---|---|---|
| **Administrator** | `admin@school.edu` (or `admin`) | `Admin@123` | Admin Portal (`/admin`) |
| **Student 1** | `student1@school.edu` (or `ADM-2023-0101`) | `Student@123` | Student Portal (`/student`) |
| **Student 2** | `student2@school.edu` (or `ADM-2023-0102`) | `Student@123` | Student Portal (`/student`) |
| **Student 3** | `student3@school.edu` (or `ADM-2023-0103`) | `Student@123` | Student Portal (`/student`) |

> 💡 *Tip: On the `/login` page, you can click any of the **Quick Test Fill** pills to instantly populate credentials.*

---

## 🛠️ Tech Stack & Database Architecture

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict mode)
- **Styling**: Tailwind CSS & Lucide React Icons
- **Database**: SQLite with Prisma ORM (zero external server required, 100% persistent)
- **Auth**: JWT stored in HTTP-only secure cookie, bcryptjs password hashing
- **File Storage**: Local persistent file storage in `public/uploads/`

---

## 💻 Running the Application in VS Code

### 1. Open in VS Code
Open the project folder in VS Code:
```bash
code ~/Desktop/student-attendance-system
```

### 2. Install Dependencies (if not already installed)
```bash
npm install
```

### 3. Database Initialization & Seeding
The project comes with a seeded SQLite database (`prisma/dev.db`). If you ever wish to re-seed or reset:
```bash
npx prisma db push
node scripts/seed.mjs
```

### 4. Start Development Server
```bash
npm run dev
```

Open your browser at **`http://localhost:3000`**.

---

## 🧪 Running Automated Tests
To run the automated verification test suite:
```bash
node scripts/test-flows.mjs
```

---

## 📁 Directory Structure
```
student-attendance-system/
├── prisma/
│   ├── dev.db             # Persistent SQLite database
│   └── schema.prisma      # Prisma schema (Models, Relations, Indexes)
├── public/
│   └── uploads/           # Uploaded avatars and assignment documents
├── scripts/
│   ├── seed.mjs           # Database seed script
│   └── test-flows.mjs     # Automated verification test script
├── src/
│   ├── app/
│   │   ├── admin/         # Admin Portal pages
│   │   ├── student/       # Student Portal pages
│   │   ├── api/           # Secure RESTful API route handlers
│   │   ├── login/         # Dual-role authentication page
│   │   ├── layout.tsx     # Root layout & ToastProvider
│   │   └── page.tsx       # Landing page & Portal gateway
│   ├── components/        # Reusable UI widgets, Modals, Navbar, Sidebar
│   └── lib/               # Prisma client, auth helpers, constants, audit logger
├── .env                   # Environment configuration
├── package.json
└── README.md
```
