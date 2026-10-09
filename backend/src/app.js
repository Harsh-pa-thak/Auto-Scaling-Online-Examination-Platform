import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { env } from './config/env.js'
import healthRouter from './routes/health.js'
import authRouter from './routes/auth.js'
import examsRouter from './routes/exams.js'
import attemptsRouter from './routes/attempts.js'
import questionsRouter from './routes/questions.js'
import studentRouter from './routes/student.js'
import adminRouter from './routes/admin.js'
import studentsRouter from './routes/students.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

const app = express()
app.use(helmet())
app.use(cors({ origin: env.frontendUrl }))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 50, standardHeaders: true, legacyHeaders: false }), authRouter)
app.use('/api/health', healthRouter)
app.use('/api/student', studentRouter)
app.use('/api/admin', adminRouter)
app.use('/api/students', studentsRouter)
app.use('/api/questions', questionsRouter)
app.use('/api/exams', examsRouter)
app.use('/api', attemptsRouter)
app.use(notFound)
app.use(errorHandler)
export default app
