import { query } from '../config/db.js'

export async function findAll() {
  const result = await query('SELECT * FROM categorias ORDER BY nombre')
  return result.rows
}

export async function findById(id) {
  const result = await query('SELECT * FROM categorias WHERE id = $1', [id])
  return result.rows[0] || null
}
