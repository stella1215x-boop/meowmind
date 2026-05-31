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
//   Loaded from /public/cat/{color}/{frame}.png
//   Falls back to /public/cat/orange/{frame}.png if color variant missing
const FRAME_SEQUENCES = {
  idle:     { frames: ['idle_1', 'idle_2'],                         fps: 1,  loop: true  },
  eat:      { frames: ['eat_1', 'eat_2', 'eat_3', 'eat_4'],         fps: 3,  loop: false },
  purr:     { frames: ['purr_1', 'purr_2', 'purr_3'],               fps: 3,  loop: false },
  headbutt: { frames: ['headbutt_1', 'headbutt_2', 'headbutt_3'],   fps: 5,  loop: false },
  nuzzle:   { frames: ['nuzzle_2', 'nuzzle_2'],                     fps: 2,  loop: false },
  knead:    { frames: ['knead_1', 'knead_2', 'knead_3', 'knead_2'], fps: 3,  loop: false },
}

// ── CSS-only fallback for actions without PNG frames ──────────────────────
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

// Color fallback chain: try user color first, then orange
function imgSrcFor(color, frame) {
  return `/cat/${color}/${frame}.png`
}
function imgFallbackFor(frame) {
  return `/cat/orange/${frame}.png`
}

export default function CatCharacter({ cat, emotionalState = 'neutral', playAnimation, onAnimationEnd }) {
  const [currentAnim,    setCurrentAnim]    = useState('idle')
  const [frameIndex,     setFrameIndex]     = useState(0)
  const [useFallback,    setUseFallback]    = useState(false)  // true = use orange PNG
  const [useSvg,         setUseSvg]         = useState(false)  // true = orange also failed
  const [bubble,         setBubble]         = useState(false)
  const [bubbleText,     setBubbleText]     = useState('')
  const [hasGreeted,     setHasGreeted]     = useState(false)
  const [hearts,         setHearts]         = useState([])
  const timerRef = useRef(null)

  const stage    = Math.min(cat?.stage ?? 0, 5)
  const size     = DISPLAY_SIZE[stage]
  const color    = cat?.color ?? 'orange'
  const intimacy = cat?.intimacy ?? 0
  const tier     = getIntimacyTier(intimacy)
  const svgMood  = getSvgMood(emotionalState, intimacy)

  // ── Start idle loop on mount ──────────────────────────────────────────
  useEffect(() => {
    startAnim('idle')
    const t = setTimeout(() => setHasGreeted(true), 1900)
    return () => {
      clearTimeout(t)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Floating hearts ───────────────────────────────────────────────────
  const spawnHearts = useCallback(() => {
    const batch = Array.from({ length: 4 }, (_, i) => ({
      id: Date.now() + i,
      left: 15 + Math.random() * 70,
      delay: i * 0.15,
    }))
    setHearts((prev) => [...prev, ...batch])
    setTimeout(() => setHearts((prev) => prev.filter((h) => !batch.some((b) => b.id === h.id))), 1600)
  }, [])

  // ── Core animation runner ─────────────────────────────────────────────
  function startAnim(name) {
    if (timerRef.current) clearInterval(timerRef.current)

    const seq = FRAME_SEQUENCES[name]
    if (!seq) {
      // CSS-only action (wag, spin, roll, knock, float)
      setCurrentAnim(name)
      return
    }

    setCurrentAnim(name)
    setFrameIndex(0)
    setUseFallback(false)
    setUseSvg(false)

    if (seq.loop) {
      // Looping idle — cycle frames forever
      let idx = 0
      timerRef.current = setInterval(() => {
        idx = (idx + 1) % seq.frames.length
        setFrameIndex(idx)
      }, Math.round(1000 / seq.fps))
    } else {
      // One-shot action — play once then return to idle
      const interval = Math.round(1000 / seq.fps)
      let idx = 0
      timerRef.current = setInterval(() => {
        idx++
        if (idx >= seq.frames.length) {
          clearInterval(timerRef.current)
          setTimeout(() => {
            onAnimationEnd?.()
            startAnim('idle')
          }, interval)
        } else {
          setFrameIndex(idx)
        }
      }, interval)
    }
  }

  // ── Externally-triggered animation (feed, journal, tap) ───────────────
  useEffect(() => {
    if (!playAnimation) return

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
      setTimeout(() => setBubble(false), 1900)
    }

    if (intimacy >= 60) spawnHearts()

    startAnim(playAnimation)
  }, [playAnimation]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Decide what to render ─────────────────────────────────────────────
  const seq         = FRAME_SEQUENCES[currentAnim]
  const isPngAnim   = !!seq && !useSvg
  const frameName   = isPngAnim ? seq.frames[frameIndex] : null

  // Primary src = user's color; on error try orange; on second error → SVG
  const primarySrc  = frameName ? imgSrcFor(color, frameName) : null
  const fallbackSrc = frameName ? imgFallbackFor(frameName)   : null
  const activeSrc   = isPngAnim ? (useFallback ? fallbackSrc : primarySrc) : null

  // CSS anim class for non-PNG actions (wag/spin/roll/knock/float) and greet
  const cssClass = !seq
    ? (TAP_ANIM_CLASS[currentAnim] ?? 'animate-float')
    : (!hasGreeted ? 'animate-cat-greet' : '')

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
          Priority: color PNG → orange PNG fallback → CatSvg fallback       */}
      <div
        className={isPngAnim ? '' : cssClass}
        style={{
          filter: `drop-shadow(${tier.glow})`,
          width: size,
          height: size,
        }}
      >
        {isPngAnim && activeSrc ? (
          <img
            key={activeSrc}
            src={activeSrc}
            alt=""
            width={size}
            height={size}
            draggable={false}
            className="select-none object-contain w-full h-full"
            onError={() => {
              if (!useFallback) {
                setUseFallback(true)   // try orange
              } else {
                setUseSvg(true)        // give up, use SVG
              }
            }}
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
