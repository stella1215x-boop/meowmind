'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { getIntimacyTier, getSvgMood } from '@/lib/catGrowthService'

// Display size per stage (px) — cat grows visually
const DISPLAY_SIZE = [90, 108, 128, 150, 168, 188]

// Full speech map (English)
const ANIM_SPEECH = {
  purr:     'Purrrr~ 😻',
  wag:      'My tail is excited! 🐾',
  spin:     'Wheee~ 🌀',
  roll:     'Showing my belly! 🐱',
  knock:    'Tap! 😈',
  eat:      'Nom nom~ 🍽️',
  headbutt: '*bonk* 💛',
  nuzzle:   'Nuzzle nuzzle~ 🧡',
  knead:    'Making biscuits... 🍞',
  float:    'So happy~ ✨',
}

// CSS animation class for each tap/event animation
const TAP_ANIM_CLASS = {
  purr:     'animate-purr',
  wag:      'animate-wag',
  spin:     'animate-spin',
  roll:     'animate-roll',
  knock:    'animate-knock',
  eat:      'animate-eat',
  headbutt: 'animate-headbutt',
  nuzzle:   'animate-nuzzle',
  knead:    'animate-knead',
  float:    'animate-float',
}

function getIdleAnimClass(tier, emotionalState, hasGreeted) {
  if (!hasGreeted) return 'animate-cat-greet'
  if (emotionalState === 'happy') {
    if (tier.key === 'legendary' || tier.key === 'soulBond') return 'animate-excited'
    if (tier.key === 'attached')  return 'animate-float'
    return 'animate-purr'
  }
  return tier.idleAnim ?? 'animate-body-breathe'
}

export default function CatCharacter({ cat, emotionalState = 'neutral', playAnimation, onAnimationEnd }) {
  const [currentAnim, setCurrentAnim]   = useState(null)
  const [bubble,      setBubble]        = useState(false)
  const [bubbleText,  setBubbleText]    = useState('')
  const [hasGreeted,  setHasGreeted]    = useState(false)
  const [hearts,      setHearts]        = useState([])

  const stage    = Math.min(cat?.stage ?? 0, 5)
  const size     = DISPLAY_SIZE[stage]
  const color    = cat?.color ?? 'orange'
  const intimacy = cat?.intimacy ?? 0
  const tier     = getIntimacyTier(intimacy)
  const svgMood  = getSvgMood(emotionalState, intimacy)
  const svgSrc   = `/cats/cat_stage${stage}_${color}_${svgMood}.svg`

  // First-appear greeting animation
  useEffect(() => {
    const t = setTimeout(() => setHasGreeted(true), 1900)
    return () => clearTimeout(t)
  }, [])

  // Spawn floating hearts (called for high-intimacy interactions)
  const spawnHearts = useCallback(() => {
    const batch = Array.from({ length: 4 }, (_, i) => ({
      id: Date.now() + i,
      left: 15 + Math.random() * 70,
      delay: i * 0.15,
    }))
    setHearts((prev) => [...prev, ...batch])
    setTimeout(() => setHearts((prev) => prev.filter((h) => !batch.some((b) => b.id === h.id))), 1600)
  }, [])

  // Play externally-triggered animation (journal submit, feed, etc.)
  useEffect(() => {
    if (!playAnimation) return
    setCurrentAnim(playAnimation)

    // Speech bubble
    const speech = ANIM_SPEECH[playAnimation]
    if (speech) {
      // High-intimacy: use personalised tier speech sometimes
      const tierSpeech = tier.speech
      const finalSpeech =
        intimacy >= 60 && Math.random() < 0.4
          ? tierSpeech[Math.floor(Math.random() * tierSpeech.length)]
          : speech
      setBubbleText(finalSpeech)
      setBubble(true)
    }

    // Hearts for attached+
    if (intimacy >= 60) spawnHearts()

    const tb = setTimeout(() => setBubble(false), 1900)
    const te = setTimeout(() => { setCurrentAnim(null); onAnimationEnd?.() }, 2400)
    return () => { clearTimeout(tb); clearTimeout(te) }
  }, [playAnimation]) // eslint-disable-line react-hooks/exhaustive-deps

  const animClass = currentAnim
    ? (TAP_ANIM_CLASS[currentAnim] ?? 'animate-float')
    : getIdleAnimClass(tier, emotionalState, hasGreeted)

  return (
    <div className="relative flex flex-col items-center" style={{ width: size, minHeight: size + 64 }}>

      {/* Stage crown / star deco */}
      {stage >= 5 && (
        <div className="absolute z-10 text-2xl select-none drop-shadow"
          style={{ top: -24, left: '50%', transform: 'translateX(-50%)' }}>
          👑
        </div>
      )}
      {stage === 4 && (
        <div className="absolute z-10 text-xl select-none drop-shadow" style={{ top: -6, right: -10 }}>
          ⭐
        </div>
      )}

      {/* Speech bubble */}
      {bubble && (
        <div className="absolute z-20 animate-milestone-pop pointer-events-none"
          style={{ top: -56, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
          <div className="bg-white rounded-2xl px-3 py-2 shadow-lg border border-gray-100">
            <p className="text-sm font-bold text-gray-700">{bubbleText}</p>
          </div>
          <div className="w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45 mx-auto -mt-1.5" />
        </div>
      )}

      {/* Floating hearts (attached+ tier) */}
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute text-base pointer-events-none z-10 animate-heart-float select-none"
          style={{ left: `${h.left}%`, top: -16, animationDelay: `${h.delay}s` }}
        >
          ❤️
        </span>
      ))}

      {/* Cat image with CSS animations */}
      <div
        className={animClass}
        style={{
          filter: `drop-shadow(${tier.glow})`,
          width: size,
          height: size,
        }}
      >
        <Image
          src={svgSrc}
          alt={cat?.name ?? 'Cat'}
          width={size}
          height={size}
          className="object-contain select-none"
          priority
        />
      </div>

      {/* Intimacy tier badge */}
      <div className={`mt-2 px-3 py-0.5 rounded-full text-xs font-semibold transition-all duration-500 ${tier.badgeCls}`}>
        {tier.emoji} {tier.label}
      </div>
    </div>
  )
}
