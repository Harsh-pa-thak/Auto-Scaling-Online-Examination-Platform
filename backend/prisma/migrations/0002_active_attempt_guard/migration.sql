-- Enforce one active attempt per student and exam at the database level.
-- The application also takes a PostgreSQL advisory lock before creating attempts.
CREATE UNIQUE INDEX "Attempt_active_student_exam_key"
ON "Attempt" ("studentId", "examId")
WHERE "status" = 'IN_PROGRESS';
