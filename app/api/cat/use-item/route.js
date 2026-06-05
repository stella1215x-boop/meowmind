import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { getItem, normalizeInventory } from '@/lib/shopCatalog'
import { checkTierReward } from '@/lib/tierRewardService'

// POST: Use a non-food item from the pantry
// Body: { itemId: string }
// Response: { cat, intimacyGain, animationHint }
export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { itemId } = await req.json()
  const item = getItem(itemId)
  if (!item) return NextResponse.json({ error: 'Unknown item' }, { status: 400 })
  if (item.type === 'food') {
    return NextResponse.json({ error: 'Use /api/cat/feed for food items' }, { status: 400 })
  }
  if (item.type === 'permanent') {
    return NextResponse.json({ error: 'Permanent items cannot be used (they are always active)' }, { status: 400 })
  }

  const cat = await prisma.cat.findUnique({
    where: { userId: session.user.id },
  })
  if (!cat) return NextResponse.json({ error: 'No cat found' }, { status: 404 })

  const inventory = normalizeInventory(cat.inventory)
  const count = inventory[item.inventoryKey] ?? 0
  if (count <= 0) {
    return NextResponse.json({ error: 'No items left', itemId }, { status: 422 })
  }

  // Consume 1 and award intimacy
  inventory[item.inventoryKey] = count - 1
  const newIntimacy = Math.min((cat.intimacy ?? 0) + item.intimacyGain, 100)
  const tierResult  = checkTierReward(newIntimacy, cat.rewardedTier ?? 0)
  const tierBonus   = tierResult?.bonusCoins ?? 0

  const updatedCat = await prisma.cat.update({
    where: { userId: session.user.id },
    data: {
      inventory,
      intimacy: newIntimacy,
      ...(tierBonus > 0 && { coins: (cat.coins ?? 0) + tierBonus }),
      ...(tierResult    && { rewardedTier: tierResult.newRewardedTier }),
    },
  })

  return NextResponse.json({
    success:       true,
    cat:           updatedCat,
    inventory:     normalizeInventory(updatedCat.inventory),
    intimacyGain:  item.intimacyGain,
    animationHint: item.animationHint,
    tierReward:    tierResult?.reward ?? null,
  })
}
