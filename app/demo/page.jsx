'use client'

import { useState } from 'react'
import CatCharacter from '@/components/Cat/CatCharacter'
import CatSvg from '@/components/Cat/CatSvg'
import IntimacyMeter from '@/components/Cat/IntimacyMeter'
import { getStageLabel, INTIMACY_TIERS } from '@/lib/catGrowthService'

const COLORS    = ['orange', 'grey', 'white']
const EMOTIONS  = ['happy', 'neutral', 'sad', 'hungry']
const ALL_ANIMS = ['purr', 'wag', 'spin', 'roll', 'knock', 'eat', 'headbutt', 'nuzzle', 'knead']
const ANIM_LABELS = {
  purr:     'Purr 😻',
  wag:      'Tail Wag 🐾',
  spin:     'Spin 🌀',
  roll:     'Roll 🐱',
  knock:    'Knock 😈',
  eat:      'Eat 🍽️',
  headbutt: 'Head-butt 💛',
  nuzzle:   'Nuzzle 🧡',
  knead:    'Knead 🍞',
}

export default function DemoPage() {
  const [stage,    setStage]    = useState(0)
  const [color,    setColor]    = useState('orange')
  const [emotion,  setEmotion]  = useState('happy')
  const [intimacy, setIntimacy] = useState(0)
  const [anim,     setAnim]     = useState(null)
  const [animKey,  setAnimKey]  = useState(0)

  function triggerAnim(a) {
    setAnim(a)
    setAnimKey(k => k + 1)
  }

  const fakeCat = { name: 'NAVI', color, stage, intimacy }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center py-10 px-5 gap-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-700">🐱 NAVI Preview</h1>
        <p className="text-sm text-gray-400 mt-1">MeowMind cat character demo</p>
      </div>

      {/* Live cat */}
      <div className="bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center gap-5 w-full max-w-xs">
        <CatCharacter
          key={`${color}-${stage}-${animKey}`}
          cat={fakeCat}
          emotionalState={emotion}
          playAnimation={anim}
          onAnimationEnd={() => setAnim(null)}
        />
        <IntimacyMeter intimacy={intimacy} />
        <p className="text-xs text-gray-400 font-semibold tracking-wide uppercase">
          Stage {stage} · {color} · {emotion}
        </p>
      </div>

      {/* Controls */}
      <div className="w-full max-w-xs flex flex-col gap-5">

        {/* Stage */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">Growth Stage</p>
          <div className="flex gap-2 flex-wrap">
            {[0,1,2,3,4,5].map(s => (
              <button key={s} onClick={() => setStage(s)}
                className={`flex-1 py-1.5 rounded-xl text-sm font-bold transition-all ${
                  stage === s ? 'bg-lavender text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}>
                {s}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center font-medium">{getStageLabel(stage)}</p>
        </div>

        {/* Intimacy */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">
            Intimacy — {intimacy}
          </p>
          <input
            type="range" min="0" max="100" value={intimacy}
            onChange={e => setIntimacy(Number(e.target.value))}
            className="w-full accent-lavender"
          />
          <div className="flex justify-between mt-2 flex-wrap gap-1">
            {INTIMACY_TIERS.map(t => (
              <button key={t.key}
                onClick={() => setIntimacy(t.min)}
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-all ${
                  intimacy >= t.min && intimacy <= t.max ? t.badgeCls : 'bg-gray-100 text-gray-400'
                }`}>
                {t.emoji} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">Color</p>
          <div className="flex gap-2">
            {COLORS.map(c => (
              <button key={c} onClick={() => setColor(c)}
                className={`flex-1 py-1.5 rounded-xl text-sm font-bold capitalize transition-all ${
                  color === c ? 'bg-lavender text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}>
                {c === 'orange' ? '🟠' : c === 'grey' ? '⚫' : '⬜'} {c}
              </button>
            ))}
          </div>
        </div>

        {/* Emotion */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">Emotional State</p>
          <div className="grid grid-cols-2 gap-2">
            {EMOTIONS.map(e => (
              <button key={e} onClick={() => setEmotion(e)}
                className={`py-1.5 rounded-xl text-sm font-bold capitalize transition-all ${
                  emotion === e ? 'bg-mint text-gray-700 shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}>
                {e === 'happy' ? '😊' : e === 'neutral' ? '😐' : e === 'sad' ? '😢' : '😋'} {e}
              </button>
            ))}
          </div>
        </div>

        {/* Animations */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">Trigger Animation</p>
          <div className="grid grid-cols-3 gap-2">
            {ALL_ANIMS.map(a => (
              <button key={a} onClick={() => triggerAnim(a)}
                className="py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 active:scale-95 transition-all">
                {ANIM_LABELS[a]}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* All stages preview */}
      <div className="w-full max-w-sm">
        <p className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wide text-center">All Stages</p>
        <div className="grid grid-cols-3 gap-3">
          {[0,1,2,3,4,5].map(s => (
            <button key={s} onClick={() => setStage(s)}
              className={`bg-white rounded-2xl p-3 flex flex-col items-center gap-1 shadow-sm transition-all ${
                stage === s ? 'ring-2 ring-lavender' : 'hover:shadow-md'
              }`}>
              <CatSvg stage={s} color={color} mood="neutral" size={72} />
              <p className="text-xs text-gray-500 font-semibold">Stage {s}</p>
              <p className="text-[10px] text-gray-400">{getStageLabel(s)}</p>
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-300 pb-4">MeowMind · Cat Character Preview</p>
    </div>
  )
}
