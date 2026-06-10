import { query } from '../config/db.js'
import * as imagenModel from './imagen.js'

export async function findAll({ categoria, search, condicion, marca, precio_min, precio_max, random, page = 1, limit = 12 } = {}) {
  const params = []
  let p = 1

  let selectBase = 'SELECT e.*, c.nombre AS categoria_nombre'
  let searchRankCol = ''
  let whereClause = 'WHERE 1 = 1'
  let orderBy

  if (search) {
    const textCols = `coalesce(e.marca,'') || ' ' || coalesce(e.modelo,'') || ' ' || coalesce(e.procesador,'') || ' ' || coalesce(e.ram,'') || ' ' || coalesce(e.almacenamiento,'') || ' ' || coalesce(e.descripcion,'') || ' ' || coalesce(e.pantalla,'')`

    whereClause += ` AND (
      to_tsvector('spanish', ${textCols}) @@ plainto_tsquery('spanish', $${p})
      OR word_similarity($${p}, e.marca) > 0.3
      OR word_similarity($${p}, e.modelo) > 0.3
      OR word_similarity($${p}, e.procesador) > 0.3
      OR similarity($${p}, e.marca || ' ' || e.modelo) > 0.5
    )`

    searchRankCol = `, GREATEST(
      COALESCE(ts_rank(to_tsvector('spanish', ${textCols}), plainto_tsquery('spanish', $${p})), 0),
      COALESCE(word_similarity($${p}, e.marca), 0) * 3,
      COALESCE(word_similarity($${p}, e.modelo), 0) * 3,
      COALESCE(similarity($${p}, e.marca || ' ' || e.modelo), 0) * 2
    ) AS rank`

    orderBy = 'ORDER BY rank DESC, e.id DESC'
    params.push(search)
    p++
  } else if (random) {
    orderBy = 'ORDER BY RANDOM()'
  } else {
    orderBy = 'ORDER BY e.created_at DESC'
  }

  if (categoria) {
    whereClause += ` AND e.categoria_id = $${p++}`
    params.push(parseInt(categoria, 10))
  }

  if (condicion) {
    const condiciones = Array.isArray(condicion) ? condicion : condicion.split(',').filter(Boolean)
    const ph = condiciones.map((_, i) => `$${p + i}`).join(', ')
    whereClause += ` AND e.condicion IN (${ph})`
    condiciones.forEach((c) => params.push(c.trim()))
    p += condiciones.length
  }

  if (marca) {
    const marcas = Array.isArray(marca) ? marca : marca.split(',').filter(Boolean)
    const ph = marcas.map((_, i) => `$${p + i}`).join(', ')
    whereClause += ` AND e.marca IN (${ph})`
    marcas.forEach((m) => params.push(m.trim()))
    p += marcas.length
  }

  if (precio_min) {
    whereClause += ` AND e.precio >= $${p++}`
    params.push(parseFloat(precio_min))
  }

  if (precio_max) {
    whereClause += ` AND e.precio <= $${p++}`
    params.push(parseFloat(precio_max))
  }

  const countSql = `SELECT COUNT(*) AS total FROM equipos e JOIN categorias c ON e.categoria_id = c.id ${whereClause}`
  const countResult = await query(countSql, params)
  const total = parseInt(countResult.rows[0].total, 10)

  const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10)
  const dataSql = `${selectBase}${searchRankCol} FROM equipos e JOIN categorias c ON e.categoria_id = c.id ${whereClause} ${orderBy} LIMIT $${p++} OFFSET $${p++}`
  const dataParams = [...params, parseInt(limit, 10), offset]

  const dataResult = await query(dataSql, dataParams)

  return {
    data: dataResult.rows,
    total,
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    totalPages: Math.ceil(total / parseInt(limit, 10)),
  }
}

export async function getBrands() {
  const result = await query(
    `SELECT DISTINCT marca FROM equipos WHERE marca IS NOT NULL AND marca <> '' ORDER BY marca`,
    []
  )
  return result.rows.map((r) => r.marca)
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
    'tarjeta_grafica', 'precio', 'stock', 'imagen_url', 'descripcion', 'condicion', 'pantalla', 'tactil', 'categoria_id',
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
    'tarjeta_grafica', 'precio', 'stock', 'imagen_url', 'descripcion', 'condicion', 'pantalla', 'tactil', 'categoria_id',
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
