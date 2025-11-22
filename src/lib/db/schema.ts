/**
 * Database Schema Definitions
 * 
 * This file documents the Supabase table schemas and provides TypeScript types
 * for type-safe database operations.
 */

export interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  dob?: string;
  program?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  join_date?: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  created_at: string;
  updated_at: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  time: string;
  class: string;
  location: string;
  created_at: string;
  updated_at: string;
}

export interface Holiday {
  id: string;
  date: string;
  name: string;
  created_at: string;
  updated_at: string;
}

/**
 * SQL Schema Documentation
 * 
 * STUDENTS TABLE:
 * - id: UUID (Primary Key, auto-generated)
 * - name: TEXT (Required)
 * - email: TEXT (Required, Unique)
 * - phone: TEXT (Optional)
 * - gender: TEXT (Optional, Enum: 'male', 'female', 'other')
 * - address: TEXT (Optional)
 * - join_date: DATE (Optional)
 * - status: TEXT (Enum: 'Active', 'Inactive', 'Suspended', Default: 'Active')
 * - created_at: TIMESTAMP (Auto-set to NOW())
 * - updated_at: TIMESTAMP (Auto-set to NOW())
 * 
 * STAFF TABLE:
 * - id: UUID (Primary Key, auto-generated)
 * - name: TEXT (Required)
 * - email: TEXT (Required, Unique)
 * - phone: TEXT (Optional)
 * - department: TEXT (Required)
 * - status: TEXT (Enum: 'Active', 'On Leave', 'Inactive', Default: 'Active')
 * - created_at: TIMESTAMP (Auto-set to NOW())
 * - updated_at: TIMESTAMP (Auto-set to NOW())
 * 
 * COURSES TABLE:
 * - id: UUID (Primary Key, auto-generated)
 * - time: TEXT (Required)
 * - class: TEXT (Required)
 * - location: TEXT (Required)
 * - created_at: TIMESTAMP (Auto-set to NOW())
 * - updated_at: TIMESTAMP (Auto-set to NOW())
 * 
 * HOLIDAYS TABLE:
 * - id: UUID (Primary Key, auto-generated)
 * - date: DATE (Required)
 * - name: TEXT (Required)
 * - created_at: TIMESTAMP (Auto-set to NOW())
 * - updated_at: TIMESTAMP (Auto-set to NOW())
 */
