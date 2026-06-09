-- Migración: Agregar columnas a equipos
-- Ejecutar: psql -U pcmanager -d pcmanager -f database/migrate.sql

ALTER TABLE equipos ADD COLUMN IF NOT EXISTS condicion VARCHAR(20) NOT NULL DEFAULT 'nuevo' CHECK (condicion IN ('nuevo', 'refurbished'));
ALTER TABLE equipos ADD COLUMN IF NOT EXISTS pantalla VARCHAR(100);
ALTER TABLE equipos ADD COLUMN IF NOT EXISTS tactil BOOLEAN NOT NULL DEFAULT false;

UPDATE equipos SET condicion = 'refurbished' WHERE id IN (3, 5, 11);
