import { query } from '../config/db.js'

export async function findByEmail(email) {
  const result = await query('SELECT * FROM usuarios WHERE email = $1', [email])
  return result.rows[0] || null
}

export async function findById(id) {
  const result = await query('SELECT id, nombre, email, created_at FROM usuarios WHERE id = $1', [id])
  return result.rows[0] || null
}
