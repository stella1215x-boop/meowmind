import { create } from 'zustand'

const useCatStore = create((set, get) => ({
  cat: null,
  emotionalState: 'neutral',
  hasWrittenToday: false,
  playAnimation: null,   // 'purr' | 'wag' | 'spin' | 'roll' | 'knock' | 'eat'
  milestone: null,       // 7 | 14 | 30 | 60 | 100
  coinsEarned: null,     // transient: shown after journal submit { amount, streakBonus }

  hydrate(cat, emotionalState, hasWrittenToday) {
    set({ cat, emotionalState, hasWrittenToday })
  },

  onJournalSubmitted(updatedCat, milestone, coinsEarned = 0, streakBonus = 0) {
    const animations = ['purr', 'wag', 'spin', 'roll', 'knock']
    const anim = animations[Math.floor(Math.random() * animations.length)]
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
    // Don't stack if one is already playing
    if (get().playAnimation) return
    const animations = ['purr', 'wag', 'spin', 'roll', 'knock']
    const anim = animations[Math.floor(Math.random() * animations.length)]
    set({ playAnimation: anim })
  },

  // Feed the cat: deduct 1 food, play eat animation, update store
  async feedCat() {
    if (get().playAnimation) return
    const cat = get().cat
    if (!cat || (cat.foodCount ?? 0) <= 0) return

    set({ playAnimation: 'eat' })

    try {
      const res = await fetch('/api/cat/feed', { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        set({ cat: { ...cat, foodCount: data.foodCount } })
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
