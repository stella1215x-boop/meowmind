'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import CatSvg from './CatSvg'
import { getIntimacyTier, getSvgMood } from '@/lib/catGrowthService'

// ── Stage → visual variant ────────────────────────────────────────────────────
// Each variant has its own PNG folder with the same frame names
const VARIANT_FOLDERS = ['kitten', 'kitten', 'adult', 'adult', 'elder', 'elder']
//                        stage 0   stage 1  stage 2  stage 3  stage 4  stage 5

// Frames that exist in variant folders (stage-specific art)
const VARIANT_FRAMES = new Set([
  'idle_1', 'idle_2',               // idle
  'eat_1',  'eat_2',                // eat: approach → eating
  'groom_1','groom_2','groom_3',    // groom: paw up → paw on face → licking
  'sad_1',  'sad_2',                // sad state idle
  'stretch_1',                      // stretch ambient
])

// ── Display size per stage ────────────────────────────────────────────────────
const DISPLAY_SIZE = [90, 108, 128, 150, 168, 188]

// ── Speech map ────────────────────────────────────────────────────────────────
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

// ── PNG frame sequences ───────────────────────────────────────────────────────
const FRAME_SEQUENCES = {
  // Core reactions — same art for all stages (original detailed sprites)
  purr:     { frames: ['purr_1', 'purr_2', 'purr_3'],               fps: 3   },
  headbutt: { frames: ['headbutt_1', 'headbutt_2', 'headbutt_3'],   fps: 5   },
  nuzzle:   { frames: ['nuzzle_2', 'nuzzle_2'],                     fps: 2   },
  knead:    { frames: ['knead_1', 'knead_2', 'knead_3', 'knead_2'], fps: 3   },
  // Variant-aware — kitten/adult/elder have their own art
  idle:     { frames: ['idle_1', 'idle_2'],                          fps: 1   },
  eat:      { frames: ['eat_1', 'eat_2', 'eat_2', 'eat_1'],         fps: 2   }, // approach → eat → eat → retreat
  groom:    { frames: ['groom_1', 'groom_2', 'groom_2', 'groom_1'], fps: 1.5 }, // paw up → lick → lick → down
  sad:      { frames: ['sad_1', 'sad_2'],                            fps: 0.8 },
  stretch:  { frames: ['stretch_1'],                                  fps: 1   },
}

// ── CSS-only animations (no PNG frames needed) ────────────────────────────────
const CSS_ANIM_CLASS = {
  wag:   'animate-wag',
  spin:  'animate-spin',
  roll:  'animate-roll',
  knock: 'animate-knock',
  float: 'animate-float',
}

// ── Ambient animation pool — random idle behaviours, grows with intimacy ──────
const AMBIENT_POOL = {
  shy:       [],
  curious:   ['stretch'],
  friendly:  ['stretch', 'groom'],
  attached:  ['stretch', 'groom', 'groom'],
  soulBond:  ['groom', 'stretch', 'groom'],
  legendary: ['groom', 'stretch', 'groom'],
}

const V = 5  // cache-buster — bump when replacing PNGs

export default function CatCharacter({ cat, emotionalState = 'neutral', playAnimation, onAnimationEnd }) {
  const [frameIndex,   setFrameIndex]   = useState(0)
  const [ambientAnim,  setAmbientAnim]  = useState(null)  // random idle ambient
  const [imgFailed,    setImgFailed]    = useState(false)
  const [bubble,       setBubble]       = useState(false)
  const [bubbleText,   setBubbleText]   = useState('')
  const [hasGreeted,   setHasGreeted]   = useState(false)
  const [hearts,       setHearts]       = useState([])
  const idleTimerRef    = useRef(null)
  const actionTimerRef  = useRef(null)
  const ambientTimerRef = useRef(null)

  const stage    = Math.min(cat?.stage ?? 0, 5)
  const size     = DISPLAY_SIZE[stage]
  const color    = cat?.color ?? 'orange'
  const intimacy = cat?.intimacy ?? 0
  const tier     = getIntimacyTier(intimacy)
  const svgMood  = getSvgMood(emotionalState, intimacy)
  const variant  = VARIANT_FOLDERS[stage] ?? 'kitten'

  // ── PNG source — variant-aware ────────────────────────────────────────────
  function pngSrc(frame) {
    const folder = VARIANT_FRAMES.has(frame) ? `orange/${variant}` : 'orange'
    return `/cat/${folder}/${frame}.png?v=${V}`
  }

  // ── Resolve active animation: playAnimation > ambientAnim > idle ──────────
  // State-based override: sad/hungry → show sad frames in idle
  const isSadState = !playAnimation && !ambientAnim &&
                     (emotionalState === 'sad' || emotionalState === 'hungry')
  const activeAnim = playAnimation || ambientAnim || (isSadState ? 'sad' : 'idle')
  const seq        = FRAME_SEQUENCES[activeAnim]
  const isCssOnly  = !seq && !!playAnimation
  const frame      = seq ? seq.frames[frameIndex] : 'idle_1'
  const src        = pngSrc(frame)

  // ── Wrapper micro-animation — layered on top of PNG frames ───────────────
  // Creates natural feel: breathing, bobbing, nodding, etc.
  function getMotionClass() {
    if (isCssOnly)                     return CSS_ANIM_CLASS[playAnimation] ?? 'animate-float'
    if (!hasGreeted && !playAnimation && !ambientAnim) return 'animate-cat-greet'
    if (playAnimation === 'eat')       return 'animate-cat-eat-bob'
    if (ambientAnim === 'groom')       return 'animate-cat-groom-nod'
    if (ambientAnim === 'stretch')     return 'animate-cat-stretch-expand'
    if (isSadState)                    return 'animate-cat-sad-sway'
    if (!playAnimation && !ambientAnim) return 'animate-cat-breathe'
    return ''
  }
  const cssAnimClass = getMotionClass()

  // ── Reset imgFailed when src changes ─────────────────────────────────────
  useEffect(() => { setImgFailed(false) }, [src])

  // ── Greeting badge ────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setHasGreeted(true), 1900)
    return () => clearTimeout(t)
  }, [])

  // ── Floating hearts ───────────────────────────────────────────────────────
  const spawnHearts = useCallback(() => {
    const batch = Array.from({ length: 4 }, (_, i) => ({
      id: Date.now() + i, left: 15 + Math.random() * 70, delay: i * 0.15,
    }))
    setHearts(prev => [...prev, ...batch])
    setTimeout(() => setHearts(prev => prev.filter(h => !batch.some(b => b.id === h.id))), 1600)
  }, [])

  // ── IDLE loop + ambient scheduler ─────────────────────────────────────────
  useEffect(() => {
    if (playAnimation) return

    // Frame cycling
    setFrameIndex(0)
    let idx = 0
    const idleFrames = isSadState
      ? FRAME_SEQUENCES.sad.frames
      : FRAME_SEQUENCES.idle.frames
    idleTimerRef.current = setInterval(() => {
      idx = (idx + 1) % idleFrames.length
      setFrameIndex(idx)
    }, Math.round(1000 / (isSadState ? FRAME_SEQUENCES.sad.fps : FRAME_SEQUENCES.idle.fps)))

    // Ambient scheduler — random behaviour every 25-40 seconds
    const pool = AMBIENT_POOL[tier.key] ?? []
    let ambTimer
    function scheduleAmbient() {
      ambTimer = setTimeout(() => {
        if (!pool.length) { scheduleAmbient(); return }
        const pick     = pool[Math.floor(Math.random() * pool.length)]
        const pickSeq  = FRAME_SEQUENCES[pick]
        if (!pickSeq)  { scheduleAmbient(); return }
        setAmbientAnim(pick)
        setFrameIndex(0)
        const duration = (pickSeq.frames.length / pickSeq.fps) * 1000 + 600
        ambientTimerRef.current = setTimeout(() => {
          setAmbientAnim(null)
          setFrameIndex(0)
          scheduleAmbient()
        }, duration)
      }, 25000 + Math.random() * 15000)
    }
    scheduleAmbient()

    return () => {
      clearInterval(idleTimerRef.current)
      clearTimeout(ambTimer)
      clearTimeout(ambientTimerRef.current)
      setAmbientAnim(null)
    }
  }, [playAnimation, tier.key, isSadState]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Ambient frame cycling ─────────────────────────────────────────────────
  useEffect(() => {
    if (!ambientAnim) return
    const ambSeq = FRAME_SEQUENCES[ambientAnim]
    if (!ambSeq) return
    let idx = 0
    const timer = setInterval(() => {
      idx = (idx + 1) % ambSeq.frames.length
      setFrameIndex(idx)
    }, Math.round(1000 / ambSeq.fps))
    return () => clearInterval(timer)
  }, [ambientAnim])

  // ── ACTION animation ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!playAnimation) return
    clearInterval(idleTimerRef.current)
    clearTimeout(ambientTimerRef.current)
    setAmbientAnim(null)

    // Speech bubble
    const speech = ANIM_SPEECH[playAnimation]
    if (speech) {
      const tierSpeech = tier.speech
      const finalSpeech = intimacy >= 60 && Math.random() < 0.4
        ? tierSpeech[Math.floor(Math.random() * tierSpeech.length)]
        : speech
      setBubbleText(finalSpeech)
      setBubble(true)
      setTimeout(() => setBubble(false), 1900)
    }
    if (intimacy >= 60) spawnHearts()

    const actionSeq = FRAME_SEQUENCES[playAnimation]
    if (!actionSeq) {
      actionTimerRef.current = setTimeout(() => onAnimationEnd?.(), 2400)
      return () => clearTimeout(actionTimerRef.current)
    }

    setFrameIndex(0)
    const interval = Math.round(1000 / actionSeq.fps)
    let idx = 0
    const timer = setInterval(() => {
      idx++
      if (idx >= actionSeq.frames.length) {
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

      <div
        className={cssAnimClass}
        style={{ filter: `drop-shadow(${tier.glow})`, width: size, height: size }}
      >
        {!imgFailed ? (
          <Image
            key={src}
            src={src}
            alt=""
            width={size}
            height={size}
            unoptimized
            draggable={false}
            className="select-none object-contain w-full h-full"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <CatSvg stage={stage} color={color} mood={svgMood} size={size} className="select-none" />
        )}
      </div>

      <div className={`mt-2 px-3 py-0.5 rounded-full text-xs font-semibold transition-all duration-500 ${tier.badgeCls}`}>
        {tier.emoji} {tier.label}
      </div>
    </div>
  )
}
