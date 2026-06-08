import { query } from '../config/db.js'
import * as imagenModel from './imagen.js'

export async function findAll({ categoria, search, condicion, page = 1, limit = 12 } = {}) {
  let sql = `
    SELECT e.*, c.nombre AS categoria_nombre
    FROM equipos e
    JOIN categorias c ON e.categoria_id = c.id
    WHERE 1 = 1
  `
  const params = []
  let paramIndex = 1

  if (categoria) {
    sql += ` AND e.categoria_id = $${paramIndex++}`
    params.push(parseInt(categoria, 10))
  }

  if (search) {
    sql += ` AND (e.marca ILIKE $${paramIndex} OR e.modelo ILIKE $${paramIndex} OR e.descripcion ILIKE $${paramIndex})`
    params.push(`%${search}%`)
    paramIndex++
  }

  if (condicion) {
    sql += ` AND e.condicion = $${paramIndex++}`
    params.push(condicion)
  }

  const countResult = await query(
    sql.replace(/SELECT e\.\*, c\.nombre AS categoria_nombre/, 'SELECT COUNT(*) AS total'),
    params
  )
  const total = parseInt(countResult.rows[0].total, 10)

  const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10)
  sql += ` ORDER BY e.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`
  params.push(parseInt(limit, 10), offset)

  const result = await query(sql, params)

  return {
    data: result.rows,
    total,
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    totalPages: Math.ceil(total / parseInt(limit, 10)),
  }
}

export async function findById(id) {
  const result = await query(
    `SELECT e.*, c.nombre AS categoria_nombre
     FROM equipos e
     JOIN categorias c ON e.categoria_id = c.id
     WHERE e.id = $1`,
    [id]
  )
  const equipo = result.rows[0] || null
  if (equipo) {
    equipo.imagenes = await imagenModel.findByEquipoId(id)
  }
  return equipo
}

export async function create(data) {
  const fields = [
    'marca', 'modelo', 'procesador', 'ram', 'almacenamiento',
    'tarjeta_grafica', 'precio', 'stock', 'imagen_url', 'descripcion', 'condicion', 'categoria_id',
  ]
  const values = fields.map((f) => data[f])
  const placeholders = values.map((_, i) => `$${i + 1}`).join(', ')
  const columns = fields.join(', ')

  const result = await query(
    `INSERT INTO equipos (${columns}) VALUES (${placeholders}) RETURNING *`,
    values
  )

  const full = await findById(result.rows[0].id)
  return full
}

export async function update(id, data) {
  const allowedFields = [
    'marca', 'modelo', 'procesador', 'ram', 'almacenamiento',
    'tarjeta_grafica', 'precio', 'stock', 'imagen_url', 'descripcion', 'condicion', 'categoria_id',
  ]

  const sets = []
  const values = []
  let idx = 1

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      sets.push(`${field} = $${idx++}`)
      values.push(data[field])
    }
  }

  if (sets.length === 0) {
    return findById(id)
  }

  sets.push(`updated_at = NOW()`)
  values.push(id)

  await query(
    `UPDATE equipos SET ${sets.join(', ')} WHERE id = $${idx}`,
    values
  )

  return findById(id)
}

export async function remove(id) {
  const result = await query('DELETE FROM equipos WHERE id = $1 RETURNING *', [id])
  return result.rows[0] || null
}
