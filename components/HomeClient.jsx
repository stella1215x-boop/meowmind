'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import useCatStore from '@/store/useCatStore'
import CatAnimation from '@/components/Cat/CatAnimation'
import IntimacyPanel from '@/components/Cat/IntimacyPanel'
import RightInventoryPanel from '@/components/Cat/RightInventoryPanel'
import CoinEarnedToast from '@/components/Cat/CoinEarnedToast'
import StreakCounter from '@/components/Journal/StreakCounter'
import JournalForm from '@/components/Journal/JournalForm'
import BottomNav from '@/components/shared/BottomNav'
import MilestoneModal from '@/components/shared/MilestoneModal'
import IntimacyRewardModal from '@/components/shared/IntimacyRewardModal'
import ShareButton from '@/components/shared/ShareButton'
import SeasonalBanner from '@/components/Seasonal/SeasonalBanner'

export default function HomeClient({ cat: initialCat, emotionalState: initialState, hasWrittenToday: initialWritten, prompt, season, isPremium }) {
  const searchParams   = useSearchParams()
  const isWelcome      = searchParams.get('welcome')  === '1'
  const purchaseResult = searchParams.get('purchase')
  const coinsAdded     = searchParams.get('coins')

  const {
    cat, emotionalState, hasWrittenToday,
    playAnimation, milestone, tierReward,
    hydrate, onJournalSubmitted, clearAnimation, clearMilestone, clearTierReward,
  } = useCatStore()

  useEffect(() => {
    hydrate(initialCat, initialState, initialWritten)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const activeCat     = cat ?? initialCat
  const activeState   = cat ? emotionalState : initialState
  const activeWritten = cat ? hasWrittenToday : initialWritten

  const daysWritten = activeCat?.totalDaysWritten ?? 0

  async function handleJournalSubmit(sentences, followUpAnswer = null) {
    const res = await fetch('/api/journal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sentences, followUpAnswer }),
    })
    if (res.status === 409) { onJournalSubmitted(activeCat, null, 0, 0, null, sentences); return }
    if (!res.ok) { alert('저장 중 오류가 생겼어요. 다시 시도해 주세요.'); return }
    const data = await res.json()
    onJournalSubmitted(data.cat, data.milestone, data.coinsEarned ?? 0, data.streakBonus ?? 0, data.tierReward ?? null, sentences)
    void fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'cat_animation_viewed' }),
    }).catch(() => {})
  }

  return (
    <div className="mobile-container flex flex-col bg-cream" style={{ height: '100dvh' }}>
      <div className="safe-top" />
      <CoinEarnedToast />

      {/* ── FIXED TOP ─────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 px-4 pt-3">
        {isWelcome && (
          <div className="mb-1.5 bg-lavender/10 rounded-xl p-2 text-center animate-milestone-pop">
            <p className="text-xs font-semibold text-lavender">
              🎉 {activeCat?.name}와 함께하는 첫날이에요!
            </p>
          </div>
        )}
        {purchaseResult === 'success' && coinsAdded && (
          <div className="mb-1.5 bg-yellow-50 border border-yellow-200 rounded-xl p-2 text-center animate-milestone-pop">
            <p className="text-sm font-extrabold text-yellow-600">
              🪙 +{coinsAdded} 코인 충전 완료! 감사합니다 💕
            </p>
          </div>
        )}
        <SeasonalBanner season={season} isPremium={isPremium}
          catName={activeCat?.name} totalDaysWritten={daysWritten} />

        {/* Streak + cat growth — single row */}
        <div className="mt-1">
          <StreakCounter currentStreak={activeCat?.currentStreak ?? 0}
            totalDaysWritten={daysWritten} />
        </div>
      </div>

      {/* ── CAT AREA: Intimacy | Cat | Stats ─────────────────────────────── */}
      <div className="flex-shrink-0 flex items-center px-3"
           style={{ height: '36vh' }}>

        {/* Left — Intimacy button */}
        <div className="flex-shrink-0 w-20 flex justify-center">
          <IntimacyPanel />
        </div>

        {/* Center — Cat */}
        <div className="flex-1 h-full">
          <CatAnimation
            cat={activeCat}
            emotionalState={activeState}
            playAnimation={playAnimation}
            onAnimationEnd={clearAnimation}
            hasWrittenToday={activeWritten}
          />
        </div>

        {/* Right — Pantry / Shop panel */}
        <div className="flex-shrink-0 relative flex justify-center">
          <RightInventoryPanel />
        </div>
      </div>

      {/* ── SCROLLABLE BOTTOM ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-24">
        {activeWritten ? (
          <WrittenTodayMessage cat={activeCat} />
        ) : (
          <JournalForm
            prompt={prompt}
            cat={activeCat}
            onSubmit={handleJournalSubmit}
          />
        )}
      </div>

      <BottomNav totalDaysWritten={daysWritten} />

      <MilestoneModal milestone={milestone} catName={activeCat?.name}
        catColor={activeCat?.color} catStage={activeCat?.stage} onClose={clearMilestone} />
      <IntimacyRewardModal reward={tierReward} cat={activeCat} onClose={clearTierReward} />
    </div>
  )
}


function WrittenTodayMessage({ cat }) {
  return (
    <div className="flex flex-col items-center text-center space-y-4 py-6">
      <div className="text-5xl animate-float">✨</div>
      <div>
        <h3 className="text-xl font-extrabold text-gray-700">오늘 일지를 완료했어요!</h3>
        <p className="text-gray-500 text-sm mt-2 leading-relaxed">
          {cat?.name}가 행복해하고 있어요 🐱<br />내일 또 만나요!
        </p>
      </div>
      <div className="w-full bg-mint/20 rounded-2xl p-3">
        <p className="text-xs text-gray-500">매일 꾸준히 10일 쓰면 {cat?.name}가 성장해요 🌱</p>
      </div>
      <ShareButton sentences={[]} />
    </div>
  )
}
