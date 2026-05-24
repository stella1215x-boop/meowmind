import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import BottomNav from '@/components/shared/BottomNav'
import NotificationPermission from '@/components/shared/NotificationPermission'
import PremiumSection from '@/components/shared/PremiumSection'
import prisma from '@/lib/prisma'

export const metadata = { title: '설정 — MeowMind' }

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const [cat, user] = await Promise.all([
    prisma.cat.findUnique({
      where: { userId: session.user.id },
      select: { totalDaysWritten: true, name: true },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isPremium: true, premiumUntil: true },
    }),
  ])
  const isPremium = !!(user?.isPremium && user?.premiumUntil && new Date(user.premiumUntil) > new Date())

  return (
    <>
      <div className="mobile-container flex flex-col bg-cream">
        <div className="safe-top" />
        <div className="flex-1 scroll-area pb-24 px-4">
          <div className="pt-5 pb-4">
            <h1 className="text-xl font-extrabold text-gray-700">설정</h1>
          </div>

          <div className="space-y-3">
            {/* 계정 */}
            <Section title="계정">
              <SettingRow label="이메일" value={session.user.email} />
            </Section>

            {/* 알림 */}
            <Section title="알림">
              <NotificationPermission />
            </Section>

            {/* 프리미엄 */}
            {(cat?.totalDaysWritten ?? 0) >= 7 && (
              <PremiumSection isPremium={isPremium} catName={cat?.name} />
            )}

            {/* 앱 정보 */}
            <Section title="앱 정보">
              <SettingRow label="버전" value="1.0.0" />
              <SettingRow label="문의" value="support@meowmind.app" />
            </Section>

            {/* 로그아웃 */}
            <Section title="">
              <SignOutButton />
            </Section>
          </div>
        </div>
      </div>
      <BottomNav totalDaysWritten={cat?.totalDaysWritten ?? 0} />
    </>
  )
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {title && (
        <div className="px-4 py-2.5 border-b border-gray-50">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{title}</span>
        </div>
      )}
      {children}
    </div>
  )
}

function SettingRow({ label, value, muted }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className={`text-sm ${muted ? 'text-gray-300' : 'text-gray-400'}`}>{value}</span>
    </div>
  )
}

function SignOutButton() {
  return (
    <form action="/api/auth/signout" method="POST">
      <button
        type="submit"
        className="w-full text-left px-4 py-3.5 text-sm font-semibold text-red-400 active:bg-red-50 transition-colors"
      >
        로그아웃
      </button>
    </form>
  )
}
