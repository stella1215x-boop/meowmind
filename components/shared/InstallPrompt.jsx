'use client'

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from 'react'

export default function InstallPrompt() {
  const [prompt, setPrompt] = useState(null)     // Android beforeinstallprompt
  const [showIOS, setShowIOS] = useState(false)  // iOS 안내
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    // 이미 설치됐거나 닫은 적 있으면 표시 안 함
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      localStorage.getItem('pwa-install-dismissed')
    ) {
      return
    }

    const isIOS =
      /iphone|ipad|ipod/i.test(navigator.userAgent) &&
      !window.MSStream

    if (isIOS) {
      setShowIOS(true)
      setDismissed(false)
      return
    }

    // Android / Chrome
    const handler = (e) => {
      e.preventDefault()
      setPrompt(e)
      setDismissed(false)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  function dismiss() {
    localStorage.setItem('pwa-install-dismissed', '1')
    setDismissed(true)
  }

  async function install() {
    if (!prompt) return
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') dismiss()
    else dismiss()
  }

  if (dismissed) return null

  // iOS 안내 배너
  if (showIOS) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-32px)] max-w-sm">
        <div className="bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
          <div className="flex items-start gap-3">
            <img src="/icons/icon-72x72.png" alt="앱 아이콘" className="w-12 h-12 rounded-xl flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-gray-700">MeowMind 앱으로 설치하기</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                Safari 하단의{' '}
                <span className="inline-block bg-gray-100 px-1 rounded text-gray-600 font-medium">공유</span>
                {' '}버튼을 눌러{' '}
                <span className="font-semibold text-gray-700">&ldquo;홈 화면에 추가&rdquo;</span>를 선택하세요
              </p>
              <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                <span>Safari</span>
                <span>→</span>
                <span className="text-lg leading-none">⬆️</span>
                <span>→</span>
                <span>홈 화면에 추가</span>
              </div>
            </div>
            <button onClick={dismiss} className="text-gray-300 hover:text-gray-500 flex-shrink-0 text-lg leading-none">
              ✕
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Android / Chrome 배너
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-32px)] max-w-sm">
      <div className="bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
        <div className="flex items-center gap-3">
          <img src="/icons/icon-72x72.png" alt="앱 아이콘" className="w-12 h-12 rounded-xl flex-shrink-0" />
          <div className="flex-1">
            <p className="font-bold text-sm text-gray-700">앱으로 설치하기</p>
            <p className="text-xs text-gray-500">홈 화면에서 바로 열 수 있어요</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={dismiss}
              className="text-xs text-gray-400 px-3 py-1.5 rounded-xl border border-gray-200"
            >
              나중에
            </button>
            <button
              onClick={install}
              className="text-xs text-white bg-lavender px-3 py-1.5 rounded-xl font-semibold"
            >
              설치
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
