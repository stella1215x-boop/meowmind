// ── Item catalog — single source of truth for shop + pantry ──────────────────

export const CATEGORIES = [
  { id: 'food',      label: '음식',   emoji: '🍖' },
  { id: 'grooming',  label: '그루밍', emoji: '✨' },
  { id: 'toys',      label: '장난감', emoji: '🎮' },
  { id: 'furniture', label: '가구',   emoji: '🏠' },
  { id: 'nutrition', label: '영양',   emoji: '💊' },
]

// type:
//   'food'       → adds qty to cat.foodCount (fed via /api/cat/feed)
//   'consumable' → adds qty to cat.inventory[inventoryKey], used via /api/cat/use-item
//   'permanent'  → adds 1 to cat.inventory[inventoryKey] (max 1 owned, passive effect)
//
// animationHint: animation to play when the item is used in CatCharacter

export const SHOP_ITEMS = [
  // ── Food ────────────────────────────────────────────────────────────────────
  {
    id: 'meal',
    category:     'food',
    name:         '고양이 밥',
    emoji:        '🍱',
    cost:         30,
    qty:          3,
    type:         'food',
    desc:         '3번 먹일 수 있어요',
    intimacyGain: 8,          // per use (handled by /api/cat/feed)
    animationHint: 'eat',
  },
  {
    id: 'snack',
    category:     'food',
    name:         '고양이 간식',
    emoji:        '🐟',
    cost:         70,
    qty:          1,
    type:         'food',
    desc:         '달콤한 간식 한 개',
    intimacyGain: 8,
    animationHint: 'eat',
  },
  // ── Grooming ────────────────────────────────────────────────────────────────
  {
    id: 'comb',
    category:     'grooming',
    name:         '고양이 빗',
    emoji:        '🪮',
    cost:         40,
    qty:          3,
    type:         'consumable',
    inventoryKey: 'combs',
    desc:         '3회 그루밍 가능',
    intimacyGain: 6,
    animationHint: 'purr',
  },
  {
    id: 'shampoo',
    category:     'grooming',
    name:         '고양이 샴푸',
    emoji:        '🧴',
    cost:         60,
    qty:          1,
    type:         'consumable',
    inventoryKey: 'shampoos',
    desc:         '반짝반짝 깨끗하게',
    intimacyGain: 12,
    animationHint: 'headbutt',
  },
  // ── Toys ────────────────────────────────────────────────────────────────────
  {
    id: 'yarn',
    category:     'toys',
    name:         '실뭉치',
    emoji:        '🧶',
    cost:         30,
    qty:          3,
    type:         'consumable',
    inventoryKey: 'yarns',
    desc:         '3번 놀 수 있어요',
    intimacyGain: 5,
    animationHint: 'wag',
  },
  {
    id: 'mouse',
    category:     'toys',
    name:         '장난감 쥐',
    emoji:        '🐭',
    cost:         50,
    qty:          1,
    type:         'consumable',
    inventoryKey: 'mice',
    desc:         '고양이가 좋아해요',
    intimacyGain: 10,
    animationHint: 'spin',
  },
  // ── Furniture ───────────────────────────────────────────────────────────────
  {
    id: 'cushion',
    category:     'furniture',
    name:         '고양이 쿠션',
    emoji:        '🛋️',
    cost:         100,
    qty:          1,
    type:         'permanent',
    inventoryKey: 'cushions',
    desc:         '기분이 좋아져요 · 영구 소장',
    intimacyGain: 0,
    animationHint: 'knead',
  },
  {
    id: 'house',
    category:     'furniture',
    name:         '고양이 집',
    emoji:        '🏠',
    cost:         200,
    qty:          1,
    type:         'permanent',
    inventoryKey: 'houses',
    desc:         '특별한 아지트 · 영구 소장',
    intimacyGain: 0,
    animationHint: 'float',
  },
  // ── Nutrition ───────────────────────────────────────────────────────────────
  {
    id: 'vitamin',
    category:     'nutrition',
    name:         '종합 영양제',
    emoji:        '💊',
    cost:         50,
    qty:          1,
    type:         'consumable',
    inventoryKey: 'vitamins',
    desc:         '건강하게 자라요',
    intimacyGain: 12,
    animationHint: 'nuzzle',
  },
  {
    id: 'omega3',
    category:     'nutrition',
    name:         '오메가3',
    emoji:        '🫙',
    cost:         80,
    qty:          1,
    type:         'consumable',
    inventoryKey: 'omega3s',
    desc:         '윤기있는 털',
    intimacyGain: 15,
    animationHint: 'knead',
  },
]

/** Look up a single item by id */
export function getItem(id) {
  return SHOP_ITEMS.find(i => i.id === id) ?? null
}

/** Filter items by category */
export function getByCategory(categoryId) {
  return SHOP_ITEMS.filter(i => i.category === categoryId)
}

/** Return a blank inventory object (all zeros) */
export function emptyInventory() {
  return { combs: 0, shampoos: 0, yarns: 0, mice: 0, cushions: 0, houses: 0, vitamins: 0, omega3s: 0 }
}

/** Merge a partial inventory object with defaults so all keys are present */
export function normalizeInventory(raw) {
  return { ...emptyInventory(), ...(raw ?? {}) }
}
