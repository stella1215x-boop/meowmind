import { NextResponse } from 'next/server'

const VALID_EVENTS = new Set([
  'onboarding_completed',
  'journal_entry_submitted',
  'cat_animation_viewed',
  'streak_milestone_reached',
  'premium_upgrade_tapped',
  'app_opened',
])

export async function POST(req) {
  try {
    const body = await req.json()
    const { event, properties = {}, userId } = body

    if (!event || !VALID_EVENTS.has(event)) {
      return NextResponse.json({ error: 'Invalid event' }, { status: 400 })
    }

    const payload = {
      event,
      userId: userId ?? 'anonymous',
      properties,
      timestamp: new Date().toISOString(),
    }

    // 개발 환경에서는 콘솔 로그
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', JSON.stringify(payload))
    }

    // TODO: 프로덕션에서 외부 애널리틱스 서비스(Amplitude, Mixpanel 등)로 전송
    // await sendToAmplitude(payload)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
