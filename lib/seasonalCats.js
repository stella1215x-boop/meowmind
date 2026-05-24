// Seasonal cat skins — available for limited windows each year
// image naming: cat_seasonal_{id}_{color}_{emotion}.svg

export const SEASONS = [
  {
    id: 'spring',
    name: '벚꽃 고양이',
    emoji: '🌸',
    description: '봄바람에 꽃잎이 흩날려요',
    months: [3, 4, 5],
    color: '#FFB7C5',
    bgClass: 'from-pink-50 to-white',
  },
  {
    id: 'summer',
    name: '수박 고양이',
    emoji: '🍉',
    description: '시원한 여름을 함께해요',
    months: [6, 7, 8],
    color: '#86EFAC',
    bgClass: 'from-green-50 to-white',
  },
  {
    id: 'halloween',
    name: '할로윈 고양이',
    emoji: '🎃',
    description: '무시무시한 척 하지만 귀여워요',
    // Oct 20–31 only
    months: [10],
    dayRange: [20, 31],
    color: '#FB923C',
    bgClass: 'from-orange-50 to-white',
  },
  {
    id: 'autumn',
    name: '단풍 고양이',
    emoji: '🍂',
    description: '가을 낙엽처럼 따스해요',
    months: [9, 10, 11],
    color: '#FCA5A5',
    bgClass: 'from-orange-50 to-white',
  },
  {
    id: 'christmas',
    name: '크리스마스 고양이',
    emoji: '🎄',
    description: '선물 배달 중인 고양이예요',
    months: [12, 1],
    dayRange: [20, 31],
    color: '#86EFAC',
    bgClass: 'from-red-50 to-white',
  },
  {
    id: 'winter',
    name: '눈사람 고양이',
    emoji: '☃️',
    description: '폭신폭신 눈처럼 귀여워요',
    months: [12, 1, 2],
    color: '#BAE6FD',
    bgClass: 'from-blue-50 to-white',
  },
]

/**
 * Returns the current active seasonal cat config (or null if none).
 * date defaults to today.
 */
export function getCurrentSeason(date = new Date()) {
  const m = date.getMonth() + 1
  const d = date.getDate()

  return SEASONS.find((s) => {
    if (!s.months.includes(m)) return false
    if (s.dayRange) return d >= s.dayRange[0] && d <= s.dayRange[1]
    return true
  }) ?? null
}

/** Returns true if premium is active */
export function isPremiumActive(user) {
  if (!user?.isPremium) return false
  if (!user?.premiumUntil) return false
  return new Date(user.premiumUntil) > new Date()
}
