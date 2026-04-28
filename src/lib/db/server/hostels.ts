import { getDb } from '../../mongodb';

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
      const db = await getDb();
      const data = await db.collection('hostels')
        .find({})
        .sort({ created_at: -1 })
        .toArray();
      return data as unknown as Hostel[];
    } catch (error) {
      console.error('Error fetching hostels:', error);
      return [];
    }
  }

  static async getById(id: string): Promise<Hostel | null> {
    try {
      const db = await getDb();
      const data = await db.collection('hostels').findOne({ id: id });
      return data as unknown as Hostel | null;
    } catch (error) {
      console.error('Error fetching hostel:', error);
      throw error;
    }
  }

  static async create(hostel: CreateHostelInput): Promise<Hostel> {
    try {
      const db = await getDb();
      const hostelId = typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID() 
        : Math.random().toString(36).substring(2, 15);

      const newHostel: Hostel = {
        name: hostel.name,
        gender: hostel.gender,
        id: hostelId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await db.collection('hostels').insertOne(newHostel);
      return newHostel;
    } catch (error) {
      console.error('Error creating hostel:', error);
      throw error;
    }
  }

  static async update(id: string, updates: UpdateHostelInput): Promise<Hostel> {
    try {
      const db = await getDb();
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      await db.collection('hostels').updateOne({ id: id }, { $set: updateData });
      const updated = await db.collection('hostels').findOne({ id: id });
      if (!updated) throw new Error('Hostel not found');
      return updated as unknown as Hostel;
    } catch (error) {
      console.error('Error updating hostel:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      const db = await getDb();
      await db.collection('hostels').deleteOne({ id: id });
    } catch (error) {
      console.error('Error deleting hostel:', error);
      throw error;
    }
  }

  static subscribe(callback: (hostels: Hostel[]) => void): () => void {
    this.getAll().then(callback).catch(() => callback([]));
    return () => {};
  }

  static async getByGender(gender: 'Male' | 'Female'): Promise<Hostel[]> {
    try {
      const db = await getDb();
      const data = await db.collection('hostels')
        .find({ gender: gender })
        .sort({ created_at: -1 })
        .toArray();
      return data as unknown as Hostel[];
    } catch (error) {
      console.error('Error fetching hostels by gender:', error);
      throw error;
    }
  }
}
