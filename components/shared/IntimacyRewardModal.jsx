'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import CatSvg from '@/components/Cat/CatSvg'

// Use the Rive character — same dynamic/ssr:false pattern as CatAnimation
const CatRiveCharacter = dynamic(
  () => import('@/components/Cat/CatRiveCharacter'),
  { ssr: false, loading: () => <CatSvg stage={0} color="orange" mood="happy" size={108} /> }
)

const CONFETTI_COLORS = ['#C3B1E1', '#A8E6CF', '#FFD93D', '#FF6B6B', '#74C0FC', '#FFA07A']
const CONFETTI_COUNT  = 20

export default function IntimacyRewardModal({ reward, cat, onClose }) {
  const [visible,  setVisible]  = useState(false)
  const [confetti, setConfetti] = useState([])

  useEffect(() => {
    if (!reward) return
    setVisible(true)
    setConfetti(
      Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
        id:     i,
        color:  reward.confettiColor ?? CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        left:   `${4 + (i / CONFETTI_COUNT) * 92}%`,
        delay:  `${(i * 0.06).toFixed(2)}s`,
        size:   5 + (i % 5) * 2,
        rotate: i * 41,
      }))
    )
  }, [reward])

  if (!visible || !reward) return null

  function handleClose() {
    setVisible(false)
    onClose?.()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/40 backdrop-blur-sm"
      onClick={handleClose}
    >
      {/* Confetti */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {confetti.map(c => (
          <div
            key={c.id}
            className="absolute animate-confetti-fall"
            style={{
              left:            c.left,
              top:             '-10px',
              width:           c.size,
              height:          c.size,
              backgroundColor: c.color,
              borderRadius:    c.id % 3 === 0 ? '50%' : '2px',
              transform:       `rotate(${c.rotate}deg)`,
              animationDelay:  c.delay,
            }}
          />
        ))}
      </div>

      {/* Modal card */}
      <div
        className={`w-full max-w-sm rounded-3xl p-7 text-center shadow-2xl
                    bg-gradient-to-b ${reward.bg ?? 'from-lavender/30 to-white'}
                    animate-milestone-pop`}
        onClick={e => e.stopPropagation()}
      >
        {/* Big emoji + title */}
        <div className="text-5xl mb-1 animate-bounce inline-block">{reward.emoji}</div>
        <h2 className="text-2xl font-extrabold text-gray-700 mt-1">{reward.title}</h2>
        <p className="text-gray-500 text-sm mt-1 leading-relaxed">{reward.subtitle}</p>

        {/* Cat (Rive) + speech bubble */}
        <div className="my-4 flex flex-col items-center gap-2">
          <CatRiveCharacter
            cat={cat}           // pass full cat so tier badge shows correctly
            emotionalState="happy"
            playAnimation="purr"
          />
          <div className="bg-white rounded-2xl rounded-tl-none px-4 py-2.5 shadow-sm border border-gray-100">
            <p className="text-sm font-extrabold text-lavender">{cat?.name} 🐱</p>
            <p className="text-xs text-gray-500 mt-0.5">우리 사이가 더 깊어졌어요 💛</p>
          </div>
        </div>

        {/* Coin reward */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-4 py-3 mb-3 flex items-center justify-center gap-3">
          <span className="text-3xl">🪙</span>
          <div className="text-left">
            <p className="text-2xl font-extrabold text-yellow-600 leading-none">+{reward.coins}</p>
            <p className="text-xs text-yellow-700 font-semibold mt-0.5">친밀도 보너스 코인!</p>
          </div>
        </div>

        {/* Unlocked items */}
        {reward.unlocks && (
          <div className="bg-white/80 rounded-2xl px-4 py-2.5 mb-5 border border-gray-100">
            <p className="text-[10px] font-extrabold text-gray-400 mb-1 tracking-widest uppercase">
              🔓 신규 해금
            </p>
            <p className="text-sm font-bold text-gray-700">{reward.unlocks}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">상점에서 구매할 수 있어요!</p>
          </div>
        )}

        <button
          onClick={handleClose}
          className="w-full bg-lavender text-white rounded-2xl py-3.5 font-bold text-base
                     hover:opacity-90 active:scale-95 transition-all shadow-md"
        >
          계속하기 🐾
        </button>
        <p className="text-xs text-gray-400 mt-3">화면을 탭해도 닫힙니다</p>
      </div>
    </div>
  )
}
