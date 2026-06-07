'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useLanguage, LanguageSwitcher } from '@/components/shared/LanguageProvider'

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  )
}

function LoginPageInner() {
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const L = t.login

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
    if (!email || !password) { setError(L.errEmail); return }
    setLoading(true)
    const res = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (res?.ok) { window.location.href = '/' }
    else { setError(L.errLogin) }
  }

  async function handleRegister(e) {
    e.preventDefault()
    reset()
    if (!email || !password) { setError(L.errEmail); return }
    if (password.length < 6) { setError(L.errPassword); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || L.errGeneric); setLoading(false); return }
      const loginRes = await signIn('credentials', { email, password, redirect: false })
      setLoading(false)
      if (loginRes?.ok) { window.location.href = '/' }
      else { setSuccess(L.successReg); switchMode('login') }
    } catch {
      setLoading(false)
      setError(L.errNetwork)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-10">
          {/* Heart icon — warm, cute, simple */}
          <div className="flex justify-center mb-5">
            <div className="w-24 h-24 rounded-3xl bg-white shadow-lg shadow-pink-100
                            flex items-center justify-center">
              <svg viewBox="0 0 80 72" className="w-14 h-14" fill="none">
                <path
                  d="M40 64 C40 64 6 44 6 22 C6 12 14 4 24 4 C30 4 36 8 40 14 C44 8 50 4 56 4 C66 4 74 12 74 22 C74 44 40 64 40 64Z"
                  fill="#FDA4AF"
                />
                <path
                  d="M40 58 C40 58 10 40 10 22 C10 14 16 8 24 8 C30 8 36 12 40 18 C44 12 50 8 56 8 C64 8 70 14 70 22 C70 40 40 58 40 58Z"
                  fill="#FB7185"
                />
                {/* Shine */}
                <ellipse cx="26" cy="18" rx="7" ry="5"
                  fill="rgba(255,255,255,0.35)" transform="rotate(-20 26 18)"/>
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-700 tracking-tight">MeowMind</h1>
          <p className="text-gray-400 mt-2 text-sm font-medium leading-relaxed">
            {L.subtitle}
          </p>
          {/* Language switcher */}
          <div className="flex justify-center mt-3">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-gray-100 rounded-2xl p-1 mb-5">
          <button onClick={() => switchMode('login')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              mode === 'login' ? 'bg-white text-gray-700 shadow-sm' : 'text-gray-400'}`}>
            {L.tabLogin}
          </button>
          <button onClick={() => switchMode('register')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              mode === 'register' ? 'bg-white text-gray-700 shadow-sm' : 'text-gray-400'}`}>
            {L.tabRegister}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-3">

          {mode === 'register' && (
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder={L.nickname}
                className="w-full border border-gray-200 rounded-2xl py-3.5 px-4 text-gray-700
                         placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
            />
          )}

          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder={L.email} required
            className="w-full border border-gray-200 rounded-2xl py-3.5 px-4 text-gray-700
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white" />

          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === 'register' ? L.passwordNew : L.password} required
            className="w-full border border-gray-200 rounded-2xl py-3.5 px-4 text-gray-700
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white" />

          {error   && <p className="text-red-400 text-xs px-1">{error}</p>}
          {success && <p className="text-green-500 text-xs px-1">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-400 to-rose-400 text-white
                       rounded-2xl py-3.5 font-bold text-base shadow-md shadow-pink-200
                       hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading
              ? L.loading[mode === 'login' ? 'login' : 'register']
              : (mode === 'login' ? L.btnLogin : L.btnRegister)
            }
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-8 leading-relaxed">
          {L.terms}
        </p>
      </div>
    </div>
  )
}
