import { STAGE_CONFIG, DAYS_PER_STAGE } from '@/lib/catGrowthService'

// Natural cat growth journey — clearly shows what comes next
const STAGE_EMOJI  = ['🐣', '🐱', '🐈', '😸', '🦁', '👑']
const STAGE_LABEL  = ['아기', '아기 고양이', '청소년', '성인', '현명한 고양이', '전설']

export default function StreakCounter({ currentStreak, totalDaysWritten }) {
  const currentStage = Math.min(
    Math.max(STAGE_CONFIG.findIndex(s => totalDaysWritten < s.minDays + DAYS_PER_STAGE) - 1, 0),
    5
  )
  const daysInStage = totalDaysWritten - currentStage * DAYS_PER_STAGE
  const pct         = Math.min(daysInStage / DAYS_PER_STAGE, 1) * 100
  const isLegendary = currentStage >= 5

  const curEmoji  = STAGE_EMOJI[currentStage]
  const nextEmoji = STAGE_EMOJI[Math.min(currentStage + 1, 5)]

  return (
    <div className="flex items-center gap-2.5">

      {/* 🔥 Streak badge */}
      <div className="flex-shrink-0 flex items-center gap-2
                      bg-white rounded-2xl px-3 py-2.5 shadow-sm border border-gray-100">
        <span className="text-2xl">{currentStreak > 0 ? '🔥' : '💤'}</span>
        <div>
          <p className="text-lg font-extrabold text-gray-800 leading-none">
            {currentStreak}<span className="text-sm font-semibold text-gray-500 ml-0.5">일</span>
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5 font-medium">연속 작성</p>
        </div>
      </div>

      {/* 🐱 Cat growth progress */}
      <div className="flex-1 bg-white rounded-2xl px-3 py-2.5 shadow-sm border border-gray-100">
        {isLegendary ? (
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">👑</span>
            <p className="text-sm font-bold text-lavender">전설의 고양이!</p>
            <span className="text-2xl">✨</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {/* Current stage */}
            <span className="text-2xl flex-shrink-0">{curEmoji}</span>

            {/* Progress bar only — no text */}
            <div className="flex-1">
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-lavender to-pink-300 rounded-full
                             transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {/* Next stage — dimmed arrow feel */}
            <span className="text-2xl flex-shrink-0 opacity-40">{nextEmoji}</span>
          </div>
        )}
      </div>
    </div>
  )
}
