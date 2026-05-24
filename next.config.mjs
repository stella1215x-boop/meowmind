import withPWAInit from '@ducanh2912/next-pwa'

const withPWA = withPWAInit({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === 'development',
  customWorkerSrc: 'worker',
  workboxOptions: {
    disableDevLogs: true,
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prevent Next.js from bundling these native/DB packages — load as external Node modules
  serverExternalPackages: [
    '@prisma/client',
    '@prisma/adapter-pg',
    '@prisma/adapter-better-sqlite3',
    'better-sqlite3',
    'pg',
  ],
  images: {
    // public/cats/ 의 실제 고양이 사진 최적화
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [96, 116, 134, 152, 168, 184, 256, 384],
    // SVG도 유지 (아이콘 등)
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

export default withPWA(nextConfig)
