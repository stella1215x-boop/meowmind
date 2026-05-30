'use client'

import styles from './CatSvg.module.css'

// ── Stage parameters ──────────────────────────────────────────────────────
//   s  = uniform scale factor (all offsets × s)
//   cy = head-centre Y in SVG viewBox coords (viewBox = 0 0 200 200)
//   tail = whether this stage has a visible tail
const STAGES = [
  { s: 1.0000, cy: 123.5, tail: false },  // Baby
  { s: 1.1818, cy: 120.5, tail: true  },  // Kitten
  { s: 1.3636, cy: 117.5, tail: true  },  // Playful
  { s: 1.5455, cy: 114.5, tail: true  },  // Adult
  { s: 1.6727, cy: 112.4, tail: true  },  // Wise
  { s: 1.8182, cy: 110.0, tail: true  },  // Legendary
]

// ── Colour palettes ───────────────────────────────────────────────────────
const PALETTE = {
  orange: { main: '#F4A261', light: '#FDDCB5', stroke: '#E76F51' },
  grey:   { main: '#9CA3AF', light: '#E5E7EB', stroke: '#6B7280' },
  white:  { main: '#F9FAFB', light: '#FFFFFF', stroke: '#D1D5DB' },
}

const EYE_COLOR  = '#5B4FCF'
const NOSE_COLOR = '#F9A8D4'

// ─────────────────────────────────────────────────────────────────────────
export default function CatSvg({
  stage    = 0,
  color    = 'orange',
  mood     = 'neutral',
  size     = 200,
  className = '',
}) {
  const { s, cy, tail } = STAGES[Math.min(stage, 5)]
  const p  = PALETTE[color] ?? PALETTE.orange
  const CX = 100                          // head centre X is always 100

  // Converts a base-scale offset to an absolute SVG coordinate
  const ax = (dx) => CX + dx * s
  const ay = (dy) => cy + dy * s

  // Stroke widths scaled once
  const sw = {
    tail:    +(5.94 * s).toFixed(2),
    eye:     +(2.97 * s).toFixed(2),
    brow:    +(2.31 * s).toFixed(2),
    mouth:   +(2.31 * s).toFixed(2),
    whisker: +(1.32 * s).toFixed(2),
  }

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      aria-hidden
    >

      {/* ── TAIL (stages 1-5 only) ─────────────────────────────────
          Base offsets from head centre at scale=1:
          M(+33, +13.2)  Q(+52.8, +3.3)  end(+46.2, -9.9)
          fill-box (0%, 100%) = M-point = tail root → perfect pivot    */}
      {tail && (
        <g className={styles.tailGroup}>
          <path
            d={`M${ax(33)},${ay(13.2)} Q${ax(52.8)},${ay(3.3)} ${ax(46.2)},${ay(-9.9)}`}
            stroke={p.stroke}
            strokeWidth={sw.tail}
            fill="none"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* ── LEFT EAR ──────────────────────────────────────────────
          Outer-ear root P1 is at (36%, 100%) of combined fill-box,
          constant for all scale factors.                              */}
      <g className={styles.earLeftGroup}>
        <polygon
          points={[
            `${ax(-33)},${ay(-28.05)}`,
            `${ax(-44.55)},${ay(-52.8)}`,
            `${ax(-12.54)},${ay(-39.6)}`,
          ].join(' ')}
          fill={p.main}
        />
        <polygon
          points={[
            `${ax(-29.7)},${ay(-31.35)}`,
            `${ax(-38.94)},${ay(-47.85)}`,
            `${ax(-16.5)},${ay(-37.95)}`,
          ].join(' ')}
          fill={p.light}
        />
      </g>

      {/* ── RIGHT EAR ─────────────────────────────────────────────
          Mirror of left. Root P1 at (64%, 100%) of fill-box.         */}
      <g className={styles.earRightGroup}>
        <polygon
          points={[
            `${ax(33)},${ay(-28.05)}`,
            `${ax(44.55)},${ay(-52.8)}`,
            `${ax(12.54)},${ay(-39.6)}`,
          ].join(' ')}
          fill={p.main}
        />
        <polygon
          points={[
            `${ax(29.7)},${ay(-31.35)}`,
            `${ax(38.94)},${ay(-47.85)}`,
            `${ax(16.5)},${ay(-37.95)}`,
          ].join(' ')}
          fill={p.light}
        />
      </g>

      {/* ── BODY — head circle + belly tint ───────────────────────
          Breathes from bottom-centre (50%, 100%) of fill-box.        */}
      <g className={styles.bodyGroup}>
        <circle cx={CX}  cy={cy}       r={33    * s} fill={p.main}  />
        <circle cx={CX}  cy={ay(3.3)}  r={21.45 * s} fill={p.light} opacity="0.4" />
      </g>

      {/* ── SAD EYEBROWS (rendered before the eye blink group) ─── */}
      {mood === 'sad' && (
        <>
          <line
            x1={ax(-18.15)} y1={ay(-6.6)}
            x2={ax(-8.25)}  y2={ay(-3.3)}
            stroke={EYE_COLOR} strokeWidth={sw.brow} strokeLinecap="round"
          />
          <line
            x1={ax(8.25)}  y1={ay(-3.3)}
            x2={ax(18.15)} y2={ay(-6.6)}
            stroke={EYE_COLOR} strokeWidth={sw.brow} strokeLinecap="round"
          />
        </>
      )}

      {/* ── LEFT EYE — blinks for all moods except hungry ─────── */}
      <g className={mood !== 'hungry' ? styles.eyeLeftGroup : undefined}>
        <EyeShape mood={mood} side="left"  s={s} ax={ax} ay={ay} color={EYE_COLOR} sw={sw} />
      </g>

      {/* ── RIGHT EYE ─────────────────────────────────────────── */}
      <g className={mood !== 'hungry' ? styles.eyeRightGroup : undefined}>
        <EyeShape mood={mood} side="right" s={s} ax={ax} ay={ay} color={EYE_COLOR} sw={sw} />
      </g>

      {/* ── NOSE ──────────────────────────────────────────────── */}
      <ellipse
        cx={CX}
        cy={ay(5.94)}
        rx={2.97 * s}
        ry={2.31 * s}
        fill={NOSE_COLOR}
      />

      {/* ── MOUTH (same shape for all moods) ──────────────────── */}
      <path
        d={`M${ax(-3.96)},${ay(8.58)} Q${ax(-7.26)},${ay(11.88)} ${ax(-10.56)},${ay(9.24)}`}
        stroke={p.stroke} strokeWidth={sw.mouth} fill="none" strokeLinecap="round"
      />
      <path
        d={`M${ax(3.96)},${ay(8.58)} Q${ax(7.26)},${ay(11.88)} ${ax(10.56)},${ay(9.24)}`}
        stroke={p.stroke} strokeWidth={sw.mouth} fill="none" strokeLinecap="round"
      />

      {/* ── WHISKERS ──────────────────────────────────────────── */}
      <g className={styles.whiskerLeft} opacity="0.6">
        <line x1={ax(-4.95)} y1={ay(6.6)}  x2={ax(-24.75)} y2={ay(3.96)} stroke={p.stroke} strokeWidth={sw.whisker} strokeLinecap="round" />
        <line x1={ax(-4.95)} y1={ay(8.25)} x2={ax(-24.75)} y2={ay(9.9)}  stroke={p.stroke} strokeWidth={sw.whisker} strokeLinecap="round" />
      </g>
      <g className={styles.whiskerRight} opacity="0.6">
        <line x1={ax(4.95)}  y1={ay(6.6)}  x2={ax(24.75)}  y2={ay(3.96)} stroke={p.stroke} strokeWidth={sw.whisker} strokeLinecap="round" />
        <line x1={ax(4.95)}  y1={ay(8.25)} x2={ax(24.75)}  y2={ay(9.9)}  stroke={p.stroke} strokeWidth={sw.whisker} strokeLinecap="round" />
      </g>

    </svg>
  )
}

// ── Eye shape renderer ─────────────────────────────────────────────────────
// All positions are in absolute SVG coords (already scaled).
function EyeShape({ mood, side, s, ax, ay, color, sw }) {
  const L = side === 'left'

  if (mood === 'happy') {
    // Arch path — happy squint  ^_^
    // Left:  M(ax(-16.5), ay(-5.94))  Q(ax(-12.54), ay(-10.56))  (ax(-8.58), ay(-5.94))
    // Right: M(ax(+8.58), ay(-5.94))  Q(ax(+12.54), ay(-10.56))  (ax(+16.5), ay(-5.94))
    const [x1, xQ, x2] = L ? [-16.5, -12.54, -8.58] : [8.58, 12.54, 16.5]
    return (
      <path
        d={`M${ax(x1)},${ay(-5.94)} Q${ax(xQ)},${ay(-10.56)} ${ax(x2)},${ay(-5.94)}`}
        stroke={color}
        strokeWidth={sw.eye}
        fill="none"
        strokeLinecap="round"
      />
    )
  }

  if (mood === 'neutral') {
    // Large round ellipse — fully open, curious
    return (
      <ellipse
        cx={ax(L ? -12.54 : 12.54)}
        cy={ay(-4.95)}
        rx={4.29 * s}
        ry={5.28 * s}
        fill={color}
      />
    )
  }

  if (mood === 'sad') {
    // Squished ellipse — half-closed, worried
    return (
      <ellipse
        cx={ax(L ? -12.54 : 12.54)}
        cy={ay(-3.96)}
        rx={4.29 * s}
        ry={3.30 * s}
        fill={color}
      />
    )
  }

  if (mood === 'hungry') {
    // Flat horizontal line — deadpan hungry stare  ──  ──
    const [x1, x2] = L ? [-16.5, -8.58] : [8.58, 16.5]
    return (
      <line
        x1={ax(x1)} y1={ay(-4.95)}
        x2={ax(x2)} y2={ay(-4.95)}
        stroke={color}
        strokeWidth={sw.eye}
        strokeLinecap="round"
      />
    )
  }

  return null
}
