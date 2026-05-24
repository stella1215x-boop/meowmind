'use client'

// Pure SVG line chart — no external chart library

const W = 300
const H = 120
const PAD = { top: 10, right: 8, bottom: 24, left: 28 }
const INNER_W = W - PAD.left - PAD.right
const INNER_H = H - PAD.top - PAD.bottom

const COLORS = { positive: '#A8E6CF', neutral: '#C3B1E1', negative: '#FCA5A5' }
const LABELS = { positive: '긍정적', neutral: '보통', negative: '힘들었어' }

export default function MoodGraph({ data }) {
  if (!data || data.length < 2) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-300 text-sm">
        데이터가 더 쌓이면 트렌드가 보여요 📈
      </div>
    )
  }

  const xStep = INNER_W / (data.length - 1)

  function points(key) {
    return data.map((d, i) => {
      const x = PAD.left + i * xStep
      const y = PAD.top + INNER_H - (d[key] / 100) * INNER_H
      return `${x},${y}`
    }).join(' ')
  }

  function polyline(key) {
    return points(key)
  }

  // x-axis labels: show first, middle, last week
  const labelIndices = [0, Math.floor(data.length / 2), data.length - 1]

  return (
    <div>
      {/* 범례 */}
      <div className="flex items-center gap-3 mb-2 justify-end px-1">
        {Object.entries(COLORS).map(([key, color]) => (
          <div key={key} className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: color }} />
            <span className="text-[10px] text-gray-400">{LABELS[key]}</span>
          </div>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
        {/* y-axis guides */}
        {[0, 50, 100].map((v) => {
          const y = PAD.top + INNER_H - (v / 100) * INNER_H
          return (
            <g key={v}>
              <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="#f3f4f6" strokeWidth="1" />
              <text x={PAD.left - 4} y={y + 3.5} textAnchor="end" fontSize="8" fill="#9ca3af">{v}%</text>
            </g>
          )
        })}

        {/* Lines */}
        {['positive', 'neutral', 'negative'].map((key) => (
          <polyline
            key={key}
            points={polyline(key)}
            fill="none"
            stroke={COLORS[key]}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}

        {/* Dots for positive line */}
        {data.map((d, i) => {
          const x = PAD.left + i * xStep
          const y = PAD.top + INNER_H - (d.positiveRate / 100) * INNER_H
          return <circle key={i} cx={x} cy={y} r="2.5" fill={COLORS.positive} />
        })}

        {/* x-axis labels */}
        {labelIndices.map((i) => {
          const x = PAD.left + i * xStep
          const label = data[i]?.week?.slice(5) ?? '' // MM-DD
          return (
            <text key={i} x={x} y={H - 4} textAnchor="middle" fontSize="8" fill="#9ca3af">
              {label}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
