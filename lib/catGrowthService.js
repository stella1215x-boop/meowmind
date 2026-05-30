export const STAGE_CONFIG = [
  { stage: 0, label: 'Baby',      minDays: 0  },
  { stage: 1, label: 'Kitten',    minDays: 1  },
  { stage: 2, label: 'Playful',   minDays: 7  },
  { stage: 3, label: 'Adult',     minDays: 14 },
  { stage: 4, label: 'Wise',      minDays: 30 },
  { stage: 5, label: 'Legendary', minDays: 60 },
]

export const MILESTONES = [7, 14, 30, 60, 100]

export function calcStage(totalDaysWritten) {
  let stage = 0
  for (const s of STAGE_CONFIG) {
    if (totalDaysWritten >= s.minDays) stage = s.stage
    else break
  }
  return stage
}

export function getStageLabel(stage) {
  return STAGE_CONFIG[stage]?.label ?? 'Baby'
}

export function getNextMilestone(totalDaysWritten) {
  return MILESTONES.find((m) => m > totalDaysWritten) ?? null
}

export function getCatEmotionalState(cat, hasWrittenToday) {
  if (hasWrittenToday) return 'happy'
  if (!cat?.lastFedAt) return 'neutral'

  const today = new Date()
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const lastFed = new Date(cat.lastFedAt)
  const lastFedStart = new Date(lastFed.getFullYear(), lastFed.getMonth(), lastFed.getDate())
  const daysDiff = Math.round((todayStart - lastFedStart) / 86400000)

  if (daysDiff <= 1) return 'neutral'
  if (daysDiff === 2) return 'sad'
  return 'hungry'
}

export const EMOTIONAL_STATE_CONFIG = {
  happy:   { label: 'Happy',   emoji: '😸', color: 'bg-mint/30 text-green-700' },
  neutral: { label: 'Waiting', emoji: '🐱', color: 'bg-gray-100 text-gray-600' },
  sad:     { label: 'Missing', emoji: '😿', color: 'bg-lavender/30 text-purple-700' },
  hungry:  { label: 'Hungry',  emoji: '😾', color: 'bg-orange-100 text-orange-600' },
}

// ─── Intimacy System ────────────────────────────────────────────────────────

export const INTIMACY_TIERS = [
  {
    key: 'shy',
    min: 0,  max: 19,
    label: 'Shy',
    emoji: '🙈',
    badgeCls: 'bg-gray-100 text-gray-500',
    glow: '0 0 16px rgba(195,177,225,0.25)',
    idleAnim: 'animate-shy',
    tapAnims: ['wag', 'knock'],
    speech: ['...!', 'Eep!', '!'],
  },
  {
    key: 'curious',
    min: 20, max: 39,
    label: 'Curious',
    emoji: '👀',
    badgeCls: 'bg-purple-100 text-purple-600',
    glow: '0 0 22px rgba(195,177,225,0.45)',
    idleAnim: 'animate-peek',
    tapAnims: ['wag', 'purr', 'knock'],
    speech: ['Oh?', 'Hello?', 'Hmm...'],
  },
  {
    key: 'friendly',
    min: 40, max: 59,
    label: 'Friendly',
    emoji: '😊',
    badgeCls: 'bg-green-100 text-green-600',
    glow: '0 0 28px rgba(168,230,207,0.55)',
    idleAnim: 'animate-body-breathe',
    tapAnims: ['purr', 'wag', 'knock', 'roll'],
    speech: ['Purrrr~ 😻', 'Hey! 🐾', '*nuzzles*'],
  },
  {
    key: 'attached',
    min: 60, max: 79,
    label: 'Attached',
    emoji: '💚',
    badgeCls: 'bg-mint/30 text-green-700',
    glow: '0 0 34px rgba(253,224,71,0.50)',
    idleAnim: 'animate-float',
    tapAnims: ['purr', 'wag', 'spin', 'roll', 'nuzzle'],
    speech: ['I missed you! 💛', 'More pets! 🐾', 'Stay here~'],
  },
  {
    key: 'soulBond',
    min: 80, max: 99,
    label: 'Soul Bond',
    emoji: '💛',
    badgeCls: 'bg-yellow-100 text-yellow-700',
    glow: '0 0 42px rgba(253,224,71,0.70)',
    idleAnim: 'animate-knead',
    tapAnims: ['headbutt', 'nuzzle', 'spin', 'purr', 'knead'],
    speech: ['*bonk* 💛', 'You\'re mine 🧡', '*purring intensifies*'],
  },
  {
    key: 'legendary',
    min: 100, max: 100,
    label: 'Legendary ❤️',
    emoji: '💖',
    badgeCls: 'bg-pink-100 text-pink-600',
    glow: '0 0 52px rgba(255,100,150,0.85)',
    idleAnim: 'animate-excited',
    tapAnims: ['headbutt', 'nuzzle', 'knead', 'purr', 'spin'],
    speech: ['Soul Bond ❤️', 'Forever yours 💖', '*ultra purr* ✨'],
  },
]

export function getIntimacyTier(intimacy = 0) {
  const v = Math.min(Math.max(Math.round(intimacy), 0), 100)
  return INTIMACY_TIERS.find((t) => v >= t.min && v <= t.max) ?? INTIMACY_TIERS[0]
}

// Pick the SVG mood based on emotional state + intimacy
export function getSvgMood(emotionalState, intimacy = 0) {
  if (emotionalState === 'happy')  return 'happy'
  if (emotionalState === 'hungry') return 'hungry'
  if (emotionalState === 'sad')    return 'sad'
  // neutral: shy cats show uncertainty
  if (intimacy < 20) return 'sad'
  return 'neutral'
}
