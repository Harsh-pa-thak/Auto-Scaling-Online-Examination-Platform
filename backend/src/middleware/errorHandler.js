export function notFound(_req, res) {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } })
}

export function errorHandler(error, _req, res, _next) {
  console.error(error)
  if (error.name === 'ZodError') {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid request data', fields: error.flatten().fieldErrors } })
  }
  if (error.code === 'P2002') return res.status(409).json({ error: { code: 'CONFLICT', message: 'A record with these values already exists' } })
  const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
  res.status(error.statusCode || 500).json({ error: { code: 'INTERNAL_ERROR', message } })
}
