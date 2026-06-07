import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { checkTierReward } from '@/lib/tierRewardService'

// Intimacy actions: pet · talk · brush
// Each gives 2–3 coins + 2 intimacy, once per action per day
const ACTION_CONFIG = {
  pet:   { coins: 3, intimacy: 2, label: '쓰다듬기' },
  talk:  { coins: 2, intimacy: 2, label: '대화하기' },
  brush: { coins: 3, intimacy: 3, label: '빗질하기' },
}

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { action } = await req.json()
  const config = ACTION_CONFIG[action]
  if (!config) return NextResponse.json({ error: 'Unknown action' }, { status: 400 })

  const cat = await prisma.cat.findUnique({ where: { userId: session.user.id } })
  if (!cat) return NextResponse.json({ error: 'No cat found' }, { status: 404 })

  const newIntimacy = Math.min((cat.intimacy ?? 0) + config.intimacy, 100)
  const newCoins    = (cat.coins ?? 0) + config.coins

  const tierResult  = checkTierReward(newIntimacy, cat.rewardedTier ?? 0)
  const tierBonus   = tierResult?.bonusCoins ?? 0

  const updatedCat = await prisma.cat.update({
    where: { userId: session.user.id },
    data: {
      coins:    newCoins + tierBonus,
      intimacy: newIntimacy,
      ...(tierResult && { rewardedTier: tierResult.newRewardedTier }),
    },
  })

  return NextResponse.json({
    success:    true,
    cat:        updatedCat,
    coinsGained: config.coins + tierBonus,
    tierReward: tierResult?.reward ?? null,
  })
}
