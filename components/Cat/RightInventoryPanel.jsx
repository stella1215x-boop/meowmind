'use client'

import { useState } from 'react'
import useCatStore from '@/store/useCatStore'
import { normalizeInventory } from '@/lib/shopCatalog'
import dynamic from 'next/dynamic'
import CatSvg from './CatSvg'

// Lazy-load the full store panel (only when user taps Shop)
const CoinPanel = dynamic(() => import('./CoinPanel'), { ssr: false,
  loading: () => <div className="p-4 text-center text-xs text-gray-400">로딩 중…</div> })

export default function RightInventoryPanel() {
  const { cat, feedCat, consumeItem, playAnimation } = useCatStore()
  const [shopOpen,  setShopOpen]  = useState(false)
  const [feeding,   setFeeding]   = useState(false)
  const [toast,     setToast]     = useState(null)

  const coins     = cat?.coins     ?? 0
  const foodCount = cat?.foodCount ?? 0
  const inventory = normalizeInventory(cat?.inventory)
  const isBusy    = !!playAnimation || feeding

  // Items to display (only those with qty > 0)
  const ownedItems = [
    { key: 'treats',       emoji: '🍬', label: 'Treats',    count: inventory.treats       ?? 0, action: 'treats'       },
    { key: 'fishJerkys',   emoji: '🐟', label: 'Fish J.',   count: inventory.fishJerkys   ?? 0, action: 'fishjerky'    },
    { key: 'supplements',  emoji: '💊', label: 'Suppl.',    count: inventory.supplements  ?? 0, action: 'supplement'   },
    { key: 'vitaminBottles',emoji:'🫙', label: 'Vitamins',  count: inventory.vitaminBottles??0, action: 'vitamins'     },
  ].filter(i => i.count > 0)

  function flash(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 1600)
  }

  async function handleFeed() {
    if (isBusy || foodCount <= 0) return
    setFeeding(true)
    await feedCat()
    flash('냠냠 😸')
    setTimeout(() => setFeeding(false), 2600)
  }

  async function handleUse(itemId) {
    if (isBusy) return
    const result = await consumeItem(itemId, null)
    if (result?.success !== false) flash('+친밀도 💛')
  }

  return (
    <>
      {/* Panel */}
      <div className="flex flex-col gap-1.5 w-24">

        {/* Toast */}
        {toast && (
          <div className="absolute right-2 -top-6 text-[10px] font-bold text-lavender
                          animate-coin-pop pointer-events-none select-none z-20">
            {toast}
          </div>
        )}

        {/* Coin */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl
                        px-2 py-1.5 flex flex-col items-center">
          <span className="text-sm">🪙</span>
          <span className="text-xs font-extrabold text-yellow-600 leading-tight">{coins}</span>
        </div>

        {/* Food — always shown, with Feed button */}
        <button
          onClick={handleFeed}
          disabled={isBusy || foodCount <= 0}
          className={`rounded-xl px-2 py-1.5 flex flex-col items-center border transition-all active:scale-95
            ${foodCount > 0 && !isBusy
              ? 'bg-mint/20 border-mint/40 text-green-700'
              : 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'}`}
        >
          <span className="text-sm">🥩</span>
          <span className="text-[10px] font-extrabold leading-tight">×{foodCount}</span>
          <span className="text-[8px] font-bold mt-0.5">
            {feeding ? '먹는 중' : foodCount > 0 ? 'Feed ▶' : 'Empty'}
          </span>
        </button>

        {/* Owned consumable items */}
        {ownedItems.map(item => (
          <button
            key={item.key}
            onClick={() => handleUse(item.action)}
            disabled={isBusy}
            className="bg-lavender/10 border border-lavender/20 rounded-xl
                       px-2 py-1.5 flex flex-col items-center
                       active:scale-95 transition-all"
          >
            <span className="text-sm">{item.emoji}</span>
            <span className="text-[10px] font-extrabold text-lavender leading-tight">×{item.count}</span>
            <span className="text-[8px] text-lavender/70 font-bold">Use ▶</span>
          </button>
        ))}

        {/* Shop button */}
        <button
          onClick={() => setShopOpen(v => !v)}
          className="bg-white border border-gray-200 rounded-xl px-2 py-1.5
                     flex flex-col items-center active:scale-95 transition-all"
        >
          <span className="text-sm">🛒</span>
          <span className="text-[9px] font-bold text-gray-500">Shop</span>
        </button>
      </div>

      {/* Inline shop panel — shown just below cat area when open */}
      {shopOpen && (
        <div className="fixed inset-x-0 bottom-16 z-40 mx-3">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100
                          overflow-hidden animate-milestone-pop max-h-[55vh] overflow-y-auto">
            <CoinPanel onClose={() => setShopOpen(false)} />
          </div>
          <div className="fixed inset-0 -z-10" onClick={() => setShopOpen(false)} />
        </div>
      )}
    </>
  )
}
