'use client'

// Top 10 keywords as a visual bar + word list (no canvas needed)

const BG_COLORS = [
  'bg-lavender/30 text-purple-700',
  'bg-mint/30 text-green-700',
  'bg-orange-100 text-orange-600',
  'bg-blue-100 text-blue-600',
  'bg-yellow-100 text-yellow-600',
  'bg-pink-100 text-pink-600',
  'bg-teal-100 text-teal-600',
  'bg-indigo-100 text-indigo-600',
  'bg-rose-100 text-rose-600',
  'bg-lime-100 text-lime-600',
]

export default function WordCloud({ keywords }) {
  if (!keywords || keywords.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 text-gray-300 text-sm">
        아직 분석할 일기가 부족해요 🔍
      </div>
    )
  }

  const maxCount = keywords[0]?.count ?? 1

  return (
    <div className="space-y-2">
      {keywords.slice(0, 10).map(({ word, count }, i) => (
        <div key={word} className="flex items-center gap-2">
          {/* 순위 */}
          <span className="w-5 text-[11px] font-bold text-gray-300 text-right flex-shrink-0">{i + 1}</span>
          {/* 단어 뱃지 */}
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${BG_COLORS[i % BG_COLORS.length]}`}>
            {word}
          </span>
          {/* 바 */}
          <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-1.5 rounded-full bg-lavender/60 transition-all duration-500"
              style={{ width: `${(count / maxCount) * 100}%` }}
            />
          </div>
          {/* 횟수 */}
          <span className="text-[10px] text-gray-300 flex-shrink-0 w-6 text-right">{count}</span>
        </div>
      ))}
    </div>
  )
}
