'use client'

import { useState } from 'react'
import useCatStore from '@/store/useCatStore'
import { normalizeInventory, SHOP_ITEMS } from '@/lib/shopCatalog'
import dynamic from 'next/dynamic'

const CoinPanel = dynamic(() => import('./CoinPanel'), {
  ssr: false,
  loading: () => <div className="p-4 text-center text-xs text-gray-400">로딩 중…</div>,
})

export default function RightInventoryPanel() {
  const { cat, feedCat, consumeItem, playAnimation } = useCatStore()
  const [pantryOpen, setPantryOpen] = useState(false)
  const [shopOpen,   setShopOpen]   = useState(false)
  const [feeding,    setFeeding]    = useState(false)
  const [toast,      setToast]      = useState(null)

  const coins     = cat?.coins     ?? 0
  const foodCount = cat?.foodCount ?? 0
  const inventory = normalizeInventory(cat?.inventory)
  const isBusy    = !!playAnimation || feeding

  const ownedConsumables = SHOP_ITEMS
    .filter(i => i.type === 'consumable' && i.inventoryKey && (inventory[i.inventoryKey] ?? 0) > 0)
    .map(i => ({ id: i.id, emoji: i.emoji, label: i.name, count: inventory[i.inventoryKey] }))

  const totalItems = (foodCount > 0 ? 1 : 0) + ownedConsumables.length

  function flash(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 1400)
  }

  async function handleFeed() {
    if (isBusy || foodCount <= 0) return
    setFeeding(true)
    setPantryOpen(false)
    await feedCat()
    flash('냠냠 😸')
    setTimeout(() => setFeeding(false), 2600)
  }

  async function handleUse(itemId) {
    if (isBusy) return
    setPantryOpen(false)
    const result = await consumeItem(itemId, null)
    if (result?.success !== false) flash('+친밀도 💛')
  }

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className="absolute right-2 -top-8 text-sm font-bold text-lavender
                        animate-coin-pop pointer-events-none select-none z-20">
          {toast}
        </div>
      )}

      {/* ── Button column — emoji only, no text ── */}
      <div className="flex flex-col gap-2 items-center">

        {/* 🪙 Coins */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl
                        w-14 h-14 flex flex-col items-center justify-center gap-0.5">
          <span className="text-2xl">🪙</span>
          <span className="text-[11px] font-extrabold text-yellow-600">{coins}</span>
        </div>

        {/* 📦 Pantry */}
        <button
          onClick={() => { setPantryOpen(v => !v); setShopOpen(false) }}
          className={`relative w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-0.5
                      border transition-all active:scale-90
            ${pantryOpen
              ? 'bg-lavender/30 border-lavender/50'
              : 'bg-white/90 border-gray-200 shadow-sm'}`}
        >
          <span className="text-2xl">📦</span>
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500
                             rounded-full text-[9px] text-white font-bold
                             flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>

        {/* 🛒 Shop */}
        <button
          onClick={() => { setShopOpen(v => !v); setPantryOpen(false) }}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center border
                      transition-all active:scale-90
            ${shopOpen
              ? 'bg-lavender/30 border-lavender/50'
              : 'bg-white/90 border-gray-200 shadow-sm'}`}
        >
          <span className="text-2xl">🛒</span>
        </button>
      </div>

      {/* ── Pantry popup ── */}
      {pantryOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setPantryOpen(false)} />
          <div className="absolute right-0 top-0 z-50 w-52
                          bg-white rounded-2xl shadow-2xl border border-gray-100
                          p-3 animate-milestone-pop">
            <p className="text-sm font-extrabold text-gray-600 mb-2">📦 보관함</p>

            {totalItems === 0 ? (
              <p className="text-sm text-gray-400 text-center py-3">아직 비어있어요</p>
            ) : (
              <div className="space-y-2">

                {/* Food — with feed button */}
                {foodCount > 0 && (
                  <div className="flex items-center gap-2 px-2 py-2
                                  bg-orange-50 rounded-xl border border-orange-100">
                    <span className="text-xl">🥩</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-700">음식</p>
                    </div>
                    <span className="text-sm font-extrabold text-orange-500 mr-1">×{foodCount}</span>
                    <button
                      onClick={handleFeed}
                      disabled={isBusy}
                      className={`text-xs font-bold px-2.5 py-1.5 rounded-lg transition-all active:scale-90
                        ${!isBusy
                          ? 'bg-mint/40 text-green-700 hover:bg-mint/60'
                          : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
                    >
                      {feeding ? '먹는 중' : '먹이기 ▶'}
                    </button>
                  </div>
                )}

                {/* Consumable items */}
                {ownedConsumables.map(item => (
                  <div key={item.id}
                    className="flex items-center gap-2 px-2 py-2
                               bg-lavender/10 rounded-xl border border-lavender/20">
                    <span className="text-xl">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-700 truncate">{item.label}</p>
                    </div>
                    <span className="text-sm font-extrabold text-lavender mr-1">×{item.count}</span>
                    <button
                      onClick={() => handleUse(item.id)}
                      disabled={isBusy}
                      className="text-xs font-bold px-2.5 py-1.5 rounded-lg
                                 bg-lavender/30 text-lavender active:scale-90 transition-all"
                    >
                      사용 ▶
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Shop bottom sheet ── */}
      {shopOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShopOpen(false)} />
          <div className="fixed inset-x-0 bottom-16 z-50 mx-3">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100
                            overflow-hidden animate-milestone-pop
                            max-h-[60vh] overflow-y-auto">
              <CoinPanel onClose={() => setShopOpen(false)} storeOnly={true} />
            </div>
          </div>
        </>
      )}
    </>
  )
}
