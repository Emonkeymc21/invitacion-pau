# Invitación web personalizada

Proyecto Next.js listo para usar como página de invitación personalizada con:

- acceso por contraseña
- invitación completa renderizada dentro del sitio
- 2 botones bloqueados por fecha/hora
- desbloqueo tomando como referencia el horario de Argentina
- botón **Invitación** para descargar el PDF personalizado
- botón **Videollamada** para abrir Google Meet

## Invitada de prueba incluida

- Nombre: **Carla Cañamero**
- Ruta: `http://localhost:3000/carla-canamero`
- Contraseña: **CC2026**
- Desbloqueo: **2026-03-10 11:00 AM Argentina**

## Cómo instalar

```bash
npm install
npm run dev
```

Abrir en navegador:

```bash
http://localhost:3000/carla-canamero
```

## Dónde cambiar nombre, contraseña, horario y link de Meet

Editá este archivo:

```bash
lib/invitations.ts
```

Ejemplo:

```ts
'carla-canamero': {
  slug: 'carla-canamero',
  nombre: 'Carla Cañamero',
  password: 'CC2026',
  unlockAtArgentina: '2026-03-10T11:00:00-03:00',
  meetUrl: 'https://meet.google.com/tu-codigo-aqui',
  ...
}
```

## Cómo pasarme el link del Meet

Pasámelo exactamente así:

```txt
https://meet.google.com/abc-defg-hij
```

y yo lo reemplazo en:

```ts
meetUrl: 'https://meet.google.com/abc-defg-hij'
```

## Formato recomendado para cualquier invitado nuevo

Agregá otro objeto dentro de `invitations`:

```ts
'juan-perez': {
  slug: 'juan-perez',
  nombre: 'Juan Pérez',
  password: 'JP2026',
  unlockAtArgentina: '2026-03-15T20:00:00-03:00',
  meetUrl: 'https://meet.google.com/abc-defg-hij',
  title: 'DISCERNIMIENTO PARA QUIENES SON INVITADOS A SERVIR',
  verse: '“No tomen como modelo a este mundo...”',
  verseRef: 'Romanos 12,2'
}
```

Luego se accede por:

```txt
/juan-perez
```

## Importante sobre el horario

La fecha se guarda con zona horaria de Argentina:

```txt
-03:00
```

Eso hace que el desbloqueo se produzca en el mismo instante real para cualquier persona del mundo, pero mostrando la conversión local del visitante dentro de la página.

## PDF personalizado

El proyecto usa `pdf-lib` y toma como base el archivo original:

```bash
public/assets/invitacion-base.pdf
```

En la descarga se reemplaza el `XXXXX` de la primera página por el nombre del invitado.

## Estructura clave

- `app/[slug]/page.tsx` -> página personalizada
- `app/api/invite/[slug]/route.ts` -> valida contraseña y entrega contenido
- `app/api/pdf/[slug]/route.ts` -> genera el PDF personalizado
- `lib/invitations.ts` -> invitados y contenido general
- `lib/pdf.ts` -> personalización del PDF

## Nota técnica

En esta versión el acceso pide contraseña cada vez que se vuelve a abrir la página, porque no se guarda una sesión persistente. Para producción, se puede endurecer con base de datos, contraseñas hasheadas y tokens temporales.


## Despliegue en Netlify

Este proyecto ya quedó adaptado para Netlify con:

- `netlify.toml`
- plugin `@netlify/plugin-nextjs`
- `output: "standalone"` en Next
- Node 20 / npm 10

### Pasos

1. Subí esta carpeta a GitHub.
2. En Netlify, importá el repositorio.
3. Netlify detectará automáticamente `netlify.toml`.
4. Build command: `npm run build`
5. Publish directory: `.next`

No necesita variables de entorno para esta versión de prueba.
