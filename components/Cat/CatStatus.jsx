import { EMOTIONAL_STATE_CONFIG } from '@/lib/catGrowthService'

export default function CatStatus({ emotionalState }) {
  const config = EMOTIONAL_STATE_CONFIG[emotionalState] ?? EMOTIONAL_STATE_CONFIG.neutral

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${config.color}`}>
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </span>
  )
}
