import { NextRequest, NextResponse } from 'next/server';
import { CourseService } from '@/lib/db/server/courses';

export async function GET(request: NextRequest) {
  try {
    const courses = await CourseService.getAll();
    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const course = await CourseService.create(data);
    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
