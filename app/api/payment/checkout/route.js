import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { authOptions } from '@/lib/auth'
import { getPackage } from '@/lib/coinPackages'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '')

// POST /api/payment/checkout
// Body: { packageId: 'coins_80' | 'coins_250' | 'coins_600' | 'coins_1400' }
// Returns: { url } — redirect user to this Stripe Checkout URL
export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Payment not configured' }, { status: 503 })
  }

  const { packageId } = await req.json()
  const pkg = getPackage(packageId)
  if (!pkg) return NextResponse.json({ error: 'Unknown package' }, { status: 400 })

  const baseUrl = process.env.NEXTAUTH_URL ?? 'https://mochi-meowmind.vercel.app'

  const checkout = await stripe.checkout.sessions.create({
    mode:                 'payment',
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency:     'krw',
        unit_amount:  pkg.priceKRW,   // KRW is zero-decimal in Stripe
        product_data: {
          name:        `MeowMind ${pkg.label}`,
          description: pkg.description,
          images:      [`${baseUrl}/icons/icon-192x192.png`],
        },
      },
      quantity: 1,
    }],
    metadata: {
      userId:    session.user.id,
      packageId: pkg.id,
      coins:     String(pkg.coins),
    },
    customer_email:  session.user.email ?? undefined,
    success_url:     `${baseUrl}/?purchase=success&coins=${pkg.coins}`,
    cancel_url:      `${baseUrl}/?purchase=cancelled`,
    locale:          'ko',
  })

  return NextResponse.json({ url: checkout.url })
}
