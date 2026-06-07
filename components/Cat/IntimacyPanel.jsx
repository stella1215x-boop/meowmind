'use client'

import { useState } from 'react'
import useCatStore from '@/store/useCatStore'

const ACTIONS = [
  { id: 'pet',   emoji: '🤚', label: '쓰다듬기' },
  { id: 'talk',  emoji: '💬', label: '말 걸기'  },
  { id: 'brush', emoji: '🪮', label: '빗질'     },
]

export default function IntimacyPanel() {
  const { doInteract, playAnimation } = useCatStore()
  const [open,    setOpen]    = useState(false)
  const [popup,   setPopup]   = useState(null)   // '+3🪙' flash
  const isBusy = !!playAnimation

  async function handleAction(action) {
    if (isBusy) return
    setOpen(false)
    const gained = await doInteract(action)
    if (gained) {
      setPopup(`+${gained}🪙`)
      setTimeout(() => setPopup(null), 1400)
    }
  }

  return (
    <div className="relative flex flex-col items-center">
      {/* Coin pop */}
      {popup && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2
                        text-sm font-extrabold text-yellow-500
                        animate-coin-pop pointer-events-none select-none z-30">
          {popup}
        </div>
      )}

      {/* Action popup */}
      {open && (
        <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2
                        bg-white rounded-2xl shadow-xl border border-gray-100
                        px-3 py-3 flex gap-3 z-20 animate-milestone-pop
                        min-w-[160px] justify-center">
          {ACTIONS.map(a => (
            <button
              key={a.id}
              onClick={() => handleAction(a.id)}
              className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
            >
              <span className="text-2xl">{a.emoji}</span>
              <span className="text-[10px] text-gray-500 font-semibold">{a.label}</span>
            </button>
          ))}
          {/* Tooltip arrow */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2
                          w-4 h-4 bg-white border-r border-b border-gray-100
                          rotate-45" />
        </div>
      )}

      {/* Main button */}
      <button
        onClick={() => setOpen(v => !v)}
        disabled={isBusy}
        className={`w-16 h-16 rounded-full flex flex-col items-center justify-center
                    shadow-lg transition-all active:scale-90 select-none
                    ${open
                      ? 'bg-pink-500 scale-105'
                      : 'bg-gradient-to-br from-purple-500 to-pink-500'}
                    ${isBusy ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span className="text-xl">💗</span>
        <span className="text-[9px] font-bold text-white mt-0.5">친밀도</span>
      </button>
    </div>
  )
}
