'use client'

import { useState } from 'react'
import PremiumModal from './PremiumModal'

export default function PremiumSection({ isPremium, catName }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div className="bg-gradient-to-r from-lavender/20 to-mint/20 rounded-2xl border border-lavender/20 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-lavender/10">
          <span className="text-[11px] font-bold text-lavender uppercase tracking-wider">프리미엄</span>
        </div>

        {isPremium ? (
          <div className="flex items-center justify-between px-4 py-3.5">
            <div>
              <p className="text-sm font-bold text-gray-700">프리미엄 이용 중 👑</p>
              <p className="text-xs text-gray-400 mt-0.5">모든 시즌 고양이를 사용할 수 있어요</p>
            </div>
            <span className="text-xs font-semibold text-lavender bg-lavender/10 px-2.5 py-1 rounded-full">활성</span>
          </div>
        ) : (
          <button
            onClick={() => setShowModal(true)}
            className="w-full flex items-center justify-between px-4 py-3.5 text-left active:bg-lavender/5 transition-colors"
          >
            <div>
              <p className="text-sm font-bold text-gray-700">프리미엄으로 업그레이드</p>
              <p className="text-xs text-gray-400 mt-0.5">시즌 고양이 · 고급 인사이트 · ₩6,900/월</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-300 flex-shrink-0">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>

      {showModal && (
        <PremiumModal catName={catName} onClose={() => setShowModal(false)} />
      )}
    </>
  )
}
