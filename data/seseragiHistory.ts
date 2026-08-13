/**
 * PR本文の下に添えられている「広報担当より」のコメント。
 * カードの裏面に、手紙のように置く用途を想定している。
 */
export type SeseragiVoice = {
  author: string;
  role: string;
  /** 1段落1要素。カード裏に収まるよう、2〜3段落・短めを想定 */
  body: string[];
};

export type SeseragiHistoryItem = {
  id: string;
  category: string;
  elapsed: string;
  publishedAt: string;
  title: string;
  summary: string;
  imageUrl: string;
  keywords: string[];
  href?: string;
  voice?: SeseragiVoice;
};

const SAKURA = {
  author: "佐倉 なつめ",
  role: "医療法人せせらぎ 事務局／広報担当",
};

/**
 * 医療法人せせらぎのデモ用静的アーカイブ。
 * DBとは接続せず、この配列だけを表示元とする。
 */
export const SESERAGI_HISTORY: SeseragiHistoryItem[] = [
  {
    id: "akishima-moripark-open",
    category: "開院・地域医療",
    elapsed: "最新",
    publishedAt: "2026年8月13日",
    title:
      "共働き世帯の“もしも”を支える365日診療の小児科「あんどこどもクリニック 昭島モリパーク」が9月1日に開院",
    summary:
      "土・日・祝日も一般外来に対応。開院前には、親子で参加できる院内探検と「子どもの誤飲・窒息」をテーマにした講演会を開催します。",
    imageUrl:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&auto=format&fit=crop&q=85",
    keywords: ["小児科", "365日診療", "昭島"],
    href: "/companies/seseragi/releases/pr-4",
    voice: {
      ...SAKURA,
      body: [
        "「あんど」は、安堵から取った名前です。子どもが安心できる場所にしたい——そう思って始めた準備でしたが、途中から、まず大人のほうが安心できる場所にしたい、と考えるようになりました。",
        "「熱を出した日の朝、まず考えるのは病院のことではなく、仕事をどう調整するかだ」。地域の保護者の方に言われた言葉です。365日という数字を掲げたいわけではありません。今日は開いているだろうか、と調べなくていい。そのくらいの当たり前をつくれたらと思っています。",
      ],
    },
  },
  {
    id: "spring-parenting-consultation",
    category: "子育て支援",
    elapsed: "4ヶ月前",
    publishedAt: "2026年4月6日",
    title: "新生活を迎える親子のための「春の子育て相談週間」を開催",
    summary:
      "入園・入学期に増える子どもの体調や生活リズムの悩みに、小児科医と看護師が身近な言葉で向き合う相談企画です。",
    imageUrl:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?w=1200&auto=format&fit=crop&q=85",
    keywords: ["子育て相談", "新生活", "地域連携"],
    voice: {
      ...SAKURA,
      body: [
        "案内文は、去年よりずっと短くしました。入園・入学の時期に、長い告知を読む余裕はないと受付で気づいたからです。",
        "相談に来られた方の多くが、話し始める前に「こんなことで来ていいのか」とおっしゃいます。その一言をなくしたくて、毎年この企画を続けています。",
      ],
    },
  },
  {
    id: "winter-clinic-calendar",
    category: "診療案内",
    elapsed: "8ヶ月前",
    publishedAt: "2025年12月1日",
    title: "年末年始も、子どもの急な体調変化に応える診療体制をお知らせ",
    summary:
      "保護者が迷わず相談できるよう、診療時間や受診時の持ち物、家庭で確認しておきたいポイントをまとめました。",
    imageUrl:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&auto=format&fit=crop&q=85",
    keywords: ["年末年始", "休日診療", "安心"],
    voice: {
      ...SAKURA,
      body: [
        "診療時間の表を貼るだけのお知らせにするか、最後まで迷いました。",
        "結局、持ち物と受診の目安を足しています。年末の夜に検索する人が知りたいのは、開いているかどうかと、今すぐ行くべきかどうかの二つだと思ったからです。",
      ],
    },
  },
  {
    id: "summer-safety-class",
    category: "健康・イベント",
    elapsed: "1年2ヶ月前",
    publishedAt: "2025年6月12日",
    title: "親子で学ぶ、子どもの熱中症予防と夏の応急手当ミニ講座",
    summary:
      "遊びや外出が増える夏を安心して過ごすために、家庭でできる予防と受診の目安を体験形式で紹介しました。",
    imageUrl:
      "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=1200&auto=format&fit=crop&q=85",
    keywords: ["熱中症", "応急手当", "親子イベント"],
    voice: {
      ...SAKURA,
      body: [
        "「予防」という言葉を本文から一度ぜんぶ消して、書き直しました。",
        "当日、保護者の方が熱心にメモを取っていたのは予防の話ではなく、「どこからが受診の目安か」の部分でした。次に同じ講座をやるときは、そこから書き始めます。",
      ],
    },
  },
  {
    id: "community-holiday-care",
    category: "地域医療",
    elapsed: "1年9ヶ月前",
    publishedAt: "2024年11月20日",
    title: "休日にも頼れる小児科を目指して、地域の診療連携を強化",
    summary:
      "地域の医療機関と連携し、休日の急な発熱や体調不良にも切れ目なく対応できる体制づくりを進めました。",
    imageUrl:
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&auto=format&fit=crop&q=85",
    keywords: ["休日診療", "医療連携", "小児医療"],
    voice: {
      ...SAKURA,
      body: [
        "「連携を強化しました」とだけ書かれたお知らせは、外から見るとほとんど中身が伝わりません。書きながら、ずっとそれが気になっていました。",
        "なので、どの医療機関とどう引き継ぐのかを具体的に書いています。地味なリリースになりましたが、必要な方には届いたと思っています。",
      ],
    },
  },
  {
    id: "tenth-anniversary",
    category: "法人情報",
    elapsed: "2年4ヶ月前",
    publishedAt: "2024年4月1日",
    title: "医療法人せせらぎ設立10周年。これからも「子育てを一緒に」",
    summary:
      "地域の家族に寄り添う小児医療を続けて10年。これまでの歩みと、次の10年に向けた想いを紹介します。",
    imageUrl:
      "https://images.unsplash.com/photo-1542884748-2b87b36c6b90?w=1200&auto=format&fit=crop&q=85",
    keywords: ["10周年", "法人情報", "子育てを一緒に"],
    voice: {
      ...SAKURA,
      body: [
        "10年の歩みを年表にしてみたら、驚くほど淡々としていました。",
        "特別なことをしてきたわけではなく、開けて、診て、閉める。その繰り返しを続けられたことが10年なのだと思い、そのまま書きました。",
      ],
    },
  },
];
