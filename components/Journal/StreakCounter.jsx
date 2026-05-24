import { getNextMilestone } from '@/lib/catGrowthService'

export default function StreakCounter({ currentStreak, totalDaysWritten }) {
  const next = getNextMilestone(totalDaysWritten)
  const progress = next ? Math.round((totalDaysWritten / next) * 100) : 100

  return (
    <div className="flex items-center gap-3">
      {/* 스트릭 배지 */}
      <div className="flex items-center gap-1.5 bg-white rounded-2xl px-4 py-2 shadow-sm border border-gray-100">
        <span className="text-xl">{currentStreak > 0 ? '🔥' : '💤'}</span>
        <div>
          <p className="text-lg font-extrabold text-gray-700 leading-none">{currentStreak}일</p>
          <p className="text-[10px] text-gray-400 leading-none mt-0.5">연속 작성</p>
        </div>
      </div>

      {/* 다음 마일스톤 진행률 */}
      {next && (
        <div className="flex-1 bg-white rounded-2xl px-4 py-2 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-1.5">
            <p className="text-[11px] text-gray-400 font-medium">다음 목표</p>
            <p className="text-[11px] font-bold text-lavender">{totalDaysWritten} / {next}일 🎯</p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-lavender h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {!next && (
        <div className="flex-1 bg-white rounded-2xl px-4 py-2 shadow-sm border border-gray-100 text-center">
          <p className="text-xs font-bold text-lavender">🏆 전설 달성!</p>
          <p className="text-[10px] text-gray-400">{totalDaysWritten}일 작성</p>
        </div>
      )}
    </div>
  )
}
