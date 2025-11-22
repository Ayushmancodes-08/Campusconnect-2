# Supabase Database Setup Guide

This guide explains how to set up the Supabase database tables for the CampusConnect ERP application.

## Prerequisites

1. A Supabase project created at https://supabase.com
2. Your Supabase URL and Anon Key (available in Project Settings > API)
3. Environment variables configured in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Creating Database Tables

### Option 1: Using Supabase Dashboard (Recommended for First-Time Setup)

1. Go to your Supabase project dashboard
2. Navigate to the **SQL Editor** section
3. Click **New Query**
4. Copy and paste the SQL from `supabase/migrations/001_create_tables.sql`
5. Click **Run** to execute the migration
6. Verify all tables are created in the **Table Editor** section

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
supabase db push
```

This will execute all migrations in the `supabase/migrations/` directory.

## Table Schemas

### Students Table
- **id**: UUID (Primary Key)
- **name**: Text (Required)
- **email**: Text (Required, Unique)
- **phone**: Text (Optional)
- **gender**: Text (Optional) - Values: 'male', 'female', 'other'
- **join_date**: Date (Optional)
- **status**: Text (Default: 'Active') - Values: 'Active', 'Inactive', 'Suspended'
- **created_at**: Timestamp (Auto-set)
- **updated_at**: Timestamp (Auto-set)

### Staff Table
- **id**: UUID (Primary Key)
- **name**: Text (Required)
- **email**: Text (Required, Unique)
- **phone**: Text (Optional)
- **department**: Text (Required)
- **status**: Text (Default: 'Active') - Values: 'Active', 'On Leave', 'Inactive'
- **created_at**: Timestamp (Auto-set)
- **updated_at**: Timestamp (Auto-set)

### Courses Table
- **id**: UUID (Primary Key)
- **time**: Text (Required)
- **class**: Text (Required)
- **location**: Text (Required)
- **created_at**: Timestamp (Auto-set)
- **updated_at**: Timestamp (Auto-set)

### Holidays Table
- **id**: UUID (Primary Key)
- **date**: Date (Required)
- **name**: Text (Required)
- **created_at**: Timestamp (Auto-set)
- **updated_at**: Timestamp (Auto-set)

## Verification

After creating the tables, verify they exist:

1. Go to **Table Editor** in your Supabase dashboard
2. You should see four tables:
   - `students`
   - `staff`
   - `courses`
   - `holidays`
3. Click on each table to verify the columns and constraints are correct

## Indexes

The migration also creates the following indexes for performance optimization:
- `idx_students_email` on students(email)
- `idx_students_status` on students(status)
- `idx_staff_email` on staff(email)
- `idx_staff_department` on staff(department)
- `idx_staff_status` on staff(status)
- `idx_courses_class` on courses(class)
- `idx_holidays_date` on holidays(date)

## Next Steps

Once the tables are created:

1. The application is ready to use the database service layer
2. Implement CRUD operations in `src/lib/db/` services
3. Update components to fetch data from Supabase instead of mock data
4. Test all database operations

## Troubleshooting

### Tables Already Exist
If you see an error about tables already existing, the migration uses `CREATE TABLE IF NOT EXISTS`, so it's safe to run multiple times.

### Connection Issues
If you get connection errors:
1. Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
2. Check that your Supabase project is active
3. Ensure your IP is not blocked by Supabase firewall rules

### Permission Errors
If you get permission errors:
1. Ensure you're using the correct Anon Key (not the Service Role Key)
2. Check that your Supabase project's authentication is properly configured
