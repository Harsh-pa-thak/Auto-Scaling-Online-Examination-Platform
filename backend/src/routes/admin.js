import { Router } from 'express'
import { prisma } from '../config/prisma.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { publicExam } from './exams.js'

const router = Router()
router.use(requireAuth, requireRole('ADMIN'))

router.get('/dashboard', async (_req, res, next) => {
  try {
    const [students, exams, attempts, recent] = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.exam.count(),
      prisma.attempt.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.attempt.findMany({ include: { exam: true, student: { select: { name: true, email: true } } }, orderBy: { startedAt: 'desc' }, take: 10 }),
    ])
    res.json({ data: { students, exams, activeAttempts: attempts, recentActivity: recent } })
  } catch (error) { next(error) }
})

router.get('/exams', async (_req, res, next) => {
  try { const exams = await prisma.exam.findMany({ include: { _count: { select: { questions: true } } }, orderBy: { createdAt: 'desc' } }); res.json({ data: exams.map(publicExam) }) } catch (error) { next(error) }
})

router.get('/monitoring', async (_req, res, next) => {
  try { const attempts = await prisma.attempt.findMany({ where: { status: 'IN_PROGRESS' }, include: { exam: true, student: { select: { id: true, name: true, email: true } } }, orderBy: { startedAt: 'desc' } }); res.json({ data: attempts }) } catch (error) { next(error) }
})

router.get('/results', async (_req, res, next) => {
  try { const results = await prisma.attempt.findMany({ where: { status: { in: ['SUBMITTED', 'EXPIRED'] } }, include: { exam: true, student: { select: { id: true, name: true, email: true } }, answers: true }, orderBy: { submittedAt: 'desc' } }); res.json({ data: results }) } catch (error) { next(error) }
})

router.get('/analytics', async (_req, res, next) => {
  try {
    const [attempts, students, exams] = await Promise.all([
      prisma.attempt.findMany({ where: { status: { in: ['SUBMITTED', 'EXPIRED'] } }, select: { score: true } }),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.exam.count(),
    ])
    const scores = attempts.map(({ score }) => score).filter((score) => score !== null)
    res.json({ data: { students, exams, attempts: attempts.length, averageScore: scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0 } })
  } catch (error) { next(error) }
})

export default router
