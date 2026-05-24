'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function ShareModal({ cat, onClose }) {
  const [ogUrl, setOgUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [sharing, setSharing] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams({
      stage:  cat?.stage  ?? 0,
      color:  cat?.color  ?? 'orange',
      name:   cat?.name   ?? '냐옹이',
      streak: cat?.currentStreak  ?? 0,
      total:  cat?.totalDaysWritten ?? 0,
    })
    setOgUrl(`${window.location.origin}/api/og?${params}`)
  }, [cat])

  async function handleNativeShare() {
    if (!navigator.share) return
    setSharing(true)
    try {
      await navigator.share({
        title: `${cat?.name}가 성장하고 있어요! 🐱`,
        text: `MeowMind에서 ${cat?.currentStreak ?? 0}일 연속 감사 일기를 쓰고 있어요. 함께해요!`,
        url: window.location.origin,
      })
    } catch { /* user cancelled */ }
    setSharing(false)
  }

  async function handleDownload() {
    const a = document.createElement('a')
    a.href = ogUrl
    a.download = `meowmind_${cat?.name ?? 'cat'}.png`
    a.click()
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(window.location.origin)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-mobile bg-white rounded-t-3xl p-5 pb-safe animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 핸들 */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

        <h2 className="text-base font-extrabold text-gray-700 mb-4 text-center">성장 카드 공유하기</h2>

        {/* 카드 미리보기 */}
        {ogUrl && (
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm mb-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ogUrl} alt="공유 카드" className="w-full h-full object-cover" />
          </div>
        )}

        {/* 공유 버튼들 */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          {canNativeShare && (
            <ShareButton
              emoji="📤"
              label="공유하기"
              onClick={handleNativeShare}
              disabled={sharing}
              primary
            />
          )}
          <ShareButton
            emoji="💾"
            label="저장하기"
            onClick={handleDownload}
          />
          <ShareButton
            emoji={copied ? '✅' : '🔗'}
            label={copied ? '복사됨!' : '링크 복사'}
            onClick={handleCopy}
          />
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 text-sm text-gray-400 font-medium"
        >
          닫기
        </button>
      </div>
    </div>
  )
}

function ShareButton({ emoji, label, onClick, disabled, primary }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center gap-1.5 py-3.5 rounded-2xl transition-all active:scale-95 disabled:opacity-50
        ${primary ? 'bg-lavender text-white' : 'bg-gray-50 text-gray-600'}`}
    >
      <span className="text-xl">{emoji}</span>
      <span className={`text-[11px] font-bold ${primary ? 'text-white' : 'text-gray-500'}`}>{label}</span>
    </button>
  )
}
