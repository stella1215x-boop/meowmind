import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from './prisma'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Email & Password',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },
      async authorize({ email, password }) {
        if (!email || !password) return null
        try {
          const user = await prisma.user.findUnique({ where: { email } })
          if (!user || !user.password) return null
          const valid = await bcrypt.compare(password, user.password)
          if (!valid) return null
          return { id: user.id, email: user.email, name: user.name }
        } catch (err) {
          console.error('[authorize] DB error:', err.message)
          return null
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { onboardingDone: true },
        })
        token.onboardingDone = dbUser?.onboardingDone ?? false
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id             = token.id
        session.user.onboardingDone = token.onboardingDone
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url
      if (url.startsWith('/'))     return `${baseUrl}${url}`
      return baseUrl
    },
  },
}
