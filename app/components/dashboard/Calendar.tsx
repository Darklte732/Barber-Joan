'use client';

import { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Appointment {
  id: string;
  start_time: string;
  end_time: string;
  customer_name: string;
  service_name: string;
  status: string;
}

interface CalendarProps {
  onAppointmentClick: (appointment: Appointment) => void;
  onTimeSlotClick: (date: Date, time: string) => void;
}

export function Calendar({ onAppointmentClick, onTimeSlotClick }: CalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday
  const weekDays = Array.from({ length: 6 }, (_, i) => addDays(weekStart, i)); // Mon-Sat

  const timeSlots = Array.from({ length: 10 }, (_, i) => {
    const hour = 9 + i;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  useEffect(() => {
    fetchAppointments();
  }, [currentWeek]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const startDate = weekStart.toISOString();
      const endDate = addDays(weekStart, 7).toISOString();

      const response = await fetch(
        `/api/appointments?startDate=${startDate}&endDate=${endDate}`
      );
      const data = await response.json();
      setAppointments(data.appointments || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAppointmentsForSlot = (date: Date, time: string) => {
    return appointments.filter((apt) => {
      const aptDate = parseISO(apt.start_time);
      const aptTime = format(aptDate, 'HH:mm');
      return isSameDay(aptDate, date) && aptTime === time;
    });
  };

  const goToPreviousWeek = () => {
    setCurrentWeek(addDays(currentWeek, -7));
  };

  const goToNextWeek = () => {
    setCurrentWeek(addDays(currentWeek, 7));
  };

  const goToToday = () => {
    setCurrentWeek(new Date());
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Calendar header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-bold text-gray-900">
          {format(weekStart, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={goToToday}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Hoy
          </button>
          <button
            onClick={goToPreviousWeek}
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNextWeek}
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b">
            <div className="p-4 text-sm font-medium text-gray-500">Time</div>
            {weekDays.map((day) => (
              <div
                key={day.toISOString()}
                className={`p-4 text-center ${
                  isSameDay(day, new Date()) ? 'bg-blue-50' : ''
                }`}
              >
                <div className="text-sm font-medium text-gray-900">
                  {format(day, 'EEE')}
                </div>
                <div
                  className={`text-2xl font-bold ${
                    isSameDay(day, new Date()) ? 'text-blue-600' : 'text-gray-900'
                  }`}
                >
                  {format(day, 'd')}
                </div>
              </div>
            ))}
          </div>

          {/* Time slots */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Loading appointments...</div>
            </div>
          ) : (
            <div className="divide-y">
              {timeSlots.map((time) => (
                <div key={time} className="grid grid-cols-7">
                  <div className="p-4 text-sm font-medium text-gray-500 border-r">
                    {time}
                  </div>
                  {weekDays.map((day) => {
                    const slotAppointments = getAppointmentsForSlot(day, time);
                    return (
                      <div
                        key={`${day.toISOString()}-${time}`}
                        className="p-2 border-r min-h-[80px] hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => {
                          if (slotAppointments.length === 0) {
                            onTimeSlotClick(day, time);
                          }
                        }}
                      >
                        {slotAppointments.map((apt) => (
                          <div
                            key={apt.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onAppointmentClick(apt);
                            }}
                            className={`p-2 mb-1 rounded text-xs cursor-pointer transition-all hover:shadow-md ${
                              apt.status === 'confirmed'
                                ? 'bg-green-100 text-green-800'
                                : apt.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : apt.status === 'completed'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            <div className="font-semibold truncate">
                              {apt.customer_name}
                            </div>
                            <div className="truncate">{apt.service_name}</div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
