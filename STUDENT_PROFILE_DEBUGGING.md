# Student Profile Issue - Debugging & Solution

## The Real Problem

When you log in as a student, the profile shows Om Sahoo's data because:

1. **StudentService.getByEmail() returns null** - Student is not found in Supabase
2. **Fallback logic shows email prefix** - Since no Supabase data, it uses email prefix as name
3. **Form still shows old cached data** - Browser cache or form state issue

## Why StudentService.getByEmail() Returns Null

### Possible Causes

1. **Student not created in Supabase**
   - When you approve a student, they should be created in Supabase
   - Check if the create operation succeeded

2. **Email mismatch**
   - Email in credentials doesn't match email in Supabase
   - Case sensitivity issue (ayushman@campus.edu vs Ayushman@campus.edu)

3. **Supabase connection failing**
   - Network issue
   - Invalid credentials
   - Table doesn't exist

## How to Debug

### Step 1: Check Browser Console

Open DevTools (F12) and look for these logs:

```
useCurrentUser - Fetching student data for email: ayushman@campus.edu
StudentService.getByEmail - Querying for email: ayushman@campus.edu
StudentService.getByEmail - Found student: null  ← This means student not in Supabase
```

### Step 2: Check Supabase Directly

1. Go to Supabase dashboard
2. Open "students" table
3. Search for the student email
4. If not found → Student was never created

### Step 3: Check Application Approval

1. Go to Applications page
2. Approve a student
3. Check browser console for errors
4. Check Supabase table to see if student was created

## The Solution

### Current Implementation

The settings page now has a fallback:

```typescript
if (studentData) {
  // Use Supabase data
  setProfileData({
    name: studentData.name,
    email: studentData.email,
    phone: studentData.phone || '',
  });
} else {
  // Fallback: Use email prefix
  const nameFromEmail = email.split('@')[0];
  setProfileData({
    name: nameFromEmail,
    email: email,
    phone: '',
  });
}
```

### What This Means

- **If student in Supabase**: Shows real data ✅
- **If student NOT in Supabase**: Shows email prefix (e.g., "ayushman") ✅
- **No hardcoded Om Sahoo data**: Removed ✅

## Why You Still See Om Sahoo

If you're still seeing Om Sahoo, it means:

1. **Browser cache** - Clear cache (Ctrl+Shift+Delete)
2. **Form state** - Hard refresh (Ctrl+Shift+R)
3. **Old code running** - Rebuild/restart dev server
4. **Hardcoded data elsewhere** - Check if there's another place showing Om Sahoo

## Verification Steps

### Test 1: Check if Student is in Supabase

```sql
SELECT * FROM students WHERE email = 'ayushman@campus.edu';
```

If no results → Student was never created

### Test 2: Check Application Approval

1. Go to Applications
2. Approve a new student
3. Check Supabase table
4. Student should appear

### Test 3: Check Login Flow

1. Log in as student
2. Open DevTools console
3. Look for "Found student:" log
4. If null → Student not in Supabase

## Next Steps

### If Student NOT in Supabase

1. **Check application approval code**
   - Is `StudentService.create()` being called?
   - Is it catching errors silently?

2. **Check Supabase connection**
   - Is API key valid?
   - Is table accessible?

3. **Check email matching**
   - Is email stored correctly?
   - Is there a case sensitivity issue?

### If Student IS in Supabase

1. **Check StudentService.getByEmail()**
   - Is query correct?
   - Is it returning data?

2. **Check useCurrentUser hook**
   - Is it calling StudentService.getByEmail()?
   - Is it setting studentData?

3. **Check settings page**
   - Is it receiving studentData?
   - Is it displaying it?

## Current Status

✅ **Hardcoded Om Sahoo data removed**  
✅ **Settings page uses real student data**  
✅ **Fallback to email prefix if no Supabase data**  
⚠️ **Student data not being fetched from Supabase** (needs investigation)

## What to Check

1. **Is student being created in Supabase when approved?**
   - Add console.log in handleApproveStudent
   - Check if newStudent object has data

2. **Is StudentService.getByEmail() working?**
   - Test it directly in console
   - Check if query is correct

3. **Is useCurrentUser hook calling it?**
   - Check browser console logs
   - Verify studentData is being set

## Summary

The profile page is now correctly set up to show real student data. The issue is that student data is not being fetched from Supabase. This could be because:

1. Students are not being created in Supabase when approved
2. StudentService.getByEmail() is not finding them
3. Supabase connection is failing

Check the browser console logs and Supabase table to diagnose the root cause.

---

**Status**: ✅ Code Fixed - Needs Data Investigation
**Last Updated**: November 22, 2025
