'use client'

import { useState } from 'react'
import PremiumModal from '@/components/shared/PremiumModal'

export default function SeasonalBanner({ season, isPremium, catName, totalDaysWritten }) {
  const [showPremium, setShowPremium] = useState(false)

  if (!season) return null
  // Only show banner after Day 7
  if (totalDaysWritten < 7) return null

  return (
    <>
      <div
        className={`mx-0 mb-4 bg-gradient-to-r ${season.bgClass} border border-gray-100 rounded-2xl p-3.5 flex items-center gap-3 shadow-sm`}
        onClick={() => !isPremium && setShowPremium(true)}
        role={!isPremium ? 'button' : undefined}
      >
        <span className="text-3xl flex-shrink-0">{season.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-extrabold text-gray-700 truncate">{season.name} 등장!</p>
          <p className="text-xs text-gray-400 truncate">{season.description}</p>
        </div>
        {isPremium ? (
          <span className="text-xs font-bold text-white bg-lavender px-2.5 py-1 rounded-full flex-shrink-0">사용 중</span>
        ) : (
          <span className="text-xs font-bold text-lavender border border-lavender px-2.5 py-1 rounded-full flex-shrink-0">프리미엄 👑</span>
        )}
      </div>

      {showPremium && (
        <PremiumModal catName={catName} onClose={() => setShowPremium(false)} />
      )}
    </>
  )
}
