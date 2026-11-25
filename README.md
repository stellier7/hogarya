# Hogar Ya

Marketplace inmobiliario para Honduras. Las personas buscan comprar o alquilar; publican únicamente agentes, inmobiliarias y socios autorizados.

La identidad es propia. Diversa y Altair Real Estate quedan como referencia de cómo opera una inmobiliaria, no como marca de este sitio ni como inventario.

## Qué incluye

- Inicio, comprar, alquilar, ficha de propiedad, captación, nosotros y contacto.
- Filtros reales por operación, ciudad, tipo, precio, habitaciones, baños, estacionamientos y orden.
- Páginas por ciudad y por operación, con URLs como `/comprar/tegucigalpa/casas`.
- Panel con roles de administrador, inmobiliaria y agente. Un agente no edita propiedades de otra inmobiliaria.
- Consultas, solicitudes de captación, estados de publicación y destacados.
- El catálogo inicial es de **prueba**. No hay teléfonos, correos, direcciones ni redes inventados.

## Arranque

```bash
npm install
cp .env.example .env.local
```

En `.env.local`, defina `HOGAR_YA_SESSION_SECRET` con una cadena larga y aleatoria. Luego:

```bash
npm run dev
```

Abra `/admin/setup` para crear el primer administrador. La contraseña se guarda cifrada en `data/store.json`, que no se versiona.

`NEXT_PUBLIC_WHATSAPP_E164` queda vacío hasta que exista un número oficial. Sin ese valor, el sitio no muestra un botón de WhatsApp falso.

`HOGAR_YA_PUBLISH_REAL=1` hace que las fichas nuevas puedan indexarse. Mientras no esté definido, se guardan como prueba y usan `noindex`.

## Datos

El inventario de demostración vive en `src/data/seed.ts`. Las fotografías son referencias de Unsplash, no inmuebles en Honduras. Borrar `data/store.json` vuelve al catálogo inicial.

El almacenamiento es un archivo local para esta etapa. `src/server/store.ts` concentra la lectura y la escritura; una base de datos de producción puede reemplazar ese módulo sin cambiar los permisos.

## Cloudflare Workers

El repositorio incluye `wrangler.jsonc` para el Worker `hogarya`. En Workers Builds el comando de build puede seguir siendo `npm run build`: si la variable `WORKERS_CI` está presente, ese comando también genera `.open-next` para que `npx wrangler deploy` o `npx wrangler preview` publiquen el sitio.

Defina `HOGAR_YA_SESSION_SECRET` en Variables and secrets del Worker, no en el repositorio. El catálogo público sale del seed. El panel escribe en un archivo local, así que en Workers esos cambios no se conservan entre peticiones.

## Comandos

```bash
npm test
npm run lint
npm run build
```
