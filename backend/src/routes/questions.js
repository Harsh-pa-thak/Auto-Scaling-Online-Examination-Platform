import { Router } from 'express'
import { prisma } from '../config/prisma.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { questionSchema } from '../validators/exams.js'

const router = Router()
router.use(requireAuth, requireRole('ADMIN'))
const shape = ({ option1, option2, option3, option4, correctAnswer, ...question }) => ({ ...question, options: [option1, option2, option3, option4], correctAnswer })

router.get('/', async (req, res, next) => {
  try { const questions = await prisma.question.findMany({ orderBy: { createdAt: 'desc' } }); res.json({ data: questions.map(shape) }) } catch (error) { next(error) }
})
router.post('/', validate(questionSchema), async (req, res, next) => {
  try {
    const { options, ...data } = req.body
    const question = await prisma.question.create({ data: { ...data, option1: options[0], option2: options[1], option3: options[2], option4: options[3] } })
    res.status(201).json({ data: shape(question) })
  } catch (error) { next(error) }
})
router.patch('/:id', validate(questionSchema.partial()), async (req, res, next) => {
  try {
    const { options, ...data } = req.body
    if (options) Object.assign(data, { option1: options[0], option2: options[1], option3: options[2], option4: options[3] })
    const question = await prisma.question.update({ where: { id: req.params.id }, data })
    res.json({ data: shape(question) })
  } catch (error) { next(error) }
})
router.delete('/:id', async (req, res, next) => {
  try { await prisma.question.delete({ where: { id: req.params.id } }); res.status(204).end() } catch (error) { next(error) }
})
export default router
