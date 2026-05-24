import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import BottomNav from '@/components/shared/BottomNav'
import InsightsClient from '@/components/Insights/InsightsClient'
import prisma from '@/lib/prisma'

export const metadata = { title: '인사이트 — MeowMind' }

export default async function InsightsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const cat = await prisma.cat.findUnique({
    where: { userId: session.user.id },
    select: { totalDaysWritten: true, name: true },
  })

  const totalDays = cat?.totalDaysWritten ?? 0
  const unlocked = totalDays >= 30

  return (
    <>
      <div className="mobile-container flex flex-col bg-cream">
        <div className="safe-top" />
        <div className="flex-1 scroll-area pb-24 px-4">
          <div className="pt-5 pb-4">
            <h1 className="text-xl font-extrabold text-gray-700">인사이트</h1>
          </div>

          {unlocked ? (
            <InsightsClient />
          ) : (
            <LockedInsights totalDays={totalDays} catName={cat?.name} />
          )}
        </div>
      </div>
      <BottomNav totalDaysWritten={totalDays} />
    </>
  )
}

function LockedInsights({ totalDays, catName }) {
  const remaining = 30 - totalDays
  const progress = Math.min((totalDays / 30) * 100, 100)

  return (
    <div className="flex flex-col items-center text-center py-8 space-y-5">
      <div className="w-20 h-20 rounded-full bg-lavender/10 flex items-center justify-center">
        <span className="text-4xl">🔒</span>
      </div>

      <div>
        <h2 className="text-lg font-extrabold text-gray-700">30일 달성 후 해금!</h2>
        <p className="text-sm text-gray-400 mt-1 leading-relaxed">
          {catName}와 함께 {remaining}일 더 쓰면<br />나만의 감사 인사이트를 볼 수 있어요
        </p>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
        <div
          className="h-3 rounded-full bg-lavender transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 -mt-2">{totalDays} / 30일</p>

      {/* 블러 처리된 미리보기 */}
      <div className="w-full space-y-2 mt-2 relative">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 blur-sm select-none pointer-events-none">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
          <div className="h-24 bg-gray-100 rounded-xl" />
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 blur-sm select-none pointer-events-none">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
          <div className="space-y-2">
            {[80, 60, 45, 30].map((w) => (
              <div key={w} className="flex items-center gap-2">
                <div className="h-3 bg-lavender/20 rounded-full" style={{ width: `${w}%` }} />
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl">🔒</span>
        </div>
      </div>
    </div>
  )
}
