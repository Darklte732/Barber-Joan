'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Scissors, Instagram, Facebook, MessageCircle, MapPin, Phone } from 'lucide-react';
import { GalleryGrid } from '@/components/landing/GalleryGrid';
import { MediaViewerModal } from '@/components/landing/MediaViewerModal';
import { ElevenLabsWidget } from '@/components/landing/ElevenLabsWidget';

export default function HomePage() {
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMediaClick = (media: any) => {
    setSelectedMedia(media);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedMedia(null), 300); // Wait for animation
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      {/* Header/Nav */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-xl border-b border-yellow-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <Scissors className="w-5 h-5 text-black" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  Barbería de Joan
                </h1>
                <p className="text-xs text-gray-400">El Seibo, RD</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Social Media Icons */}
              <div className="flex items-center gap-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-yellow-400 transition-all duration-300 hover:scale-110"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-yellow-400 transition-all duration-300 hover:scale-110"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-yellow-400 transition-all duration-300 hover:scale-110"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>

              {/* Admin Button */}
              <Link href="/dashboard">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 hidden sm:flex"
                >
                  Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Compact */}
      <section className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              Cortes Profesionales
            </span>
          </h2>
          <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
            Descubre nuestro trabajo. Haz clic en cualquier foto para ver más detalles.
          </p>

          {/* Voice Widget Placeholder */}
          <div className="mb-8 p-6 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-2xl max-w-md mx-auto">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Phone className="w-6 h-6 text-yellow-400" />
              <p className="text-yellow-400 font-semibold">Reserva por Voz</p>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Habla con nuestro asistente para reservar tu cita
            </p>
            {/* 11 Labs Widget */}
            <ElevenLabsWidget />
          </div>

          {/* Quick Info */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>El Seibo, República Dominicana</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>+1-809-XXX-XXXX</span>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <GalleryGrid onMediaClick={handleMediaClick} />
        </div>
      </section>

      {/* Media Viewer Modal */}
      <MediaViewerModal
        media={selectedMedia}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Footer */}
      <footer className="border-t border-yellow-500/20 bg-black/50 backdrop-blur-xl py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Barbería de Joan. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}
