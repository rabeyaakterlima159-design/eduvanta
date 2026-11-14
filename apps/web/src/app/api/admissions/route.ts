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
      schoolName = 'Green Hill International School (GHIS-BD)',
      className = 'Class 10',
      section = 'Section A',
      desiredRoll = '03',
      guardianName = 'Guardian',
      guardianPhone = '',
      password = 'password123',
    } = body;

    if (!fullName || !password) {
      return NextResponse.json(
        { success: false, error: 'Full name and password are required' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    const userEmail = email ? email.trim().toLowerCase() : `${fullName.trim().toLowerCase().replaceAll(' ', '')}@greenhill.edu.bd`;

    const existing = db.admissions.find(
      (a) => a.email.toLowerCase() === userEmail
    );
    if (existing) {
      return NextResponse.json(
        { success: true, message: 'Existing application found', application: existing },
        { status: 200 }
      );
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newApp: AdmissionApplication = {
      id: `GHIS-${new Date().getFullYear()}-${randomSuffix}`,
      fullName: fullName.trim(),
      email: userEmail,
      phone: phone || guardianPhone || '+8801700000000',
      schoolId,
      schoolName,
      className,
      section,
      desiredRoll,
      guardianName: guardianName.trim(),
      guardianPhone: guardianPhone.trim() || phone || '+8801700000000',
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
    const { id, action, reviewNotes } = body;

    if (!id || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Valid application ID and action required' },
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
    targetApp.reviewNotes = reviewNotes || (action === 'approve' ? 'Approved & Enrolled by School Admin' : 'Declined');
    targetApp.reviewedAt = new Date().toISOString();

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
          subtitle: 'Verified Enrolled Student',
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
