import { z } from 'zod'

export const examSchema = z.object({
  title: z.string().trim().min(1),
  subject: z.string().trim().min(1),
  description: z.string().optional(),
  duration: z.coerce.number().int().positive(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  totalMarks: z.coerce.number().int().positive(),
  passingMarks: z.coerce.number().int().nonnegative(),
  code: z.string().trim().min(1),
})

export const questionSchema = z.object({
  text: z.string().trim().min(1),
  options: z.array(z.string().trim().min(1)).length(4),
  correctAnswer: z.coerce.number().int().min(0).max(3),
  marks: z.coerce.number().int().positive(),
  category: z.string().optional(),
  difficulty: z.string().optional(),
})

export const examQuestionAssignmentsSchema = z.object({
  assignments: z.array(z.object({
    questionId: z.string().min(1),
    position: z.coerce.number().int().positive(),
  })).superRefine((assignments, context) => {
    const questionIds = new Set()
    const positions = new Set()
    assignments.forEach((assignment, index) => {
      if (questionIds.has(assignment.questionId)) {
        context.addIssue({ code: z.ZodIssueCode.custom, path: [index, 'questionId'], message: 'Question is assigned more than once' })
      }
      if (positions.has(assignment.position)) {
        context.addIssue({ code: z.ZodIssueCode.custom, path: [index, 'position'], message: 'Positions must be unique' })
      }
      questionIds.add(assignment.questionId)
      positions.add(assignment.position)
    })
  }),
})
