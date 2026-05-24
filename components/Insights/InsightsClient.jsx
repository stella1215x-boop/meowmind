'use client'

import { useState, useEffect } from 'react'
import MoodGraph from './MoodGraph'
import WordCloud from './WordCloud'
import CalendarHeatmap from './CalendarHeatmap'

const TOP_MOOD_LABEL = { positive: '긍정적 😊', neutral: '보통 😐', negative: '힘든 날 😿' }

export default function InsightsClient() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/insights')
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col gap-3 mt-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 h-36 animate-pulse" />
        ))}
      </div>
    )
  }

  if (!data) return null

  const { moodTrend, keywords, heatmap, summary } = data

  return (
    <div className="space-y-4">
      {/* 요약 카드 */}
      {summary && (
        <div className="grid grid-cols-3 gap-2">
          <SummaryCard
            emoji="📝"
            label="총 일기"
            value={`${summary.totalDays}일`}
          />
          <SummaryCard
            emoji="😊"
            label="주요 감정"
            value={TOP_MOOD_LABEL[summary.topMood] ?? '—'}
            small
          />
          <SummaryCard
            emoji="✨"
            label="긍정 비율"
            value={`${summary.positiveRate}%`}
          />
        </div>
      )}

      {/* 무드 트렌드 */}
      <InsightCard title="주간 무드 트렌드" emoji="📈">
        <MoodGraph data={moodTrend} />
      </InsightCard>

      {/* 키워드 Top 10 */}
      <InsightCard title="자주 쓴 단어 Top 10" emoji="💬">
        <WordCloud keywords={keywords} />
      </InsightCard>

      {/* 작성 캘린더 히트맵 */}
      <InsightCard title="최근 12주 작성 현황" emoji="📅">
        <CalendarHeatmap heatmap={heatmap} />
      </InsightCard>
    </div>
  )
}

function SummaryCard({ emoji, label, value, small }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex flex-col items-center gap-1">
      <span className="text-xl">{emoji}</span>
      <span className="text-[10px] text-gray-400">{label}</span>
      <span className={`font-extrabold text-gray-700 text-center leading-tight ${small ? 'text-[11px]' : 'text-sm'}`}>
        {value}
      </span>
    </div>
  )
}

function InsightCard({ title, emoji, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-center gap-1.5 mb-3">
        <span className="text-base">{emoji}</span>
        <h3 className="text-sm font-extrabold text-gray-700">{title}</h3>
      </div>
      {children}
    </div>
  )
}
