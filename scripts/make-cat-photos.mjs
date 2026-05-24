/**
 * 고양이 사진 다운로드 + 배경 제거 스크립트
 * 실행: node scripts/make-cat-photos.mjs
 */

import { removeBackground } from '@imgly/background-removal-node'
import sharp from 'sharp'
import { writeFileSync, existsSync, mkdirSync, writeFile } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { tmpdir } from 'os'
import { join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../public/cats')
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true })

const TARGETS = [
  { color: 'orange', size: 'kitten', tag: 'kitten' },
  { color: 'orange', size: 'adult',  tag: 'orange' },
  { color: 'grey',   size: 'kitten', tag: 'kitten' },
  { color: 'grey',   size: 'adult',  tag: 'grey'   },
  { color: 'white',  size: 'kitten', tag: 'kitten' },
  { color: 'white',  size: 'adult',  tag: 'white'  },
]

async function fetchCatImage(tag) {
  const url = `https://cataas.com/cat/${tag}?width=600&height=600`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return Buffer.from(await res.arrayBuffer())
}

function writeTmp(buf) {
  return new Promise((resolve, reject) => {
    const path = join(tmpdir(), `cat_tmp_${Date.now()}.jpg`)
    writeFile(path, buf, (err) => err ? reject(err) : resolve(path))
  })
}

async function processOne(target) {
  const label = `[${target.color}/${target.size}]`
  const dest  = `${OUT}/${target.color}_${target.size}.png`

  console.log(`\n${label} 다운로드 중...`)
  const raw = await fetchCatImage(target.tag)
  console.log(`${label} ${(raw.length / 1024).toFixed(0)}KB 수신`)

  // sharp 로 JPEG 변환 (포맷 정규화)
  const jpegBuf = await sharp(raw).jpeg({ quality: 92 }).toBuffer()
  const tmpPath = await writeTmp(jpegBuf)

  console.log(`${label} 배경 제거 중...`)
  const blob   = await removeBackground(tmpPath)
  const outBuf = Buffer.from(await blob.arrayBuffer())
  writeFileSync(dest, outBuf)
  console.log(`${label} ✓ 저장 완료 (${(outBuf.length / 1024).toFixed(0)}KB)`)
}

async function run() {
  console.log('🐱 고양이 사진 + 배경 제거 시작\n')
  console.log('⏳ 최초 실행 시 ML 모델 다운로드가 있을 수 있습니다\n')

  for (const target of TARGETS) {
    try {
      await processOne(target)
      await new Promise(r => setTimeout(r, 600))
    } catch (err) {
      console.error(`  ✗  ${target.color}_${target.size}: ${err.message}`)
    }
  }

  console.log('\n✅ 완료! public/cats/ 폴더 확인')
}

run()
