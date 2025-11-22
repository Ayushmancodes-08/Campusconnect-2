# Diagnostic Guide - Student Profile Issue

## Problem
You're logged in as Ayushman but seeing Om Sahoo's hardcoded data.

## Root Cause
Ayushman's student record doesn't exist in Supabase, so the system can't fetch real data.

## How to Verify

### Step 1: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for logs like:
   ```
   useCurrentUser - Fetching student data for email: ayushman@example.com
   useCurrentUser - Fetched student: null
   ```
   
   If you see `null`, the student record doesn't exist in Supabase.

### Step 2: Check Supabase Dashboard
1. Go to your Supabase project
2. Click on "SQL Editor"
3. Run this query:
   ```sql
   SELECT * FROM students WHERE email = 'ayushman@example.com';
   ```
4. If no results, the student record wasn't created

### Step 3: Check localStorage
1. Open DevTools → Application → localStorage
2. Look for `studentApplications` key
3. Verify Ayushman's application is there
4. Check if it has the correct email

## Solution

### Option 1: Manually Create Student Record (Quick Fix)
1. Go to Supabase dashboard
2. Click on "students" table
3. Click "Insert row"
4. Fill in:
   - name: Ayushman Patra
   - email: ayushman@example.com
   - phone: 9876543210
   - gender: male
   - address: 123 Main Street, City, Country
   - join_date: 2024-01-15
   - status: Active
5. Click "Save"
6. Refresh the app and login again

### Option 2: Re-approve Student (Proper Way)
1. Logout from Ayushman account
2. Login as admin (admin@campus.edu / password)
3. Go to /dashboard/applications
4. Find Ayushman's application
5. Click "Approve"
6. Enter Student ID: STU002
7. Click "Approve Admission"
8. Logout from admin
9. Login as Ayushman again

### Option 3: Check if Application Exists
1. Open DevTools → Application → localStorage
2. Look for `studentApplications` key
3. If Ayushman's application is NOT there:
   - Go to /admissions
   - Fill out form again with Ayushman's details
   - Submit
4. Then follow Option 2 to approve

## Verification Steps

After creating/approving the student:

### Step 1: Check Supabase
```sql
SELECT * FROM students WHERE email = 'ayushman@example.com';
```
Should return Ayushman's record with all details.

### Step 2: Check Browser Console
1. Logout completely
2. Clear browser cache (Ctrl+Shift+Delete)
3. Login as Ayushman again
4. Check console for:
   ```
   useCurrentUser - Fetched student: {
     id: "...",
     name: "Ayushman Patra",
     email: "ayushman@example.com",
     phone: "9876543210",
     gender: "male",
     address: "123 Main Street, City, Country",
     ...
   }
   ```

### Step 3: Check Profile Page
1. Go to /dashboard/settings
2. Verify you see:
   - Name: Ayushman Patra (NOT Om Sahoo)
   - Email: ayushman@example.com (NOT osahoo9178@gmail.com)
   - Phone: 9876543210
   - Address: 123 Main Street, City, Country
   - Gender: male

## Troubleshooting

### Issue: Still seeing Om Sahoo after creating record
**Solution:**
1. Clear browser cache completely
2. Close all browser tabs
3. Open new tab and login again
4. Check console for fetch logs

### Issue: Can't find Ayushman's application
**Solution:**
1. Go to /admissions
2. Fill out form with Ayushman's details:
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
4. Check localStorage for `studentApplications`

### Issue: Approval fails with error
**Solution:**
1. Check browser console for error message
2. Go to Supabase dashboard
3. Check if student already exists with that email
4. If exists, delete and try again
5. Or use different email

## Quick Checklist

- [ ] Ayushman's application exists in localStorage
- [ ] Ayushman's student record exists in Supabase
- [ ] Browser console shows student data being fetched
- [ ] Profile page shows Ayushman's real data
- [ ] NOT showing Om Sahoo's data

## Expected Console Output

When everything works correctly, you should see:

```
useCurrentUser - Loading: {
  storedRole: "student",
  storedEmail: "ayushman@example.com",
  isLoggedIn: true
}

useCurrentUser - Fetching student data for email: ayushman@example.com

useCurrentUser - Fetched student: {
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: "Ayushman Patra",
  email: "ayushman@example.com",
  phone: "9876543210",
  gender: "male",
  address: "123 Main Street, City, Country",
  join_date: "2024-01-15",
  status: "Active",
  created_at: "2024-01-15T10:00:00.000Z",
  updated_at: "2024-01-15T10:00:00.000Z"
}

Settings - Loading student data for: ayushman@example.com
Settings - studentData from hook: {
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: "Ayushman Patra",
  email: "ayushman@example.com",
  ...
}

Settings - Using Supabase student data: {
  name: "Ayushman Patra",
  email: "ayushman@example.com",
  phone: "9876543210",
  gender: "male",
  address: "123 Main Street, City, Country",
  ...
}
```

## Next Steps

1. **Verify student record exists** in Supabase
2. **Clear browser cache** and login again
3. **Check console logs** for fetch confirmation
4. **Verify profile page** shows real data

If you follow these steps, you'll see Ayushman's real data instead of Om Sahoo's hardcoded data!
