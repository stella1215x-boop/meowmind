import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  const Stripe = require('stripe')
  return new Stripe(key)
}

export async function POST(req) {
  const stripe = getStripe()
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })
  }

  const body      = await req.text()
  const signature = req.headers.get('stripe-signature') ?? ''

  let event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET ?? '')
  } catch (err) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 })
  }

  // Only handle successful payments
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const { userId, coins } = session.metadata ?? {}

    if (!userId || !coins) {
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
    }

    const coinsToAdd = parseInt(coins, 10)
    if (isNaN(coinsToAdd) || coinsToAdd <= 0) {
      return NextResponse.json({ error: 'Invalid coins' }, { status: 400 })
    }

    // Add coins to cat
    await prisma.cat.update({
      where: { userId },
      data:  { coins: { increment: coinsToAdd } },
    })

    // Log the purchase event
    void fetch(`${process.env.NEXTAUTH_URL}/api/events`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ userId, event: 'coin_purchase', properties: { coins: coinsToAdd } }),
    }).catch(() => {})
  }

  return NextResponse.json({ received: true })
}
