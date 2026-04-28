import type { Student } from './schema';

export class StudentService {
  static async getAll(): Promise<Student[]> {
    try {
      const res = await fetch('/api/students');
      if (!res.ok) throw new Error('Failed to fetch');
      return await res.json();
    } catch (error) {
      console.error('Error fetching students:', error);
      return [];
    }
  }

  static async getById(id: string): Promise<Student | null> {
    try {
      const res = await fetch(`/api/students/${id}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (error) {
      return null;
    }
  }

  static async create(student: Omit<Student, 'id' | 'created_at' | 'updated_at'>): Promise<Student> {
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });
    if (!res.ok) throw new Error('Failed to create student');
    return await res.json();
  }

  static async update(id: string, updates: Partial<Omit<Student, 'id' | 'created_at' | 'updated_at'>>): Promise<Student> {
    const res = await fetch(`/api/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update student');
    return await res.json();
  }

  static async delete(id: string): Promise<void> {
    const res = await fetch(`/api/students/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete student');
  }

  static async search(query: string): Promise<Student[]> {
    try {
      const res = await fetch(`/api/students/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Failed to search');
      return await res.json();
    } catch (error) {
      return [];
    }
  }

  static async getByStatus(status: 'Active' | 'Inactive' | 'Suspended'): Promise<Student[]> {
    try {
      const res = await fetch(`/api/students/status/${status}`);
      if (!res.ok) throw new Error('Failed to fetch');
      return await res.json();
    } catch (error) {
      return [];
    }
  }

  static async getByEmail(email: string): Promise<Student | null> {
    try {
      const res = await fetch(`/api/students/email/${email}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (error) {
      return null;
    }
  }

  static async validateCredentials(email: string, password: string): Promise<Student | null> {
    return this.getByEmail(email);
  }
}
