'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Scissors, Mail, Lock, Sparkles, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Authentication temporarily disabled - redirecting directly to dashboard
    setTimeout(() => {
      router.push('/dashboard');
    }, 500);

    /* Temporarily disabled authentication
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('Correo electrónico o contraseña inválidos');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Ocurrió un error. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
    */
  };

  return (
    <div className="min-h-screen barber-gradient relative overflow-hidden flex items-center justify-center p-4">
      {/* Back to Landing Page Button */}
      <Link
        href="/"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-xl border border-yellow-500/30 rounded-full text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-500/50 hover:text-yellow-300 transition-all duration-300 hover:scale-105 shadow-lg group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
        <span className="text-sm font-medium hidden sm:inline">Volver</span>
      </Link>

      {/* Animated barber pole accent */}
      <div className="fixed top-0 left-0 w-2 h-full barber-pole opacity-30 z-0"></div>
      <div className="fixed top-0 right-0 w-2 h-full barber-pole opacity-30 z-0"></div>

      {/* Decorative animated elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-yellow-400/5 rounded-full blur-2xl animate-pulse delay-1000"></div>

      <Card className="w-full max-w-md shadow-2xl bg-black/60 backdrop-blur-xl border-yellow-500/30 fade-in relative overflow-hidden group">
        {/* Shimmer effect on card */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

        <CardHeader className="space-y-3 text-center relative">
          <div className="flex justify-center mb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500/30 blur-xl rounded-full animate-pulse"></div>
              <div className="relative p-4 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full gold-shimmer">
                <Scissors className="w-10 h-10 text-black" />
              </div>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Barbería de Joan
          </CardTitle>
          <CardDescription className="text-gray-300 text-base">
            Inicia sesión para acceder a tu panel de control
          </CardDescription>
        </CardHeader>

        <CardContent className="relative">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200 text-sm font-medium">
                Correo Electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="booklovers159@gmail.com"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 bg-black/50 border-yellow-500/30 text-white placeholder:text-gray-500 focus:border-yellow-500 focus:ring-yellow-500/50 transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-200 text-sm font-medium">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 bg-black/50 border-yellow-500/30 text-white placeholder:text-gray-500 focus:border-yellow-500 focus:ring-yellow-500/50 transition-all duration-300"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 animate-shake">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold text-base h-11 shadow-lg hover:shadow-yellow-500/50 transition-all duration-300 transform hover:scale-[1.02]"
              size="lg"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Iniciar Sesión</span>
                </div>
              )}
            </Button>
          </form>

          <div className="mt-8 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg backdrop-blur-sm">
            <div className="text-sm text-gray-300 space-y-2 text-center">
              <p className="font-medium text-yellow-400 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                Credenciales por Defecto:
              </p>
              <div className="space-y-1">
                <p className="font-mono text-xs bg-black/40 px-3 py-2 rounded border border-yellow-500/20 text-yellow-300">
                  booklovers159@gmail.com
                </p>
                <p className="font-mono text-xs bg-black/40 px-3 py-2 rounded border border-yellow-500/20 text-yellow-300">
                  Saint159753!!
                </p>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                ⚠️ Cambia la contraseña después de iniciar sesión
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
