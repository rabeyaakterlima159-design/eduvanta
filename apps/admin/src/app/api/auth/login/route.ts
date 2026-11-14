import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Check Super Admin
    if (normalizedEmail === 'sohel229229@gmail.com') {
      if (password !== 'shariar123') {
        return NextResponse.json(
          { success: false, error: 'Invalid password for Super Admin' },
          { status: 401 }
        );
      }
      return NextResponse.json({
        success: true,
        user: {
          id: 'usr-super-admin-01',
          email: 'Sohel229229@gmail.com',
          fullName: 'Sohel Shariar',
          role: 'super_admin',
          schoolId: '22222222-2222-2222-2222-222222222201',
          schoolName: 'Platform Global Executive Hub',
          status: 'active',
        },
      });
    }

    // 2. Check Database Users
    const user = db.users.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (user) {
      if (user.password !== password) {
        return NextResponse.json(
          { success: false, error: 'Incorrect password' },
          { status: 401 }
        );
      }
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          schoolId: user.schoolId,
          schoolName: user.schoolName,
          status: user.status,
          studentClass: user.studentClass,
          studentSection: user.studentSection,
          rollNumber: user.rollNumber,
        },
      });
    }

    // 3. Check Pending or Rejected Admissions
    const application = db.admissions.find(
      (a) => a.email.toLowerCase() === normalizedEmail
    );

    if (application) {
      if (application.status === 'pending') {
        return NextResponse.json(
          {
            success: false,
            error: `Admission Pending: Your registration application at ${application.schoolName} is awaiting School Administrator approval.`,
            status: 'pending',
          },
          { status: 403 }
        );
      }
      if (application.status === 'rejected') {
        return NextResponse.json(
          {
            success: false,
            error: `Registration Declined: ${application.reviewNotes || 'Please contact campus administration.'}`,
            status: 'rejected',
          },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: 'Account not found. Please register or verify credentials.' },
      { status: 404 }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
