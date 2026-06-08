import * as equipoModel from '../models/equipo.js'
import { validateEquipo } from '../validators/equipoValidator.js'

export async function list(req, res, next) {
  try {
    const { categoria, search, condicion, page, limit } = req.query
    const result = await equipoModel.findAll({ categoria, search, condicion, page, limit })
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export async function getById(req, res, next) {
  try {
    const { id } = req.params
    const equipo = await equipoModel.findById(parseInt(id, 10))

    if (!equipo) {
      return res.status(404).json({ error: 'Equipo no encontrado' })
    }

    res.json(equipo)
  } catch (err) {
    next(err)
  }
}

export async function create(req, res, next) {
  try {
    const data = validateEquipo(req.body)
    const equipo = await equipoModel.create(data)
    res.status(201).json(equipo)
  } catch (err) {
    next(err)
  }
}

export async function update(req, res, next) {
  try {
    const { id } = req.params
    const data = validateEquipo(req.body, true)

    const equipo = await equipoModel.update(parseInt(id, 10), data)

    if (!equipo) {
      return res.status(404).json({ error: 'Equipo no encontrado' })
    }

    res.json(equipo)
  } catch (err) {
    next(err)
  }
}

export async function remove(req, res, next) {
  try {
    const { id } = req.params
    const equipo = await equipoModel.remove(parseInt(id, 10))

    if (!equipo) {
      return res.status(404).json({ error: 'Equipo no encontrado' })
    }

    res.json({ message: 'Equipo eliminado correctamente', id: equipo.id })
  } catch (err) {
    next(err)
  }
}
