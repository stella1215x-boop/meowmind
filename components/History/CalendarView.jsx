'use client'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

const MOOD_DOT = {
  positive: 'bg-mint-dark',
  neutral:  'bg-lavender',
  negative: 'bg-orange-300',
}

export default function CalendarView({ year, month, entryMap, selectedDay, onSelectDay }) {
  // entryMap: { 'YYYY-MM-DD': { id, mood } }
  const firstDay = new Date(year, month - 1, 1).getDay() // 0=일
  const daysInMonth = new Date(year, month, 0).getDate()
  const today = new Date()
  const todayKey = toKey(today)

  const cells = []
  // 빈 셀 (첫 주 앞)
  for (let i = 0; i < firstDay; i++) cells.push(null)
  // 날짜 셀
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((w, i) => (
          <div key={w} className={`text-center text-[11px] font-bold py-1
            ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'}`}>
            {w}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} />

          const key = toKey(new Date(year, month - 1, day))
          const entry = entryMap[key]
          const isToday = key === todayKey
          const isSelected = day === selectedDay
          const weekday = (firstDay + day - 1) % 7

          return (
            <button
              key={day}
              onClick={() => entry && onSelectDay(day)}
              className={`flex flex-col items-center py-1 rounded-xl transition-all
                ${isSelected ? 'bg-lavender/20 scale-105' : ''}
                ${entry ? 'cursor-pointer' : 'cursor-default opacity-50'}`}
            >
              <span className={`text-xs font-semibold w-7 h-7 flex items-center justify-center rounded-full
                ${isToday ? 'bg-lavender text-white' : weekday === 0 ? 'text-red-400' : weekday === 6 ? 'text-blue-400' : 'text-gray-600'}
              `}>
                {day}
              </span>
              {/* 무드 점 */}
              {entry ? (
                <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${MOOD_DOT[entry.mood] ?? 'bg-gray-300'}`} />
              ) : (
                <span className="w-1.5 h-1.5 mt-0.5" />
              )}
            </button>
          )
        })}
      </div>

      {/* 범례 */}
      <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-gray-50">
        {[
          { key: 'positive', label: '긍정적' },
          { key: 'neutral',  label: '보통' },
          { key: 'negative', label: '힘들었어' },
        ].map(({ key, label }) => (
          <div key={key} className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${MOOD_DOT[key]}`} />
            <span className="text-[10px] text-gray-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function toKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
