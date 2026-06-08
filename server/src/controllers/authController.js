import * as usuarioModel from '../models/usuario.js'
import { comparePassword, generateToken } from '../services/authService.js'

export async function login(req, res, next) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' })
    }

    const usuario = await usuarioModel.findByEmail(email)
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    const isValid = comparePassword(password, usuario.password_hash)
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    const token = generateToken({ id: usuario.id, email: usuario.email, nombre: usuario.nombre })

    res.json({
      token,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
      },
    })
  } catch (err) {
    next(err)
  }
}

export async function me(req, res, next) {
  try {
    const usuario = await usuarioModel.findById(req.user.id)
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }
    res.json(usuario)
  } catch (err) {
    next(err)
  }
}
