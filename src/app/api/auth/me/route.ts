import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('campusconnect_session')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false, role: null, email: null }, { status: 200 });
    }

    const jwtSecret = process.env.JWT_SECRET || 'campusconnect-erp-jwt-secret-key-replace-me-in-production';
    try {
      const decoded = jwt.verify(token, jwtSecret) as any;
      return NextResponse.json({
        authenticated: true,
        role: decoded.role,
        email: decoded.email,
        user: {
          email: decoded.email,
          role: decoded.role,
          name: decoded.name
        }
      });
    } catch (e) {
      return NextResponse.json({ authenticated: false, role: null, email: null }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ authenticated: false, role: null, email: null }, { status: 500 });
  }
}
