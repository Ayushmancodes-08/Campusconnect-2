import { NextRequest, NextResponse } from 'next/server';
import { HolidayService } from '@/lib/db/server/holidays';

export async function GET(request: NextRequest) {
  try {
    const holidays = await HolidayService.getAll();
    return NextResponse.json(holidays);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const holiday = await HolidayService.create(data);
    return NextResponse.json(holiday);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
