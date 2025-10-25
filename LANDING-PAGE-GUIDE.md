# Guía de la Landing Page - Barbería de Joan

## 🎨 Descripción General

La landing page está diseñada específicamente para clientes que vienen desde Instagram u otras redes sociales. Es completamente **mobile-first** con animaciones suaves y un enfoque en mostrar el trabajo de la barbería.

## ✨ Características Principales

### 1. **Galería de Fotos y Videos**
- Grid responsivo que se adapta al tamaño de pantalla (1 col móvil, 2-3 desktop)
- Animaciones suaves al hacer scroll
- Hover effects con información del corte
- Lazy loading para carga rápida
- Clickeable para expandir y ver detalles

### 2. **Modal de Vista Expandida**
- Se abre al tocar cualquier foto/video
- Animación suave de apertura/cierre
- Soporte para videos con reproductor
- **Slider de Antes/Después** para comparar cortes
- Gestos de swipe en móvil
- Cierra con ESC o botón X

### 3. **Widget de Voz de 11 Labs**
- Integrado en el hero section
- Permite reservar citas hablando directamente
- Se conecta automáticamente con el sistema de citas

### 4. **Filtros por Categoría**
- Fades
- Tapers
- Diseños
- Modernos
- Barba
- Clásicos

## 📱 Optimización Móvil

### Características Mobile-First:
- **Touch-friendly**: Botones y áreas táctiles de mínimo 44x44px
- **Animaciones suaves**: Optimizadas para 60fps en móvil
- **Gestos**: Swipe para navegar fotos, pinch to zoom
- **Carga rápida**: Lazy loading de imágenes
- **Scroll horizontal**: Para categorías sin hacer la página muy larga

### Animaciones Implementadas:
- `fadeInUp`: Entrada de elementos desde abajo
- `scaleIn/scaleOut`: Para el modal
- `hover effects`: Con transform para rendimiento
- `tap feedback`: Efecto visual al tocar (mobile)

## 🎯 Widget de 11 Labs - ¡YA CONFIGURADO! ✅

### El Widget Ya Está Listo para Usar

El widget de voz conversacional de 11 Labs está **completamente integrado** y funcionando:

- **Agent ID**: `agent_5501k89ms48gehwva0wk29he4mcz`
- **Script**: `https://unpkg.com/@elevenlabs/convai-widget-embed`
- **Ubicación**: `/components/landing/ElevenLabsWidget.tsx`

### ¿Cómo Funciona?

1. Los clientes tocan/clickean en la sección "Reserva por Voz"
2. El widget de 11 Labs se carga automáticamente
3. Pueden **hablar directamente** para reservar su cita
4. El agente de IA procesa la conversación en español
5. La cita se crea automáticamente en el sistema

### ¿Qué Hace el Widget?

```html
<elevenlabs-convai agent-id="agent_5501k89ms48gehwva0wk29he4mcz"></elevenlabs-convai>
<script src="https://unpkg.com/@elevenlabs/convai-widget-embed"></script>
```

El widget está configurado para:
- ✅ Conversaciones naturales en español
- ✅ Reservar citas automáticamente
- ✅ Responder preguntas sobre servicios
- ✅ Confirmar disponibilidad de horarios

### Cambiar el Agent ID (Opcional)

Si necesitas usar un agent diferente:

1. Abre `/components/landing/ElevenLabsWidget.tsx`
2. Cambia el valor en línea 9:
```typescript
export function ElevenLabsWidget({ agentId = 'TU-NUEVO-AGENT-ID' })
```

### Verificar que Funciona

1. Inicia el servidor: `npm run dev`
2. Abre `http://localhost:3000`
3. Busca la sección "Reserva por Voz"
4. El widget debe cargar automáticamente
5. ¡Prueba hablando con él!

## 📸 Agregar Fotos y Videos

### Opción 1: Usar Datos de Muestra (Temporal)

Actualmente usa fotos de muestra de Unsplash. Para probar:
1. Las fotos se muestran automáticamente
2. Puedes filtrar por categoría
3. Click en cualquier foto para ver el modal

### Opción 2: Conectar con Base de Datos

Para usar fotos reales, necesitas:

1. **Crear tabla en la base de datos:**

```sql
CREATE TABLE gallery_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(10) NOT NULL CHECK (type IN ('image', 'video')),
    url TEXT NOT NULL,
    thumbnail TEXT,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    before_url TEXT,  -- Para comparaciones antes/después
    after_url TEXT,
    active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

2. **Crear API endpoint** en `/app/api/gallery/route.ts`:

```typescript
export async function GET() {
  const media = await db.query(`
    SELECT * FROM gallery_media
    WHERE active = true
    ORDER BY sort_order DESC, created_at DESC
  `);
  return NextResponse.json({ media });
}
```

3. **Actualizar GalleryGrid.tsx** para usar datos reales:

```typescript
useEffect(() => {
  fetch('/api/gallery')
    .then(res => res.json())
    .then(data => setMedia(data.media));
}, []);
```

### Opción 3: Usar un Servicio de Storage

Recomendado: **Cloudinary** o **Supabase Storage**

**Con Cloudinary:**
1. Sube fotos a Cloudinary
2. Obtienes URLs automáticas
3. Guardas URLs en la base de datos

**Con Supabase Storage:**
1. Crea un bucket `gallery`
2. Sube fotos desde el admin dashboard
3. Genera URLs públicas

## 🎭 Formato Antes/Después

Para activar el slider de comparación:

```typescript
const media = {
  id: '1',
  type: 'image',
  title: 'Transformación Fade',
  category: 'Fades',
  beforeUrl: 'https://url-de-foto-antes.jpg',
  afterUrl: 'https://url-de-foto-despues.jpg'
};
```

Cuando ambas URLs están presentes, el modal muestra el slider interactivo.

## 🎨 Personalización de Estilos

### Colores
Los colores principales están en `globals.css`:
- Gold/Yellow: `#d4af37` (dorado de barbería)
- Background: Gradientes oscuros
- Accent: Amarillo/dorado

### Animaciones
Puedes ajustar la velocidad en `globals.css`:
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px); /* Ajusta la distancia */
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Grid Layout
En `GalleryGrid.tsx`:
```typescript
// Cambiar número de columnas
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
// Ajustar a: grid-cols-2 sm:grid-cols-3 lg:grid-cols-4
```

## 🔗 Integración con Instagram

1. Ve a tu perfil de Instagram
2. Click en "Editar perfil"
3. En "Sitio web", agrega: `https://tu-dominio.com`
4. Los usuarios que clickeen verán tu landing page

## 📊 Analytics (Futuro)

Para rastrear visitas desde Instagram:
```typescript
// Agregar Google Analytics o similar
<Script src="https://www.googletagmanager.com/gtag/js?id=GA_ID" />
```

## 🚀 Próximos Pasos

1. **Agregar Admin Panel para Galería**
   - Subir fotos directamente
   - Editar/eliminar fotos
   - Reordenar galería

2. **Filtros Avanzados**
   - Por fecha
   - Por popularidad
   - Búsqueda por texto

3. **Compartir en Redes**
   - Botón para compartir fotos
   - Generar enlaces únicos

4. **Stats del Widget**
   - Ver cuántas citas se reservaron por voz
   - Análisis de conversaciones

## 💡 Tips de Uso

### Para Mejores Resultados:
1. **Fotos de Alta Calidad**: Usa buena iluminación
2. **Consistencia**: Mismo fondo/ángulo ayuda a comparar
3. **Variedad**: Muestra diferentes estilos
4. **Actualiza Frecuentemente**: Agrega cortes nuevos semanalmente
5. **Usa Before/After**: Los clientes aman ver transformaciones

### Categorización Recomendada:
- **Fades**: Degradados clásicos
- **Tapers**: Degradados suaves
- **Diseños**: Líneas y patrones artísticos
- **Modernos**: Estilos contemporáneos
- **Barba**: Arreglos de barba
- **Clásicos**: Cortes tradicionales

## 🎯 Flujo del Usuario

1. Usuario clickea link en Instagram
2. Ve landing page con galería de cortes
3. Navega por fotos (filtra por categoría)
4. Click en foto para ver detalles/video
5. Ve slider de antes/después
6. **Habla con widget de voz** para reservar
7. Sistema reserva cita automáticamente
8. ¡Listo!

## 🔧 Troubleshooting

### El widget de 11 Labs no aparece
- Verifica que `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` esté en `.env`
- Reinicia el servidor de desarrollo
- Revisa la consola del navegador para errores

### Las animaciones se ven lentas
- Reduce el número de fotos cargadas inicialmente
- Asegúrate que las imágenes estén optimizadas
- Usa formatos modernos (WebP)

### Las fotos no cargan
- Verifica las URLs
- Revisa CORS si usas storage externo
- Chequea permisos del bucket

---

**¿Preguntas?** Revisa el código en:
- Landing: `/app/page.tsx`
- Galería: `/components/landing/GalleryGrid.tsx`
- Modal: `/components/landing/MediaViewerModal.tsx`
- Widget: `/components/landing/ElevenLabsWidget.tsx`
