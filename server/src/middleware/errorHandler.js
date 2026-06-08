export function errorHandler(err, _req, res, _next) {
  console.error('Error:', err.message)

  if (err.code === '23505') {
    return res.status(409).json({ error: 'El recurso ya existe (valor duplicado)' })
  }

  if (err.code === '23503') {
    return res.status(400).json({ error: 'La categoría especificada no existe' })
  }

  const status = err.status || 500
  const message = err.status ? err.message : 'Error interno del servidor'

  res.status(status).json({ error: message })
}
