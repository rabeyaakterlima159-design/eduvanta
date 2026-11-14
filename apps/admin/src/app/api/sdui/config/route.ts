import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDatabase();
    return NextResponse.json({
      success: true,
      config: db.sdui,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const db = getDatabase();

    db.sdui = {
      ...db.sdui,
      ...body,
      version: (db.sdui.version || 1) + 1,
    };

    saveDatabase(db);

    return NextResponse.json({
      success: true,
      message: 'Server-Driven UI configuration updated remotely',
      config: db.sdui,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
