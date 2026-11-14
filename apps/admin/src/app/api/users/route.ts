import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, saveDatabase, UserRecord } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const db = getDatabase();
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const schoolId = searchParams.get('schoolId');

    let users = db.users;
    if (role && role !== 'all') {
      users = users.filter((u) => u.role === role);
    }
    if (schoolId) {
      users = users.filter((u) => u.schoolId === schoolId);
    }

    return NextResponse.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      password = 'password123',
      role,
      schoolId = '22222222-2222-2222-2222-222222222201',
      schoolName = 'Dhaka Premier International School',
      studentClass,
      studentSection,
      rollNumber,
      guardianName,
      guardianPhone,
      department,
      phone,
    } = body;

    if (!fullName || !email || !role) {
      return NextResponse.json(
        { success: false, error: 'Full name, email, and role are required' },
        { status: 400 }
      );
    }

    const db = getDatabase();

    // Check if email already exists
    const existing = db.users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    const newUser: UserRecord = {
      id: `usr-${Date.now()}`,
      email: email.trim().toLowerCase(),
      password,
      fullName: fullName.trim(),
      role,
      schoolId,
      schoolName,
      status: 'active',
      createdAt: new Date().toISOString(),
      studentClass,
      studentSection,
      rollNumber,
      guardianName,
      guardianPhone,
      department,
      phone,
    };

    db.users.unshift(newUser);
    saveDatabase(db);

    return NextResponse.json(
      {
        success: true,
        message: `Account created for ${newUser.fullName} with role ${newUser.role}`,
        user: newUser,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
