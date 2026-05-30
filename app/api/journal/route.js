import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { tagMood } from '@/lib/insightsService'
import { calcStage, MILESTONES } from '@/lib/catGrowthService'
import { calculateStreakUpdate } from '@/lib/streakService'

// GET: 일지 목록 (히스토리 페이지에서 사용)
export async function GET(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '20')
  const skip = (page - 1) * limit

  const [entries, total] = await Promise.all([
    prisma.journalEntry.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.journalEntry.count({ where: { userId: session.user.id } }),
  ])

  return NextResponse.json({ entries, total, page, limit })
}

// POST: 일지 작성
export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { sentences } = await req.json()
  if (!sentences || sentences.length !== 3) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }
  if (sentences.some((s) => s.trim().length < 5)) {
    return NextResponse.json({ error: 'Each sentence must be at least 5 characters' }, { status: 400 })
  }

  const userId = session.user.id

  // 오늘 이미 작성했는지 확인
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const existing = await prisma.journalEntry.findFirst({
    where: { userId, createdAt: { gte: todayStart } },
  })
  if (existing) {
    return NextResponse.json({ error: 'Already written today' }, { status: 409 })
  }

  // 스트릭 계산에 필요한 데이터 병렬 조회
  const [cat, recentEntries] = await Promise.all([
    prisma.cat.findUnique({ where: { userId } }),
    prisma.journalEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 8,   // 7일 윈도우 확인에 충분
      select: { createdAt: true },
    }),
  ])

  const mood = tagMood(sentences.join(' '))
  const { newStreak, newLongest, graceDayUsed } = calculateStreakUpdate(cat, recentEntries)
  const newTotal = (cat?.totalDaysWritten ?? 0) + 1
  const newStage = calcStage(newTotal)
  const isMilestone = MILESTONES.includes(newTotal) ? newTotal : null

  // 코인 계산: 문장 당 10코인 (3문장 = 30코인)
  const COINS_PER_SENTENCE = 10
  const validCount = sentences.filter(s => s.trim().length >= 2).length
  const coinsEarned = validCount * COINS_PER_SENTENCE
  // 7일 스트릭 배수마다 보너스 +50 (7, 14, 21...)
  const streakBonus = newStreak > 0 && newStreak % 7 === 0 ? 50 : 0
  const totalCoinsEarned = coinsEarned + streakBonus
  const newCoins = (cat?.coins ?? 0) + totalCoinsEarned

  const [entry, updatedCat] = await prisma.$transaction(async (tx) => {
    const e = await tx.journalEntry.create({
      data: { userId, content: JSON.stringify(sentences), mood },
    })
    const c = await tx.cat.update({
      where: { userId },
      data: {
        totalDaysWritten: newTotal,
        currentStreak: newStreak,
        longestStreak: newLongest,
        stage: newStage,
        lastFedAt: new Date(),
        coins: newCoins,
      },
    })
    return [e, c]
  })

  // 마일스톤 또는 일지 제출 이벤트 비동기 기록 (실패해도 응답에 영향 없음)
  void trackEvent(userId, 'journal_entry_submitted', { mood, graceDayUsed, coinsEarned: totalCoinsEarned })
  if (isMilestone) {
    void trackEvent(userId, 'streak_milestone_reached', { value: isMilestone })
  }

  return NextResponse.json({
    entry,
    cat: updatedCat,
    milestone: isMilestone,
    coinsEarned: totalCoinsEarned,
    streakBonus,
  }, { status: 201 })
}

async function trackEvent(userId, event, properties = {}) {
  try {
    await fetch(`${process.env.NEXTAUTH_URL}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, event, properties }),
    })
  } catch {
    // 애널리틱스 실패는 조용히 무시
  }
}
