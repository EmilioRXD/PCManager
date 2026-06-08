-- Migración: Agregar columna condicion a equipos (nuevo / refurbished)
-- Ejecutar: psql -U pcmanager -d pcmanager -f database/migrate.sql

ALTER TABLE equipos ADD COLUMN IF NOT EXISTS condicion VARCHAR(20) NOT NULL DEFAULT 'nuevo' CHECK (condicion IN ('nuevo', 'refurbished'));

-- Asignar estados a productos existentes (~25% refurbished)
UPDATE equipos SET condicion = 'nuevo' WHERE condicion IS NULL AND id % 4 != 0;
UPDATE equipos SET condicion = 'refurbished' WHERE condicion IS NULL;
