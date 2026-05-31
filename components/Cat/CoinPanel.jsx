'use client'

import { useState } from 'react'
import useCatStore from '@/store/useCatStore'

const SHOP_ITEMS = [
  { id: 'snack', name: '고양이 간식', emoji: '🐟', cost: 30, quantity: 1,  desc: '한 번 먹일 수 있어요' },
  { id: 'meal',  name: '고양이 밥',   emoji: '🍱', cost: 80, quantity: 3,  desc: '3번 먹일 수 있어요 · 30% 절약' },
]

export default function CoinPanel() {
  const { cat, feedCat, buyFood, playAnimation } = useCatStore()
  const coins     = cat?.coins     ?? 0
  const foodCount = cat?.foodCount ?? 0

  const [shopOpen, setShopOpen] = useState(false)
  const [buying,   setBuying]   = useState(null)   // itemId being purchased
  const [feeding,  setFeeding]  = useState(false)
  const [toast,    setToast]    = useState(null)   // { msg, type }

  const noFood    = foodCount === 0
  const lowFood   = foodCount === 1
  const canFeed   = !noFood && !playAnimation && !feeding

  function showToast(msg, type = 'ok') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2400)
  }

  async function handleBuy(item) {
    if (coins < item.cost) { showToast('코인이 부족해요 🪙', 'err'); return }
    setBuying(item.id)
    const result = await buyFood(item.id)
    setBuying(null)
    if (result.success) {
      showToast(`${item.name} 구매 완료! +${item.quantity}개 🎉`)
      setShopOpen(false)   // close shop after purchase so user sees the feed button
    } else {
      showToast(result.error === 'Not enough coins' ? '코인이 부족해요 🪙' : '잠시 후 다시 시도해 주세요', 'err')
    }
  }

  async function handleFeed() {
    if (!canFeed) return
    setFeeding(true)
    await feedCat()
    showToast(`${cat?.name ?? '고양이'}가 냠냠 먹었어요 😸`)
    setTimeout(() => setFeeding(false), 2600)
  }

  // Tapping the disabled feed button when empty → open shop automatically
  function handleFeedWhenEmpty() {
    if (noFood) setShopOpen(true)
  }

  return (
    <div className="w-full space-y-2">

      {/* ── Main card ────────────────────────────────────────────────── */}
      <div className="bg-white/90 rounded-2xl px-4 py-3 shadow-sm border border-gray-100 space-y-3">

        {/* Row 1 — Stats */}
        <div className="flex items-center gap-3">

          {/* Coins */}
          <div className="flex items-center gap-2 flex-1 bg-yellow-50 rounded-xl px-3 py-2">
            <span className="text-lg">🪙</span>
            <div>
              <p className="text-[10px] text-gray-400 leading-none font-medium">코인</p>
              <p className="text-base font-extrabold text-yellow-600 leading-tight">{coins}</p>
            </div>
          </div>

          {/* Food */}
          <div className={`flex items-center gap-2 flex-1 rounded-xl px-3 py-2 relative
            ${noFood  ? 'bg-gray-50'    :
              lowFood ? 'bg-orange-50'  :
                        'bg-orange-50/60'}`}>
            <span className="text-lg">{noFood ? '🍽️' : '🐟'}</span>
            <div>
              <p className="text-[10px] text-gray-400 leading-none font-medium">간식</p>
              <p className={`text-base font-extrabold leading-tight
                ${noFood  ? 'text-gray-300' :
                  lowFood ? 'text-orange-500' :
                            'text-orange-500'}`}>
                {noFood ? '없음' : `${foodCount}개`}
              </p>
            </div>
            {/* Low-food warning dot */}
            {lowFood && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full
                               border-2 border-white animate-pulse" />
            )}
          </div>
        </div>

        {/* Row 2 — Actions */}
        <div className="flex gap-2">

          {/* Shop button */}
          <button
            onClick={() => setShopOpen(v => !v)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 border
              ${shopOpen
                ? 'bg-lavender/30 text-lavender border-lavender/40'
                : 'bg-lavender/10 text-lavender border-lavender/20 hover:bg-lavender/20'}`}
          >
            {shopOpen ? '상점 닫기 ✕' : '상점 🛒'}
          </button>

          {/* Feed button — or "buy first" hint when empty */}
          {noFood ? (
            <button
              onClick={handleFeedWhenEmpty}
              className="flex-[2] py-2 rounded-xl text-xs font-bold transition-all active:scale-95
                         bg-orange-50 text-orange-400 border border-orange-100 border-dashed"
            >
              간식이 없어요 · 상점에서 구매 →
            </button>
          ) : (
            <button
              onClick={handleFeed}
              disabled={!canFeed}
              className={`flex-[2] py-2 rounded-xl text-sm font-extrabold transition-all border
                ${canFeed
                  ? 'bg-mint/30 text-green-700 border-mint/50 active:scale-95 hover:bg-mint/40 animate-[pulse_2s_ease-in-out_3]'
                  : 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed'}`}
            >
              {feeding ? '냠냠 중... 🍽️' : `밥 주기 🍽️`}
            </button>
          )}
        </div>

        {/* Low-food nudge */}
        {lowFood && !shopOpen && (
          <p className="text-[10px] text-orange-400 font-semibold text-center -mt-1">
            간식이 1개 남았어요 · 상점에서 더 사두세요 🐟
          </p>
        )}
      </div>

      {/* ── Shop dropdown ────────────────────────────────────────────── */}
      {shopOpen && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden animate-milestone-pop">
          <div className="px-4 pt-3 pb-1 flex items-center justify-between">
            <p className="text-sm font-extrabold text-gray-700">🛒 간식 상점</p>
            <p className="text-xs text-gray-400">보유: <span className="text-yellow-600 font-bold">{coins}🪙</span></p>
          </div>

          <div className="divide-y divide-gray-50">
            {SHOP_ITEMS.map(item => {
              const affordable = coins >= item.cost
              return (
                <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-700">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => handleBuy(item)}
                    disabled={buying === item.id || !affordable}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all active:scale-95 min-w-[56px]
                      ${affordable
                        ? 'bg-yellow-400/90 text-yellow-900 hover:bg-yellow-400'
                        : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
                  >
                    {buying === item.id ? '...' : `${item.cost}🪙`}
                  </button>
                </div>
              )
            })}
          </div>

          {/* How to earn coins hint */}
          <div className="px-4 py-2.5 bg-yellow-50/60 border-t border-yellow-100/60">
            <p className="text-[11px] text-yellow-700 text-center leading-relaxed">
              ✍️ 매일 3문장 작성 → <span className="font-bold">30코인</span> 획득
              &nbsp;·&nbsp; 7일 연속 → <span className="font-bold">+50 보너스</span>
            </p>
          </div>
        </div>
      )}

      {/* ── Toast ────────────────────────────────────────────────────── */}
      {toast && (
        <div className={`text-center text-sm font-bold px-4 py-2.5 rounded-2xl animate-milestone-pop
          ${toast.type === 'err' ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-mint/30 text-green-700'}`}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}
