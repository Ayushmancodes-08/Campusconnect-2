import { NextRequest, NextResponse } from 'next/server';
import { HostelService } from '@/lib/db/server/hostels';

export async function GET(request: NextRequest) {
  try {
    const hostels = await HostelService.getAll();
    return NextResponse.json(hostels);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const hostel = await HostelService.create(data);
    return NextResponse.json(hostel);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
