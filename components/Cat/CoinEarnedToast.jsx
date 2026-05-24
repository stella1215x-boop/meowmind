'use client'

import { useEffect } from 'react'
import useCatStore from '@/store/useCatStore'

export default function CoinEarnedToast() {
  const { coinsEarned, clearCoinsEarned } = useCatStore()

  useEffect(() => {
    if (!coinsEarned) return
    const t = setTimeout(clearCoinsEarned, 2800)
    return () => clearTimeout(t)
  }, [coinsEarned]) // eslint-disable-line

  if (!coinsEarned) return null

  const { amount, streakBonus } = coinsEarned

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center gap-1.5">
      {/* 메인 코인 획득 배지 */}
      <div className="animate-coin-pop bg-yellow-400 text-yellow-900 font-extrabold
                      rounded-2xl px-5 py-2.5 shadow-lg text-base flex items-center gap-2">
        <span>🪙</span>
        <span>+{amount} 코인 획득!</span>
      </div>

      {/* 스트릭 보너스 있을 때만 */}
      {streakBonus > 0 && (
        <div className="animate-coin-pop bg-purple-400 text-white font-bold
                        rounded-xl px-4 py-1.5 shadow text-sm flex items-center gap-1.5"
             style={{ animationDelay: '0.15s' }}>
          <span>🔥</span>
          <span>스트릭 보너스 +{streakBonus}</span>
        </div>
      )}
    </div>
  )
}
