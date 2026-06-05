'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRive, EventType, Layout, Fit, Alignment } from '@rive-app/react-canvas'
import { getIntimacyTier, getSvgMood } from '@/lib/catGrowthService'
import CatSvg from './CatSvg'

// ── Rive animation names (from the .riv file) ─────────────────────────────────
const RIVE_IDLE  = 'Action01_Sitting9'
const RIVE_EAT   = 'Action02_Eating9'
const RIVE_PLAY  = 'Action03_Play9'

// Map our playAnimation keys → which Rive animation to play
const ANIM_MAP = {
  eat:      { riv: RIVE_EAT,  loop: false },
  purr:     { riv: RIVE_PLAY, loop: false },
  headbutt: { riv: RIVE_PLAY, loop: false },
  nuzzle:   { riv: RIVE_PLAY, loop: false },
  knead:    { riv: RIVE_PLAY, loop: false },
  groom:    { riv: RIVE_PLAY, loop: false },
  wag:      { riv: RIVE_PLAY, loop: false },
  spin:     { riv: RIVE_PLAY, loop: false },
  roll:     { riv: RIVE_PLAY, loop: false },
  knock:    { riv: RIVE_PLAY, loop: false },
  float:    { riv: RIVE_PLAY, loop: false },
  stretch:  { riv: RIVE_PLAY, loop: false },
}

// Speech bubbles per action
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

// Display size per stage — cat grows visually
const DISPLAY_SIZE = [90, 108, 128, 150, 168, 188]

export default function CatRiveCharacter({
  cat,
  emotionalState = 'neutral',
  playAnimation,
  onAnimationEnd,
}) {
  const [bubble,      setBubble]      = useState(false)
  const [bubbleText,  setBubbleText]  = useState('')
  const [hasGreeted,  setHasGreeted]  = useState(false)
  const [hearts,      setHearts]      = useState([])
  const [riveError,   setRiveError]   = useState(false)  // fallback to SVG if Rive fails
  const bubbleTimerRef  = useRef(null)
  const actionTimerRef  = useRef(null)

  const stage    = Math.min(cat?.stage ?? 0, 5)
  const size     = DISPLAY_SIZE[stage]
  const color    = cat?.color ?? 'orange'
  const intimacy = cat?.intimacy ?? 0
  const tier     = getIntimacyTier(intimacy)
  const svgMood  = getSvgMood(emotionalState, intimacy)

  // ── Rive setup ───────────────────────────────────────────────────────────
  const { rive, RiveComponent } = useRive({
    src:       '/cat/cat.riv',
    artboard:  'Big_Cat',
    animations: RIVE_IDLE,
    autoplay:  true,
    layout:    new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    onLoadError: () => setRiveError(true),
  })

  // ── Greeting animation on first load ─────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setHasGreeted(true), 1900)
    return () => clearTimeout(t)
  }, [])

  // ── Floating hearts ───────────────────────────────────────────────────────
  const spawnHearts = useCallback(() => {
    const batch = Array.from({ length: 4 }, (_, i) => ({
      id: Date.now() + i,
      left: 15 + Math.random() * 70,
      delay: i * 0.15,
    }))
    setHearts(prev => [...prev, ...batch])
    setTimeout(
      () => setHearts(prev => prev.filter(h => !batch.some(b => b.id === h.id))),
      1600,
    )
  }, [])

  // ── Play animation when playAnimation prop changes ────────────────────────
  useEffect(() => {
    if (!rive) return

    if (!playAnimation) {
      // Return to idle loop
      rive.play(RIVE_IDLE)
      return
    }

    const mapping = ANIM_MAP[playAnimation]
    const rivAnim = mapping?.riv ?? RIVE_PLAY

    // Speech bubble
    const speech = ANIM_SPEECH[playAnimation]
    if (speech) {
      const tierSpeech = tier.speech
      const final =
        intimacy >= 60 && Math.random() < 0.4
          ? tierSpeech[Math.floor(Math.random() * tierSpeech.length)]
          : speech
      setBubbleText(final)
      setBubble(true)
      clearTimeout(bubbleTimerRef.current)
      bubbleTimerRef.current = setTimeout(() => setBubble(false), 1900)
    }

    if (intimacy >= 60) spawnHearts()

    // Play the Rive animation
    rive.play(rivAnim)

    // Listen for when this animation stops → call onAnimationEnd → back to idle
    function handleStop(event) {
      if (event?.data?.includes?.(rivAnim)) {
        rive.off(EventType.Stop, handleStop)
        rive.play(RIVE_IDLE)
        onAnimationEnd?.()
      }
    }
    rive.on(EventType.Stop, handleStop)

    // Safety timeout in case the event never fires
    clearTimeout(actionTimerRef.current)
    actionTimerRef.current = setTimeout(() => {
      rive.off(EventType.Stop, handleStop)
      rive.play(RIVE_IDLE)
      onAnimationEnd?.()
    }, 4000)

    return () => {
      rive.off(EventType.Stop, handleStop)
      clearTimeout(actionTimerRef.current)
    }
  }, [playAnimation, rive]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sad/hungry: slow down the idle when emotional state is negative ───────
  useEffect(() => {
    if (!rive) return
    if (!playAnimation) {
      const isSad = emotionalState === 'sad' || emotionalState === 'hungry'
      // Speed: 1.0 = normal, 0.4 = slow droopy feeling
      rive.playbackRate = isSad ? 0.4 : 1.0
    }
  }, [rive, emotionalState, playAnimation])

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => () => {
    clearTimeout(bubbleTimerRef.current)
    clearTimeout(actionTimerRef.current)
  }, [])

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="relative flex flex-col items-center"
      style={{ width: size, minHeight: size + 64, background: 'transparent' }}>

      {/* Stage decorations */}
      {stage >= 5 && (
        <div className="absolute z-10 text-2xl select-none drop-shadow"
          style={{ top: -24, left: '50%', transform: 'translateX(-50%)' }}>👑</div>
      )}
      {stage === 4 && (
        <div className="absolute z-10 text-xl select-none drop-shadow"
          style={{ top: -6, right: -10 }}>⭐</div>
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

      {/* Cat — Rive or SVG fallback */}
      <div
        style={{
          width: size,
          height: size,
          filter: `drop-shadow(${tier.glow})`,
        }}
        className={!hasGreeted ? 'animate-cat-greet' : ''}
      >
        {riveError ? (
          <CatSvg stage={stage} color={color} mood={svgMood} size={size} className="select-none" />
        ) : (
          <RiveComponent
            style={{ width: size, height: size }}
            aria-label={`${cat?.name ?? 'cat'} animation`}
          />
        )}
      </div>

      {/* Intimacy tier badge */}
      <div className={`mt-2 px-3 py-0.5 rounded-full text-xs font-semibold
                       transition-all duration-500 ${tier.badgeCls}`}>
        {tier.emoji} {tier.label}
      </div>
    </div>
  )
}
