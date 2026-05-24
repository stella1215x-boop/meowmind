const POSITIVE_KEYWORDS = [
  '감사', '기쁘', '행복', '좋아', '사랑', '웃', '즐거', '뿌듯', '설레', '기대',
  '힐링', '평화', '따뜻', '포근', '다행', '희망', '칭찬', '성공', '완료', '최고',
  '고마워', '감동', '맛있', '신나', '활기', '건강', '활발',
]

const NEGATIVE_KEYWORDS = [
  '힘들', '슬프', '우울', '피곤', '지치', '걱정', '불안', '화가', '짜증', '아프',
  '외롭', '무섭', '실망', '후회', '스트레스', '답답', '두렵', '지겨', '괴롭',
]

export function tagMood(text) {
  const normalized = text.toLowerCase()
  let posScore = 0
  let negScore = 0

  POSITIVE_KEYWORDS.forEach((kw) => {
    if (normalized.includes(kw)) posScore++
  })
  NEGATIVE_KEYWORDS.forEach((kw) => {
    if (normalized.includes(kw)) negScore++
  })

  if (posScore > negScore) return 'positive'
  if (negScore > posScore) return 'negative'
  return 'neutral'
}

export function extractKeywords(entries) {
  const freq = {}
  const stopWords = new Set(['이', '가', '을', '를', '은', '는', '의', '에', '도', '와', '과', '로', '으로', '에서', '한', '하', '있', '없', '이다', '것', '수', '더', '잘', '너무', '아주', '정말'])

  entries.forEach(({ content }) => {
    const sentences = JSON.parse(content)
    sentences.forEach((sentence) => {
      sentence.split(/[\s,.!?]+/).forEach((word) => {
        const w = word.trim()
        if (w.length >= 2 && !stopWords.has(w)) {
          freq[w] = (freq[w] || 0) + 1
        }
      })
    })
  })

  return Object.entries(freq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }))
}
