'use client'

import { useState } from 'react'
import useCatStore from '@/store/useCatStore'

const SHOP_ITEMS = [
  { id: 'snack', name: '고양이 간식', emoji: '🐟', cost: 30, quantity: 1,  desc: '한 번 먹일 수 있어요' },
  { id: 'meal',  name: '고양이 밥',   emoji: '🍱', cost: 80, quantity: 3,  desc: '3번 먹일 수 있어요 · 30% 절약' },
]

export default function CoinPanel() {
  const { cat, feedCat, buyFood, playAnimation } = useCatStore()
  const coins    = cat?.coins    ?? 0
  const foodCount = cat?.foodCount ?? 0

  const [shopOpen, setShopOpen]   = useState(false)
  const [buying,   setBuying]     = useState(null)   // itemId being purchased
  const [feeding,  setFeeding]    = useState(false)
  const [toast,    setToast]      = useState(null)   // { msg, type }

  function showToast(msg, type = 'ok') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2200)
  }

  async function handleBuy(item) {
    if (coins < item.cost) { showToast('코인이 부족해요 🪙', 'err'); return }
    setBuying(item.id)
    const result = await buyFood(item.id)
    setBuying(null)
    if (result.success) {
      showToast(`${item.name} 구매 완료! +${item.quantity}개 🎉`)
      if (item.quantity === 3) setShopOpen(false)
    } else {
      showToast(result.error === 'Not enough coins' ? '코인이 부족해요 🪙' : '잠시 후 다시 시도해 주세요', 'err')
    }
  }

  async function handleFeed() {
    if (foodCount <= 0 || playAnimation || feeding) return
    setFeeding(true)
    await feedCat()
    showToast(`${cat?.name}가 냠냠 먹었어요 😸`)
    setTimeout(() => setFeeding(false), 2400)
  }

  return (
    <div className="w-full">
      {/* ── 메인 패널 ── */}
      <div className="flex items-center gap-2 bg-white/80 rounded-2xl px-4 py-3 shadow-sm border border-gray-100">

        {/* 코인 잔고 */}
        <div className="flex items-center gap-1.5 flex-1">
          <span className="text-xl">🪙</span>
          <div>
            <p className="text-xs text-gray-400 leading-none">코인</p>
            <p className="text-base font-extrabold text-yellow-600 leading-tight">{coins}</p>
          </div>
        </div>

        {/* 음식 잔고 */}
        <div className="flex items-center gap-1.5 flex-1">
          <span className="text-xl">🐟</span>
          <div>
            <p className="text-xs text-gray-400 leading-none">간식</p>
            <p className="text-base font-extrabold text-orange-500 leading-tight">{foodCount}개</p>
          </div>
        </div>

        {/* 구매 버튼 */}
        <button
          onClick={() => setShopOpen(v => !v)}
          className="px-3 py-1.5 rounded-xl bg-lavender/20 text-lavender text-xs font-bold
                     active:scale-95 transition-transform border border-lavender/30"
        >
          상점 🛒
        </button>

        {/* 밥 주기 버튼 */}
        <button
          onClick={handleFeed}
          disabled={foodCount <= 0 || !!playAnimation || feeding}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95
            ${foodCount > 0 && !playAnimation && !feeding
              ? 'bg-mint/30 text-green-700 border border-mint/50'
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
        >
          {feeding ? '먹는 중...' : '밥 주기 🍽️'}
        </button>
      </div>

      {/* ── 상점 드롭다운 ── */}
      {shopOpen && (
        <div className="mt-2 bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden animate-milestone-pop">
          <div className="px-4 pt-3 pb-1 flex items-center justify-between">
            <p className="text-sm font-extrabold text-gray-700">🛒 간식 상점</p>
            <p className="text-xs text-gray-400">보유 코인: <span className="text-yellow-600 font-bold">{coins}🪙</span></p>
          </div>

          <div className="divide-y divide-gray-50">
            {SHOP_ITEMS.map(item => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                <span className="text-2xl">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-700">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
                <button
                  onClick={() => handleBuy(item)}
                  disabled={buying === item.id || coins < item.cost}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all active:scale-95
                    ${coins >= item.cost
                      ? 'bg-yellow-400/90 text-yellow-900 hover:bg-yellow-400'
                      : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                    }`}
                >
                  {buying === item.id ? '...' : `${item.cost}🪙`}
                </button>
              </div>
            ))}
          </div>

          <div className="px-4 py-2 bg-cream/60">
            <p className="text-[10px] text-gray-400 text-center">
              매일 3문장을 쓰면 <span className="text-yellow-600 font-bold">30코인</span>이 쌓여요 ✍️
            </p>
          </div>
        </div>
      )}

      {/* ── 토스트 ── */}
      {toast && (
        <div className={`mt-2 text-center text-sm font-bold px-4 py-2 rounded-2xl animate-milestone-pop
          ${toast.type === 'err' ? 'bg-red-50 text-red-500' : 'bg-mint/30 text-green-700'}`}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}
