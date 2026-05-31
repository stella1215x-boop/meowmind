'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import CatSvg from './CatSvg'
import { getIntimacyTier, getSvgMood } from '@/lib/catGrowthService'

// ── Display size per stage ────────────────────────────────────────────────
const DISPLAY_SIZE = [90, 108, 128, 150, 168, 188]

// ── Speech map ────────────────────────────────────────────────────────────
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

// ── PNG frame sequences ───────────────────────────────────────────────────
//   frames : filenames in /public/cat/{color}/ (no extension)
//   fps    : frames per second
//   Each sequence plays once then returns to idle SVG.
const FRAME_SEQUENCES = {
  eat:      { frames: ['eat_1', 'eat_2', 'eat_3', 'eat_4'],              fps: 3 },
  purr:     { frames: ['purr_1', 'purr_2', 'purr_3'],                    fps: 3 },
  headbutt: { frames: ['headbutt_1', 'headbutt_2', 'headbutt_3'],        fps: 5 },
  nuzzle:   { frames: ['nuzzle_2', 'nuzzle_2'],                          fps: 2 },
  knead:    { frames: ['knead_1', 'knead_2', 'knead_3', 'knead_2'],      fps: 3 },
}

// ── CSS-only animations (no PNG frames) ──────────────────────────────────
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
  const [currentAnim,  setCurrentAnim]  = useState(null)
  const [frameIndex,   setFrameIndex]   = useState(0)
  const [imgError,     setImgError]     = useState(false)   // fallback if PNG missing
  const [bubble,       setBubble]       = useState(false)
  const [bubbleText,   setBubbleText]   = useState('')
  const [hasGreeted,   setHasGreeted]   = useState(false)
  const [hearts,       setHearts]       = useState([])
  const timerRef = useRef(null)

  const stage    = Math.min(cat?.stage ?? 0, 5)
  const size     = DISPLAY_SIZE[stage]
  const color    = cat?.color ?? 'orange'
  const intimacy = cat?.intimacy ?? 0
  const tier     = getIntimacyTier(intimacy)
  const svgMood  = getSvgMood(emotionalState, intimacy)

  // First-appear greeting
  useEffect(() => {
    const t = setTimeout(() => setHasGreeted(true), 1900)
    return () => clearTimeout(t)
  }, [])

  // Floating hearts for high-intimacy interactions
  const spawnHearts = useCallback(() => {
    const batch = Array.from({ length: 4 }, (_, i) => ({
      id: Date.now() + i,
      left: 15 + Math.random() * 70,
      delay: i * 0.15,
    }))
    setHearts((prev) => [...prev, ...batch])
    setTimeout(() => setHearts((prev) => prev.filter((h) => !batch.some((b) => b.id === h.id))), 1600)
  }, [])

  // ── Triggered animation ─────────────────────────────────────────────────
  useEffect(() => {
    if (!playAnimation) return

    // Clear any running timer
    if (timerRef.current) clearInterval(timerRef.current)

    setCurrentAnim(playAnimation)
    setFrameIndex(0)
    setImgError(false)

    // Speech bubble
    const speech = ANIM_SPEECH[playAnimation]
    if (speech) {
      const tierSpeech = tier.speech
      const finalSpeech =
        intimacy >= 60 && Math.random() < 0.4
          ? tierSpeech[Math.floor(Math.random() * tierSpeech.length)]
          : speech
      setBubbleText(finalSpeech)
      setBubble(true)
    }

    if (intimacy >= 60) spawnHearts()

    const seq = FRAME_SEQUENCES[playAnimation]

    if (seq) {
      // ── PNG frame animation ──
      const interval = Math.round(1000 / seq.fps)
      let idx = 0

      timerRef.current = setInterval(() => {
        idx++
        if (idx >= seq.frames.length) {
          clearInterval(timerRef.current)
          // Hold last frame briefly, then return to idle
          setTimeout(() => {
            setCurrentAnim(null)
            onAnimationEnd?.()
          }, interval)
        } else {
          setFrameIndex(idx)
        }
      }, interval)
    } else {
      // ── CSS-only fallback (wag, spin, roll, knock, float) ──
      setTimeout(() => {
        setCurrentAnim(null)
        onAnimationEnd?.()
      }, 2400)
    }

    const tb = setTimeout(() => setBubble(false), 1900)

    return () => {
      clearTimeout(tb)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [playAnimation]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Decide what to render ───────────────────────────────────────────────
  const seq          = currentAnim ? FRAME_SEQUENCES[currentAnim] : null
  const isFrameAnim  = !!seq && !imgError
  const currentFrame = isFrameAnim ? seq.frames[frameIndex] : null
  const imgSrc       = currentFrame ? `/cat/${color}/${currentFrame}.png` : null

  const cssAnimClass = (currentAnim && !isFrameAnim)
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

      {/* ── Cat render ─────────────────────────────────────────────────────
          • PNG frame   → when a frame sequence exists for the current action
          • CatSvg      → idle, or CSS-only actions (wag/spin/roll/knock)
          • Fallback    → if PNG 404s, imgError=true → drops back to CatSvg   */}
      <div
        className={isFrameAnim ? 'transition-none' : cssAnimClass}
        style={{ filter: `drop-shadow(${tier.glow})`, width: size, height: size }}
      >
        {isFrameAnim && imgSrc ? (
          <img
            key={imgSrc}
            src={imgSrc}
            alt=""
            width={size}
            height={size}
            draggable={false}
            className="select-none object-contain w-full h-full"
            onError={() => setImgError(true)}
          />
        ) : (
          <CatSvg
            stage={stage}
            color={color}
            mood={svgMood}
            size={size}
            className="select-none"
          />
        )}
      </div>

      {/* Intimacy tier badge */}
      <div className={`mt-2 px-3 py-0.5 rounded-full text-xs font-semibold transition-all duration-500 ${tier.badgeCls}`}>
        {tier.emoji} {tier.label}
      </div>
    </div>
  )
}
