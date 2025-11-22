# Quick Check - Is Ayushman's Data in Supabase?

## Step 1: Open Supabase Dashboard
1. Go to your Supabase project
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"

## Step 2: Run This Query
Copy and paste this into the SQL editor:

```sql
SELECT * FROM students WHERE email = 'ayushman@example.com';
```

Then click "Run" (or press Ctrl+Enter)

## Step 3: Check Results

### If you see a row with Ayushman's data:
✅ **Good!** The student record exists in Supabase
- Go to browser and clear cache (Ctrl+Shift+Delete)
- Logout and login again as Ayushman
- Go to /dashboard/settings
- You should now see Ayushman's real data

### If you see "No rows":
❌ **Problem!** Ayushman's student record doesn't exist in Supabase

**Solution:** Create the record manually:

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

Then:
1. Click "Run"
2. Go back to browser
3. Clear cache (Ctrl+Shift+Delete)
4. Logout and login again as Ayushman
5. Go to /dashboard/settings
6. You should now see Ayushman's real data

## Step 4: Verify in Browser

After creating/confirming the record:

1. **Open DevTools** (F12)
2. **Go to Console tab**
3. **Logout** from the app
4. **Clear localStorage** by running:
   ```javascript
   localStorage.clear()
   ```
5. **Refresh page** (F5)
6. **Login as Ayushman** again
7. **Check console** for logs showing student data being fetched
8. **Go to /dashboard/settings**
9. **Verify** you see Ayushman's real data (NOT Om Sahoo)

## Expected Result

Profile page should show:
- **Name:** Ayushman Patra
- **Email:** ayushman@example.com
- **Phone:** 9876543210
- **Gender:** male
- **Address:** 123 Main Street, City, Country

NOT:
- **Name:** Om Sahoo
- **Email:** osahoo9178@gmail.com
- **Phone:** (123) 456-7890
- **Address:** 123 University Ave, City, Country

## If Still Not Working

1. **Check browser console** for error messages
2. **Check Supabase logs** for database errors
3. **Verify email matches exactly** (case-sensitive)
4. **Try different email** if there are issues
5. **Contact support** with console error messages

## Quick SQL Queries

### Check all students
```sql
SELECT id, name, email, phone FROM students;
```

### Check specific student
```sql
SELECT * FROM students WHERE email = 'ayushman@example.com';
```

### Delete student (if needed to re-create)
```sql
DELETE FROM students WHERE email = 'ayushman@example.com';
```

### Update student data
```sql
UPDATE students 
SET phone = '9876543210', address = '123 Main Street, City, Country'
WHERE email = 'ayushman@example.com';
```

---

**That's it!** Follow these steps and you'll have Ayushman's real data showing in the profile instead of Om Sahoo's hardcoded data.
