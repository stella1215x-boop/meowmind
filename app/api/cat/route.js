import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { calcStage } from '@/lib/catGrowthService'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const cat = await prisma.cat.findUnique({
    where: { userId: session.user.id },
  })

  if (!cat) return NextResponse.json({ error: 'No cat found' }, { status: 404 })
  return NextResponse.json(cat)
}

export async function PATCH(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const updates = await req.json()

  const cat = await prisma.cat.update({
    where: { userId: session.user.id },
    data: {
      ...updates,
      stage: updates.totalDaysWritten != null ? calcStage(updates.totalDaysWritten) : undefined,
    },
  })

  return NextResponse.json(cat)
}
