'use client'

import { useState } from 'react'

const FEATURES = [
  { emoji: '🎭', title: '시즌 한정 고양이',   desc: '벚꽃, 할로윈, 크리스마스 스킨' },
  { emoji: '📊', title: '고급 인사이트',       desc: '무드 상관관계 · 단어 트렌드 분석' },
  { emoji: '🔔', title: '맞춤 리마인더',       desc: '최대 3개 알림 시간 설정' },
  { emoji: '🌈', title: '고양이 배경 테마',    desc: '집, 정원, 우주 등 6가지 배경' },
]

export default function PremiumModal({ onClose, catName }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubscribe() {
    setLoading(true)
    // TODO: Stripe checkout session 연동
    // 현재는 coming-soon 처리
    await new Promise((r) => setTimeout(r, 1000))
    setDone(true)
    setLoading(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-mobile bg-white rounded-t-3xl p-6 pb-safe animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

        {done ? (
          <div className="flex flex-col items-center py-6 text-center gap-3">
            <div className="text-5xl">🎉</div>
            <h2 className="text-xl font-extrabold text-gray-700">곧 만나요!</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              프리미엄은 준비 중이에요.<br />출시 알림을 받아볼게요!
            </p>
            <button
              onClick={onClose}
              className="mt-2 w-full bg-lavender text-white rounded-2xl py-3.5 font-bold"
            >
              확인
            </button>
          </div>
        ) : (
          <>
            {/* 헤더 */}
            <div className="flex flex-col items-center mb-5">
              <div className="text-4xl mb-2">👑</div>
              <h2 className="text-xl font-extrabold text-gray-700">MeowMind Premium</h2>
              <p className="text-sm text-gray-400 mt-1">
                {catName}와 더 깊이 성장해요
              </p>
            </div>

            {/* 기능 목록 */}
            <div className="space-y-2.5 mb-5">
              {FEATURES.map(({ emoji, title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">{emoji}</span>
                  <div>
                    <p className="text-sm font-bold text-gray-700">{title}</p>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </div>
                  <span className="ml-auto text-green-400 text-lg flex-shrink-0">✓</span>
                </div>
              ))}
            </div>

            {/* 가격 */}
            <div className="bg-lavender/10 rounded-2xl p-4 mb-5 text-center">
              <p className="text-3xl font-extrabold text-lavender">₩6,900</p>
              <p className="text-xs text-gray-400 mt-0.5">/ 월 · 언제든지 해지 가능</p>
            </div>

            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full bg-lavender text-white rounded-2xl py-3.5 font-bold text-base active:scale-95 transition-all disabled:opacity-70 shadow-md"
            >
              {loading ? '처리 중…' : '프리미엄 시작하기 👑'}
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 text-sm text-gray-400 font-medium mt-1"
            >
              나중에
            </button>
          </>
        )}
      </div>
    </div>
  )
}
