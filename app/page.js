import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { getCatEmotionalState } from '@/lib/catGrowthService'
import { getTodayPrompt } from '@/lib/prompts'
import { getCurrentSeason } from '@/lib/seasonalCats'
import HomeClient from '@/components/HomeClient'

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { onboardingDone: true, isPremium: true, premiumUntil: true },
  })
  if (!user?.onboardingDone) redirect('/onboarding')

  const cat = await prisma.cat.findUnique({
    where: { userId: session.user.id },
  })

  // 오늘 작성 여부 확인
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayEntry = await prisma.journalEntry.findFirst({
    where: { userId: session.user.id, createdAt: { gte: todayStart } },
  })
  const hasWrittenToday = !!todayEntry

  const emotionalState = getCatEmotionalState(cat, hasWrittenToday)
  const prompt = getTodayPrompt()
  const season = getCurrentSeason()
  const isPremium = !!(user?.isPremium && user?.premiumUntil && new Date(user.premiumUntil) > new Date())

  // JSON 직렬화를 위해 Date → string 변환
  const serializedCat = cat ? {
    ...cat,
    lastFedAt: cat.lastFedAt?.toISOString() ?? null,
    createdAt: cat.createdAt.toISOString(),
  } : null

  return (
    <Suspense fallback={<HomeLoading />}>
      <HomeClient
        cat={serializedCat}
        emotionalState={emotionalState}
        hasWrittenToday={hasWrittenToday}
        prompt={prompt}
        season={season}
        isPremium={isPremium}
      />
    </Suspense>
  )
}

function HomeLoading() {
  return (
    <div className="mobile-container flex flex-col items-center justify-center bg-cream">
      <div className="text-6xl animate-bounce">🐱</div>
      <p className="text-gray-400 text-sm mt-4">불러오는 중...</p>
    </div>
  )
}
