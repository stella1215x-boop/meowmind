// ── MeowMind translations ─────────────────────────────────────────────────────

export const TRANSLATIONS = {

  // ── Korean (default) ──────────────────────────────────────────────────────
  ko: {
    locale: 'ko',
    dir: 'ltr',

    // Login
    login: {
      subtitle:    '고양이와 함께 하루를 기록해요 🐱',
      tabLogin:    '로그인',
      tabRegister: '회원가입',
      email:       '이메일 주소',
      password:    '비밀번호',
      passwordNew: '비밀번호 (6자 이상)',
      nickname:    '닉네임 (선택)',
      btnLogin:    '로그인',
      btnRegister: '회원가입',
      loading:     { login: '로그인 중...', register: '가입 중...' },
      terms:       '계속하면 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.',
      errEmail:    '이메일과 비밀번호를 입력해주세요.',
      errPassword: '비밀번호는 6자 이상이어야 해요.',
      errLogin:    '이메일 또는 비밀번호가 일치하지 않아요.',
      errNetwork:  '네트워크 오류가 발생했어요.',
      errGeneric:  '회원가입에 실패했어요.',
      successReg:  '가입 완료! 로그인해 주세요.',
    },

    // Journal form
    journal: {
      fields: [
        { label: '첫 번째 감사한 것', placeholder: '오늘 감사했던 순간을 한 문장으로...' },
        { label: '두 번째 감사한 것', placeholder: '또 다른 감사한 것이 있나요?' },
        { label: '세 번째 감사한 것', placeholder: '마지막으로 하나 더 떠올려보세요 🌱' },
      ],
      complete:     '완료 🪙',
      completed:    '완료 ✓',
      bonusLabel:   '완성 보너스!',
      followTitle:  '💬 오늘의 질문',
      followPH:     '답을 적으면 +8🪙 추가로 받을 수 있어요...',
      skip:         '건너뛸게요',
      answerBtn:    '답하고 +8🪙 받기 🐱',
      saving:       '저장 중...',
      writtenTitle: '오늘 일지를 완료했어요!',
      writtenBody:  (name) => `${name}가 행복해하고 있어요 🐱\n내일 또 만나요!`,
      growHint:     (name) => `매일 꾸준히 10일 쓰면 ${name}가 성장해요 🌱`,
    },

    // Cat & home
    cat: {
      streak:      '연속 작성',
      daysToGrow:  (n) => `${n}일 더 쓰면 성장해요 🌱`,
      legendary:   '전설의 고양이!',
      playBtn:     '놀아주기',
      tapHint:     { 80: (e) => `${e} Tap for love`, 60: '🐾 Tap to play', 40: '🐾 Tap to interact', 20: '🐾 Tap to say hi', 0: '🐾 Tap gently...' },
      stageLabels: ['아기', '아기 고양이', '청소년', '성인', '현명한 고양이', '전설'],
    },

    // Pantry & store
    store: {
      pantryTitle: '🐟 보관함',
      empty:       '아직 비어있어요',
      feedBtn:     '먹이기 ▶',
      useBtn:      '사용 ▶',
      shopTitle:   '상점',
      daysHint:    (n) => `Days ${n}/10 · 10 days for next growth`,
      categories:  { food: '음식', snacks: '간식', nutrition: '영양제' },
      coinsLabel:  '코인',
      pantryBtn:   '보관함',
      shopBtn:     '상점',
    },

    // Share
    share: {
      btn:         '공유하기',
      platform:    '공유할 플랫폼을 선택하세요',
      native:      '공유',
      close:       '닫기',
      generating:  '카드 생성 중...',
      hashtags:    '#MeowMind #감사일기 #오늘의고양이 #마음챙김 #gratitude',
    },

    // Notifications
    notif: {
      hungry:      (name) => [`${name}가 배고파요 🐟`, `배고파요 😿`, `꼬르륵... 🥺`],
      journal:     ['오늘 하루 어땠어요? 📖', '일기 쓰고 같이 놀자! 🧶', '감사한 게 뭐예요? 💭'],
      play:        ['같이 놀자! 🧶', '심심해요 🥱', '놀아줘 놀아줘~ 😽'],
      comfort:     ['오늘 힘들었어요? 🤗', '내가 여기 있어요 💕', '꼭 안아드릴게요 🐱'],
      morning:     ['좋은 아침이에요! ☀️', '오늘도 좋은 하루 💕'],
      evening:     ['오늘 감사한 일 있었나요? 🌙', '자기 전에 같이 써요 📝'],
    },

    // Coin purchase
    coins: {
      title:     '🪙 코인 충전',
      subtitle:  '코인으로 고양이에게 사랑을 표현해요',
      processing:'결제 중...',
      footer:    '안전한 결제 · 카드/KakaoPay/Naver Pay 지원\n결제 후 즉시 코인이 지급됩니다',
    },
  },

  // ── English ───────────────────────────────────────────────────────────────
  en: {
    locale: 'en',
    dir: 'ltr',

    login: {
      subtitle:    'Journal daily. Watch your cat grow. 🐱',
      tabLogin:    'Log in',
      tabRegister: 'Sign up',
      email:       'Email address',
      password:    'Password',
      passwordNew: 'Password (min. 6 characters)',
      nickname:    'Nickname (optional)',
      btnLogin:    'Log in',
      btnRegister: 'Create account',
      loading:     { login: 'Logging in...', register: 'Creating account...' },
      terms:       'By continuing you agree to our Terms of Service and Privacy Policy.',
      errEmail:    'Please enter your email and password.',
      errPassword: 'Password must be at least 6 characters.',
      errLogin:    'Incorrect email or password.',
      errNetwork:  'Network error. Please try again.',
      errGeneric:  'Registration failed. Please try again.',
      successReg:  'Account created! Please log in.',
    },

    journal: {
      fields: [
        { label: 'First grateful moment', placeholder: 'Write one sentence about today...' },
        { label: 'Second grateful moment', placeholder: 'Something else you\'re grateful for?' },
        { label: 'Third grateful moment', placeholder: 'One more thing to remember 🌱' },
      ],
      complete:     'Done 🪙',
      completed:    'Done ✓',
      bonusLabel:   'Completion bonus!',
      followTitle:  '💬 Today\'s question',
      followPH:     'Answer to earn +8🪙 extra...',
      skip:         'Skip',
      answerBtn:    'Answer for +8🪙 🐱',
      saving:       'Saving...',
      writtenTitle: 'Journal complete for today!',
      writtenBody:  (name) => `${name} is so happy 🐱\nSee you tomorrow!`,
      growHint:     (name) => `Write every day for 10 days and ${name} will grow 🌱`,
    },

    cat: {
      streak:      'day streak',
      daysToGrow:  (n) => `${n} more days to grow 🌱`,
      legendary:   'Legendary cat!',
      playBtn:     'Play',
      stageLabels: ['Newborn', 'Kitten', 'Young Cat', 'Adult', 'Wise Cat', 'Legendary'],
    },

    store: {
      pantryTitle: '🐟 Pantry',
      empty:       'Nothing here yet',
      feedBtn:     'Feed ▶',
      useBtn:      'Use ▶',
      shopTitle:   'Store',
      daysHint:    (n) => `Day ${n}/10 · 10 days until next growth`,
      categories:  { food: 'Food', snacks: 'Snacks', nutrition: 'Nutrition' },
      coinsLabel:  'coins',
      pantryBtn:   'Pantry',
      shopBtn:     'Shop',
    },

    share: {
      btn:         'Share',
      platform:    'Choose a platform to share',
      native:      'Share',
      close:       'Close',
      generating:  'Creating card... ✨',
      hashtags:    '#MeowMind #gratitude #dailyjournal #mindfulness #catlife',
    },

    notif: {
      hungry:      (name) => [`${name} is hungry 🐟`, `Meow... ${name} needs food 😿`, `${name}\'s tummy is rumbling 🥺`],
      journal:     ['How was your day? 📖', 'Ready to journal with your cat? 🧶', 'What are you grateful for today? 💭'],
      play:        ['Let\'s play! 🧶', 'Your cat is bored 🥱', 'Play with me! 😽'],
      comfort:     ['Rough day? Your cat is here 🤗', 'I\'m always here for you 💕', 'Let me cheer you up 🐱'],
      morning:     ['Good morning! ☀️', 'Start the day with gratitude 💕'],
      evening:     ['Anything to be grateful for today? 🌙', 'Journal before bed 📝'],
    },

    coins: {
      title:     '🪙 Buy Coins',
      subtitle:  'Show your cat some love with coins',
      processing:'Processing...',
      footer:    'Secure payment · Credit/Debit card supported\nCoins added instantly after purchase',
    },
  },

  // ── Japanese ──────────────────────────────────────────────────────────────
  ja: {
    locale: 'ja',
    dir: 'ltr',

    login: {
      subtitle:    '猫と一緒に、毎日の感謝を記録しよう 🐱',
      tabLogin:    'ログイン',
      tabRegister: '新規登録',
      email:       'メールアドレス',
      password:    'パスワード',
      passwordNew: 'パスワード (6文字以上)',
      nickname:    'ニックネーム (任意)',
      btnLogin:    'ログイン',
      btnRegister: 'アカウント作成',
      loading:     { login: 'ログイン中...', register: '登録中...' },
      terms:       '続けることで、利用規約とプライバシーポリシーに同意したことになります。',
      errEmail:    'メールアドレスとパスワードを入力してください。',
      errPassword: 'パスワードは6文字以上必要です。',
      errLogin:    'メールアドレスまたはパスワードが正しくありません。',
      errNetwork:  'ネットワークエラーが発生しました。',
      errGeneric:  '登録に失敗しました。もう一度お試しください。',
      successReg:  '登録完了！ログインしてください。',
    },

    journal: {
      fields: [
        { label: '感謝したこと①', placeholder: '今日感謝した瞬間を一言で...' },
        { label: '感謝したこと②', placeholder: 'もう一つ感謝できることは？' },
        { label: '感謝したこと③', placeholder: '最後にもう一つ思い出してみて 🌱' },
      ],
      complete:     '完了 🪙',
      completed:    '完了 ✓',
      bonusLabel:   '完成ボーナス！',
      followTitle:  '💬 今日の質問',
      followPH:     '答えると+8🪙もらえます...',
      skip:         'スキップ',
      answerBtn:    '答えて+8🪙 🐱',
      saving:       '保存中...',
      writtenTitle: '今日の日記を書き終えました！',
      writtenBody:  (name) => `${name}がとっても喜んでいます 🐱\nまた明日！`,
      growHint:     (name) => `毎日10日間書き続けると${name}が成長します 🌱`,
    },

    cat: {
      streak:      '日連続',
      daysToGrow:  (n) => `あと${n}日で成長します 🌱`,
      legendary:   '伝説の猫！',
      playBtn:     '遊ぶ',
      stageLabels: ['赤ちゃん', '子猫', '若猫', '成猫', '賢い猫', '伝説'],
    },

    store: {
      pantryTitle: '🐟 保管庫',
      empty:       'まだ何もありません',
      feedBtn:     'あげる ▶',
      useBtn:      '使う ▶',
      shopTitle:   'ショップ',
      daysHint:    (n) => `Day ${n}/10 · 次の成長まであと${10-n}日`,
      categories:  { food: 'ごはん', snacks: 'おやつ', nutrition: 'サプリ' },
      coinsLabel:  'コイン',
      pantryBtn:   '保管庫',
      shopBtn:     'ショップ',
    },

    share: {
      btn:         'シェアする',
      platform:    'シェア先を選んでください',
      native:      'シェア',
      close:       '閉じる',
      generating:  'カード作成中... ✨',
      hashtags:    '#MeowMind #感謝日記 #今日の猫 #マインドフルネス #gratitude',
    },

    notif: {
      hungry:      (name) => [`${name}がお腹空いてます 🐟`, `ごはんください...😿`, `${name}がお腹ぺこぺこ 🥺`],
      journal:     ['今日はどんな一日でしたか？📖', '日記を書いて一緒に遊ぼう！🧶', '今日感謝したことは？💭'],
      play:        ['一緒に遊ぼう！🧶', '暇だにゃ～ 🥱', '遊んで遊んで～ 😽'],
      comfort:     ['疲れた？一緒にいるよ 🤗', 'いつでもそばにいます 💕', '元気出して 🐱'],
      morning:     ['おはようございます！☀️', '今日も感謝の気持ちで 💕'],
      evening:     ['今日感謝できたこと、ありましたか？🌙', '寝る前に日記を書こう 📝'],
    },

    coins: {
      title:     '🪙 コイン購入',
      subtitle:  'コインで猫への愛情を表現しよう',
      processing:'処理中...',
      footer:    '安全な決済 · クレジットカード対応\n購入後すぐにコインが付与されます',
    },
  },
}

export const SUPPORTED_LOCALES = ['ko', 'en', 'ja']
export const DEFAULT_LOCALE = 'ko'

export function getTranslations(locale) {
  return TRANSLATIONS[locale] ?? TRANSLATIONS[DEFAULT_LOCALE]
}
