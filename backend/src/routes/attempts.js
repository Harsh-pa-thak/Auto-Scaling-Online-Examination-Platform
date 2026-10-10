import { Router } from 'express'
import { prisma } from '../config/prisma.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

function studentQuestion(question, position) {
  return { id: question.id, position, text: question.text, options: [question.option1, question.option2, question.option3, question.option4], marks: question.marks }
}

router.post('/exams/:examId/attempts', requireRole('STUDENT'), async (req, res, next) => {
  try {
    const exam = await prisma.exam.findUnique({ where: { id: req.params.examId }, include: { questions: { orderBy: { position: 'asc' }, include: { question: true } } } })
    const now = new Date()
    if (!exam || !['PUBLISHED', 'ACTIVE'].includes(exam.status) || now < exam.startTime || now > exam.endTime) {
      return res.status(400).json({ error: { code: 'EXAM_UNAVAILABLE', message: 'Exam is not available at this time' } })
    }
    const attempt = await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`${req.user.id}:${exam.id}`}))`
      const existing = await tx.attempt.findFirst({ where: { examId: exam.id, studentId: req.user.id, status: 'IN_PROGRESS' } })
      if (existing && existing.expiresAt > now) return existing
      if (existing) {
        await tx.attempt.update({ where: { id: existing.id }, data: { status: 'EXPIRED', submittedAt: now } })
      }
      const expiresAt = new Date(Math.min(exam.endTime.getTime(), now.getTime() + exam.duration * 60 * 1000))
      return tx.attempt.create({ data: { examId: exam.id, studentId: req.user.id, expiresAt } })
    }, { isolationLevel: 'Serializable' })
    res.status(201).json({ data: { ...attempt, questions: exam.questions.map((item) => studentQuestion(item.question, item.position)) } })
  } catch (error) { next(error) }
})

router.get('/attempts/:id', async (req, res, next) => {
  try {
    const attempt = await prisma.attempt.findFirst({
      where: { id: req.params.id, studentId: req.user.id },
      include: {
        exam: { include: { questions: { orderBy: { position: 'asc' }, include: { question: true } } } },
        answers: { select: { id: true, attemptId: true, questionId: true, selectedOption: true } },
      },
    })
    if (!attempt) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Attempt not found' } })
    const { exam, ...safeAttempt } = attempt
    res.json({
      data: {
        ...safeAttempt,
        exam: { id: exam.id, title: exam.title, subject: exam.subject, duration: exam.duration, endTime: exam.endTime },
        questions: exam.questions.map((item) => studentQuestion(item.question, item.position)),
      },
    })
  } catch (error) { next(error) }
})

router.put('/attempts/:id/answers/:questionId', requireRole('STUDENT'), async (req, res, next) => {
  try {
    const selectedOption = Number(req.body.selectedOption)
    if (!Number.isInteger(selectedOption) || selectedOption < 0 || selectedOption > 3) return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'selectedOption must be between 0 and 3' } })
    const attempt = await prisma.attempt.findFirst({
      where: { id: req.params.id, studentId: req.user.id },
      include: { exam: { include: { questions: { where: { questionId: req.params.questionId }, select: { questionId: true } } } } },
    })
    if (!attempt || attempt.status !== 'IN_PROGRESS') return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Active attempt not found' } })
    if (!attempt.exam.questions.length) return res.status(400).json({ error: { code: 'INVALID_QUESTION', message: 'Question is not assigned to this exam' } })
    if (new Date() > attempt.expiresAt) {
      await prisma.attempt.update({ where: { id: attempt.id }, data: { status: 'EXPIRED', submittedAt: new Date() } })
      return res.status(409).json({ error: { code: 'EXPIRED', message: 'Attempt has expired' } })
    }
    const answer = await prisma.attemptAnswer.upsert({
      where: { attemptId_questionId: { attemptId: attempt.id, questionId: req.params.questionId } },
      update: { selectedOption },
      create: { attemptId: attempt.id, questionId: req.params.questionId, selectedOption },
    })
    res.json({ data: { id: answer.id, attemptId: answer.attemptId, questionId: answer.questionId, selectedOption: answer.selectedOption } })
  } catch (error) { next(error) }
})

router.post('/attempts/:id/submit', requireRole('STUDENT'), async (req, res, next) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const attempt = await tx.attempt.findFirst({ where: { id: req.params.id, studentId: req.user.id }, include: { exam: true, answers: { include: { question: true } } } })
      if (!attempt) throw Object.assign(new Error('Attempt not found'), { statusCode: 404 })
      if (attempt.status !== 'IN_PROGRESS') return attempt
      const expired = new Date() > attempt.expiresAt
      let score = 0
      for (const answer of attempt.answers) {
        const awardedMarks = answer.selectedOption === answer.question.correctAnswer ? answer.question.marks : 0
        score += awardedMarks
        await tx.attemptAnswer.update({ where: { id: answer.id }, data: { awardedMarks } })
      }
      return tx.attempt.update({ where: { id: attempt.id }, data: { status: expired ? 'EXPIRED' : 'SUBMITTED', submittedAt: new Date(), score } })
    })
    res.json({ data: result })
  } catch (error) { next(error) }
})

export default router
