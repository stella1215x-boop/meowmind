import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// 상점 아이템 목록
export const SHOP_ITEMS = {
  snack: { id: 'snack', name: '고양이 간식 🐟', cost: 30, quantity: 1, desc: '한 번 먹일 수 있어요' },
  meal:  { id: 'meal',  name: '고양이 밥 🍱',   cost: 80, quantity: 3, desc: '3번 먹일 수 있어요 (30% 절약!)' },
}

// GET: 상점 아이템 목록 + 현재 코인/음식 잔고
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const cat = await prisma.cat.findUnique({
    where: { userId: session.user.id },
    select: { coins: true, foodCount: true },
  })

  return NextResponse.json({
    items: Object.values(SHOP_ITEMS),
    coins: cat?.coins ?? 0,
    foodCount: cat?.foodCount ?? 0,
  })
}

// POST: 아이템 구매
export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { itemId } = await req.json()
  const item = SHOP_ITEMS[itemId]
  if (!item) return NextResponse.json({ error: 'Unknown item' }, { status: 400 })

  const cat = await prisma.cat.findUnique({
    where: { userId: session.user.id },
    select: { coins: true, foodCount: true },
  })
  if (!cat) return NextResponse.json({ error: 'No cat found' }, { status: 404 })
  if (cat.coins < item.cost) {
    return NextResponse.json({ error: 'Not enough coins', required: item.cost, have: cat.coins }, { status: 422 })
  }

  const updatedCat = await prisma.cat.update({
    where: { userId: session.user.id },
    data: {
      coins:     cat.coins - item.cost,
      foodCount: cat.foodCount + item.quantity,
    },
    select: { coins: true, foodCount: true },
  })

  return NextResponse.json({
    success: true,
    item,
    coins:     updatedCat.coins,
    foodCount: updatedCat.foodCount,
  })
}
