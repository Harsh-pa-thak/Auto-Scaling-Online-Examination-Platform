import { Router } from 'express'
import { prisma } from '../config/prisma.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { examSchema } from '../validators/exams.js'

const router = Router()
router.use(requireAuth)
const publicExam = (exam) => ({ ...exam, totalQuestions: exam.questions?.length ?? exam._count?.questions ?? 0, totalMarks: exam.totalMarks, passMark: exam.passingMarks, startTime: exam.startTime, endTime: exam.endTime, status: exam.status.toLowerCase(), section: [] })
const include = { questions: { orderBy: { position: 'asc' }, include: { question: true } } }

router.get('/', async (req, res, next) => {
  try {
    const where = req.user.role === 'ADMIN' ? {} : { status: { in: ['PUBLISHED', 'ACTIVE'] } }
    const exams = await prisma.exam.findMany({ where, include: { _count: { select: { questions: true } } }, orderBy: { startTime: 'desc' } })
    res.json({ data: exams.map(publicExam) })
  } catch (error) { next(error) }
})

router.get('/:id', async (req, res, next) => {
  try {
    const exam = await prisma.exam.findUnique({ where: { id: req.params.id }, include })
    if (!exam) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Exam not found' } })
    const result = publicExam(exam)
    result.instructions = []
    result.questions = req.user.role === 'STUDENT' ? exam.questions.map(({ question, position }) => ({ id: question.id, position, text: question.text, options: [question.option1, question.option2, question.option3, question.option4], marks: question.marks })) : exam.questions
    res.json({ data: result })
  } catch (error) { next(error) }
})

router.post('/', requireRole('ADMIN'), validate(examSchema), async (req, res, next) => {
  try {
    const exam = await prisma.exam.create({ data: { ...req.body, creatorId: req.user.id } })
    res.status(201).json({ data: publicExam(exam) })
  } catch (error) { next(error) }
})

router.patch('/:id', requireRole('ADMIN'), async (req, res, next) => {
  try {
    const data = { ...req.body }
    if (data.startTime) data.startTime = new Date(data.startTime)
    if (data.endTime) data.endTime = new Date(data.endTime)
    if (data.totalMarks !== undefined) data.totalMarks = Number(data.totalMarks)
    if (data.passingMarks !== undefined) data.passingMarks = Number(data.passingMarks)
    if (data.duration !== undefined) data.duration = Number(data.duration)
    if (data.status) data.status = data.status.toUpperCase()
    const exam = await prisma.exam.update({ where: { id: req.params.id }, data })
    res.json({ data: publicExam(exam) })
  } catch (error) { next(error) }
})

router.delete('/:id', requireRole('ADMIN'), async (req, res, next) => {
  try { await prisma.exam.delete({ where: { id: req.params.id } }); res.status(204).end() } catch (error) { next(error) }
})

router.post('/:id/publish', requireRole('ADMIN'), async (req, res, next) => {
  try { const exam = await prisma.exam.update({ where: { id: req.params.id }, data: { status: 'PUBLISHED' } }); res.json({ data: publicExam(exam) }) } catch (error) { next(error) }
})

export { publicExam }
export default router
