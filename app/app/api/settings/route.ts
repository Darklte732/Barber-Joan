import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// GET /api/settings - Get business settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await db.getBusinessSettings();

    if (!settings) {
      return NextResponse.json(
        { error: 'Business settings not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT /api/settings - Update business settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin can update settings
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      business_name,
      phone_number,
      timezone,
      business_hours,
      buffer_minutes,
      advance_booking_days,
    } = body;

    const updateData: any = {};
    if (business_name) updateData.business_name = business_name;
    if (phone_number) updateData.phone_number = phone_number;
    if (timezone) updateData.timezone = timezone;
    if (business_hours) updateData.business_hours = business_hours;
    if (buffer_minutes !== undefined) updateData.buffer_minutes = buffer_minutes;
    if (advance_booking_days !== undefined)
      updateData.advance_booking_days = advance_booking_days;

    const settings = await db.updateBusinessSettings(updateData);

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
