import { supabase } from '@/lib/supabase';

/**
 * Hostel Database Schema
 */
export interface Hostel {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  created_at: string;
  updated_at: string;
}

export type CreateHostelInput = Omit<Hostel, 'id' | 'created_at' | 'updated_at'>;
export type UpdateHostelInput = Partial<CreateHostelInput>;

/**
 * Hostel Database Service
 * Provides CRUD operations and real-time subscriptions for hostel records
 */
export class HostelService {
  /**
   * Fetch all hostels
   */
  static async getAll(): Promise<Hostel[]> {
    try {
      const { data, error } = await supabase
        .from('hostels')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
          console.warn('Network error fetching hostels, returning empty array:', error.message);
          return [];
        }
        throw new Error(`Failed to fetch hostels: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching hostels:', error);
      if (error instanceof Error && (error.message.includes('Failed to fetch') || error.message.includes('Network'))) {
        console.warn('Network error, returning empty hostels array');
        return [];
      }
      throw error;
    }
  }

  /**
   * Fetch a single hostel by ID
   */
  static async getById(id: string): Promise<Hostel | null> {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid hostel ID provided');
      }

      const { data, error } = await supabase
        .from('hostels')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        throw new Error(`Failed to fetch hostel: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error fetching hostel:', error);
      throw error;
    }
  }

  /**
   * Create a new hostel
   */
  static async create(hostel: CreateHostelInput): Promise<Hostel> {
    try {
      // Validate required fields
      if (!hostel.name || !hostel.gender) {
        throw new Error('Name and gender are required fields');
      }

      if (!['Male', 'Female'].includes(hostel.gender)) {
        throw new Error('Gender must be either Male or Female');
      }

      const { data, error } = await supabase
        .from('hostels')
        .insert([hostel])
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create hostel: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error creating hostel:', error);
      throw error;
    }
  }

  /**
   * Update an existing hostel
   */
  static async update(id: string, updates: UpdateHostelInput): Promise<Hostel> {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid hostel ID provided');
      }

      if (updates.gender && !['Male', 'Female'].includes(updates.gender)) {
        throw new Error('Gender must be either Male or Female');
      }

      const { data, error } = await supabase
        .from('hostels')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update hostel: ${error.message}`);
      }

      if (!data) {
        throw new Error('Hostel not found');
      }

      return data;
    } catch (error) {
      console.error('Error updating hostel:', error);
      throw error;
    }
  }

  /**
   * Delete a hostel
   */
  static async delete(id: string): Promise<void> {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid hostel ID provided');
      }

      const { error } = await supabase
        .from('hostels')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to delete hostel: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting hostel:', error);
      throw error;
    }
  }

  /**
   * Subscribe to hostel changes in real-time
   * Returns unsubscribe function
   */
  static subscribe(callback: (hostels: Hostel[]) => void): () => void {
    // Initial fetch
    this.getAll().then(callback).catch(error => {
      console.error('Error in hostel subscription initial fetch:', error);
      callback([]);
    });

    // Subscribe to changes
    const subscription = supabase
      .channel('hostels_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'hostels',
        },
        () => {
          // Refetch all hostels on any change
          this.getAll().then(callback).catch(error => {
            console.error('Error in hostel subscription update:', error);
          });
        }
      )
      .subscribe();

    // Return unsubscribe function
    return () => {
      supabase.removeChannel(subscription);
    };
  }

  /**
   * Get hostels by gender
   */
  static async getByGender(gender: 'Male' | 'Female'): Promise<Hostel[]> {
    try {
      if (!['Male', 'Female'].includes(gender)) {
        throw new Error('Gender must be either Male or Female');
      }

      const { data, error } = await supabase
        .from('hostels')
        .select('*')
        .eq('gender', gender)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch hostels by gender: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching hostels by gender:', error);
      throw error;
    }
  }
}
