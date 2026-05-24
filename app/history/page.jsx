import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import HistoryClient from '@/components/History/HistoryClient'
import BottomNav from '@/components/shared/BottomNav'

export const metadata = { title: '일기 기록 — MeowMind' }

export default async function HistoryPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const [entries, cat] = await Promise.all([
    prisma.journalEntry.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        mood: true,
        createdAt: true,
      },
    }),
    prisma.cat.findUnique({
      where: { userId: session.user.id },
      select: { totalDaysWritten: true },
    }),
  ])

  // Serialize dates to ISO strings for Client Component
  const serialized = entries.map((e) => ({
    ...e,
    createdAt: e.createdAt.toISOString(),
  }))

  return (
    <>
      <HistoryClient entries={serialized} />
      <BottomNav totalDaysWritten={cat?.totalDaysWritten ?? 0} />
    </>
  )
}
