'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { getTranslations, DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/lib/translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ initialLocale, children }) {
  const [locale, setLocale] = useState(initialLocale ?? DEFAULT_LOCALE)
  const t = getTranslations(locale)

  function changeLocale(l) {
    if (!SUPPORTED_LOCALES.includes(l)) return
    setLocale(l)
    // Update URL path
    const path = window.location.pathname
    const segments = path.split('/').filter(Boolean)
    const firstIsLocale = SUPPORTED_LOCALES.includes(segments[0])
    const rest = firstIsLocale ? segments.slice(1) : segments
    const newPath = l === DEFAULT_LOCALE
      ? '/' + rest.join('/')
      : '/' + l + (rest.length ? '/' + rest.join('/') : '')
    window.history.replaceState({}, '', newPath || '/')
    // Persist in cookie for middleware
    document.cookie = `MEOW_LOCALE=${l};path=/;max-age=31536000`
  }

  return (
    <LanguageContext.Provider value={{ locale, t, changeLocale }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) return { locale: DEFAULT_LOCALE, t: getTranslations(DEFAULT_LOCALE), changeLocale: () => {} }
  return ctx
}

// ── Language switcher pill ────────────────────────────────────────────────────
export function LanguageSwitcher({ className = '' }) {
  const { locale, changeLocale } = useLanguage()

  const LANGS = [
    { code: 'ko', flag: '🇰🇷', label: '한국어' },
    { code: 'en', flag: '🇺🇸', label: 'English' },
    { code: 'ja', flag: '🇯🇵', label: '日本語' },
  ]

  return (
    <div className={`flex gap-1 ${className}`}>
      {LANGS.map(l => (
        <button
          key={l.code}
          onClick={() => changeLocale(l.code)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
                      transition-all active:scale-90
            ${locale === l.code
              ? 'bg-lavender text-white shadow-sm'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
        >
          <span>{l.flag}</span>
          <span className="hidden sm:inline">{l.label}</span>
        </button>
      ))}
    </div>
  )
}
