import { create } from 'zustand'
import { getIntimacyTier } from '@/lib/catGrowthService'

function pickAnimation(intimacy) {
  const tier = getIntimacyTier(intimacy)
  const pool = tier.tapAnims
  return pool[Math.floor(Math.random() * pool.length)]
}

const useCatStore = create((set, get) => ({
  cat: null,
  emotionalState: 'neutral',
  hasWrittenToday: false,
  playAnimation: null,   // string | null
  milestone: null,       // 7 | 14 | 30 | 60 | 100
  coinsEarned: null,     // { amount, streakBonus } | null
  tierReward: null,      // tier reward object from TIER_REWARDS | null
  todaySentences: [],    // last submitted 3 sentences (for share card)

  hydrate(cat, emotionalState, hasWrittenToday) {
    set({ cat, emotionalState, hasWrittenToday })
  },

  onJournalSubmitted(updatedCat, milestone, coinsEarned = 0, streakBonus = 0, tierReward = null, sentences = []) {
    const intimacy = updatedCat?.intimacy ?? 0
    // After writing, always feel happy → pick a joyful animation
    const joyful =
      intimacy >= 80 ? ['headbutt', 'nuzzle', 'spin', 'knead', 'purr'] :
      intimacy >= 60 ? ['purr', 'wag', 'spin', 'roll', 'nuzzle']       :
      intimacy >= 40 ? ['purr', 'wag', 'roll', 'knock']                 :
                       ['purr', 'wag']
    const anim = joyful[Math.floor(Math.random() * joyful.length)]
    set({
      cat: updatedCat,
      emotionalState: 'happy',
      hasWrittenToday: true,
      playAnimation: anim,
      milestone: milestone ?? null,
      coinsEarned: coinsEarned > 0 ? { amount: coinsEarned, streakBonus } : null,
      tierReward: tierReward ?? null,
      todaySentences: sentences.filter(Boolean),
    })
  },

  clearCoinsEarned() {
    set({ coinsEarned: null })
  },

  clearTierReward() {
    set({ tierReward: null })
  },

  // Intimacy actions: pet · talk · brush
  async doInteract(action) {
    if (get().playAnimation) return null
    // Optimistic coin update
    const COINS = { pet: 1, talk: 1, brush: 1 }  // reduced for economy balance
    const ANIMS = { pet: 'purr', talk: 'nuzzle', brush: 'groom' }
    const gained = COINS[action] ?? 2
    const cat = get().cat
    if (cat) set({ cat: { ...cat, coins: (cat.coins ?? 0) + gained } })
    set({ playAnimation: ANIMS[action] ?? 'purr' })

    try {
      const res = await fetch('/api/cat/interact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.cat) set({ cat: data.cat })
        if (data.tierReward) set({ tierReward: data.tierReward })
        return data.coinsGained
      }
    } catch { /* silent */ }
    return gained
  },

  // Optimistically add coins while user fills in the journal form.
  // The final API response will overwrite the cat object anyway,
  // so any small discrepancy is self-correcting on submit.
  addCoinsOptimistic(amount) {
    const cat = get().cat
    if (!cat) return
    set({ cat: { ...cat, coins: (cat.coins ?? 0) + amount } })
  },

  triggerTapAnimation() {
    if (get().playAnimation) return
    const intimacy = get().cat?.intimacy ?? 0
    const anim = pickAnimation(intimacy)
    set({ playAnimation: anim })
  },

  // Feed the cat — full cat object returned so intimacy updates
  async feedCat() {
    if (get().playAnimation) return
    const cat = get().cat
    if (!cat || (cat.foodCount ?? 0) <= 0) return

    set({ playAnimation: 'eat' })

    try {
      const res = await fetch('/api/cat/feed', { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        if (data.cat) set({ cat: data.cat })
        else          set({ cat: { ...cat, foodCount: data.foodCount } })
        if (data.tierReward) set({ tierReward: data.tierReward })
      }
    } catch {
      // silent fail — animation already fired
    }
  },

  // Buy any item from shop (food → foodCount, others → inventory)
  async buyItem(itemId) {
    try {
      const res = await fetch('/api/cat/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      })
      if (!res.ok) {
        const err = await res.json()
        return { success: false, error: err.error }
      }
      const data = await res.json()
      // Server returns full cat object — use it directly
      if (data.cat) set({ cat: data.cat })
      return { success: true, ...data }
    } catch {
      return { success: false, error: 'Network error' }
    }
  },

  // Use a non-food consumable item (grooming, toy, nutrition)
  // Named consumeItem (not useItem) to avoid ESLint Rules of Hooks false-positive
  async consumeItem(itemId, animationHint) {
    if (get().playAnimation) return { success: false, error: 'Busy' }
    // Trigger animation immediately for responsive feel
    if (animationHint) set({ playAnimation: animationHint })
    try {
      const res = await fetch('/api/cat/use-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      })
      if (!res.ok) {
        const err = await res.json()
        set({ playAnimation: null })
        return { success: false, error: err.error }
      }
      const data = await res.json()
      if (data.cat) set({ cat: data.cat })
      if (data.tierReward) set({ tierReward: data.tierReward })
      return { success: true, ...data }
    } catch {
      return { success: false, error: 'Network error' }
    }
  },

  // Legacy alias kept for CoinPanel compatibility
  async buyFood(itemId) {
    return get().buyItem(itemId)
  },

  clearAnimation() {
    set({ playAnimation: null })
  },

  clearMilestone() {
    set({ milestone: null })
  },
}))

export default useCatStore
