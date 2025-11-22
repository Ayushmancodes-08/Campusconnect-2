# Fix Ayushman's Profile - Step by Step

## The Problem
You're logged in as Ayushman but seeing Om Sahoo's hardcoded data instead of Ayushman's real information.

## The Root Cause
Ayushman's student record doesn't exist in Supabase database, so the system can't fetch real data.

## The Solution (3 Simple Steps)

### STEP 1: Check if Ayushman's Data Exists in Supabase

1. Go to your Supabase project dashboard
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New Query"**
4. Copy and paste this:
   ```sql
   SELECT * FROM students WHERE email = 'ayushman@example.com';
   ```
5. Click **"Run"** (or press Ctrl+Enter)

**What to expect:**
- ✅ If you see a row with Ayushman's data → Go to STEP 3
- ❌ If you see "No rows" → Go to STEP 2

---

### STEP 2: Create Ayushman's Student Record

If Ayushman's record doesn't exist, create it:

1. In the same SQL Editor, click **"New Query"**
2. Copy and paste this:
   ```sql
   INSERT INTO students (name, email, phone, gender, address, join_date, status)
   VALUES (
     'Ayushman Patra',
     'ayushman@example.com',
     '9876543210',
     'male',
     '123 Main Street, City, Country',
     '2024-01-15',
     'Active'
   );
   ```
3. Click **"Run"**
4. You should see "1 row inserted"

**Verify it was created:**
1. Click **"New Query"** again
2. Run this:
   ```sql
   SELECT * FROM students WHERE email = 'ayushman@example.com';
   ```
3. You should see Ayushman's record with all the data

---

### STEP 3: Clear Browser Cache and Login Again

1. **Close all browser tabs** with the app
2. **Open a new tab** and go to your app
3. **Open DevTools** (Press F12)
4. **Go to Application tab** → **localStorage**
5. **Clear all data** (right-click and delete, or run in console):
   ```javascript
   localStorage.clear()
   ```
6. **Refresh the page** (F5)
7. **Login as Ayushman** again:
   - Email: ayushman@example.com
   - Password: (the password you set)
8. **Go to /dashboard/settings**
9. **Check the Profile tab**

---

## Expected Result

After following these steps, you should see:

✅ **Name:** Ayushman Patra (NOT Om Sahoo)
✅ **Email:** ayushman@example.com (NOT osahoo9178@gmail.com)
✅ **Phone:** 9876543210 (NOT (123) 456-7890)
✅ **Address:** 123 Main Street, City, Country (NOT 123 University Ave, City, Country)
✅ **Gender:** male

---

## Verification in Browser Console

To verify everything is working:

1. **Open DevTools** (F12)
2. **Go to Console tab**
3. **Look for these logs:**
   ```
   useCurrentUser - Fetching student data for email: ayushman@example.com
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

If you see these logs with Ayushman's data, everything is working correctly!

---

## Troubleshooting

### Issue: Still seeing Om Sahoo after creating record

**Solution:**
1. Make sure you cleared localStorage completely
2. Close ALL browser tabs
3. Open a completely new browser window
4. Login again
5. Check console logs

### Issue: Getting error when creating record

**Solution:**
1. Check if email already exists (run SELECT query first)
2. If it exists, delete it first:
   ```sql
   DELETE FROM students WHERE email = 'ayushman@example.com';
   ```
3. Then create it again

### Issue: Can't find the SQL Editor

**Solution:**
1. Go to Supabase dashboard
2. Click on your project
3. In the left sidebar, look for "SQL Editor"
4. If not visible, click the menu icon (≡) to expand

### Issue: Query returns error

**Solution:**
1. Make sure you're in the right database
2. Check that the email is spelled correctly
3. Copy the exact SQL from this guide
4. Check Supabase status page for any issues

---

## Quick Reference

| What | Where | How |
|------|-------|-----|
| Check if student exists | Supabase SQL Editor | `SELECT * FROM students WHERE email = 'ayushman@example.com';` |
| Create student | Supabase SQL Editor | Use INSERT command from STEP 2 |
| Clear browser cache | Browser DevTools | localStorage.clear() |
| View profile | App | Go to /dashboard/settings |
| Check logs | Browser Console | F12 → Console tab |

---

## Summary

1. ✅ Check Supabase for Ayushman's record
2. ✅ Create record if it doesn't exist
3. ✅ Clear browser cache
4. ✅ Login again
5. ✅ Verify profile shows real data

**That's it!** You'll now see Ayushman's real data instead of Om Sahoo's hardcoded data.

---

## Need Help?

If you're still having issues:

1. **Check the console logs** - they tell you what's happening
2. **Verify the SQL query results** - make sure data is in Supabase
3. **Clear cache completely** - sometimes browser caches old data
4. **Try a different email** - if there are conflicts
5. **Check Supabase status** - make sure database is working

Good luck! 🚀
