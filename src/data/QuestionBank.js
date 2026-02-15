const friendQuestions = [
  "消し去りたい記憶を一つ暴露！",
  "初恋の相手の名前を全力で叫べ！",
  "自分が思う自分のダメなところを一つ！",
  "もし自分が異性なら、『絶対に付き合いたくない人』をゆびさして！",
  "『将来お金で苦労しそうな人』をゆびさして！",
  "今の貯金額を全力で叫べ！",
  "最近恥ずかしかったことを暴露！",
  "今までで一番『やらかした』お酒の失敗談を言え！",
  "右隣の人の『直してほしいところ』を耳元でささやけ！",
  "3秒以内に『全力の赤ちゃん言葉』で自己紹介しろ！",
  "『全力の腰振りダンス』を3秒やれ！",
]

const pinkQuestions = [
  // 対人アクション系（即実行）
  "右隣の人の目を5秒見つめろ！",
  "左隣の人の手を握って『ドキドキする』と言え！",
  "右隣の人の耳元で『好き』とささやけ！",
  "向かいの人に投げキッスしろ！",
  "左隣の人の頭をよしよししろ！",
  "一番近い人の肩に頭を乗せて3秒止まれ！",
  "右隣の人の手相を見るフリして手を握れ！",
  "左隣の人に『今日かわいいね』と言え！",
  "一番タイプの人を指さして『付き合って』と言え！",
  "右隣の人の顎をクイッとして目を合わせろ！",
  // 即答暴露系
  "一番セクシーだと思う人の名前を叫べ！",
  "ここにいる人で付き合うなら誰か正直に言え！",
  "初キスの年齢を正直に言え！",
  "今一番ドキドキする人を指さして！",
  "異性に言われて一番キュンとする言葉を言え！",
  "自分のチャームポイントを照れずに言え！",
  "好きな人のタイプを3秒以内に言え！",
  "元カレ・元カノの数を正直に指で出せ！",
  "一番キスしたい人を黙って3秒見つめろ！",
  "右隣の人に『今夜空いてる？』と言え！",
]

const usedQuestions = { friend: new Set(), pink: new Set() }

export function getRandomQuestion(mode) {
  const questions = mode === 'pink' ? pinkQuestions : friendQuestions
  const used = usedQuestions[mode === 'pink' ? 'pink' : 'friend']

  // Reset if all used
  if (used.size >= questions.length) {
    used.clear()
  }

  let idx
  do {
    idx = Math.floor(Math.random() * questions.length)
  } while (used.has(idx))

  used.add(idx)
  return questions[idx]
}

export function resetQuestions() {
  usedQuestions.friend.clear()
  usedQuestions.pink.clear()
}
