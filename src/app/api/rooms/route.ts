import { NextRequest, NextResponse } from 'next/server';
import { RoomService } from '@/lib/db/server/rooms';

export async function GET(request: NextRequest) {
  try {
    const rooms = await RoomService.getAll();
    return NextResponse.json(rooms);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const room = await RoomService.create(data);
    return NextResponse.json(room);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
