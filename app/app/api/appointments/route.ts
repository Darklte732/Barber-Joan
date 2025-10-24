import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { addMinutes, parseISO, startOfDay, endOfDay } from 'date-fns';

// GET /api/appointments - List appointments with optional filters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let appointments;

    if (date) {
      // Get appointments for a specific day
      const day = parseISO(date);
      appointments = await db.getAppointmentsByDateRange(
        startOfDay(day),
        endOfDay(day)
      );
    } else if (startDate && endDate) {
      // Get appointments for a date range
      appointments = await db.getAppointmentsByDateRange(
        parseISO(startDate),
        parseISO(endDate)
      );
    } else {
      // Default: get appointments for today
      const today = new Date();
      appointments = await db.getAppointmentsByDateRange(
        startOfDay(today),
        endOfDay(today)
      );
    }

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

// POST /api/appointments - Create a new appointment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      customer_name,
      customer_phone,
      service_id,
      start_time,
      notes,
      created_by = 'manual',
    } = body;

    // Validate required fields
    if (!customer_name || !customer_phone || !service_id || !start_time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get or create customer
    let customer = await db.getCustomerByPhone(customer_phone);
    if (!customer) {
      customer = await db.createCustomer({
        name: customer_name,
        phone: customer_phone,
      });
    }

    // Get service details
    const service = await db.getServiceById(service_id);
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Calculate end time based on service duration
    const startDateTime = parseISO(start_time);
    const endDateTime = addMinutes(startDateTime, service.duration_minutes);

    // Create appointment
    const appointment = await db.createAppointment({
      customer_id: customer.id,
      service_id: service.id,
      start_time: startDateTime,
      end_time: endDateTime,
      price: service.price,
      notes,
      created_by,
    });

    // Fetch full appointment details
    const fullAppointment = await db.getAppointmentById(appointment.id);

    return NextResponse.json({ appointment: fullAppointment }, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}
