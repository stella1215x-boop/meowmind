import Image from 'next/image'
import { getStageLabel } from '@/lib/catGrowthService'

const ANIMATION_CLASSES = {
  purr:  'animate-float',
  wag:   'animate-wiggle',
  spin:  'animate-spin-once',
  roll:  'animate-bounce',
  knock: 'animate-wiggle',
  null:  '',
}

export default function CatDisplay({ cat, emotionalState, playAnimation }) {
  const stageLabel = getStageLabel(cat.stage)
  const imgSrc = `/cats/cat_stage${cat.stage}_${cat.color}_${emotionalState}.svg`
  const animClass = ANIMATION_CLASSES[playAnimation] ?? ''

  return (
    <div className="flex flex-col items-center gap-3">
      {/* 고양이 이미지 */}
      <div className={`relative w-52 h-52 transition-all duration-300 ${animClass}`}>
        <Image
          src={imgSrc}
          alt={`${cat.name} - ${stageLabel}`}
          fill
          className="object-contain drop-shadow-lg"
          priority
        />
      </div>

      {/* 이름 + 스테이지 */}
      <div className="text-center space-y-0.5">
        <h2 className="text-2xl font-extrabold text-gray-700">{cat.name}</h2>
        <p className="text-sm text-gray-400 font-medium">{stageLabel}</p>
      </div>
    </div>
  )
}
