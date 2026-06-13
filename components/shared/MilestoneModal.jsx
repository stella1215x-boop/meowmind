'use client'

import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { useLanguage } from '@/components/shared/LanguageProvider'
import { calcStage } from '@/lib/catGrowthService'
import CatSvg from '@/components/Cat/CatSvg'

const CatRiveCharacter = dynamic(
  () => import('@/components/Cat/CatRiveCharacter'),
  { ssr: false, loading: () => <CatSvg stage={0} color="orange" mood="happy" size={108} /> }
)

const MILESTONE_BG = {
  7:   'from-mint/30 to-white',
  14:  'from-green-100 to-white',
  30:  'from-lavender/30 to-white',
  60:  'from-yellow-100 to-white',
  100: 'from-amber-100 to-white',
}

const CONFETTI_COLORS = ['#C3B1E1', '#A8E6CF', '#FFD93D', '#FF6B6B', '#74C0FC']
const CONFETTI_COUNT = 18

export default function MilestoneModal({ milestone, catName, catColor, catStage, onClose }) {
  const { t } = useLanguage()
  const [visible, setVisible] = useState(false)
  const [confetti, setConfetti] = useState([])
  const timerRef = useRef(null)

  useEffect(() => {
    if (!milestone) return
    setVisible(true)
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
  const config = (t.milestones ?? {})[milestone]
  if (!config) return null

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

      <div
        className={`w-full max-w-sm rounded-3xl p-7 text-center shadow-2xl bg-gradient-to-b ${MILESTONE_BG[milestone] ?? 'from-lavender/30 to-white'} animate-milestone-pop`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-5xl mb-1 animate-bounce inline-block">{config.emoji}</div>
        <h2 className="text-2xl font-extrabold text-gray-700 mt-1">{config.title}</h2>
        <p className="text-gray-500 text-sm mt-1">{config.subtitle}</p>

        <div className="my-4 flex flex-col items-center gap-2">
          <CatRiveCharacter
            cat={{ stage: displayStage, color: catColor ?? 'orange', name: catName }}
            emotionalState="happy"
            playAnimation="purr"
          />
          <div className="bg-white rounded-2xl rounded-tl-none px-4 py-2.5 shadow-sm border border-gray-100">
            <p className="text-sm font-extrabold text-lavender">{catName} 🐱</p>
            <p className="text-xs text-gray-500 mt-0.5">{config.catAnim}</p>
          </div>
        </div>

        <div className="bg-white/80 rounded-2xl px-4 py-3 mb-5 shadow-sm">
          <p className="text-5xl font-extrabold text-lavender leading-none">{milestone}</p>
          <p className="text-xs text-gray-400 mt-1 font-semibold">{t.modal.streakDays(milestone)}</p>
        </div>

        <button
          onClick={handleClose}
          className="w-full bg-lavender text-white rounded-2xl py-3.5 font-bold text-base hover:opacity-90 active:scale-95 transition-all shadow-md"
        >
          {t.modal.continue}
        </button>
        <p className="text-xs text-gray-400 mt-3">{t.modal.tapToClose}</p>
      </div>
    </div>
  )
}
