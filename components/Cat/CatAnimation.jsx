'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import useCatStore from '@/store/useCatStore'
import IntimacyMeter from './IntimacyMeter'
import { getStageLabel, getIntimacyTier } from '@/lib/catGrowthService'
import CatSvg from './CatSvg'

// Load Rive component only in the browser — never during SSR/build
// @rive-app/react-canvas uses browser-only APIs (Canvas, WebWorker)
const CatRiveCharacter = dynamic(
  () => import('./CatRiveCharacter'),
  {
    ssr: false,
    loading: () => <CatSvg stage={0} color="orange" mood="neutral" size={90} />,
  }
)

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
    <div className="flex flex-col items-center w-full h-full">
      {/* Tappable cat — fills the 37vh container set by HomeClient */}
      <button
        onClick={handleTap}
        disabled={isBusy}
        aria-label={`Pet ${cat?.name ?? 'cat'}`}
        className={`flex-1 w-full transition-transform duration-100 select-none focus:outline-none
          ${isBusy ? 'cursor-default' : 'cursor-pointer active:scale-95 hover:scale-[1.02]'}`}
        style={{ background: 'transparent', WebkitAppearance: 'none', border: 'none', padding: 0 }}
      >
        <CatRiveCharacter
          cat={cat}
          emotionalState={emotionalState}
          playAnimation={playAnimation}
          onAnimationEnd={onAnimationEnd}
        />
      </button>

      {/* Name + stage — readable below cat */}
      <div className="flex-shrink-0 text-center mt-0.5 pb-1">
        <h2 className="text-lg font-extrabold text-gray-700 leading-tight">{cat?.name}</h2>
        <p className="text-xs text-gray-400 font-medium">{getStageLabel(cat?.stage)}</p>
      </div>
    </div>
  )
}
