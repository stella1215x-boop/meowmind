import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { getItem, normalizeInventory } from '@/lib/shopCatalog'

// POST: 아이템 구매 (food → foodCount, others → inventory JSON)
export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { itemId } = await req.json()
  const item = getItem(itemId)
  if (!item) return NextResponse.json({ error: 'Unknown item' }, { status: 400 })

  const cat = await prisma.cat.findUnique({
    where: { userId: session.user.id },
    select: { coins: true, foodCount: true, inventory: true },
  })
  if (!cat) return NextResponse.json({ error: 'No cat found' }, { status: 404 })
  if (cat.coins < item.cost) {
    return NextResponse.json({ error: 'Not enough coins', required: item.cost, have: cat.coins }, { status: 422 })
  }

  const inventory = normalizeInventory(cat.inventory)

  // Permanent items (cushion, house) can only be bought once
  if (item.type === 'permanent' && inventory[item.inventoryKey] >= 1) {
    return NextResponse.json({ error: 'Already owned', itemId }, { status: 422 })
  }

  // Build update payload
  const updateData = { coins: cat.coins - item.cost }

  if (item.type === 'food') {
    updateData.foodCount = cat.foodCount + item.qty
  } else {
    inventory[item.inventoryKey] = (inventory[item.inventoryKey] ?? 0) + item.qty
    updateData.inventory = inventory
  }

  const updatedCat = await prisma.cat.update({
    where: { userId: session.user.id },
    data: updateData,
  })

  return NextResponse.json({
    success:   true,
    item,
    cat:       updatedCat,
    coins:     updatedCat.coins,
    foodCount: updatedCat.foodCount,
    inventory: normalizeInventory(updatedCat.inventory),
  })
}
