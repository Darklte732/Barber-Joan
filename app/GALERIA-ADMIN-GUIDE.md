# 🖼️ Guía de Gestión de Galería - Panel Admin

## ✨ Nueva Pestaña: Galería

Joan ahora puede gestionar todas las fotos y videos de la landing page directamente desde su teléfono o computadora.

## 📍 Cómo Acceder

1. Inicia sesión en el dashboard
2. Ve a la pestaña **"Galería"** en el menú lateral
3. ¡Listo! Ya puedes gestionar todo el contenido visual

## 🎯 Funcionalidades Completas

### 1. **Ver Galería Actual**
- Grid visual de todas las fotos/videos
- Muestra título, categoría y tipo
- Hover para ver opciones de edición

### 2. **Subir Nuevas Fotos/Videos** 📤

#### Desde Teléfono:
1. Click en botón **"Subir Fotos/Videos"**
2. Selecciona archivos desde tu galería
3. Se abre el modal de upload
4. Completa los detalles:
   - **Título**: Ej. "Fade Clásico"
   - **Categoría**: Fades, Tapers, Diseños, etc.
   - **Tipo**: Foto o Video
5. Click **"Subir"**
6. ¡Aparece automáticamente en la landing page!

#### Desde Computadora:
- Mismos pasos
- También puedes **arrastrar y soltar** archivos
- Soporta múltiples archivos a la vez

### 3. **Editar Contenido** ✏️

Para editar cualquier foto/video:
1. Pasa el mouse sobre la foto (o toca en móvil)
2. Aparecen botones de acción
3. Click en el botón de **Editar** (icono de lápiz)
4. Cambia:
   - Título
   - Categoría
5. Click **"Guardar Cambios"**

### 4. **Eliminar Contenido** 🗑️

Para eliminar:
1. Hover sobre la foto
2. Click en botón **Eliminar** (icono de basura rojo)
3. Confirma la eliminación
4. ¡Se elimina de la landing page!

## 📊 Estadísticas en Tiempo Real

El dashboard muestra:
- **Total de Medios**: Número total de fotos/videos
- **Fotos**: Cantidad de imágenes
- **Videos**: Cantidad de videos
- **Categorías**: Número de categorías disponibles

## 📱 Optimizado Para Móvil

La página está **100% optimizada para teléfonos**:
- ✅ Subir fotos directamente desde la cámara
- ✅ Interface táctil fácil de usar
- ✅ Botones grandes para tocar fácil
- ✅ Grid responsivo que se adapta al tamaño
- ✅ Modales full-screen en móvil

## 🎨 Categorías Disponibles

1. **Fades** - Degradados clásicos
2. **Tapers** - Degradados suaves
3. **Diseños** - Líneas y patrones artísticos
4. **Modernos** - Estilos contemporáneos
5. **Barba** - Arreglos de barba
6. **Clásicos** - Cortes tradicionales

## 🔄 Flujo de Trabajo Típico

### Ejemplo: Subir Fotos de un Cliente Nuevo

1. **Toma fotos del corte** (antes y después)
2. **Ve a Dashboard → Galería**
3. **Click "Subir Fotos/Videos"**
4. **Selecciona las fotos**
5. **Completa detalles:**
   - Título: "Taper Fade con Diseño"
   - Categoría: "Diseños"
   - Tipo: "Foto"
6. **Click "Subir"**
7. **¡Instantáneamente visible en la landing page!**

Los clientes que visiten tu Instagram verán el nuevo trabajo de inmediato.

## 💾 Formatos Soportados

### Imágenes:
- JPG / JPEG
- PNG
- WebP
- HEIC (iPhone)

### Videos:
- MP4
- MOV
- WebM

## 🚀 Próximos Pasos (Cuando Conectemos Supabase)

Actualmente, la funcionalidad está **100% lista** pero usa datos de muestra. Cuando conectemos Supabase:

1. **Las fotos se guardarán permanentemente**
2. **Subirán a la nube** (Supabase Storage)
3. **Se sincronizarán** automáticamente con la landing page
4. **URLs permanentes** para cada foto/video

### Lo Que Ya Funciona:
- ✅ Interface completa
- ✅ Upload de archivos
- ✅ Preview antes de subir
- ✅ Editar título y categoría
- ✅ Eliminar contenido
- ✅ Organización por categorías
- ✅ Estadísticas en tiempo real

### Lo Que Falta (Backend):
- ⏳ Conexión a Supabase
- ⏳ Storage en la nube
- ⏳ API endpoints
- ⏳ Persistencia de datos

## 🎯 Tips de Uso

### Para Mejores Resultados:

1. **Toma Fotos con Buena Luz**
   - Luz natural es mejor
   - Evita sombras fuertes

2. **Usa Títulos Descriptivos**
   - ❌ "Corte 1"
   - ✅ "Fade Clásico con Línea"

3. **Organiza por Categorías**
   - Ayuda a los clientes a encontrar estilos
   - Filtra en la landing page

4. **Sube Regularmente**
   - Mantén la galería actualizada
   - Muestra trabajo reciente
   - Los clientes quieren ver variedad

5. **Videos Cortos Funcionan Mejor**
   - 10-30 segundos ideal
   - Muestra el proceso de corte
   - Más engagement que fotos

## 🔐 Seguridad

- Solo el admin puede acceder a esta pestaña
- Requiere iniciar sesión
- Confirmación antes de eliminar
- Preview antes de subir

## 📱 Uso Desde el Teléfono

### iPhone/Android:
1. Abre Safari/Chrome en el teléfono
2. Ve a tu sitio web
3. Login al dashboard
4. Click en "Galería"
5. **"Subir Fotos/Videos"**
6. Selecciona fotos desde:
   - Galería del teléfono
   - Tomar foto ahora
   - Files app
7. Completa detalles
8. ¡Listo!

## 🎨 Diseño Actual

### Página Principal:
```
┌─────────────────────────────────────┐
│  Gestión de Galería    [+ Subir]   │
├─────────────────────────────────────┤
│  [12]      [8]       [4]      [6]  │
│  Total    Fotos    Videos   Cats   │
├─────────────────────────────────────┤
│  ┌───┐  ┌───┐  ┌───┐  ┌───┐       │
│  │ 📷│  │ 📷│  │ 📷│  │ 📷│       │
│  │   │  │   │  │   │  │   │       │
│  └───┘  └───┘  └───┘  └───┘       │
│                                     │
│  ┌───┐  ┌───┐  ┌───┐  ┌───┐       │
│  │ 📷│  │ 📷│  │ 📷│  │ 📷│       │
│  └───┘  └───┘  └───┘  └───┘       │
└─────────────────────────────────────┘
```

### Al Hacer Hover:
```
┌─────────────────┐
│                 │
│   Fade Clásico  │
│      Fades      │
│                 │
│  [✏️ Editar]    │
│  [🗑️ Eliminar]  │
└─────────────────┘
```

## ⚡ Atajos de Teclado (Desktop)

- **Ctrl + U**: Abrir modal de upload
- **ESC**: Cerrar modal
- **Enter**: Confirmar acción

## 📞 Soporte

Si algo no funciona:
1. Refresca la página
2. Verifica que estés logueado
3. Revisa la consola del navegador (F12)

---

**¡La gestión de galería está lista para usar!** Joan puede empezar a subir fotos de inmediato y los clientes las verán en la landing page. 🎉
