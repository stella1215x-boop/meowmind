/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

// GET /api/og?stage=2&color=orange&name=나비&streak=14&total=21
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const stage   = Number(searchParams.get('stage')  ?? 0)
  const color   = searchParams.get('color')   ?? 'orange'
  const name    = searchParams.get('name')    ?? '냐옹이'
  const streak  = Number(searchParams.get('streak') ?? 0)
  const total   = Number(searchParams.get('total')  ?? 0)

  const STAGE_LABELS = ['아기 고양이', '자라는 중', '장난꾸러기', '어른 고양이', '현명한 고양이', '전설의 고양이']
  const stageLabel = STAGE_LABELS[stage] ?? '아기 고양이'

  // Absolute URL for the cat image (edge runtime — use origin from request)
  const origin = new URL(request.url).origin
  const catSrc = `${origin}/cats/cat_stage${stage}_${color}_happy.svg`

  return new ImageResponse(
    (
      <div
        style={{
          width: 1080,
          height: 1080,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #F0EBFF 0%, #E8F8F2 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* 카드 */}
        <div
          style={{
            width: 780,
            background: 'white',
            borderRadius: 48,
            padding: '64px 80px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0,
            boxShadow: '0 24px 64px rgba(195,177,225,0.25)',
          }}
        >
          {/* 앱 이름 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #C3B1E1, #A8E6CF)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 26,
              }}
            >
              🐱
            </div>
            <span style={{ fontSize: 32, fontWeight: 800, color: '#374151' }}>MeowMind</span>
          </div>

          {/* 고양이 이미지 */}
          <img
            src={catSrc}
            alt=""
            width={240}
            height={240}
            style={{ objectFit: 'contain' }}
          />

          {/* 이름 + 스테이지 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 24, gap: 6 }}>
            <span style={{ fontSize: 56, fontWeight: 900, color: '#374151' }}>{name}</span>
            <span
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: '#C3B1E1',
                background: '#F5F0FF',
                padding: '6px 20px',
                borderRadius: 100,
              }}
            >
              {stageLabel}
            </span>
          </div>

          {/* 스탯 */}
          <div style={{ display: 'flex', gap: 32, marginTop: 48 }}>
            <StatBox emoji="🔥" value={`${streak}일`} label="연속 스트릭" />
            <StatBox emoji="📝" value={`${total}일`} label="총 작성일" />
          </div>

          {/* 하단 문구 */}
          <div
            style={{
              marginTop: 48,
              fontSize: 22,
              color: '#9CA3AF',
              textAlign: 'center',
              lineHeight: 1.6,
            }}
          >
            매일 감사한 일 3가지를 기록하며{'\n'}
            {name}와 함께 성장하고 있어요 ✨
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1080,
    }
  )
}

function StatBox({ emoji, value, label }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        background: '#F9FAFB',
        borderRadius: 24,
        padding: '24px 40px',
      }}
    >
      <span style={{ fontSize: 36 }}>{emoji}</span>
      <span style={{ fontSize: 40, fontWeight: 900, color: '#374151' }}>{value}</span>
      <span style={{ fontSize: 18, color: '#9CA3AF', fontWeight: 600 }}>{label}</span>
    </div>
  )
}
