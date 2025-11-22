# Quick Start Guide - Student Profile Flow

## 🚀 Quick Test (5 minutes)

### Step 1: Create Student Application
```
1. Go to http://localhost:3000/admissions
2. Fill form:
   - First Name: John
   - Last Name: Doe
   - Email: john.doe@example.com
   - Phone: 9876543210
   - Address: 123 Main St, City, Country
   - Gender: Male
   - DOB: 2000-01-15
   - Program: B.Sc. Computer Science
   - Emergency Contact: Jane Doe, 9876543211
3. Click "Submit Application"
```

### Step 2: Approve Student (Admin)
```
1. Go to http://localhost:3000/login
2. Select Role: Admin
3. Email: admin@campus.edu
4. Password: password
5. Click "Sign In"
6. Go to /dashboard/applications
7. Find "John Doe" in pending applications
8. Click "Approve"
9. Enter Student ID: STU001
10. Click "Approve Admission"
```

### Step 3: Student Login
```
1. Go to http://localhost:3000/login
2. Select Role: Student
3. Email: john.doe@example.com
4. Password: (check browser console or localStorage)
5. Click "Sign In"
```

### Step 4: View Profile
```
1. Go to /dashboard/settings
2. Click "Profile" tab
3. Verify data:
   ✓ Name: John Doe
   ✓ Email: john.doe@example.com
   ✓ Phone: 9876543210
   ✓ Address: 123 Main St, City, Country
   ✓ Gender: Male
```

## 📊 Data Flow Summary

```
Admission Form → localStorage → Admin Approval → Supabase → Student Login → Profile Display
```

## 🔍 Verification Points

### Check 1: Application Created
- Open DevTools → Application → localStorage
- Look for `studentApplications` key
- Should contain the student data

### Check 2: Student Approved
- Go to Supabase dashboard
- Check `students` table
- Should see new student record

### Check 3: Student Data Fetched
- Open DevTools → Console
- Look for logs: "useCurrentUser - Fetched student:"
- Should show student data

### Check 4: Profile Displayed
- Go to /dashboard/settings
- All fields should show real data
- NOT "Om Sahoo" placeholder

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| Student sees "Om Sahoo" | Check if student in Supabase |
| Address not showing | Wait for schema cache refresh |
| Can't approve student | Check browser console for errors |
| Can't login as student | Verify email/password in localStorage |

## 📝 Key Files

| File | Purpose |
|------|---------|
| `admissions-form.tsx` | Captures student data |
| `applications-dashboard.tsx` | Approves students |
| `use-current-user.ts` | Fetches student data |
| `settings/page.tsx` | Displays profile |
| `students.ts` | Database operations |

## 🎯 Expected Behavior

✅ Student fills form → Data saved to localStorage
✅ Admin approves → Student created in Supabase
✅ Student logs in → Real data fetched from Supabase
✅ Profile shows → Actual student information (not hardcoded)

## ⚠️ Known Limitations

- Address field may not show immediately due to Supabase schema cache
- Will appear within 24 hours or after manual schema refresh
- System continues to work even if address field unavailable

## 🔐 Test Credentials

### Admin
- Email: admin@campus.edu
- Password: password

### Student (After Approval)
- Email: (whatever you entered in form)
- Password: (auto-generated, check localStorage)

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check Supabase dashboard for data
3. Check localStorage for stored data
4. Review STUDENT_PROFILE_FIX.md for detailed troubleshooting
