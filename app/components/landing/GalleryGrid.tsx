'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  title: string;
  category: string;
  beforeUrl?: string; // For before/after comparisons
  afterUrl?: string;
}

interface GalleryGridProps {
  onMediaClick: (media: MediaItem) => void;
}

// Sample data - will be replaced with actual data from API/database
const sampleMedia: MediaItem[] = [
  // Fades
  {
    id: '1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800',
    title: 'Fade Clásico',
    category: 'Fades',
  },
  {
    id: '2',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800',
    title: 'Degradado Alto',
    category: 'Fades',
  },
  // Tapers
  {
    id: '3',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800',
    title: 'Taper Moderno',
    category: 'Tapers',
  },
  {
    id: '4',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1621607510892-dd7d90e2b51e?w=800',
    title: 'Taper Bajo',
    category: 'Tapers',
  },
  // Diseños
  {
    id: '5',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800',
    title: 'Diseño Artístico',
    category: 'Diseños',
  },
  {
    id: '6',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1620331675175-61ca1e73c9c3?w=800',
    title: 'Líneas Creativas',
    category: 'Diseños',
  },
  // Modernos
  {
    id: '7',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1598188306155-25e400eb5078?w=800',
    title: 'Corte Texturizado',
    category: 'Modernos',
  },
  {
    id: '8',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=800',
    title: 'Estilo Urbano',
    category: 'Modernos',
  },
  // Barba
  {
    id: '9',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800',
    title: 'Afeitado de Barba',
    category: 'Barba',
  },
  {
    id: '10',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1619698939570-001b0a2c25f8?w=800',
    title: 'Perfilado de Barba',
    category: 'Barba',
  },
  // Clásicos
  {
    id: '11',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800',
    title: 'Corte Clásico',
    category: 'Clásicos',
  },
  {
    id: '12',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?w=800',
    title: 'Estilo Tradicional',
    category: 'Clásicos',
  },
];

export function GalleryGrid({ onMediaClick }: GalleryGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = ['Todos', 'Fades', 'Tapers', 'Diseños', 'Modernos', 'Barba', 'Clásicos'];

  const filteredMedia =
    selectedCategory === 'Todos'
      ? sampleMedia
      : sampleMedia.filter((item) => item.category === selectedCategory);

  return (
    <div>
      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold shadow-lg shadow-yellow-500/30'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800 border border-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMedia.map((media, index) => (
          <div
            key={media.id}
            onClick={() => onMediaClick(media)}
            className="group relative aspect-square overflow-hidden rounded-xl bg-gray-800 cursor-pointer"
            style={{
              animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
            }}
          >
            {/* Image */}
            <img
              src={media.url}
              alt={media.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />

            {/* Video Play Icon */}
            {media.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-8 h-8 text-white ml-1" fill="white" />
                </div>
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold text-lg mb-1">{media.title}</h3>
                <p className="text-yellow-400 text-sm">{media.category}</p>
              </div>
            </div>

            {/* Tap Indicator for Mobile */}
            <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-xs text-white">Toca para ver</p>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Placeholder */}
      <div className="mt-12 text-center">
        <button className="px-8 py-3 bg-gray-800/50 text-gray-300 rounded-full border border-gray-700 hover:bg-gray-800 hover:border-yellow-500/50 hover:text-yellow-400 transition-all duration-300">
          Cargar Más
        </button>
      </div>
    </div>
  );
}
