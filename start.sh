#!/bin/bash
export PGHOME=~/postgres/usr/lib/postgresql/18
export LD_LIBRARY_PATH=~/postgres/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH
export PATH=$PGHOME/bin:$PATH

# Levantar PostgreSQL si no está corriendo
if ! pg_isready -p 5434 -h /tmp >/dev/null 2>&1; then
  echo "Iniciando PostgreSQL..."
  rm -f ~/postgres/data/postmaster.pid 2>/dev/null
  pg_ctl -D ~/postgres/data -l ~/postgres/data/pg.log start -o "-p 5434 -k /tmp"
  sleep 2
  if pg_isready -p 5434 -h /tmp >/dev/null 2>&1; then
    echo "PostgreSQL listo"
  else
    echo "ERROR: PostgreSQL no arrancó"
    exit 1
  fi
else
  echo "PostgreSQL ya corriendo"
fi

# Levantar servidor Express
if ! lsof -ti :3000 >/dev/null 2>&1; then
  echo "Iniciando servidor..."
  cd ~/Desktop/Portafolio/PCManager/server
  nohup node src/app.js > /tmp/server.log 2>&1 &
  sleep 2
  echo "Servidor listo en http://localhost:3000"
else
  echo "Servidor ya corriendo en http://localhost:3000"
fi

# Verificar salud
curl -s http://localhost:3000/api/health && echo ""
