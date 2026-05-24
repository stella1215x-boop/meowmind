import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { tagMood } from '@/lib/insightsService'

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { catName, catColor, reminderTime, sentences } = await req.json()

  if (!catName || !catColor || !sentences || sentences.length !== 3) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }

  const userId = session.user.id
  const combinedText = sentences.join(' ')
  const mood = tagMood(combinedText)

  const [cat, entry] = await prisma.$transaction(async (tx) => {
    const newCat = await tx.cat.create({
      data: {
        userId,
        name: catName,
        color: catColor,
        stage: 0,
        totalDaysWritten: 1,
        currentStreak: 1,
        longestStreak: 1,
        lastFedAt: new Date(),
      },
    })

    const newEntry = await tx.journalEntry.create({
      data: {
        userId,
        content: JSON.stringify(sentences),
        mood,
      },
    })

    await tx.user.update({
      where: { id: userId },
      data: {
        onboardingDone: true,
        reminderTime: reminderTime || null,
      },
    })

    return [newCat, newEntry]
  })

  // 비동기 이벤트 기록 (응답에 영향 없음)
  void fetch(`${process.env.NEXTAUTH_URL}/api/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, event: 'onboarding_completed' }),
  }).catch(() => {})

  return NextResponse.json({ cat, entry }, { status: 201 })
}
