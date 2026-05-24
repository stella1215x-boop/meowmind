'use client'

import { useState } from 'react'

const MOOD_CONFIG = {
  positive: { label: '긍정적',  bg: 'bg-mint/20',      text: 'text-green-700',  dot: 'bg-mint-dark' },
  neutral:  { label: '보통',    bg: 'bg-gray-100',     text: 'text-gray-600',   dot: 'bg-gray-400' },
  negative: { label: '힘들었어', bg: 'bg-orange-50',   text: 'text-orange-600', dot: 'bg-orange-400' },
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return {
    month:    d.getMonth() + 1,
    day:      d.getDate(),
    weekday:  days[d.getDay()],
    full:     `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`,
  }
}

export default function EntryCard({ entry, highlight = false }) {
  const [expanded, setExpanded] = useState(false)
  const mood = MOOD_CONFIG[entry.mood] ?? MOOD_CONFIG.neutral
  const date = formatDate(entry.createdAt)

  let sentences = []
  try {
    sentences = JSON.parse(entry.content)
  } catch {
    sentences = [entry.content]
  }

  return (
    <div
      id={`entry-${entry.id}`}
      className={`bg-white rounded-2xl shadow-sm border transition-all duration-200 overflow-hidden
        ${highlight ? 'border-lavender shadow-md scale-[1.01]' : 'border-gray-100'}`}
    >
      {/* 헤더 */}
      <button
        className="w-full flex items-center justify-between px-4 py-3.5 text-left"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-3">
          {/* 날짜 뱃지 */}
          <div className="flex flex-col items-center bg-lavender/10 rounded-xl px-2.5 py-1.5 min-w-[44px]">
            <span className="text-[10px] text-lavender font-bold">{date.month}월</span>
            <span className="text-lg font-extrabold text-gray-700 leading-none">{date.day}</span>
            <span className="text-[10px] text-gray-400">{date.weekday}요일</span>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className={`w-2 h-2 rounded-full ${mood.dot}`} />
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${mood.bg} ${mood.text}`}>
                {mood.label}
              </span>
            </div>
            {/* 첫 문장 미리보기 */}
            {!expanded && (
              <p className="text-sm text-gray-500 line-clamp-1 max-w-[200px]">
                {sentences[0]}
              </p>
            )}
          </div>
        </div>

        {/* 펼치기 아이콘 */}
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          className={`flex-shrink-0 text-gray-300 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* 펼쳐진 3문장 */}
      {expanded && (
        <div className="px-4 pb-4 space-y-2 border-t border-gray-50 pt-3">
          {sentences.map((s, i) => (
            <div key={i} className="flex gap-2.5">
              <span className="w-5 h-5 rounded-full bg-lavender/20 text-lavender text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-gray-600 leading-relaxed flex-1">{s}</p>
            </div>
          ))}
          <p className="text-right text-[10px] text-gray-300 mt-1">{date.full}</p>
        </div>
      )}
    </div>
  )
}
