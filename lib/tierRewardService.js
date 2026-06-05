import { INTIMACY_TIERS } from './catGrowthService'

// ── Reward unlocked at each intimacy tier ─────────────────────────────────────
// Index matches INTIMACY_TIERS array (0=shy has no reward, it's the start)
export const TIER_REWARDS = [
  null, // 0: Shy — starting state, no reward
  {
    tierIndex:   1,
    tierKey:     'curious',
    coins:       50,
    emoji:       '👀',
    title:       '호기심 단계 달성!',
    subtitle:    '고양이가 당신에게 슬쩍 관심을 보이기 시작했어요',
    unlocks:     '🪮 빗  ·  🐭 장난감 쥐',
    bg:          'from-purple-100 to-white',
    confettiColor: '#C3B1E1',
  },
  {
    tierIndex:   2,
    tierKey:     'friendly',
    coins:       80,
    emoji:       '😊',
    title:       '친근한 친구!',
    subtitle:    '고양이가 먼저 다가오기 시작했어요',
    unlocks:     '🧴 샴푸  ·  💊 종합 영양제',
    bg:          'from-green-100 to-white',
    confettiColor: '#A8E6CF',
  },
  {
    tierIndex:   3,
    tierKey:     'attached',
    coins:       100,
    emoji:       '💚',
    title:       '애착 형성!',
    subtitle:    '서로에게 없어선 안 될 존재가 됐어요',
    unlocks:     '🫙 오메가3',
    bg:          'from-mint/30 to-white',
    confettiColor: '#74C0FC',
  },
  {
    tierIndex:   4,
    tierKey:     'soulBond',
    coins:       150,
    emoji:       '💛',
    title:       '영혼의 유대!',
    subtitle:    '말하지 않아도 마음이 통해요',
    unlocks:     '🛋️ 고양이 쿠션',
    bg:          'from-yellow-100 to-white',
    confettiColor: '#FFD93D',
  },
  {
    tierIndex:   5,
    tierKey:     'legendary',
    coins:       200,
    emoji:       '💖',
    title:       '전설의 유대!',
    subtitle:    '완전한 신뢰 — 최고의 결속',
    unlocks:     '🏠 고양이 집',
    bg:          'from-pink-100 to-white',
    confettiColor: '#FF6B6B',
  },
]

/**
 * Get the 0-based tier index for the given intimacy value.
 * Matches the index in INTIMACY_TIERS (and TIER_REWARDS).
 */
export function getTierIndex(intimacy) {
  const v = Math.min(Math.max(Math.round(intimacy ?? 0), 0), 100)
  return INTIMACY_TIERS.findIndex(t => v >= t.min && v <= t.max)
}

/**
 * Given the NEW intimacy and the cat's current rewardedTier,
 * returns { reward, newRewardedTier, bonusCoins } if a new tier was reached,
 * or null if nothing changed.
 *
 * Call this BEFORE the DB update so you can fold the bonusCoins into the
 * same transaction.
 */
export function checkTierReward(newIntimacy, rewardedTier = 0) {
  const newTierIdx = getTierIndex(newIntimacy)
  if (newTierIdx <= rewardedTier) return null

  const reward = TIER_REWARDS[newTierIdx]
  if (!reward) return null

  return {
    reward,
    newRewardedTier: newTierIdx,
    bonusCoins:      reward.coins,
  }
}
