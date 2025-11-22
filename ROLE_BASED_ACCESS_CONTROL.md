# Role-Based Access Control (RBAC)

## Overview

The system now enforces strict role-based access control. Each user role has specific permissions and can only access routes designated for their role.

## Role Definitions & Permissions

### 1. **Admin** 
**Hardcoded Credentials** (Special ID & Password in code)

**Accessible Routes:**
- `/dashboard` - Main dashboard
- `/dashboard/applications` - View & manage student/teacher applications
- `/dashboard/admissions` - Enroll new students
- `/dashboard/students` - View all students
- `/dashboard/staff` - View all staff
- `/dashboard/finance` - View financial data
- `/dashboard/holidays` - Manage holidays
- `/dashboard/settings` - Profile settings

**Capabilities:**
- Approve/reject student applications
- Create student credentials
- Manage staff records
- View financial reports
- Manage holidays
- Full system access

---

### 2. **Teacher**
**Generated Credentials** (Created by admin after approval)

**Accessible Routes:**
- `/dashboard` - Main dashboard
- `/dashboard/courses` - View & manage courses
- `/dashboard/students` - View assigned students
- `/dashboard/attendance` - Mark attendance
- `/dashboard/grades` - View/manage grades
- `/dashboard/settings` - Profile settings

**Capabilities:**
- View assigned courses
- Mark student attendance
- Enter grades
- View student information
- Update profile

---

### 3. **Student**
**Generated Credentials** (Created by admin after application approval)

**Accessible Routes:**
- `/dashboard` - Main dashboard
- `/dashboard/courses` - View enrolled courses
- `/dashboard/grades` - View grades
- `/dashboard/finance` - View fee status
- `/dashboard/pay-fee` - Make fee payments
- `/dashboard/settings` - View profile (shows real data from admission form)

**Capabilities:**
- View enrolled courses
- Check grades
- View fee information
- Make payments
- View personal profile (name, email, phone, address from admission form)

---

### 4. **Finance**
**Hardcoded Credentials** (Special ID & Password in code)

**Accessible Routes:**
- `/dashboard` - Main dashboard
- `/dashboard/finance` - Fee management & financial reports
- `/dashboard/settings` - Profile settings

**Capabilities:**
- Manage student fees
- View financial reports
- Process payments
- Update profile

---

### 5. **Hostel**
**Hardcoded Credentials** (Special ID & Password in code)

**Accessible Routes:**
- `/dashboard` - Main dashboard
- `/dashboard/rooms` - Manage hostel rooms
- `/dashboard/hostel-students` - View hostel residents
- `/dashboard/mess` - Manage mess operations
- `/dashboard/settings` - Profile settings

**Capabilities:**
- Manage room assignments
- View hostel residents
- Manage mess operations
- Update profile

---

## How It Works

### 1. **Login Process**
```
User enters email & password
↓
System checks hardcoded profiles (admin, finance, hostel)
↓
If not found, checks generated credentials (students, teachers)
↓
On success: Stores role & email in localStorage
↓
Redirects to dashboard
```

### 2. **Route Protection**
```
User navigates to a route
↓
MainLayout checks: hasRouteAccess(role, pathname)
↓
If access denied: Redirects to default dashboard for their role
↓
If access allowed: Displays page content
```

### 3. **Sidebar Navigation**
- Only shows menu items accessible to the current role
- Prevents users from seeing restricted options

---

## Route Permission Matrix

| Route | Admin | Teacher | Student | Finance | Hostel |
|-------|-------|---------|---------|---------|--------|
| `/dashboard` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/dashboard/applications` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `/dashboard/admissions` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `/dashboard/students` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `/dashboard/staff` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `/dashboard/courses` | ❌ | ✅ | ✅ | ❌ | ❌ |
| `/dashboard/attendance` | ❌ | ✅ | ❌ | ❌ | ❌ |
| `/dashboard/grades` | ❌ | ✅ | ✅ | ❌ | ❌ |
| `/dashboard/finance` | ✅ | ❌ | ✅ | ✅ | ❌ |
| `/dashboard/pay-fee` | ❌ | ❌ | ✅ | ❌ | ❌ |
| `/dashboard/rooms` | ❌ | ❌ | ❌ | ❌ | ✅ |
| `/dashboard/hostel-students` | ❌ | ❌ | ❌ | ❌ | ✅ |
| `/dashboard/mess` | ❌ | ❌ | ❌ | ❌ | ✅ |
| `/dashboard/holidays` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `/dashboard/settings` | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## Implementation Details

### Route Protection File
**Location:** `src/lib/route-protection.ts`

**Key Functions:**
- `hasRouteAccess(role, pathname)` - Checks if role can access route
- `getDefaultDashboardRoute(role)` - Returns default dashboard for role

### Main Layout
**Location:** `src/components/dashboard/main-layout.tsx`

**Protection Logic:**
1. Checks if user is logged in
2. Checks if user has access to current route
3. Redirects to default dashboard if access denied

### Sidebar Navigation
**Location:** `src/components/dashboard/sidebar-nav.tsx`

**Role-Based Menu:**
- Shows only accessible routes for current role
- Prevents navigation to restricted pages

---

## Security Features

✅ **Route-Level Protection** - Users cannot access restricted routes
✅ **Sidebar Filtering** - Only shows accessible menu items
✅ **Automatic Redirection** - Redirects to default dashboard if access denied
✅ **Role-Based Data** - Each role sees only relevant data
✅ **Real-Time Validation** - Checks on every route change

---

## Testing Access Control

### Test as Admin
1. Login with admin credentials
2. Should see: Applications, Admissions, Students, Staff, Finance, Holidays
3. Try accessing `/dashboard/pay-fee` → Should redirect to `/dashboard/applications`

### Test as Student
1. Login with student credentials
2. Should see: Courses, Grades, Fees, Profile
3. Try accessing `/dashboard/applications` → Should redirect to `/dashboard`

### Test as Teacher
1. Login with teacher credentials
2. Should see: Courses, Students, Attendance, Grades
3. Try accessing `/dashboard/finance` → Should redirect to `/dashboard/courses`

### Test as Finance
1. Login with finance credentials
2. Should see: Finance, Settings
3. Try accessing `/dashboard/students` → Should redirect to `/dashboard/finance`

### Test as Hostel
1. Login with hostel credentials
2. Should see: Rooms, Students, Mess
3. Try accessing `/dashboard/applications` → Should redirect to `/dashboard/rooms`

---

## Adding New Routes

To add a new route with role restrictions:

1. **Create the page** in `src/app/dashboard/[route]/page.tsx`
2. **Add to route permissions** in `src/lib/route-protection.ts`:
   ```typescript
   "/dashboard/new-route": ["admin", "teacher"],
   ```
3. **Add to sidebar** in `src/components/dashboard/sidebar-nav.tsx`:
   ```typescript
   teacher: [
     // ... existing items
     { href: "/dashboard/new-route", icon: <Icon />, label: "New Route" },
   ]
   ```

---

## Troubleshooting

### User can access restricted route
- Check `route-protection.ts` - ensure role is NOT in allowed roles
- Clear browser cache and localStorage
- Restart dev server

### User redirected unexpectedly
- Check if route is in `routePermissions`
- Verify user's role is correct in localStorage
- Check browser console for errors

### Sidebar shows wrong menu items
- Verify `sidebar-nav.tsx` has correct role configuration
- Check `useCurrentUser` hook returns correct role
- Clear localStorage and re-login

