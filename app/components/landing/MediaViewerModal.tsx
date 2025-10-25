'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface MediaViewerModalProps {
  media: any;
  isOpen: boolean;
  onClose: () => void;
}

export function MediaViewerModal({ media, isOpen, onClose }: MediaViewerModalProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSliderMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;

    const container = e.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    let clientX: number;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }

    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  if (!isOpen || !media) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
      onClick={onClose}
      style={{
        animation: isOpen ? 'fadeIn 0.3s ease-out' : 'fadeOut 0.3s ease-out',
      }}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white transition-all duration-300 hover:rotate-90"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Content */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full h-full max-w-6xl max-h-[90vh] flex flex-col items-center justify-center p-4"
        style={{
          animation: isOpen ? 'scaleIn 0.3s ease-out' : 'scaleOut 0.3s ease-out',
        }}
      >
        {/* Media Display */}
        {media.beforeUrl && media.afterUrl ? (
          // Before/After Comparison Slider
          <div
            className="relative w-full h-full max-h-[70vh] rounded-xl overflow-hidden select-none"
            onMouseMove={handleSliderMove}
            onTouchMove={handleSliderMove}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
          >
            {/* After Image */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={media.afterUrl}
                alt="After"
                fill
                className="object-contain"
                draggable={false}
              />
            </div>

            {/* Before Image with clip */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <Image
                src={media.beforeUrl}
                alt="Before"
                fill
                className="object-contain"
                draggable={false}
              />
            </div>

            {/* Slider Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-yellow-400 cursor-ew-resize"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <ChevronLeft className="w-4 h-4 text-black absolute left-1" />
                <ChevronRight className="w-4 h-4 text-black absolute right-1" />
              </div>
            </div>

            {/* Labels */}
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
              <p className="text-white text-sm font-semibold">ANTES</p>
            </div>
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
              <p className="text-white text-sm font-semibold">DESPUÉS</p>
            </div>
          </div>
        ) : media.type === 'video' ? (
          // Video Player
          <video
            src={media.url}
            controls
            autoPlay
            className="max-w-full max-h-[70vh] rounded-xl shadow-2xl"
          />
        ) : (
          // Single Image
          <div className="relative w-full max-w-full h-[70vh] max-h-[70vh]">
            <Image
              src={media.url}
              alt={media.title}
              fill
              className="rounded-xl shadow-2xl object-contain"
            />
          </div>
        )}

        {/* Info */}
        <div className="mt-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">{media.title}</h2>
          <p className="text-yellow-400">{media.category}</p>
          {media.beforeUrl && media.afterUrl && (
            <p className="text-gray-400 text-sm mt-2">
              Arrastra el control para comparar antes y después
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
