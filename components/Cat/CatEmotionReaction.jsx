'use client'

import { useState, useEffect, useCallback } from 'react'

// ── Feeding reactions by intimacy tier ───────────────────────────────────────
const FEED_REACTIONS = {
  shy:       ['...냠냠', '고마워요...', '맛있어요 🙈'],
  curious:   ['냠냠~ 맛있어요!', '더 줘도 돼요? 👀', '고마워요 😊'],
  friendly:  ['맛있어! 😸', '최고야 🎉', '행복해~ ❤️'],
  attached:  ['사랑해! 💕', '이게 젤 맛있어~', '네 덕분이야 🥰', '행복 폭발 ✨'],
  soulBond:  ['사랑해 진심으로 💖', '너만 있으면 돼 💛', '꼭 안아줘~ 🤗', '최고의 주인님 ✨'],
  legendary: ['영원히 함께해 💖', '사랑해 사랑해 사랑해 💕', 'Purrrr~~ 👑', '내 전부야 ✨💖'],
}

// ── Cat request messages (shown as speech bubbles) ───────────────────────────
export const CAT_REQUESTS = {
  hungry:      ['배고파요 🐟', '밥 주세요~ 😿', '꼬르륵... 🥺', '밥!밥!밥! 🐟'],
  feed_prompt: ['맛있는 거 먹고 싶어요 😋', '간식 줘요! 🐟', '오늘도 잘 먹겠습니다 🙏'],
  journal:     ['오늘 하루 어땠어요? 📖', '일기 쓰고 같이 놀자! 🧶', '감사한 게 뭐예요? 💭'],
  play:        ['같이 놀자! 🧶', '심심해요 🥱', '놀아줘 놀아줘~ 😽', '야옹~ 관심줘요!'],
  comfort:     ['오늘 힘들었어요? 🤗', '내가 여기 있어요 💕', '꼭 안아드릴게요 🐱'],
  streak:      ['오늘도 화이팅! 🔥', '연속 기록 지켜요~ 💪', '같이 해낼 수 있어!'],
  morning:     ['좋은 아침이에요! ☀️', '오늘도 좋은 하루 💕', '아침 일기 써요! 🌸'],
  evening:     ['오늘 감사한 일 있었나요? 🌙', '자기 전에 같이 써요 📝', '하루 마무리해요 💤'],
}

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
  const [particles, setParticles] = useState([])
  const [message,   setMessage]   = useState('')

  useEffect(() => {
    if (!show) return

    const msgs = FEED_REACTIONS[tierKey] ?? FEED_REACTIONS.shy
    setMessage(msgs[Math.floor(Math.random() * msgs.length)])

    // Spawn hearts/sparkles based on tier
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

    const t = setTimeout(() => {
      setParticles([])
      setMessage('')
      onDone?.()
    }, 2200)

    return () => clearTimeout(t)
  }, [show, tierKey]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!show && !message) return null

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* Particles */}
      {particles.map(p => <Particle key={p.id} {...p} />)}

      {/* Speech bubble */}
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
  const [msg,     setMsg]     = useState(null)
  const [visible, setVisible] = useState(false)

  const pickMessage = useCallback(() => {
    const now  = new Date()
    const hour = now.getHours()

    let pool
    if (lastFedHoursAgo >= 6)          pool = CAT_REQUESTS.hungry
    else if (!hasWrittenToday && hour >= 8 && hour < 12) pool = CAT_REQUESTS.morning
    else if (!hasWrittenToday && hour >= 18) pool = CAT_REQUESTS.evening
    else if (!hasWrittenToday)         pool = CAT_REQUESTS.journal
    else if (Math.random() < 0.4)      pool = CAT_REQUESTS.play
    else                               pool = CAT_REQUESTS.comfort

    return pool[Math.floor(Math.random() * pool.length)]
  }, [lastFedHoursAgo, hasWrittenToday])

  useEffect(() => {
    // Show first bubble after 4 seconds
    const initial = setTimeout(() => {
      setMsg(pickMessage())
      setVisible(true)
      setTimeout(() => setVisible(false), 3500)
    }, 4000)

    // Then rotate every 45 seconds
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
