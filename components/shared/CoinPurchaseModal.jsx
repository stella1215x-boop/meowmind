'use client'

import { useState } from 'react'
import { COIN_PACKAGES } from '@/lib/coinPackages'

export default function CoinPurchaseModal({ onClose }) {
  const [loading, setLoading] = useState(null)  // packageId being processed
  const [error,   setError]   = useState(null)

  async function handleBuy(pkg) {
    setLoading(pkg.id)
    setError(null)
    try {
      const res = await fetch('/api/payment/checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ packageId: pkg.id }),
      })
      if (!res.ok) {
        const e = await res.json()
        setError(e.error ?? '결제를 시작할 수 없어요')
        return
      }
      const { url } = await res.json()
      // Redirect to Stripe Checkout
      window.location.href = url
    } catch {
      setError('네트워크 오류가 발생했어요')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center
                    bg-black/40 backdrop-blur-sm"
         onClick={onClose}>
      <div className="w-full max-w-mobile bg-white rounded-t-3xl
                      shadow-2xl animate-slide-up pb-safe"
           onClick={e => e.stopPropagation()}>

        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-gray-800">🪙 코인 충전</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                코인으로 고양이에게 사랑을 표현해요
              </p>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center
                         text-gray-400 active:scale-90 transition-transform text-lg">
              ✕
            </button>
          </div>
        </div>

        {/* Packages */}
        <div className="px-5 py-4 space-y-3">
          {COIN_PACKAGES.map(pkg => (
            <button
              key={pkg.id}
              onClick={() => handleBuy(pkg)}
              disabled={!!loading}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2
                          transition-all active:scale-[0.98]
                ${loading === pkg.id
                  ? 'border-lavender bg-lavender/5 opacity-80'
                  : 'border-gray-100 bg-white hover:border-lavender/40 hover:bg-lavender/5 shadow-sm'}`}
            >
              {/* Emoji */}
              <span className="text-3xl flex-shrink-0">{pkg.emoji}</span>

              {/* Info */}
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <p className="font-extrabold text-gray-800">{pkg.label}</p>
                  {pkg.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full
                                     bg-pink-100 text-pink-600">
                      {pkg.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{pkg.description}</p>
              </div>

              {/* Price */}
              <div className="flex-shrink-0 text-right">
                {loading === pkg.id ? (
                  <span className="text-sm text-lavender font-bold">결제 중...</span>
                ) : (
                  <>
                    <p className="font-extrabold text-lavender text-base">
                      ₩{pkg.priceKRW.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      ≈ ${(pkg.priceKRW / 1300).toFixed(2)}
                    </p>
                  </>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mx-5 mb-2 px-4 py-2.5 bg-red-50 rounded-2xl text-xs text-red-500 font-semibold">
            {error}
          </div>
        )}

        {/* Footer note */}
        <div className="px-5 pb-6 pt-1">
          <p className="text-[10px] text-gray-400 text-center leading-relaxed">
            안전한 결제 · 카드/KakaoPay/Naver Pay 지원<br />
            결제 후 즉시 코인이 지급됩니다
          </p>
        </div>
      </div>
    </div>
  )
}
