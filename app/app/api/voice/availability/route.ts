import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { parseISO, startOfDay, endOfDay, addMinutes, isWithinInterval, isBefore, isAfter } from 'date-fns';

// POST /api/voice/availability - Check available time slots for a given date
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, service_id } = body;

    if (!date || !service_id) {
      return NextResponse.json(
        { error: 'Date and service_id are required' },
        { status: 400 }
      );
    }

    // Get service details
    const service = await db.getServiceById(service_id);
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Get business settings
    const settings = await db.getBusinessSettings();
    if (!settings) {
      return NextResponse.json(
        { error: 'Business settings not found' },
        { status: 500 }
      );
    }

    // Parse the requested date
    const requestedDate = parseISO(date);
    const dayOfWeek = requestedDate.toLocaleDateString('en-US', { weekday: 'lowercase' });

    // Check if business is open on this day
    const dayHours = settings.business_hours[dayOfWeek];
    if (!dayHours || !dayHours.open || !dayHours.close) {
      return NextResponse.json({
        available: false,
        available_slots: [],
        message: 'Business is closed on this day',
      });
    }

    // Get existing appointments for this day
    const appointments = await db.getAppointmentsByDateRange(
      startOfDay(requestedDate),
      endOfDay(requestedDate)
    );

    // Get blocked times
    const blockedTimes = await db.getBlockedTimesByDateRange(
      startOfDay(requestedDate),
      endOfDay(requestedDate)
    );

    // Parse business hours
    const [openHour, openMinute] = dayHours.open.split(':').map(Number);
    const [closeHour, closeMinute] = dayHours.close.split(':').map(Number);

    const businessOpen = new Date(requestedDate);
    businessOpen.setHours(openHour, openMinute, 0, 0);

    const businessClose = new Date(requestedDate);
    businessClose.setHours(closeHour, closeMinute, 0, 0);

    // Generate time slots (every 15 minutes)
    const slots = [];
    let currentSlot = businessOpen;

    while (isBefore(currentSlot, businessClose)) {
      const slotEnd = addMinutes(currentSlot, service.duration_minutes);

      // Check if slot end is before business close
      if (isAfter(slotEnd, businessClose)) {
        break;
      }

      // Check if slot conflicts with existing appointments
      const hasConflict = appointments.some((apt) => {
        const aptStart = new Date(apt.start_time);
        const aptEnd = new Date(apt.end_time);

        return (
          (isWithinInterval(currentSlot, { start: aptStart, end: aptEnd }) ||
            isWithinInterval(slotEnd, { start: aptStart, end: aptEnd }) ||
            (isBefore(currentSlot, aptStart) && isAfter(slotEnd, aptEnd)))
        );
      });

      // Check if slot conflicts with blocked times
      const isBlocked = blockedTimes.some((blocked) => {
        const blockedStart = new Date(blocked.start_time);
        const blockedEnd = new Date(blocked.end_time);

        return (
          (isWithinInterval(currentSlot, { start: blockedStart, end: blockedEnd }) ||
            isWithinInterval(slotEnd, { start: blockedStart, end: blockedEnd }) ||
            (isBefore(currentSlot, blockedStart) && isAfter(slotEnd, blockedEnd)))
        );
      });

      if (!hasConflict && !isBlocked) {
        slots.push({
          start: currentSlot.toISOString(),
          end: slotEnd.toISOString(),
        });
      }

      // Move to next slot (15 minute intervals)
      currentSlot = addMinutes(currentSlot, 15);
    }

    return NextResponse.json({
      available: slots.length > 0,
      available_slots: slots,
      date,
      service_name: service.name,
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
}
