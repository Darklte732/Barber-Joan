'use client';

import { useState } from 'react';
import { Calendar } from '@/components/dashboard/Calendar';
import { AppointmentModal } from '@/components/appointments/AppointmentModal';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAppointmentClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setSelectedDate(null);
    setSelectedTime('');
    setIsModalOpen(true);
  };

  const handleTimeSlotClick = (date: Date, time: string) => {
    setSelectedAppointment(null);
    setSelectedDate(date);
    setSelectedTime(time);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
    setSelectedDate(null);
    setSelectedTime('');
  };

  const handleSave = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendario</h1>
          <p className="text-gray-600 mt-1">Gestiona tus citas</p>
        </div>
        <Button
          onClick={() => {
            setSelectedAppointment(null);
            setSelectedDate(new Date());
            setSelectedTime('09:00');
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Cita
        </Button>
      </div>

      <Calendar
        key={refreshKey}
        onAppointmentClick={handleAppointmentClick}
        onTimeSlotClick={handleTimeSlotClick}
      />

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        appointment={selectedAppointment}
        defaultDate={selectedDate || undefined}
        defaultTime={selectedTime}
        onSave={handleSave}
      />
    </div>
  );
}
