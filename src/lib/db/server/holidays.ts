import { getDb } from '../../mongodb';
import type { Holiday } from '../schema';

export class HolidayService {
  static async getAll(): Promise<Holiday[]> {
    try {
      const db = await getDb();
      const data = await db.collection('holidays')
        .find({})
        .sort({ date: 1 })
        .toArray();
      return data as unknown as Holiday[];
    } catch (error) {
      console.error('Error fetching holidays:', error);
      throw error;
    }
  }

  static async getById(id: string): Promise<Holiday | null> {
    try {
      const db = await getDb();
      const data = await db.collection('holidays').findOne({ id: id });
      return data as unknown as Holiday | null;
    } catch (error) {
      console.error('Error fetching holiday:', error);
      throw error;
    }
  }

  static async create(holiday: Omit<Holiday, 'id' | 'created_at' | 'updated_at'>): Promise<Holiday> {
    try {
      const db = await getDb();
      const holidayId = typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID() 
        : Math.random().toString(36).substring(2, 15);

      const newHoliday: Holiday = {
        ...holiday,
        id: holidayId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await db.collection('holidays').insertOne(newHoliday);
      return newHoliday;
    } catch (error) {
      console.error('Error creating holiday:', error);
      throw error;
    }
  }

  static async update(id: string, updates: Partial<Omit<Holiday, 'id' | 'created_at' | 'updated_at'>>): Promise<Holiday> {
    try {
      const db = await getDb();
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      await db.collection('holidays').updateOne({ id: id }, { $set: updateData });
      const updated = await db.collection('holidays').findOne({ id: id });
      if (!updated) throw new Error('Holiday not found');
      return updated as unknown as Holiday;
    } catch (error) {
      console.error('Error updating holiday:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      const db = await getDb();
      await db.collection('holidays').deleteOne({ id: id });
    } catch (error) {
      console.error('Error deleting holiday:', error);
      throw error;
    }
  }

  static async search(query: string): Promise<Holiday[]> {
    try {
      const db = await getDb();
      const data = await db.collection('holidays')
        .find({ name: { $regex: query, $options: 'i' } })
        .sort({ date: 1 })
        .toArray();
      return data as unknown as Holiday[];
    } catch (error) {
      console.error('Error searching holidays:', error);
      throw error;
    }
  }

  static async getByDateRange(startDate: string, endDate: string): Promise<Holiday[]> {
    try {
      const db = await getDb();
      const data = await db.collection('holidays')
        .find({
          date: { $gte: startDate, $lte: endDate }
        })
        .sort({ date: 1 })
        .toArray();
      return data as unknown as Holiday[];
    } catch (error) {
      console.error('Error fetching holidays by date range:', error);
      throw error;
    }
  }

  static async getUpcoming(): Promise<Holiday[]> {
    try {
      const db = await getDb();
      const today = new Date().toISOString().split('T')[0];
      const data = await db.collection('holidays')
        .find({ date: { $gte: today } })
        .sort({ date: 1 })
        .toArray();
      return data as unknown as Holiday[];
    } catch (error) {
      console.error('Error fetching upcoming holidays:', error);
      throw error;
    }
  }
}
