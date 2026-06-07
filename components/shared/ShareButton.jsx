'use client'

import { useState } from 'react'

export default function ShareButton({ cat, sentences = [] }) {
  const [open, setOpen] = useState(false)

  const catName = cat?.name ?? '고양이'
  const stage   = cat?.stage ?? 0
  const STAGE_LABELS = ['Baby','Kitten','Playful','Adult','Wise','Legendary']
  const stageLabel = STAGE_LABELS[stage] ?? 'Kitten'

  const shareText = [
    `🐱 ${catName} (${stageLabel}) — MeowMind`,
    '',
    ...sentences.filter(Boolean).map((s, i) => `${['①','②','③'][i]} ${s}`),
    '',
    '#MeowMind #감사일기 #고양이',
  ].join('\n')

  function shareToX() {
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`
    window.open(url, '_blank')
    setOpen(false)
  }

  function shareToInstagram() {
    // Copy text to clipboard, then open Instagram
    navigator.clipboard?.writeText(shareText).catch(() => {})
    alert('텍스트가 복사됐어요!\nInstagram에 붙여넣기 해주세요 📋')
    window.open('https://www.instagram.com/', '_blank')
    setOpen(false)
  }

  return (
    <div className="relative flex justify-center">
      {/* Share popup */}
      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2
                          bg-white rounded-2xl shadow-2xl border border-gray-100
                          p-4 flex gap-6 z-50 animate-milestone-pop">
            {/* Instagram */}
            <button
              onClick={shareToInstagram}
              className="flex flex-col items-center gap-1.5 active:scale-90 transition-transform"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400
                              flex items-center justify-center shadow-md">
                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </div>
              <span className="text-xs font-semibold text-gray-600">Instagram</span>
            </button>

            {/* X (Twitter) */}
            <button
              onClick={shareToX}
              className="flex flex-col items-center gap-1.5 active:scale-90 transition-transform"
            >
              <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center shadow-md">
                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.264 5.633zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
              <span className="text-xs font-semibold text-gray-600">X</span>
            </button>
          </div>
        </>
      )}

      {/* Share button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-6 py-3 rounded-2xl
                   bg-lavender text-white font-bold text-sm shadow-md
                   shadow-lavender/30 active:scale-95 transition-all hover:opacity-90"
      >
        <span>📤</span>
        <span>공유하기</span>
      </button>
    </div>
  )
}
