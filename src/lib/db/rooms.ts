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
      const res = await fetch('/api/rooms');
      if (!res.ok) throw new Error('Failed to fetch');
      return await res.json();
    } catch (error) {
      console.error('Error fetching rooms:', error);
      return [];
    }
  }

  static async getByHostelId(hostelId: string): Promise<Room[]> {
    try {
      const res = await fetch(`/api/rooms/hostel/${hostelId}`);
      if (!res.ok) throw new Error('Failed to fetch');
      return await res.json();
    } catch (error) {
      return [];
    }
  }

  static async getById(id: string): Promise<Room | null> {
    try {
      const res = await fetch(`/api/rooms/${id}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (error) {
      return null;
    }
  }

  static async create(room: CreateRoomInput): Promise<Room> {
    const res = await fetch('/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(room)
    });
    if (!res.ok) throw new Error('Failed to create room');
    return await res.json();
  }

  static async update(id: string, updates: UpdateRoomInput): Promise<Room> {
    const res = await fetch(`/api/rooms/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update room');
    return await res.json();
  }

  static async delete(id: string): Promise<void> {
    const res = await fetch(`/api/rooms/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete room');
  }

  static async assignStudent(roomId: string, studentId: string): Promise<Room> {
    const res = await fetch(`/api/rooms/${roomId}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId })
    });
    if (!res.ok) throw new Error('Failed to assign student');
    return await res.json();
  }

  static async removeStudent(roomId: string, studentId: string): Promise<Room> {
    const res = await fetch(`/api/rooms/${roomId}/unassign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId })
    });
    if (!res.ok) throw new Error('Failed to unassign student');
    return await res.json();
  }

  static subscribe(callback: (rooms: Room[]) => void): () => void {
    this.getAll().then(callback).catch(() => callback([]));
    return () => {};
  }

  static subscribeByHostelId(hostelId: string, callback: (rooms: Room[]) => void): () => void {
    this.getByHostelId(hostelId).then(callback).catch(() => callback([]));
    return () => {};
  }

  static async getHostelOccupancyStats(hostelId: string): Promise<{
    totalCapacity: number;
    occupiedCount: number;
    occupancyRate: number;
    totalRooms: number;
  }> {
    try {
      const res = await fetch(`/api/hostels/${hostelId}/stats`);
      if (!res.ok) throw new Error('Failed to fetch stats');
      return await res.json();
    } catch (error) {
      return { totalCapacity: 0, occupiedCount: 0, occupancyRate: 0, totalRooms: 0 };
    }
  }
}
