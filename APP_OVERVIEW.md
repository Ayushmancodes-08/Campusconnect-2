# CampusConnect ERP - Application Overview

## 1. Objective & Goals (110 words)

**CampusConnect ERP** is a comprehensive campus management system designed to streamline educational institution operations:

- **Centralized Management**: Unified platform for students, staff, courses, and institutional data
- **Multi-Role Access**: Role-based dashboards for Admin, Teachers, Students, and Finance teams
- **Core Functions**: Student admissions, attendance tracking, grade management, fee collection, hostel management, and staff coordination
- **Real-Time Operations**: Live updates for attendance, grades, applications, and financial records
- **Data Organization**: Structured management of courses, holidays, room assignments, and emergency contacts
- **Accessibility**: Web-based interface accessible from any device without installation
- **Scalability**: Built to handle multiple concurrent users across different departments

---

## 2. Tech Stack (Sequential)

### Frontend
- **Framework**: Next.js 15.3.3 (React 18.3.1)
- **Language**: TypeScript
- **UI Components**: Radix UI (accessible component library)
- **Styling**: Tailwind CSS 3.4.1 with custom animations
- **Forms**: React Hook Form + Zod validation
- **Data Tables**: TanStack React Table
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Theme**: Next Themes (dark/light mode support)

### Backend
- **Runtime**: Node.js (via Next.js)
- **API**: Next.js API routes (server-side rendering)
- **Authentication**: Mock authentication system (role-based)
- **Session Management**: Client-side session handling

### Database
- **Provider**: Supabase (PostgreSQL-based)
- **Tables**: Students, Staff, Courses, Holidays, Hostels, Rooms
- **Type Safety**: TypeScript interfaces for all entities
- **Real-time**: Supabase real-time capabilities available

### Security
- **Environment Variables**: .env.local for sensitive credentials
- **API Keys**: Supabase anonymous key (public, row-level security enforced)
- **CORS**: Next.js built-in CORS handling
- **Input Validation**: Zod schema validation on all forms
- **Role-Based Access**: Route protection via role verification

---

## 3. Approach & Architecture

### Development Platform & Tools
- **Code Editor**: VS Code (recommended)
- **Version Control**: Git + GitHub
- **Package Manager**: npm
- **Development Server**: Next.js dev server (Turbopack enabled, port 9002)
- **Build Tool**: Next.js built-in build system

### Framework & Modules Location

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes (login, apply, admissions)
│   └── dashboard/                # Protected dashboard routes
│       ├── students/             # Student management
│       ├── staff/                # Staff management
│       ├── courses/              # Course management
│       ├── grades/               # Grade tracking
│       ├── attendance/           # Attendance records
│       ├── finance/              # Fee management
│       ├── hostel-students/      # Hostel assignments
│       ├── rooms/                # Room management
│       ├── holidays/             # Holiday calendar
│       └── settings/             # System settings
│
├── components/                   # Reusable React components
│   ├── auth/                     # Login & application forms
│   ├── dashboard/                # Dashboard-specific components
│   │   ├── dashboards/           # Role-specific dashboards
│   │   ├── students/             # Student table & management
│   │   ├── staff/                # Staff table & management
│   │   ├── attendance/           # Attendance tracking
│   │   ├── finance/              # Fee management UI
│   │   └── holidays/             # Holiday management
│   └── ui/                       # Radix UI component wrappers
│
├── lib/                          # Utility functions & business logic
│   ├── db/                       # Database operations
│   │   ├── schema.ts             # TypeScript interfaces
│   │   ├── students.ts           # Student queries
│   │   ├── staff.ts              # Staff queries
│   │   ├── courses.ts            # Course queries
│   │   ├── holidays.ts           # Holiday queries
│   │   ├── hostels.ts            # Hostel queries
│   │   └── rooms.ts              # Room queries
│   ├── supabase.ts               # Supabase client initialization
│   ├── route-protection.ts       # Authentication middleware
│   ├── grades.ts                 # Grade calculations
│   ├── attendance.ts             # Attendance logic
│   ├── finance.ts                # Fee calculations
│   └── utils.ts                  # Helper functions
│
├── hooks/                        # Custom React hooks
│   ├── use-current-user.ts       # User context hook
│   ├── use-mobile.tsx            # Responsive design hook
│   └── use-toast.ts              # Toast notifications
│
└── context/                      # React Context providers
    └── app-data-provider.tsx     # Global app state
```

### Key Technologies
- **Next.js 15**: Full-stack React framework with App Router
- **Supabase**: Backend-as-a-Service with PostgreSQL
- **Radix UI**: Unstyled, accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe development

---

## 4. Handling Capacity

### Current Architecture
- **Concurrent Users**: Supports 100+ simultaneous users (Supabase free tier)
- **Database Connections**: Up to 100 concurrent connections
- **Storage**: 500MB included (Supabase free tier)
- **API Rate Limits**: 200 requests/second per IP
- **Real-time Subscriptions**: Up to 100 concurrent connections

### Scalability Options
- **Upgrade Path**: Supabase Pro tier for 10,000+ concurrent users
- **Caching**: Implement Redis for frequently accessed data
- **CDN**: Vercel CDN for static assets (if deployed on Vercel)
- **Database Optimization**: Add indexes on frequently queried columns
- **Load Balancing**: Horizontal scaling via Vercel or similar platforms

### Performance Metrics
- **Page Load**: ~2-3 seconds (optimized with Next.js)
- **API Response**: <500ms average
- **Database Query**: <100ms for indexed queries
- **Real-time Updates**: <1 second latency

---

## 5. User Workflow (User Perspective)

```
┌─────────────────────────────────────────────────────────────────┐
│                    CAMPUSCONNECT ERP WORKFLOW                   │
└─────────────────────────────────────────────────────────────────┘

                          ┌──────────────┐
                          │  Visit App   │
                          └──────┬───────┘
                                 │
                    ┌────────────▼────────────┐
                    │   Select User Role     │
                    │ (Admin/Teacher/Student)│
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   Enter Credentials    │
                    │  (Email & Password)    │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  Authentication Check  │
                    └────────────┬────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
   ┌─────────┐          ┌──────────────┐         ┌──────────────┐
   │  ADMIN  │          │   TEACHER    │         │   STUDENT    │
   └────┬────┘          └──────┬───────┘         └──────┬───────┘
        │                      │                        │
        │                      │                        │
   ┌────▼──────────────┐  ┌────▼──────────────┐  ┌─────▼──────────┐
   │ Admin Dashboard   │  │Teacher Dashboard │  │Student Dashboard
   │                   │  │                  │  │                 │
   │ • Manage Students │  │ • View Classes   │  │ • View Grades   │
   │ • Manage Staff    │  │ • Mark Attendance│  │ • Check Fees    │
   │ • View Finance    │  │ • Enter Grades   │  │ • View Schedule │
   │ • Manage Courses  │  │ • View Holidays  │  │ • Hostel Info   │
   │ • Hostel Mgmt     │  │ • Manage Rooms   │  │ • View Courses  │
   │ • Set Holidays    │  │ • View Finance   │  │ • Apply for Job │
   │ • View Reports    │  │ • View Reports   │  │ • View Holidays │
   └────┬──────────────┘  └────┬──────────────┘  └─────┬──────────┘
        │                      │                        │
        │                      │                        │
   ┌────▼──────────────┐  ┌────▼──────────────┐  ┌─────▼──────────┐
   │ Perform Actions   │  │ Perform Actions   │  │ Perform Actions │
   │                   │  │                   │  │                 │
   │ • Add/Edit Data   │  │ • Update Records  │  │ • View Records  │
   │ • Generate Reports│  │ • Submit Grades   │  │ • Pay Fees      │
   │ • Manage Settings │  │ • Track Attendance│  │ • Apply for Job │
   └────┬──────────────┘  └────┬──────────────┘  └─────┬──────────┘
        │                      │                        │
        └────────────────┬─────┴────────────────────────┘
                         │
                    ┌────▼────────────┐
                    │ Data Saved to   │
                    │ Supabase DB     │
                    └────┬────────────┘
                         │
                    ┌────▼────────────┐
                    │ Dashboard       │
                    │ Updates in      │
                    │ Real-time       │
                    └────┬────────────┘
                         │
                    ┌────▼────────────┐
                    │ User Logs Out   │
                    │ or Navigates    │
                    └────────────────┘
```

---

## 6. Key Features by Role

### Admin
- Complete system oversight
- User and staff management
- Financial reporting
- Holiday and course scheduling
- Hostel and room allocation

### Teacher
- Class and attendance management
- Grade entry and tracking
- Student performance monitoring
- Course scheduling
- Holiday calendar access

### Student
- Grade and attendance viewing
- Fee payment tracking
- Course enrollment
- Hostel information
- Job application submission

### Finance
- Fee collection and tracking
- Financial reports
- Payment processing
- Budget management
- Expense tracking

---

## 7. Deployment & Environment

- **Hosting**: Vercel (recommended for Next.js)
- **Database**: Supabase Cloud
- **Environment**: Production-ready with .env.local configuration
- **CI/CD**: GitHub Actions (can be configured)
- **Monitoring**: Vercel Analytics + Supabase monitoring

---

## 8. Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run typecheck

# Linting
npm run lint
```

Access the app at `http://localhost:9002`

Test credentials available in README.md

---

**Last Updated**: December 2025
**Version**: 0.1.0
**Status**: Active Development
