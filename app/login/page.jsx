'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  )
}

function LoginPageInner() {
  const searchParams = useSearchParams()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]         = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')

  function reset() {
    setError('')
    setSuccess('')
  }

  function switchMode(m) {
    setMode(m)
    setError('')
    setSuccess('')
  }

  /* ── Login ── */
  async function handleLogin(e) {
    e.preventDefault()
    reset()
    if (!email || !password) { setError('이메일과 비밀번호를 입력해주세요.'); return }
    setLoading(true)
    const res = await signIn('credentials', {
      email, password, redirect: false,
    })
    setLoading(false)
    if (res?.ok) {
      window.location.href = '/'
    } else {
      setError('이메일 또는 비밀번호가 일치하지 않아요.')
    }
  }

  /* ── Register ── */
  async function handleRegister(e) {
    e.preventDefault()
    reset()
    if (!email || !password) { setError('이메일과 비밀번호를 입력해주세요.'); return }
    if (password.length < 6) { setError('비밀번호는 6자 이상이어야 해요.'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || '회원가입에 실패했어요.')
        setLoading(false)
        return
      }
      // Auto-login after successful registration
      const loginRes = await signIn('credentials', {
        email, password, redirect: false,
      })
      setLoading(false)
      if (loginRes?.ok) {
        window.location.href = '/'
      } else {
        setSuccess('가입 완료! 로그인해 주세요.')
        switchMode('login')
      }
    } catch {
      setLoading(false)
      setError('네트워크 오류가 발생했어요.')
    }
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-7xl mb-4">🐱</div>
          <h1 className="text-3xl font-bold text-gray-700">MeowMind</h1>
          <p className="text-gray-500 mt-2 text-sm">
            고양이와 함께 하루를 기록해요
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
          <button
            onClick={() => switchMode('login')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              mode === 'login'
                ? 'bg-white text-gray-700 shadow-sm'
                : 'text-gray-400'
            }`}
          >
            로그인
          </button>
          <button
            onClick={() => switchMode('register')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              mode === 'register'
                ? 'bg-white text-gray-700 shadow-sm'
                : 'text-gray-400'
            }`}
          >
            회원가입
          </button>
        </div>

        {/* Form */}
        <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-3">

          {mode === 'register' && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="닉네임 (선택)"
              className="w-full border border-gray-200 rounded-2xl py-3.5 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lavender bg-white"
            />
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일 주소"
            required
            className="w-full border border-gray-200 rounded-2xl py-3.5 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lavender bg-white"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === 'register' ? '비밀번호 (6자 이상)' : '비밀번호'}
            required
            className="w-full border border-gray-200 rounded-2xl py-3.5 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lavender bg-white"
          />

          {error   && <p className="text-red-400 text-xs px-1">{error}</p>}
          {success && <p className="text-green-500 text-xs px-1">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-lavender text-white rounded-2xl py-3.5 font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading
              ? (mode === 'login' ? '로그인 중...' : '가입 중...')
              : (mode === 'login' ? '로그인' : '회원가입')
            }
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-8">
          계속하면 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
        </p>
      </div>
    </div>
  )
}
