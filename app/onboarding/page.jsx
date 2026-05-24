'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import StepWelcome from '@/components/Onboarding/StepWelcome'
import StepNameCat from '@/components/Onboarding/StepNameCat'
import StepSetReminder from '@/components/Onboarding/StepSetReminder'
import StepFirstEntry from '@/components/Onboarding/StepFirstEntry'

const TOTAL_STEPS = 4

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    catName: '',
    catColor: 'orange',
    reminderTime: '21:00',
  })

  function updateData(patch) {
    setFormData((prev) => ({ ...prev, ...patch }))
  }

  function nextStep() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS))
  }

  async function handleComplete({ sentences }) {
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          catName: formData.catName,
          catColor: formData.catColor,
          reminderTime: formData.reminderTime,
          sentences,
        }),
      })

      if (!res.ok) throw new Error('Failed')
      router.push('/?welcome=1')
    } catch {
      alert('저장 중 문제가 생겼어요. 다시 시도해 주세요.')
    }
  }

  return (
    <div className="mobile-container bg-cream">
      {/* 프로그레스 바 */}
      <div className="sticky top-0 z-10 bg-cream/90 backdrop-blur-sm px-6 pt-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="text-gray-400 text-sm font-semibold"
            >
              ← 이전
            </button>
          )}
          <div className={`${step === 1 ? 'ml-auto' : ''} text-xs text-gray-400 font-medium`}>
            {step} / {TOTAL_STEPS}
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div
            className="bg-lavender h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      {/* 단계별 컴포넌트 */}
      <div className="overflow-y-auto">
        {step === 1 && <StepWelcome onNext={nextStep} />}
        {step === 2 && (
          <StepNameCat onNext={nextStep} data={formData} onChange={updateData} />
        )}
        {step === 3 && (
          <StepSetReminder
            onNext={nextStep}
            onSkip={() => { updateData({ reminderTime: null }); nextStep() }}
            data={formData}
            onChange={updateData}
          />
        )}
        {step === 4 && (
          <StepFirstEntry onComplete={handleComplete} data={formData} />
        )}
      </div>
    </div>
  )
}
