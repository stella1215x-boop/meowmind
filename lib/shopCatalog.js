// ── Item catalog — Food · Snacks · Nutrition only ────────────────────────────

export const CATEGORIES = [
  { id: 'food',      label: 'Food',      emoji: '🥩' },
  { id: 'snacks',    label: 'Snacks',    emoji: '🐟' },
  { id: 'nutrition', label: 'Nutrition', emoji: '💊' },
]

// type:
//   'food'       → adds qty to cat.foodCount (fed via /api/cat/feed)
//   'consumable' → adds qty to cat.inventory[inventoryKey]
//
// animationHint: animation to play when used

export const SHOP_ITEMS = [
  // ── Food ────────────────────────────────────────────────────────────────────
  {
    id: 'kibble',
    category:     'food',
    name:         'Dry Kibble',
    emoji:        '🥩',
    cost:         30,
    qty:          3,
    type:         'food',
    minIntimacy:  0,
    desc:         '3번 먹일 수 있어요',
    intimacyGain: 8,
    animationHint: 'eat',
  },
  {
    id: 'canned',
    category:     'food',
    name:         'Canned Food',
    emoji:        '🥫',
    cost:         50,
    qty:          1,
    type:         'food',
    minIntimacy:  0,
    desc:         'Special treat — 1 serving',
    intimacyGain: 12,
    animationHint: 'eat',
  },
  // ── Snacks ──────────────────────────────────────────────────────────────────
  {
    id: 'treats',
    category:     'snacks',
    name:         'Treats',
    emoji:        '🍬',
    cost:         40,
    qty:          3,
    type:         'consumable',
    inventoryKey: 'treats',
    minIntimacy:  0,
    desc:         '3개입 · 간식',
    intimacyGain: 6,
    animationHint: 'purr',
  },
  {
    id: 'fishjerky',
    category:     'snacks',
    name:         'Fish Jerky',
    emoji:        '🐟',
    cost:         70,
    qty:          1,
    type:         'consumable',
    inventoryKey: 'fishJerkys',
    minIntimacy:  20,
    desc:         '고양이가 가장 좋아해요',
    intimacyGain: 10,
    animationHint: 'eat',
  },
  // ── Nutrition ───────────────────────────────────────────────────────────────
  {
    id: 'supplement',
    category:     'nutrition',
    name:         'Supplements',
    emoji:        '💊',
    cost:         50,
    qty:          1,
    type:         'consumable',
    inventoryKey: 'supplements',
    minIntimacy:  40,
    desc:         '건강하게 자라요',
    intimacyGain: 12,
    animationHint: 'nuzzle',
  },
  {
    id: 'vitamins',
    category:     'nutrition',
    name:         'Vitamins',
    emoji:        '🫙',
    cost:         80,
    qty:          1,
    type:         'consumable',
    inventoryKey: 'vitaminBottles',
    minIntimacy:  60,
    desc:         '윤기있는 털',
    intimacyGain: 15,
    animationHint: 'knead',
  },
]

// Legacy aliases so existing code doesn't break
export const meal  = SHOP_ITEMS.find(i => i.id === 'kibble')
export const snack = SHOP_ITEMS.find(i => i.id === 'treats')

/** Look up a single item by id */
export function getItem(id) {
  // Handle legacy ids
  if (id === 'meal')  return SHOP_ITEMS.find(i => i.id === 'kibble')
  if (id === 'snack') return SHOP_ITEMS.find(i => i.id === 'fishjerky')
  return SHOP_ITEMS.find(i => i.id === id) ?? null
}

/** Filter items by category */
export function getByCategory(categoryId) {
  return SHOP_ITEMS.filter(i => i.category === categoryId)
}

/** Return a blank inventory object (all zeros) */
export function emptyInventory() {
  return {
    treats: 0, fishJerkys: 0,
    supplements: 0, vitaminBottles: 0,
    // legacy keys preserved for existing DB data
    combs: 0, shampoos: 0, yarns: 0, mice: 0,
    cushions: 0, houses: 0, vitamins: 0, omega3s: 0,
  }
}

/** Merge partial inventory with defaults */
export function normalizeInventory(raw) {
  return { ...emptyInventory(), ...(raw ?? {}) }
}
