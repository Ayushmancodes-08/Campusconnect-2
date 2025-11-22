import { supabase } from '@/lib/supabase';
import type { Holiday } from './schema';

/**
 * Holiday Database Service
 * Provides CRUD operations for holiday records in Supabase
 */

export class HolidayService {
  /**
   * Fetch all holidays
   */
  static async getAll(): Promise<Holiday[]> {
    try {
      const { data, error } = await supabase
        .from('holidays')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch holidays: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching holidays:', error);
      throw error;
    }
  }

  /**
   * Fetch a single holiday by ID
   */
  static async getById(id: string): Promise<Holiday | null> {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid holiday ID provided');
      }

      const { data, error } = await supabase
        .from('holidays')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        throw new Error(`Failed to fetch holiday: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error fetching holiday:', error);
      throw error;
    }
  }

  /**
   * Create a new holiday
   */
  static async create(holiday: Omit<Holiday, 'id' | 'created_at' | 'updated_at'>): Promise<Holiday> {
    try {
      // Validate required fields
      if (!holiday.date || !holiday.name) {
        throw new Error('Date and name are required fields');
      }

      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(holiday.date)) {
        throw new Error('Date must be in YYYY-MM-DD format');
      }

      const { data, error } = await supabase
        .from('holidays')
        .insert([holiday])
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create holiday: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error creating holiday:', error);
      throw error;
    }
  }

  /**
   * Update an existing holiday
   */
  static async update(id: string, updates: Partial<Omit<Holiday, 'id' | 'created_at' | 'updated_at'>>): Promise<Holiday> {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid holiday ID provided');
      }

      // Validate date format if being updated
      if (updates.date) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(updates.date)) {
          throw new Error('Date must be in YYYY-MM-DD format');
        }
      }

      const { data, error } = await supabase
        .from('holidays')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update holiday: ${error.message}`);
      }

      if (!data) {
        throw new Error('Holiday not found');
      }

      return data;
    } catch (error) {
      console.error('Error updating holiday:', error);
      throw error;
    }
  }

  /**
   * Delete a holiday
   */
  static async delete(id: string): Promise<void> {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid holiday ID provided');
      }

      const { error } = await supabase
        .from('holidays')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to delete holiday: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting holiday:', error);
      throw error;
    }
  }

  /**
   * Search holidays by name
   */
  static async search(query: string): Promise<Holiday[]> {
    try {
      if (!query || typeof query !== 'string') {
        throw new Error('Search query must be a non-empty string');
      }

      const { data, error } = await supabase
        .from('holidays')
        .select('*')
        .ilike('name', `%${query}%`)
        .order('date', { ascending: true });

      if (error) {
        throw new Error(`Failed to search holidays: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error searching holidays:', error);
      throw error;
    }
  }

  /**
   * Get holidays within a date range
   */
  static async getByDateRange(startDate: string, endDate: string): Promise<Holiday[]> {
    try {
      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
        throw new Error('Dates must be in YYYY-MM-DD format');
      }

      const { data, error } = await supabase
        .from('holidays')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch holidays by date range: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching holidays by date range:', error);
      throw error;
    }
  }

  /**
   * Get upcoming holidays (from today onwards)
   */
  static async getUpcoming(): Promise<Holiday[]> {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('holidays')
        .select('*')
        .gte('date', today)
        .order('date', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch upcoming holidays: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching upcoming holidays:', error);
      throw error;
    }
  }
}
