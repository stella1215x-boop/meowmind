import { STAGE_CONFIG, DAYS_PER_STAGE } from '@/lib/catGrowthService'

// Emoji representing each growth stage
const STAGE_EMOJI = ['🥚', '🐱', '🐈', '🐈', '🦁', '✨']

export default function StreakCounter({ currentStreak, totalDaysWritten }) {
  const currentStage = Math.min(
    STAGE_CONFIG.findIndex(s => totalDaysWritten < s.minDays + DAYS_PER_STAGE) - 1,
    5
  )
  const safeStage    = Math.max(0, currentStage)
  const daysInStage  = totalDaysWritten - safeStage * DAYS_PER_STAGE
  const daysLeft     = DAYS_PER_STAGE - daysInStage
  const pct          = Math.min(daysInStage / DAYS_PER_STAGE, 1) * 100
  const isLegendary  = totalDaysWritten >= 50  // stage 5

  const nextEmoji    = STAGE_EMOJI[Math.min(safeStage + 1, 5)]
  const curEmoji     = STAGE_EMOJI[safeStage]

  return (
    <div className="flex items-center gap-2.5">

      {/* 🔥 Streak badge */}
      <div className="flex-shrink-0 flex items-center gap-1.5
                      bg-white rounded-2xl px-3 py-2 shadow-sm border border-gray-100">
        <span className="text-lg">{currentStreak > 0 ? '🔥' : '💤'}</span>
        <div>
          <p className="text-base font-extrabold text-gray-800 leading-none">
            {currentStreak}<span className="text-xs font-semibold text-gray-500 ml-0.5">일</span>
          </p>
          <p className="text-[9px] text-gray-400 mt-0.5">연속 작성</p>
        </div>
      </div>

      {/* 🐱 Cat growth progress */}
      <div className="flex-1 bg-white rounded-2xl px-3 py-2 shadow-sm border border-gray-100">
        {isLegendary ? (
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-base">✨</span>
            <p className="text-xs font-bold text-lavender">전설의 고양이!</p>
            <span className="text-base">✨</span>
          </div>
        ) : (
          <>
            {/* Stage emoji + progress + next stage */}
            <div className="flex items-center gap-2">
              <span className="text-base flex-shrink-0">{curEmoji}</span>
              <div className="flex-1">
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-lavender to-pink-300 rounded-full
                               transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-[9px] text-gray-400 mt-0.5 text-center leading-none">
                  {daysLeft > 0
                    ? `${daysLeft}일 더 쓰면 성장해요 🌱`
                    : '오늘 쓰면 성장해요! 🎉'}
                </p>
              </div>
              <span className="text-base flex-shrink-0 opacity-50">{nextEmoji}</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
