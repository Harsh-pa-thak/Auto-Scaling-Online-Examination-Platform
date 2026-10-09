import jwt from 'jsonwebtoken'
import { prisma } from '../config/prisma.js'
import { env } from '../config/env.js'

export async function requireAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '')
    if (!token) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } })
    const payload = jwt.verify(token, env.jwtSecret)
    const user = await prisma.user.findUnique({ where: { id: payload.id } })
    if (!user || user.status !== 'ACTIVE') return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'User is inactive or does not exist' } })
    req.user = user
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' } })
    }
    next(error)
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } })
    next()
  }
}
