'use client'

// Last 12 weeks heatmap (Mon–Sun columns)

const MOOD_COLOR = {
  positive: 'bg-mint-dark',
  neutral:  'bg-lavender/60',
  negative: 'bg-orange-300',
  none:     'bg-gray-100',
}

const WEEKDAY_LABELS = ['월', '화', '수', '목', '금', '토', '일']

export default function CalendarHeatmap({ heatmap }) {
  const weeks = buildWeeks(12)

  return (
    <div>
      {/* 요일 헤더 */}
      <div className="flex gap-1 mb-1 pl-0">
        <div className="w-4 flex-shrink-0" /> {/* spacer for week labels */}
        {WEEKDAY_LABELS.map((d) => (
          <div key={d} className="flex-1 text-center text-[9px] text-gray-300 font-semibold">{d}</div>
        ))}
      </div>

      <div className="space-y-1">
        {weeks.map(({ label, days }) => (
          <div key={label} className="flex items-center gap-1">
            {/* 주 라벨 (월/일) */}
            <div className="w-4 flex-shrink-0 text-[8px] text-gray-300 text-right">{label}</div>
            {days.map(({ key, isFuture }) => {
              const mood = heatmap?.[key]
              const color = isFuture ? '' : mood ? MOOD_COLOR[mood] : MOOD_COLOR.none
              return (
                <div
                  key={key}
                  title={key}
                  className={`flex-1 aspect-square rounded-sm ${isFuture ? 'opacity-0' : color}`}
                />
              )
            })}
          </div>
        ))}
      </div>

      {/* 범례 */}
      <div className="flex items-center justify-end gap-3 mt-2">
        {[
          { key: 'positive', label: '긍정' },
          { key: 'neutral',  label: '보통' },
          { key: 'negative', label: '힘든 날' },
          { key: 'none',     label: '미작성' },
        ].map(({ key, label }) => (
          <div key={key} className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-sm ${MOOD_COLOR[key]}`} />
            <span className="text-[9px] text-gray-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function buildWeeks(numWeeks) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Find this Monday
  const todayDay = today.getDay()
  const thisMonday = new Date(today)
  thisMonday.setDate(today.getDate() - (todayDay === 0 ? 6 : todayDay - 1))

  const weeks = []
  for (let w = numWeeks - 1; w >= 0; w--) {
    const monday = new Date(thisMonday)
    monday.setDate(thisMonday.getDate() - w * 7)

    const days = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(monday)
      date.setDate(monday.getDate() + d)
      const key = toKey(date)
      days.push({ key, isFuture: date > today })
    }

    const label = `${String(monday.getMonth() + 1).padStart(2, '0')}/${String(monday.getDate()).padStart(2, '0')}`
    weeks.push({ label, days })
  }
  return weeks
}

function toKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
