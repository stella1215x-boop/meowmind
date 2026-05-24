export const STAGE_CONFIG = [
  { stage: 0, label: '아기 고양이',    minDays: 0  },
  { stage: 1, label: '자라는 중',     minDays: 1  },
  { stage: 2, label: '장난꾸러기',    minDays: 7  },
  { stage: 3, label: '어른 고양이',   minDays: 14 },
  { stage: 4, label: '현명한 고양이', minDays: 30 },
  { stage: 5, label: '전설의 고양이', minDays: 60 },
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
  return STAGE_CONFIG[stage]?.label ?? '아기 고양이'
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

  if (daysDiff <= 1) return 'neutral'  // 어제 썼고 오늘 아직 안 씀
  if (daysDiff === 2) return 'sad'     // 어제 건너뜀
  return 'hungry'                      // 2일 이상 건너뜀
}

export const EMOTIONAL_STATE_CONFIG = {
  happy:   { label: '행복해요',    emoji: '😸', color: 'bg-mint/30 text-green-700' },
  neutral: { label: '기다려요',    emoji: '🐱', color: 'bg-gray-100 text-gray-600' },
  sad:     { label: '보고싶어요',  emoji: '😿', color: 'bg-lavender/30 text-purple-700' },
  hungry:  { label: '배고파요',    emoji: '😾', color: 'bg-orange-100 text-orange-600' },
}
