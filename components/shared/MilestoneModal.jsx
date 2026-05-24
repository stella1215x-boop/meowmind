'use client'

import { useEffect, useState, useRef } from 'react'
import { calcStage } from '@/lib/catGrowthService'
import CatCharacter from '@/components/Cat/CatCharacter'

const MILESTONE_CONFIG = {
  7:   { emoji: '🌱', title: '7일 달성!',    subtitle: '일주일을 함께했어요',          bg: 'from-mint/30 to-white',     catAnim: '자라는 중이에요' },
  14:  { emoji: '🌿', title: '14일 달성!',   subtitle: '2주 연속! 대단해요',           bg: 'from-green-100 to-white',   catAnim: '무럭무럭 자랐어요' },
  30:  { emoji: '🌳', title: '30일 달성!',   subtitle: '한 달! 인사이트 잠금 해제!',    bg: 'from-lavender/30 to-white', catAnim: '어른이 됐어요 🎉' },
  60:  { emoji: '⭐', title: '60일 달성!',   subtitle: '두 달 연속, 정말 놀라워요',     bg: 'from-yellow-100 to-white',  catAnim: '현명해졌어요' },
  100: { emoji: '🏆', title: '100일 달성!',  subtitle: '전설의 100일! 당신은 전설!',   bg: 'from-amber-100 to-white',   catAnim: '전설이 됐어요 👑' },
}

const CONFETTI_COLORS = ['#C3B1E1', '#A8E6CF', '#FFD93D', '#FF6B6B', '#74C0FC']
const CONFETTI_COUNT = 18

export default function MilestoneModal({ milestone, catName, catColor, catStage, onClose }) {
  const [visible, setVisible] = useState(false)
  const [confetti, setConfetti] = useState([])
  const timerRef = useRef(null)

  useEffect(() => {
    if (!milestone) return
    setVisible(true)
    // 폭죽 파티클 생성
    setConfetti(
      Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
        id: i,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        left: `${5 + (i / CONFETTI_COUNT) * 90}%`,
        delay: `${(i * 0.07).toFixed(2)}s`,
        size: 6 + (i % 4) * 3,
        rotate: i * 37,
      }))
    )
    const timer = timerRef.current
    return () => clearTimeout(timer)
  }, [milestone])

  if (!visible || !milestone) return null
  const config = MILESTONE_CONFIG[milestone]
  if (!config) return null

  // 마일스톤 달성 시 고양이 스테이지 (totalDaysWritten = milestone)
  const displayStage = catStage ?? calcStage(milestone)

  function handleClose() {
    setVisible(false)
    onClose?.()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/40 backdrop-blur-sm"
      onClick={handleClose}
    >
      {/* 폭죽 파티클 */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {confetti.map((c) => (
          <div
            key={c.id}
            className="absolute animate-confetti-fall"
            style={{
              left: c.left,
              top: '-10px',
              width: c.size,
              height: c.size,
              backgroundColor: c.color,
              borderRadius: c.id % 3 === 0 ? '50%' : '2px',
              transform: `rotate(${c.rotate}deg)`,
              animationDelay: c.delay,
            }}
          />
        ))}
      </div>

      {/* 모달 카드 */}
      <div
        className={`w-full max-w-sm rounded-3xl p-7 text-center shadow-2xl bg-gradient-to-b ${config.bg} animate-milestone-pop`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 이모지 헤더 */}
        <div className="text-5xl mb-1 animate-bounce inline-block">{config.emoji}</div>
        <h2 className="text-2xl font-extrabold text-gray-700 mt-1">{config.title}</h2>
        <p className="text-gray-500 text-sm mt-1">{config.subtitle}</p>

        {/* 고양이 + 말풍선 */}
        <div className="my-4 flex flex-col items-center gap-2">
          <CatCharacter
            cat={{ stage: displayStage, color: catColor ?? 'orange', name: catName }}
            emotionalState="happy"
          />
          <div className="bg-white rounded-2xl rounded-tl-none px-4 py-2.5 shadow-sm border border-gray-100">
            <p className="text-sm font-extrabold text-lavender">{catName} 🐱</p>
            <p className="text-xs text-gray-500 mt-0.5">{config.catAnim}</p>
          </div>
        </div>

        {/* 숫자 강조 */}
        <div className="bg-white/80 rounded-2xl px-4 py-3 mb-5 shadow-sm">
          <p className="text-5xl font-extrabold text-lavender leading-none">{milestone}</p>
          <p className="text-xs text-gray-400 mt-1 font-semibold">일 연속 감사 일기 ✨</p>
        </div>

        <button
          onClick={handleClose}
          className="w-full bg-lavender text-white rounded-2xl py-3.5 font-bold text-base hover:opacity-90 active:scale-95 transition-all shadow-md"
        >
          계속하기 🐾
        </button>
        <p className="text-xs text-gray-400 mt-3">화면을 탭해도 닫힙니다</p>
      </div>
    </div>
  )
}
