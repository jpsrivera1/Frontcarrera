# Frontend — Control de Inscripciones Carrera 5K / 10K

Interfaz administrativa desarrollada con React + Vite + Tailwind CSS.

---

## Instalación

```bash
cd Front_carrera
npm install
```

## Configuración del archivo .env

```env
VITE_API_URL=http://localhost:3000/api
```

## Ejecutar en desarrollo

```bash
npm run dev
```

## Rutas del frontend

| Ruta           | Página        |
|----------------|---------------|
| /              | → /dashboard  |
| /dashboard     | Dashboard     |
| /participantes | Participantes |
| /pagos         | Pagos         |
| /kits          | Kits          |
| /reportes      | Reportes      |

## Modificar colores

Edita las variables CSS en `src/index.css` dentro del bloque `:root`:

```css
--color-primary:    #dc2626;  /* rojo */
--color-accent:     #f59e0b;  /* dorado */
--color-background: #0a0a0a;  /* fondo negro */
--color-surface:    #111111;  /* cards/sidebar */
```

