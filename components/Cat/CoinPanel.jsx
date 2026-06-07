'use client'

import { useState } from 'react'
import useCatStore from '@/store/useCatStore'
import { CATEGORIES, SHOP_ITEMS, getByCategory, normalizeInventory } from '@/lib/shopCatalog'

// ── Pantry: all item slots with their current count ───────────────────────────
const PANTRY_SLOTS = [
  { emoji: '🍱', key: 'food_meal',    label: '밥',   getCount: (inv, food) => Math.floor(food / 3) },
  { emoji: '🐟', key: 'food_snack',   label: '간식', getCount: (inv, food) => food % 3 },
  { emoji: '🪮', key: 'inv_combs',    label: '빗',   getCount: (inv) => inv.combs },
  { emoji: '🧴', key: 'inv_shampoos', label: '샴푸', getCount: (inv) => inv.shampoos },
  { emoji: '🧶', key: 'inv_yarns',    label: '실',   getCount: (inv) => inv.yarns },
  { emoji: '🐭', key: 'inv_mice',     label: '쥐',   getCount: (inv) => inv.mice },
  { emoji: '💊', key: 'inv_vitamins', label: '영양제',getCount: (inv) => inv.vitamins },
  { emoji: '🫙', key: 'inv_omega3s',  label: '오메가3',getCount: (inv) => inv.omega3s },
  { emoji: '🛋️', key: 'inv_cushions', label: '쿠션', getCount: (inv) => inv.cushions, permanent: true },
  { emoji: '🏠', key: 'inv_houses',   label: '집',   getCount: (inv) => inv.houses,   permanent: true },
]

export default function CoinPanel({ onClose, storeOnly = false }) {
  const { cat, feedCat, buyItem, consumeItem, playAnimation } = useCatStore()

  const coins     = cat?.coins     ?? 0
  const foodCount = cat?.foodCount ?? 0
  const inventory = normalizeInventory(cat?.inventory)

  // When storeOnly=true, skip the main panel and open shop directly
  const [shopOpen,    setShopOpen]    = useState(storeOnly)
  const [activeTab,   setActiveTab]   = useState('food')
  const [buying,      setBuying]      = useState(null)   // itemId
  const [using,       setUsing]       = useState(null)   // itemId
  const [feeding,     setFeeding]     = useState(false)
  const [toast,       setToast]       = useState(null)   // { msg, type }

  const noFood  = foodCount <= 0
  const lowFood = foodCount === 1
  const canFeed = !noFood && !playAnimation && !feeding

  // Total items across all pantry slots
  const totalItems = PANTRY_SLOTS.reduce((sum, slot) => sum + (slot.getCount(inventory, foodCount) > 0 ? 1 : 0), 0)

  function showToast(msg, type = 'ok') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2400)
  }

  // ── Feed ──────────────────────────────────────────────────────────────────
  async function handleFeed() {
    if (!canFeed) return
    setFeeding(true)
    await feedCat()
    showToast(`${cat?.name ?? '고양이'}가 냠냠 먹었어요 😸`)
    setTimeout(() => setFeeding(false), 2600)
  }

  // ── Buy ───────────────────────────────────────────────────────────────────
  async function handleBuy(item) {
    if (coins < item.cost) { showToast('코인이 부족해요 🪙', 'err'); return }
    setBuying(item.id)
    const result = await buyItem(item.id)
    setBuying(null)
    if (result.success) {
      showToast(`${item.emoji} ${item.name} 구매 완료! 🎉`)
      setShopOpen(false)
    } else {
      const msg =
        result.error === 'Not enough coins' ? '코인이 부족해요 🪙' :
        result.error === 'Already owned'    ? '이미 소장하고 있어요 ✓' :
        '잠시 후 다시 시도해 주세요'
      showToast(msg, 'err')
    }
  }

  // ── Use item ──────────────────────────────────────────────────────────────
  async function handleUse(item) {
    if (playAnimation || using) return
    setUsing(item.id)
    const result = await consumeItem(item.id, item.animationHint)
    setUsing(null)
    if (result.success) {
      showToast(`${item.emoji} 사용 완료! 친밀도 +${item.intimacyGain} 💛`)
    } else {
      showToast(result.error === 'No items left' ? '아이템이 없어요' : '잠시 후 다시 시도해 주세요', 'err')
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="w-full space-y-2">

      {/* ── Main card — hidden in storeOnly mode ── */}
      {!storeOnly && <div className="bg-white/90 rounded-2xl px-4 py-3 shadow-sm border border-gray-100 space-y-3">

        {/* Row 1 — Coins */}
        <div className="flex items-center gap-2 bg-yellow-50 rounded-xl px-3 py-2">
          <span className="text-lg">🪙</span>
          <div>
            <p className="text-[10px] text-gray-400 leading-none font-medium">코인</p>
            <p className="text-base font-extrabold text-yellow-600 leading-tight">{coins}</p>
          </div>
        </div>

        {/* Row 2 — Pantry summary */}
        <div>
          <p className="text-[10px] font-extrabold text-gray-400 mb-1.5 tracking-widest uppercase">
            📦 Pantry
          </p>
          {totalItems === 0 ? (
            <p className="text-xs text-gray-300 italic">아직 비어있어요. 상점에서 채워보세요!</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {PANTRY_SLOTS.map(slot => {
                const count = slot.getCount(inventory, foodCount)
                if (count === 0) return null
                return (
                  <PantryChip
                    key={slot.key}
                    slot={slot}
                    count={count}
                    inventory={inventory}
                    foodCount={foodCount}
                    onUse={handleUse}
                    using={using}
                    playAnimation={playAnimation}
                  />
                )
              })}
            </div>
          )}
        </div>

        {/* Row 3 — Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => setShopOpen(v => !v)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 border
              ${shopOpen
                ? 'bg-lavender/30 text-lavender border-lavender/40'
                : 'bg-lavender/10 text-lavender border-lavender/20 hover:bg-lavender/20'}`}
          >
            {shopOpen ? '상점 닫기 ✕' : '상점 🛒'}
          </button>

          {noFood ? (
            <button
              onClick={() => setShopOpen(true)}
              className="flex-[2] py-2 rounded-xl text-xs font-bold border border-dashed
                         bg-orange-50 text-orange-400 border-orange-200 active:scale-95 transition-all"
            >
              음식이 없어요 · 상점에서 구매 →
            </button>
          ) : (
            <button
              onClick={handleFeed}
              disabled={!canFeed}
              className={`flex-[2] py-2 rounded-xl text-sm font-extrabold transition-all border relative
                ${canFeed
                  ? 'bg-mint/30 text-green-700 border-mint/50 active:scale-95 hover:bg-mint/40'
                  : 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed'}`}
            >
              {feeding ? '냠냠 중... 🍽️' : '밥 주기 🍽️'}
              {lowFood && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full
                                 border-2 border-white animate-pulse" />
              )}
            </button>
          )}
        </div>
      </div>}

      {/* ── Shop ── */}
      {shopOpen && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden animate-milestone-pop">

          {/* Header */}
          <div className="px-4 pt-3 pb-2 border-b border-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm font-extrabold text-gray-700">Store</p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-400">🪙 <span className="text-yellow-600 font-bold">{coins}</span></p>
                {onClose && (
                  <button onClick={onClose}
                    className="text-gray-400 text-lg font-bold leading-none active:scale-90 transition-transform">
                    ✕
                  </button>
                )}
              </div>
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Days {cat?.totalDaysWritten ?? 0}/10 · 10 days straight for next growth step
            </p>
          </div>

          {/* Category tabs */}
          <div className="flex gap-1 px-3 py-2 border-b border-gray-50 overflow-x-auto">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold
                            whitespace-nowrap transition-all flex-shrink-0
                  ${activeTab === cat.id
                    ? 'bg-lavender text-white shadow-sm'
                    : 'bg-gray-100 text-gray-500 hover:bg-lavender/10'}`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Items for active category */}
          <div className="divide-y divide-gray-50">
            {getByCategory(activeTab).map(item => {
              const catIntimacy = cat?.intimacy ?? 0
              const isLocked    = (item.minIntimacy ?? 0) > catIntimacy
              const affordable  = !isLocked && coins >= item.cost
              const owned       = item.type === 'permanent' &&
                                  normalizeInventory(cat?.inventory)[item.inventoryKey] >= 1

              return (
                <div key={item.id}
                  className={`flex items-center gap-3 px-4 py-3 ${isLocked ? 'opacity-50' : ''}`}>
                  <span className="text-2xl flex-shrink-0">{isLocked ? '🔒' : item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-700">{item.name}</p>
                    {isLocked ? (
                      <p className="text-xs text-gray-400">친밀도 {item.minIntimacy} 달성 시 해금 🔓</p>
                    ) : (
                      <>
                        <p className="text-xs text-gray-400">{item.desc}</p>
                        {item.intimacyGain > 0 && (
                          <p className="text-[10px] text-lavender font-semibold mt-0.5">
                            사용 시 친밀도 +{item.intimacyGain}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                  {owned ? (
                    <span className="text-xs font-bold text-mint px-2 py-1 bg-mint/10 rounded-lg">소장 ✓</span>
                  ) : isLocked ? (
                    <span className="text-xs text-gray-300 px-2 py-1 bg-gray-50 rounded-lg border border-gray-100">
                      🔒
                    </span>
                  ) : (
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
                  )}
                </div>
              )
            })}

          </div>

          {/* Footer hint */}
          <div className="px-4 py-2.5 bg-yellow-50/60 border-t border-yellow-100/60">
            <p className="text-[11px] text-yellow-700 text-center leading-relaxed">
              ✍️ 매일 3문장 → <span className="font-bold">최대 60코인</span>
              &nbsp;·&nbsp; 7일 연속 → <span className="font-bold">+50 보너스</span>
            </p>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className={`text-center text-sm font-bold px-4 py-2.5 rounded-2xl animate-milestone-pop
          ${toast.type === 'err' ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-mint/30 text-green-700'}`}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}

// ── Pantry chip — shows one item with count + optional use button ─────────────
function PantryChip({ slot, count, inventory, foodCount, onUse, using, playAnimation }) {
  const isBusy     = !!playAnimation || !!using
  const isPermanent = slot.permanent

  // Find the SHOP_ITEMS entry so we can call useItem with full metadata
  const shopItem = SHOP_ITEMS.find(i => {
    if (slot.key.startsWith('food_')) return false        // food: no use button, fed via main button
    return i.inventoryKey && slot.key === `inv_${i.inventoryKey}`
  })

  const canUse = !isPermanent && !slot.key.startsWith('food_') && shopItem && count > 0 && !isBusy

  return (
    <button
      onClick={canUse ? () => onUse(shopItem) : undefined}
      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold
                  transition-all select-none
        ${isPermanent
          ? 'bg-lavender/10 text-lavender border-lavender/20 cursor-default'
          : canUse
          ? 'bg-orange-50 text-orange-600 border-orange-200 active:scale-95 hover:bg-orange-100 cursor-pointer'
          : 'bg-gray-50 text-gray-500 border-gray-100 cursor-default'}`}
    >
      <span>{slot.emoji}</span>
      <span>{isPermanent ? '✓' : `×${count}`}</span>
    </button>
  )
}
