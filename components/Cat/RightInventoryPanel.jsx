'use client'

import { useState } from 'react'
import useCatStore from '@/store/useCatStore'
import { normalizeInventory, SHOP_ITEMS } from '@/lib/shopCatalog'
import dynamic from 'next/dynamic'

// Lazy-load store panel
const CoinPanel = dynamic(() => import('./CoinPanel'), {
  ssr: false,
  loading: () => <div className="p-4 text-center text-xs text-gray-400">로딩 중…</div>,
})

export default function RightInventoryPanel() {
  const { cat } = useCatStore()
  const [pantryOpen, setPantryOpen] = useState(false)
  const [shopOpen,   setShopOpen]   = useState(false)

  const coins     = cat?.coins     ?? 0
  const foodCount = cat?.foodCount ?? 0
  const inventory = normalizeInventory(cat?.inventory)

  // All owned items (food + consumables)
  const ownedItems = [
    ...(foodCount > 0
      ? [{ emoji: '🥩', label: 'Food', count: foodCount }]
      : []),
    ...SHOP_ITEMS
      .filter(i => i.type === 'consumable' && i.inventoryKey && (inventory[i.inventoryKey] ?? 0) > 0)
      .map(i => ({ emoji: i.emoji, label: i.name, count: inventory[i.inventoryKey] })),
  ]

  return (
    <>
      <div className="flex flex-col gap-2 w-[72px]">

        {/* Coin */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-2 py-2
                        flex flex-col items-center">
          <span className="text-base">🪙</span>
          <span className="text-xs font-extrabold text-yellow-600 leading-tight">{coins}</span>
        </div>

        {/* Pantry button */}
        <button
          onClick={() => { setPantryOpen(v => !v); setShopOpen(false) }}
          className={`rounded-2xl px-2 py-2 flex flex-col items-center border
                      transition-all active:scale-90 relative
            ${pantryOpen
              ? 'bg-lavender/30 border-lavender/50'
              : 'bg-white/90 border-gray-200 shadow-sm'}`}
        >
          <span className="text-base">📦</span>
          <span className="text-[9px] font-bold text-gray-600">Pantry</span>
          {ownedItems.length > 0 && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-pink-500
                             rounded-full text-[7px] text-white font-bold
                             flex items-center justify-center leading-none">
              {ownedItems.length}
            </span>
          )}
        </button>

        {/* Shop button */}
        <button
          onClick={() => { setShopOpen(v => !v); setPantryOpen(false) }}
          className={`rounded-2xl px-2 py-2 flex flex-col items-center border
                      transition-all active:scale-90
            ${shopOpen
              ? 'bg-lavender/30 border-lavender/50'
              : 'bg-white/90 border-gray-200 shadow-sm'}`}
        >
          <span className="text-base">🛒</span>
          <span className="text-[9px] font-bold text-gray-600">Shop</span>
        </button>
      </div>

      {/* ── Pantry popup ── */}
      {pantryOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setPantryOpen(false)} />
          <div className="absolute right-0 top-0 z-50 w-48
                          bg-white rounded-2xl shadow-2xl border border-gray-100
                          p-3 animate-milestone-pop">
            <p className="text-xs font-extrabold text-gray-600 mb-2">📦 Pantry</p>
            {ownedItems.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-2">비어있어요</p>
            ) : (
              <div className="space-y-1.5">
                {ownedItems.map((item, i) => (
                  <div key={i}
                    className="flex items-center gap-2 px-2 py-1.5
                               bg-gray-50 rounded-xl">
                    <span className="text-lg">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-700 truncate">{item.label}</p>
                    </div>
                    <span className="text-xs font-extrabold text-lavender">×{item.count}</span>
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
