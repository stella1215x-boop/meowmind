import { useState } from 'react'
import Image from 'next/image'

const COLOR_OPTIONS = [
  { value: 'orange', label: '주황', bg: 'bg-orange-100', border: 'border-orange-300', emoji: '🟠' },
  { value: 'grey',   label: '회색', bg: 'bg-gray-100',   border: 'border-gray-300',   emoji: '⚫' },
  { value: 'white',  label: '흰색', bg: 'bg-white',      border: 'border-gray-200',   emoji: '⚪' },
]

export default function StepNameCat({ onNext, data, onChange }) {
  const [name, setName] = useState(data.catName || '')
  const [color, setColor] = useState(data.catColor || 'orange')

  function handleNext() {
    if (!name.trim()) return
    onChange({ catName: name.trim(), catColor: color })
    onNext()
  }

  return (
    <div className="flex flex-col items-center px-6 pt-8 pb-6 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-extrabold text-gray-700">고양이를 소개해요!</h2>
        <p className="text-gray-500 text-sm">이름과 털 색깔을 골라주세요</p>
      </div>

      {/* 고양이 미리보기 */}
      <div className="relative w-36 h-36">
        <Image
          src={`/cats/cat_stage0_${color}_happy.svg`}
          alt="고양이 미리보기"
          fill
          className="object-contain drop-shadow-md"
          priority
        />
      </div>

      {/* 색상 선택 */}
      <div className="w-full space-y-3">
        <p className="text-sm font-semibold text-gray-600">털 색깔</p>
        <div className="flex gap-3">
          {COLOR_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setColor(opt.value)}
              className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-2xl border-2 transition-all
                ${color === opt.value
                  ? `${opt.border} ${opt.bg} scale-105 shadow-md`
                  : 'border-gray-100 bg-gray-50'
                }`}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <span className="text-xs font-semibold text-gray-600">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 이름 입력 */}
      <div className="w-full space-y-2">
        <p className="text-sm font-semibold text-gray-600">고양이 이름</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 나비, 코코, 모카..."
          maxLength={12}
          className="w-full border border-gray-200 rounded-2xl py-3.5 px-4 text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-lavender bg-white text-center text-lg font-bold"
        />
        <p className="text-right text-xs text-gray-300">{name.length}/12</p>
      </div>

      <button
        onClick={handleNext}
        disabled={!name.trim()}
        className="w-full bg-lavender text-white rounded-2xl py-4 text-lg font-bold hover:opacity-90 active:scale-95 transition-all disabled:opacity-40"
      >
        {name.trim() ? `${name.trim()}와 함께하기 →` : '이름을 입력해주세요'}
      </button>
    </div>
  )
}
