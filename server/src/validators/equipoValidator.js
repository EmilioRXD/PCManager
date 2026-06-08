import Joi from 'joi'

const equipoSchema = Joi.object({
  marca: Joi.string().max(100).required().messages({
    'any.required': 'La marca es requerida',
    'string.max': 'La marca debe tener máximo 100 caracteres',
  }),
  modelo: Joi.string().max(150).required().messages({
    'any.required': 'El modelo es requerido',
    'string.max': 'El modelo debe tener máximo 150 caracteres',
  }),
  procesador: Joi.string().max(150).required().messages({
    'any.required': 'El procesador es requerido',
    'string.max': 'El procesador debe tener máximo 150 caracteres',
  }),
  ram: Joi.string().max(50).required().messages({
    'any.required': 'La RAM es requerida',
    'string.max': 'La RAM debe tener máximo 50 caracteres',
  }),
  almacenamiento: Joi.string().max(150).required().messages({
    'any.required': 'El almacenamiento es requerido',
    'string.max': 'El almacenamiento debe tener máximo 150 caracteres',
  }),
  tarjeta_grafica: Joi.string().max(150).allow('', null).messages({
    'string.max': 'La tarjeta gráfica debe tener máximo 150 caracteres',
  }),
  precio: Joi.number().min(0).required().messages({
    'any.required': 'El precio es requerido',
    'number.min': 'El precio debe ser mayor o igual a 0',
  }),
  stock: Joi.number().integer().min(0).required().messages({
    'any.required': 'El stock es requerido',
    'number.min': 'El stock debe ser mayor o igual a 0',
  }),
  imagen_url: Joi.string().uri().allow('', null).messages({
    'string.uri': 'La URL de la imagen no es válida',
  }),
  descripcion: Joi.string().allow('', null),
  categoria_id: Joi.number().integer().required().messages({
    'any.required': 'La categoría es requerida',
  }),
})

export function validateEquipo(data, isUpdate = false) {
  const schema = isUpdate ? equipoSchema.fork(
    ['marca', 'modelo', 'procesador', 'ram', 'almacenamiento', 'precio', 'stock', 'categoria_id'],
    (field) => field.optional()
  ) : equipoSchema

  const { error, value } = schema.validate(data, { abortEarly: false, stripUnknown: true })
  if (error) {
    const messages = error.details.map((d) => d.message).join(', ')
    const err = new Error(messages)
    err.status = 400
    throw err
  }
  return value
}
