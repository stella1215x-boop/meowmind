// ── MeowMind translations ─────────────────────────────────────────────────────

export const TRANSLATIONS = {

  // ── Korean (default) ──────────────────────────────────────────────────────
  ko: {
    locale: 'ko',
    dir: 'ltr',

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

    home: {
      saveError:       '저장 중 오류가 생겼어요. 다시 시도해 주세요.',
      welcome:         (name) => `🎉 ${name}와 함께하는 첫날이에요!`,
      purchaseSuccess: (n) => `🪙 +${n} 코인 충전 완료! 감사합니다 💕`,
    },

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

    cat: {
      streak:      '연속 작성',
      streakUnit:  '일',
      daysToGrow:  (n) => `${n}일 더 쓰면 성장해요 🌱`,
      legendary:   '전설의 고양이!',
      playBtn:     '놀아주기',
      defaultName: '고양이',
      stageLabels: ['아기', '아기 고양이', '청소년', '성인', '현명한 고양이', '전설'],
    },

    store: {
      pantryTitle:   '🐟 보관함',
      empty:         '아직 비어있어요',
      feedBtn:       '먹이기 ▶',
      eating:        '먹는 중',
      useBtn:        '사용 ▶',
      intimacyToast: '+친밀도 💛',
      shopTitle:     '상점',
      daysHint:      (n) => `Days ${n}/10 · 10 days for next growth`,
      categories:    { food: '음식', snacks: '간식', nutrition: '영양제' },
      coinsLabel:    '코인',
      pantryBtn:     '보관함',
      shopBtn:       '상점',
      loading:       '로딩 중…',
    },

    share: {
      btn:             '공유하기',
      platform:        '공유할 플랫폼을 선택하세요',
      native:          '공유',
      close:           '닫기',
      generating:      '카드 생성 중...',
      altText:         '공유 카드 미리보기',
      instagramCopied: '텍스트를 복사했어요!\nInstagram에 붙여넣기 해주세요 📋',
      shareError:      '공유 중 오류가 발생했어요. 텍스트를 복사했어요!',
      journalTitle:    (name) => `${name}의 감사일기 🐱`,
      hashtags:        '#MeowMind #감사일기 #오늘의고양이 #마음챙김 #gratitude',
    },

    nav: {
      home:     '홈',
      history:  '히스토리',
      insights: '인사이트',
      settings: '설정',
    },

    modal: {
      continue:    '계속하기 🐾',
      tapToClose:  '화면을 탭해도 닫힙니다',
      streakDays:  (n) => `${n}일 연속 감사 일기 ✨`,
      bondsDeeper: '우리 사이가 더 깊어졌어요 💛',
      bonusCoins:  '친밀도 보너스 코인!',
      unlocked:    '🔓 신규 해금',
      buyInShop:   '상점에서 구매할 수 있어요!',
    },

    milestones: {
      7:   { emoji: '🌱', title: '7일 달성!',   subtitle: '일주일을 함께했어요',         catAnim: '자라는 중이에요' },
      14:  { emoji: '🌿', title: '14일 달성!',  subtitle: '2주 연속! 대단해요',          catAnim: '무럭무럭 자랐어요' },
      30:  { emoji: '🌳', title: '30일 달성!',  subtitle: '한 달! 인사이트 잠금 해제!',  catAnim: '어른이 됐어요 🎉' },
      60:  { emoji: '⭐', title: '60일 달성!',  subtitle: '두 달 연속, 정말 놀라워요',   catAnim: '현명해졌어요' },
      100: { emoji: '🏆', title: '100일 달성!', subtitle: '전설의 100일! 당신은 전설!', catAnim: '전설이 됐어요 👑' },
    },

    tierRewards: {
      curious:  { title: '호기심 단계 달성!',  subtitle: '고양이가 당신에게 슬쩍 관심을 보이기 시작했어요', unlocks: '🪮 빗  ·  🐭 장난감 쥐' },
      friendly: { title: '친근한 친구!',       subtitle: '고양이가 먼저 다가오기 시작했어요',             unlocks: '🧴 샴푸  ·  💊 종합 영양제' },
      attached: { title: '애착 형성!',         subtitle: '서로에게 없어선 안 될 존재가 됐어요',          unlocks: '🫙 오메가3' },
      soulBond: { title: '영혼의 유대!',       subtitle: '말하지 않아도 마음이 통해요',                 unlocks: '🛋️ 고양이 쿠션' },
      legendary:{ title: '전설의 유대!',       subtitle: '완전한 신뢰 — 최고의 결속',                  unlocks: '🏠 고양이 집' },
    },

    notif: {
      hungry:  (name) => [`${name}가 배고파요 🐟`, `배고파요 😿`, `꼬르륵... 🥺`],
      journal: ['오늘 하루 어땠어요? 📖', '일기 쓰고 같이 놀자! 🧶', '감사한 게 뭐예요? 💭'],
      play:    ['같이 놀자! 🧶', '심심해요 🥱', '놀아줘 놀아줘~ 😽'],
      comfort: ['오늘 힘들었어요? 🤗', '내가 여기 있어요 💕', '꼭 안아드릴게요 🐱'],
      morning: ['좋은 아침이에요! ☀️', '오늘도 좋은 하루 💕'],
      evening: ['오늘 감사한 일 있었나요? 🌙', '자기 전에 같이 써요 📝'],
    },

    coins: {
      title:      '🪙 코인 충전',
      subtitle:   '코인으로 고양이에게 사랑을 표현해요',
      processing: '결제 중...',
      errStart:   '결제를 시작할 수 없어요',
      errNetwork: '네트워크 오류가 발생했어요',
      footer:     '안전한 결제 · 카드/KakaoPay/Naver Pay 지원\n결제 후 즉시 코인이 지급됩니다',
    },

    feedReactions: {
      shy:       ['...냠냠', '고마워요...', '맛있어요 🙈'],
      curious:   ['냠냠~ 맛있어요!', '더 줘도 돼요? 👀', '고마워요 😊'],
      friendly:  ['맛있어! 😸', '최고야 🎉', '행복해~ ❤️'],
      attached:  ['사랑해! 💕', '이게 젤 맛있어~', '네 덕분이야 🥰', '행복 폭발 ✨'],
      soulBond:  ['사랑해 진심으로 💖', '너만 있으면 돼 💛', '꼭 안아줘~ 🤗', '최고의 주인님 ✨'],
      legendary: ['영원히 함께해 💖', '사랑해 사랑해 사랑해 💕', 'Purrrr~~ 👑', '내 전부야 ✨💖'],
    },

    catRequests: {
      hungry:      ['배고파요 🐟', '밥 주세요~ 😿', '꼬르륵... 🥺', '밥!밥!밥! 🐟'],
      feed_prompt: ['맛있는 거 먹고 싶어요 😋', '간식 줘요! 🐟', '오늘도 잘 먹겠습니다 🙏'],
      journal:     ['오늘 하루 어땠어요? 📖', '일기 쓰고 같이 놀자! 🧶', '감사한 게 뭐예요? 💭'],
      play:        ['같이 놀자! 🧶', '심심해요 🥱', '놀아줘 놀아줘~ 😽', '야옹~ 관심줘요!'],
      comfort:     ['오늘 힘들었어요? 🤗', '내가 여기 있어요 💕', '꼭 안아드릴게요 🐱'],
      streak:      ['오늘도 화이팅! 🔥', '연속 기록 지켜요~ 💪', '같이 해낼 수 있어!'],
      morning:     ['좋은 아침이에요! ☀️', '오늘도 좋은 하루 💕', '아침 일기 써요! 🌸'],
      evening:     ['오늘 감사한 일 있었나요? 🌙', '자기 전에 같이 써요 📝', '하루 마무리해요 💤'],
    },
    seasonal: {
      appeared: ' 등장!',
      active:   '사용 중',
      premium:  '프리미엄 👑',
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

    home: {
      saveError:       'Something went wrong. Please try again.',
      welcome:         (name) => `🎉 Your first day with ${name}!`,
      purchaseSuccess: (n) => `🪙 +${n} coins added! Thank you 💕`,
    },

    journal: {
      fields: [
        { label: 'First grateful moment',  placeholder: 'Write one sentence about today...' },
        { label: 'Second grateful moment', placeholder: "Something else you're grateful for?" },
        { label: 'Third grateful moment',  placeholder: 'One more thing to remember 🌱' },
      ],
      complete:     'Done 🪙',
      completed:    'Done ✓',
      bonusLabel:   'Completion bonus!',
      followTitle:  "💬 Today's question",
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
      streakUnit:  ' days',
      daysToGrow:  (n) => `${n} more days to grow 🌱`,
      legendary:   'Legendary cat!',
      playBtn:     'Play',
      defaultName: 'cat',
      stageLabels: ['Newborn', 'Kitten', 'Young Cat', 'Adult', 'Wise Cat', 'Legendary'],
    },

    store: {
      pantryTitle:   '🐟 Pantry',
      empty:         'Nothing here yet',
      feedBtn:       'Feed ▶',
      eating:        'Feeding...',
      useBtn:        'Use ▶',
      intimacyToast: '+Intimacy 💛',
      shopTitle:     'Store',
      daysHint:      (n) => `Day ${n}/10 · 10 days until next growth`,
      categories:    { food: 'Food', snacks: 'Snacks', nutrition: 'Nutrition' },
      coinsLabel:    'coins',
      pantryBtn:     'Pantry',
      shopBtn:       'Shop',
      loading:       'Loading…',
    },

    share: {
      btn:             'Share',
      platform:        'Choose a platform to share',
      native:          'Share',
      close:           'Close',
      generating:      'Creating card... ✨',
      altText:         'Share card preview',
      instagramCopied: 'Text copied!\nPaste it on Instagram 📋',
      shareError:      'Share failed. Text copied!',
      journalTitle:    (name) => `${name}'s gratitude journal 🐱`,
      hashtags:        '#MeowMind #gratitude #dailyjournal #mindfulness #catlife',
    },

    nav: {
      home:     'Home',
      history:  'History',
      insights: 'Insights',
      settings: 'Settings',
    },

    modal: {
      continue:    'Continue 🐾',
      tapToClose:  'Tap anywhere to close',
      streakDays:  (n) => `${n}-day gratitude streak ✨`,
      bondsDeeper: 'Our bond grew deeper 💛',
      bonusCoins:  'Intimacy bonus coins!',
      unlocked:    '🔓 Unlocked',
      buyInShop:   'Available in the shop!',
    },

    milestones: {
      7:   { emoji: '🌱', title: '7-Day Streak!',   subtitle: 'A whole week together',          catAnim: 'Growing fast!' },
      14:  { emoji: '🌿', title: '14-Day Streak!',  subtitle: '2 weeks in a row! Amazing!',     catAnim: 'Getting bigger!' },
      30:  { emoji: '🌳', title: '30-Day Streak!',  subtitle: 'One month! Insights unlocked!',  catAnim: 'All grown up 🎉' },
      60:  { emoji: '⭐', title: '60-Day Streak!',  subtitle: 'Two months — truly incredible',  catAnim: 'So wise now' },
      100: { emoji: '🏆', title: '100-Day Streak!', subtitle: 'Legendary 100 days!',            catAnim: 'A legend 👑' },
    },

    tierRewards: {
      curious:  { title: 'Getting Curious! 👀', subtitle: 'Your cat is starting to notice you',   unlocks: '🪮 Comb  ·  🐭 Toy Mouse' },
      friendly: { title: 'New Friends! 😊',      subtitle: 'Your cat comes to you first now',      unlocks: '🧴 Shampoo  ·  💊 Vitamins' },
      attached: { title: 'Bonded! 💚',           subtitle: "You've become inseparable",            unlocks: '🫙 Omega-3' },
      soulBond: { title: 'Soul Bond! 💛',        subtitle: 'Connected without words',              unlocks: '🛋️ Cat Cushion' },
      legendary:{ title: 'Legendary Bond! 💖',   subtitle: 'Complete trust — the ultimate bond',   unlocks: '🏠 Cat House' },
    },

    notif: {
      hungry:  (name) => [`${name} is hungry 🐟`, `Meow... ${name} needs food 😿`, `${name}'s tummy is rumbling 🥺`],
      journal: ['How was your day? 📖', 'Ready to journal with your cat? 🧶', 'What are you grateful for today? 💭'],
      play:    ["Let's play! 🧶", 'Your cat is bored 🥱', 'Play with me! 😽'],
      comfort: ['Rough day? Your cat is here 🤗', "I'm always here for you 💕", 'Let me cheer you up 🐱'],
      morning: ['Good morning! ☀️', 'Start the day with gratitude 💕'],
      evening: ['Anything to be grateful for today? 🌙', 'Journal before bed 📝'],
    },

    coins: {
      title:      '🪙 Buy Coins',
      subtitle:   'Show your cat some love with coins',
      processing: 'Processing...',
      errStart:   'Unable to start payment',
      errNetwork: 'Network error. Please try again.',
      footer:     'Secure payment · Credit/Debit card supported\nCoins added instantly after purchase',
    },

    feedReactions: {
      shy:       ['...nom nom', 'Thank you...', 'Yummy 🙈'],
      curious:   ['Nom nom~ so good!', 'Can I have more? 👀', 'Thank you 😊'],
      friendly:  ['Delicious! 😸', 'Best day ever 🎉', 'So happy~ ❤️'],
      attached:  ['Love you! 💕', 'This is my fave~', 'Because of you 🥰', 'Happiness overload ✨'],
      soulBond:  ['I love you truly 💖', 'All I need is you 💛', 'Hug me~ 🤗', 'Best human ever ✨'],
      legendary: ['Together forever 💖', 'Love you love you love you 💕', 'Purrrr~~ 👑', "You're my everything ✨💖"],
    },

    catRequests: {
      hungry:      ["I'm hungry 🐟", 'Feed me~ 😿', 'Stomach growling... 🥺', 'Food! Food! 🐟'],
      feed_prompt: ['I want something yummy 😋', 'Give me a snack! 🐟', 'Meal time! 🙏'],
      journal:     ['How was your day? 📖', 'Journal with me! 🧶', 'What are you grateful for? 💭'],
      play:        ["Let's play! 🧶", "I'm bored 🥱", 'Play with me~ 😽', 'Meow~ notice me!'],
      comfort:     ['Rough day? 🤗', "I'm here for you 💕", 'Let me cuddle you 🐱'],
      streak:      ['Keep it up! 🔥', 'Maintain the streak~ 💪', 'We can do it!'],
      morning:     ['Good morning! ☀️', 'Have a great day 💕', 'Morning journal! 🌸'],
      evening:     ['Grateful for today? 🌙', 'Journal before bed 📝', "Let's wrap up 💤"],
    },
    seasonal: {
      appeared: ' is here!',
      active:   'Active',
      premium:  'Premium 👑',
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

    home: {
      saveError:       '保存中にエラーが発生しました。もう一度お試しください。',
      welcome:         (name) => `🎉 ${name}との最初の日！`,
      purchaseSuccess: (n) => `🪙 +${n}コイン追加完了！ありがとうございます 💕`,
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
      streakUnit:  '日',
      daysToGrow:  (n) => `あと${n}日で成長します 🌱`,
      legendary:   '伝説の猫！',
      playBtn:     '遊ぶ',
      defaultName: 'ねこ',
      stageLabels: ['赤ちゃん', '子猫', '若猫', '成猫', '賢い猫', '伝説'],
    },

    store: {
      pantryTitle:   '🐟 保管庫',
      empty:         'まだ何もありません',
      feedBtn:       'あげる ▶',
      eating:        'あげています',
      useBtn:        '使う ▶',
      intimacyToast: '+親密度 💛',
      shopTitle:     'ショップ',
      daysHint:      (n) => `Day ${n}/10 · 次の成長まであと${10-n}日`,
      categories:    { food: 'ごはん', snacks: 'おやつ', nutrition: 'サプリ' },
      coinsLabel:    'コイン',
      pantryBtn:     '保管庫',
      shopBtn:       'ショップ',
      loading:       '読み込み中…',
    },

    share: {
      btn:             'シェアする',
      platform:        'シェア先を選んでください',
      native:          'シェア',
      close:           '閉じる',
      generating:      'カード作成中... ✨',
      altText:         'シェアカードプレビュー',
      instagramCopied: 'テキストをコピーしました！\nInstagramに貼り付けてください 📋',
      shareError:      'シェアに失敗しました。テキストをコピーしました！',
      journalTitle:    (name) => `${name}の感謝日記 🐱`,
      hashtags:        '#MeowMind #感謝日記 #今日の猫 #マインドフルネス #gratitude',
    },

    nav: {
      home:     'ホーム',
      history:  '履歴',
      insights: 'インサイト',
      settings: '設定',
    },

    modal: {
      continue:    '続ける 🐾',
      tapToClose:  '画面をタップして閉じる',
      streakDays:  (n) => `${n}日連続感謝日記 ✨`,
      bondsDeeper: '絆が深まりました 💛',
      bonusCoins:  '親密度ボーナスコイン！',
      unlocked:    '🔓 解放',
      buyInShop:   'ショップで購入できます！',
    },

    milestones: {
      7:   { emoji: '🌱', title: '7日達成！',   subtitle: '一週間一緒に過ごしました',         catAnim: '成長中！' },
      14:  { emoji: '🌿', title: '14日達成！',  subtitle: '2週連続！すごい！',               catAnim: 'すくすく育ってます' },
      30:  { emoji: '🌳', title: '30日達成！',  subtitle: '1ヶ月！インサイト解放！',          catAnim: '大人になりました 🎉' },
      60:  { emoji: '⭐', title: '60日達成！',  subtitle: '2ヶ月連続、本当に素晴らしい',      catAnim: '賢くなりました' },
      100: { emoji: '🏆', title: '100日達成！', subtitle: '伝説の100日！あなたは伝説！',      catAnim: '伝説になりました 👑' },
    },

    tierRewards: {
      curious:  { title: '好奇心段階達成！', subtitle: '猫があなたに興味を持ち始めました',   unlocks: '🪮 ブラシ  ·  🐭 おもちゃのネズミ' },
      friendly: { title: '仲良し！',        subtitle: '猫の方から近づいてきました',         unlocks: '🧴 シャンプー  ·  💊 サプリ' },
      attached: { title: '絆が生まれた！',  subtitle: 'お互いに欠かせない存在になりました', unlocks: '🫙 オメガ3' },
      soulBond: { title: '魂の絆！',        subtitle: '言葉がなくても通じ合えます',        unlocks: '🛋️ 猫クッション' },
      legendary:{ title: '伝説の絆！',      subtitle: '完全な信頼 — 最高の絆',            unlocks: '🏠 猫の家' },
    },

    notif: {
      hungry:  (name) => [`${name}がお腹空いてます 🐟`, `ごはんください...😿`, `${name}がお腹ぺこぺこ 🥺`],
      journal: ['今日はどんな一日でしたか？📖', '日記を書いて一緒に遊ぼう！🧶', '今日感謝したことは？💭'],
      play:    ['一緒に遊ぼう！🧶', '暇だにゃ～ 🥱', '遊んで遊んで～ 😽'],
      comfort: ['疲れた？一緒にいるよ 🤗', 'いつでもそばにいます 💕', '元気出して 🐱'],
      morning: ['おはようございます！☀️', '今日も感謝の気持ちで 💕'],
      evening: ['今日感謝できたこと、ありましたか？🌙', '寝る前に日記を書こう 📝'],
    },

    coins: {
      title:      '🪙 コイン購入',
      subtitle:   'コインで猫への愛情を表現しよう',
      processing: '処理中...',
      errStart:   '決済を開始できません',
      errNetwork: 'ネットワークエラーが発生しました。',
      footer:     '安全な決済 · クレジットカード対応\n購入後すぐにコインが付与されます',
    },

    feedReactions: {
      shy:       ['...もぐもぐ', 'ありがとう...', 'おいしい 🙈'],
      curious:   ['もぐもぐ～おいしい！', 'もっとくれる？ 👀', 'ありがとう 😊'],
      friendly:  ['おいしい！ 😸', '最高 🎉', 'しあわせ～ ❤️'],
      attached:  ['だいすき！ 💕', 'これが一番～', 'あなたのおかげ 🥰', 'しあわせ爆発 ✨'],
      soulBond:  ['本当に愛してる 💖', 'あなただけ 💛', 'だっこして～ 🤗', '最高のご主人様 ✨'],
      legendary: ['ずっと一緒に 💖', '愛してる愛してる 💕', 'ニャーン～ 👑', '全部あなたのもの ✨💖'],
    },

    catRequests: {
      hungry:      ['おなかすいた 🐟', 'ごはんちょうだい～ 😿', 'くうくう... 🥺', 'ごはん！ 🐟'],
      feed_prompt: ['おいしいもの食べたい 😋', 'おやつちょうだい！ 🐟', 'いただきます 🙏'],
      journal:     ['今日はどうだった？ 📖', '日記書いて遊ぼ！ 🧶', '感謝したこと？ 💭'],
      play:        ['一緒に遊ぼ！ 🧶', '暇だにゃ 🥱', '遊んで遊んで～ 😽', 'にゃ～かまって！'],
      comfort:     ['つらかった？ 🤗', 'そばにいるよ 💕', 'だっこしてあげる 🐱'],
      streak:      ['今日もがんばろう！ 🔥', '連続記録守ろう～ 💪', '一緒にできる！'],
      morning:     ['おはよう！ ☀️', '今日もいい一日を 💕', '朝の日記書こう！ 🌸'],
      evening:     ['今日感謝できた？ 🌙', '寝る前に日記を 📝', '一日のまとめしよう 💤'],
    },
    seasonal: {
      appeared: ' 登場！',
      active:   '使用中',
      premium:  'プレミアム 👑',
    },
  },
}

export const SUPPORTED_LOCALES = ['ko', 'en', 'ja']
export const DEFAULT_LOCALE = 'ko'

export function getTranslations(locale) {
  return TRANSLATIONS[locale] ?? TRANSLATIONS[DEFAULT_LOCALE]
}
