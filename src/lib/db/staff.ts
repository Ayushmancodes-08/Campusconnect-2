import { supabase } from '@/lib/supabase';
import type { Staff } from './schema';

/**
 * Staff Database Service
 * Provides CRUD operations for staff records in Supabase
 */

export class StaffService {
  /**
   * Fetch all staff members
   */
  static async getAll(): Promise<Staff[]> {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch staff: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching staff:', error);
      throw error;
    }
  }

  /**
   * Fetch a single staff member by ID
   */
  static async getById(id: string): Promise<Staff | null> {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid staff ID provided');
      }

      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        throw new Error(`Failed to fetch staff member: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error fetching staff member:', error);
      throw error;
    }
  }

  /**
   * Create a new staff member
   */
  static async create(staff: Omit<Staff, 'id' | 'created_at' | 'updated_at'>): Promise<Staff> {
    try {
      // Validate required fields
      if (!staff.name || !staff.email || !staff.department) {
        throw new Error('Name, email, and department are required fields');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(staff.email)) {
        throw new Error('Invalid email format');
      }

      const { data, error } = await supabase
        .from('staff')
        .insert([staff])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error('A staff member with this email already exists');
        }
        throw new Error(`Failed to create staff member: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error creating staff member:', error);
      throw error;
    }
  }

  /**
   * Update an existing staff member
   */
  static async update(id: string, updates: Partial<Omit<Staff, 'id' | 'created_at' | 'updated_at'>>): Promise<Staff> {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid staff ID provided');
      }

      // Validate email if being updated
      if (updates.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updates.email)) {
          throw new Error('Invalid email format');
        }
      }

      const { data, error } = await supabase
        .from('staff')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error('A staff member with this email already exists');
        }
        throw new Error(`Failed to update staff member: ${error.message}`);
      }

      if (!data) {
        throw new Error('Staff member not found');
      }

      return data;
    } catch (error) {
      console.error('Error updating staff member:', error);
      throw error;
    }
  }

  /**
   * Delete a staff member
   */
  static async delete(id: string): Promise<void> {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid staff ID provided');
      }

      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to delete staff member: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting staff member:', error);
      throw error;
    }
  }

  /**
   * Search staff by name or email
   */
  static async search(query: string): Promise<Staff[]> {
    try {
      if (!query || typeof query !== 'string') {
        throw new Error('Search query must be a non-empty string');
      }

      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to search staff: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error searching staff:', error);
      throw error;
    }
  }

  /**
   * Get staff by department
   */
  static async getByDepartment(department: string): Promise<Staff[]> {
    try {
      if (!department || typeof department !== 'string') {
        throw new Error('Department must be a non-empty string');
      }

      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('department', department)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch staff by department: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching staff by department:', error);
      throw error;
    }
  }

  /**
   * Get staff by status
   */
  static async getByStatus(status: 'Active' | 'On Leave' | 'Inactive'): Promise<Staff[]> {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch staff by status: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching staff by status:', error);
      throw error;
    }
  }
}
