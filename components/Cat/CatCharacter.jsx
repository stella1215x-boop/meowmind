'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect, useRef } from 'react'

// lottie-react 는 SSR 불가 → 클라이언트 전용 동적 import
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

// stage 별 표시 크기 (px) — 성장감 시각화
const DISPLAY_SIZE = [90, 108, 128, 150, 168, 188]

// 고양이 색상별 CSS 필터 (단일 Lottie를 색상 틴트로 구분)
const COLOR_FILTER = {
  orange: 'sepia(1) hue-rotate(330deg) saturate(4) brightness(1.15)',
  grey:   'brightness(0.85) saturate(0.6)',
  white:  'brightness(4) saturate(0.15)',
}

// 감정 별 재생 속도 & drop-shadow
const EMOTION_CFG = {
  happy:   { speed: 1.2,  shadow: '0 0 32px rgba(253,224,71,0.70)',  badge: '😸 행복해요',   badgeCls: 'bg-yellow-100 text-yellow-700' },
  neutral: { speed: 0.9,  shadow: '0 0 20px rgba(195,177,225,0.50)', badge: '🐱 기다려요',   badgeCls: 'bg-purple-100 text-purple-600' },
  sad:     { speed: 0.5,  shadow: '0 0 24px rgba(147,197,253,0.60)', badge: '😿 보고싶어요', badgeCls: 'bg-blue-100 text-blue-600'     },
  hungry:  { speed: 1.6,  shadow: '0 0 32px rgba(251,146,60,0.70)',  badge: '😾 배고파요',   badgeCls: 'bg-orange-100 text-orange-600' },
}

// 감정 파티클 이모지
const PARTICLES = {
  happy:   ['✨','💛','⭐','💫','🌟'],
  sad:     ['💧','💧','💧'],
  hungry:  ['🍽️','💭'],
  neutral: [],
}

const ANIM_SPEECH = {
  purr:  '그르릉... 😻',
  wag:   '꼬리가 신나요! 🐾',
  spin:  '빙글빙글~ 🌀',
  roll:  '배를 보여줘요 🐱',
  knock: '탁! 떨어뜨렸어요 😈',
  eat:   '냠냠~ 맛있어요! 🍽️',
}

export default function CatCharacter({ cat, emotionalState = 'neutral', playAnimation, onAnimationEnd }) {
  const lottieRef  = useRef(null)
  const [animData, setAnimData]   = useState(null)
  const [currentAnim, setCurrentAnim] = useState(null)
  const [bubble,   setBubble]     = useState(false)
  const [hasGreeted, setHasGreeted] = useState(false)

  const stage       = Math.min(cat?.stage ?? 0, 5)
  const size        = DISPLAY_SIZE[stage]
  const emo         = EMOTION_CFG[emotionalState] ?? EMOTION_CFG.neutral
  const parts       = PARTICLES[emotionalState] ?? []
  const colorFilter = COLOR_FILTER[cat?.color] ?? COLOR_FILTER.grey

  // Lottie JSON 로드 (370KB → 번들에 포함하지 않고 런타임 fetch)
  useEffect(() => {
    fetch('/cats/cat-lottie-nobg.json')
      .then(r => r.json())
      .then(setAnimData)
      .catch(console.error)
  }, [])

  // 애니메이션 재생 속도 (감정 반영)
  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(emo.speed)
    }
  }, [emotionalState, animData, emo.speed])

  // 첫 등장
  useEffect(() => {
    const t = setTimeout(() => setHasGreeted(true), 1900)
    return () => clearTimeout(t)
  }, [])

  // 리액션 애니메이션 (CSS 클래스로 wrapper 에 적용)
  useEffect(() => {
    if (!playAnimation) return
    setCurrentAnim(playAnimation)
    setBubble(true)
    const tb = setTimeout(() => setBubble(false), 1800)
    const te = setTimeout(() => { setCurrentAnim(null); onAnimationEnd?.() }, 2300)
    return () => { clearTimeout(tb); clearTimeout(te) }
  }, [playAnimation]) // eslint-disable-line

  const wrapAnim =
    currentAnim === 'purr'  ? 'animate-purr'      :
    currentAnim === 'spin'  ? 'animate-spin'       :
    currentAnim === 'roll'  ? 'animate-roll'       :
    currentAnim === 'knock' ? 'animate-knock'      :
    currentAnim === 'wag'   ? 'animate-wag'        :
    currentAnim === 'eat'   ? 'animate-eat'        :
    !hasGreeted              ? 'animate-cat-greet' :
    emotionalState === 'happy' ? 'animate-float'   : ''

  return (
    <div className="relative flex flex-col items-center"
      style={{ width: size, minHeight: size + 52 }}>

      {/* 말풍선 */}
      {bubble && currentAnim && (
        <div className="absolute z-20 animate-milestone-pop"
          style={{ top: -52, left: '50%', transform: 'translateX(-50%)' }}>
          <div className="bg-white rounded-2xl px-3 py-2 shadow-lg border border-gray-100 whitespace-nowrap">
            <p className="text-sm font-bold text-gray-700">{ANIM_SPEECH[currentAnim]}</p>
          </div>
          <div className="w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45 mx-auto -mt-1.5" />
        </div>
      )}

      {/* 감정 파티클 */}
      {parts.map((icon, i) => (
        <span key={i}
          className="absolute text-base pointer-events-none z-10 animate-float select-none"
          style={{
            left:           `${5 + i * (90 / Math.max(parts.length, 1))}%`,
            top:            -22,
            animationDelay: `${i * 0.3}s`,
          }}>
          {icon}
        </span>
      ))}

      {/* Stage 데코 */}
      {stage >= 5 && (
        <div className="absolute z-10 text-2xl select-none drop-shadow"
          style={{ top: -18, left: '50%', transform: 'translateX(-50%)' }}>
          👑
        </div>
      )}
      {stage === 4 && (
        <div className="absolute z-10 text-xl select-none drop-shadow" style={{ top: -6, right: -8 }}>
          ⭐
        </div>
      )}

      {/* Lottie 고양이 애니메이션 */}
      <div
        className={wrapAnim}
        style={{ filter: `${colorFilter} drop-shadow(${emo.shadow})`, width: size, height: size }}
      >
        {animData ? (
          <Lottie
            lottieRef={lottieRef}
            animationData={animData}
            loop
            autoplay
            style={{ width: size, height: size }}
          />
        ) : (
          /* 로딩 중 */
          <div className="flex items-center justify-center text-5xl animate-bounce-slow"
            style={{ width: size, height: size }}>
            🐱
          </div>
        )}
      </div>

      {/* 감정 배지 */}
      <div className={`mt-2 px-3 py-0.5 rounded-full text-xs font-semibold transition-all duration-300 ${emo.badgeCls}`}>
        {emo.badge}
      </div>
    </div>
  )
}
