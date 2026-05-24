'use client'

import { useState } from 'react'
import useCatStore from '@/store/useCatStore'
import CatCharacter from './CatCharacter'

export default function CatAnimation({ cat, emotionalState, playAnimation, onAnimationEnd }) {
  const { triggerTapAnimation } = useCatStore()
  const [hasTapped, setHasTapped] = useState(false)
  const isBusy = !!playAnimation

  function handleTap() {
    setHasTapped(true)
    triggerTapAnimation()
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Tappable cat — triggers random animation */}
      <button
        onClick={handleTap}
        disabled={isBusy}
        aria-label={`${cat?.name} 쓰다듬기`}
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

      {/* Name + stage label */}
      <div className="text-center space-y-0.5 mt-1">
        <h2 className="text-2xl font-extrabold text-gray-700">{cat?.name}</h2>
        <p className="text-sm text-gray-400 font-medium">{getStageLabel(cat?.stage)}</p>
      </div>

      {/* Tap hint — disappears after first tap */}
      {!hasTapped && (
        <p className="text-[10px] text-gray-300 -mt-1 select-none animate-pulse">
          탭해서 놀아주세요 🐾
        </p>
      )}
    </div>
  )
}

function getStageLabel(stage) {
  const labels = ['아기 고양이', '자라는 중', '장난꾸러기', '어른 고양이', '현명한 고양이', '전설의 고양이']
  return labels[stage] ?? '아기 고양이'
}
