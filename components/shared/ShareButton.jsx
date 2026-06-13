'use client'

import { useState } from 'react'
import useCatStore from '@/store/useCatStore'
import { useLanguage } from '@/components/shared/LanguageProvider'
import { getStageLabel } from '@/lib/catGrowthService'

const STAGE_EMOJI = ['🐣', '🐱', '🐈', '😸', '🦁', '👑']

function getTodayLabel() {
  const d = new Date()
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return `${d.getFullYear()}.${d.getMonth()+1}.${d.getDate()} (${days[d.getDay()]})`
}

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

async function captureRiveCat() {
  try {
    const riveCanvas = document.querySelector('canvas')
    if (!riveCanvas) return null
    return await new Promise(r => {
      try { riveCanvas.toBlob(r, 'image/png') }
      catch { r(null) }
    })
  } catch { return null }
}

function loadImage(blob) {
  return new Promise(resolve => {
    const img = new Image()
    const url = URL.createObjectURL(blob)
    img.onload  = () => { URL.revokeObjectURL(url); resolve(img) }
    img.onerror = () => { URL.revokeObjectURL(url); resolve(null) }
    img.src = url
  })
}

async function buildShareImage(cat, sentences, t) {
  const W = 1080, H = 1920
  const PAD = 72

  const stageEmoji = STAGE_EMOJI[Math.min(cat?.stage ?? 0, 5)]
  const catName    = cat?.name ?? t.cat.defaultName
  const stageLabel = getStageLabel(cat?.stage ?? 0)
  const today      = getTodayLabel()
  const sentList   = sentences.filter(Boolean)

  const catBlob = await captureRiveCat()
  const catImg  = catBlob ? await loadImage(catBlob) : null

  const canvas = document.createElement('canvas')
  canvas.width = W; canvas.height = H
  const ctx = canvas.getContext('2d')

  // Top gradient
  const topH = 800
  const grad = ctx.createLinearGradient(0, 0, W, topH)
  grad.addColorStop(0, '#7c3aed')
  grad.addColorStop(1, '#a855f7')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, topH)

  // Cat image
  const catSize = 600
  const catX    = (W - catSize) / 2
  const catY    = 60
  if (catImg) {
    ctx.save()
    ctx.beginPath()
    ctx.arc(W / 2, catY + catSize / 2, catSize / 2 + 20, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.15)'
    ctx.fill()
    ctx.restore()
    ctx.drawImage(catImg, catX, catY, catSize, catSize)
  } else {
    ctx.font = '320px serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(stageEmoji, W / 2, catY + catSize / 2)
  }

  // Brand
  ctx.font = 'bold 44px -apple-system, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText('meow-mind 🐱', W / 2, topH - 30)

  // White card
  const cardY = topH - 60
  ctx.fillStyle = '#ffffff'
  drawRoundRect(ctx, 0, cardY, W, H - cardY, 60)
  ctx.fill()

  // Cat name row
  const nameY = cardY + 100
  ctx.font = '100px serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(stageEmoji, PAD, nameY)

  ctx.font = 'bold 80px -apple-system, sans-serif'
  ctx.fillStyle = '#1f2937'
  ctx.fillText(catName, PAD + 130, nameY - 10)

  ctx.font = '48px -apple-system, sans-serif'
  ctx.fillStyle = '#9ca3af'
  ctx.fillText(`${stageLabel} · ${today}`, PAD + 130, nameY + 58)

  // Divider
  const divY = nameY + 110
  ctx.strokeStyle = '#f3f4f6'
  ctx.lineWidth = 3
  ctx.beginPath(); ctx.moveTo(PAD, divY); ctx.lineTo(W - PAD, divY); ctx.stroke()

  // Sentences
  const lineH = 60
  const maxW  = W - PAD * 2 - 110
  const nums  = ['①', '②', '③']
  let y = divY + 80
  ctx.textAlign = 'left'

  for (let i = 0; i < Math.min(sentList.length, 3); i++) {
    ctx.fillStyle = '#ede9fe'
    drawRoundRect(ctx, PAD, y - 50, 72, 64, 16)
    ctx.fill()
    ctx.font = 'bold 46px -apple-system, sans-serif'
    ctx.fillStyle = '#7c3aed'
    ctx.textAlign = 'center'
    ctx.fillText(nums[i], PAD + 36, y)

    ctx.font = '46px -apple-system, sans-serif'
    ctx.fillStyle = '#374151'
    ctx.textAlign = 'left'
    y = wrapText(ctx, sentList[i], PAD + 100, y, maxW, lineH)
    y += 28
  }

  // Hashtags — split locale hashtags into two canvas lines
  const hashStr   = t.share.hashtags
  const hashParts = hashStr.split(' ')
  const mid       = Math.ceil(hashParts.length / 2)
  const tags1     = hashParts.slice(0, mid).join(' ')
  const tags2     = hashParts.slice(mid).join(' ')
  const hashY     = Math.max(y + 60, H - 140)
  ctx.font = '38px -apple-system, sans-serif'
  ctx.fillStyle = '#a78bfa'
  ctx.textAlign = 'center'
  ctx.fillText(tags1, W / 2, hashY)
  ctx.fillText(tags2, W / 2, hashY + 52)

  return new Promise(r => canvas.toBlob(r, 'image/png', 0.95))
}

// ─────────────────────────────────────────────────────────────────────────────

export default function ShareButton({ sentences: propSentences }) {
  const { cat, todaySentences } = useCatStore()
  const { t } = useLanguage()
  const S = t.share

  const [open,    setOpen]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)

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
    setLoading(true)
    const sents = await resolveSentences()
    const blob  = await buildShareImage(cat, sents, t)
    if (blob) setPreview(URL.createObjectURL(blob))
    setLoading(false)
  }

  async function doShare(platform) {
    setLoading(true)
    try {
      const sents = await resolveSentences()
      const blob  = preview
        ? await fetch(preview).then(r => r.blob())
        : await buildShareImage(cat, sents, t)

      const catName    = cat?.name ?? t.cat.defaultName
      const stageEmoji = STAGE_EMOJI[Math.min(cat?.stage ?? 0, 5)]
      const stageLabel = getStageLabel(cat?.stage ?? 0)

      const shareText = [
        `${stageEmoji} ${catName} · ${stageLabel}`,
        `📅 ${getTodayLabel()}`,
        '',
        ...sents.map((s, i) => `${['①','②','③'][i]} ${s}`),
        '',
        S.hashtags,
      ].join('\n')

      if (platform === 'native' && navigator.share) {
        const sd = { title: S.journalTitle(catName), text: shareText }
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
        alert(S.instagramCopied)
        window.open('https://www.instagram.com/', '_blank')

      } else if (platform === 'x') {
        window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank')
      }

      setOpen(false)
    } catch (err) {
      if (err?.name !== 'AbortError') {
        navigator.clipboard?.writeText(S.hashtags)
        alert(S.shareError)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center">

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-5
                        bg-black/40 backdrop-blur-sm"
             onClick={() => setOpen(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm
                          overflow-hidden animate-milestone-pop"
               onClick={e => e.stopPropagation()}>

            <div className="max-h-[55vh] overflow-y-auto">
              {loading && (
                <div className="h-48 flex flex-col items-center justify-center gap-2 text-gray-400">
                  <span className="text-3xl animate-pulse">✨</span>
                  <span className="text-sm font-medium">{S.generating}</span>
                </div>
              )}
              {preview && !loading && (
                <img src={preview} alt={S.altText} className="w-full" />
              )}
            </div>

            <div className="p-5 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center mb-4 font-medium">
                {S.platform}
              </p>
              <div className="flex gap-4 justify-center">
                {typeof navigator !== 'undefined' && navigator.share && (
                  <button onClick={() => doShare('native')} disabled={loading}
                    className="flex flex-col items-center gap-1.5 active:scale-90 transition-transform">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-lavender to-pink-400
                                    flex items-center justify-center shadow-md">
                      <span className="text-2xl">📤</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-600">{S.native}</span>
                  </button>
                )}

                <button onClick={() => doShare('instagram')}
                  className="flex flex-col items-center gap-1.5 active:scale-90 transition-transform">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md"
                    style={{ background: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)' }}>
                    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-gray-600">Instagram</span>
                </button>

                <button onClick={() => doShare('x')}
                  className="flex flex-col items-center gap-1.5 active:scale-90 transition-transform">
                  <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center shadow-md">
                    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.264 5.633zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-gray-600">X</span>
                </button>
              </div>

              <button onClick={() => setOpen(false)}
                className="mt-4 w-full py-2.5 rounded-2xl text-sm font-semibold
                           text-gray-400 bg-gray-50 active:scale-95 transition-all">
                {S.close}
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleOpen}
        className="flex items-center gap-2 px-6 py-3 rounded-2xl
                   bg-lavender text-white font-bold text-base shadow-md
                   shadow-lavender/30 active:scale-95 transition-all hover:opacity-90"
      >
        <span className="text-lg">📤</span>
        <span>{S.btn}</span>
      </button>
    </div>
  )
}
