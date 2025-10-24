import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { parseISO, addMinutes } from 'date-fns';

// GET /api/appointments/[id] - Get a specific appointment
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const appointment = await db.getAppointmentById(params.id);

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ appointment });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointment' },
      { status: 500 }
    );
  }
}

// PUT /api/appointments/[id] - Update an appointment
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { start_time, service_id, status, notes } = body;

    const updateData: any = {};

    if (start_time) {
      const startDateTime = parseISO(start_time);
      updateData.start_time = startDateTime;

      // If service_id is provided or we need to get the current one
      if (service_id) {
        const service = await db.getServiceById(service_id);
        if (!service) {
          return NextResponse.json(
            { error: 'Service not found' },
            { status: 404 }
          );
        }
        updateData.end_time = addMinutes(startDateTime, service.duration_minutes);
      } else {
        // Get current appointment to calculate new end time
        const currentAppointment = await db.getAppointmentById(params.id);
        if (currentAppointment) {
          const service = await db.getServiceById(currentAppointment.service_id);
          updateData.end_time = addMinutes(startDateTime, service.duration_minutes);
        }
      }
    }

    if (status) {
      updateData.status = status;
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const updatedAppointment = await db.updateAppointment(params.id, updateData);

    if (!updatedAppointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Fetch full appointment details
    const fullAppointment = await db.getAppointmentById(params.id);

    return NextResponse.json({ appointment: fullAppointment });
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}

// DELETE /api/appointments/[id] - Cancel an appointment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const appointment = await db.cancelAppointment(params.id);

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Appointment cancelled successfully',
      appointment,
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return NextResponse.json(
      { error: 'Failed to cancel appointment' },
      { status: 500 }
    );
  }
}
