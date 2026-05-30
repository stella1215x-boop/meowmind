'use client'

import { useState } from 'react'
import useCatStore from '@/store/useCatStore'
import CatCharacter from './CatCharacter'
import IntimacyMeter from './IntimacyMeter'
import { getStageLabel, getIntimacyTier } from '@/lib/catGrowthService'

export default function CatAnimation({ cat, emotionalState, playAnimation, onAnimationEnd }) {
  const { triggerTapAnimation } = useCatStore()
  const [hasTapped, setHasTapped] = useState(false)
  const isBusy = !!playAnimation

  const intimacy = cat?.intimacy ?? 0
  const tier = getIntimacyTier(intimacy)

  // Hint changes per intimacy tier
  const tapHint =
    intimacy >= 80 ? `${tier.emoji} Tap for love` :
    intimacy >= 60 ? '🐾 Tap to play' :
    intimacy >= 40 ? '🐾 Tap to interact' :
    intimacy >= 20 ? '🐾 Tap to say hi' :
    '🐾 Tap gently...'

  function handleTap() {
    setHasTapped(true)
    triggerTapAnimation()
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Tappable cat */}
      <button
        onClick={handleTap}
        disabled={isBusy}
        aria-label={`Pet ${cat?.name ?? 'cat'}`}
        className={`rounded-full transition-transform duration-100 select-none focus:outline-none
          ${isBusy ? 'cursor-default' : 'cursor-pointer active:scale-90 hover:scale-105'}`}
      >
        <CatCharacter
          cat={cat}
          emotionalState={emotionalState}
          playAnimation={playAnimation}
          onAnimationEnd={onAnimationEnd}
        />
      </button>

      {/* Name + stage */}
      <div className="text-center space-y-0.5 mt-1">
        <h2 className="text-2xl font-extrabold text-gray-700">{cat?.name}</h2>
        <p className="text-sm text-gray-400 font-medium">{getStageLabel(cat?.stage)}</p>
      </div>

      {/* Intimacy meter */}
      <IntimacyMeter intimacy={intimacy} />

      {/* Tap hint — fades after first tap */}
      {!hasTapped && (
        <p className="text-[10px] text-gray-300 -mt-1 select-none animate-pulse">
          {tapHint}
        </p>
      )}
    </div>
  )
}
