'use client'

import { getIntimacyTier, INTIMACY_TIERS } from '@/lib/catGrowthService'

export default function IntimacyMeter({ intimacy = 0 }) {
  const pct  = Math.min(Math.max(Math.round(intimacy), 0), 100)
  const tier = getIntimacyTier(pct)
  // 10 heart segments
  const filled = Math.floor(pct / 10)

  // Next tier info
  const tierIdx   = INTIMACY_TIERS.findIndex((t) => t.key === tier.key)
  const nextTier  = INTIMACY_TIERS[tierIdx + 1]
  const toNext    = nextTier ? nextTier.min - pct : 0

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {/* Tier label + score */}
      <div className="flex items-center gap-2">
        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${tier.badgeCls}`}>
          {tier.emoji} {tier.label}
        </span>
        <span className="text-xs text-gray-400 font-medium tabular-nums">{pct} / 100</span>
      </div>

      {/* Heart bar */}
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className={`text-sm transition-all duration-300 ${
              i < filled ? 'opacity-100 scale-100' : 'opacity-20 scale-90'
            }`}
          >
            ❤️
          </span>
        ))}
      </div>

      {/* Next tier hint */}
      {nextTier && toNext > 0 && (
        <p className="text-[10px] text-gray-300 font-medium">
          {toNext} more to <span className="font-bold">{nextTier.label}</span> {nextTier.emoji}
        </p>
      )}
    </div>
  )
}
