import { query } from '../config/db.js'

export async function findByEquipoId(equipoId) {
  const result = await query(
    'SELECT id, url, orden FROM imagenes WHERE equipo_id = $1 ORDER BY orden ASC',
    [equipoId]
  )
  return result.rows
}
