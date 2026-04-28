import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { seedDatabase } from '@/lib/db/seed';

export async function POST(request: Request) {
  try {
    // Run seed logic to ensure users exist
    await seedDatabase();
    
    const body = await request.json();
    const { email, password, role } = body;

    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Hardcoded credentials for admin and finance as requested
    const hardcodedUsers = [
      { email: 'admin@campus.edu', password: 'password', role: 'admin', name: 'Admin User' },
      { email: 'finance@campus.edu', password: 'password', role: 'finance', name: 'Carol White' },
    ];

    const hardcodedUser = hardcodedUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password && u.role === role
    );

    let user;
    if (hardcodedUser) {
      user = hardcodedUser;
    } else {
      const db = await getDb();
      user = await db.collection('users').findOne({ email: email.toLowerCase() });

      if (!user) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }

      if (user.role !== role) {
        return NextResponse.json({ error: `This account is registered as ${user.role}.` }, { status: 401 });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }
    }


    const jwtSecret = process.env.JWT_SECRET || 'campusconnect-erp-jwt-secret-key-replace-me-in-production';
    const token = jwt.sign(
      { email: user.email, role: user.role, name: user.name },
      jwtSecret,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({ 
      success: true, 
      user: { email: user.email, role: user.role, name: user.name } 
    });
    
    response.cookies.set({
      name: 'campusconnect_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, 
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
