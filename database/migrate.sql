-- Migración: Agregar columnas y búsqueda avanzada a equipos
-- Ejecutar: psql -U pcmanager -d pcmanager -f database/migrate.sql

ALTER TABLE equipos ADD COLUMN IF NOT EXISTS condicion VARCHAR(20) NOT NULL DEFAULT 'nuevo' CHECK (condicion IN ('nuevo', 'refurbished'));
ALTER TABLE equipos ADD COLUMN IF NOT EXISTS pantalla VARCHAR(100);
ALTER TABLE equipos ADD COLUMN IF NOT EXISTS tactil BOOLEAN NOT NULL DEFAULT false;

CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_equipos_marca_trgm ON equipos USING GIN (marca gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_equipos_modelo_trgm ON equipos USING GIN (modelo gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_equipos_procesador_trgm ON equipos USING GIN (procesador gin_trgm_ops);

UPDATE equipos SET condicion = 'refurbished' WHERE id IN (3, 5, 11);
