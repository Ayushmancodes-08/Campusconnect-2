import type { Staff } from './schema';

export class StaffService {
  static async getAll(): Promise<Staff[]> {
    try {
      const res = await fetch('/api/staff');
      if (!res.ok) throw new Error('Failed to fetch');
      return await res.json();
    } catch (error) {
      console.error('Error fetching staff:', error);
      return [];
    }
  }

  static async getById(id: string): Promise<Staff | null> {
    try {
      const res = await fetch(`/api/staff/${id}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (error) {
      return null;
    }
  }

  static async create(staff: Omit<Staff, 'id' | 'created_at' | 'updated_at'>): Promise<Staff> {
    const res = await fetch('/api/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(staff)
    });
    if (!res.ok) throw new Error('Failed to create staff');
    return await res.json();
  }

  static async update(id: string, updates: Partial<Omit<Staff, 'id' | 'created_at' | 'updated_at'>>): Promise<Staff> {
    const res = await fetch(`/api/staff/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update staff');
    return await res.json();
  }

  static async delete(id: string): Promise<void> {
    const res = await fetch(`/api/staff/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete staff');
  }

  static async search(query: string): Promise<Staff[]> {
    try {
      const res = await fetch(`/api/staff/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Failed to search');
      return await res.json();
    } catch (error) {
      return [];
    }
  }

  static async getByDepartment(department: string): Promise<Staff[]> {
    try {
      const res = await fetch(`/api/staff/department/${department}`);
      if (!res.ok) throw new Error('Failed to fetch');
      return await res.json();
    } catch (error) {
      return [];
    }
  }

  static async getByStatus(status: 'Active' | 'On Leave' | 'Inactive'): Promise<Staff[]> {
    try {
      const res = await fetch(`/api/staff/status/${status}`);
      if (!res.ok) throw new Error('Failed to fetch');
      return await res.json();
    } catch (error) {
      return [];
    }
  }
}
