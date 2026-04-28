import { getDb } from '../../mongodb';
import type { Staff } from '../schema';

export class StaffService {
  static async getAll(): Promise<Staff[]> {
    try {
      const db = await getDb();
      const data = await db.collection('staff')
        .find({})
        .sort({ created_at: -1 })
        .toArray();
      return data as unknown as Staff[];
    } catch (error) {
      console.error('Error fetching staff:', error);
      throw error;
    }
  }

  static async getById(id: string): Promise<Staff | null> {
    try {
      const db = await getDb();
      const data = await db.collection('staff').findOne({ id: id });
      return data as unknown as Staff | null;
    } catch (error) {
      console.error('Error fetching staff member:', error);
      throw error;
    }
  }

  static async create(staff: Omit<Staff, 'id' | 'created_at' | 'updated_at'>): Promise<Staff> {
    try {
      const db = await getDb();
      const staffId = typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID() 
        : Math.random().toString(36).substring(2, 15);

      const newStaff: Staff = {
        ...staff,
        id: staffId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await db.collection('staff').insertOne(newStaff);
      return newStaff;
    } catch (error) {
      console.error('Error creating staff member:', error);
      throw error;
    }
  }

  static async update(id: string, updates: Partial<Omit<Staff, 'id' | 'created_at' | 'updated_at'>>): Promise<Staff> {
    try {
      const db = await getDb();
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      await db.collection('staff').updateOne({ id: id }, { $set: updateData });
      const updated = await db.collection('staff').findOne({ id: id });
      if (!updated) throw new Error('Staff member not found');
      return updated as unknown as Staff;
    } catch (error) {
      console.error('Error updating staff member:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      const db = await getDb();
      await db.collection('staff').deleteOne({ id: id });
    } catch (error) {
      console.error('Error deleting staff member:', error);
      throw error;
    }
  }

  static async search(query: string): Promise<Staff[]> {
    try {
      const db = await getDb();
      const data = await db.collection('staff')
        .find({
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } }
          ]
        })
        .sort({ created_at: -1 })
        .toArray();
      return data as unknown as Staff[];
    } catch (error) {
      console.error('Error searching staff:', error);
      throw error;
    }
  }

  static async getByDepartment(department: string): Promise<Staff[]> {
    try {
      const db = await getDb();
      const data = await db.collection('staff')
        .find({ department: department })
        .sort({ created_at: -1 })
        .toArray();
      return data as unknown as Staff[];
    } catch (error) {
      console.error('Error fetching staff by department:', error);
      throw error;
    }
  }

  static async getByStatus(status: 'Active' | 'On Leave' | 'Inactive'): Promise<Staff[]> {
    try {
      const db = await getDb();
      const data = await db.collection('staff')
        .find({ status: status })
        .sort({ created_at: -1 })
        .toArray();
      return data as unknown as Staff[];
    } catch (error) {
      console.error('Error fetching staff by status:', error);
      throw error;
    }
  }
}
