'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import useCatStore from '@/store/useCatStore'
import CatAnimation from '@/components/Cat/CatAnimation'
import CoinPanel from '@/components/Cat/CoinPanel'
import CoinEarnedToast from '@/components/Cat/CoinEarnedToast'
import StreakCounter from '@/components/Journal/StreakCounter'
import JournalForm from '@/components/Journal/JournalForm'
import BottomNav from '@/components/shared/BottomNav'
import MilestoneModal from '@/components/shared/MilestoneModal'
import IntimacyRewardModal from '@/components/shared/IntimacyRewardModal'
import ShareModal from '@/components/shared/ShareModal'
import SeasonalBanner from '@/components/Seasonal/SeasonalBanner'

export default function HomeClient({ cat: initialCat, emotionalState: initialState, hasWrittenToday: initialWritten, prompt, season, isPremium }) {
  const searchParams = useSearchParams()
  const isWelcome = searchParams.get('welcome') === '1'
  const [showShare, setShowShare] = useState(false)

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

  async function handleJournalSubmit(sentences, followUpAnswer = null) {
    const res = await fetch('/api/journal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sentences, followUpAnswer }),
    })
    if (res.status === 409) { onJournalSubmitted(activeCat, null, 0, 0); return }
    if (!res.ok) { alert('저장 중 오류가 생겼어요. 다시 시도해 주세요.'); return }
    const data = await res.json()
    onJournalSubmitted(data.cat, data.milestone, data.coinsEarned ?? 0, data.streakBonus ?? 0, data.tierReward ?? null)
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

      {/* ── FIXED TOP: Streak + Cat (never scrolls) ─────────────────────── */}

      {/* Welcome / seasonal banners (compact, top only) */}
      <div className="flex-shrink-0 px-5 pt-3">
        {isWelcome && (
          <div className="mb-2 bg-lavender/10 rounded-2xl p-2.5 text-center animate-milestone-pop">
            <p className="text-xs font-semibold text-lavender">
              🎉 {activeCat?.name}와 함께하는 첫날이에요!
            </p>
          </div>
        )}
        <SeasonalBanner
          season={season}
          isPremium={isPremium}
          catName={activeCat?.name}
          totalDaysWritten={activeCat?.totalDaysWritten ?? 0}
        />
        {/* Streak bar */}
        <div className="mt-2 mb-1">
          <StreakCounter
            currentStreak={activeCat?.currentStreak ?? 0}
            totalDaysWritten={activeCat?.totalDaysWritten ?? 0}
          />
        </div>
      </div>

      {/* Cat — fills ~37% of screen height, always centered */}
      <div
        className="flex-shrink-0 flex items-center justify-center"
        style={{ height: '37vh' }}
      >
        <CatAnimation
          cat={activeCat}
          emotionalState={activeState}
          playAnimation={playAnimation}
          onAnimationEnd={clearAnimation}
        />
      </div>

      {/* ── SCROLLABLE BOTTOM ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-5 pb-24">

        {/* Coin / pantry panel */}
        <div className="mb-4">
          <CoinPanel />
        </div>

        <div className="h-px bg-gray-100 mb-4" />

        {/* Journal area */}
        {activeWritten
          ? <WrittenTodayMessage catName={activeCat?.name} coins={activeCat?.coins ?? 0} onShare={() => setShowShare(true)} />
          : <JournalForm prompt={prompt} onSubmit={handleJournalSubmit} />
        }
      </div>

      <BottomNav totalDaysWritten={activeCat?.totalDaysWritten ?? 0} />

      <MilestoneModal
        milestone={milestone}
        catName={activeCat?.name}
        catColor={activeCat?.color}
        catStage={activeCat?.stage}
        onClose={clearMilestone}
      />
      <IntimacyRewardModal reward={tierReward} cat={activeCat} onClose={clearTierReward} />
      {showShare && <ShareModal cat={activeCat} onClose={() => setShowShare(false)} />}
    </div>
  )
}

function WrittenTodayMessage({ catName, coins, onShare }) {
  return (
    <div className="flex flex-col items-center text-center space-y-4 py-6">
      <div className="text-5xl animate-float">✨</div>
      <div>
        <h3 className="text-xl font-extrabold text-gray-700">오늘 일지를 완료했어요!</h3>
        <p className="text-gray-500 text-sm mt-2 leading-relaxed">
          {catName}가 행복해하고 있어요 🐱<br />내일 또 만나요!
        </p>
      </div>
      <div className="w-full bg-yellow-50 rounded-2xl p-3 border border-yellow-100">
        <p className="text-xs text-yellow-700 font-semibold">
          🪙 보유 코인 {coins}개 · 상점에서 간식을 사서 {catName}에게 줘보세요!
        </p>
      </div>
      <div className="w-full bg-mint/20 rounded-2xl p-4">
        <p className="text-xs text-gray-500">매일 꾸준히 쓰면 {catName}가 더 빨리 자라요 🌱</p>
      </div>
      <button
        onClick={onShare}
        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-lavender/40 text-lavender text-sm font-bold active:scale-95 transition-transform"
      >
        <span>📤</span>성장 카드 공유하기
      </button>
    </div>
  )
}
