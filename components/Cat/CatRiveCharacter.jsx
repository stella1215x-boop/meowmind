'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRive, EventType, Layout, Fit, Alignment } from '@rive-app/react-canvas'
import { getIntimacyTier, getSvgMood } from '@/lib/catGrowthService'
import CatSvg from './CatSvg'

// ── Rive file internals ───────────────────────────────────────────────────────
const RIV_SRC     = '/cat/cat.riv'
const ARTBOARD    = 'Big Cat'          // exact name from .riv file (space, not underscore)
const RIVE_IDLE   = 'Action01_Sitting9'
const RIVE_EAT    = 'Action02_Eating9'
const RIVE_PLAY   = 'Action03_Play9'

// Map every playAnimation key → Rive animation name
const ANIM_MAP = {
  eat:      RIVE_EAT,
  purr:     RIVE_PLAY,
  headbutt: RIVE_PLAY,
  nuzzle:   RIVE_PLAY,
  knead:    RIVE_PLAY,
  groom:    RIVE_PLAY,
  wag:      RIVE_PLAY,
  spin:     RIVE_PLAY,
  roll:     RIVE_PLAY,
  knock:    RIVE_PLAY,
  float:    RIVE_PLAY,
  stretch:  RIVE_PLAY,
}

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
  groom:    'So clean~ ✨',
  stretch:  '*big yawn* 😪',
}

const DISPLAY_SIZE = [90, 108, 128, 150, 168, 188]

export default function CatRiveCharacter({
  cat,
  emotionalState = 'neutral',
  playAnimation,
  onAnimationEnd,
}) {
  const [bubble,     setBubble]     = useState(false)
  const [bubbleText, setBubbleText] = useState('')
  const [hasGreeted, setHasGreeted] = useState(false)
  const [hearts,     setHearts]     = useState([])
  const [riveError,  setRiveError]  = useState(false)
  const bubbleTimerRef = useRef(null)
  const safetyTimerRef = useRef(null)

  const stage    = Math.min(cat?.stage ?? 0, 5)
  const size     = DISPLAY_SIZE[stage]
  const color    = cat?.color ?? 'orange'
  const intimacy = cat?.intimacy ?? 0
  const tier     = getIntimacyTier(intimacy)
  const svgMood  = getSvgMood(emotionalState, intimacy)
  const isSad    = emotionalState === 'sad' || emotionalState === 'hungry'

  // ── Rive ──────────────────────────────────────────────────────────────────
  const { rive, RiveComponent } = useRive({
    src:        RIV_SRC,
    artboard:   ARTBOARD,
    animations: RIVE_IDLE,
    autoplay:   true,
    layout:     new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    onLoadError(err) {
      console.error('[Rive] load error:', err)
      setRiveError(true)
    },
  })

  // ── Greeting ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setHasGreeted(true), 1900)
    return () => clearTimeout(t)
  }, [])

  // ── Hearts ────────────────────────────────────────────────────────────────
  const spawnHearts = useCallback(() => {
    const batch = Array.from({ length: 4 }, (_, i) => ({
      id: Date.now() + i, left: 15 + Math.random() * 70, delay: i * 0.15,
    }))
    setHearts(prev => [...prev, ...batch])
    setTimeout(() => setHearts(prev => prev.filter(h => !batch.some(b => b.id === h.id))), 1600)
  }, [])

  // ── Sad/hungry: slow idle playback ───────────────────────────────────────
  useEffect(() => {
    if (!rive || playAnimation) return
    rive.playbackRate = isSad ? 0.4 : 1.0
  }, [rive, isSad, playAnimation])

  // ── Animation control ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!rive) return

    // Back to idle
    if (!playAnimation) {
      rive.pause()
      rive.playbackRate = isSad ? 0.4 : 1.0
      rive.play(RIVE_IDLE)
      return
    }

    const rivAnim = ANIM_MAP[playAnimation] ?? RIVE_PLAY

    // Speech bubble
    const speech = ANIM_SPEECH[playAnimation]
    if (speech) {
      const final =
        intimacy >= 60 && Math.random() < 0.4
          ? tier.speech[Math.floor(Math.random() * tier.speech.length)]
          : speech
      setBubbleText(final)
      setBubble(true)
      clearTimeout(bubbleTimerRef.current)
      bubbleTimerRef.current = setTimeout(() => setBubble(false), 1900)
    }

    if (intimacy >= 60) spawnHearts()

    // Reset speed for action
    rive.playbackRate = 1.0
    rive.play(rivAnim)

    // Detect end of one-shot animation → return to idle
    function handleStop(event) {
      const stoppedAnims = event?.data ?? []
      if (Array.isArray(stoppedAnims) && stoppedAnims.includes(rivAnim)) {
        cleanup()
        rive.play(RIVE_IDLE)
        onAnimationEnd?.()
      }
    }
    rive.on(EventType.Stop, handleStop)

    // Safety fallback
    clearTimeout(safetyTimerRef.current)
    safetyTimerRef.current = setTimeout(() => {
      rive.off(EventType.Stop, handleStop)
      rive.play(RIVE_IDLE)
      onAnimationEnd?.()
    }, 5000)

    function cleanup() {
      rive.off(EventType.Stop, handleStop)
      clearTimeout(safetyTimerRef.current)
    }
    return cleanup
  }, [playAnimation, rive]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Cleanup ───────────────────────────────────────────────────────────────
  useEffect(() => () => {
    clearTimeout(bubbleTimerRef.current)
    clearTimeout(safetyTimerRef.current)
  }, [])

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="relative flex flex-col items-center"
      style={{ width: size, minHeight: size + 64, background: 'transparent' }}>

      {stage >= 5 && (
        <div className="absolute z-10 text-2xl select-none drop-shadow"
          style={{ top: -24, left: '50%', transform: 'translateX(-50%)' }}>👑</div>
      )}
      {stage === 4 && (
        <div className="absolute z-10 text-xl select-none drop-shadow"
          style={{ top: -6, right: -10 }}>⭐</div>
      )}

      {bubble && (
        <div className="absolute z-20 animate-milestone-pop pointer-events-none"
          style={{ top: -56, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
          <div className="bg-white rounded-2xl px-3 py-2 shadow-lg border border-gray-100">
            <p className="text-sm font-bold text-gray-700">{bubbleText}</p>
          </div>
          <div className="w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45 mx-auto -mt-1.5" />
        </div>
      )}

      {hearts.map(h => (
        <span key={h.id}
          className="absolute text-base pointer-events-none z-10 animate-heart-float select-none"
          style={{ left: `${h.left}%`, top: -16, animationDelay: `${h.delay}s` }}>❤️</span>
      ))}

      {/* Cat — Rive canvas or SVG fallback */}
      <div
        style={{ width: size, height: size, filter: `drop-shadow(${tier.glow})` }}
        className={!hasGreeted && !riveError ? 'animate-cat-greet' : ''}
      >
        {riveError ? (
          <CatSvg stage={stage} color={color} mood={svgMood} size={size} className="select-none" />
        ) : (
          <RiveComponent style={{ width: '100%', height: '100%' }} />
        )}
      </div>

      <div className={`mt-2 px-3 py-0.5 rounded-full text-xs font-semibold
                       transition-all duration-500 ${tier.badgeCls}`}>
        {tier.emoji} {tier.label}
      </div>
    </div>
  )
}
