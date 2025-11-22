-- ============================================
-- CREATE AYUSHMAN'S STUDENT RECORD
-- ============================================
-- Run this in Supabase SQL Editor to create Ayushman's record

INSERT INTO students (
  name,
  email,
  phone,
  gender,
  address,
  dob,
  program,
  emergency_contact_name,
  emergency_contact_phone,
  join_date,
  status
) VALUES (
  'Ayushman Patra',
  'ayushman@example.com',
  '9876543210',
  'male',
  '123 Main Street, City, Country',
  '2000-01-15',
  'B.Sc. Computer Science',
  'John Doe',
  '9876543211',
  '2024-01-15',
  'Active'
);

-- Verify it was created
SELECT * FROM students WHERE email = 'ayushman@example.com';
