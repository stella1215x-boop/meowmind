export default function StepWelcome({ onNext }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6 space-y-8">
      <div className="space-y-2">
        <div className="text-8xl animate-float">🐱</div>
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold text-gray-700">
          MeowMind에 오신 것을 환영해요!
        </h1>
        <p className="text-gray-500 text-base leading-relaxed max-w-xs">
          매일 감사한 문장 3개를 쓰면 <br />
          나만의 고양이가 함께 성장해요 🌱
        </p>
      </div>

      <div className="w-full space-y-3 max-w-xs">
        <div className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm">
          <span className="text-2xl">✍️</span>
          <p className="text-sm text-gray-600">하루 3문장, 2분이면 충분해요</p>
        </div>
        <div className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm">
          <span className="text-2xl">🐾</span>
          <p className="text-sm text-gray-600">꾸준히 쓸수록 고양이가 자라요</p>
        </div>
        <div className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm">
          <span className="text-2xl">💜</span>
          <p className="text-sm text-gray-600">놓쳐도 괜찮아요, 판단하지 않아요</p>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full max-w-xs bg-lavender text-white rounded-2xl py-4 text-lg font-bold hover:opacity-90 active:scale-95 transition-all"
      >
        고양이 만나러 가기 →
      </button>
    </div>
  )
}
