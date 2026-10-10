import { Router } from 'express'
import { prisma } from '../config/prisma.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { examQuestionAssignmentsSchema, examSchema } from '../validators/exams.js'

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
    if (req.user.role === 'STUDENT' && !['PUBLISHED', 'ACTIVE'].includes(exam.status)) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Exam not found' } })
    }
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

router.get('/:id/questions', requireRole('ADMIN'), async (req, res, next) => {
  try {
    const exam = await prisma.exam.findUnique({
      where: { id: req.params.id },
      include: { questions: { orderBy: { position: 'asc' }, include: { question: true } } },
    })
    if (!exam) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Exam not found' } })
    res.json({ data: exam.questions })
  } catch (error) { next(error) }
})

router.put('/:id/questions', requireRole('ADMIN'), validate(examQuestionAssignmentsSchema), async (req, res, next) => {
  try {
    const exam = await prisma.exam.findUnique({ where: { id: req.params.id }, select: { id: true, status: true } })
    if (!exam) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Exam not found' } })
    if (['ACTIVE', 'COMPLETED'].includes(exam.status)) {
      return res.status(409).json({ error: { code: 'EXAM_LOCKED', message: 'Questions cannot be changed for an active or completed exam' } })
    }

    const questionIds = req.body.assignments.map(({ questionId }) => questionId)
    const questions = await prisma.question.findMany({ where: { id: { in: questionIds } }, select: { id: true } })
    if (questions.length !== questionIds.length) {
      return res.status(400).json({ error: { code: 'INVALID_QUESTION', message: 'One or more questions do not exist' } })
    }

    const assignments = await prisma.$transaction(async (tx) => {
      await tx.examQuestion.deleteMany({ where: { examId: req.params.id } })
      if (req.body.assignments.length) {
        await tx.examQuestion.createMany({
          data: req.body.assignments.map(({ questionId, position }) => ({ examId: req.params.id, questionId, position })),
        })
      }
      return tx.examQuestion.findMany({
        where: { examId: req.params.id },
        orderBy: { position: 'asc' },
        include: { question: true },
      })
    })
    res.json({ data: assignments })
  } catch (error) { next(error) }
})

router.patch('/:id/questions/:questionId', requireRole('ADMIN'), async (req, res, next) => {
  try {
    const position = Number(req.body.position)
    if (!Number.isInteger(position) || position < 1) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Position must be a positive integer' } })
    }
    const assignment = await prisma.examQuestion.update({
      where: { examId_questionId: { examId: req.params.id, questionId: req.params.questionId } },
      data: { position },
      include: { question: true },
    })
    res.json({ data: assignment })
  } catch (error) { next(error) }
})

router.delete('/:id/questions/:questionId', requireRole('ADMIN'), async (req, res, next) => {
  try {
    const exam = await prisma.exam.findUnique({ where: { id: req.params.id }, select: { status: true } })
    if (!exam) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Exam not found' } })
    if (['ACTIVE', 'COMPLETED'].includes(exam.status)) {
      return res.status(409).json({ error: { code: 'EXAM_LOCKED', message: 'Questions cannot be changed for an active or completed exam' } })
    }
    await prisma.examQuestion.delete({
      where: { examId_questionId: { examId: req.params.id, questionId: req.params.questionId } },
    })
    res.status(204).end()
  } catch (error) { next(error) }
})

export { publicExam }
export default router
