# PCManager - Tienda de Computadoras

## Arquitectura
- **Frontend**: Vue 3 (Composition API, `<script setup>`) + Quasar Framework + Pinia + Vite
- **Backend**: Express.js con node-postgres (sin ORM)
- **Base de datos**: PostgreSQL 16
- **Autenticación**: JWT (bcryptjs + jsonwebtoken)
- **Despliegue**: Docker Compose (3 servicios: postgres, server, client)

## Estructura del Proyecto
```
PCManager/
├── docker-compose.yml          # Orquestación de servicios
├── database/init.sql            # Esquema + datos semilla
├── server/                      # Express API
│   ├── Dockerfile
│   ├── package.json
│   ├── .env
│   └── src/
│       ├── app.js               # Punto de entrada
│       ├── config/db.js         # Pool de PostgreSQL
│       ├── controllers/         # Lógica de rutas
│       ├── middleware/          # authMiddleware, errorHandler
│       ├── models/             # Consultas SQL (equipo, usuario, categoria)
│       ├── routes/             # Definición de rutas
│       ├── services/           # authService (hash + JWT)
│       └── validators/         # Joi validators
└── client/                      # Vue 3 SPA
    ├── Dockerfile
    ├── nginx.conf               # Proxy reverso a /api
    ├── package.json
    ├── vite.config.js           # Proxy /api -> :3000 en dev
    └── src/
        ├── main.js              # Quasar + Pinia + Router
        ├── App.vue
        ├── api/                 # Axios instances + API calls
        ├── router/index.js      # Rutas con guard auth
        ├── stores/              # Pinia: auth.js, equipos.js
        ├── layouts/             # PublicLayout, AdminLayout
        └── pages/               # Catalog, ProductDetail, Login, Admin/CRUD
```

## Comandos

### Desarrollo local (sin Docker)
```bash
# Base de datos (requiere PostgreSQL corriendo)
psql -U pcmanager -d pcmanager -f database/init.sql

# Servidor
cd server && npm install && npm run dev

# Cliente
cd client && npm install && npm run dev
```

### Docker Compose
```bash
# Construir y levantar todo
docker compose up -d --build

# Detener
docker compose down

# Reconstruir solo un servicio
docker compose up -d --build server
```

## Endpoints API
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | /api/auth/login | No | Login admin |
| GET | /api/auth/me | JWT | Perfil usuario |
| GET | /api/equipos | No | Lista con filtros (?categoria=&search=&page=&limit=) |
| GET | /api/equipos/:id | No | Detalle equipo |
| POST | /api/equipos | JWT | Crear equipo |
| PUT | /api/equipos/:id | JWT | Actualizar equipo |
| DELETE | /api/equipos/:id | JWT | Eliminar equipo |
| GET | /api/categorias | No | Listar categorías |

## Usuario admin por defecto
- Email: admin@pcmanager.com
- Password: admin123 (hash bcrypt en init.sql)

## Puertos
- Cliente (nginx): 8080
- Servidor (Express): 3000
- PostgreSQL: 5432
