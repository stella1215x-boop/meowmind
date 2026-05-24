import { PrismaClient } from '@prisma/client'
import path from 'path'

const globalForPrisma = globalThis

function createPrismaClient() {
  const url = process.env.DATABASE_URL ?? ''

  if (!url) throw new Error('DATABASE_URL is not set. Check your .env.local file.')

  // PostgreSQL (production / Supabase)
  if (url.startsWith('postgresql://') || url.startsWith('postgres://')) {
    const { PrismaPg } = require('@prisma/adapter-pg')
    const adapter = new PrismaPg({ connectionString: url })
    return new PrismaClient({ adapter })
  }

  // SQLite (local dev) — PrismaBetterSqlite3 takes { url } config, not a db instance
  if (url.startsWith('file:')) {
    // Resolve relative path to absolute so the adapter can find the file
    const rel = url.slice('file:'.length)
    const abs = path.resolve(process.cwd(), rel)
    const absUrl = `file:${abs}`

    const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')
    const adapter = new PrismaBetterSqlite3({ url: absUrl })
    return new PrismaClient({ adapter })
  }

  throw new Error(`Unsupported DATABASE_URL format: ${url}`)
}

const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
