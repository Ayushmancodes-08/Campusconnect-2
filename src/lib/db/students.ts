import { supabase } from '@/lib/supabase';
import type { Student } from './schema';

/**
 * Student Database Service
 * Provides CRUD operations for student records in Supabase
 */

export class StudentService {
  /**
   * Fetch all students
   */
  static async getAll(): Promise<Student[]> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch students: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  }

  /**
   * Fetch a single student by ID
   */
  static async getById(id: string): Promise<Student | null> {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid student ID provided');
      }

      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        throw new Error(`Failed to fetch student: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error fetching student:', error);
      throw error;
    }
  }

  /**
   * Create a new student
   */
  static async create(student: Omit<Student, 'id' | 'created_at' | 'updated_at'>): Promise<Student> {
    try {
      // Validate required fields
      if (!student.name || !student.email) {
        throw new Error('Name and email are required fields');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(student.email)) {
        throw new Error('Invalid email format');
      }

      // Prepare student data - only include fields that exist
      const studentData: any = {
        name: student.name,
        email: student.email,
        phone: student.phone,
        gender: student.gender,
        join_date: student.join_date,
        status: student.status,
      };

      // Only include address if it's provided
      if (student.address) {
        studentData.address = student.address;
      }

      const { data, error } = await supabase
        .from('students')
        .insert([studentData])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error('A student with this email already exists');
        }
        // If schema cache error for address field, try without it
        if (error.message && (error.message.includes('address') || error.message.includes('schema cache'))) {
          console.warn('Address field not available in schema, creating student without it:', error.message);
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('students')
            .insert([{
              name: student.name,
              email: student.email,
              phone: student.phone,
              gender: student.gender,
              join_date: student.join_date,
              status: student.status,
            }])
            .select()
            .single();
          
          if (fallbackError) {
            throw new Error(`Failed to create student: ${fallbackError.message}`);
          }
          return fallbackData;
        }
        throw new Error(`Failed to create student: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  }

  /**
   * Update an existing student
   */
  static async update(id: string, updates: Partial<Omit<Student, 'id' | 'created_at' | 'updated_at'>>): Promise<Student> {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid student ID provided');
      }

      // Validate email if being updated
      if (updates.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updates.email)) {
          throw new Error('Invalid email format');
        }
      }

      // Prepare update data - filter out undefined values
      const updateData: any = {};
      Object.keys(updates).forEach(key => {
        if (updates[key as keyof typeof updates] !== undefined) {
          updateData[key] = updates[key as keyof typeof updates];
        }
      });

      const { data, error } = await supabase
        .from('students')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error('A student with this email already exists');
        }
        throw new Error(`Failed to update student: ${error.message}`);
      }

      if (!data) {
        throw new Error('Student not found');
      }

      return data;
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  }

  /**
   * Delete a student
   */
  static async delete(id: string): Promise<void> {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid student ID provided');
      }

      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to delete student: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  }

  /**
   * Search students by name or email
   */
  static async search(query: string): Promise<Student[]> {
    try {
      if (!query || typeof query !== 'string') {
        throw new Error('Search query must be a non-empty string');
      }

      const { data, error } = await supabase
        .from('students')
        .select('*')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to search students: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error searching students:', error);
      throw error;
    }
  }

  /**
   * Get students by status
   */
  static async getByStatus(status: 'Active' | 'Inactive' | 'Suspended'): Promise<Student[]> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch students by status: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching students by status:', error);
      throw error;
    }
  }

  /**
   * Get student by email
   */
  static async getByEmail(email: string): Promise<Student | null> {
    try {
      if (!email || typeof email !== 'string') {
        console.warn('StudentService.getByEmail - Invalid email:', email);
        return null;
      }

      console.log('StudentService.getByEmail - Querying for email:', email);

      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        console.warn('StudentService.getByEmail - Supabase error:', error);
        if (error.code === 'PGRST116') {
          console.warn('StudentService.getByEmail - Student not found for email:', email);
          return null; // Not found
        }
        throw new Error(`Failed to fetch student by email: ${error.message}`);
      }

      console.log('StudentService.getByEmail - Found student:', data);
      return data;
    } catch (error) {
      console.error('StudentService.getByEmail - Error:', error);
      return null; // Return null instead of throwing to prevent app crash
    }
  }

  /**
   * Validate student credentials (email and password)
   * Note: In production, use Supabase Auth instead of storing passwords
   */
  static async validateCredentials(email: string, password: string): Promise<Student | null> {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // First, check if credentials exist in generated credentials (from admin approval)
      const storedCredentialsString = typeof window !== 'undefined' ? localStorage.getItem('userCredentials') : null;
      const storedCredentials = storedCredentialsString ? JSON.parse(storedCredentialsString) : [];
      const foundCredential = storedCredentials.find((cred: any) => cred.email === email && cred.password === password);

      if (foundCredential) {
        // Credentials are valid, now fetch the student data
        const student = await this.getByEmail(email);
        return student;
      }

      // If not found in generated credentials, return null
      return null;
    } catch (error) {
      console.error('Error validating credentials:', error);
      throw error;
    }
  }
}
