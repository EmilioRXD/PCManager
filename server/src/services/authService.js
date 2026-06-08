import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

export function hashPassword(password) {
  return bcryptjs.hashSync(password, 10)
}

export function comparePassword(password, hash) {
  return bcryptjs.compareSync(password, hash)
}

export function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' })
}
