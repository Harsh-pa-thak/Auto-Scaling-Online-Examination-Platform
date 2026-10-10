import { Router } from 'express'
import { prisma } from '../config/prisma.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth, requireRole('STUDENT'))

router.get('/dashboard', async (req, res, next) => {
  try {
    const [attempts, upcoming, results] = await Promise.all([
      prisma.attempt.findMany({ where: { studentId: req.user.id, status: { in: ['SUBMITTED', 'EXPIRED'] } }, include: { exam: true }, orderBy: { submittedAt: 'desc' }, take: 5 }),
      prisma.exam.findMany({ where: { status: { in: ['PUBLISHED', 'ACTIVE'] }, startTime: { gte: new Date() } }, orderBy: { startTime: 'asc' }, take: 5 }),
      prisma.attempt.count({ where: { studentId: req.user.id, status: { in: ['SUBMITTED', 'EXPIRED'] } } }),
    ])
    const { passwordHash, ...user } = req.user
    res.json({ data: { user, examsTaken: results, upcomingExams: upcoming, recentResults: attempts } })
  } catch (error) { next(error) }
})

router.get('/results', async (req, res, next) => {
  try { const results = await prisma.attempt.findMany({ where: { studentId: req.user.id, status: { in: ['SUBMITTED', 'EXPIRED'] } }, include: { exam: true, answers: true }, orderBy: { submittedAt: 'desc' } }); res.json({ data: results }) } catch (error) { next(error) }
})
router.get('/history', async (req, res, next) => {
  try { const history = await prisma.attempt.findMany({ where: { studentId: req.user.id }, include: { exam: true }, orderBy: { startedAt: 'desc' } }); res.json({ data: history }) } catch (error) { next(error) }
})
router.get('/notifications', async (req, res, next) => {
  try { const notifications = await prisma.notification.findMany({ where: { userId: req.user.id }, orderBy: { createdAt: 'desc' } }); res.json({ data: notifications }) } catch (error) { next(error) }
})
router.patch('/notifications/:id/read', async (req, res, next) => {
  try {
    const notification = await prisma.notification.updateMany({ where: { id: req.params.id, userId: req.user.id }, data: { read: true } })
    if (!notification.count) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Notification not found' } })
    res.status(204).end()
  } catch (error) { next(error) }
})
router.post('/notifications/read-all', async (req, res, next) => {
  try { await prisma.notification.updateMany({ where: { userId: req.user.id, read: false }, data: { read: true } }); res.status(204).end() } catch (error) { next(error) }
})
router.get('/profile', async (req, res) => {
  const { passwordHash, ...profile } = req.user
  res.json({ data: profile })
})
export default router
