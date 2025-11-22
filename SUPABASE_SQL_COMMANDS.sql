-- ============================================
-- SUPABASE SQL COMMANDS FOR STUDENT DATA
-- ============================================

-- 1. CHECK IF AYUSHMAN EXISTS
SELECT * FROM students WHERE email = 'ayushman@example.com';

-- 2. IF NOT EXISTS, CREATE AYUSHMAN'S RECORD
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

-- 3. VERIFY AYUSHMAN WAS CREATED
SELECT * FROM students WHERE email = 'ayushman@example.com';

-- 4. VIEW ALL STUDENTS
SELECT id, name, email, phone, gender, address, status FROM students;

-- 5. UPDATE AYUSHMAN'S DATA (if needed)
UPDATE students 
SET 
  phone = '9876543210',
  address = '123 Main Street, City, Country',
  gender = 'male'
WHERE email = 'ayushman@example.com';

-- 6. DELETE AYUSHMAN (if you need to start over)
DELETE FROM students WHERE email = 'ayushman@example.com';

-- 7. CHECK STUDENT COUNT
SELECT COUNT(*) as total_students FROM students;

-- 8. FIND STUDENT BY EMAIL
SELECT * FROM students WHERE email = 'ayushman@example.com';

-- 9. FIND STUDENT BY NAME
SELECT * FROM students WHERE name LIKE '%Ayushman%';

-- 10. GET ALL ACTIVE STUDENTS
SELECT * FROM students WHERE status = 'Active';

-- ============================================
-- HOW TO USE:
-- ============================================
-- 1. Go to Supabase Dashboard
-- 2. Click "SQL Editor" in left sidebar
-- 3. Click "New Query"
-- 4. Copy and paste the command you want to run
-- 5. Click "Run" or press Ctrl+Enter
-- 6. Check the results
-- ============================================

-- QUICK STEPS TO FIX THE ISSUE:
-- 1. Run command #1 to check if Ayushman exists
-- 2. If no results, run command #2 to create Ayushman
-- 3. Run command #3 to verify creation
-- 4. Go back to browser and clear cache
-- 5. Logout and login as Ayushman again
-- 6. Go to /dashboard/settings
-- 7. You should now see Ayushman's real data!
