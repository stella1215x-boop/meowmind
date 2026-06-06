import { NextResponse } from 'next/server'
import webpush from 'web-push'
import prisma from '@/lib/prisma'

// Called by Vercel Cron 3× per day (see vercel.json):
//   0 23 * * *  →  08:00 KST  (morning)
//   0  3 * * *  →  12:00 KST  (noon)
//   0 10 * * *  →  19:00 KST  (evening)
//
// Sends a "your cat is HUNGRY" push to users whose cat has not been fed
// (no journal entry) for 2+ days. Escalates message urgency over days.

const SLOT_LABELS = { 23: '아침', 3: '점심', 10: '저녁' }

const MESSAGES = {
  2: (name) => ({
    title: `${name}가 슬퍼하고 있어요 😿`,
    body:  '오늘 3문장을 써서 ${name}를 달래줄 수 있어요',
  }),
  3: (name) => ({
    title: `${name}가 배가 고파요 😾`,
    body:  `${name}가 밥을 못 먹고 있어요. 일지를 쓰고 먹여주세요!`,
  }),
  4: (name) => ({
    title: `🚨 ${name}가 많이 배고파요!`,
    body:  `${name}가 ${4}일째 기다리고 있어요. 지금 바로 확인해 주세요!`,
  }),
}

export async function GET(request) {
  // Auth check
  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  webpush.setVapidDetails(
    `mailto:${process.env.VAPID_EMAIL}`,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY,
  )

  // Current UTC hour — used for slot label
  const utcHour = new Date().getUTCHours()
  const slot    = SLOT_LABELS[utcHour] ?? '알림'

  // Today's start (KST midnight → UTC)
  const nowUtc  = new Date()
  const kstNow  = new Date(nowUtc.getTime() + 9 * 3600000)
  kstNow.setUTCHours(0, 0, 0, 0)
  const todayStartUtc = new Date(kstNow.getTime() - 9 * 3600000)

  // Find push subscriptions for users whose cat is hungry (no journal 2+ days)
  const twoDaysAgoUtc = new Date(todayStartUtc.getTime() - 2 * 86400000)

  const hungrySubscriptions = await prisma.pushSubscription.findMany({
    where: {
      user: {
        cat: {
          // lastFedAt is updated on every journal write
          lastFedAt: { lt: twoDaysAgoUtc },
        },
      },
    },
    include: {
      user: {
        select: {
          id: true,
          cat: { select: { name: true, lastFedAt: true } },
        },
      },
    },
  })

  const results = await Promise.allSettled(
    hungrySubscriptions.map(async (sub) => {
      const catName = sub.user?.cat?.name ?? '고양이'
      const lastFed = sub.user?.cat?.lastFedAt
      if (!lastFed) return null

      // Days hungry
      const daysDiff = Math.floor(
        (Date.now() - new Date(lastFed).getTime()) / 86400000
      )

      // Pick message — cap at the highest defined level
      const level     = Math.min(daysDiff, 4)
      const msgFn     = MESSAGES[level] ?? MESSAGES[4]
      const { title, body } = msgFn(catName)

      const payload = JSON.stringify({
        title,
        body: body.replace(/\$\{name\}/g, catName),
        url: '/',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
      })

      return webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload,
      )
    })
  )

  const sent    = results.filter((r) => r.status === 'fulfilled' && r.value).length
  const failed  = results.filter((r) => r.status === 'rejected').length
  const skipped = results.filter((r) => r.status === 'fulfilled' && !r.value).length

  return NextResponse.json({ slot, utcHour, total: hungrySubscriptions.length, sent, failed, skipped })
}
