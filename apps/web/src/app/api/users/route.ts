import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, saveDatabase, UserRecord } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const db = getDatabase();
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    let users = db.users;
    if (role && role !== 'all') {
      users = users.filter((u) => u.role === role);
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
      schoolName = 'Green Hill International School (GHIS-BD)',
      studentClass,
      studentSection,
      rollNumber,
      guardianName,
      guardianPhone,
      department,
      phone,
      subtitle,
    } = body;

    if (!fullName || !email || !role) {
      return NextResponse.json(
        { success: false, error: 'Full name, email, and role are required' },
        { status: 400 }
      );
    }

    const db = getDatabase();
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
      subtitle: subtitle || (role === 'student' ? 'Verified Enrolled Student' : `${role} Member`),
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
      phone: phone || email,
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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    const index = db.users.findIndex((u) => u.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const deleted = db.users.splice(index, 1)[0];
    saveDatabase(db);

    return NextResponse.json({
      success: true,
      message: `User ${deleted.fullName} removed from platform`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
