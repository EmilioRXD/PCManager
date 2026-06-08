import * as categoriaModel from '../models/categoria.js'

export async function list(_req, res, next) {
  try {
    const categorias = await categoriaModel.findAll()
    res.json(categorias)
  } catch (err) {
    next(err)
  }
}
