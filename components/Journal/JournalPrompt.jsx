export default function JournalPrompt({ prompt }) {
  return (
    <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
      <p className="text-xs font-bold text-lavender mb-1">오늘의 질문</p>
      <p className="text-sm text-gray-600 leading-relaxed">{prompt}</p>
    </div>
  )
}
