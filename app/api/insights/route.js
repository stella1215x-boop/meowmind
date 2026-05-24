import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { extractKeywords } from '@/lib/insightsService'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const entries = await prisma.journalEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'asc' },
    select: { createdAt: true, mood: true, content: true },
  })

  if (entries.length === 0) {
    return NextResponse.json({ moodTrend: [], keywords: [], heatmap: {}, summary: null })
  }

  // --- Mood trend: weekly buckets ---
  const weekBuckets = {}
  for (const e of entries) {
    const d = new Date(e.createdAt)
    // Monday of the week
    const day = d.getDay()
    const monday = new Date(d)
    monday.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
    const key = monday.toISOString().slice(0, 10)
    if (!weekBuckets[key]) weekBuckets[key] = { positive: 0, neutral: 0, negative: 0, total: 0 }
    weekBuckets[key][e.mood]++
    weekBuckets[key].total++
  }

  const moodTrend = Object.entries(weekBuckets)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12) // last 12 weeks
    .map(([week, counts]) => ({
      week,
      positiveRate: Math.round((counts.positive / counts.total) * 100),
      neutralRate:  Math.round((counts.neutral  / counts.total) * 100),
      negativeRate: Math.round((counts.negative / counts.total) * 100),
      total: counts.total,
    }))

  // --- Keywords ---
  let keywords = []
  try {
    keywords = extractKeywords(entries)
  } catch { /* ignore parse errors */ }

  // --- Heatmap: daily entry presence { 'YYYY-MM-DD': mood } ---
  const heatmap = {}
  for (const e of entries) {
    const key = new Date(e.createdAt).toISOString().slice(0, 10)
    heatmap[key] = e.mood
  }

  // --- Summary stats ---
  const moodCounts = entries.reduce((acc, e) => {
    acc[e.mood] = (acc[e.mood] || 0) + 1
    return acc
  }, {})
  const topMood = Object.entries(moodCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ?? 'neutral'
  const totalDays = entries.length
  const positiveRate = Math.round(((moodCounts.positive ?? 0) / totalDays) * 100)

  return NextResponse.json({ moodTrend, keywords, heatmap, summary: { totalDays, topMood, positiveRate } })
}
