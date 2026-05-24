/**
 * 실제 고양이 사진 다운로드 스크립트
 * 실행: node scripts/download-cat-photos.mjs
 *
 * cataas.com 에서 단계별 고양이 사진을 받아
 * public/cats/photo_stage{0-5}.{jpg|png|webp} 로 저장합니다.
 * Content-Type 헤더로 올바른 확장자를 자동 감지합니다.
 */

import { writeFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../public/cats')
const MANIFEST = resolve(__dirname, '../public/cats/photo_manifest.json')

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true })

const MIME_TO_EXT = {
  'image/jpeg': 'jpg',
  'image/jpg':  'jpg',
  'image/png':  'png',
  'image/webp': 'webp',
  'image/gif':  'gif',
}

const STAGES = [
  { idx: 0, tag: 'kitten', label: '아기 고양이' },
  { idx: 1, tag: 'kitten', label: '자라는 중' },
  { idx: 2, tag: 'cute',   label: '장난꾸러기' },
  { idx: 3, tag: '',       label: '어른 고양이' },
  { idx: 4, tag: '',       label: '현명한 고양이' },
  { idx: 5, tag: '',       label: '전설의 고양이' },
]

async function downloadOne(stage) {
  const url = stage.tag
    ? `https://cataas.com/cat/${stage.tag}?width=480&height=480`
    : `https://cataas.com/cat?width=480&height=480`

  const res = await fetch(url, {
    headers: { Accept: 'image/jpeg, image/png, image/webp, image/*' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const contentType = res.headers.get('content-type')?.split(';')[0]?.trim() ?? 'image/jpeg'
  const ext = MIME_TO_EXT[contentType] ?? 'jpg'
  const filename = `photo_stage${stage.idx}.${ext}`
  const dest = `${OUT}/${filename}`

  // 이전 파일 (다른 확장자) 삭제
  for (const old of ['jpg','png','webp','gif']) {
    const oldPath = `${OUT}/photo_stage${stage.idx}.${old}`
    if (old !== ext && existsSync(oldPath)) unlinkSync(oldPath)
  }

  const buf = await res.arrayBuffer()
  writeFileSync(dest, Buffer.from(buf))
  console.log(`  ✓  [${stage.idx}] ${stage.label} → ${filename} (${(buf.byteLength/1024).toFixed(0)}KB, ${contentType})`)

  return { idx: stage.idx, file: `/cats/${filename}` }
}

async function run() {
  console.log('🐱 고양이 사진 다운로드 시작...\n')
  const manifest = {}

  for (const stage of STAGES) {
    try {
      const { idx, file } = await downloadOne(stage)
      manifest[idx] = file
    } catch (err) {
      console.error(`  ✗  [${stage.idx}] ${stage.label}: ${err.message}`)
    }
    await new Promise(r => setTimeout(r, 500))
  }

  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2))
  console.log('\n✅ 완료! photo_manifest.json 에 경로가 저장됐습니다.')
  console.log('\n📋 CatCharacter.jsx 에서 사용할 경로:')
  Object.entries(manifest).forEach(([i, p]) => console.log(`  stage ${i}: '${p}'`))
}

run()
