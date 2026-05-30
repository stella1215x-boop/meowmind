/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mint: '#A8E6CF',
        lavender: '#C3B1E1',
        cream: '#FFF8F0',
        'mint-dark': '#7DD4B0',
        'lavender-dark': '#A892D4',
      },
      fontFamily: {
        nunito: ['var(--font-nunito)', 'Nunito', 'sans-serif'],
      },
      maxWidth: {
        mobile: '390px',
      },
      animation: {
        // 기존
        'bounce-slow': 'bounce 2s infinite',
        'float':       'float 3s ease-in-out infinite',

        // Cat 리액션 5종
        'purr':   'purr 0.5s ease-in-out 3',          // 느린 눈 깜빡 + 진동
        'wag':    'wag 0.35s ease-in-out 4',           // 꼬리 흔들기
        'spin':   'spin-jump 0.6s ease-in-out 1',      // 점프 스핀
        'roll':   'roll 0.8s ease-in-out 2',           // 바닥 구르기
        'knock':  'knock 0.4s ease-in-out 3',          // 물건 치기

        // 마일스톤 축하
        'milestone-pop': 'milestone-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) 1',
        'confetti-fall': 'confetti-fall 1.5s ease-in forwards',

        // 공유 모달 슬라이드업
        'slide-up': 'slide-up 0.3s cubic-bezier(0.32,0.72,0,1)',

        // 폼 유효성 실패 흔들기
        'wiggle': 'wiggle 0.3s ease-in-out',

        // 고양이 캐릭터
        'cat-greet':    'cat-greet 1.7s cubic-bezier(0.34,1.56,0.64,1) both',
        'fur-particle': 'fur-particle var(--fur-dur, 1.8s) ease-out forwards',
        'tail-wag':     'tail-wag 2.6s ease-in-out infinite',
        'body-breathe': 'body-breathe 3.5s ease-in-out infinite',

        // 밥 먹기
        'eat': 'eat 0.4s ease-in-out 4',

        // 코인 획득 팝업
        'coin-pop': 'coin-pop 0.6s cubic-bezier(0.34,1.56,0.64,1) both',

        // ── Intimacy tier idle animations ────────────────────────────────
        // Shy (0-19): cat leans back slightly
        'shy':     'shy 4s ease-in-out infinite',
        // Curious (20-39): curious head tilt
        'peek':    'peek 3s ease-in-out infinite',
        // Friendly+ idle: handled by body-breathe (existing)
        // Attached: handled by float (existing)
        // Soul Bond (80-99): kneading / making biscuits
        'knead':   'knead 0.7s ease-in-out 3',
        // Legendary: excited fast bounce
        'excited': 'excited 0.4s ease-in-out 4',

        // ── Intimacy tap animations ────────────────────────────────────────
        // Head-butt: cat bonks you
        'headbutt': 'headbutt 0.35s ease-in-out 2',
        // Nuzzle: side-to-side rub
        'nuzzle':   'nuzzle 0.5s ease-in-out 3',

        // Heart float particle
        'heart-float': 'heart-float 1.4s ease-out forwards',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%':      { transform: 'translateX(-6px)' },
          '40%':      { transform: 'translateX(6px)' },
          '60%':      { transform: 'translateX(-4px)' },
          '80%':      { transform: 'translateX(4px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        purr: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%':      { transform: 'scale(1.04)' },
        },
        wag: {
          '0%, 100%': { transform: 'rotate(0deg) translateX(0)' },
          '25%':      { transform: 'rotate(-6deg) translateX(-4px)' },
          '75%':      { transform: 'rotate(6deg) translateX(4px)' },
        },
        'spin-jump': {
          '0%':   { transform: 'translateY(0) rotate(0deg) scale(1)' },
          '40%':  { transform: 'translateY(-24px) rotate(180deg) scale(1.1)' },
          '100%': { transform: 'translateY(0) rotate(360deg) scale(1)' },
        },
        roll: {
          '0%':   { transform: 'rotate(0deg) translateY(0)' },
          '30%':  { transform: 'rotate(90deg) translateY(10px)' },
          '60%':  { transform: 'rotate(180deg) translateY(10px)' },
          '100%': { transform: 'rotate(0deg) translateY(0)' },
        },
        knock: {
          '0%, 100%': { transform: 'rotate(0deg) translateX(0)' },
          '30%':      { transform: 'rotate(-10deg) translateX(-6px)' },
          '60%':      { transform: 'rotate(10deg) translateX(6px)' },
        },
        'milestone-pop': {
          '0%':   { transform: 'scale(0.5)', opacity: '0' },
          '100%': { transform: 'scale(1)',   opacity: '1' },
        },
        'confetti-fall': {
          '0%':   { transform: 'translateY(-20px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(200px) rotate(720deg)', opacity: '0' },
        },
        'slide-up': {
          '0%':   { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'cat-greet': {
          '0%':   { transform: 'translateY(30px) scale(0.78)', opacity: '0' },
          '52%':  { transform: 'translateY(-16px) scale(1.09)', opacity: '1' },
          '72%':  { transform: 'translateY(6px) scale(0.97)' },
          '88%':  { transform: 'translateY(-5px) scale(1.02)' },
          '100%': { transform: 'translateY(0px) scale(1)', opacity: '1' },
        },
        'tail-wag': {
          '0%, 100%': { transform: 'rotate(-16deg)' },
          '50%':      { transform: 'rotate(16deg)' },
        },
        'body-breathe': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-2.5px)' },
        },
        eat: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '25%':      { transform: 'translateY(-8px) scale(1.06)' },
          '50%':      { transform: 'translateY(4px) scale(0.96)' },
          '75%':      { transform: 'translateY(-4px) scale(1.03)' },
        },
        'coin-pop': {
          '0%':   { transform: 'translateY(0) scale(0.5)', opacity: '0' },
          '60%':  { transform: 'translateY(-28px) scale(1.15)', opacity: '1' },
          '100%': { transform: 'translateY(-40px) scale(1)', opacity: '0' },
        },

        // ── Intimacy keyframes ──────────────────────────────────────────────
        shy: {
          '0%, 100%': { transform: 'scale(0.96) rotate(-2deg) translateX(-2px)' },
          '50%':      { transform: 'scale(0.98) rotate(0deg) translateX(0px)' },
        },
        peek: {
          '0%, 100%': { transform: 'rotate(0deg) scale(1)' },
          '30%':      { transform: 'rotate(-5deg) scale(1.03)' },
          '70%':      { transform: 'rotate(5deg) scale(1.03)' },
        },
        knead: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg) scale(1)' },
          '25%':      { transform: 'translateY(-5px) rotate(-3deg) scale(1.04)' },
          '75%':      { transform: 'translateY(-5px) rotate(3deg) scale(1.04)' },
        },
        excited: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '25%':      { transform: 'translateY(-14px) scale(1.1)' },
          '50%':      { transform: 'translateY(0) scale(0.95)' },
          '75%':      { transform: 'translateY(-8px) scale(1.06)' },
        },
        headbutt: {
          '0%, 100%': { transform: 'translateX(0) rotate(0deg)' },
          '40%':      { transform: 'translateX(10px) rotate(8deg)' },
          '60%':      { transform: 'translateX(-4px) rotate(-3deg)' },
        },
        nuzzle: {
          '0%, 100%': { transform: 'translateX(0) rotate(0deg)' },
          '20%':      { transform: 'translateX(-8px) rotate(-6deg)' },
          '40%':      { transform: 'translateX(8px) rotate(6deg)' },
          '60%':      { transform: 'translateX(-6px) rotate(-4deg)' },
          '80%':      { transform: 'translateX(6px) rotate(4deg)' },
        },
        'heart-float': {
          '0%':   { transform: 'translateY(0) scale(0.5)', opacity: '1' },
          '60%':  { transform: 'translateY(-40px) scale(1.2)', opacity: '0.9' },
          '100%': { transform: 'translateY(-70px) scale(1)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
