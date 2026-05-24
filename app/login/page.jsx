'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

const IS_DEV = process.env.NODE_ENV === 'development'

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  )
}

function LoginPageInner() {
  const searchParams = useSearchParams()
  const isVerify = searchParams.get('verify') === '1'
  const [email, setEmail] = useState('')
  const [devEmail, setDevEmail] = useState('test@meowmind.app')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleEmailSignIn(e) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError('')
    const res = await signIn('email', { email, redirect: false })
    setLoading(false)
    if (res?.error) {
      setError('이메일 전송에 실패했어요. 다시 시도해 주세요.')
    } else {
      setSent(true)
    }
  }

  async function handleGoogleSignIn() {
    setLoading(true)
    await signIn('google', { callbackUrl: '/' })
  }

  async function handleDevSignIn(e) {
    e.preventDefault()
    setLoading(true)
    const res = await signIn('dev-login', { email: devEmail, redirect: false })
    setLoading(false)
    if (res?.ok) {
      window.location.href = '/'
    } else {
      setError('Dev login failed — is the DB set up? Run: npx prisma db push')
    }
  }

  if (isVerify || sent) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6">
        <div className="text-6xl mb-6">📬</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-3">이메일을 확인해 주세요</h2>
        <p className="text-gray-500 text-center max-w-sm">
          {email || '입력하신 이메일'}로 로그인 링크를 보냈어요.<br />
          링크를 클릭하면 바로 시작할 수 있어요!
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* 로고 + 타이틀 */}
        <div className="text-center mb-10">
          <div className="text-7xl mb-4">🐱</div>
          <h1 className="text-3xl font-bold text-gray-700">MeowMind</h1>
          <p className="text-gray-500 mt-2 text-sm">
            고양이와 함께 하루를 감사하게 기록해요
          </p>
        </div>

        {/* Google 로그인 */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-2xl py-3.5 px-4 text-gray-700 font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-50 mb-4"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google로 계속하기
        </button>

        {/* 구분선 */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">또는</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* 이메일 로그인 */}
        <form onSubmit={handleEmailSignIn} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일 주소 입력"
            required
            className="w-full border border-gray-200 rounded-2xl py-3.5 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lavender bg-white"
          />
          {error && <p className="text-red-400 text-xs px-1">{error}</p>}
          <button
            type="submit"
            disabled={loading || !email}
            className="w-full bg-lavender text-white rounded-2xl py-3.5 font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? '전송 중...' : '이메일로 로그인'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-8">
          계속하면 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
        </p>

        {/* ── Dev-only quick login ─────────────────────────────── */}
        {IS_DEV && (
          <div className="mt-8 border border-dashed border-amber-300 rounded-2xl p-4 bg-amber-50">
            <p className="text-xs font-bold text-amber-600 mb-3">🛠 Dev Login (local only)</p>
            <form onSubmit={handleDevSignIn} className="flex gap-2">
              <input
                type="email"
                value={devEmail}
                onChange={(e) => setDevEmail(e.target.value)}
                className="flex-1 border border-amber-200 rounded-xl py-2 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-amber-400 text-white rounded-xl text-sm font-bold hover:bg-amber-500 transition-colors disabled:opacity-50"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
