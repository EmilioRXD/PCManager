import api from './index'

export function getEquipos(params = {}) {
  return api.get('/equipos', { params })
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
