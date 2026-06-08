# VPS Dokploy API — Skill de despliegue

## API Credentials
| Variable | Valor |
|----------|-------|
| **API Base URL** | `http://154.53.39.143:3000/api` |
| **API Key** | `kOlEmjkNqrSRIXVYdwOzuWehUGMVlItXJIjNNWbyygwlNUQSmqQRIJsdTWwTotVV` |

## Conexión
```bash
API="http://154.53.39.143:3000/api"
KEY="kOlEmjkNqrSRIXVYdwOzuWehUGMVlItXJIjNNWbyygwlNUQSmqQRIJsdTWwTotVV"

dokploy auth -u http://154.53.39.143:3000 -t "$KEY"
```

## Despliegue de PCManager

El proyecto usa Docker Compose con 3 servicios (postgres, server, client). Para desplegar en Dokploy:

### 1. Crear aplicación en Dokploy
```bash
dokploy application create \
  --name pcmanager \
  --repository https://github.com/EmilioRXD/PCManager \
  --branch main \
  --build-type docker-compose \
  --docker-compose-path docker-compose.yml
```

### 2. Asignar dominio
```bash
dokploy domain create \
  --application pcmanager \
  --domain pcmanager.midominio.com
```

### 3. Monitorear despliegue
```bash
dokploy deployment list --application pcmanager
```

## Estructura del proyecto
- `docker-compose.yml` — Orquestación de 3 servicios
- `server/` — Express API (Dockerfile)
- `client/` — Vue 3 + Quasar (Dockerfile multi-stage + Nginx)
- `database/init.sql` — Esquema PostgreSQL + seed data

## Variables de entorno requeridas
| Variable | Valor |
|----------|-------|
| `DB_HOST` | postgres (nombre del servicio Docker) |
| `DB_PORT` | 5432 |
| `JWT_SECRET` | clave_secreta |
