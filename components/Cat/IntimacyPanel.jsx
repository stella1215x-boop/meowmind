'use client'

import { useState } from 'react'
import useCatStore from '@/store/useCatStore'

export default function IntimacyPanel() {
  const { doInteract, playAnimation } = useCatStore()
  const [popup, setPopup] = useState(null)
  const isBusy = !!playAnimation

  async function handlePlay() {
    if (isBusy) return
    const gained = await doInteract('pet')
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

      {/* Single play button */}
      <button
        onClick={handlePlay}
        disabled={isBusy}
        className={`w-16 h-16 rounded-full flex flex-col items-center justify-center
                    shadow-lg transition-all active:scale-90 select-none
                    bg-gradient-to-br from-purple-500 to-pink-500
                    ${isBusy ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span className="text-xl">🎮</span>
        <span className="text-[9px] font-bold text-white mt-0.5">놀아주기</span>
      </button>
    </div>
  )
}
