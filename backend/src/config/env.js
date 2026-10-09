import 'dotenv/config'

const required = ['DATABASE_URL', 'JWT_SECRET']
const missing = required.filter((name) => !process.env[name])

if (missing.length) {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
}

export const env = {
  port: Number(process.env.PORT || 5000),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development',
}
