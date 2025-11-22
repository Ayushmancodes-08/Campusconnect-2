# Invalid Role Error Messages

## Overview

All login violations now show "Invalid Role" error instead of generic "Login Failed" messages. This provides clear feedback when role restrictions are violated.

---

## Error Scenarios & Messages

### 1. **Student Trying to Login as Teacher**

**Violation:** Students can ONLY login as "Student" role

**Error Message:**
```
Title: Invalid Role
Description: This account is registered as student. Students can only login as "Student" and Teachers can only login as "Teacher".
```

**Example:**
```
1. Student email: john@example.com
2. Student password: correct_password
3. Selected role: Teacher ❌
4. Result: Invalid Role error
5. Solution: Select "Student" role
```

---

### 2. **Student Trying to Login as Admin**

**Violation:** Students cannot login as Admin (hardcoded role)

**Error Message:**
```
Title: Invalid Role
Description: Invalid email or password for this role.
```

**Example:**
```
1. Student email: john@example.com
2. Student password: correct_password
3. Selected role: Admin ❌
4. Result: Invalid Role error
5. Solution: Select "Student" role
```

---

### 3. **Teacher Trying to Login as Student**

**Violation:** Teachers can ONLY login as "Teacher" role

**Error Message:**
```
Title: Invalid Role
Description: This account is registered as teacher. Students can only login as "Student" and Teachers can only login as "Teacher".
```

**Example:**
```
1. Teacher email: jane@example.com
2. Teacher password: correct_password
3. Selected role: Student ❌
4. Result: Invalid Role error
5. Solution: Select "Teacher" role
```

---

### 4. **Teacher Trying to Login as Finance**

**Violation:** Teachers cannot login as Finance (hardcoded role)

**Error Message:**
```
Title: Invalid Role
Description: Invalid email or password for this role.
```

**Example:**
```
1. Teacher email: jane@example.com
2. Teacher password: correct_password
3. Selected role: Finance ❌
4. Result: Invalid Role error
5. Solution: Select "Teacher" role
```

---

### 5. **Admin Trying to Login as Student**

**Violation:** Admin credentials cannot be used for Student role

**Error Message:**
```
Title: Invalid Role
Description: Invalid email or password.
```

**Example:**
```
1. Email: admin@campus.edu
2. Password: password
3. Selected role: Student ❌
4. Result: Invalid Role error
5. Solution: Select "Admin" role
```

---

### 6. **Finance Trying to Login as Hostel**

**Violation:** Finance credentials cannot be used for Hostel role

**Error Message:**
```
Title: Invalid Role
Description: Invalid email or password for this role.
```

**Example:**
```
1. Email: finance@campus.edu
2. Password: password
3. Selected role: Hostel ❌
4. Result: Invalid Role error
5. Solution: Select "Finance" role
```

---

### 7. **Hostel Trying to Login as Admin**

**Violation:** Hostel credentials cannot be used for Admin role

**Error Message:**
```
Title: Invalid Role
Description: Invalid email or password for this role.
```

**Example:**
```
1. Email: hostel@campus.edu
2. Password: password
3. Selected role: Admin ❌
4. Result: Invalid Role error
5. Solution: Select "Hostel" role
```

---

### 8. **Invalid Email/Password**

**Violation:** Credentials don't exist in system

**Error Message:**
```
Title: Invalid Role
Description: Invalid email or password.
```

**Example:**
```
1. Email: nonexistent@example.com
2. Password: wrong_password
3. Selected role: Student
4. Result: Invalid Role error
5. Solution: Check email and password
```

---

## Error Message Types

### Type 1: Role Mismatch (Dynamic Roles)
```
"This account is registered as {role}. Students can only login as "Student" and Teachers can only login as "Teacher"."
```
**When:** Student/Teacher tries to login with wrong role
**Solution:** Select the correct role

---

### Type 2: Invalid Credentials (Hardcoded Roles)
```
"Invalid email or password for this role."
```
**When:** Wrong email/password for Admin/Finance/Hostel
**Solution:** Check credentials for selected role

---

### Type 3: Credentials Not Found
```
"Invalid email or password."
```
**When:** Email/password combination doesn't exist
**Solution:** Check email and password

---

### Type 4: Invalid Role Selection
```
"Please select a valid role to login."
```
**When:** System error or invalid role selected
**Solution:** Select a valid role from dropdown

---

## Role Restriction Rules

### ✅ Allowed Logins

| Role | Can Login As |
|------|-------------|
| Student | Student only |
| Teacher | Teacher only |
| Admin | Admin only |
| Finance | Finance only |
| Hostel | Hostel only |

### ❌ Blocked Logins

| Account Type | Cannot Login As |
|-------------|-----------------|
| Student | Teacher, Admin, Finance, Hostel |
| Teacher | Student, Admin, Finance, Hostel |
| Admin | Student, Teacher, Finance, Hostel |
| Finance | Student, Teacher, Admin, Hostel |
| Hostel | Student, Teacher, Admin, Finance |

---

## Implementation Details

**File:** `src/components/auth/login-form.tsx`

**Key Logic:**
```typescript
// All errors now show "Invalid Role" title
toast({
  variant: "destructive",
  title: "Invalid Role",  // ← Changed from "Login Failed"
  description: "...",
});
```

**Error Scenarios:**
1. Hardcoded role with wrong credentials → "Invalid Role"
2. Dynamic role with role mismatch → "Invalid Role"
3. Credentials not found → "Invalid Role"
4. Invalid role selection → "Invalid Role"

---

## Testing Invalid Role Errors

### Test 1: Student Role Violation
```
1. Create student account
2. Login with student credentials
3. Select "Teacher" role
4. Expected: "Invalid Role" error
5. Select "Student" role
6. Expected: Login successful ✅
```

### Test 2: Teacher Role Violation
```
1. Create teacher account
2. Login with teacher credentials
3. Select "Student" role
4. Expected: "Invalid Role" error
5. Select "Teacher" role
6. Expected: Login successful ✅
```

### Test 3: Admin Role Violation
```
1. Go to login page
2. Enter admin@campus.edu & password
3. Select "Student" role
4. Expected: "Invalid Role" error
5. Select "Admin" role
6. Expected: Login successful ✅
```

### Test 4: Finance Role Violation
```
1. Go to login page
2. Enter finance@campus.edu & password
3. Select "Admin" role
4. Expected: "Invalid Role" error
5. Select "Finance" role
6. Expected: Login successful ✅
```

### Test 5: Hostel Role Violation
```
1. Go to login page
2. Enter hostel@campus.edu & password
3. Select "Finance" role
4. Expected: "Invalid Role" error
5. Select "Hostel" role
6. Expected: Login successful ✅
```

---

## User Experience

### Before (Generic Error)
```
❌ "Login Failed"
   "Invalid email or password."
   (User doesn't know if it's credentials or role issue)
```

### After (Clear Error)
```
❌ "Invalid Role"
   "This account is registered as student. Students can only login as "Student" and Teachers can only login as "Teacher"."
   (User knows exactly what went wrong)
```

---

## Summary

All login violations now show **"Invalid Role"** error with specific descriptions:
- ✅ Clear error title
- ✅ Specific error description
- ✅ Guides user to correct action
- ✅ Prevents role confusion
- ✅ Enforces role restrictions

