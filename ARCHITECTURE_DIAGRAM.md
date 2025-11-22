# Architecture Diagram - Student Profile System

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CAMPUSCONNECT ERP                               │
│                    Student Profile Management System                    │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ FRONTEND LAYER                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐    │
│  │  Admissions      │  │  Applications    │  │  Settings        │    │
│  │  Form            │  │  Dashboard       │  │  Page            │    │
│  │                  │  │                  │  │                  │    │
│  │ - Captures       │  │ - Reviews apps   │  │ - Displays       │    │
│  │   student data   │  │ - Approves       │  │   profile        │    │
│  │ - Stores in      │  │   students       │  │ - Shows real     │    │
│  │   localStorage   │  │ - Creates in DB  │  │   data from DB   │    │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘    │
│         │                      │                      │                │
│         └──────────────────────┼──────────────────────┘                │
│                                │                                       │
│                    ┌───────────▼────────────┐                         │
│                    │  useCurrentUser Hook   │                         │
│                    │                        │                         │
│                    │ - Fetches student data │                         │
│                    │ - From Supabase        │                         │
│                    │ - By email             │                         │
│                    └───────────┬────────────┘                         │
│                                │                                       │
└────────────────────────────────┼───────────────────────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  BUSINESS LOGIC LAYER   │
                    ├────────────────────────┤
                    │                        │
                    │  StudentService        │
                    │  - getByEmail()        │
                    │  - create()            │
                    │  - update()            │
                    │  - search()            │
                    │                        │
                    │  Error Handling:       │
                    │  - Schema cache check  │
                    │  - Fallback mechanism  │
                    │  - Graceful errors     │
                    │                        │
                    └────────────┬───────────┘
                                 │
┌────────────────────────────────▼───────────────────────────────────────┐
│ DATA LAYER                                                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ Supabase PostgreSQL Database                                     │ │
│  │                                                                  │ │
│  │  ┌────────────────────────────────────────────────────────────┐ │ │
│  │  │ students table                                             │ │ │
│  │  ├────────────────────────────────────────────────────────────┤ │ │
│  │  │ id (UUID)                                                  │ │ │
│  │  │ name (TEXT)                                                │ │ │
│  │  │ email (TEXT) - UNIQUE                                      │ │ │
│  │  │ phone (TEXT)                                               │ │ │
│  │  │ gender (TEXT)                                              │ │ │
│  │  │ address (TEXT) ← NEW FIELD                                 │ │ │
│  │  │ join_date (DATE)                                           │ │ │
│  │  │ status (TEXT)                                              │ │ │
│  │  │ created_at (TIMESTAMP)                                     │ │ │
│  │  │ updated_at (TIMESTAMP)                                     │ │ │
│  │  └────────────────────────────────────────────────────────────┘ │ │
│  │                                                                  │ │
│  │  Indexes:                                                        │ │
│  │  - idx_students_email (for fast lookups)                        │ │
│  │  - idx_students_status (for filtering)                          │ │
│  │                                                                  │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ localStorage (Browser)                                           │ │
│  │                                                                  │ │
│  │ studentApplications: [                                           │ │
│  │   {                                                              │ │
│  │     id, name, email, phone, address, gender, date, status      │ │
│  │   }                                                              │ │
│  │ ]                                                                │ │
│  │                                                                  │ │
│  │ userRole: "student"                                             │ │
│  │ userEmail: "student@example.com"                                │ │
│  │ isLoggedIn: "true"                                              │ │
│  │                                                                  │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Sequence Diagram

```
┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│ Student  │      │  Admin   │      │ Frontend │      │ Supabase │
└────┬─────┘      └────┬─────┘      └────┬─────┘      └────┬─────┘
     │                 │                 │                 │
     │ 1. Fill Form    │                 │                 │
     ├────────────────────────────────────>                 │
     │                 │                 │                 │
     │                 │ 2. Submit       │                 │
     │                 │ Application     │                 │
     │                 │                 │                 │
     │                 │ 3. Store in     │                 │
     │                 │ localStorage    │                 │
     │                 │                 │                 │
     │                 │ 4. Login        │                 │
     │                 ├────────────────────────────────────>
     │                 │                 │                 │
     │                 │ 5. View Apps    │                 │
     │                 ├────────────────────────────────────>
     │                 │                 │                 │
     │                 │ 6. Approve      │                 │
     │                 ├────────────────────────────────────>
     │                 │                 │                 │
     │                 │ 7. Create       │                 │
     │                 │ Student         │                 │
     │                 │ (without addr)  ├────────────────────>
     │                 │                 │                 │
     │                 │ 8. Update       │                 │
     │                 │ with Address    ├────────────────────>
     │                 │ (graceful fail) │                 │
     │                 │                 │                 │
     │                 │ 9. Success      │                 │
     │                 │ Toast           │                 │
     │                 │                 │                 │
     │ 10. Login       │                 │                 │
     ├────────────────────────────────────>                 │
     │                 │                 │                 │
     │                 │                 │ 11. Fetch       │
     │                 │                 │ Student Data    │
     │                 │                 ├────────────────────>
     │                 │                 │                 │
     │                 │                 │ 12. Return      │
     │                 │                 │ Student Data    │
     │                 │                 │<────────────────────
     │                 │                 │                 │
     │ 13. View        │                 │                 │
     │ Profile         ├────────────────────────────────────>
     │                 │                 │                 │
     │                 │                 │ 14. Display     │
     │                 │                 │ Real Data       │
     │                 │                 │                 │
     │ 15. See Real    │                 │                 │
     │ Profile Data    │                 │                 │
     │<────────────────────────────────────                 │
     │                 │                 │                 │
```

## Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Application Components                       │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────────────┐
                    │  Login Form      │
                    │                  │
                    │ Validates        │
                    │ credentials      │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │  Dashboard       │
                    │                  │
                    │ Routes to:       │
                    │ - Admissions     │
                    │ - Applications   │
                    │ - Settings       │
                    └────────┬─────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ Admissions Form  │ │ Applications     │ │ Settings Page    │
│                  │ │ Dashboard        │ │                  │
│ Captures:        │ │                  │ │ Displays:        │
│ - Name           │ │ Reviews:         │ │ - Name           │
│ - Email          │ │ - Pending apps   │ │ - Email          │
│ - Phone          │ │ - Student info   │ │ - Phone          │
│ - Address ◄──────┼─┤                  │ │ - Address ◄──────┤
│ - Gender         │ │ Actions:         │ │ - Gender         │
│ - DOB            │ │ - Approve        │ │                  │
│ - Program        │ │ - Reject         │ │ Data Source:     │
│                  │ │ - Assign hostel  │ │ useCurrentUser   │
│ Stores in:       │ │                  │ │ Hook             │
│ localStorage     │ │ Saves to:        │ │                  │
│                  │ │ Supabase         │ │ Read-only        │
└──────────────────┘ └──────────────────┘ └──────────────────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                    ┌────────▼─────────┐
                    │ StudentService   │
                    │                  │
                    │ Methods:         │
                    │ - getByEmail()   │
                    │ - create()       │
                    │ - update()       │
                    │ - search()       │
                    │                  │
                    │ Error Handling:  │
                    │ - Schema cache   │
                    │ - Fallback       │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │ Supabase Client  │
                    │                  │
                    │ Connects to:     │
                    │ PostgreSQL DB    │
                    └──────────────────┘
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Student Creation Error Handling                             │
└─────────────────────────────────────────────────────────────┘

                    ┌──────────────────┐
                    │ Create Student   │
                    │ WITH address     │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │ Supabase Error?  │
                    └────────┬─────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
        ┌──────────────┐         ┌──────────────┐
        │ No Error     │         │ Error        │
        │              │         │              │
        │ Success!     │         │ Check Type   │
        │ Return data  │         └──────┬───────┘
        └──────────────┘                │
                                        │
                        ┌───────────────┼───────────────┐
                        │               │               │
                        ▼               ▼               ▼
                ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
                │ Duplicate    │ │ Schema Cache │ │ Other Error  │
                │ Email        │ │ Error        │ │              │
                │              │ │              │ │ Throw Error  │
                │ Throw Error  │ │ Retry        │ │              │
                │              │ │ WITHOUT      │ │              │
                │              │ │ address      │ │              │
                └──────────────┘ │              │ └──────────────┘
                                 │ Success?    │
                                 │              │
                                 ├──────┬───────┤
                                 │      │       │
                                 ▼      ▼       ▼
                            Yes  No  Error
                             │    │    │
                             ▼    ▼    ▼
                        ┌──────────────────┐
                        │ Return Student   │
                        │ (without address)│
                        │                  │
                        │ Then try to      │
                        │ update address   │
                        │ separately       │
                        └──────────────────┘
```

## State Management

```
┌─────────────────────────────────────────────────────────────┐
│ Data Storage Layers                                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Layer 1: Browser localStorage                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ studentApplications: [                                      │
│   { id, name, email, phone, address, gender, date, status} │
│ ]                                                           │
│                                                             │
│ userRole: "student"                                         │
│ userEmail: "student@example.com"                            │
│ isLoggedIn: "true"                                          │
│                                                             │
│ Purpose: Temporary storage during session                  │
│ Lifetime: Until logout or browser clear                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ (on approval)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 2: Supabase PostgreSQL                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ students table:                                             │
│ {                                                           │
│   id: UUID,                                                 │
│   name: string,                                             │
│   email: string (unique),                                   │
│   phone: string,                                            │
│   gender: string,                                           │
│   address: string,                                          │
│   join_date: date,                                          │
│   status: string,                                           │
│   created_at: timestamp,                                    │
│   updated_at: timestamp                                     │
│ }                                                           │
│                                                             │
│ Purpose: Persistent storage                                │
│ Lifetime: Permanent (until deleted)                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ (on login)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ Layer 3: React Component State                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ useCurrentUser Hook:                                        │
│ {                                                           │
│   role: "student",                                          │
│   email: "student@example.com",                             │
│   studentData: { ... },  ← Fetched from Supabase           │
│   isLoaded: true                                            │
│ }                                                           │
│                                                             │
│ Settings Page State:                                        │
│ {                                                           │
│   profileData: {                                            │
│     name, email, phone, gender, address, join_date         │
│   }                                                         │
│ }                                                           │
│                                                             │
│ Purpose: Runtime data for UI rendering                     │
│ Lifetime: Until component unmounts                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Summary

This architecture ensures:
- ✅ Clean separation of concerns
- ✅ Reliable data flow
- ✅ Graceful error handling
- ✅ Real-time data display
- ✅ Persistent storage
- ✅ Scalable design
