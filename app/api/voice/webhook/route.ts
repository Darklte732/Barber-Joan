import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { parseISO, addMinutes, format } from 'date-fns';

// POST /api/voice/webhook - Handle 11 Labs voice AI requests
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      intent,
      customer_name,
      customer_phone,
      service_type,
      preferred_date,
      preferred_time,
      appointment_id,
      language = 'es',
    } = body;

    console.log('Voice AI webhook received:', { intent, customer_phone, service_type });

    switch (intent) {
      case 'book':
        return await handleBooking(body, language);
      case 'cancel':
        return await handleCancellation(body, language);
      case 'reschedule':
        return await handleReschedule(body, language);
      case 'inquiry':
        return await handleInquiry(body, language);
      default:
        return NextResponse.json(
          {
            success: false,
            message: language === 'es'
              ? 'No entendí tu solicitud. ¿Puedes repetir?'
              : 'I did not understand your request. Can you repeat?',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Voice webhook error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Lo siento, hubo un error. Por favor intenta de nuevo.',
      },
      { status: 500 }
    );
  }
}

// Handle booking appointments
async function handleBooking(data: any, language: string) {
  const { customer_name, customer_phone, service_type, preferred_date, preferred_time } = data;

  // Validate required fields
  if (!customer_name || !customer_phone || !service_type || !preferred_date || !preferred_time) {
    return NextResponse.json({
      success: false,
      message: language === 'es'
        ? 'Necesito tu nombre, teléfono, servicio, fecha y hora preferida.'
        : 'I need your name, phone, service, preferred date and time.',
    });
  }

  try {
    // Find service by type
    const services = await db.getAllServices();
    const service = services.find((s) =>
      s.name.toLowerCase().includes(service_type.toLowerCase()) ||
      s.name_es.toLowerCase().includes(service_type.toLowerCase())
    );

    if (!service) {
      return NextResponse.json({
        success: false,
        message: language === 'es'
          ? `No encontré el servicio "${service_type}". Tenemos: corte de pelo, recorte de barba, y corte con barba.`
          : `Service "${service_type}" not found. We have: haircut, beard trim, and haircut with beard.`,
        data: { services },
      });
    }

    // Get or create customer
    let customer = await db.getCustomerByPhone(customer_phone);
    if (!customer) {
      customer = await db.createCustomer({
        name: customer_name,
        phone: customer_phone,
        preferred_language: language,
      });
    }

    // Parse date and time
    const dateTimeString = `${preferred_date}T${preferred_time}`;
    const startTime = parseISO(dateTimeString);
    const endTime = addMinutes(startTime, service.duration_minutes);

    // Create appointment
    const appointment = await db.createAppointment({
      customer_id: customer.id,
      service_id: service.id,
      start_time: startTime,
      end_time: endTime,
      price: service.price,
      created_by: 'voice_ai',
    });

    const fullAppointment = await db.getAppointmentById(appointment.id);

    const successMessage = language === 'es'
      ? `¡Perfecto! Tu cita para ${service.name_es} está confirmada para el ${format(startTime, 'EEEE d de MMMM')} a las ${format(startTime, 'h:mm a')}. Te va a llegar un mensaje de confirmación.`
      : `Perfect! Your appointment for ${service.name} is confirmed for ${format(startTime, 'EEEE, MMMM d')} at ${format(startTime, 'h:mm a')}. You'll receive a confirmation message.`;

    return NextResponse.json({
      success: true,
      message: successMessage,
      data: { appointment: fullAppointment },
    });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json({
      success: false,
      message: language === 'es'
        ? 'Lo siento, no pude crear la cita. Por favor intenta de nuevo.'
        : 'Sorry, I could not create the appointment. Please try again.',
    });
  }
}

// Handle cancellation
async function handleCancellation(data: any, language: string) {
  const { customer_phone, appointment_id } = data;

  if (!customer_phone && !appointment_id) {
    return NextResponse.json({
      success: false,
      message: language === 'es'
        ? 'Necesito tu número de teléfono para buscar tu cita.'
        : 'I need your phone number to find your appointment.',
    });
  }

  try {
    let appointment;

    if (appointment_id) {
      appointment = await db.getAppointmentById(appointment_id);
    } else if (customer_phone) {
      const customer = await db.getCustomerByPhone(customer_phone);
      if (!customer) {
        return NextResponse.json({
          success: false,
          message: language === 'es'
            ? 'No encontré ninguna cita con ese número de teléfono.'
            : 'I could not find any appointment with that phone number.',
        });
      }

      // Find upcoming appointments for this customer
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      const appointments = await db.getAppointmentsByDateRange(startDate, endDate);
      const customerAppointments = appointments.filter(
        (apt: any) => apt.customer_id === customer.id && apt.status !== 'cancelled'
      );

      if (customerAppointments.length === 0) {
        return NextResponse.json({
          success: false,
          message: language === 'es'
            ? 'No tienes citas programadas.'
            : 'You have no scheduled appointments.',
        });
      }

      appointment = customerAppointments[0];
    }

    if (!appointment) {
      return NextResponse.json({
        success: false,
        message: language === 'es'
          ? 'No encontré la cita.'
          : 'Appointment not found.',
      });
    }

    // Cancel the appointment
    await db.cancelAppointment(appointment.id);

    const startTime = new Date(appointment.start_time);
    const message = language === 'es'
      ? `Tu cita del ${format(startTime, 'EEEE d de MMMM')} a las ${format(startTime, 'h:mm a')} ha sido cancelada. Te va a llegar una confirmación.`
      : `Your appointment on ${format(startTime, 'EEEE, MMMM d')} at ${format(startTime, 'h:mm a')} has been cancelled. You'll receive a confirmation.`;

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error('Cancellation error:', error);
    return NextResponse.json({
      success: false,
      message: language === 'es'
        ? 'Lo siento, no pude cancelar la cita. Por favor intenta de nuevo.'
        : 'Sorry, I could not cancel the appointment. Please try again.',
    });
  }
}

// Handle rescheduling
async function handleReschedule(data: any, language: string) {
  const { customer_phone, appointment_id, preferred_date, preferred_time } = data;

  if (!preferred_date || !preferred_time) {
    return NextResponse.json({
      success: false,
      message: language === 'es'
        ? 'Necesito la nueva fecha y hora para cambiar tu cita.'
        : 'I need the new date and time to reschedule your appointment.',
    });
  }

  try {
    // First, find the appointment (similar to cancellation logic)
    let appointment;
    if (appointment_id) {
      appointment = await db.getAppointmentById(appointment_id);
    } else if (customer_phone) {
      const customer = await db.getCustomerByPhone(customer_phone);
      if (!customer) {
        return NextResponse.json({
          success: false,
          message: language === 'es'
            ? 'No encontré ninguna cita con ese número.'
            : 'I could not find any appointment with that number.',
        });
      }

      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      const appointments = await db.getAppointmentsByDateRange(startDate, endDate);
      const customerAppointments = appointments.filter(
        (apt: any) => apt.customer_id === customer.id && apt.status !== 'cancelled'
      );

      if (customerAppointments.length === 0) {
        return NextResponse.json({
          success: false,
          message: language === 'es'
            ? 'No tienes citas programadas.'
            : 'You have no scheduled appointments.',
        });
      }

      appointment = customerAppointments[0];
    }

    if (!appointment) {
      return NextResponse.json({
        success: false,
        message: language === 'es'
          ? 'No encontré la cita.'
          : 'Appointment not found.',
      });
    }

    // Parse new date and time
    const dateTimeString = `${preferred_date}T${preferred_time}`;
    const newStartTime = parseISO(dateTimeString);
    const service = await db.getServiceById(appointment.service_id);
    const newEndTime = addMinutes(newStartTime, service.duration_minutes);

    // Update appointment
    await db.updateAppointment(appointment.id, {
      start_time: newStartTime,
      end_time: newEndTime,
    });

    const message = language === 'es'
      ? `¡Perfecto! Tu cita se cambió para el ${format(newStartTime, 'EEEE d de MMMM')} a las ${format(newStartTime, 'h:mm a')}.`
      : `Perfect! Your appointment has been rescheduled to ${format(newStartTime, 'EEEE, MMMM d')} at ${format(newStartTime, 'h:mm a')}.`;

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error('Reschedule error:', error);
    return NextResponse.json({
      success: false,
      message: language === 'es'
        ? 'Lo siento, no pude cambiar la cita. Por favor intenta de nuevo.'
        : 'Sorry, I could not reschedule the appointment. Please try again.',
    });
  }
}

// Handle general inquiries
async function handleInquiry(data: any, language: string) {
  try {
    const services = await db.getAllServices();
    const settings = await db.getBusinessSettings();

    const servicesText = language === 'es'
      ? services.map((s) => `${s.name_es}: $${s.price} (${s.duration_minutes} minutos)`).join(', ')
      : services.map((s) => `${s.name}: $${s.price} (${s.duration_minutes} minutes)`).join(', ');

    const message = language === 'es'
      ? `Nuestros servicios son: ${servicesText}. Trabajamos de lunes a sábado de 9 AM a 6 PM. ¿Te gustaría hacer una cita?`
      : `Our services are: ${servicesText}. We work Monday to Saturday from 9 AM to 6 PM. Would you like to make an appointment?`;

    return NextResponse.json({
      success: true,
      message,
      data: { services, settings },
    });
  } catch (error) {
    console.error('Inquiry error:', error);
    return NextResponse.json({
      success: false,
      message: language === 'es'
        ? 'Lo siento, hubo un error. Por favor intenta de nuevo.'
        : 'Sorry, there was an error. Please try again.',
    });
  }
}
