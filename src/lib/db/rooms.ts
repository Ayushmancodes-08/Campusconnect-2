import { supabase } from '@/lib/supabase';

/**
 * Room Database Schema
 */
export interface Room {
  id: string;
  hostel_id: string;
  room_number: string;
  floor: number;
  capacity: number;
  occupants: string[]; // Student IDs
  created_at: string;
  updated_at: string;
}

export type CreateRoomInput = Omit<Room, 'id' | 'created_at' | 'updated_at' | 'occupants'> & {
  occupants?: string[];
};

export type UpdateRoomInput = Partial<Omit<CreateRoomInput, 'hostel_id'>>;

/**
 * Room Database Service
 * Provides CRUD operations and real-time subscriptions for room records
 */
export class RoomService {
  /**
   * Fetch all rooms
   */
  static async getAll(): Promise<Room[]> {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
          console.warn('Network error fetching rooms, returning empty array:', error.message);
          return [];
        }
        throw new Error(`Failed to fetch rooms: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching rooms:', error);
      if (error instanceof Error && (error.message.includes('Failed to fetch') || error.message.includes('Network'))) {
        console.warn('Network error, returning empty rooms array');
        return [];
      }
      throw error;
    }
  }

  /**
   * Fetch rooms for a specific hostel
   */
  static async getByHostelId(hostelId: string): Promise<Room[]> {
    try {
      if (!hostelId || typeof hostelId !== 'string') {
        throw new Error('Invalid hostel ID provided');
      }

      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('hostel_id', hostelId)
        .order('floor', { ascending: true })
        .order('room_number', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch rooms by hostel: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching rooms by hostel:', error);
      throw error;
    }
  }

  /**
   * Fetch a single room by ID
   */
  static async getById(id: string): Promise<Room | null> {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid room ID provided');
      }

      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        throw new Error(`Failed to fetch room: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error fetching room:', error);
      throw error;
    }
  }

  /**
   * Create a new room
   */
  static async create(room: CreateRoomInput): Promise<Room> {
    try {
      // Validate required fields
      if (!room.hostel_id || !room.room_number || room.floor === undefined || !room.capacity) {
        throw new Error('Hostel ID, room number, floor, and capacity are required fields');
      }

      if (room.capacity < 1) {
        throw new Error('Capacity must be at least 1');
      }

      const roomData = {
        ...room,
        occupants: room.occupants || [],
      };

      const { data, error } = await supabase
        .from('rooms')
        .insert([roomData])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error(`Room ${room.room_number} already exists in this hostel`);
        }
        throw new Error(`Failed to create room: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  }

  /**
   * Update an existing room
   */
  static async update(id: string, updates: UpdateRoomInput): Promise<Room> {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid room ID provided');
      }

      if (updates.capacity && updates.capacity < 1) {
        throw new Error('Capacity must be at least 1');
      }

      const { data, error } = await supabase
        .from('rooms')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update room: ${error.message}`);
      }

      if (!data) {
        throw new Error('Room not found');
      }

      return data;
    } catch (error) {
      console.error('Error updating room:', error);
      throw error;
    }
  }

  /**
   * Delete a room
   */
  static async delete(id: string): Promise<void> {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid room ID provided');
      }

      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to delete room: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  }

  /**
   * Assign a student to a room
   */
  static async assignStudent(roomId: string, studentId: string): Promise<Room> {
    try {
      if (!roomId || !studentId) {
        throw new Error('Room ID and student ID are required');
      }

      // Get current room
      const room = await this.getById(roomId);
      if (!room) {
        throw new Error('Room not found');
      }

      // Check if student already assigned
      if (room.occupants.includes(studentId)) {
        throw new Error('Student is already assigned to this room');
      }

      // Check capacity
      if (room.occupants.length >= room.capacity) {
        throw new Error('Room is at full capacity');
      }

      // Add student to occupants
      const updatedOccupants = [...room.occupants, studentId];

      return this.update(roomId, { occupants: updatedOccupants });
    } catch (error) {
      console.error('Error assigning student to room:', error);
      throw error;
    }
  }

  /**
   * Remove a student from a room
   */
  static async removeStudent(roomId: string, studentId: string): Promise<Room> {
    try {
      if (!roomId || !studentId) {
        throw new Error('Room ID and student ID are required');
      }

      // Get current room
      const room = await this.getById(roomId);
      if (!room) {
        throw new Error('Room not found');
      }

      // Remove student from occupants
      const updatedOccupants = room.occupants.filter(id => id !== studentId);

      return this.update(roomId, { occupants: updatedOccupants });
    } catch (error) {
      console.error('Error removing student from room:', error);
      throw error;
    }
  }

  /**
   * Subscribe to room changes in real-time
   * Returns unsubscribe function
   */
  static subscribe(callback: (rooms: Room[]) => void): () => void {
    // Initial fetch
    this.getAll().then(callback).catch(error => {
      console.error('Error in room subscription initial fetch:', error);
      callback([]);
    });

    // Subscribe to changes
    const subscription = supabase
      .channel('rooms_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rooms',
        },
        () => {
          // Refetch all rooms on any change
          this.getAll().then(callback).catch(error => {
            console.error('Error in room subscription update:', error);
          });
        }
      )
      .subscribe();

    // Return unsubscribe function
    return () => {
      supabase.removeChannel(subscription);
    };
  }

  /**
   * Subscribe to room changes for a specific hostel
   * Returns unsubscribe function
   */
  static subscribeByHostelId(hostelId: string, callback: (rooms: Room[]) => void): () => void {
    // Initial fetch
    this.getByHostelId(hostelId).then(callback).catch(error => {
      console.error('Error in hostel room subscription initial fetch:', error);
      callback([]);
    });

    // Subscribe to changes
    const subscription = supabase
      .channel(`rooms_hostel_${hostelId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rooms',
          filter: `hostel_id=eq.${hostelId}`,
        },
        () => {
          // Refetch rooms for this hostel on any change
          this.getByHostelId(hostelId).then(callback).catch(error => {
            console.error('Error in hostel room subscription update:', error);
          });
        }
      )
      .subscribe();

    // Return unsubscribe function
    return () => {
      supabase.removeChannel(subscription);
    };
  }

  /**
   * Get occupancy statistics for a hostel
   */
  static async getHostelOccupancyStats(hostelId: string): Promise<{
    totalCapacity: number;
    occupiedCount: number;
    occupancyRate: number;
    totalRooms: number;
  }> {
    try {
      const rooms = await this.getByHostelId(hostelId);

      const totalCapacity = rooms.reduce((acc, room) => acc + room.capacity, 0);
      const occupiedCount = rooms.reduce((acc, room) => acc + room.occupants.length, 0);
      const occupancyRate = totalCapacity > 0 ? Math.round((occupiedCount / totalCapacity) * 100) : 0;

      return {
        totalCapacity,
        occupiedCount,
        occupancyRate,
        totalRooms: rooms.length,
      };
    } catch (error) {
      console.error('Error calculating occupancy stats:', error);
      throw error;
    }
  }
}
