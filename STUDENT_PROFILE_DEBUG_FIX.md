# Debug & Fix: Student Profile Still Showing Om Sahoo

## Problem

Even after the previous fixes, the profile settings page was still showing Om Sahoo's hardcoded data instead of the logged-in student's information.

## Root Cause Analysis

The issue was that `studentData` from `useCurrentUser` hook was returning `null` because:

1. **Supabase Query Failing**: The `StudentService.getByEmail()` was throwing errors silently
2. **No Fallback Logic**: Settings page had no fallback when Supabase data wasn't available
3. **Silent Failures**: Errors were being caught but not logged properly

## Solution Implemented

### 1. Enhanced useCurrentUser Hook with Logging

**File**: `src/hooks/use-current-user.ts`

Added comprehensive logging to debug the data fetching:

```typescript
console.log('useCurrentUser - Loading:', { storedRole, storedEmail, isLoggedIn });
console.log('useCurrentUser - Fetching student data for email:', storedEmail);
console.log('useCurrentUser - Fetched student:', student);
console.warn('useCurrentUser - Student not found in Supabase for email:', storedEmail);
```

### 2. Improved StudentService.getByEmail Error Handling

**File**: `src/lib/db/students.ts`

```typescript
// Before: Threw errors silently
// After: Returns null instead of throwing, with detailed logging

static async getByEmail(email: string): Promise<Student | null> {
  try {
    console.log('StudentService.getByEmail - Querying for email:', email);
    // ... query logic ...
    console.log('StudentService.getByEmail - Found student:', data);
    return data;
  } catch (error) {
    console.error('StudentService.getByEmail - Error:', error);
    return null; // Return null instead of throwing
  }
}
```

### 3. Added Fallback Logic to Settings Page

**File**: `src/components/dashboard/settings/page.tsx`

Added fallback to fetch student data from localStorage credentials if Supabase data is unavailable:

```typescript
// Fetch student data from credentials if Supabase data is not available
useEffect(() => {
  if (role === 'student' && email && !studentData) {
    const storedCredentialsString = localStorage.getItem('userCredentials');
    const storedCredentials = storedCredentialsString ? JSON.parse(storedCredentialsString) : [];
    const foundCredential = storedCredentials.find((cred: any) => cred.email === email);
    
    if (foundCredential) {
      setProfileData({
        name: email.split('@')[0],
        email: email,
        phone: foundCredential.password || '(123) 456-7890'
      });
    }
  } else if (studentData) {
    setProfileData({
      name: studentData.name,
      email: studentData.email,
      phone: studentData.phone || '(123) 456-7890'
    });
  }
}, [role, email, studentData]);
```

## How It Works Now

### Data Fetching Priority

```
1. Try to fetch from Supabase using StudentService.getByEmail()
   ├─ Success → Use Supabase data
   └─ Fail → Continue to step 2

2. Try to fetch from localStorage credentials
   ├─ Found → Use credential data
   └─ Not found → Use fallback

3. Display profile with available data
```

### For Ayushman

**Scenario 1: Supabase has data**
- Name: Ayushman Patra (from Supabase)
- Email: ayushman@campus.edu (from Supabase)
- Phone: 9876543210 (from Supabase)

**Scenario 2: Supabase unavailable, credentials available**
- Name: ayushman (from email prefix)
- Email: ayushman@campus.edu (from localStorage)
- Phone: Generated password (from credentials)

## Debugging Steps

If profile still shows Om Sahoo:

1. **Open Browser Console** (F12)
2. **Look for logs**:
   ```
   useCurrentUser - Loading: { storedRole: 'student', storedEmail: 'ayushman@campus.edu', isLoggedIn: true }
   useCurrentUser - Fetching student data for email: ayushman@campus.edu
   StudentService.getByEmail - Querying for email: ayushman@campus.edu
   StudentService.getByEmail - Found student: { id: '...', name: 'Ayushman Patra', ... }
   ```

3. **If you see "Student not found"**:
   - Check if student was actually created in Supabase
   - Verify email matches exactly (case-sensitive)
   - Check Supabase students table directly

4. **If you see errors**:
   - Check Supabase connection
   - Verify API keys in .env.local
   - Check CORS settings

## Files Modified

1. **`src/hooks/use-current-user.ts`**
   - Added detailed logging
   - Better error handling

2. **`src/lib/db/students.ts`**
   - Added logging to getByEmail()
   - Changed to return null instead of throwing
   - Better error messages

3. **`src/components/dashboard/settings/page.tsx`**
   - Added fallback logic
   - Fetch from credentials if Supabase unavailable
   - Added profileData state
   - Better data handling

## Testing Checklist

- [ ] Open browser console (F12)
- [ ] Log in as Ayushman
- [ ] Check console logs for data fetching
- [ ] Verify profile shows Ayushman's data
- [ ] Log out
- [ ] Log in as Lopamudra
- [ ] Verify profile shows Lopamudra's data
- [ ] Check console for any errors
- [ ] Verify phone number displays correctly

## Expected Console Output

```
useCurrentUser - Loading: { storedRole: 'student', storedEmail: 'ayushman@campus.edu', isLoggedIn: true }
useCurrentUser - Fetching student data for email: ayushman@campus.edu
StudentService.getByEmail - Querying for email: ayushman@campus.edu
StudentService.getByEmail - Found student: { id: 'uuid', name: 'Ayushman Patra', email: 'ayushman@campus.edu', phone: '9876543210', ... }
Settings - Using Supabase student data: { id: 'uuid', name: 'Ayushman Patra', ... }
```

## Troubleshooting

### Profile still shows Om Sahoo

**Check 1**: Is student in Supabase?
```sql
SELECT * FROM students WHERE email = 'ayushman@campus.edu';
```

**Check 2**: Is email stored correctly in localStorage?
```javascript
localStorage.getItem('userEmail')  // Should show ayushman@campus.edu
```

**Check 3**: Is Supabase connection working?
```javascript
// In console
StudentService.getAll()  // Should return list of students
```

### Phone number shows (123) 456-7890

This is the fallback value. To fix:
1. Ensure student was created with phone number
2. Check Supabase students table for phone field
3. Verify phone was saved during approval

## Future Improvements

1. **Direct Supabase Auth**: Use Supabase Auth instead of localStorage
2. **Real-time Updates**: Subscribe to student data changes
3. **Editable Profile**: Allow students to update their information
4. **Profile Picture**: Store and display student's profile picture
5. **Better Error Messages**: Show user-friendly error messages

---

**Status**: ✅ Enhanced with Debugging & Fallback Logic
**Last Updated**: November 22, 2025
