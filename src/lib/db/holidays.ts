import type { Holiday } from './schema';

export class HolidayService {
  static async getAll(): Promise<Holiday[]> {
    try {
      const res = await fetch('/api/holidays');
      if (!res.ok) throw new Error('Failed to fetch');
      return await res.json();
    } catch (error) {
      console.error('Error fetching holidays:', error);
      return [];
    }
  }

  static async getById(id: string): Promise<Holiday | null> {
    try {
      const res = await fetch(`/api/holidays/${id}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (error) {
      return null;
    }
  }

  static async create(holiday: Omit<Holiday, 'id' | 'created_at' | 'updated_at'>): Promise<Holiday> {
    const res = await fetch('/api/holidays', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(holiday)
    });
    if (!res.ok) throw new Error('Failed to create holiday');
    return await res.json();
  }

  static async update(id: string, updates: Partial<Omit<Holiday, 'id' | 'created_at' | 'updated_at'>>): Promise<Holiday> {
    const res = await fetch(`/api/holidays/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update holiday');
    return await res.json();
  }

  static async delete(id: string): Promise<void> {
    const res = await fetch(`/api/holidays/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete holiday');
  }

  static async search(query: string): Promise<Holiday[]> {
    try {
      const res = await fetch(`/api/holidays/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Failed to search');
      return await res.json();
    } catch (error) {
      return [];
    }
  }

  static async getByDateRange(startDate: string, endDate: string): Promise<Holiday[]> {
    try {
      const res = await fetch(`/api/holidays/range?start=${startDate}&end=${endDate}`);
      if (!res.ok) throw new Error('Failed to fetch');
      return await res.json();
    } catch (error) {
      return [];
    }
  }

  static async getUpcoming(): Promise<Holiday[]> {
    try {
      const res = await fetch('/api/holidays/upcoming');
      if (!res.ok) throw new Error('Failed to fetch');
      return await res.json();
    } catch (error) {
      return [];
    }
  }
}
