import { Router } from 'express'
import { prisma } from '../config/prisma.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth, requireRole('ADMIN'))

router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page || 1), 1)
    const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 100)
    const search = String(req.query.search || '')
    const where = { role: 'STUDENT', ...(search ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }, { institutionalId: { contains: search, mode: 'insensitive' } }] } : {}) }
    const [students, total] = await Promise.all([prisma.user.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { name: 'asc' }, select: { id: true, name: true, email: true, institutionalId: true, status: true, branch: true, semester: true, section: true, cgpa: true } }), prisma.user.count({ where })])
    res.json({ data: students, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } })
  } catch (error) { next(error) }
})

router.patch('/:id/status', async (req, res, next) => {
  try {
    const status = String(req.body.status || '').toUpperCase()
    if (!['ACTIVE', 'INACTIVE'].includes(status)) return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Status must be active or inactive' } })
    const student = await prisma.user.update({ where: { id: req.params.id }, data: { status } })
    res.json({ data: { id: student.id, status: student.status.toLowerCase() } })
  } catch (error) { next(error) }
})

export default router
