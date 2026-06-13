// Seasonal cat skins — available for limited windows each year

const SEASONS = [
  {
    id: 'spring',
    name:        { ko: '벚꽃 고양이',     en: 'Cherry Blossom Cat', ja: '桜猫' },
    description: { ko: '봄바람에 꽃잎이 흩날려요', en: 'Petals dancing in the spring breeze', ja: '春風に花びらが舞います' },
    emoji: '🌸',
    months: [3, 4, 5],
    color: '#FFB7C5',
    bgClass: 'from-pink-50 to-white',
  },
  {
    id: 'summer',
    name:        { ko: '수박 고양이',    en: 'Watermelon Cat',  ja: 'スイカ猫' },
    description: { ko: '시원한 여름을 함께해요', en: 'Cool summer vibes together', ja: '涼しい夏を一緒に' },
    emoji: '🍉',
    months: [6, 7, 8],
    color: '#86EFAC',
    bgClass: 'from-green-50 to-white',
  },
  {
    id: 'halloween',
    name:        { ko: '할로윈 고양이',  en: 'Halloween Cat',   ja: 'ハロウィン猫' },
    description: { ko: '무시무시한 척 하지만 귀여워요', en: 'Spooky but actually adorable', ja: '怖いふりしているけど可愛い' },
    months: [10],
    dayRange: [20, 31],
    emoji: '🎃',
    color: '#FB923C',
    bgClass: 'from-orange-50 to-white',
  },
  {
    id: 'autumn',
    name:        { ko: '단풍 고양이',    en: 'Autumn Leaf Cat',  ja: '紅葉猫' },
    description: { ko: '가을 낙엽처럼 따스해요', en: 'Warm like autumn leaves', ja: '秋の落ち葉のようにあたたかい' },
    emoji: '🍂',
    months: [9, 10, 11],
    color: '#FCA5A5',
    bgClass: 'from-orange-50 to-white',
  },
  {
    id: 'christmas',
    name:        { ko: '크리스마스 고양이', en: 'Christmas Cat', ja: 'クリスマス猫' },
    description: { ko: '선물 배달 중인 고양이예요', en: 'Delivering gifts with love', ja: 'プレゼント配達中の猫です' },
    emoji: '🎄',
    months: [12, 1],
    dayRange: [20, 31],
    color: '#86EFAC',
    bgClass: 'from-red-50 to-white',
  },
  {
    id: 'winter',
    name:        { ko: '눈사람 고양이', en: 'Snowflake Cat', ja: '雪だるま猫' },
    description: { ko: '폭신폭신 눈처럼 귀여워요', en: 'Soft and fluffy as fresh snow', ja: 'ふわふわの雪みたいに可愛い' },
    emoji: '☃️',
    months: [12, 1, 2],
    color: '#BAE6FD',
    bgClass: 'from-blue-50 to-white',
  },
]

/**
 * Returns the current active seasonal cat config with localized name/description,
 * or null if no season is active.
 */
export function getCurrentSeason(locale = 'ko', date = new Date()) {
  const m = date.getMonth() + 1
  const d = date.getDate()

  const season = SEASONS.find((s) => {
    if (!s.months.includes(m)) return false
    if (s.dayRange) return d >= s.dayRange[0] && d <= s.dayRange[1]
    return true
  })

  if (!season) return null

  const loc = ['ko', 'en', 'ja'].includes(locale) ? locale : 'ko'
  return {
    ...season,
    name:        season.name[loc]        ?? season.name.ko,
    description: season.description[loc] ?? season.description.ko,
  }
}

export function isPremiumActive(user) {
  if (!user?.isPremium) return false
  if (!user?.premiumUntil) return false
  return new Date(user.premiumUntil) > new Date()
}
