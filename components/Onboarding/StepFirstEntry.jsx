import { useState } from 'react'
import Image from 'next/image'

const FIRST_PROMPT = "오늘 이 앱을 시작하게 된 것, 감사한 것, 기대되는 것을 하나씩 적어보세요 😊"

export default function StepFirstEntry({ onComplete, data }) {
  const [sentences, setSentences] = useState(['', '', ''])
  const [loading, setLoading] = useState(false)

  const isValid = sentences.every((s) => s.trim().length >= 5)

  function updateSentence(i, value) {
    setSentences((prev) => {
      const next = [...prev]
      next[i] = value
      return next
    })
  }

  async function handleComplete() {
    if (!isValid) return
    setLoading(true)
    await onComplete({ sentences })
    setLoading(false)
  }

  return (
    <div className="flex flex-col px-6 pt-8 pb-6 space-y-6">
      {/* 고양이 + 말풍선 */}
      <div className="flex items-start gap-4">
        <div className="relative w-20 h-20 flex-shrink-0">
          <Image
            src={`/cats/cat_stage0_${data.catColor || 'orange'}_happy.svg`}
            alt={data.catName || '고양이'}
            fill
            className="object-contain"
          />
        </div>
        <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-sm flex-1">
          <p className="text-xs font-bold text-lavender mb-1">{data.catName || '고양이'}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{FIRST_PROMPT}</p>
        </div>
      </div>

      {/* 3문장 입력 */}
      <div className="space-y-3">
        {['감사한 것', '기쁜 것', '기대되는 것'].map((placeholder, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-lavender text-white rounded-full text-xs flex items-center justify-center font-bold flex-shrink-0">
                {i + 1}
              </span>
              <span className="text-xs text-gray-400">{placeholder}</span>
            </div>
            <textarea
              value={sentences[i]}
              onChange={(e) => updateSentence(i, e.target.value)}
              placeholder={`${placeholder}을 한 문장으로 써보세요`}
              rows={2}
              className="w-full border border-gray-200 rounded-2xl py-3 px-4 text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-lavender bg-white text-sm resize-none"
            />
            <p className={`text-right text-xs ${sentences[i].trim().length >= 5 ? 'text-mint-dark' : 'text-gray-300'}`}>
              {sentences[i].trim().length >= 5 ? '✓' : `${sentences[i].length}자 (최소 5자)`}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={handleComplete}
        disabled={!isValid || loading}
        className="w-full bg-lavender text-white rounded-2xl py-4 text-lg font-bold hover:opacity-90 active:scale-95 transition-all disabled:opacity-40"
      >
        {loading ? '저장 중...' : `${data.catName || '고양이'}와 함께 시작하기 🐱`}
      </button>
    </div>
  )
}
