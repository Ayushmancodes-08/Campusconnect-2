import { getDb } from '../../mongodb';
import type { Student } from '../schema';

export class StudentService {
  static async getAll(): Promise<Student[]> {
    try {
      const db = await getDb();
      const data = await db.collection('students')
        .find({})
        .sort({ created_at: -1 })
        .toArray();
      return data as unknown as Student[];
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  }

  static async getById(id: string): Promise<Student | null> {
    try {
      const db = await getDb();
      const data = await db.collection('students').findOne({ id: id });
      return data as unknown as Student | null;
    } catch (error) {
      console.error('Error fetching student:', error);
      throw error;
    }
  }

  static async create(student: Omit<Student, 'id' | 'created_at' | 'updated_at'>): Promise<Student> {
    try {
      const db = await getDb();
      const studentId = typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID() 
        : Math.random().toString(36).substring(2, 15);
        
      const newStudent: Student = {
        ...student,
        id: studentId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      await db.collection('students').insertOne(newStudent);
      return newStudent;
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  }

  static async update(id: string, updates: Partial<Omit<Student, 'id' | 'created_at' | 'updated_at'>>): Promise<Student> {
    try {
      const db = await getDb();
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };
      
      await db.collection('students').updateOne({ id: id }, { $set: updateData });
      const updated = await db.collection('students').findOne({ id: id });
      if (!updated) throw new Error('Student not found');
      return updated as unknown as Student;
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      const db = await getDb();
      await db.collection('students').deleteOne({ id: id });
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  }

  static async search(query: string): Promise<Student[]> {
    try {
      const db = await getDb();
      const data = await db.collection('students')
        .find({
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } }
          ]
        })
        .sort({ created_at: -1 })
        .toArray();
      return data as unknown as Student[];
    } catch (error) {
      console.error('Error searching students:', error);
      throw error;
    }
  }

  static async getByStatus(status: 'Active' | 'Inactive' | 'Suspended'): Promise<Student[]> {
    try {
      const db = await getDb();
      const data = await db.collection('students')
        .find({ status: status })
        .sort({ created_at: -1 })
        .toArray();
      return data as unknown as Student[];
    } catch (error) {
      console.error('Error fetching students by status:', error);
      throw error;
    }
  }

  static async getByEmail(email: string): Promise<Student | null> {
    try {
      const db = await getDb();
      const data = await db.collection('students').findOne({ email: email });
      return data as unknown as Student | null;
    } catch (error) {
      console.error('Error fetching student by email:', error);
      return null;
    }
  }

  static async validateCredentials(email: string, password: string): Promise<Student | null> {
    try {
      const student = await this.getByEmail(email);
      return student;
    } catch (error) {
      return null;
    }
  }
}
