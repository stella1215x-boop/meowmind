import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

function createPrismaClient() {
  const url = process.env.DATABASE_URL ?? ''

  if (!url) {
    throw new Error('DATABASE_URL is not set. Check your .env.local file.')
  }

  if (url.startsWith('postgresql://') || url.startsWith('postgres://')) {
    const { PrismaPg } = require('@prisma/adapter-pg')
    const adapter = new PrismaPg({ connectionString: url })
    return new PrismaClient({ adapter })
  }

  throw new Error(`Unsupported DATABASE_URL format: ${url}`)
}

let _client = null

function getClient() {
  if (_client) return _client

  if (globalForPrisma.prisma) {
    _client = globalForPrisma.prisma
    return _client
  }

  _client = createPrismaClient()

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = _client
  }

  return _client
}

// Lazy Proxy — importing this module does NOT initialize Prisma.
// The real client is only created on first property access (inside a request handler).
const prisma = new Proxy(
  {},
  {
    get(_, prop) {
      const client = getClient()
      const value = client[prop]
      return typeof value === 'function' ? value.bind(client) : value
    },
  }
)

export default prisma
