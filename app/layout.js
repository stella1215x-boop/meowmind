import { Nunito } from 'next/font/google'
import './globals.css'
import SessionProviderWrapper from '@/components/shared/SessionProviderWrapper'
import InstallPrompt from '@/components/shared/InstallPrompt'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})

export const metadata = {
  title: 'MeowMind',
  description: '고양이와 함께하는 매일 감사 일기',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MeowMind',
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: 'website',
    title: 'MeowMind',
    description: '고양이와 함께하는 매일 감사 일기',
    siteName: 'MeowMind',
  },
  icons: {
    icon: [
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/icons/icon-32x32.png',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#C3B1E1',
}

export default async function RootLayout({ children }) {
  let session = null
  try {
    session = await getServerSession(authOptions)
  } catch {
    // DB 연결 전이거나 providers 없을 때 — layout은 계속 렌더링
  }

  return (
    <html lang="ko" className={nunito.variable}>
      <head>
        {/* iOS splash screen (기본) */}
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" />
      </head>
      <body className="font-nunito bg-cream antialiased overscroll-none">
        <SessionProviderWrapper session={session}>
          {children}
          <InstallPrompt />
        </SessionProviderWrapper>
      </body>
    </html>
  )
}
