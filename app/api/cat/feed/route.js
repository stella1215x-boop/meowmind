import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// POST: 고양이에게 밥 주기 (foodCount > 0 필요)
export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const cat = await prisma.cat.findUnique({
    where: { userId: session.user.id },
    select: { foodCount: true, name: true },
  })
  if (!cat) return NextResponse.json({ error: 'No cat found' }, { status: 404 })
  if (cat.foodCount <= 0) {
    return NextResponse.json({ error: 'No food available', foodCount: 0 }, { status: 422 })
  }

  const updatedCat = await prisma.cat.update({
    where: { userId: session.user.id },
    data: { foodCount: cat.foodCount - 1 },
  })

  return NextResponse.json({
    success: true,
    foodCount: updatedCat.foodCount,
    cat: updatedCat,
  })
}
