import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// POST /api/notifications — save push subscription
export async function POST(request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { subscription } = await request.json()
  if (!subscription?.endpoint) {
    return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 })
  }

  await prisma.pushSubscription.upsert({
    where: { endpoint: subscription.endpoint },
    create: {
      userId: session.user.id,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys?.p256dh ?? '',
      auth: subscription.keys?.auth ?? '',
    },
    update: {
      p256dh: subscription.keys?.p256dh ?? '',
      auth: subscription.keys?.auth ?? '',
    },
  })

  return NextResponse.json({ ok: true })
}

// DELETE /api/notifications — remove push subscription
export async function DELETE(request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { endpoint } = await request.json()
  if (!endpoint) return NextResponse.json({ error: 'Missing endpoint' }, { status: 400 })

  await prisma.pushSubscription.deleteMany({
    where: { userId: session.user.id, endpoint },
  })

  return NextResponse.json({ ok: true })
}

// GET /api/notifications — check if current device is subscribed
export async function GET(request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ subscribed: false })

  const { searchParams } = new URL(request.url)
  const endpoint = searchParams.get('endpoint')
  if (!endpoint) return NextResponse.json({ subscribed: false })

  const sub = await prisma.pushSubscription.findUnique({ where: { endpoint } })
  return NextResponse.json({ subscribed: !!sub && sub.userId === session.user.id })
}
