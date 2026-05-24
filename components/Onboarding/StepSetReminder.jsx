import { useState } from 'react'

const PRESET_TIMES = [
  { label: '아침 8시', value: '08:00', emoji: '🌅' },
  { label: '점심 12시', value: '12:00', emoji: '☀️' },
  { label: '저녁 7시', value: '19:00', emoji: '🌆' },
  { label: '밤 9시', value: '21:00', emoji: '🌙' },
]

export default function StepSetReminder({ onNext, onSkip, data, onChange }) {
  const [time, setTime] = useState(data.reminderTime || '21:00')
  const [useCustom, setUseCustom] = useState(false)

  function handleNext() {
    onChange({ reminderTime: time })
    onNext()
  }

  return (
    <div className="flex flex-col items-center px-6 pt-8 pb-6 space-y-8">
      <div className="text-center space-y-2">
        <div className="text-5xl">🔔</div>
        <h2 className="text-2xl font-extrabold text-gray-700">매일 알림 받기</h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          잊지 않도록 매일 고양이가<br />알림을 보내드릴게요
        </p>
      </div>

      {/* 프리셋 시간 */}
      {!useCustom && (
        <div className="w-full grid grid-cols-2 gap-3">
          {PRESET_TIMES.map((preset) => (
            <button
              key={preset.value}
              onClick={() => setTime(preset.value)}
              className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all
                ${time === preset.value
                  ? 'border-lavender bg-lavender/10 scale-[1.02] shadow-sm'
                  : 'border-gray-100 bg-white'
                }`}
            >
              <span className="text-2xl">{preset.emoji}</span>
              <span className="text-sm font-semibold text-gray-600">{preset.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* 직접 설정 */}
      <div className="w-full space-y-3">
        <button
          onClick={() => setUseCustom(!useCustom)}
          className="text-sm text-lavender font-semibold underline underline-offset-2"
        >
          {useCustom ? '← 빠른 선택으로 돌아가기' : '직접 시간 설정하기'}
        </button>

        {useCustom && (
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border border-gray-200 rounded-2xl py-3.5 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-lavender bg-white text-center text-xl font-bold"
          />
        )}
      </div>

      {/* 선택된 시간 표시 */}
      <div className="w-full bg-mint/20 rounded-2xl p-4 text-center">
        <p className="text-sm text-gray-500">매일 이 시간에 알림이 와요</p>
        <p className="text-2xl font-extrabold text-gray-700 mt-1">
          {(() => {
            const [h, m] = time.split(':')
            const hour = parseInt(h)
            const ampm = hour < 12 ? '오전' : '오후'
            const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
            return `${ampm} ${displayHour}:${m}`
          })()}
        </p>
      </div>

      <div className="w-full space-y-2">
        <button
          onClick={handleNext}
          className="w-full bg-lavender text-white rounded-2xl py-4 text-lg font-bold hover:opacity-90 active:scale-95 transition-all"
        >
          알림 설정 완료 →
        </button>
        <button
          onClick={onSkip}
          className="w-full text-gray-400 text-sm py-2"
        >
          나중에 설정할게요
        </button>
      </div>
    </div>
  )
}
