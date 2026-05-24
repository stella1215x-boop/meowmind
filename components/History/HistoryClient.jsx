'use client'

import { useState, useEffect, useRef } from 'react'
import CalendarView from './CalendarView'
import EntryCard from './EntryCard'

export default function HistoryClient({ entries }) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [selectedDay, setSelectedDay] = useState(null)
  const [highlightId, setHighlightId] = useState(null)
  const highlightTimer = useRef(null)

  // entryMap for CalendarView: { 'YYYY-MM-DD': { id, mood } }
  const entryMap = {}
  for (const e of entries) {
    const key = e.createdAt.slice(0, 10)
    entryMap[key] = { id: e.id, mood: e.mood }
  }

  // entries for current month only
  const monthEntries = entries.filter((e) => {
    const d = new Date(e.createdAt)
    return d.getFullYear() === year && d.getMonth() + 1 === month
  })

  function prevMonth() {
    if (month === 1) { setYear(y => y - 1); setMonth(12) }
    else setMonth(m => m - 1)
    setSelectedDay(null)
  }

  function nextMonth() {
    const now = new Date()
    if (year === now.getFullYear() && month === now.getMonth() + 1) return
    if (month === 12) { setYear(y => y + 1); setMonth(1) }
    else setMonth(m => m + 1)
    setSelectedDay(null)
  }

  function handleSelectDay(day) {
    setSelectedDay(day)
    const key = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const entry = entryMap[key]
    if (!entry) return

    setHighlightId(entry.id)
    clearTimeout(highlightTimer.current)
    highlightTimer.current = setTimeout(() => setHighlightId(null), 1800)

    // scroll to entry
    setTimeout(() => {
      document.getElementById(`entry-${entry.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 50)
  }

  useEffect(() => () => clearTimeout(highlightTimer.current), [])

  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth() + 1

  return (
    <div className="mobile-container flex flex-col bg-cream">
      <div className="safe-top" />

      <div className="flex-1 scroll-area pb-24 px-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between pt-5 pb-4">
          <h1 className="text-xl font-extrabold text-gray-700">일기 기록</h1>
          <span className="text-xs text-gray-400 font-medium">{entries.length}개의 일기</span>
        </div>

        {/* 월 네비게이션 */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={prevMonth}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 text-gray-500 active:scale-95 transition-transform"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <span className="text-base font-extrabold text-gray-700">
            {year}년 {month}월
          </span>

          <button
            onClick={nextMonth}
            disabled={isCurrentMonth}
            className={`w-8 h-8 flex items-center justify-center rounded-full border transition-transform active:scale-95
              ${isCurrentMonth ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-default' : 'bg-white shadow-sm border-gray-100 text-gray-500'}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* 캘린더 */}
        <CalendarView
          year={year}
          month={month}
          entryMap={entryMap}
          selectedDay={selectedDay}
          onSelectDay={handleSelectDay}
        />

        {/* 이번 달 일기 목록 */}
        <div className="mt-5 space-y-3">
          {monthEntries.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <div className="text-4xl mb-3">😿</div>
              <p className="text-sm text-gray-400">{month}월에 작성한 일기가 없어요</p>
              <p className="text-xs text-gray-300 mt-1">오늘부터 시작해 볼까요?</p>
            </div>
          ) : (
            monthEntries
              .slice()
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((entry) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  highlight={highlightId === entry.id}
                />
              ))
          )}
        </div>
      </div>
    </div>
  )
}
