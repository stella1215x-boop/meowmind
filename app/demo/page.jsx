'use client'

import { useState } from 'react'
import CatCharacter from '@/components/Cat/CatCharacter'

const COLORS    = ['orange', 'grey', 'white']
const EMOTIONS  = ['happy', 'neutral', 'sad', 'hungry']
const ANIMS     = ['purr', 'wag', 'spin', 'roll', 'knock']
const ANIM_LABELS = { purr: '그르릉 😻', wag: '꼬리 흔들기 🐾', spin: '빙글빙글 🌀', roll: '배 뒤집기 🐱', knock: '탁! 😈' }

export default function DemoPage() {
  const [stage,   setStage]   = useState(0)
  const [color,   setColor]   = useState('orange')
  const [emotion, setEmotion] = useState('happy')
  const [anim,    setAnim]    = useState(null)
  const [animKey, setAnimKey] = useState(0)

  function triggerAnim(a) {
    setAnim(a)
    setAnimKey(k => k + 1)
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center py-10 px-5 gap-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-700">🐱 NAVI 미리보기</h1>
        <p className="text-sm text-gray-400 mt-1">MeowMind 고양이 캐릭터 데모</p>
      </div>

      {/* Live cat */}
      <div className="bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center gap-4 w-full max-w-xs">
        <CatCharacter
          key={`${color}-${stage}-${animKey}`}
          cat={{ name: 'NAVI', color, stage }}
          emotionalState={emotion}
          playAnimation={anim}
          onAnimationEnd={() => setAnim(null)}
        />
        <p className="text-xs text-gray-400 font-semibold tracking-wide uppercase">
          stage {stage} · {color} · {emotion}
        </p>
      </div>

      {/* Controls */}
      <div className="w-full max-w-xs flex flex-col gap-5">

        {/* Stage */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">성장 단계</p>
          <div className="flex gap-2 flex-wrap">
            {[0,1,2,3,4,5].map(s => (
              <button
                key={s}
                onClick={() => setStage(s)}
                className={`flex-1 py-1.5 rounded-xl text-sm font-bold transition-all ${
                  stage === s
                    ? 'bg-lavender text-white shadow-sm'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            {['아기 고양이','자라는 중','장난꾸러기','어른 고양이','현명한 고양이','전설의 고양이'][stage]}
          </p>
        </div>

        {/* Color */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">색상</p>
          <div className="flex gap-2">
            {COLORS.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`flex-1 py-1.5 rounded-xl text-sm font-bold capitalize transition-all ${
                  color === c
                    ? 'bg-lavender text-white shadow-sm'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {c === 'orange' ? '🟠' : c === 'grey' ? '⚪' : '🤍'} {c}
              </button>
            ))}
          </div>
        </div>

        {/* Emotion */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">감정 상태</p>
          <div className="grid grid-cols-2 gap-2">
            {EMOTIONS.map(e => (
              <button
                key={e}
                onClick={() => setEmotion(e)}
                className={`py-1.5 rounded-xl text-sm font-bold capitalize transition-all ${
                  emotion === e
                    ? 'bg-mint text-gray-700 shadow-sm'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {e === 'happy' ? '😊 happy' : e === 'neutral' ? '😐 neutral' : e === 'sad' ? '😢 sad' : '😋 hungry'}
              </button>
            ))}
          </div>
        </div>

        {/* Trigger animations */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">반응 애니메이션</p>
          <div className="grid grid-cols-1 gap-2">
            {ANIMS.map(a => (
              <button
                key={a}
                onClick={() => triggerAnim(a)}
                className="w-full py-2 rounded-xl text-sm font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 active:scale-95 transition-all"
              >
                {ANIM_LABELS[a]}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* All stages preview */}
      <div className="w-full max-w-sm">
        <p className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wide text-center">모든 단계 미리보기</p>
        <div className="grid grid-cols-3 gap-3">
          {[0,1,2,3,4,5].map(s => (
            <button
              key={s}
              onClick={() => setStage(s)}
              className={`bg-white rounded-2xl p-3 flex flex-col items-center gap-1 shadow-sm transition-all ${
                stage === s ? 'ring-2 ring-lavender' : 'hover:shadow-md'
              }`}
            >
              <CatCharacter cat={{ name: 'NAVI', color, stage: s }} emotionalState="neutral" />
              <p className="text-xs text-gray-500 font-semibold">Stage {s}</p>
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-300 pb-4">MeowMind · 인증 없이 미리보기</p>
    </div>
  )
}
