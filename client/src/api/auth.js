import api from './index'

export function login(credentials) {
  return api.post('/auth/login', credentials)
}

export function getMe() {
  return api.get('/auth/me')
}
