export const dynamic = 'force-dynamic'

let _handler = null
async function getHandler() {
  if (_handler) return _handler
  const { default: NextAuth } = await import('next-auth')
  const { authOptions } = await import('@/lib/auth')
  _handler = NextAuth(authOptions)
  return _handler
}

export async function GET(req, ctx) {
  return (await getHandler())(req, ctx)
}

export async function POST(req, ctx) {
  return (await getHandler())(req, ctx)
}
