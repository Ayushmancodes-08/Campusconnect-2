import type { Course } from './schema';

export class CourseService {
  static async getAll(): Promise<Course[]> {
    try {
      const res = await fetch('/api/courses');
      if (!res.ok) throw new Error('Failed to fetch');
      return await res.json();
    } catch (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
  }

  static async getById(id: string): Promise<Course | null> {
    try {
      const res = await fetch(`/api/courses/${id}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (error) {
      return null;
    }
  }

  static async create(course: Omit<Course, 'id' | 'created_at' | 'updated_at'>): Promise<Course> {
    const res = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course)
    });
    if (!res.ok) throw new Error('Failed to create course');
    return await res.json();
  }

  static async update(id: string, updates: Partial<Omit<Course, 'id' | 'created_at' | 'updated_at'>>): Promise<Course> {
    const res = await fetch(`/api/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update course');
    return await res.json();
  }

  static async delete(id: string): Promise<void> {
    const res = await fetch(`/api/courses/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete course');
  }

  static async search(query: string): Promise<Course[]> {
    try {
      const res = await fetch(`/api/courses/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Failed to search');
      return await res.json();
    } catch (error) {
      return [];
    }
  }

  static async getByLocation(location: string): Promise<Course[]> {
    try {
      const res = await fetch(`/api/courses/location/${location}`);
      if (!res.ok) throw new Error('Failed to fetch');
      return await res.json();
    } catch (error) {
      return [];
    }
  }

  static async getByClass(className: string): Promise<Course[]> {
    try {
      const res = await fetch(`/api/courses/class/${className}`);
      if (!res.ok) throw new Error('Failed to fetch');
      return await res.json();
    } catch (error) {
      return [];
    }
  }
}
