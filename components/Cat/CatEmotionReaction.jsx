'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLanguage } from '@/components/shared/LanguageProvider'

// ── Heart/sparkle particle ───────────────────────────────────────────────────
function Particle({ emoji, x, delay }) {
  return (
    <span
      className="absolute pointer-events-none select-none animate-heart-float text-xl"
      style={{ left: `${x}%`, top: -8, animationDelay: `${delay}s`, zIndex: 30 }}
    >
      {emoji}
    </span>
  )
}

// ── Feeding reaction overlay ──────────────────────────────────────────────────
export function FeedingReaction({ tierKey = 'shy', show, onDone }) {
  const { t } = useLanguage()
  const [particles, setParticles] = useState([])
  const [message,   setMessage]   = useState('')

  useEffect(() => {
    if (!show) return

    const reactions = t.feedReactions ?? {}
    const msgs = reactions[tierKey] ?? reactions.shy ?? ['...']
    setMessage(msgs[Math.floor(Math.random() * msgs.length)])

    const EMOJIS = {
      shy:       ['💗'],
      curious:   ['💗', '✨'],
      friendly:  ['❤️', '✨', '💕'],
      attached:  ['💖', '✨', '💕', '🌟'],
      soulBond:  ['💖', '✨', '💛', '🌟', '💫'],
      legendary: ['💖', '✨', '💛', '👑', '💫', '🌟'],
    }
    const emojiSet = EMOJIS[tierKey] ?? ['💗']
    const count    = emojiSet.length + 2

    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id:    i,
        emoji: emojiSet[i % emojiSet.length],
        x:     15 + Math.random() * 70,
        delay: i * 0.12,
      }))
    )

    const timer = setTimeout(() => {
      setParticles([])
      setMessage('')
      onDone?.()
    }, 2200)

    return () => clearTimeout(timer)
  }, [show, tierKey]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!show && !message) return null

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {particles.map(p => <Particle key={p.id} {...p} />)}

      {message && (
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2
                        bg-white rounded-2xl px-4 py-2.5 shadow-xl
                        border border-pink-100 animate-milestone-pop
                        whitespace-nowrap">
          <p className="text-sm font-extrabold text-pink-500">{message}</p>
          <div className="w-3 h-3 bg-white border-r border-b border-pink-100
                          rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
        </div>
      )}
    </div>
  )
}

// ── Cat request bubble (persistent, rotates messages) ────────────────────────
export function CatRequestBubble({ cat, hasWrittenToday, lastFedHoursAgo = 0 }) {
  const { t } = useLanguage()
  const [msg,     setMsg]     = useState(null)
  const [visible, setVisible] = useState(false)

  const pickMessage = useCallback(() => {
    const req = t.catRequests ?? {}
    const now  = new Date()
    const hour = now.getHours()

    let pool
    if (lastFedHoursAgo >= 6)                               pool = req.hungry
    else if (!hasWrittenToday && hour >= 8 && hour < 12)    pool = req.morning
    else if (!hasWrittenToday && hour >= 18)                 pool = req.evening
    else if (!hasWrittenToday)                               pool = req.journal
    else if (Math.random() < 0.4)                           pool = req.play
    else                                                     pool = req.comfort

    pool = pool ?? req.journal ?? ['...']
    return pool[Math.floor(Math.random() * pool.length)]
  }, [lastFedHoursAgo, hasWrittenToday, t])

  useEffect(() => {
    const initial = setTimeout(() => {
      setMsg(pickMessage())
      setVisible(true)
      setTimeout(() => setVisible(false), 3500)
    }, 4000)

    const interval = setInterval(() => {
      setMsg(pickMessage())
      setVisible(true)
      setTimeout(() => setVisible(false), 3500)
    }, 45000)

    return () => { clearTimeout(initial); clearInterval(interval) }
  }, [pickMessage])

  if (!visible || !msg) return null

  return (
    <div className="absolute -top-14 left-1/2 -translate-x-1/2
                    bg-white rounded-2xl px-3 py-2 shadow-lg
                    border border-lavender/30 animate-milestone-pop
                    whitespace-nowrap z-20 pointer-events-none">
      <p className="text-xs font-bold text-lavender">{msg}</p>
      <div className="w-3 h-3 bg-white border-r border-b border-lavender/30
                      rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
    </div>
  )
}
