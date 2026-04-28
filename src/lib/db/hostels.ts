export interface Hostel {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  created_at: string;
  updated_at: string;
}

export type CreateHostelInput = Omit<Hostel, 'id' | 'created_at' | 'updated_at'>;
export type UpdateHostelInput = Partial<CreateHostelInput>;

export class HostelService {
  static async getAll(): Promise<Hostel[]> {
    try {
      const res = await fetch('/api/hostels');
      if (!res.ok) throw new Error('Failed to fetch');
      return await res.json();
    } catch (error) {
      console.error('Error fetching hostels:', error);
      return [];
    }
  }

  static async getById(id: string): Promise<Hostel | null> {
    try {
      const res = await fetch(`/api/hostels/${id}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (error) {
      return null;
    }
  }

  static async create(hostel: CreateHostelInput): Promise<Hostel> {
    const res = await fetch('/api/hostels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hostel)
    });
    if (!res.ok) throw new Error('Failed to create hostel');
    return await res.json();
  }

  static async update(id: string, updates: UpdateHostelInput): Promise<Hostel> {
    const res = await fetch(`/api/hostels/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update hostel');
    return await res.json();
  }

  static async delete(id: string): Promise<void> {
    const res = await fetch(`/api/hostels/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete hostel');
  }

  static subscribe(callback: (hostels: Hostel[]) => void): () => void {
    this.getAll().then(callback).catch(() => callback([]));
    return () => {};
  }

  static async getByGender(gender: 'Male' | 'Female'): Promise<Hostel[]> {
    try {
      const res = await fetch(`/api/hostels/gender/${gender}`);
      if (!res.ok) throw new Error('Failed to fetch');
      return await res.json();
    } catch (error) {
      return [];
    }
  }
}
