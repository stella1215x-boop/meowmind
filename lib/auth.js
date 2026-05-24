import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from './prisma'

const providers = []

// Dev-only: log in with any email — no password needed
// Remove this block (or set NODE_ENV check) before shipping to production
if (process.env.NODE_ENV === 'development') {
  providers.push(
    CredentialsProvider({
      id: 'dev-login',
      name: 'Dev Login',
      credentials: { email: { label: 'Email', type: 'email' } },
      async authorize({ email }) {
        if (!email) return null
        try {
          let user = await prisma.user.findUnique({ where: { email } })
          if (!user) {
            user = await prisma.user.create({
              data: { email, name: email.split('@')[0] },
            })
          }
          return { id: user.id, email: user.email, name: user.name }
        } catch (err) {
          console.error('[dev-login] DB error:', err.message)
          return null
        }
      },
    })
  )
}

// Google OAuth — GOOGLE_CLIENT_ID 가 있을 때만 활성화
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  )
}

// Email Magic Link — EMAIL_SERVER_USER 가 있을 때만 활성화
if (process.env.EMAIL_SERVER_USER) {
  providers.push(
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    })
  )
}

// Use JWT in dev (CredentialsProvider requires JWT), database session in prod
const isDev = process.env.NODE_ENV === 'development'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  pages: {
    signIn: '/login',
    verifyRequest: '/login?verify=1',
  },
  callbacks: {
    async jwt({ token, user }) {
      // On sign-in, attach user fields to the token
      if (user) {
        token.id = user.id
        // Fetch fresh onboardingDone from DB
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { onboardingDone: true },
        })
        token.onboardingDone = dbUser?.onboardingDone ?? false
      }
      return token
    },
    async session({ session, token, user }) {
      if (session.user) {
        if (isDev && token) {
          // JWT strategy — read from token
          session.user.id = token.id
          session.user.onboardingDone = token.onboardingDone
        } else if (user) {
          // Database strategy — read from user (adapter-populated)
          session.user.id = user.id
          session.user.onboardingDone = user.onboardingDone
        }
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url
      if (url.startsWith('/')) return `${baseUrl}${url}`
      return baseUrl
    },
  },
  session: {
    strategy: isDev ? 'jwt' : 'database',
  },
}
