import { NextResponse } from 'next/server'
import webpush from 'web-push'
import prisma from '@/lib/prisma'

// Called by Vercel Cron (vercel.json) — every hour
// Sends a reminder to users whose reminderTime matches the current KST hour
// and who haven't written today yet
export async function GET(request) {
  // Protect with a shared secret (set CRON_SECRET in env)
  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  webpush.setVapidDetails(
    `mailto:${process.env.VAPID_EMAIL}`,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY,
  )

  // Current hour in KST (UTC+9)
  const nowUtc = new Date()
  const kstHour = (nowUtc.getUTCHours() + 9) % 24
  const currentHHMM = `${String(kstHour).padStart(2, '0')}:00`

  const todayKST = new Date(nowUtc.getTime() + 9 * 60 * 60 * 1000)
  todayKST.setUTCHours(0, 0, 0, 0)
  const todayStart = new Date(todayKST.getTime() - 9 * 60 * 60 * 1000) // back to UTC

  // Find push subscriptions for users whose reminderTime matches this hour
  const subscriptions = await prisma.pushSubscription.findMany({
    where: {
      user: {
        reminderTime: currentHHMM,
      },
    },
    include: {
      user: {
        select: { id: true, reminderTime: true, cat: { select: { name: true, currentStreak: true } } },
      },
    },
  })

  const results = await Promise.allSettled(
    subscriptions.map(async (sub) => {
      // Skip if already written today
      const todayEntry = await prisma.journalEntry.findFirst({
        where: { userId: sub.userId, createdAt: { gte: todayStart } },
      })
      if (todayEntry) return null

      const catName = sub.user?.cat?.name ?? '고양이'
      const streak  = sub.user?.cat?.currentStreak ?? 0

      const payload = JSON.stringify({
        title: `${catName}가 기다리고 있어요 🐱`,
        body:  streak > 0
          ? `${streak}일 스트릭! 오늘도 3문장 써볼까요?`
          : '오늘 감사한 일 3가지를 기록해 보세요',
        url: '/',
      })

      return webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload,
      )
    })
  )

  const sent   = results.filter((r) => r.status === 'fulfilled' && r.value != null).length
  const failed = results.filter((r) => r.status === 'rejected').length
  const skipped = results.filter((r) => r.status === 'fulfilled' && r.value == null).length

  return NextResponse.json({ hour: currentHHMM, sent, failed, skipped })
}
