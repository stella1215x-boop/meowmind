'use client'

import { useState, useRef } from 'react'
import JournalPrompt from './JournalPrompt'

const FIELD_CONFIG = [
  { label: '첫 번째 감사한 것', placeholder: '오늘 감사했던 순간을 한 문장으로...' },
  { label: '두 번째 감사한 것', placeholder: '또 다른 감사한 것이 있나요?' },
  { label: '세 번째 감사한 것', placeholder: '마지막으로 하나 더 떠올려보세요 🌱' },
]

export default function JournalForm({ prompt, onSubmit }) {
  const [sentences, setSentences] = useState(['', '', ''])
  const [loading, setLoading] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(null)
  const [shake, setShake] = useState(false)
  const textareaRefs = useRef([])

  const validCount = sentences.filter((s) => s.trim().length >= 2).length
  const isValid = validCount === 3

  function updateSentence(i, value) {
    setSentences((prev) => {
      const next = [...prev]
      next[i] = value
      return next
    })
  }

  function handleKeyDown(e, i) {
    // Enter → move to next field (don't submit form mid-way)
    if (e.key === 'Enter' && !e.shiftKey && i < 2) {
      e.preventDefault()
      textareaRefs.current[i + 1]?.focus()
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (loading) return
    if (!isValid) {
      // Shake the button to signal validation failure
      setShake(true)
      setTimeout(() => setShake(false), 500)
      // Focus the first incomplete field
      const first = sentences.findIndex((s) => s.trim().length < 5)
      textareaRefs.current[first]?.focus()
      return
    }
    setLoading(true)
    await onSubmit(sentences)
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <JournalPrompt prompt={prompt} />

      <div className="space-y-3">
        {sentences.map((s, i) => {
          const done = s.trim().length >= 2
          const { label, placeholder } = FIELD_CONFIG[i]
          return (
            <div
              key={i}
              className={`bg-white rounded-2xl border-2 transition-all duration-200 ${
                focusedIndex === i
                  ? 'border-lavender shadow-md'
                  : done
                  ? 'border-mint/40'
                  : 'border-gray-100 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2 px-4 pt-3">
                <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold flex-shrink-0 transition-all duration-200 ${
                  done ? 'bg-mint text-white scale-110' : 'bg-gray-100 text-gray-400'
                }`}>
                  {done ? '✓' : i + 1}
                </span>
                <span className="text-xs text-gray-400 flex-1">{label}</span>
                {/* Character count — shows once user starts typing */}
                {s.length > 0 && (
                  <span className={`text-[10px] font-medium transition-colors ${
                    done ? 'text-mint-dark' : 'text-gray-300'
                  }`}>
                    {done ? '✓' : `${s.trim().length}/5`}
                  </span>
                )}
              </div>
              <textarea
                ref={(el) => (textareaRefs.current[i] = el)}
                value={s}
                onChange={(e) => updateSentence(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onFocus={() => setFocusedIndex(i)}
                onBlur={() => setFocusedIndex(null)}
                placeholder={placeholder}
                rows={2}
                className="w-full px-4 pb-3 pt-1.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none bg-transparent resize-none"
              />
            </div>
          )
        })}
      </div>

      {/* Progress indicator */}
      {validCount > 0 && validCount < 3 && (
        <div className="flex gap-1.5 justify-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                sentences[i].trim().length >= 2
                  ? 'bg-mint w-8'
                  : 'bg-gray-200 w-4'
              }`}
            />
          ))}
        </div>
      )}

      <button
        type="submit"
        className={`w-full rounded-2xl py-4 text-base font-bold transition-all duration-200 ${
          shake ? 'animate-[wiggle_0.3s_ease-in-out]' : ''
        } ${
          isValid && !loading
            ? 'bg-lavender text-white hover:opacity-90 active:scale-95 shadow-md shadow-lavender/30'
            : loading
            ? 'bg-lavender/70 text-white cursor-wait'
            : 'bg-gray-100 text-gray-400'
        }`}
      >
        {loading
          ? '저장 중...'
          : isValid
          ? '고양이에게 전달하기 🐱'
          : `${validCount}/3 문장 작성 중`}
      </button>
    </form>
  )
}
