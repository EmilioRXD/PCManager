import { Router } from 'express'
import { list, getById, getBrands, create, update, remove } from '../controllers/equiposController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', list)
router.get('/brands', getBrands)
router.get('/:id', getById)
router.post('/', authMiddleware, create)
router.put('/:id', authMiddleware, update)
router.delete('/:id', authMiddleware, remove)

export default router
