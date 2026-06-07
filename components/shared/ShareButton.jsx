'use client'

import { useState, useRef } from 'react'
import useCatStore from '@/store/useCatStore'
import { getStageLabel } from '@/lib/catGrowthService'

const STAGE_EMOJI = ['🐣', '🐱', '🐈', '😸', '🦁', '👑']
const HASHTAGS    = '#MeowMind #감사일기 #오늘의고양이 #마음챙김 #gratitude'

function getTodayLabel() {
  const d = new Date()
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return `${d.getFullYear()}.${d.getMonth()+1}.${d.getDate()} (${days[d.getDay()]})`
}

function buildShareText(cat, sentences) {
  const name       = cat?.name ?? '고양이'
  const stage      = cat?.stage ?? 0
  const stageEmoji = STAGE_EMOJI[Math.min(stage, 5)]
  const stageLabel = getStageLabel(stage)
  const today      = getTodayLabel()

  const lines = [
    `${stageEmoji} ${name} · ${stageLabel}`,
    `📅 ${today}`,
    '',
    ...sentences
      .filter(Boolean)
      .map((s, i) => `${['①','②','③'][i]} ${s}`),
    '',
    HASHTAGS,
  ]

  return lines.join('\n')
}

export default function ShareButton({ sentences = [] }) {
  const { cat } = useCatStore()
  const [open,    setOpen]    = useState(false)
  const [loading, setLoading] = useState(false)

  const shareText = buildShareText(cat, sentences)

  // Capture the Rive canvas that's already in the DOM
  function captureRiveCanvas() {
    try {
      const canvas = document.querySelector('canvas')
      if (!canvas) return null
      return new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
    } catch { return null }
  }

  async function shareNative() {
    setLoading(true)
    try {
      const imageBlob = await captureRiveCanvas()
      const shareData = {
        title: `${cat?.name ?? '고양이'}의 오늘 일기 🐱`,
        text:  shareText,
      }
      if (imageBlob && navigator.canShare?.({ files: [new File([imageBlob], 'cat.png', { type: 'image/png' })] })) {
        shareData.files = [new File([imageBlob], `${cat?.name ?? 'cat'}.png`, { type: 'image/png' })]
      }
      await navigator.share(shareData)
      setOpen(false)
    } catch (err) {
      if (err?.name !== 'AbortError') {
        // Fallback: copy to clipboard
        navigator.clipboard?.writeText(shareText)
        alert('텍스트를 복사했어요!\n원하는 곳에 붙여넣기 해주세요 📋')
      }
    } finally {
      setLoading(false)
    }
  }

  function shareToX() {
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank')
    setOpen(false)
  }

  async function shareToInstagram() {
    navigator.clipboard?.writeText(shareText)
    alert('텍스트를 복사했어요!\nInstagram에 붙여넣기 해주세요 📋')
    window.open('https://www.instagram.com/', '_blank')
    setOpen(false)
  }

  return (
    <div className="relative flex justify-center">

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2
                          bg-white rounded-2xl shadow-2xl border border-gray-100
                          p-4 z-50 animate-milestone-pop min-w-[260px]">

            {/* Share text preview */}
            <div className="bg-gray-50 rounded-xl p-3 mb-3 text-xs text-gray-600
                            leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto">
              {shareText}
            </div>

            {/* Share targets */}
            <div className="flex gap-3 justify-center mb-2">
              {/* Native share (iOS/Android) */}
              {typeof navigator !== 'undefined' && navigator.share && (
                <button
                  onClick={shareNative}
                  disabled={loading}
                  className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-lavender to-pink-400
                                  flex items-center justify-center shadow-md">
                    <span className="text-2xl">📤</span>
                  </div>
                  <span className="text-[10px] font-semibold text-gray-500">
                    {loading ? '준비 중...' : '공유하기'}
                  </span>
                </button>
              )}

              {/* Instagram */}
              <button
                onClick={shareToInstagram}
                className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500
                                via-pink-500 to-orange-400 flex items-center justify-center shadow-md">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </div>
                <span className="text-[10px] font-semibold text-gray-500">Instagram</span>
              </button>

              {/* X */}
              <button
                onClick={shareToX}
                className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
              >
                <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center shadow-md">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.264 5.633zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <span className="text-[10px] font-semibold text-gray-500">X</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Share button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-6 py-3 rounded-2xl
                   bg-lavender text-white font-bold text-base shadow-md
                   shadow-lavender/30 active:scale-95 transition-all hover:opacity-90"
      >
        <span className="text-lg">📤</span>
        <span>공유하기</span>
      </button>
    </div>
  )
}
