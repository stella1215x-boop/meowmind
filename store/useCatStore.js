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

  hydrate(cat, emotionalState, hasWrittenToday) {
    set({ cat, emotionalState, hasWrittenToday })
  },

  onJournalSubmitted(updatedCat, milestone, coinsEarned = 0, streakBonus = 0) {
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
    })
  },

  clearCoinsEarned() {
    set({ coinsEarned: null })
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
        // Use full cat object from response (includes updated intimacy)
        if (data.cat) {
          set({ cat: data.cat })
        } else {
          // Fallback: patch just foodCount
          set({ cat: { ...cat, foodCount: data.foodCount } })
        }
      }
    } catch {
      // silent fail — animation already fired
    }
  },

  // Buy food from shop
  async buyFood(itemId) {
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
      const cat = get().cat
      if (cat) {
        set({ cat: { ...cat, coins: data.coins, foodCount: data.foodCount } })
      }
      return { success: true, ...data }
    } catch {
      return { success: false, error: 'Network error' }
    }
  },

  clearAnimation() {
    set({ playAnimation: null })
  },

  clearMilestone() {
    set({ milestone: null })
  },
}))

export default useCatStore
