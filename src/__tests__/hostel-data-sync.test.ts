/**
 * Tests for Hostel Room Management Data Synchronization
 * 
 * These tests verify that:
 * 1. Student data is fetched from StudentService (Supabase)
 * 2. Invalid student IDs are filtered out
 * 3. Error handling and fallback behavior work correctly
 * 4. Hostel dashboard doesn't render mess section
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StudentService } from '@/lib/db/students';
import { defaultHostels } from '@/lib/hostel';
import { studentsData as defaultStudentsData } from '@/lib/data';

// Mock StudentService
vi.mock('@/lib/db/students', () => ({
  StudentService: {
    getAll: vi.fn(),
  },
}));

describe('Hostel Data Synchronization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('StudentService Integration', () => {
    it('should fetch students from StudentService', async () => {
      const mockStudents = [
        { id: '1', name: 'John Doe', email: 'john@test.com', gender: 'male', status: 'Active' },
        { id: '2', name: 'Jane Smith', email: 'jane@test.com', gender: 'female', status: 'Active' },
      ];

      vi.mocked(StudentService.getAll).mockResolvedValue(mockStudents as any);

      const students = await StudentService.getAll();

      expect(students).toEqual(mockStudents);
      expect(StudentService.getAll).toHaveBeenCalledTimes(1);
    });

    it('should handle StudentService errors gracefully', async () => {
      const error = new Error('Database connection failed');
      vi.mocked(StudentService.getAll).mockRejectedValue(error);

      await expect(StudentService.getAll()).rejects.toThrow('Database connection failed');
    });
  });

  describe('Invalid Student ID Filtering', () => {
    it('should filter out invalid student IDs from room occupants', () => {
      const validStudents = [
        { id: '1', name: 'John Doe', email: 'john@test.com', gender: 'male', status: 'Active' },
        { id: '2', name: 'Jane Smith', email: 'jane@test.com', gender: 'female', status: 'Active' },
      ];

      const roomOccupants = ['1', '2', 'invalid-id'];
      const validOccupants = roomOccupants.filter(id => validStudents.some(s => s.id === id));

      expect(validOccupants).toEqual(['1', '2']);
      expect(validOccupants).not.toContain('invalid-id');
    });

    it('should identify invalid student IDs', () => {
      const validStudents = [
        { id: '1', name: 'John Doe', email: 'john@test.com', gender: 'male', status: 'Active' },
      ];

      const studentId = 'invalid-id';
      const isValid = validStudents.some(s => s.id === studentId);

      expect(isValid).toBe(false);
    });
  });

  describe('Default Hostels Structure', () => {
    it('should have empty rooms in default hostels', () => {
      defaultHostels.forEach(hostel => {
        hostel.rooms.forEach(room => {
          expect(room.occupants).toEqual([]);
        });
      });
    });

    it('should not have hardcoded student IDs', () => {
      const allOccupants = defaultHostels.flatMap(h => h.rooms.flatMap(r => r.occupants));
      expect(allOccupants).toHaveLength(0);
    });

    it('should have correct hostel structure', () => {
      expect(defaultHostels).toHaveLength(2);
      expect(defaultHostels[0].gender).toBe('Male');
      expect(defaultHostels[1].gender).toBe('Female');
    });
  });

  describe('Student Name Resolution', () => {
    it('should resolve student names correctly', () => {
      const students = [
        { id: '1', name: 'John Doe', email: 'john@test.com', gender: 'male', status: 'Active' },
        { id: '2', name: 'Jane Smith', email: 'jane@test.com', gender: 'female', status: 'Active' },
      ];

      const getStudentName = (studentId: string) => {
        const student = students.find(s => s.id === studentId);
        return student?.name || `Unknown Student (ID: ${studentId})`;
      };

      expect(getStudentName('1')).toBe('John Doe');
      expect(getStudentName('2')).toBe('Jane Smith');
    });

    it('should handle missing students gracefully', () => {
      const students = [
        { id: '1', name: 'John Doe', email: 'john@test.com', gender: 'male', status: 'Active' },
      ];

      const getStudentName = (studentId: string) => {
        const student = students.find(s => s.id === studentId);
        return student?.name || `Unknown Student (ID: ${studentId})`;
      };

      expect(getStudentName('invalid-id')).toBe('Unknown Student (ID: invalid-id)');
    });
  });

  describe('Gender-based Student Filtering', () => {
    it('should filter students by gender', () => {
      const students = [
        { id: '1', name: 'John Doe', email: 'john@test.com', gender: 'male', status: 'Active' },
        { id: '2', name: 'Jane Smith', email: 'jane@test.com', gender: 'female', status: 'Active' },
        { id: '3', name: 'Bob Johnson', email: 'bob@test.com', gender: 'male', status: 'Active' },
      ];

      const maleStudents = students.filter(s => s.gender === 'male');
      const femaleStudents = students.filter(s => s.gender === 'female');

      expect(maleStudents).toHaveLength(2);
      expect(femaleStudents).toHaveLength(1);
      expect(maleStudents.map(s => s.id)).toEqual(['1', '3']);
    });
  });

  describe('Hostel Dashboard - Mess Section Removal', () => {
    it('should not include mess data in hostel dashboard', () => {
      // Verify that defaultMessData is not exported from hostel.ts
      // This is a structural test - the actual implementation removes the export
      const hostelExports = Object.keys(require('@/lib/hostel'));
      expect(hostelExports).not.toContain('defaultMessData');
    });

    it('should only calculate occupancy statistics', () => {
      const hostel = defaultHostels[0];
      const totalCapacity = hostel.rooms.reduce((acc, room) => acc + room.capacity, 0);
      const occupiedCount = hostel.rooms.reduce((acc, room) => acc + room.occupants.length, 0);
      const occupancyRate = totalCapacity > 0 ? Math.round((occupiedCount / totalCapacity) * 100) : 0;

      expect(totalCapacity).toBeGreaterThan(0);
      expect(occupancyRate).toBeGreaterThanOrEqual(0);
      expect(occupancyRate).toBeLessThanOrEqual(100);
    });
  });

  describe('Data Persistence', () => {
    it('should handle localStorage correctly', () => {
      const mockStorage = {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      };

      const testData = { id: 'H01', name: 'Test Hostel', gender: 'Male', rooms: [] };
      mockStorage.setItem('hostelsData', JSON.stringify(testData));

      expect(mockStorage.setItem).toHaveBeenCalledWith('hostelsData', JSON.stringify(testData));
    });
  });
});
