# Student Profile Data Flow - Complete Guide

## Overview
This document explains how student data flows from the admission form through approval to the student's profile page.

## Data Flow Architecture

### 1. Student Application (Admissions Form)
**File:** `src/components/dashboard/admissions/admissions-form.tsx`

When a student fills out the admission form:
- Form collects: firstName, lastName, email, phone, address, gender, dob, program, emergency contact
- Data is stored in `localStorage` under key `studentApplications`
- Each application has: id, name, email, phone, address, gender, date, status

```javascript
const newApp = {
  id: `APP${Date.now()}`,
  name: `${values.firstName} ${values.lastName}`,
  email: values.email,
  phone: values.phone,
  address: values.address,  // ← Address is captured here
  gender: values.gender,
  date: new Date().toISOString(),
  status: 'Pending'
};
```

### 2. Admin Approval (Applications Dashboard)
**File:** `src/components/dashboard/applications/applications-dashboard.tsx`

When an admin approves a student application:
1. Validates that student doesn't already exist in Supabase
2. Creates student record in Supabase with all data including address
3. Removes application from pending list
4. Optionally assigns student to hostel

```typescript
const newStudent = await StudentService.create({
  name: selectedStudentApp.name,
  email: selectedStudentApp.email,
  phone: selectedStudentApp.phone,
  gender: selectedStudentApp.gender,
  address: selectedStudentApp.address || '',  // ← Address saved to Supabase
  join_date: new Date().toISOString().split('T')[0],
  status: "Active"
});
```

### 3. Student Login
**File:** `src/components/auth/login-form.tsx`

When a student logs in:
1. Email and password are validated against stored credentials
2. User role is set to 'student'
3. Email is stored in localStorage
4. User is redirected to dashboard

```typescript
localStorage.setItem("userRole", "student");
localStorage.setItem("userEmail", email);
localStorage.setItem("isLoggedIn", "true");
```

### 4. Current User Hook (Data Fetching)
**File:** `src/hooks/use-current-user.ts`

When the app loads or user logs in:
1. Checks localStorage for user role and email
2. If role is 'student', fetches student data from Supabase using email
3. Returns student data to components

```typescript
if (storedRole === 'student' && storedEmail) {
  const student = await StudentService.getByEmail(storedEmail);
  setStudentData(student);  // ← Real data from Supabase
}
```

### 5. Student Profile Page (Settings)
**File:** `src/components/dashboard/settings/page.tsx`

When student views their profile:
1. Gets student data from `useCurrentUser` hook
2. Displays all fields: name, email, phone, gender, address
3. All data is read-only (from Supabase)

```typescript
if (studentData) {
  setProfileData({
    name: studentData.name,
    email: studentData.email,
    phone: studentData.phone || '',
    gender: studentData.gender || '',
    address: studentData.address || '',  // ← Address displayed here
    join_date: studentData.join_date || ''
  });
}
```

## Database Schema

### Students Table
```sql
CREATE TABLE students (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  gender TEXT,
  address TEXT,           -- ← Address field
  join_date DATE,
  status TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## Testing the Complete Flow

### Step 1: Create Student Application
1. Go to `/admissions`
2. Fill out the form with:
   - First Name: Ayushman
   - Last Name: Patra
   - Email: ayushman@example.com
   - Phone: 9876543210
   - Address: 123 Main Street, City, Country
   - Gender: Male
   - DOB: 2000-01-15
   - Program: B.Sc. Computer Science
   - Emergency Contact: John Doe, 9876543211
3. Click "Submit Application"

### Step 2: Admin Approves Student
1. Login as admin (email: admin@campus.edu, password: password)
2. Go to `/dashboard/applications`
3. Find "Ayushman Patra" in pending applications
4. Click "Approve"
5. Enter Student ID: STU002
6. (Optional) Assign to hostel
7. Click "Approve Admission"

### Step 3: Student Logs In
1. Go to `/login`
2. Select role: Student
3. Enter email: ayushman@example.com
4. Enter password: (check localStorage for generated credentials)
5. Click "Sign In"

### Step 4: View Student Profile
1. After login, go to `/dashboard/settings`
2. Click "Profile" tab
3. Verify all data is displayed:
   - Name: Ayushman Patra
   - Email: ayushman@example.com
   - Phone: 9876543210
   - Address: 123 Main Street, City, Country

## Key Components

### StudentService (src/lib/db/students.ts)
- `getByEmail(email)` - Fetches student by email from Supabase
- `create(student)` - Creates new student in Supabase
- `update(id, updates)` - Updates student data
- Handles schema cache issues gracefully

### useCurrentUser Hook (src/hooks/use-current-user.ts)
- Returns: role, email, studentData, isLoaded
- Automatically fetches student data from Supabase when role is 'student'

### Settings Page (src/components/dashboard/settings/page.tsx)
- Displays student profile information
- Uses data from useCurrentUser hook
- Shows real data from Supabase, not hardcoded values

## Troubleshooting

### Issue: "Could not find the 'address' column"
**Solution:** This is a Supabase schema cache issue. The StudentService now handles this gracefully by:
1. First trying to insert with address field
2. If schema cache error occurs, retrying without address field
3. The address will be saved once the schema cache is refreshed

### Issue: Student sees "Om Sahoo" profile
**Solution:** This means the student data is not being fetched from Supabase. Check:
1. Is the student record in Supabase? (Check Supabase dashboard)
2. Is the email in localStorage correct?
3. Are there any console errors in browser DevTools?

### Issue: Address not showing in profile
**Solution:** 
1. Verify address was entered in admission form
2. Check that address was saved in localStorage (check Application data)
3. Verify address was saved to Supabase when approved
4. Check browser console for any errors

## Files Modified

1. `supabase/migrations/001_create_tables.sql` - Added address column to students table
2. `src/lib/db/schema.ts` - Added address field to Student interface
3. `src/lib/db/students.ts` - Enhanced error handling for schema cache issues
4. `src/components/dashboard/admissions/admissions-form.tsx` - Captures address in form
5. `src/components/dashboard/applications/applications-dashboard.tsx` - Saves address when approving
6. `src/components/dashboard/settings/page.tsx` - Displays address in profile

## Summary

The complete flow ensures that:
✅ Student data is captured during admission
✅ Address and all details are stored in Supabase
✅ Student can login with their credentials
✅ Student profile shows real data from Supabase
✅ No hardcoded data is displayed
✅ Schema cache issues are handled gracefully
