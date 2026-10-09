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
    res.json({ data: { user: req.user, examsTaken: results, upcomingExams: upcoming, recentResults: attempts } })
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
export default router
