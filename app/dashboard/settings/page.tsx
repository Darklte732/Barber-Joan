'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Save } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [settingsRes, servicesRes] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/services'),
      ]);

      const settingsData = await settingsRes.json();
      const servicesData = await servicesRes.json();

      setSettings(settingsData.settings);
      setServices(servicesData.services || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error('Failed to save settings');

      setMessage('¡Configuración guardada exitosamente!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const updateBusinessHours = (day: string, field: 'open' | 'close', value: string) => {
    setSettings({
      ...settings,
      business_hours: {
        ...settings.business_hours,
        [day]: {
          ...settings.business_hours[day],
          [field]: value || null,
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Cargando configuración...</div>
      </div>
    );
  }

  const daysOfWeek = [
    { key: 'monday', label: 'Lunes' },
    { key: 'tuesday', label: 'Martes' },
    { key: 'wednesday', label: 'Miércoles' },
    { key: 'thursday', label: 'Jueves' },
    { key: 'friday', label: 'Viernes' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600 mt-1">Gestiona la configuración de tu negocio</p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.includes('Error')
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-green-50 text-green-800 border border-green-200'
          }`}
        >
          {message}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Negocio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Negocio
              </label>
              <input
                type="text"
                value={settings?.business_name || ''}
                onChange={(e) =>
                  setSettings({ ...settings, business_name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Teléfono
              </label>
              <input
                type="tel"
                value={settings?.phone_number || ''}
                onChange={(e) =>
                  setSettings({ ...settings, phone_number: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zona Horaria
              </label>
              <select
                value={settings?.timezone || 'America/Santo_Domingo'}
                onChange={(e) =>
                  setSettings({ ...settings, timezone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="America/Santo_Domingo">Santo Domingo (UTC-4)</option>
                <option value="America/New_York">New York (UTC-5)</option>
                <option value="America/Chicago">Chicago (UTC-6)</option>
                <option value="America/Los_Angeles">Los Angeles (UTC-8)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiempo de Espera (minutos)
              </label>
              <input
                type="number"
                min="0"
                max="60"
                value={settings?.buffer_minutes || 10}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    buffer_minutes: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Tiempo entre citas
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reserva Anticipada (días)
              </label>
              <input
                type="number"
                min="1"
                max="90"
                value={settings?.advance_booking_days || 30}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    advance_booking_days: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Con cuánta anticipación pueden reservar los clientes
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Business Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Horario del Negocio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {daysOfWeek.map((day) => {
              const hours = settings?.business_hours?.[day.key] || {
                open: null,
                close: null,
              };
              const isClosed = !hours.open || !hours.close;

              return (
                <div key={day.key} className="grid grid-cols-3 gap-3 items-center">
                  <div className="font-medium text-sm">{day.label}</div>
                  <input
                    type="time"
                    value={hours.open || ''}
                    onChange={(e) =>
                      updateBusinessHours(day.key, 'open', e.target.value)
                    }
                    disabled={isClosed && !hours.open}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                  <input
                    type="time"
                    value={hours.close || ''}
                    onChange={(e) =>
                      updateBusinessHours(day.key, 'close', e.target.value)
                    }
                    disabled={isClosed && !hours.close}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Services */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Servicios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Servicio
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Nombre en Español
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Duración
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Precio
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service.id} className="border-b">
                      <td className="py-3 px-4">{service.name}</td>
                      <td className="py-3 px-4">{service.name_es}</td>
                      <td className="py-3 px-4">{service.duration_minutes} min</td>
                      <td className="py-3 px-4">${service.price}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            service.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {service.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSaveSettings} disabled={saving} size="lg">
          <Save className="w-5 h-5 mr-2" />
          {saving ? 'Guardando...' : 'Guardar Configuración'}
        </Button>
      </div>
    </div>
  );
}
