import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../config/prisma.js'
import { env } from '../config/env.js'
import { requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { loginSchema, registerSchema } from '../validators/auth.js'

const router = Router()
const safeUser = (user) => ({ id: user.id, name: user.name, studentId: user.institutionalId, email: user.email, role: user.role.toLowerCase(), status: user.status.toLowerCase(), branch: user.branch, semester: user.semester, section: user.section, cgpa: user.cgpa, phone: user.phone })

router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const { name, studentId, email, password } = req.body
    const user = await prisma.user.create({ data: { name, institutionalId: studentId, email: email.toLowerCase(), passwordHash: await bcrypt.hash(password, 12) } })
    res.status(201).json({ data: { user: safeUser(user) } })
  } catch (error) { next(error) }
})

router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password, role } = req.body
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    const valid = user && user.status === 'ACTIVE' && (!role || user.role.toLowerCase() === role) && await bcrypt.compare(password, user.passwordHash)
    if (!valid) return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email, password, or role' } })
    const token = jwt.sign({ id: user.id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn })
    res.json({ data: { token, user: safeUser(user) } })
  } catch (error) { next(error) }
})

router.post('/logout', requireAuth, (_req, res) => res.status(204).end())
router.get('/me', requireAuth, (req, res) => res.json({ data: { user: safeUser(req.user) } }))
router.patch('/password', requireAuth, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword || newPassword.length < 8) return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Valid current and new passwords are required' } })
    if (!(await bcrypt.compare(currentPassword, req.user.passwordHash))) return res.status(400).json({ error: { code: 'INVALID_PASSWORD', message: 'Current password is incorrect' } })
    await prisma.user.update({ where: { id: req.user.id }, data: { passwordHash: await bcrypt.hash(newPassword, 12) } })
    res.status(204).end()
  } catch (error) { next(error) }
})

export { safeUser }
export default router
