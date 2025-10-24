import { parseISO, isBefore, isAfter, addMinutes, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { db } from '../db';

export interface AppointmentValidationResult {
  valid: boolean;
  error?: string;
  conflicts?: any[];
}

/**
 * Validate if an appointment can be booked at the specified time
 */
export async function validateAppointmentTime(
  startTime: Date,
  endTime: Date,
  excludeAppointmentId?: string
): Promise<AppointmentValidationResult> {
  try {
    // Check if the time is in the past
    if (isBefore(startTime, new Date())) {
      return {
        valid: false,
        error: 'Cannot book appointments in the past',
      };
    }

    // Check if end time is after start time
    if (!isAfter(endTime, startTime)) {
      return {
        valid: false,
        error: 'End time must be after start time',
      };
    }

    // Get business settings
    const settings = await db.getBusinessSettings();
    if (!settings) {
      return {
        valid: false,
        error: 'Business settings not found',
      };
    }

    // Check if the appointment is within business hours
    const dayOfWeek = startTime.toLocaleDateString('en-US', { weekday: 'lowercase' });
    const dayHours = settings.business_hours[dayOfWeek];

    if (!dayHours || !dayHours.open || !dayHours.close) {
      return {
        valid: false,
        error: 'Business is closed on this day',
      };
    }

    // Parse business hours
    const [openHour, openMinute] = dayHours.open.split(':').map(Number);
    const [closeHour, closeMinute] = dayHours.close.split(':').map(Number);

    const businessOpen = new Date(startTime);
    businessOpen.setHours(openHour, openMinute, 0, 0);

    const businessClose = new Date(startTime);
    businessClose.setHours(closeHour, closeMinute, 0, 0);

    if (isBefore(startTime, businessOpen) || isAfter(endTime, businessClose)) {
      return {
        valid: false,
        error: `Business hours are ${dayHours.open} - ${dayHours.close}`,
      };
    }

    // Check for conflicting appointments
    const dayStart = startOfDay(startTime);
    const dayEnd = endOfDay(startTime);
    const existingAppointments = await db.getAppointmentsByDateRange(dayStart, dayEnd);

    const conflicts = existingAppointments.filter((apt: any) => {
      // Skip if this is the same appointment being updated
      if (excludeAppointmentId && apt.id === excludeAppointmentId) {
        return false;
      }

      // Skip cancelled appointments
      if (apt.status === 'cancelled') {
        return false;
      }

      const aptStart = new Date(apt.start_time);
      const aptEnd = new Date(apt.end_time);

      // Check if times overlap
      return (
        isWithinInterval(startTime, { start: aptStart, end: aptEnd }) ||
        isWithinInterval(endTime, { start: aptStart, end: aptEnd }) ||
        (isBefore(startTime, aptStart) && isAfter(endTime, aptEnd))
      );
    });

    if (conflicts.length > 0) {
      return {
        valid: false,
        error: 'This time slot conflicts with existing appointments',
        conflicts,
      };
    }

    // Check for blocked times
    const blockedTimes = await db.getBlockedTimesByDateRange(dayStart, dayEnd);
    const blockedConflicts = blockedTimes.filter((blocked: any) => {
      const blockedStart = new Date(blocked.start_time);
      const blockedEnd = new Date(blocked.end_time);

      return (
        isWithinInterval(startTime, { start: blockedStart, end: blockedEnd }) ||
        isWithinInterval(endTime, { start: blockedStart, end: blockedEnd }) ||
        (isBefore(startTime, blockedStart) && isAfter(endTime, blockedEnd))
      );
    });

    if (blockedConflicts.length > 0) {
      return {
        valid: false,
        error: 'This time is blocked',
        conflicts: blockedConflicts,
      };
    }

    return { valid: true };
  } catch (error) {
    console.error('Error validating appointment time:', error);
    return {
      valid: false,
      error: 'Error validating appointment time',
    };
  }
}

/**
 * Validate customer information
 */
export function validateCustomerInfo(name: string, phone: string): AppointmentValidationResult {
  if (!name || name.trim().length < 2) {
    return {
      valid: false,
      error: 'Customer name must be at least 2 characters',
    };
  }

  if (!phone || phone.trim().length < 10) {
    return {
      valid: false,
      error: 'Invalid phone number',
    };
  }

  return { valid: true };
}

/**
 * Check if a service exists and is active
 */
export async function validateService(serviceId: string): Promise<AppointmentValidationResult> {
  try {
    const service = await db.getServiceById(serviceId);

    if (!service) {
      return {
        valid: false,
        error: 'Service not found',
      };
    }

    if (!service.active) {
      return {
        valid: false,
        error: 'Service is not active',
      };
    }

    return { valid: true };
  } catch (error) {
    console.error('Error validating service:', error);
    return {
      valid: false,
      error: 'Error validating service',
    };
  }
}

/**
 * Find available time slots for a given date and service
 */
export async function findAvailableSlots(
  date: Date,
  serviceId: string
): Promise<Array<{ start: Date; end: Date }>> {
  try {
    const service = await db.getServiceById(serviceId);
    if (!service) return [];

    const settings = await db.getBusinessSettings();
    if (!settings) return [];

    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'lowercase' });
    const dayHours = settings.business_hours[dayOfWeek];

    if (!dayHours || !dayHours.open || !dayHours.close) {
      return [];
    }

    // Parse business hours
    const [openHour, openMinute] = dayHours.open.split(':').map(Number);
    const [closeHour, closeMinute] = dayHours.close.split(':').map(Number);

    const businessOpen = new Date(date);
    businessOpen.setHours(openHour, openMinute, 0, 0);

    const businessClose = new Date(date);
    businessClose.setHours(closeHour, closeMinute, 0, 0);

    // Get existing appointments and blocked times
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    const [appointments, blockedTimes] = await Promise.all([
      db.getAppointmentsByDateRange(dayStart, dayEnd),
      db.getBlockedTimesByDateRange(dayStart, dayEnd),
    ]);

    // Generate potential slots (every 15 minutes)
    const slots: Array<{ start: Date; end: Date }> = [];
    let currentSlot = businessOpen;

    while (isBefore(currentSlot, businessClose)) {
      const slotEnd = addMinutes(currentSlot, service.duration_minutes);

      // Check if slot end is before business close
      if (isAfter(slotEnd, businessClose)) {
        break;
      }

      // Check for conflicts with appointments
      const hasAppointmentConflict = appointments.some((apt: any) => {
        if (apt.status === 'cancelled') return false;

        const aptStart = new Date(apt.start_time);
        const aptEnd = new Date(apt.end_time);

        return (
          isWithinInterval(currentSlot, { start: aptStart, end: aptEnd }) ||
          isWithinInterval(slotEnd, { start: aptStart, end: aptEnd }) ||
          (isBefore(currentSlot, aptStart) && isAfter(slotEnd, aptEnd))
        );
      });

      // Check for conflicts with blocked times
      const hasBlockedConflict = blockedTimes.some((blocked: any) => {
        const blockedStart = new Date(blocked.start_time);
        const blockedEnd = new Date(blocked.end_time);

        return (
          isWithinInterval(currentSlot, { start: blockedStart, end: blockedEnd }) ||
          isWithinInterval(slotEnd, { start: blockedStart, end: blockedEnd }) ||
          (isBefore(currentSlot, blockedStart) && isAfter(slotEnd, blockedEnd))
        );
      });

      if (!hasAppointmentConflict && !hasBlockedConflict) {
        slots.push({ start: currentSlot, end: slotEnd });
      }

      currentSlot = addMinutes(currentSlot, 15);
    }

    return slots;
  } catch (error) {
    console.error('Error finding available slots:', error);
    return [];
  }
}
