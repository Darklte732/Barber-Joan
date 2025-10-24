// SMS Service - Configure with your preferred SMS provider (Twilio, etc.)

interface SMSConfig {
  apiKey?: string;
  apiSecret?: string;
  phoneNumber?: string;
}

const smsConfig: SMSConfig = {
  apiKey: process.env.SMS_API_KEY,
  apiSecret: process.env.SMS_API_SECRET,
  phoneNumber: process.env.SMS_PHONE_NUMBER,
};

export async function sendSMS(to: string, message: string): Promise<boolean> {
  try {
    // TODO: Implement with your SMS provider (Twilio, AWS SNS, etc.)
    // Example with Twilio:
    /*
    const client = require('twilio')(smsConfig.apiKey, smsConfig.apiSecret);

    const result = await client.messages.create({
      body: message,
      from: smsConfig.phoneNumber,
      to: to,
    });

    return result.status === 'queued' || result.status === 'sent';
    */

    // For now, just log the SMS
    console.log('SMS would be sent:', { to, message });
    return true;
  } catch (error) {
    console.error('Error sending SMS:', error);
    return false;
  }
}

export async function sendAppointmentConfirmation(
  phone: string,
  customerName: string,
  serviceName: string,
  dateTime: string,
  language: 'en' | 'es' = 'es'
): Promise<boolean> {
  const message =
    language === 'es'
      ? `Hola ${customerName}! Tu cita para ${serviceName} está confirmada para ${dateTime}. Joan's Barbershop. Para cancelar, llama al ${smsConfig.phoneNumber}.`
      : `Hi ${customerName}! Your appointment for ${serviceName} is confirmed for ${dateTime}. Joan's Barbershop. To cancel, call ${smsConfig.phoneNumber}.`;

  return await sendSMS(phone, message);
}

export async function sendAppointmentReminder(
  phone: string,
  customerName: string,
  serviceName: string,
  dateTime: string,
  language: 'en' | 'es' = 'es'
): Promise<boolean> {
  const message =
    language === 'es'
      ? `Recordatorio: ${customerName}, tienes una cita para ${serviceName} mañana a las ${dateTime}. Joan's Barbershop. Hasta pronto!`
      : `Reminder: ${customerName}, you have an appointment for ${serviceName} tomorrow at ${dateTime}. Joan's Barbershop. See you soon!`;

  return await sendSMS(phone, message);
}

export async function sendAppointmentCancellation(
  phone: string,
  customerName: string,
  dateTime: string,
  language: 'en' | 'es' = 'es'
): Promise<boolean> {
  const message =
    language === 'es'
      ? `Hola ${customerName}, tu cita del ${dateTime} ha sido cancelada. Joan's Barbershop. Para una nueva cita, llámanos!`
      : `Hi ${customerName}, your appointment on ${dateTime} has been cancelled. Joan's Barbershop. Call us for a new appointment!`;

  return await sendSMS(phone, message);
}

export async function sendAppointmentReschedule(
  phone: string,
  customerName: string,
  serviceName: string,
  oldDateTime: string,
  newDateTime: string,
  language: 'en' | 'es' = 'es'
): Promise<boolean> {
  const message =
    language === 'es'
      ? `Hola ${customerName}, tu cita para ${serviceName} se cambió del ${oldDateTime} al ${newDateTime}. Joan's Barbershop.`
      : `Hi ${customerName}, your appointment for ${serviceName} has been rescheduled from ${oldDateTime} to ${newDateTime}. Joan's Barbershop.`;

  return await sendSMS(phone, message);
}

// Utility function to format phone number (if needed)
export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');

  // Add country code if not present (assume Dominican Republic +1-809)
  if (cleaned.length === 10 && !cleaned.startsWith('1')) {
    return `+1${cleaned}`;
  }

  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`;
  }

  return `+${cleaned}`;
}
