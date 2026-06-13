'use client'

import { useState, useRef } from 'react'
import useCatStore from '@/store/useCatStore'
import { useLanguage } from '@/components/shared/LanguageProvider'
import ShareButton from '@/components/shared/ShareButton'

function getTodayLabel() {
  const d = new Date()
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  return `${d.getFullYear()}. ${d.getMonth()+1}. ${d.getDate()}. ${days[d.getDay()]}`
}

export default function JournalForm({ prompt, onSubmit, cat }) {
  const { addCoinsOptimistic } = useCatStore()
  const { t } = useLanguage()
  const L = t.journal

  const [sentences,      setSentences]      = useState(['', '', ''])
  const [done,           setDone]           = useState([false, false, false])
  const [coinPopKeys,    setCoinPopKeys]     = useState([null, null, null])
  const [bonusVisible,   setBonusVisible]   = useState(false)
  const [phase,          setPhase]          = useState('writing') // 'writing' | 'followup'
  const [followUpAnswer, setFollowUpAnswer] = useState('')
  const [loading,        setLoading]        = useState(false)
  const textareaRefs  = useRef([])
  const followUpRef   = useRef(null)

  const allDone   = done.every(Boolean)
  const canAnswer = followUpAnswer.trim().length >= 5

  function updateSentence(i, value) {
    setSentences(prev => { const n = [...prev]; n[i] = value; return n })
    if (done[i] && value.trim().length < 5) {
      setDone(prev => { const n = [...prev]; n[i] = false; return n })
    }
  }

  function handleComplete(i) {
    if (done[i] || sentences[i].trim().length < 5) return

    const newDone = done.map((d, idx) => (idx === i ? true : d))
    setDone(newDone)
    setCoinPopKeys(prev => { const n = [...prev]; n[i] = Date.now(); return n })
    addCoinsOptimistic(5)

    if (newDone.every(Boolean)) {
      setTimeout(() => setBonusVisible(true), 300)
      setTimeout(() => setPhase('followup'), 1400)
      setTimeout(() => followUpRef.current?.focus(), 1600)
    } else {
      const nextIdx = newDone.findIndex((d, idx) => !d && idx > i)
      const fallback = newDone.findIndex(d => !d)
      const target   = nextIdx >= 0 ? nextIdx : fallback
      if (target >= 0) setTimeout(() => textareaRefs.current[target]?.focus(), 80)
    }
  }

  async function handleSubmit(withAnswer) {
    if (loading) return
    if (withAnswer && canAnswer) addCoinsOptimistic(8)
    setLoading(true)
    await onSubmit(sentences, withAnswer && canAnswer ? followUpAnswer : null)
    setLoading(false)
  }

  return (
    <div className="space-y-3">

      {/* Date header */}
      <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
        <span className="text-xs font-bold text-gray-400">{getTodayLabel()}</span>
      </div>

      {/* ── 3 sentence boxes ── */}
      {sentences.map((s, i) => {
        const isDone      = done[i]
        const canComplete = s.trim().length >= 5 && !isDone
        const isLocked    = isDone || phase === 'followup'
        const { label, placeholder } = L.fields[i]

        return (
          <div
            key={i}
            className={`relative bg-white rounded-2xl border-2 transition-all duration-200
              ${isDone
                ? 'border-mint/50 bg-mint/[0.03]'
                : phase === 'followup'
                ? 'border-gray-100 opacity-70'
                : 'border-gray-100 shadow-sm'}`}
          >
            {coinPopKeys[i] && (
              <span
                key={coinPopKeys[i]}
                className="absolute -top-6 right-4 text-sm font-extrabold text-yellow-500
                           animate-coin-pop pointer-events-none select-none z-20"
              >
                +5🪙
              </span>
            )}

            <div className="flex items-center gap-2 px-4 pt-3 pb-1">
              <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center
                               font-bold flex-shrink-0 transition-all duration-200
                ${isDone ? 'bg-mint text-white scale-110' : 'bg-gray-100 text-gray-400'}`}>
                {isDone ? '✓' : i + 1}
              </span>
              <span className="text-xs text-gray-400 flex-1">{label}</span>

              {isDone ? (
                <span className="text-[11px] font-bold text-mint">{L.completed}</span>
              ) : canComplete ? (
                <button
                  type="button"
                  onClick={() => handleComplete(i)}
                  className="text-[11px] font-extrabold text-white bg-yellow-400 px-2.5 py-1
                             rounded-lg active:scale-95 transition-transform hover:bg-yellow-500"
                >
                  {L.complete}
                </button>
              ) : (
                s.length > 0 && (
                  <span className="text-[10px] text-gray-300">{s.trim().length}/5</span>
                )
              )}
            </div>

            <textarea
              ref={el => (textareaRefs.current[i] = el)}
              value={s}
              onChange={e => updateSentence(i, e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleComplete(i)
                }
              }}
              placeholder={placeholder}
              rows={2}
              readOnly={isLocked}
              className={`w-full px-4 pb-3 pt-0.5 text-sm placeholder-gray-300
                         focus:outline-none bg-transparent resize-none
                ${isDone ? 'text-gray-500' : 'text-gray-700'}`}
            />
          </div>
        )
      })}

      {/* ── Completion bonus badge ── */}
      {bonusVisible && (
        <div className="flex justify-center animate-milestone-pop">
          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200
                          rounded-full px-4 py-1.5">
            <span className="text-base font-extrabold text-yellow-500">+5🪙</span>
            <span className="text-xs font-semibold text-yellow-700">{L.bonusLabel}</span>
          </div>
        </div>
      )}

      {/* ── Follow-up question card ── */}
      {phase === 'followup' && (
        <div className="bg-white rounded-2xl border-2 border-lavender/40 shadow-md
                        p-4 space-y-3 animate-milestone-pop">

          <div>
            <p className="text-[11px] font-extrabold text-lavender mb-1.5 tracking-wide">
              {L.followTitle}
            </p>
            <p className="text-sm text-gray-700 font-medium leading-relaxed">{prompt}</p>
          </div>

          <div className="relative">
            <textarea
              ref={followUpRef}
              value={followUpAnswer}
              onChange={e => setFollowUpAnswer(e.target.value)}
              placeholder={L.followPH}
              rows={3}
              className="w-full px-3 py-2.5 text-sm text-gray-700 placeholder-gray-300
                         bg-lavender/5 rounded-xl border border-lavender/20
                         focus:outline-none focus:border-lavender/50 resize-none"
            />
            {followUpAnswer.length > 0 && !canAnswer && (
              <span className="absolute bottom-2 right-3 text-[10px] text-gray-300">
                {followUpAnswer.trim().length}/5
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-gray-400
                         bg-gray-50 border border-gray-100 active:scale-95 transition-all"
            >
              {L.skip}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={loading || !canAnswer}
              className={`flex-[2] py-2.5 rounded-xl text-sm font-extrabold transition-all active:scale-95
                ${canAnswer && !loading
                  ? 'bg-lavender text-white shadow-md shadow-lavender/30'
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
            >
              {loading ? L.saving : L.answerBtn}
            </button>
          </div>
        </div>
      )}

      {/* ── Share button (shows after all 3 done, even if follow-up pending) ── */}
      {(allDone || phase === 'followup') && (
        <div className="pt-1">
          <ShareButton sentences={sentences.filter(Boolean)} />
        </div>
      )}
    </div>
  )
}
