'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, Trash2, Edit2, Plus, Image as ImageIcon, Video, ChevronDown, ChevronUp } from 'lucide-react';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  category: string;
  beforeUrl?: string;
  afterUrl?: string;
}

export default function GalleryPage() {
  // Sample data - expanded across all categories
  const [media, setMedia] = useState<MediaItem[]>([
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
  ]);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadPreview, setUploadPreview] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Fades']); // Start with Fades expanded

  const [formData, setFormData] = useState({
    title: '',
    category: 'Fades',
    type: 'image' as 'image' | 'video',
  });

  const categories = ['Fades', 'Tapers', 'Diseños', 'Modernos', 'Barba', 'Clásicos'];

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Get media by category
  const getMediaByCategory = (category: string) => {
    return media.filter((item) => item.category === category);
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadFiles(files);

    // Create preview URLs
    const previews = files.map((file) => URL.createObjectURL(file));
    setUploadPreview(previews);
  };

  // Handle upload submit (mock)
  const handleUploadSubmit = () => {
    console.log('Uploading:', { files: uploadFiles, ...formData });

    // Mock adding to gallery
    uploadFiles.forEach((file, index) => {
      const newItem: MediaItem = {
        id: Date.now().toString() + index,
        type: formData.type,
        url: uploadPreview[index],
        title: formData.title || file.name,
        category: formData.category,
      };
      setMedia((prev) => [newItem, ...prev]);
    });

    // Reset
    setIsUploadOpen(false);
    setUploadFiles([]);
    setUploadPreview([]);
    setFormData({ title: '', category: 'Fades', type: 'image' });
  };

  // Handle edit
  const handleEdit = (item: MediaItem) => {
    setSelectedMedia(item);
    setFormData({
      title: item.title,
      category: item.category,
      type: item.type,
    });
    setIsEditOpen(true);
  };

  // Handle edit submit (mock)
  const handleEditSubmit = () => {
    if (!selectedMedia) return;

    setMedia((prev) =>
      prev.map((item) =>
        item.id === selectedMedia.id
          ? { ...item, title: formData.title, category: formData.category }
          : item
      )
    );

    setIsEditOpen(false);
    setSelectedMedia(null);
  };

  // Handle delete (mock)
  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta foto/video?')) {
      setMedia((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Galería</h1>
          <p className="text-gray-600 mt-1">
            Organiza tu portfolio por categorías
          </p>
        </div>
        <Button
          onClick={() => setIsUploadOpen(true)}
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold"
        >
          <Plus className="w-5 h-5 mr-2" />
          Subir Contenido
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="py-4">
            <div className="text-2xl font-bold text-blue-600">{media.length}</div>
            <div className="text-sm text-gray-600">Total de Medios</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="text-2xl font-bold text-green-600">
              {media.filter((m) => m.type === 'image').length}
            </div>
            <div className="text-sm text-gray-600">Fotos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="text-2xl font-bold text-purple-600">
              {media.filter((m) => m.type === 'video').length}
            </div>
            <div className="text-sm text-gray-600">Videos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="text-2xl font-bold text-yellow-600">
              {categories.length}
            </div>
            <div className="text-sm text-gray-600">Categorías</div>
          </CardContent>
        </Card>
      </div>

      {/* Gallery by Categories */}
      <div className="space-y-4">
        {categories.map((category) => {
          const categoryMedia = getMediaByCategory(category);
          const isExpanded = expandedCategories.includes(category);

          return (
            <Card key={category} className="overflow-hidden">
              <CardHeader
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleCategory(category)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-xl">{category}</CardTitle>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                      {categoryMedia.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData({ ...formData, category });
                        setIsUploadOpen(true);
                      }}
                      className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Agregar
                    </Button>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0">
                  {categoryMedia.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500 text-sm">
                        No hay contenido en esta categoría aún
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-3"
                        onClick={() => {
                          setFormData({ ...formData, category });
                          setIsUploadOpen(true);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Agregar Primero
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {categoryMedia.map((item) => (
                        <div
                          key={item.id}
                          className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 border-2 border-gray-200 hover:border-yellow-500 transition-all duration-300"
                        >
                          {/* Image/Video */}
                          <img
                            src={item.url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />

                          {/* Type Badge */}
                          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                            {item.type === 'video' ? (
                              <Video className="w-3 h-3 text-white" />
                            ) : (
                              <ImageIcon className="w-3 h-3 text-white" />
                            )}
                          </div>

                          {/* Overlay on Hover */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-2">
                            <h3 className="text-white font-semibold text-center text-xs line-clamp-2">
                              {item.title}
                            </h3>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 h-8 w-8 p-0"
                                onClick={() => handleEdit(item)}
                              >
                                <Edit2 className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-red-500/80 backdrop-blur-sm border-red-600 text-white hover:bg-red-600 h-8 w-8 p-0"
                                onClick={() => handleDelete(item.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Upload Modal */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Subir Fotos o Videos</DialogTitle>
            <DialogDescription>
              Agrega contenido a tu categoría seleccionada
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Category Selection - PROMINENT */}
            <div className="p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
              <Label htmlFor="category" className="text-base font-semibold text-gray-900 mb-2 block">
                📁 Categoría de Destino
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="border-yellow-400 text-base font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-base">
                      {cat} ({getMediaByCategory(cat).length} fotos)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-600 mt-2">
                Las fotos se agregarán a esta categoría en la landing page
              </p>
            </div>

            {/* File Input */}
            <div>
              <Label htmlFor="file-upload" className="block mb-2">
                Archivos
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-yellow-500 transition-colors cursor-pointer">
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    Click para seleccionar o arrastra archivos aquí
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Imágenes: JPG, PNG, WebP | Videos: MP4, MOV
                  </p>
                </label>
              </div>
            </div>

            {/* Preview */}
            {uploadPreview.length > 0 && (
              <div>
                <Label className="mb-2 block">Vista Previa ({uploadPreview.length})</Label>
                <div className="grid grid-cols-3 gap-2">
                  {uploadPreview.map((preview, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Title */}
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                placeholder="Ej: Fade Clásico Perfecto"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            {/* Type */}
            <div>
              <Label htmlFor="type">Tipo de Contenido</Label>
              <Select
                value={formData.type}
                onValueChange={(value: 'image' | 'video') =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">📷 Foto</SelectItem>
                  <SelectItem value="video">🎥 Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleUploadSubmit}
              disabled={uploadFiles.length === 0}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black"
            >
              <Upload className="w-4 h-4 mr-2" />
              Subir a {formData.category} ({uploadFiles.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Contenido</DialogTitle>
            <DialogDescription>Actualiza los detalles</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Preview */}
            {selectedMedia && (
              <div className="aspect-square w-full rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Title */}
            <div>
              <Label htmlFor="edit-title">Título</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="edit-category">Categoría</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleEditSubmit}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black"
            >
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
