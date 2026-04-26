# Panicafe Compras — Frontend

Carrito de compras interno (React + Chakra UI + Vite).

## Requisitos

- **Node.js** `>= 20` y `< 23` (ver `engines` en `package.json`).
- Backend API en ejecución (por defecto `http://localhost:3001`; ver `src/config.json`).

Con nvm:

```bash
nvm install 20
nvm use 20
```

## Instalación

```bash
npm install
```

## Cómo levantar el proyecto

Desarrollo (Vite, suele usar el puerto **3000**):

```bash
npm run dev
```

Abrir en el navegador la URL que imprime Vite (por ejemplo `http://localhost:3000`).

## Otros comandos

| Comando | Descripción |
|--------|-------------|
| `npm run build` | Build de producción (salida en carpeta `build/`) |
| `npm run preview` | Servir el build localmente para probar producción |
| `npm test` | Tests con Vitest |

## Configuración del API

La URL del servidor está en [`src/config.json`](src/config.json):

- `SERVER_URL` — base URL del backend (ej. `http://localhost:3001`).
- `ORDERS_URL` — misma idea para pedidos si aplica.

Tras cambiar `config.json`, reiniciá `npm run dev`.
