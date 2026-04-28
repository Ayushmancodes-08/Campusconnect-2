import { getDb } from '../../mongodb';
import type { Course } from '../schema';

export class CourseService {
  static async getAll(): Promise<Course[]> {
    try {
      const db = await getDb();
      const data = await db.collection('courses')
        .find({})
        .sort({ created_at: -1 })
        .toArray();
      return data as unknown as Course[];
    } catch (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
  }

  static async getById(id: string): Promise<Course | null> {
    try {
      const db = await getDb();
      const data = await db.collection('courses').findOne({ id: id });
      return data as unknown as Course | null;
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  }

  static async create(course: Omit<Course, 'id' | 'created_at' | 'updated_at'>): Promise<Course> {
    try {
      const db = await getDb();
      const courseId = typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID() 
        : Math.random().toString(36).substring(2, 15);

      const newCourse: Course = {
        ...course,
        id: courseId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await db.collection('courses').insertOne(newCourse);
      return newCourse;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  }

  static async update(id: string, updates: Partial<Omit<Course, 'id' | 'created_at' | 'updated_at'>>): Promise<Course> {
    try {
      const db = await getDb();
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      await db.collection('courses').updateOne({ id: id }, { $set: updateData });
      const updated = await db.collection('courses').findOne({ id: id });
      if (!updated) throw new Error('Course not found');
      return updated as unknown as Course;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      const db = await getDb();
      await db.collection('courses').deleteOne({ id: id });
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }

  static async search(query: string): Promise<Course[]> {
    try {
      const db = await getDb();
      const data = await db.collection('courses')
        .find({
          $or: [
            { class: { $regex: query, $options: 'i' } },
            { location: { $regex: query, $options: 'i' } }
          ]
        })
        .sort({ created_at: -1 })
        .toArray();
      return data as unknown as Course[];
    } catch (error) {
      console.error('Error searching courses:', error);
      throw error;
    }
  }

  static async getByLocation(location: string): Promise<Course[]> {
    try {
      const db = await getDb();
      const data = await db.collection('courses')
        .find({ location: location })
        .sort({ created_at: -1 })
        .toArray();
      return data as unknown as Course[];
    } catch (error) {
      console.error('Error fetching courses by location:', error);
      throw error;
    }
  }

  static async getByClass(className: string): Promise<Course[]> {
    try {
      const db = await getDb();
      const data = await db.collection('courses')
        .find({ class: className })
        .sort({ created_at: -1 })
        .toArray();
      return data as unknown as Course[];
    } catch (error) {
      console.error('Error fetching courses by class:', error);
      throw error;
    }
  }
}
