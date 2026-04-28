import { NextRequest, NextResponse } from 'next/server';
import { StudentService } from '@/lib/db/server/students';

export async function GET(request: NextRequest) {
  try {
    const students = await StudentService.getAll();
    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const student = await StudentService.create(data);
    return NextResponse.json(student);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
