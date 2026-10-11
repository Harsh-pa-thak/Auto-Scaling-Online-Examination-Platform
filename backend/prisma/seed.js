import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const adminPassword = process.env.SEED_ADMIN_PASSWORD
const studentPassword = process.env.SEED_STUDENT_PASSWORD

if (!adminPassword || !studentPassword) throw new Error('SEED_ADMIN_PASSWORD and SEED_STUDENT_PASSWORD are required')

const questionData = [
  ['Which data structure uses FIFO ordering?', 'Stack', 'Queue', 'Tree', 'Graph', 1, 'Data Structures', 'EASY'],
  ['Which SQL clause filters grouped rows?', 'WHERE', 'HAVING', 'ORDER BY', 'JOIN', 1, 'Databases', 'MEDIUM'],
  ['What does HTTP status code 404 indicate?', 'Unauthorized', 'Server error', 'Not found', 'Created', 2, 'Web Development', 'EASY'],
  ['Which language runs natively in a web browser?', 'Java', 'C++', 'JavaScript', 'Python', 2, 'Web Development', 'EASY'],
  ['What is the time complexity of binary search on a sorted array?', 'O(1)', 'O(log n)', 'O(n)', 'O(n²)', 1, 'Algorithms', 'MEDIUM'],
  ['Which normal form removes partial dependency?', 'First normal form', 'Second normal form', 'Third normal form', 'Boyce-Codd normal form', 1, 'Databases', 'MEDIUM'],
  ['Which protocol is commonly used for secure web traffic?', 'FTP', 'HTTP', 'HTTPS', 'SMTP', 2, 'Networking', 'EASY'],
  ['What does CSS primarily control?', 'Database records', 'Page presentation', 'Server processes', 'User passwords', 1, 'Web Development', 'EASY'],
  ['Which principle restricts access to only what is required?', 'Inheritance', 'Encapsulation', 'Least privilege', 'Polymorphism', 2, 'Security', 'MEDIUM'],
  ['Which Git command creates a local copy of a remote repository?', 'git push', 'git merge', 'git clone', 'git status', 2, 'Tools', 'EASY'],
]

async function main() {
  const admin = await prisma.user.upsert({ where: { email: 'admin@example.com' }, update: {}, create: { name: 'Platform Admin', email: 'admin@example.com', passwordHash: await bcrypt.hash(adminPassword, 12), role: 'ADMIN' } })
  const adminUsers = [
    ['admin@example.com', 'Platform Admin'],
    ['admin2@example.com', 'Second Admin'],
  ]
  for (const [email, name] of adminUsers) {
    await prisma.user.upsert({
      where: { email },
      update: { name, role: 'ADMIN', status: 'ACTIVE' },
      create: { name, email, passwordHash: await bcrypt.hash(adminPassword, 12), role: 'ADMIN' },
    })
  }

  const studentUsers = [
    ['student@example.com', 'Demo Student', 'STUDENT001'],
    ['student2@example.com', 'Aarav Sharma', 'STUDENT002'],
    ['student3@example.com', 'Maya Patel', 'STUDENT003'],
    ['student4@example.com', 'Noah Williams', 'STUDENT004'],
    ['student5@example.com', 'Sophia Brown', 'STUDENT005'],
  ]
  for (const [email, name, institutionalId] of studentUsers) {
    await prisma.user.upsert({
      where: { email },
      update: { name, institutionalId, role: 'STUDENT', status: 'ACTIVE' },
      create: { name, institutionalId, email, passwordHash: await bcrypt.hash(studentPassword, 12), role: 'STUDENT' },
    })
  }

  const exam = await prisma.exam.upsert({
    where: { id: 'demo-exam' },
    update: { totalMarks: questionData.length * 2, passingMarks: 10, status: 'PUBLISHED', creatorId: admin.id },
    create: { id: 'demo-exam', title: 'Demo Examination', subject: 'Computer Science', code: 'DEMO001', duration: 30, startTime: new Date(Date.now() - 60 * 60 * 1000), endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), totalMarks: questionData.length * 2, passingMarks: 10, status: 'PUBLISHED', creatorId: admin.id },
  })
  for (let index = 0; index < questionData.length; index += 1) {
    const [text, option1, option2, option3, option4, correctAnswer, category, difficulty] = questionData[index]
    const question = await prisma.question.upsert({
      where: { id: `demo-question-${index + 1}` },
      update: { text, option1, option2, option3, option4, correctAnswer, marks: 2, category, difficulty },
      create: { id: `demo-question-${index + 1}`, text, option1, option2, option3, option4, correctAnswer, marks: 2, category, difficulty },
    })
    await prisma.examQuestion.upsert({
      where: { examId_questionId: { examId: exam.id, questionId: question.id } },
      update: { position: index + 1 },
      create: { examId: exam.id, questionId: question.id, position: index + 1 },
    })
  }
}

main().finally(() => prisma.$disconnect())
