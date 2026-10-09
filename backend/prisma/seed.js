import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const adminPassword = process.env.SEED_ADMIN_PASSWORD
const studentPassword = process.env.SEED_STUDENT_PASSWORD

if (!adminPassword || !studentPassword) throw new Error('SEED_ADMIN_PASSWORD and SEED_STUDENT_PASSWORD are required')

const questionData = [
  ['Which data structure uses FIFO ordering?', 'Stack', 'Queue', 'Tree', 'Graph', 1],
  ['Which SQL clause filters grouped rows?', 'WHERE', 'HAVING', 'ORDER BY', 'JOIN', 1],
]

async function main() {
  const admin = await prisma.user.upsert({ where: { email: 'admin@example.com' }, update: {}, create: { name: 'Platform Admin', email: 'admin@example.com', passwordHash: await bcrypt.hash(adminPassword, 12), role: 'ADMIN' } })
  await prisma.user.upsert({ where: { email: 'student@example.com' }, update: {}, create: { name: 'Demo Student', institutionalId: 'STUDENT001', email: 'student@example.com', passwordHash: await bcrypt.hash(studentPassword, 12), role: 'STUDENT' } })
  const exam = await prisma.exam.upsert({ where: { id: 'demo-exam' }, update: {}, create: { id: 'demo-exam', title: 'Demo Examination', subject: 'Computer Science', code: 'DEMO001', duration: 30, startTime: new Date(Date.now() - 60 * 60 * 1000), endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), totalMarks: 4, passingMarks: 2, status: 'PUBLISHED', creatorId: admin.id } })
  for (let index = 0; index < questionData.length; index += 1) {
    const [text, option1, option2, option3, option4, correctAnswer] = questionData[index]
    const question = await prisma.question.create({ data: { text, option1, option2, option3, option4, correctAnswer, marks: 2, category: 'General' } })
    await prisma.examQuestion.create({ data: { examId: exam.id, questionId: question.id, position: index } })
  }
}

main().finally(() => prisma.$disconnect())
