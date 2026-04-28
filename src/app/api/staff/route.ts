import { NextRequest, NextResponse } from 'next/server';
import { StaffService } from '@/lib/db/server/staff';

export async function GET(request: NextRequest) {
  try {
    const staff = await StaffService.getAll();
    return NextResponse.json(staff);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const staffMember = await StaffService.create(data);
    return NextResponse.json(staffMember);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
