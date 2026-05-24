import sharp from 'sharp'
import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../public/icons')

// 라벤더 배경 + 고양이 SVG 아이콘
function makeIconSvg(size) {
  const r = Math.round(size * 0.22) // 귀 크기
  const bodyR = Math.round(size * 0.3)
  const cx = size / 2
  const cy = size / 2 + size * 0.05

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="#C3B1E1"/>
  <!-- 귀 왼쪽 -->
  <polygon points="${cx - bodyR},${cy - bodyR * 0.85} ${cx - bodyR * 1.35},${cy - bodyR * 1.55} ${cx - bodyR * 0.4},${cy - bodyR * 1.2}" fill="#FFF8F0"/>
  <!-- 귀 오른쪽 -->
  <polygon points="${cx + bodyR},${cy - bodyR * 0.85} ${cx + bodyR * 1.35},${cy - bodyR * 1.55} ${cx + bodyR * 0.4},${cy - bodyR * 1.2}" fill="#FFF8F0"/>
  <!-- 머리 -->
  <circle cx="${cx}" cy="${cy}" r="${bodyR}" fill="#FFF8F0"/>
  <!-- 눈 왼쪽 -->
  <ellipse cx="${cx - bodyR * 0.38}" cy="${cy - bodyR * 0.15}" rx="${bodyR * 0.14}" ry="${bodyR * 0.18}" fill="#7B68AE"/>
  <!-- 눈 오른쪽 -->
  <ellipse cx="${cx + bodyR * 0.38}" cy="${cy - bodyR * 0.15}" rx="${bodyR * 0.14}" ry="${bodyR * 0.18}" fill="#7B68AE"/>
  <!-- 코 -->
  <ellipse cx="${cx}" cy="${cy + bodyR * 0.18}" rx="${bodyR * 0.09}" ry="${bodyR * 0.07}" fill="#F9A8C9"/>
  <!-- 수염 왼쪽 -->
  <line x1="${cx - bodyR * 0.12}" y1="${cy + bodyR * 0.22}" x2="${cx - bodyR * 0.7}" y2="${cy + bodyR * 0.15}" stroke="#C3B1E1" stroke-width="${size * 0.012}" stroke-linecap="round"/>
  <line x1="${cx - bodyR * 0.12}" y1="${cy + bodyR * 0.25}" x2="${cx - bodyR * 0.7}" y2="${cy + bodyR * 0.3}" stroke="#C3B1E1" stroke-width="${size * 0.012}" stroke-linecap="round"/>
  <!-- 수염 오른쪽 -->
  <line x1="${cx + bodyR * 0.12}" y1="${cy + bodyR * 0.22}" x2="${cx + bodyR * 0.7}" y2="${cy + bodyR * 0.15}" stroke="#C3B1E1" stroke-width="${size * 0.012}" stroke-linecap="round"/>
  <line x1="${cx + bodyR * 0.12}" y1="${cy + bodyR * 0.25}" x2="${cx + bodyR * 0.7}" y2="${cy + bodyR * 0.3}" stroke="#C3B1E1" stroke-width="${size * 0.012}" stroke-linecap="round"/>
</svg>`
}

const SIZES = [16, 32, 72, 96, 128, 144, 152, 180, 192, 384, 512]

async function generate() {
  for (const size of SIZES) {
    const svg = Buffer.from(makeIconSvg(size))
    await sharp(svg)
      .png()
      .toFile(`${OUT}/icon-${size}x${size}.png`)
    console.log(`✓ icon-${size}x${size}.png`)
  }

  // maskable 아이콘 (safe area 패딩 포함)
  const maskSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#C3B1E1"/>
  ${makeIconSvg(512).replace(/<rect[^/]*\/>/, '')}
</svg>`)

  await sharp(maskSvg).png().toFile(`${OUT}/icon-maskable-512x512.png`)
  console.log('✓ icon-maskable-512x512.png')
  console.log('\n모든 아이콘 생성 완료!')
}

generate().catch(console.error)
