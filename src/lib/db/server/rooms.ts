import { getDb } from '../../mongodb';

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

export class RoomService {
  static async getAll(): Promise<Room[]> {
    try {
      const db = await getDb();
      const data = await db.collection('rooms')
        .find({})
        .sort({ created_at: -1 })
        .toArray();
      return data as unknown as Room[];
    } catch (error) {
      console.error('Error fetching rooms:', error);
      return [];
    }
  }

  static async getByHostelId(hostelId: string): Promise<Room[]> {
    try {
      const db = await getDb();
      const data = await db.collection('rooms')
        .find({ hostel_id: hostelId })
        .sort({ floor: 1, room_number: 1 })
        .toArray();
      return data as unknown as Room[];
    } catch (error) {
      console.error('Error fetching rooms by hostel:', error);
      throw error;
    }
  }

  static async getById(id: string): Promise<Room | null> {
    try {
      const db = await getDb();
      const data = await db.collection('rooms').findOne({ id: id });
      return data as unknown as Room | null;
    } catch (error) {
      console.error('Error fetching room:', error);
      throw error;
    }
  }

  static async create(room: CreateRoomInput): Promise<Room> {
    try {
      const db = await getDb();
      const roomId = typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID() 
        : Math.random().toString(36).substring(2, 15);

      const newRoom: Room = {
        hostel_id: room.hostel_id,
        room_number: room.room_number,
        floor: room.floor,
        capacity: room.capacity,
        occupants: room.occupants || [],
        id: roomId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await db.collection('rooms').insertOne(newRoom);
      return newRoom;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  }

  static async update(id: string, updates: UpdateRoomInput): Promise<Room> {
    try {
      const db = await getDb();
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      await db.collection('rooms').updateOne({ id: id }, { $set: updateData });
      const updated = await db.collection('rooms').findOne({ id: id });
      if (!updated) throw new Error('Room not found');
      return updated as unknown as Room;
    } catch (error) {
      console.error('Error updating room:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      const db = await getDb();
      await db.collection('rooms').deleteOne({ id: id });
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  }

  static async assignStudent(roomId: string, studentId: string): Promise<Room> {
    try {
      const room = await this.getById(roomId);
      if (!room) throw new Error('Room not found');
      if (room.occupants.includes(studentId)) throw new Error('Student already assigned to room');
      if (room.occupants.length >= room.capacity) throw new Error('Room is full');

      const updatedOccupants = [...room.occupants, studentId];
      return this.update(roomId, { occupants: updatedOccupants });
    } catch (error) {
      console.error('Error assigning student to room:', error);
      throw error;
    }
  }

  static async removeStudent(roomId: string, studentId: string): Promise<Room> {
    try {
      const room = await this.getById(roomId);
      if (!room) throw new Error('Room not found');
      const updatedOccupants = room.occupants.filter(id => id !== studentId);
      return this.update(roomId, { occupants: updatedOccupants });
    } catch (error) {
      console.error('Error removing student from room:', error);
      throw error;
    }
  }

  static subscribe(callback: (rooms: Room[]) => void): () => void {
    this.getAll().then(callback).catch(error => {
      console.error('Error in room subscription initial fetch:', error);
      callback([]);
    });
    return () => {};
  }

  static subscribeByHostelId(hostelId: string, callback: (rooms: Room[]) => void): () => void {
    this.getByHostelId(hostelId).then(callback).catch(error => {
      console.error('Error in hostel room subscription initial fetch:', error);
      callback([]);
    });
    return () => {};
  }

  static async getHostelOccupancyStats(hostelId: string): Promise<{
    totalCapacity: number;
    occupiedCount: number;
    occupancyRate: number;
    totalRooms: number;
  }> {
    try {
      const rooms = await this.getByHostelId(hostelId);
      const totalCapacity = rooms.reduce((acc, room) => acc + room.capacity, 0);
      const occupiedCount = rooms.reduce((acc, room) => acc + (room.occupants?.length || 0), 0);
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
