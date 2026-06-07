'use client'

import { useState } from 'react'
import useCatStore from '@/store/useCatStore'
import { getStageLabel } from '@/lib/catGrowthService'

const STAGE_EMOJI = ['🐣', '🐱', '🐈', '😸', '🦁', '👑']
const HASHTAGS    = '#MeowMind #감사일기 #오늘의고양이 #마음챙김 #gratitude'

function getTodayLabel() {
  const d = new Date()
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return `${d.getFullYear()}.${d.getMonth()+1}.${d.getDate()} (${days[d.getDay()]})`
}

// ── Fetch today's sentences from API (fallback when store is empty) ────────────
async function fetchTodaySentences() {
  try {
    const res = await fetch('/api/journal?page=1&limit=1')
    if (!res.ok) return []
    const data = await res.json()
    const entry = data.entries?.[0]
    if (!entry) return []
    const parsed = JSON.parse(entry.content)
    if (Array.isArray(parsed)) return parsed
    return parsed.sentences ?? []
  } catch { return [] }
}

// ── Draw share card on canvas (no DOM, no visibility issues) ─────────────────
function drawRoundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

function wrapText(ctx, text, x, y, maxW, lineH) {
  const words = text.split('')
  let line = ''
  let curY = y
  for (const ch of text) {
    const test = line + ch
    if (ctx.measureText(test).width > maxW) {
      ctx.fillText(line, x, curY)
      line = ch
      curY += lineH
    } else { line = test }
  }
  if (line) ctx.fillText(line, x, curY)
  return curY + lineH
}

async function buildShareImage(cat, sentences) {
  const W = 1080, PAD = 80
  const stageEmoji = STAGE_EMOJI[Math.min(cat?.stage ?? 0, 5)]
  const catName    = cat?.name ?? '고양이'
  const stageLabel = getStageLabel(cat?.stage ?? 0)
  const today      = getTodayLabel()
  const sentList   = sentences.filter(Boolean)

  // Estimate height
  const lineH = 52
  const sentH = sentList.reduce((h, s) => {
    const lines = Math.max(1, Math.ceil(s.length / 20))
    return h + lines * lineH + 24
  }, 0)
  const H = 360 + sentH + 160

  const canvas = document.createElement('canvas')
  canvas.width = W; canvas.height = H

  const ctx = canvas.getContext('2d')

  // Background
  const grad = ctx.createLinearGradient(0, 0, W, H)
  grad.addColorStop(0, '#f5f3ff')
  grad.addColorStop(1, '#fce7f3')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)

  // Header card (white)
  ctx.fillStyle = 'rgba(255,255,255,0.75)'
  drawRoundRect(ctx, PAD, PAD, W - PAD*2, 200, 32)
  ctx.fill()

  // Stage emoji
  ctx.font = '110px serif'
  ctx.textBaseline = 'middle'
  ctx.fillText(stageEmoji, PAD + 30, PAD + 100)

  // Cat name
  ctx.font = 'bold 64px -apple-system, sans-serif'
  ctx.fillStyle = '#1f2937'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(catName, PAD + 160, PAD + 90)

  // Stage label + date
  ctx.font = '40px -apple-system, sans-serif'
  ctx.fillStyle = '#9ca3af'
  ctx.fillText(`${stageLabel} · ${today}`, PAD + 160, PAD + 152)

  // meow-mind brand
  ctx.font = 'bold 30px -apple-system, sans-serif'
  ctx.fillStyle = '#c4b5fd'
  ctx.textAlign = 'center'
  ctx.fillText('meow-mind 🐱', W / 2, PAD + 244)

  // Divider
  ctx.strokeStyle = '#e5e7eb'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(PAD, PAD + 270)
  ctx.lineTo(W - PAD, PAD + 270)
  ctx.stroke()

  // Sentences
  const nums = ['①', '②', '③']
  let y = PAD + 316
  const maxW = W - PAD * 2 - 100

  ctx.textAlign = 'left'
  for (let i = 0; i < sentList.length; i++) {
    // Number circle bg
    ctx.fillStyle = '#ede9fe'
    drawRoundRect(ctx, PAD, y - 44, 66, 56, 14)
    ctx.fill()

    ctx.font = 'bold 40px -apple-system, sans-serif'
    ctx.fillStyle = '#7c3aed'
    ctx.textAlign = 'center'
    ctx.fillText(nums[i], PAD + 33, y)

    ctx.font = '40px -apple-system, sans-serif'
    ctx.fillStyle = '#374151'
    ctx.textAlign = 'left'
    y = wrapText(ctx, sentList[i], PAD + 90, y, maxW, lineH)
    y += 24
  }

  // Hashtags
  ctx.font = '32px -apple-system, sans-serif'
  ctx.fillStyle = '#a78bfa'
  ctx.textAlign = 'center'
  ctx.fillText(HASHTAGS, W / 2, H - 50)

  return new Promise(r => canvas.toBlob(r, 'image/png', 0.95))
}

// ─────────────────────────────────────────────────────────────────────────────

export default function ShareButton({ sentences: propSentences }) {
  const { cat, todaySentences } = useCatStore()
  const [open,    setOpen]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)    // blob URL for preview

  // Resolve sentences: prop → store → API
  const hasProp  = (propSentences?.filter(Boolean).length ?? 0) > 0
  const hasStore = (todaySentences?.filter(Boolean).length ?? 0) > 0

  async function resolveSentences() {
    if (hasProp)  return propSentences.filter(Boolean)
    if (hasStore) return todaySentences.filter(Boolean)
    return fetchTodaySentences()
  }

  async function handleOpen() {
    setOpen(v => !v)
    if (preview) return
    // Build preview immediately
    setLoading(true)
    const sents = await resolveSentences()
    const blob  = await buildShareImage(cat, sents)
    if (blob) setPreview(URL.createObjectURL(blob))
    setLoading(false)
  }

  async function doShare(platform) {
    setLoading(true)
    try {
      const sents = await resolveSentences()
      const blob  = preview
        ? await fetch(preview).then(r => r.blob())
        : await buildShareImage(cat, sents)

      const shareText = [
        `${STAGE_EMOJI[Math.min(cat?.stage ?? 0, 5)]} ${cat?.name ?? '고양이'} · ${getStageLabel(cat?.stage ?? 0)}`,
        `📅 ${getTodayLabel()}`,
        '',
        ...sents.map((s, i) => `${['①','②','③'][i]} ${s}`),
        '',
        HASHTAGS,
      ].join('\n')

      if (platform === 'native' && navigator.share) {
        const sd = { title: `${cat?.name ?? '고양이'}의 감사일기 🐱`, text: shareText }
        if (blob) {
          const file = new File([blob], 'meowmind.png', { type: 'image/png' })
          if (navigator.canShare?.({ files: [file] })) sd.files = [file]
        }
        await navigator.share(sd)

      } else if (platform === 'instagram') {
        if (blob) {
          const file = new File([blob], 'meowmind.png', { type: 'image/png' })
          if (navigator.canShare?.({ files: [file] }) && navigator.share) {
            await navigator.share({ files: [file], text: shareText })
            setOpen(false); return
          }
        }
        navigator.clipboard?.writeText(shareText)
        alert('텍스트를 복사했어요!\nInstagram에 붙여넣기 해주세요 📋')
        window.open('https://www.instagram.com/', '_blank')

      } else if (platform === 'x') {
        window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank')
      }

      setOpen(false)
    } catch (err) {
      if (err?.name !== 'AbortError') {
        navigator.clipboard?.writeText(HASHTAGS)
        alert('공유 중 오류가 발생했어요. 텍스트를 복사했어요!')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex justify-center">

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2
                          bg-white rounded-2xl shadow-2xl border border-gray-100
                          p-4 z-50 animate-milestone-pop w-[280px]">

            {/* Image preview */}
            {loading && (
              <div className="h-32 flex items-center justify-center text-gray-400 text-sm">
                이미지 생성 중... ✨
              </div>
            )}
            {preview && !loading && (
              <img src={preview} alt="share preview"
                className="w-full rounded-xl mb-3 shadow-sm" />
            )}

            {/* Share buttons */}
            <div className="flex gap-3 justify-center">
              {typeof navigator !== 'undefined' && navigator.share && (
                <button onClick={() => doShare('native')} disabled={loading}
                  className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-lavender to-pink-400
                                  flex items-center justify-center shadow-md">
                    <span className="text-2xl">📤</span>
                  </div>
                  <span className="text-[10px] font-semibold text-gray-500">공유</span>
                </button>
              )}

              <button onClick={() => doShare('instagram')}
                className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md"
                  style={{ background: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)' }}>
                  <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </div>
                <span className="text-[10px] font-semibold text-gray-500">Instagram</span>
              </button>

              <button onClick={() => doShare('x')}
                className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
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

      <button
        onClick={handleOpen}
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
