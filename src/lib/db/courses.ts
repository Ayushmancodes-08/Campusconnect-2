import { supabase } from '@/lib/supabase';
import type { Course } from './schema';

/**
 * Course Database Service
 * Provides CRUD operations for course records in Supabase
 */

export class CourseService {
  /**
   * Fetch all courses
   */
  static async getAll(): Promise<Course[]> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // Check if it's a network error or table doesn't exist
        if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
          console.warn('Network error fetching courses, returning empty array:', error.message);
          return [];
        }
        throw new Error(`Failed to fetch courses: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching courses:', error);
      // Return empty array instead of throwing to allow app to continue
      if (error instanceof Error && (error.message.includes('Failed to fetch') || error.message.includes('Network'))) {
        console.warn('Network error, returning empty courses array');
        return [];
      }
      throw error;
    }
  }

  /**
   * Fetch a single course by ID
   */
  static async getById(id: string): Promise<Course | null> {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid course ID provided');
      }

      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        throw new Error(`Failed to fetch course: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  }

  /**
   * Create a new course
   */
  static async create(course: Omit<Course, 'id' | 'created_at' | 'updated_at'>): Promise<Course> {
    try {
      // Validate required fields
      if (!course.time || !course.class || !course.location) {
        throw new Error('Time, class, and location are required fields');
      }

      const { data, error } = await supabase
        .from('courses')
        .insert([course])
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create course: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  }

  /**
   * Update an existing course
   */
  static async update(id: string, updates: Partial<Omit<Course, 'id' | 'created_at' | 'updated_at'>>): Promise<Course> {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid course ID provided');
      }

      const { data, error } = await supabase
        .from('courses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update course: ${error.message}`);
      }

      if (!data) {
        throw new Error('Course not found');
      }

      return data;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  }

  /**
   * Delete a course
   */
  static async delete(id: string): Promise<void> {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid course ID provided');
      }

      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to delete course: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }

  /**
   * Search courses by class name or location
   */
  static async search(query: string): Promise<Course[]> {
    try {
      if (!query || typeof query !== 'string') {
        throw new Error('Search query must be a non-empty string');
      }

      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .or(`class.ilike.%${query}%,location.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to search courses: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error searching courses:', error);
      throw error;
    }
  }

  /**
   * Get courses by location
   */
  static async getByLocation(location: string): Promise<Course[]> {
    try {
      if (!location || typeof location !== 'string') {
        throw new Error('Location must be a non-empty string');
      }

      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('location', location)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch courses by location: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching courses by location:', error);
      throw error;
    }
  }

  /**
   * Get courses by class name
   */
  static async getByClass(className: string): Promise<Course[]> {
    try {
      if (!className || typeof className !== 'string') {
        throw new Error('Class name must be a non-empty string');
      }

      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('class', className)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch courses by class: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching courses by class:', error);
      throw error;
    }
  }
}
