import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().trim().min(2),
  studentId: z.string().trim().min(3).optional(),
  email: z.string().trim().email(),
  password: z.string().min(8),
})

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
  role: z.enum(['student', 'admin']).optional(),
})
