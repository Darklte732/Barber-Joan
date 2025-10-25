// Database Types

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'barber';
  created_at: Date;
  updated_at: Date;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  preferred_language: 'en' | 'es';
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Service {
  id: string;
  name: string;
  name_es: string;
  duration_minutes: number;
  price: number;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type AppointmentSource = 'voice_ai' | 'manual' | 'customer';

export interface Appointment {
  id: string;
  customer_id: string;
  service_id: string;
  start_time: Date;
  end_time: Date;
  status: AppointmentStatus;
  price: number;
  notes?: string;
  created_by: AppointmentSource;
  reminder_sent: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AppointmentWithDetails extends Appointment {
  customer: Customer;
  service: Service;
}

export interface BusinessHours {
  [key: string]: {
    open: string | null;
    close: string | null;
  };
}

export interface BusinessSettings {
  id: string;
  business_name: string;
  phone_number: string;
  timezone: string;
  business_hours: BusinessHours;
  buffer_minutes: number;
  advance_booking_days: number;
  updated_at: Date;
}

export interface BlockedTime {
  id: string;
  start_time: Date;
  end_time: Date;
  reason?: string;
  created_at: Date;
}

// API Request/Response Types

export interface CreateAppointmentRequest {
  customer_name: string;
  customer_phone: string;
  service_id: string;
  start_time: string;
  notes?: string;
  created_by?: AppointmentSource;
}

export interface UpdateAppointmentRequest {
  start_time?: string;
  service_id?: string;
  status?: AppointmentStatus;
  notes?: string;
}

export interface VoiceAIRequest {
  intent: 'book' | 'cancel' | 'reschedule' | 'inquiry';
  customer_name?: string;
  customer_phone?: string;
  service_type?: string;
  preferred_date?: string;
  preferred_time?: string;
  appointment_id?: string;
  language: 'en' | 'es';
}

export interface VoiceAIResponse {
  success: boolean;
  message: string;
  data?: {
    appointment?: AppointmentWithDetails;
    available_times?: string[];
    services?: Service[];
  };
}

export interface AvailabilityRequest {
  date: string;
  service_id: string;
}

export interface AvailabilityResponse {
  available: boolean;
  available_slots: Array<{
    start: string;
    end: string;
  }>;
}

// UI Component Props Types

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: AppointmentWithDetails;
}
