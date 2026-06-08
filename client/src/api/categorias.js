import api from './index'

export function getCategorias() {
  return api.get('/categorias')
}
