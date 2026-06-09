-- Migración: Agregar columna condicion a equipos (nuevo / refurbished)
-- Ejecutar: psql -U pcmanager -d pcmanager -f database/migrate.sql

ALTER TABLE equipos ADD COLUMN IF NOT EXISTS condicion VARCHAR(20) NOT NULL DEFAULT 'nuevo' CHECK (condicion IN ('nuevo', 'refurbished'));

-- Asignar estados a productos existentes (~25% refurbished)
-- Si la columna se agregó con DEFAULT 'nuevo', todos tienen ese valor.
-- Se asigna refurbished a IDs específicos para mantener consistencia con init.sql.
UPDATE equipos SET condicion = 'refurbished' WHERE id IN (3, 5, 11);
