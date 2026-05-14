import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { TeamSize } from '../pages/Positions';
import GoldenRule from './GoldenRule';
import VideoLink from './VideoLink';
import { S } from './styles';

const PLATFORM_TIPS = [
  ['スイートスポット', '理想的な接触面は手首から2.5〜15cm上の範囲である。'],
  ['カップ・アンド・フォールド', '推奨される技術：片方の拳を握り、もう一方の手をその上に被せる — 親指は平行にして下を向ける。'],
  ['親指を下に', '親指を地面に向けることで前腕が外側に回り、面が締まる。'],
  ['指を組まない', '強いサーブを受けるときは絶対に指を組まない — 骨折のリスクがある。'],
  ['面の角度が方向を決める', '「ボールは面の向いた方向に飛ぶ」 — 深いレシーブには面を45度に、短いレシーブには面を床と平行に近づける。'],
];

const STEPS = [
  'サーバーを読む：インパクトの前にサーブの種類を見極める。',
  '構えの姿勢で腕は離しておく（事前に組まない）。',
  '相手がボールに触れた瞬間に軌道を読む。',
  'サイドステップで移動し、腕を組む前にボールの後ろに入る。',
  '面は早めに作る：ボールが届くタイミングで手を組む、早すぎないこと。',
  'フリーズ：インパクト直前に静止し、体重を前足に乗せる — 1〜2秒キープ。',
  'スイートスポットでインパクト、肩はターゲットのセッターに向ける。',
  'フォロースルー：腰と肩はターゲットへ前進する — 腕は振らない。',
];

const DISPLACEMENTS = [
  {
    name: '横方向（サイドステップ）',
    desc: 'ボール側の足から先に出す。足を交差させず、腰を低くしてサイドステップする。ボールの後ろに入ったらターゲットに体を向け直し、最後の瞬間にフリーズして面を作る。長距離の場合：クロスステップから旋回。',
  },
  {
    name: '前方向（短いボール）',
    desc: '短いサーブやフェイントに対応。前方への踏み込み（ランジ）で終わることが多い：膝を地面に向けて落とし、前の膝の前に面を置く。',
  },
  {
    name: '後ろ方向（ドロップステップ）',
    desc: '足を旋回させてからバックステップする。後ろ向きに走らない（バランスを崩す）。下がるのが間に合わない場合：旋回して横方向に面を作る。',
  },
];

type ReceptionSystem = {
  name: string;
  level: string;
  desc: string;
  pros: string[];
  cons: string[];
  recommended?: boolean;
};

const SYSTEMS_BY_SIZE: Record<TeamSize, ReceptionSystem[]> = {
  6: [
    {
      name: 'Wシステム — 5人レセプション',
      level: 'Beginner',
      desc: '前列に3人、後列に2人 — セッター以外の全員が参加する。「W字フォーメーション」の名前の由来となった伝統的な形（FIVB、USAV IMPACT）。',
      pros: ['1人あたりの担当ゾーンが狭い（約1.8mのレーン）', '必要なコミュニケーションが少ない', 'バレーボール教室やU13-U15に最適'],
      cons: ['5人の間で多くのオーバーラップゾーンが生まれる', 'レセプションの弱い選手も参加せざるを得ない', 'アタッカーの動きが乱れる（前列の3人がレセプションに参加）'],
    },
    {
      name: 'Uシステム — 3人レセプション',
      level: 'Modern standard',
      desc: 'リベロがゾーン6（サーバーの主なターゲット）に入り、ウィングがゾーン5と1に位置する。最良の3人のレシーバーが全てのボールを取り、前列のアタッカーは全員レセプションから外れる。',
      pros: ['コミュニケーションが3人に簡素化される', '最良の3人のレシーバーが全てをカバー', '前列のアタッカーが助走に集中できる'],
      cons: ['横方向のゾーンが広くなる（1人あたり約3m）', '高水準のリベロが必要', 'コーナーへの短いサーブに弱い'],
      recommended: true,
    },
    {
      name: '2人レセプション — リベロ + R4',
      level: 'Elite',
      desc: '2人のレシーバー（リベロ＋選ばれたR4の1人）だけで全幅をカバーする。トップレベルで使われ、もう1人のR4を解放してレセプションで消耗させずアタックに集中させるための戦術。',
      pros: ['全アタッカーがオフェンス転換に使える', 'アタッカーがレセプションで消耗しないためブロック／アタックが向上', 'プロチームに好まれるシステム（ポーランド、フランス、イタリア）'],
      cons: ['非常に運動能力の高い2人のレシーバーが必要（各約4.5mのレーン）', 'ミスの余地がない — サーブの読み違い＝相手の得点', '国際レベルのリベロなしでは使えない'],
    },
  ],
  5: [
    {
      name: '3人レセプション — 2F-3B配置',
      level: 'Recommended',
      desc: '後列の3人（P5、P6、P1）がレセプションする。P1のセッターはレセプションから外れ、サーバーがボールに触れた瞬間に飛び出す（6v6の5-1と同じ）。前列の2人（P4、P3）は助走に集中できる。',
      pros: ['6v6の5-1に最も近い配置（教育的に理想的）', 'レセプションからアタックへの転換がスムーズ', '前列2人のアタッカー＋バックローのパイプが可能'],
      cons: ['9mを3人でカバー（1人あたり約3m）', 'セッターは素早く読み1秒未満で飛び出すか判断する必要がある', 'セッターが早く離れすぎるとP1に穴ができる'],
      recommended: true,
    },
    {
      name: '4人レセプション — 3F-2B配置',
      level: 'Standard',
      desc: '後列の2人（P5、P1）＋前列の2人（通常はP4とP3 — P2のセッターはレセプションから外れる）が受ける。セッターはターゲット位置に留まる：飛び出しなし、即座に配球。',
      pros: ['ゾーンが狭くなる（1人あたり約2.25m）', '混成チームや初級者チームに最適', 'セッターはすでにターゲットにいる — 転換不要'],
      cons: ['前列で使えるアタッカーが2人だけ（P4＋P3またはP4＋ミドル）', 'レセプションした前列の選手はそこから助走に入る必要がある', 'セッターがネット際に上がるため2枚ブロックが難しい'],
    },
    {
      name: 'ペンタゴンレセプション — 4人または5人',
      level: 'Beginner / recreational',
      desc: '5人のレシーバー（5人Wと同等）。ネット中央に1人（多くは専任セッター）、ウィング2人が中盤、後列の2人が深いゾーンに入る。中央が専任セッターでない限り全員がレセプションに参加。',
      pros: ['コートを均等にカバー', '技術的要求が非常に低い', '導入トレーニングセッションに適する'],
      cons: ['5人のレシーバーがいると重複が多い', 'アタッカーが誰も解放されない', 'レベルが上がると効果がなくなる'],
    },
  ],
  4: [
    {
      name: 'ダイヤモンド（3人レセプション）',
      level: 'Standard 4v4',
      desc: 'ネット中央にセッター（P3、レセプションから外れる）。ウィング2人（P4、P2）がミッドコート＋唯一の後列選手（P1）が深いゾーンを受ける。インドア4v4で最も一般的な形（大学のインターミューラル）。',
      pros: ['セッターはすでにターゲットにいる — 飛び出し不要', '3つの明確かつ対称的なゾーン', 'インターミューラル、レクリエーション、ビーチ4sに最適'],
      cons: ['3人で9mをカバー＝1人あたり約3m', '唯一の後列選手がレセプション後に深いゾーン全体を守らなければならない', '前列のアタッカーが2人だけ'],
      recommended: true,
    },
    {
      name: '3-1ライン（3人レセプション）',
      level: 'Intermediate',
      desc: '唯一のセッターはP1（バックロー）、相手のサーブインパクトの瞬間にゾーン2へ飛び出す。前列の3人のアタッカー（P4、P3、P2）がレセプションする。6v6の5-1の簡素化版。',
      pros: ['常に前列に3人のアタッカー', '6v6の5-1への準備に教育的に有用', 'セッターも配球後にアタック可能'],
      cons: ['非常にクリーンなレセプションが必要（飛び出しは厳しい）', 'セッターが守備の前に離れるとP1に穴', 'すべてのアタッカーがレセプションできなければならない'],
    },
    {
      name: 'ボックス2-2（4人レセプション）',
      level: 'Beginner',
      desc: '前列2人（P4、P2）＋後列2人（P5、P1）、ネット際の専任セッターなし。1本目の後で最も適した位置の選手が2本目を取る。導入トレーニングやU11-U13に典型的。',
      pros: ['コート全体をカバー（4ゾーン、各2.25m）', 'セッターに技術的要求なし', '全員がレセプション — 非常に教育的'],
      cons: ['専任セッターがいない — 配球はランダム', 'アタッカーが助走に集中できない', 'レベルが上がると効果がなくなる'],
    },
  ],
};

type PasseurRole = {
  title: string;
  bullets: string[];
  note?: string;
};

const PASSEUR_BY_SIZE: Record<TeamSize, PasseurRole[]> = {
  6: [
    {
      title: 'バックロー・セッター（P1 / P6 / P5） — 5-1のP1、P6、P5ローテーション',
      bullets: [
        'レセプションから外れる：自分にボールは来ない。',
        '特別な位置からスタート（例：P1ではネットから約7.5m、サイドラインから1m）、他の選手の陰に隠れる（スタック）。',
        'ターゲット（Z2とZ3の間、ネットから約1m、中央から右に3m）に向かって、相手がサーブに触れた瞬間に飛び出す — それより前は反則（オーバーラップ）。',
        'P1：最短の飛び出し；P6：中央からの飛び出し；P5：最長の飛び出し（対角線）。',
        '前列に3人のアタッカー（R4＋ミドル＋オポジット）＋バックローアタックが使える。',
      ],
    },
    {
      title: 'フロントロー・セッター（P2 / P3 / P4） — 5-1のP2、P3、P4ローテーション',
      bullets: [
        'レセプションから外れる：すでにターゲットの近くにいる。',
        'P2：すでにターゲットにいる — 相手R4のZ4からのアタックに対するラインブロッカーにもなる（守備の負担が二重）。',
        'P3：サーブが触れられた直後にターゲットへ横にスイッチする。',
        'P4：ネット全体を横切ってターゲットに到達する（前列で最も長い移動）。',
        '前列のアタッカーは2人だけ（P6のパイプとP1からのオポジットのバックローアタックで補う）。',
      ],
    },
  ],
  5: [
    {
      title: '飛び出すセッター（2F-3B配置、推奨）',
      bullets: [
        'P1バックローからスタートし、レセプションから外れる。',
        '相手のサーブが触れられた瞬間にターゲット（Z2/Z3、ネットから約1m）へ飛び出す — 6v6の5-1と同じ。',
        '後列の3人（P5＋P6＋抜けたP1）が3人レセプションをカバーする。',
        'ボールが守られる前に離れないこと（よくあるミス：早すぎる離脱 → P1に穴）。',
      ],
      note: '6v6に最も近い配置 — 6v6への移行を準備するために推奨。',
    },
    {
      title: '固定フロントロー・セッター（3F-2Bまたはペンタゴン配置）',
      bullets: [
        'ターゲット（配置に応じてP2またはP3）に留まる：飛び出しなし。',
        'レセプションから外れる：自分にボールは来ない。',
        'パスが届くとすぐに配球 — 転換不要。',
        'P2：相手のアウトサイドヒッターに対するラインブロッカーにもなる（6v6の5-1と同様）。',
      ],
    },
  ],
  4: [
    {
      title: 'ダイヤモンドの前列セッター（P3ネット中央）',
      bullets: [
        'ターゲット（Z3、ネットから約1m）に留まる：飛び出しなし。',
        'レセプションから外れる：他の3人（ウィング2人＋後列1人）が受ける。',
        'パスの質に応じてZ4またはZ2へ素早く配球。',
        'ディフェンスからトスへの転換は2秒以内に行わなければならない（後列が1人だけ＝広範囲のカバー）。',
      ],
      note: 'インドア4v4で最もよく使われる形。',
    },
    {
      title: '3-1ラインの飛び出すセッター（P1バックロー）',
      bullets: [
        'P1バックローからスタートし、レセプションから外れる。',
        '相手のサーブが触れられた瞬間にゾーン2へ飛び出す。',
        '前列の3人のアタッカー（P4、P3、P2）が受ける。',
        '非常にクリーンなレセプションが必要 — そうでなければセッターは間に合わない。',
      ],
    },
    {
      title: '専任セッターなし（ボックス2-2）',
      bullets: [
        '1本目の後で最も適した位置の選手が2本目を取る。',
        '全員がレセプション — 4ゾーン、各約2.25m。',
        '他の3人の誰かにランダムに配球。',
        '導入トレーニング用に留める（U11-U13、学校）。',
      ],
    },
  ],
};

type LiberoNote = {
  title: string;
  text: string;
  accent: 'orange' | 'teal' | 'plum';
};

const LIBERO_BY_SIZE: Record<TeamSize, LiberoNote> = {
  6: {
    title: 'リベロ — 6v6レセプションの要',
    text: '対照色のユニフォームを着る守備の専門家。ミドルがバックローにローテーションする際に自動的に交代する（無制限の交代、FIVB規則19により交代回数にカウントされない）。連続3ローテーション（Z5-Z6-Z1）でプレーする。優先レセプション位置：Z6（サーバーの主なターゲット）またはZ5。FIVBの制限：ブロック不可、ネット上でのアタック不可、3mラインの前でオーバーハンドトスをすると味方がネット上で攻撃できない。',
    accent: 'orange',
  },
  5: {
    title: '5v5に公式のリベロはいない',
    text: 'インドア5v5にはFIVBの規定がない。実際には、どの連盟もこの形式でリベロを認めていない。最良のレシーバーをP6またはP5に置き、常にバックローでプレーさせる — 対照色のユニフォームや制限を伴わない「事実上のリベロ」となる。必要に応じてブロックやアタックも可能。',
    accent: 'teal',
  },
  4: {
    title: '4v4にリベロはいない',
    text: '4v4の規則（大学のインターミューラル、FFVbの教育的プレー、ビーチ4s）ではリベロが認められない。ダイヤモンドの唯一の後列選手 — または3-1ラインの飛び出すセッター — が最良のレシーバー／ディフェンダーの役割を担う。ダイヤモンドでは1人あたり約3mのレーンとなり、技術より予測が重要となる。',
    accent: 'plum',
  },
};

const READING_TABLE: [string, string][] = [
  ['アンダーハンド', '通常の姿勢、ボールを高めにとらえる'],
  ['スタンディング・フローター', '高めの姿勢、変化する前に前へ出てとらえる'],
  ['トップスピン', '低い姿勢、下がる準備、面を傾ける'],
  ['ジャンプフローター', 'ネットから4mの位置ならオーバーハンドでプレー可能'],
  ['ジャンプトップスピン', '低い姿勢、予測的に下がり、面は硬く受動的に'],
  ['ハイブリッドサーブ', 'フローターとトップスピン両方に対応できる面を準備'],
];

const READING_CUES = [
  'サーバーのライン上の位置 → 好みの角度',
  'トスの高さと位置：高く後ろ → トップスピン；低く前 → フローター',
  '助走の長さ：長い → ジャンプトップスピン；短い → ジャンプフローター',
  'インパクト時のサーバーの肩の向き → ボールの方向',
];

const ERRORS_COMMON: [string, string][] = [
  ['腕を振る', '原因の第1位 — インパクトで腕を振るとボールが不安定になる。修正：「面は受動的、脚は能動的」。'],
  ['面が崩れている', '片方の前腕がもう片方より高い — 肘をロックし親指を下に押す。'],
  ['腕を早く組みすぎる', '動きを遅らせ、遅い段階でのアンダー／オーバーの選択を妨げる。到着する瞬間にだけ手を組む。'],
  ['上体が立ちすぎ', '面がボールの下を通る → ボールがネットから遠ざかる。30〜45度前に傾ける。'],
  ['へそより高い位置でインパクト', '高すぎる＝コントロール低下。腰の高さまたはそれより低い位置を狙う。'],
  ['フリーズしない', 'インパクトで動いていると＝方向のコントロールが不可能。完全に止まる。'],
];

const ERRORS_BY_SIZE: Record<TeamSize, [string, string][]> = {
  6: [
    ['リベロのポジショニング不良', '中央寄りすぎるとコーナーへの短いサーブを取り逃す、横寄りすぎると中央が空く。基準ターゲット：相手サーバーと一直線上のZ6。'],
    ['セッターのオーバーラップ', 'セッターが相手のサーブ接触前に位置を離れる — 5-1の反則第1位（FIVB規則7.4）。インパクトまで足の前後関係を守らなければならない。'],
    ['役割が不明確な5人レセプション', 'Wでは前列の3人が中央ゾーンで干渉する。中央へのサーブでP3とP6のどちらが取るかを明示的に決めておくこと。'],
  ],
  5: [
    ['セッターが早すぎる離脱', '2F-3B配置で飛び出すセッターの場合、ボールが守られる前に離れる＝P1に穴。確認を待つ。'],
    ['レシーバー2人が横並び', '3F-2B配置では、P5とP1は離して配置する（左右に1人ずつ）。中央で重なる＝サイドラインが空く。'],
    ['アタックを忘れる前列レシーバー', '3F-2B配置では、レセプションした前列の選手はその後アタックの助走に入らなければならない — 専用に練習すべき反射。'],
    ['事実上のリベロが定まっていない', '明確な役割がないと、後列の3人が責任を譲り合う。最良のレシーバーを中央ゾーンの優先者として明示的に指名する。'],
  ],
  4: [
    ['ダイヤモンドでセッターがレセプションする', 'ダイヤモンドではP3のセッターはレセプションから外れなければならない — そうでないと素早い配球は不可能。他の3人で受ける。'],
    ['負担過多の唯一の後列選手', 'ダイヤモンドでは、後列のP1が深いコート約3.5mを1人でカバーする。予測＝最重要スキル；常にサイドステップで早い読みを行う。'],
    ['2本目のコールがないボックス2-2', '専任セッターがいない場合、誰がトスする？レセプションが起きた瞬間に2本目を「マイン！」と叫ぶことは必須。'],
    ['ダイヤモンドのウィングが一直線', 'P4とP2がミッドコートでP1と同じレベルにある → 短いカットショットが間に落ちる。位置をずらす。'],
  ],
};

const VIDEOS = [
  { title: 'アンダーハンドパスの仕方 (Sikana)', url: 'https://www.youtube.com/watch?v=aZkZwAFeye0' },
  { title: 'フォアアームパス (CEPSUM)', url: 'https://www.youtube.com/watch?v=qIPlthgJvHU' },
  { title: 'セッターへの正確なアンダーハンドパス', url: 'https://www.youtube.com/watch?v=eUDY6AGS1-A' },
  { title: '高低のレセプションを習得する (Sikana)', url: 'https://www.youtube.com/watch?v=ZLRy_Gu9LVA' },
  { title: '個人用フォアアームパス・ウォームアップ', url: 'https://www.youtube.com/watch?v=nGiE_y09vTY' },
];

export default function GuideReceptionJa() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSize = parseInt(searchParams.get('size') ?? '6') as TeamSize;
  const [teamSize, setTeamSize] = useState<TeamSize>([4, 5, 6].includes(initialSize) ? initialSize : 6);

  useEffect(() => {
    setSearchParams({ size: String(teamSize) }, { replace: true });
  }, [teamSize, setSearchParams]);

  const systems = SYSTEMS_BY_SIZE[teamSize];
  const passeurRoles = PASSEUR_BY_SIZE[teamSize];
  const liberoNote = LIBERO_BY_SIZE[teamSize];
  const errorsSize = ERRORS_BY_SIZE[teamSize];

  const btnBase: React.CSSProperties = {
    padding: '6px 16px',
    fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.1em',
    border: '2.5px solid var(--ink)',
    background: 'var(--cream)', color: 'var(--ink)',
    cursor: 'pointer',
  };
  const btnActive: React.CSSProperties = { ...btnBase, background: 'var(--orange)', color: '#fff', boxShadow: 'var(--shadow-sm)' };

  const accentColor = (a: LiberoNote['accent']) =>
    a === 'orange' ? 'var(--orange)' : a === 'teal' ? 'var(--teal)' : 'var(--plum)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

      <GoldenRule>
        フォアアームパスはチームの攻撃成功の60%を決定づける。良いレセプションなしには速い攻撃は成立しない。面は受動的に、脚は能動的に。
      </GoldenRule>

      <section style={{ ...S.card, border: '2.5px solid var(--orange)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={S.label}>試合形式</div>
        <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.8, margin: 0 }}>
          以下の<strong>レセプションシステム</strong>、<strong>セッターの役割</strong>、<strong>よくあるミス</strong>は選択した形式に応じて変わる。
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {([6, 5, 4] as const).map(size => (
            <button key={size} onClick={() => setTeamSize(size)} style={teamSize === size ? btnActive : btnBase}>
              {size}v{size}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 style={S.section}>構えの姿勢</h2>
        <div style={S.card}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              '足は肩幅よりやや広く、片足をわずかに前に',
              '膝は足の内側へ曲げ、腰を低く、上体を30〜45度前傾',
              '背筋を伸ばし、体重は母指球に（かかとは少し浮かす程度で、上げきらない）',
              '腕は離しておく（組まない）、90〜145度に曲げ、腰の高さに',
              'トスの瞬間からサーバーを目で追う',
            ].map((pt, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14 }}>
                <span style={S.bullet}>▸</span>
                <span style={{ color: 'var(--ink)', opacity: 0.85 }}>{pt}</span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 12, borderLeft: '4px solid var(--orange)', paddingLeft: 12, fontSize: 13 }}>
            <strong style={{ color: 'var(--orange)' }}>主なミス： </strong>
            <span style={{ color: 'var(--ink)', opacity: 0.7 }}>ボールが届く前に腕をすでに組んで面にしてしまうこと — 動きが遅くなり、遅い段階でのアンダー／オーバーの選択ができなくなる。</span>
          </div>
        </div>
      </section>

      <section>
        <h2 style={S.section}>面（プラットフォーム）</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {PLATFORM_TIPS.map(([title, text], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 14 }}>
              <span style={S.bullet}>▸</span>
              <span>
                <strong style={{ color: 'var(--ink)', fontFamily: '"DM Sans", sans-serif' }}>{title}: </strong>
                <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{text}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={S.section}>実行 — 主要ステップ</h2>
        <div style={{ ...S.card, background: 'var(--cream)', border: '2.5px solid var(--orange)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {STEPS.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={S.stepBadge}>{i + 1}</span>
              <p style={{ fontSize: 14, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>{step}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, borderLeft: '4px solid var(--orange)', paddingLeft: 16, paddingTop: 4, fontSize: 14, color: 'var(--ink)', opacity: 0.7 }}>
          <strong style={{ color: 'var(--ink)', opacity: 1 }}>フリーズ： </strong>
          「写真のポーズを取る」 — インパクト後1〜2秒間、完全に静止する。時速50〜90kmでは、動いているディフェンダーは面の角度を修正できない。止まっていれば、どの方向にも動ける。
        </div>
      </section>

      <section>
        <h2 style={S.section}>移動</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {DISPLACEMENTS.map((d, i) => (
            <div key={i} style={S.card}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 6 }}>{d.name}</div>
              <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: 0, lineHeight: 1.6 }}>{d.desc}</p>
            </div>
          ))}
          <div style={S.card}>
            <div style={S.label}>片手レシーブ — 緊急時</div>
            <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: 0, lineHeight: 1.6 }}>
              両腕で届かないほど遠いボールに対する最終手段。腕を伸ばし、前腕の内側を面にし、スイングせずに突き出してボールを上に弾く。バリエーション：片手スタブ（強いスパイクに対し拳で）、片手スクープ（低いボールに対し手のひらを上に向ける）。
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 style={S.section}>レセプションシステム — {teamSize}v{teamSize}</h2>
        {teamSize !== 6 && (
          <div style={{ ...S.alert, background: 'var(--cream)', borderColor: 'var(--orange)', marginBottom: 14 }}>
            <div style={S.label}>⚠ FIVB非公式形式</div>
            <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0, lineHeight: 1.6 }}>
              {teamSize === 5
                ? 'インドア5v5にはFIVBやFFVbの専用規定がない。以下のシステムはVolleyballXL、The Art of Coaching Volleyball、Volleyball Canadaが文書化した6v6の5-1の論理的な適応である。'
                : 'インドア4v4にはFIVBの公式規定がない。以下のフォーメーションは大学のインターミューラル（USA）、FFVb／Volleyball Canadaの教育マニュアル、ビーチの文献（Brandon Joyner、Better at Beach）から得られている。'}
            </p>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
          {systems.map((s, i) => (
            <div key={i} style={{ ...S.card, borderColor: s.recommended ? 'var(--orange)' : 'var(--ink)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 2 }}>{s.name}</div>
                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: s.recommended ? 'var(--orange)' : 'var(--ink)', opacity: s.recommended ? 1 : 0.5 }}>{s.level}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: 0 }}>{s.desc}</p>
              <div>
                <div style={S.labelTeal}>長所</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {s.pros.map((p, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                      <span style={S.bullet}>▸</span>
                      <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div style={{ ...S.label, color: 'var(--ink)', opacity: 0.5 }}>短所</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {s.cons.map((c, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                      <span style={{ color: 'var(--ink)', opacity: 0.35, marginTop: 2 }}>▸</span>
                      <span style={{ color: 'var(--ink)', opacity: 0.55 }}>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={S.section}>レセプションにおけるセッターの役割 — {teamSize}v{teamSize}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {passeurRoles.map((role, i) => (
            <div key={i} style={S.card}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 8 }}>{role.title}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
                {role.bullets.map((b, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                    <span style={S.bulletOrange}>▸</span>
                    <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{b}</span>
                  </li>
                ))}
              </ul>
              {role.note && (
                <div style={{ marginTop: 10, borderLeft: '4px solid var(--teal)', paddingLeft: 12, fontSize: 12, color: 'var(--ink)', opacity: 0.7 }}>
                  <strong style={{ color: 'var(--teal)' }}>備考： </strong>{role.note}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={S.section}>リベロ — レセプションの専門家</h2>
        <div style={{ ...S.card, borderLeft: `5px solid ${accentColor(liberoNote.accent)}` }}>
          <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: accentColor(liberoNote.accent), marginBottom: 8 }}>
            {liberoNote.title}
          </div>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.8, margin: 0, lineHeight: 1.65 }}>
            {liberoNote.text}
          </p>
        </div>
      </section>

      <section>
        <h2 style={S.section}>サーブを読んでポジションに入る</h2>
        <div style={{ border: '2.5px solid var(--ink)', overflow: 'hidden', marginBottom: 12 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--ink)' }}>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>サーブの種類</th>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>レシーバーの対応</th>
              </tr>
            </thead>
            <tbody>
              {READING_TABLE.map(([type, adapt], i) => (
                <tr key={i} style={{ borderBottom: i < READING_TABLE.length - 1 ? '1px solid var(--paper)' : 'none', background: i % 2 === 0 ? 'var(--cream)' : 'var(--paper)' }}>
                  <td style={{ padding: '10px 14px', color: 'var(--orange)', fontFamily: '"Bungee", sans-serif', fontSize: 11 }}>{type}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--ink)', opacity: 0.75 }}>{adapt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginBottom: 8 }}>
          <div style={S.labelTeal}>サーバーの接触前の手がかり</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {READING_CUES.map((cue, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                <span style={S.bullet}>▸</span>
                <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{cue}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <h2 style={S.section}>よくあるミス</h2>
        <div style={{ borderLeft: '5px solid var(--orange)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
          <div style={{ ...S.label, color: 'var(--orange)' }}>技術的なミス（全形式共通）</div>
          {ERRORS_COMMON.map(([label, text], i) => (
            <div key={i} style={{ fontSize: 13 }}>
              <strong style={{ color: 'var(--ink)' }}>{label}: </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{text}</span>
            </div>
          ))}
        </div>
        <div style={{ borderLeft: '5px solid var(--teal)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ ...S.labelTeal }}>{teamSize}v{teamSize}特有のミス</div>
          {errorsSize.map(([label, text], i) => (
            <div key={i} style={{ fontSize: 13 }}>
              <strong style={{ color: 'var(--ink)' }}>{label}: </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{text}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={S.section}>動画リソース</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {VIDEOS.map((v, i) => (
            <VideoLink key={i} title={v.title} url={v.url} />
          ))}
        </div>
      </section>

    </div>
  );
}
