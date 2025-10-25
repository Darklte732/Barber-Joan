'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment?: any;
  defaultDate?: Date;
  defaultTime?: string;
  onSave: () => void;
}

export function AppointmentModal({
  isOpen,
  onClose,
  appointment,
  defaultDate,
  defaultTime,
  onSave,
}: AppointmentModalProps) {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    service_id: '',
    date: '',
    time: '',
    notes: '',
    status: 'pending',
  });
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchServices();
      if (appointment) {
        const startTime = new Date(appointment.start_time);
        setFormData({
          customer_name: appointment.customer_name || '',
          customer_phone: appointment.customer_phone || '',
          service_id: appointment.service_id || '',
          date: format(startTime, 'yyyy-MM-dd'),
          time: format(startTime, 'HH:mm'),
          notes: appointment.notes || '',
          status: appointment.status || 'pending',
        });
      } else if (defaultDate && defaultTime) {
        setFormData({
          customer_name: '',
          customer_phone: '',
          service_id: '',
          date: format(defaultDate, 'yyyy-MM-dd'),
          time: defaultTime,
          notes: '',
          status: 'pending',
        });
      }
    }
  }, [isOpen, appointment, defaultDate, defaultTime]);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      setServices(data.services || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const startDateTime = `${formData.date}T${formData.time}:00`;

      if (appointment) {
        const response = await fetch(`/api/appointments/${appointment.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            start_time: startDateTime,
            service_id: formData.service_id,
            status: formData.status,
            notes: formData.notes,
          }),
        });

        if (!response.ok) throw new Error('Failed to update appointment');
      } else {
        const response = await fetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_name: formData.customer_name,
            customer_phone: formData.customer_phone,
            service_id: formData.service_id,
            start_time: startDateTime,
            notes: formData.notes,
          }),
        });

        if (!response.ok) throw new Error('Failed to create appointment');
      }

      onSave();
      onClose();
      resetForm();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!appointment) return;

    if (!confirm('¿Estás seguro de que quieres cancelar esta cita?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/appointments/${appointment.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('No se pudo cancelar la cita');

      onSave();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      customer_name: '',
      customer_phone: '',
      service_id: '',
      date: '',
      time: '',
      notes: '',
      status: 'pending',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {appointment ? 'Editar Cita' : 'Nueva Cita'}
          </DialogTitle>
          <DialogDescription>
            {appointment
              ? 'Actualiza los detalles de la cita a continuación.'
              : 'Completa los detalles para crear una nueva cita.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="customer_name">Nombre del Cliente *</Label>
            <Input
              id="customer_name"
              required
              disabled={!!appointment || loading}
              value={formData.customer_name}
              onChange={(e) =>
                setFormData({ ...formData, customer_name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer_phone">Número de Teléfono *</Label>
            <Input
              id="customer_phone"
              type="tel"
              required
              disabled={!!appointment || loading}
              value={formData.customer_phone}
              onChange={(e) =>
                setFormData({ ...formData, customer_phone: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service_id">Servicio *</Label>
            <Select
              value={formData.service_id}
              onValueChange={(value) =>
                setFormData({ ...formData, service_id: value })
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un servicio" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name_es} - ${service.price} ({service.duration_minutes} min)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha *</Label>
              <Input
                id="date"
                type="date"
                required
                disabled={loading}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Hora *</Label>
              <Input
                id="time"
                type="time"
                required
                disabled={loading}
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>

          {appointment && (
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="confirmed">Confirmada</SelectItem>
                  <SelectItem value="completed">Completada</SelectItem>
                  <SelectItem value="no_show">No Asistió</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              disabled={loading}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            {appointment && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancelar Cita
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose}>
              Cerrar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
