'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  {
    href: '/',
    label: '홈',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 12L12 3l9 9" stroke={active ? '#C3B1E1' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" stroke={active ? '#C3B1E1' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: '/history',
    label: '히스토리',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="18" rx="2" stroke={active ? '#C3B1E1' : '#9CA3AF'} strokeWidth="2"/>
        <path d="M8 2v4M16 2v4M3 10h18" stroke={active ? '#C3B1E1' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round"/>
        <circle cx="8" cy="15" r="1.5" fill={active ? '#C3B1E1' : '#9CA3AF'}/>
        <circle cx="12" cy="15" r="1.5" fill={active ? '#C3B1E1' : '#9CA3AF'}/>
        <circle cx="16" cy="15" r="1.5" fill={active ? '#C3B1E1' : '#9CA3AF'}/>
      </svg>
    ),
  },
  {
    href: '/insights',
    label: '인사이트',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M4 20V14M8 20V10M12 20V4M16 20V12M20 20V8" stroke={active ? '#C3B1E1' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/settings',
    label: '설정',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke={active ? '#C3B1E1' : '#9CA3AF'} strokeWidth="2"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke={active ? '#C3B1E1' : '#9CA3AF'} strokeWidth="2"/>
      </svg>
    ),
  },
]

export default function BottomNav({ totalDaysWritten = 0 }) {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-center">
      <div className="w-full max-w-mobile bg-white/90 backdrop-blur-md border-t border-gray-100 safe-bottom">
        <div className="flex">
          {NAV_ITEMS.map(({ href, label, icon }) => {
            const isActive = pathname === href
            const isLocked = href === '/insights' && totalDaysWritten < 30

            return (
              <Link
                key={href}
                href={isLocked ? '#' : href}
                className={`flex-1 flex flex-col items-center justify-center pt-3 pb-2 gap-0.5 transition-opacity ${
                  isLocked ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''
                }`}
                aria-disabled={isLocked}
              >
                {icon(isActive)}
                <span className={`text-[10px] font-semibold ${isActive ? 'text-lavender' : 'text-gray-400'}`}>
                  {isLocked ? '🔒' : label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
