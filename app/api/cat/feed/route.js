import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// POST: Feed the cat (requires foodCount > 0)
// Awards +8 intimacy (capped at 100) on each feeding
export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const cat = await prisma.cat.findUnique({
    where: { userId: session.user.id },
  })
  if (!cat) return NextResponse.json({ error: 'No cat found' }, { status: 404 })
  if (cat.foodCount <= 0) {
    return NextResponse.json({ error: 'No food available', foodCount: 0 }, { status: 422 })
  }

  const newIntimacy = Math.min((cat.intimacy ?? 0) + 8, 100)

  const updatedCat = await prisma.cat.update({
    where: { userId: session.user.id },
    data: {
      foodCount: cat.foodCount - 1,
      intimacy: newIntimacy,
    },
  })

  return NextResponse.json({
    success: true,
    foodCount: updatedCat.foodCount,
    intimacy: updatedCat.intimacy,
    cat: updatedCat,
  })
}
