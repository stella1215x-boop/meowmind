/**
 * Lottie JSON 전 프레임 배경 제거 스크립트
 * 실행: node scripts/remove-lottie-bg.mjs
 */

import { removeBackground } from '@imgly/background-removal-node'
import sharp from 'sharp'
import { readFileSync, writeFileSync, writeFile, unlinkSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { tmpdir } from 'os'
import { join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SRC  = resolve(__dirname, '../public/cats/cat-lottie.json')
const DEST = resolve(__dirname, '../public/cats/cat-lottie-nobg.json')

// Buffer → 임시 파일 저장 후 경로 반환
function saveTmp(buf, ext = 'jpg') {
  return new Promise((res, rej) => {
    const p = join(tmpdir(), `lottie_frame_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`)
    writeFile(p, buf, err => err ? rej(err) : res(p))
  })
}

async function processAsset(asset, idx, total) {
  const dataUrl = asset.p
  if (!dataUrl || !dataUrl.startsWith('data:')) return asset

  // base64 decode
  const b64    = dataUrl.slice(dataUrl.indexOf(',') + 1)
  const rawBuf = Buffer.from(b64, 'base64')

  // sharp 로 JPEG 변환
  const jpegBuf = await sharp(rawBuf).jpeg({ quality: 90 }).toBuffer()

  // 임시 파일로 저장 (removeBackground 는 파일 경로를 선호)
  const tmpPath = await saveTmp(jpegBuf, 'jpg')

  let result
  try {
    const blob  = await removeBackground(tmpPath)
    const pngBuf = Buffer.from(await blob.arrayBuffer())
    const b64out = pngBuf.toString('base64')
    result = { ...asset, p: `data:image/png;base64,${b64out}` }
  } finally {
    if (existsSync(tmpPath)) unlinkSync(tmpPath)
  }

  const pct = Math.round((idx + 1) / total * 100)
  process.stdout.write(`\r  [${pct}%] 프레임 ${idx + 1}/${total} 완료   `)
  return result
}

async function run() {
  console.log('🐱 Lottie 전 프레임 배경 제거\n')
  const lottie = JSON.parse(readFileSync(SRC, 'utf-8'))
  const assets = lottie.assets ?? []
  console.log(`총 ${assets.length}개 프레임 처리 시작 (약 2~3분 소요)\n`)

  const processed = []
  for (let i = 0; i < assets.length; i++) {
    try {
      processed.push(await processAsset(assets[i], i, assets.length))
    } catch (err) {
      console.error(`\n  ✗ 프레임 ${i}: ${err.message}`)
      processed.push(assets[i])
    }
  }

  writeFileSync(DEST, JSON.stringify({ ...lottie, assets: processed }))
  const kb = Math.round(readFileSync(DEST).length / 1024)
  console.log(`\n\n✅ 완료! cat-lottie-nobg.json (${kb}KB)`)
}

run()
