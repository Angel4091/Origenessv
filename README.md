# Orígenes SV

Sistema de gestión para la franquicia de pupuserías **Orígenes SV** («¡Puchica, qué buen sabor!»): pedidos, cocina, cobro, inventario, compras, personal y finanzas, con 8 roles (mesero, cocinero, jefe de cocina, encargado de bodega, gerente de sucursal, Recursos Humanos, gerente general y director).

## Arquitectura

```
Origenessv/
├── frontend/        React 19 + Vite · Tailwind CSS 4 (prefijo tw:) · React-Bootstrap (modales, panel lateral, toasts, menús, tablas)
├── backend/         Node 22 + Express 5 · API REST · pg (SQL) · JWT en cookie httpOnly · bcrypt
├── database/
│   ├── init/        01_schema.sql (esquema) · 02_seed.sql (datos demo); Docker los carga al crear la BD
│   └── diagrama-er.md   Diagrama entidad-relación (Mermaid)
├── Documentation/   (vacía por ahora)
└── docker-compose.yml   db (PostgreSQL 16) · backend · frontend (Nginx)
```

- **Frontend** (`frontend/src`): `pages/<rol>/` una pantalla por entrada del menú; `components/` piezas reutilizables (layout, UI, selectores, pedidos); `context/` sesión, reloj simulado, recargas y diálogos; `lib/` cliente de la API, formatos y reglas de pedidos; `roles.js` menús de cada rol.
- **Backend** (`backend/src`): `routes/` (auth, sistema, perfil, catálogo, mesero, cocina, propuestas); `lib/negocio.js` reglas del negocio (existencias, costos, tiempos, mesas, turnos); `lib/procesos.js` lo que mueve el reloj (precios semanales, llegadas de compras, lotes vencidos, ofertas, aumentos, avisos de stock, «precio por revisar»); `lib/permisos.js` tabla de permisos; toda acción queda en la **bitácora**.
- **Base de datos**: ~45 tablas para los 8 roles. El **reloj simulado** vive en la tabla `sistema` y avanza solo; se puede adelantar (+1 hora, +1 día, +7 días, +30 días) desde la barra superior.

**Estado (fase 1):** estructura, BD completa con datos demo, API, entrada en dos pasos, perfil, contraseña olvidada y los roles **mesero, cocinero y jefe de cocina**. Bodega, gerente, RR. HH., gerente general y director muestran su menú y se construyen en las fases siguientes.

## Cómo ejecutar

Requisitos: Docker Desktop. Para desarrollo local también Node 22+.

### Opción A: todo con Docker

```bash
docker compose up -d --build
```

- App: http://localhost:8080 · API: http://localhost:4000/api/salud · PostgreSQL: `localhost:5433` (usuario/clave/BD: `origenes`)

### Opción B: base de datos en Docker y la app en modo desarrollo

```bash
docker compose up -d db
cd backend  && cp .env.example .env && npm install && npm run dev   # http://localhost:4000
cd frontend && npm install && npm run dev                           # http://localhost:5173
```

Para volver a los datos iniciales: botón **Restablecer datos** en la entrada, o `docker compose down -v` y volver a levantar.

## Usuarios de prueba

Contraseña de todos: `demo`. Clave de aprobaciones (gerentes y gerente general): `1234`. PIN de directores: `2468`.

| Rol | Usuarios |
|---|---|
| Mesero | ana, luis (Centro) · marta (Escalón) |
| Cocinero | carlos, rosa (Centro) · pedro (Escalón) |
| Jefe de cocina | julia (Centro) · mario (Escalón) |
| Encargado de bodega | sofia · daniel |
| Gerente de sucursal | elena · ricardo |
| Recursos Humanos | patricia |
| Gerente general | hector |
| Director | isabel · fernando |
