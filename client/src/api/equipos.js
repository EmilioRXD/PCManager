import api from './index'

export function getEquipos(params = {}) {
  const { signal, ...rest } = params
  return api.get('/equipos', { params: rest, signal })
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
