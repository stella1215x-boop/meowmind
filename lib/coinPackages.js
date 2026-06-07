// ── Coin purchase packages ────────────────────────────────────────────────────
// Priced in KRW. Stripe handles currency conversion.
// Rule of thumb: 1 coin ≈ ₩13 (~$0.01)

export const COIN_PACKAGES = [
  {
    id:          'coins_80',
    coins:       80,
    priceKRW:    1100,    // ₩1,100 (~$0.99)
    label:       '80 코인',
    emoji:       '🪙',
    badge:       null,
    description: '간식 3회 or 사료 3회',
  },
  {
    id:          'coins_250',
    coins:       250,
    priceKRW:    2900,    // ₩2,900 (~$2.49)
    label:       '250 코인',
    emoji:       '💰',
    badge:       '인기',
    description: '1주일치 사랑 표현',
  },
  {
    id:          'coins_600',
    coins:       600,
    priceKRW:    5900,    // ₩5,900 (~$4.99)
    label:       '600 코인',
    emoji:       '💎',
    badge:       '베스트',
    description: '한 달치 + 보너스 50',
  },
  {
    id:          'coins_1400',
    coins:       1400,
    priceKRW:    9900,    // ₩9,900 (~$8.99)
    label:       '1,400 코인',
    emoji:       '👑',
    badge:       '최고가치',
    description: '연간 풀케어 패키지',
  },
]

export function getPackage(id) {
  return COIN_PACKAGES.find(p => p.id === id) ?? null
}
