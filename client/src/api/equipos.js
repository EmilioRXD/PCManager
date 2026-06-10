import api from './index'

export function getEquipos(params = {}) {
  const { signal, ...rest } = params
  const searchParams = new URLSearchParams()
  for (const key in rest) {
    const val = rest[key]
    if (Array.isArray(val)) {
      val.forEach((v) => searchParams.append(key, v))
    } else if (val !== undefined && val !== null) {
      searchParams.append(key, val)
    }
  }
  const qs = searchParams.toString()
  return api.get(`/equipos${qs ? '?' + qs : ''}`, { signal })
}

export function getBrands() {
  return api.get('/equipos/brands')
}

export function getEquipo(id) {
  return api.get(`/equipos/${id}`)
}

export function createEquipo(data) {
  return api.post('/equipos', data)
}

export function updateEquipo(id, data) {
  return api.put(`/equipos/${id}`, data)
}

export function deleteEquipo(id) {
  return api.delete(`/equipos/${id}`)
}

export function getBrands() {
  return api.get('/equipos')
}
