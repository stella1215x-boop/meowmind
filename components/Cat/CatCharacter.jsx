'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import CatSvg from './CatSvg'
import { getIntimacyTier, getSvgMood } from '@/lib/catGrowthService'

// PNG fallback: show this frame during CSS-only animations (wag/knock/etc.)
const CSS_FALLBACK_FRAME = 'idle_1'

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
const FRAME_SEQUENCES = {
  idle:     { frames: ['idle_1', 'idle_2'],                         fps: 1  },
  eat:      { frames: ['eat_1', 'eat_2', 'eat_3', 'eat_4'],         fps: 3  },
  purr:     { frames: ['purr_1', 'purr_2', 'purr_3'],               fps: 3  },
  headbutt: { frames: ['headbutt_1', 'headbutt_2', 'headbutt_3'],   fps: 5  },
  nuzzle:   { frames: ['nuzzle_2', 'nuzzle_2'],                     fps: 2  },
  knead:    { frames: ['knead_1', 'knead_2', 'knead_3', 'knead_2'], fps: 3  },
}

// ── CSS-only fallback (no PNG for these) ─────────────────────────────────
const CSS_ANIM_CLASS = {
  wag:   'animate-wag',
  spin:  'animate-spin',
  roll:  'animate-roll',
  knock: 'animate-knock',
  float: 'animate-float',
}

// Always load from orange/ — only variant that exists for now
const V = 4
function pngSrc(frame) {
  return `/cat/orange/${frame}.png?v=${V}`
}

export default function CatCharacter({ cat, emotionalState = 'neutral', playAnimation, onAnimationEnd }) {
  const [frameIndex,  setFrameIndex]  = useState(0)
  const [imgFailed,   setImgFailed]   = useState(false)   // true if PNG 404/error
  const [bubble,      setBubble]      = useState(false)
  const [bubbleText,  setBubbleText]  = useState('')
  const [hasGreeted,  setHasGreeted]  = useState(false)
  const [hearts,      setHearts]      = useState([])
  const idleTimerRef  = useRef(null)
  const actionTimerRef = useRef(null)

  const stage    = Math.min(cat?.stage ?? 0, 5)
  const size     = DISPLAY_SIZE[stage]
  const color    = cat?.color ?? 'orange'
  const intimacy = cat?.intimacy ?? 0
  const tier     = getIntimacyTier(intimacy)
  const svgMood  = getSvgMood(emotionalState, intimacy)

  // ── Compute src early (needed by useEffect deps below) ───────────────
  const activeAnim   = playAnimation || 'idle'
  const seq          = FRAME_SEQUENCES[activeAnim]
  const isCssOnly    = !seq && !!playAnimation
  const frame        = seq ? seq.frames[frameIndex] : CSS_FALLBACK_FRAME
  const src          = pngSrc(frame)
  const cssAnimClass = isCssOnly
    ? (CSS_ANIM_CLASS[playAnimation] ?? 'animate-float')
    : (!hasGreeted && !playAnimation ? 'animate-cat-greet' : '')

  // ── Reset imgFailed when PNG src changes ─────────────────────────────
  useEffect(() => { setImgFailed(false) }, [src])

  // ── Greeting badge ────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setHasGreeted(true), 1900)
    return () => clearTimeout(t)
  }, [])

  // ── Floating hearts ───────────────────────────────────────────────────
  const spawnHearts = useCallback(() => {
    const batch = Array.from({ length: 4 }, (_, i) => ({
      id: Date.now() + i,
      left: 15 + Math.random() * 70,
      delay: i * 0.15,
    }))
    setHearts(prev => [...prev, ...batch])
    setTimeout(() => setHearts(prev => prev.filter(h => !batch.some(b => b.id === h.id))), 1600)
  }, [])

  // ── IDLE loop — runs whenever no playAnimation ────────────────────────
  useEffect(() => {
    if (playAnimation) return   // action effect takes over

    setFrameIndex(0)
    let idx = 0
    idleTimerRef.current = setInterval(() => {
      idx = (idx + 1) % FRAME_SEQUENCES.idle.frames.length
      setFrameIndex(idx)
    }, Math.round(1000 / FRAME_SEQUENCES.idle.fps))

    return () => {
      clearInterval(idleTimerRef.current)
      idleTimerRef.current = null
    }
  }, [playAnimation])

  // ── ACTION animation — runs when playAnimation is set ─────────────────
  useEffect(() => {
    if (!playAnimation) return

    // Clear any leftover idle timer
    clearInterval(idleTimerRef.current)

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
      const bt = setTimeout(() => setBubble(false), 1900)
      actionTimerRef.current = bt
    }

    if (intimacy >= 60) spawnHearts()

    const seq = FRAME_SEQUENCES[playAnimation]

    if (!seq) {
      // CSS-only (wag, spin, roll, knock, float) — just wait then end
      actionTimerRef.current = setTimeout(() => onAnimationEnd?.(), 2400)
      return () => clearTimeout(actionTimerRef.current)
    }

    // PNG frame animation — play once then call onAnimationEnd
    setFrameIndex(0)
    const interval = Math.round(1000 / seq.fps)
    let idx = 0
    const timer = setInterval(() => {
      idx++
      if (idx >= seq.frames.length) {
        clearInterval(timer)
        actionTimerRef.current = setTimeout(() => onAnimationEnd?.(), interval)
      } else {
        setFrameIndex(idx)
      }
    }, interval)

    return () => {
      clearInterval(timer)
      clearTimeout(actionTimerRef.current)
    }
  }, [playAnimation]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative flex flex-col items-center"
      style={{ width: size, minHeight: size + 64, background: 'transparent' }}>

      {/* Stage crown / star */}
      {stage >= 5 && (
        <div className="absolute z-10 text-2xl select-none drop-shadow"
          style={{ top: -24, left: '50%', transform: 'translateX(-50%)' }}>👑</div>
      )}
      {stage === 4 && (
        <div className="absolute z-10 text-xl select-none drop-shadow" style={{ top: -6, right: -10 }}>⭐</div>
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

      {/* Floating hearts */}
      {hearts.map(h => (
        <span key={h.id}
          className="absolute text-base pointer-events-none z-10 animate-heart-float select-none"
          style={{ left: `${h.left}%`, top: -16, animationDelay: `${h.delay}s` }}>❤️</span>
      ))}

      {/* ── Cat ── always PNG; CatSvg only if PNG fails to load ─────────── */}
      <div
        className={cssAnimClass}
        style={{ filter: `drop-shadow(${tier.glow})`, width: size, height: size }}
      >
        {!imgFailed ? (
          <img
            key={src}
            src={src}
            alt=""
            width={size}
            height={size}
            draggable={false}
            className="select-none object-contain w-full h-full"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <CatSvg stage={stage} color={color} mood={svgMood} size={size} className="select-none" />
        )}
      </div>

      {/* Tier badge */}
      <div className={`mt-2 px-3 py-0.5 rounded-full text-xs font-semibold transition-all duration-500 ${tier.badgeCls}`}>
        {tier.emoji} {tier.label}
      </div>
    </div>
  )
}
