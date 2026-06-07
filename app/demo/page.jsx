'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import CatSvg from '@/components/Cat/CatSvg'
import { getStageLabel, INTIMACY_TIERS } from '@/lib/catGrowthService'

// Use the same Rive character as the main app
const CatRiveCharacter = dynamic(() => import('@/components/Cat/CatRiveCharacter'), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center text-4xl">🐱</div>,
})

// Stage info — matches StreakCounter's STAGE_EMOJI
const STAGES = [
  { stage: 0, emoji: '🐣', label: '아기',         days: '0일',   desc: '방금 태어난 아기 고양이예요',         size: 80  },
  { stage: 1, emoji: '🐱', label: '아기 고양이',   days: '10일',  desc: '호기심 가득한 아기 고양이예요',       size: 100 },
  { stage: 2, emoji: '🐈', label: '청소년',        days: '20일',  desc: '활발하게 뛰어다녀요',                size: 120 },
  { stage: 3, emoji: '😸', label: '성인',          days: '30일',  desc: '든든하고 믿음직스러운 고양이예요',    size: 140 },
  { stage: 4, emoji: '🦁', label: '현명한 고양이', days: '40일',  desc: '깊은 눈빛의 지혜로운 고양이예요',    size: 160 },
  { stage: 5, emoji: '👑', label: '전설',          days: '50일',  desc: '전설이 된 특별한 고양이예요',        size: 180 },
]

const ANIMS = ['purr', 'eat', 'headbutt', 'nuzzle', 'knead', 'wag', 'spin']

export default function DemoPage() {
  const [stage,    setStage]    = useState(0)
  const [anim,     setAnim]     = useState(null)
  const [intimacy, setIntimacy] = useState(5)
  const [autoPlay, setAutoPlay] = useState(false)

  const stageInfo = STAGES[stage]

  // Auto-cycle through stages
  useEffect(() => {
    if (!autoPlay) return
    const t = setInterval(() => {
      setStage(s => (s + 1) % 6)
    }, 2000)
    return () => clearInterval(t)
  }, [autoPlay])

  const fakeCat = {
    name: '뿌리',
    color: 'orange',
    stage,
    intimacy,
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center py-8 px-4 gap-6">

      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-extrabold text-gray-700">🐱 성장 단계 미리보기</h1>
        <p className="text-sm text-gray-400 mt-1">매일 일기를 쓰면 고양이가 자라요</p>
      </div>

      {/* Main cat display */}
      <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center gap-4 w-full max-w-xs">

        {/* Stage indicator */}
        <div className="flex items-center gap-2">
          <span className="text-3xl">{stageInfo.emoji}</span>
          <div>
            <p className="text-lg font-extrabold text-gray-700">{stageInfo.label}</p>
            <p className="text-xs text-gray-400">{stageInfo.days} 작성 후 달성</p>
          </div>
        </div>

        {/* Rive cat — size scales with stage */}
        <div
          className="relative flex items-center justify-center transition-all duration-500"
          style={{ width: stageInfo.size, height: stageInfo.size }}
        >
          <CatRiveCharacter
            cat={fakeCat}
            emotionalState="happy"
            playAnimation={anim}
            onAnimationEnd={() => setAnim(null)}
          />
        </div>

        <p className="text-sm text-gray-500 text-center leading-relaxed">{stageInfo.desc}</p>
      </div>

      {/* Stage selector — all 6 stages as cards */}
      <div className="w-full max-w-xs">
        <p className="text-xs font-bold text-gray-500 mb-3 text-center uppercase tracking-widest">
          성장 단계 선택
        </p>
        <div className="grid grid-cols-3 gap-2.5">
          {STAGES.map(s => (
            <button
              key={s.stage}
              onClick={() => { setStage(s.stage); setAutoPlay(false) }}
              className={`rounded-2xl p-3 flex flex-col items-center gap-1 transition-all active:scale-95
                ${stage === s.stage
                  ? 'bg-lavender text-white shadow-md scale-105'
                  : 'bg-white text-gray-600 shadow-sm border border-gray-100 hover:shadow-md'}`}
            >
              <span className="text-2xl">{s.emoji}</span>
              <p className={`text-[11px] font-bold ${stage === s.stage ? 'text-white' : 'text-gray-600'}`}>
                {s.label}
              </p>
              <p className={`text-[9px] ${stage === s.stage ? 'text-white/80' : 'text-gray-400'}`}>
                {s.days}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Auto-cycle button */}
      <button
        onClick={() => setAutoPlay(v => !v)}
        className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all active:scale-95
          ${autoPlay
            ? 'bg-pink-500 text-white shadow-md'
            : 'bg-white text-lavender border border-lavender/40 shadow-sm'}`}
      >
        {autoPlay ? '⏸ 자동 재생 중...' : '▶ 자동으로 성장 보기'}
      </button>

      {/* Growth journey bar */}
      <div className="w-full max-w-xs bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <p className="text-xs font-bold text-gray-500 mb-3 text-center">성장 여정</p>
        <div className="flex items-center justify-between">
          {STAGES.map((s, i) => (
            <div key={s.stage} className="flex items-center">
              <button
                onClick={() => setStage(s.stage)}
                className={`flex flex-col items-center transition-all active:scale-90
                  ${stage === s.stage ? 'scale-110' : 'opacity-50'}`}
              >
                <span className="text-xl">{s.emoji}</span>
              </button>
              {i < 5 && (
                <div className={`w-4 h-0.5 mx-0.5 rounded-full transition-all
                  ${s.stage < stage ? 'bg-lavender' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
        <p className="text-[10px] text-gray-400 text-center mt-2">
          현재 단계: {stageInfo.emoji} {stageInfo.label}
        </p>
      </div>

      {/* Animation triggers */}
      <div className="w-full max-w-xs bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <p className="text-xs font-bold text-gray-500 mb-3 text-center uppercase tracking-widest">
          애니메이션 테스트
        </p>
        <div className="grid grid-cols-4 gap-2">
          {ANIMS.map(a => (
            <button
              key={a}
              onClick={() => setAnim(a)}
              className="py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-700
                         active:scale-90 transition-transform hover:bg-amber-100"
            >
              {a === 'purr' ? '😻' :
               a === 'eat'  ? '🍽️' :
               a === 'headbutt' ? '💛' :
               a === 'nuzzle' ? '🧡' :
               a === 'knead' ? '🍞' :
               a === 'wag' ? '🐾' :
               a === 'spin' ? '🌀' : '✨'}
              <br/>
              <span className="text-[9px]">{a}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Intimacy slider */}
      <div className="w-full max-w-xs bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <p className="text-xs font-bold text-gray-500 mb-1 text-center">
          친밀도 — {intimacy}
        </p>
        <input
          type="range" min="0" max="100" value={intimacy}
          onChange={e => setIntimacy(Number(e.target.value))}
          className="w-full accent-lavender"
        />
        <div className="flex flex-wrap gap-1.5 mt-2 justify-center">
          {INTIMACY_TIERS.map(t => (
            <button key={t.key} onClick={() => setIntimacy(t.min)}
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-all
                ${intimacy >= t.min && intimacy <= t.max ? t.badgeCls : 'bg-gray-100 text-gray-400'}`}>
              {t.emoji}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-300 pb-6">MeowMind · 성장 단계 미리보기</p>
    </div>
  )
}
