import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, saveDatabase, AdmissionApplication, UserRecord } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const db = getDatabase();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let applications = db.admissions;
    if (status && status !== 'all') {
      applications = applications.filter((a) => a.status === status);
    }

    return NextResponse.json({
      success: true,
      count: applications.length,
      applications,
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
      phone,
      schoolId = '22222222-2222-2222-2222-222222222201',
      schoolName = 'Dhaka Premier International School',
      className = 'Class 10',
      section = 'Section A',
      desiredRoll = '1000',
      guardianName = 'Guardian',
      guardianPhone = '',
      password = 'password123',
    } = body;

    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { success: false, error: 'Full name, email, and phone are required' },
        { status: 400 }
      );
    }

    const db = getDatabase();

    // Check if application or user already exists
    const existing = db.admissions.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (existing) {
      return NextResponse.json(
        {
          success: true,
          message: 'Existing application found',
          application: existing,
        },
        { status: 200 }
      );
    }

    const newApp: AdmissionApplication = {
      id: `APP-${new Date().getFullYear()}-${String(db.admissions.length + 1).padStart(3, '0')}`,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      schoolId,
      schoolName,
      className,
      section,
      desiredRoll,
      guardianName: guardianName.trim(),
      guardianPhone: guardianPhone.trim() || phone.trim(),
      password,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    db.admissions.unshift(newApp);
    saveDatabase(db);

    return NextResponse.json(
      {
        success: true,
        message: 'Student admission application submitted for campus approval',
        application: newApp,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action, reviewNotes } = body; // action: 'approve' | 'reject'

    if (!id || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Valid application ID and action (approve/reject) required' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    const appIndex = db.admissions.findIndex((a) => a.id === id);

    if (appIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      );
    }

    const targetApp = db.admissions[appIndex];
    const newStatus = action === 'approve' ? 'approved' : 'rejected';

    targetApp.status = newStatus;
    targetApp.reviewNotes = reviewNotes || (action === 'approve' ? 'Approved & Enrolled by School Admin' : 'Declined during review');
    targetApp.reviewedAt = new Date().toISOString();

    // If approved, create or activate the student user account
    if (action === 'approve') {
      const userExists = db.users.some(
        (u) => u.email.toLowerCase() === targetApp.email.toLowerCase()
      );

      if (!userExists) {
        const newStudentUser: UserRecord = {
          id: `usr-${targetApp.id}`,
          email: targetApp.email,
          password: targetApp.password,
          fullName: targetApp.fullName,
          role: 'student',
          schoolId: targetApp.schoolId,
          schoolName: targetApp.schoolName,
          status: 'active',
          studentClass: targetApp.className,
          studentSection: targetApp.section,
          rollNumber: targetApp.desiredRoll,
          guardianName: targetApp.guardianName,
          guardianPhone: targetApp.guardianPhone,
          phone: targetApp.phone,
          createdAt: new Date().toISOString(),
        };
        db.users.push(newStudentUser);
      }
    }

    saveDatabase(db);

    return NextResponse.json({
      success: true,
      message: `Application ${targetApp.id} has been ${newStatus}.`,
      application: targetApp,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
