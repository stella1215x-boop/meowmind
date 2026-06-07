import { Nunito } from 'next/font/google'
import { headers } from 'next/headers'
import './globals.css'
import SessionProviderWrapper from '@/components/shared/SessionProviderWrapper'
import InstallPrompt from '@/components/shared/InstallPrompt'
import { LanguageProvider } from '@/components/shared/LanguageProvider'
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
  try { session = await getServerSession(authOptions) } catch {}

  // Detect locale from middleware header
  const headersList = headers()
  const locale = headersList.get('x-locale') ?? 'ko'
  const htmlLang = { ko: 'ko', en: 'en', ja: 'ja' }[locale] ?? 'ko'

  return (
    <html lang={htmlLang} className={nunito.variable}>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" />
      </head>
      <body className="font-nunito bg-cream antialiased overscroll-none">
        <SessionProviderWrapper session={session}>
          <LanguageProvider initialLocale={locale}>
            {children}
            <InstallPrompt />
          </LanguageProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  )
}
