import sharp from 'sharp'
import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../public/cats')

const COLOR_MAP = {
  orange: { body: '#F4A261', inner: '#FDDCB5', accent: '#E76F51' },
  grey:   { body: '#9CA3AF', inner: '#E5E7EB', accent: '#6B7280' },
  white:  { body: '#F9FAFB', inner: '#FFFFFF', accent: '#D1D5DB' },
}

const STATE_EYES = {
  happy:   (cx, cy, r) => `
    <path d="M${cx - r * 0.38 - r * 0.12},${cy - r * 0.18} Q${cx - r * 0.38},${cy - r * 0.32} ${cx - r * 0.38 + r * 0.12},${cy - r * 0.18}" stroke="#5B4FCF" stroke-width="${r * 0.09}" fill="none" stroke-linecap="round"/>
    <path d="M${cx + r * 0.38 - r * 0.12},${cy - r * 0.18} Q${cx + r * 0.38},${cy - r * 0.32} ${cx + r * 0.38 + r * 0.12},${cy - r * 0.18}" stroke="#5B4FCF" stroke-width="${r * 0.09}" fill="none" stroke-linecap="round"/>`,
  neutral: (cx, cy, r) => `
    <ellipse cx="${cx - r * 0.38}" cy="${cy - r * 0.15}" rx="${r * 0.13}" ry="${r * 0.16}" fill="#5B4FCF"/>
    <ellipse cx="${cx + r * 0.38}" cy="${cy - r * 0.15}" rx="${r * 0.13}" ry="${r * 0.16}" fill="#5B4FCF"/>`,
  sad:     (cx, cy, r) => `
    <ellipse cx="${cx - r * 0.38}" cy="${cy - r * 0.12}" rx="${r * 0.13}" ry="${r * 0.1}" fill="#5B4FCF"/>
    <ellipse cx="${cx + r * 0.38}" cy="${cy - r * 0.12}" rx="${r * 0.13}" ry="${r * 0.1}" fill="#5B4FCF"/>
    <line x1="${cx - r * 0.55}" y1="${cy - r * 0.2}" x2="${cx - r * 0.25}" y2="${cy - r * 0.1}" stroke="#5B4FCF" stroke-width="${r * 0.07}" stroke-linecap="round"/>
    <line x1="${cx + r * 0.25}" y1="${cy - r * 0.1}" x2="${cx + r * 0.55}" y2="${cy - r * 0.2}" stroke="#5B4FCF" stroke-width="${r * 0.07}" stroke-linecap="round"/>`,
  hungry:  (cx, cy, r) => `
    <line x1="${cx - r * 0.5}" y1="${cy - r * 0.15}" x2="${cx - r * 0.26}" y2="${cy - r * 0.15}" stroke="#5B4FCF" stroke-width="${r * 0.09}" stroke-linecap="round"/>
    <line x1="${cx + r * 0.26}" y1="${cy - r * 0.15}" x2="${cx + r * 0.5}" y2="${cy - r * 0.15}" stroke="#5B4FCF" stroke-width="${r * 0.09}" stroke-linecap="round"/>`,
}

// 스테이지별 크기 및 장식
const STAGE_CONFIG = [
  { scale: 0.55, extras: '' },                                // 0: 아기
  { scale: 0.65, extras: '' },                                // 1: 자라는 중
  { scale: 0.75, extras: (cx, cy, r) =>                      // 2: 장난꾸러기 — 꼬리
    `<path d="M${cx + r},${cy + r * 0.4} Q${cx + r * 1.6},${cy + r * 0.1} ${cx + r * 1.4},${cy - r * 0.3}" stroke="%ACCENT%" stroke-width="${r * 0.18}" fill="none" stroke-linecap="round"/>` },
  { scale: 0.85, extras: (cx, cy, r) =>                      // 3: 어른
    `<path d="M${cx + r},${cy + r * 0.4} Q${cx + r * 1.7},${cy} ${cx + r * 1.5},${cy - r * 0.4}" stroke="%ACCENT%" stroke-width="${r * 0.2}" fill="none" stroke-linecap="round"/>` },
  { scale: 0.92, extras: (cx, cy, r) =>                      // 4: 현명 — 꼬리 + 별
    `<path d="M${cx + r},${cy + r * 0.4} Q${cx + r * 1.7},${cy} ${cx + r * 1.5},${cy - r * 0.4}" stroke="%ACCENT%" stroke-width="${r * 0.22}" fill="none" stroke-linecap="round"/>
     <text x="${cx - r * 1.4}" y="${cy - r * 1.1}" font-size="${r * 0.45}" text-anchor="middle">⭐</text>` },
  { scale: 1.0,  extras: (cx, cy, r) =>                      // 5: 전설 — 왕관 + 꼬리
    `<path d="M${cx + r},${cy + r * 0.4} Q${cx + r * 1.7},${cy} ${cx + r * 1.5},${cy - r * 0.4}" stroke="%ACCENT%" stroke-width="${r * 0.22}" fill="none" stroke-linecap="round"/>
     <text x="${cx}" y="${cy - r * 1.55}" font-size="${r * 0.55}" text-anchor="middle">👑</text>` },
]

function makeCatSvg(stage, colorKey, state) {
  const SIZE = 200
  const cx = SIZE / 2
  const col = COLOR_MAP[colorKey]
  const cfg = STAGE_CONFIG[stage]
  const r = SIZE * 0.3 * cfg.scale
  const cy = SIZE / 2 + (SIZE * 0.3 - r) * 0.5 + 10

  const extras = typeof cfg.extras === 'function'
    ? cfg.extras(cx, cy, r).replace(/%ACCENT%/g, col.accent)
    : ''

  const ears = `
    <polygon points="${cx - r},${cy - r * 0.85} ${cx - r * 1.35},${cy - r * 1.6} ${cx - r * 0.38},${cy - r * 1.2}" fill="${col.body}"/>
    <polygon points="${cx - r * 0.9},${cy - r * 0.95} ${cx - r * 1.18},${cy - r * 1.45} ${cx - r * 0.5},${cy - r * 1.15}" fill="${col.inner}"/>
    <polygon points="${cx + r},${cy - r * 0.85} ${cx + r * 1.35},${cy - r * 1.6} ${cx + r * 0.38},${cy - r * 1.2}" fill="${col.body}"/>
    <polygon points="${cx + r * 0.9},${cy - r * 0.95} ${cx + r * 1.18},${cy - r * 1.45} ${cx + r * 0.5},${cy - r * 1.15}" fill="${col.inner}"/>
  `

  const nose = `<ellipse cx="${cx}" cy="${cy + r * 0.18}" rx="${r * 0.09}" ry="${r * 0.07}" fill="#F9A8D4"/>`
  const mouth = `
    <path d="M${cx - r * 0.12},${cy + r * 0.26} Q${cx - r * 0.22},${cy + r * 0.36} ${cx - r * 0.32},${cy + r * 0.28}" stroke="${col.accent}" stroke-width="${r * 0.07}" fill="none" stroke-linecap="round"/>
    <path d="M${cx + r * 0.12},${cy + r * 0.26} Q${cx + r * 0.22},${cy + r * 0.36} ${cx + r * 0.32},${cy + r * 0.28}" stroke="${col.accent}" stroke-width="${r * 0.07}" fill="none" stroke-linecap="round"/>
  `
  const whiskers = `
    <line x1="${cx - r * 0.15}" y1="${cy + r * 0.2}" x2="${cx - r * 0.75}" y2="${cy + r * 0.12}" stroke="${col.accent}" stroke-width="${r * 0.04}" stroke-linecap="round" opacity="0.6"/>
    <line x1="${cx - r * 0.15}" y1="${cy + r * 0.25}" x2="${cx - r * 0.75}" y2="${cy + r * 0.3}" stroke="${col.accent}" stroke-width="${r * 0.04}" stroke-linecap="round" opacity="0.6"/>
    <line x1="${cx + r * 0.15}" y1="${cy + r * 0.2}" x2="${cx + r * 0.75}" y2="${cy + r * 0.12}" stroke="${col.accent}" stroke-width="${r * 0.04}" stroke-linecap="round" opacity="0.6"/>
    <line x1="${cx + r * 0.15}" y1="${cy + r * 0.25}" x2="${cx + r * 0.75}" y2="${cy + r * 0.3}" stroke="${col.accent}" stroke-width="${r * 0.04}" stroke-linecap="round" opacity="0.6"/>
  `
  const eyes = STATE_EYES[state](cx, cy, r)

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}">
  <rect width="${SIZE}" height="${SIZE}" fill="#FFF8F0" rx="0" opacity="0"/>
  ${extras}
  ${ears}
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${col.body}"/>
  <circle cx="${cx}" cy="${cy + r * 0.1}" r="${r * 0.65}" fill="${col.inner}" opacity="0.4"/>
  ${eyes}
  ${nose}
  ${mouth}
  ${whiskers}
</svg>`
}

async function generate() {
  const stages = [0, 1, 2, 3, 4, 5]
  const colors = ['orange', 'grey', 'white']
  const states = ['happy', 'neutral', 'sad', 'hungry']

  for (const stage of stages) {
    for (const color of colors) {
      for (const state of states) {
        const svg = makeCatSvg(stage, color, state)
        writeFileSync(`${OUT}/cat_stage${stage}_${color}_${state}.svg`, svg)
      }
    }
  }
  console.log(`✓ ${stages.length * colors.length * states.length}개 고양이 SVG 생성 완료`)
}

generate().catch(console.error)
