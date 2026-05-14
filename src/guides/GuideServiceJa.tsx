import { useState } from 'react';
import GoldenRule from './GoldenRule';
import VideoLink from './VideoLink';

const LEVEL_COLOR: Record<string, string> = {
  'Beginner': 'var(--mint)',
  'Intermediate': 'var(--yellow)',
  'Advanced': 'var(--orange)',
  'Competition': 'var(--plum)',
};

const LEVEL_TEXT: Record<string, string> = {
  'Competition': '#fff',
};

type ServiceType = {
  id: string;
  name: string;
  level: string;
  tagline: string;
  description: string;
  biomechanics: string[];
  steps: string[];
  errors: [string, string][];
  exercises: string[];
  videos: { title: string; url: string }[];
};

const SERVICE_TYPES: ServiceType[] = [
  {
    id: 'cuillere',
    name: 'アンダーハンドサーブ',
    level: 'Beginner',
    tagline: 'アンダーハンド — 腰の下を振り子のように振り抜く',
    description: '腕を振り子のように動かし、腰の下でボールをとらえるサーブ。すべてのレベルで合法であり、初心者や肩を痛めている選手に推奨される。成人の地域レベル以上ではほとんど見られない。',
    biomechanics: [
      '短い運動連鎖：腰 → 肩 → 腕 → 手',
      '体幹の回旋を伴わない振り子運動',
      '体重移動：後ろ足 → 前足',
      'インパクト：ボールの中心より下を手の付け根または握った拳でとらえる',
    ],
    steps: [
      '左足を前に出し、後ろ足に体重を乗せる',
      '左手でボールを腰の高さ、打つ腕の延長線上に持つ',
      '右腕を後ろに引き、手のひらを開くか拳を握る',
      'インパクト直前にボールを離す — 上に放り投げない',
      '腕を前に振り、ボールの中心より下をとらえる',
      '腕は目標方向にフォロースルーし、体重は前足に移動する',
    ],
    errors: [
      ['ボールが低すぎる、または打つ腕からずれている', 'ボールは腰の高さ、打つ腕の延長線上にキープする'],
      ['指先で打っている', '手の付け根を使う — 接触面が広く安定する'],
      ['トスが高すぎる', 'ボールは上に放り投げず、ただ離すだけにする'],
      ['手首が緩い', 'インパクトの瞬間に腕を固定し、クリーンに当てる'],
    ],
    exercises: [
      'ボウリング・フープ：ネットから4mのゾーンを狙う',
      '4mから10本サーブ → 1セットごとに1m下がってエンドラインまで',
      '床に4×3mのターゲットを置く — 目標は50%の命中率',
    ],
    videos: [
      { title: 'アンダーハンドサーブ + テニスサーブ (Sikana)', url: 'https://www.youtube.com/watch?v=xl6twpn3Qs8' },
      { title: 'アンダーハンドサーブの打ち方', url: 'https://www.youtube.com/watch?v=MWna318SrKo' },
    ],
  },
  {
    id: 'float',
    name: 'スタンディング・フローターサーブ',
    level: 'Intermediate',
    tagline: 'スタンディング・フローター — アマチュアの90%が使う標準サーブ',
    description: '回転をかけずに不規則な軌道（ナックルボール効果）を生み出すサーブ。臨界速度（およそ12〜13 m/s）で非対称の渦が発生し、ランダムな横方向の揚力が生じる。最初にマスターすべきサーブである。',
    biomechanics: [
      '完全な運動連鎖：脚 → 腰 → 体幹 → 肩 → 肘 → 手',
      '「弓矢」の姿勢：肘を肩より高く、手は耳の後ろ',
      '手首を固定し、しっかりと締める — フローター効果に不可欠',
      'インパクト：手の付け根でボールの中心をとらえる',
      '「パンチ・アンド・フリーズ」：フォロースルーは短く、インパクト直後に手を止める',
    ],
    steps: [
      '体をネットに対して45度、足は肩幅に開く',
      '左腕を肩の前に伸ばし、ボールを頭の高さに構える',
      'ごく短いトス：ボールを肩の30〜50cm上に「置く」 — 回転をかけない',
      'ボールを置いた直後、左足を目標方向に踏み出す',
      'インパクトで腕を完全に伸ばし、手はしっかりと平らに',
      'フリーズ：インパクト直後に動きを止める — 腕のフォロースルーはしない',
    ],
    errors: [
      ['フォロースルーで腕を伸ばしてしまう', '失敗原因の第1位：フォロースルーが回転を生みフローター効果を消す — 即座に止める'],
      ['トスが高すぎる', 'ボールがネットに落ちる — トスは30〜50cmと短く'],
      ['回転のかかったトス', 'ボールに回転がかかってしまう — 投げるのではなく置く'],
      ['手のひら全体で当てている', '手の付け根（手のひらの下部）を使って平らな面で当てる'],
    ],
    exercises: [
      'トス&ドロップ：床に印を付けて打たずに20回トス — 目標は20回中18回印の上',
      '3mの壁打ち「パンチ・アンド・フリーズ」：動きを即座に止める練習',
      'パートナーに確認してもらいながら、回転のないサーブを連続5本',
    ],
    videos: [
      { title: '4分で分かるフローターサーブ', url: 'https://www.youtube.com/watch?v=0z2_R2cMU7g' },
      { title: 'フローターサーブを上達させる', url: 'https://www.youtube.com/watch?v=mdEXHKNjfQ8' },
      { title: 'サーブ：フローター + テニス (CEPSUM)', url: 'https://www.youtube.com/watch?v=_e00ogqoNZw' },
    ],
  },
  {
    id: 'jumpfloat',
    name: 'ジャンプフローターサーブ',
    level: 'Advanced',
    tagline: 'jump float — 女子トッププレーヤーの標準',
    description: '短い助走とジャンプを伴うフローター。打点の高さ、スピード、より急な落下角度を得られる。女子のトップレベルでは標準となっており（近年の研究では女子プロの全サーブの86%）、ジャンプトップスピンより低リスクでありながらスタンディング・フローターより相手を崩しやすい。',
    biomechanics: [
      '短い助走（2〜4歩）',
      'ジャンプ中、腕は弓矢の姿勢を保つ — 腕を振り上げて推進力を得るスパイクとは異なる',
      'ボールのスピードは助走から得られるもので、腕だけでは生まれない',
      'インパクトは最高点、頭よりやや前方',
      '手首の固定とフリーズはスタンディング・フローターと同じ',
    ],
    steps: [
      'エンドラインの2〜3m後ろに立ち、左手にボールを持つ',
      '第1歩（右）はリズム取り、腕はリラックス',
      '第2歩（左）：ボールを約1.5mの高さに、回転なくトスする',
      '第3歩＋ホップ：エンドラインの後ろで両足踏み切り — 腕を弓矢の姿勢へ上げる',
      '体を引き締め、わずかに前方への垂直ジャンプ',
      '腕を伸ばし、手の付け根でボールの中心をとらえる',
      '即座にフリーズ — 着地はコート内',
    ],
    errors: [
      ['トスが高すぎる', 'jump spinの癖が出る — スタンディング・フローターと同様にトスは短く'],
      ['アタックのように腕を振っている', 'スピン付きのスパイクになってしまう — 弓矢の姿勢を維持する'],
      ['フォロースルーが伸びている', 'スタンディング・フローターと同じ：フリーズは必須'],
      ['踏み切りでフットフォルト', 'エンドラインの後ろで踏み切ることを徹底する'],
    ],
    exercises: [
      '助走を加える前に、しっかりフリーズできるスタンディング・フローターを習得する',
      '助走のみで打たない練習：低く安定したトスを身につける',
      'コントロールしたスピードでジャンプフローター：威力より一貫性を優先',
    ],
    videos: [
      { title: 'ジャンプフローターサーブ — INF\'AUX ENTRAÎNEURS (Bretagne)', url: 'https://www.youtube.com/watch?v=P5xCgV7nfO8' },
      { title: 'ジャンプフローター + スパイク (Volleyball Canada)', url: 'https://www.youtube.com/watch?v=X1Mq9K90FCk' },
    ],
  },
  {
    id: 'jumpspin',
    name: 'ジャンプトップスピンサーブ',
    level: 'Competition',
    tagline: 'jump serve — エンドラインの後ろからのスパイク',
    description: '「エンドラインの後ろから打つスパイク」：強いトップスピンをかけてフルパワーで打つボール（強豪クラブで時速80〜100km）。エース獲得のポテンシャルは最高だが、ミス率も最大。練習で1000本以上反復した選手のみが使うべきサーブである。',
    biomechanics: [
      'バックアタックと同じ3〜4歩の助走',
      '高いトス（前方1〜1.5m）、わずかに前回転をかける',
      '順序立てた回旋：腰 → 体幹 → 肩 → 肘 → 手首',
      'インパクトポイントはボールの10〜11時の位置',
      '手首のスナップでトップスピンをかける（エリートレベルでは毎秒約30回転）',
      '完全なフォロースルー — フローターとは正反対',
    ],
    steps: [
      'エンドラインの3〜4m後ろに立ち、打つ手にボールを持つ',
      '第1歩（右）＋わずかに前回転をかけた高いトス',
      '第2歩（左）：加速',
      '第3歩（右）：長いパワーステップ、重心を下げる',
      '第4歩（左）：踏み切り、腕を上方に振り上げる',
      '爆発的に上方かつ前方へジャンプ',
      '最高点でインパクト：手はボールの上を通る（10時の位置）、手のひらから指へと巻き込むように',
      '完全な手首のスナップ＋フォロースルー — 着地はコート内1〜2m',
    ],
    errors: [
      ['トスが低すぎる、または後ろすぎる', 'ネットに引っ掛ける原因の第1位 — トスは高く前に'],
      ['トスが前方すぎる', 'フットフォルト — サービスゾーンの範囲を守る'],
      ['手首のスナップが足りない', 'ボールが下向きの回転を持たず、長く飛んでしまう'],
      ['準備なしに試合で使う', '黄金ルール：まず練習で1000本反復してから'],
    ],
    exercises: [
      '黄金ルール：試合で使う前に練習で1000本反復',
      'ジャンプスピンの「コントロール」：トスを低く、スピードを落として正確なゾーンを狙う',
      'トスを撮影する：ミスの80%はトスの位置に起因する',
    ],
    videos: [
      { title: 'パワフルなジャンプトップスピン + フローターサーブ (Sikana)', url: 'https://www.youtube.com/watch?v=50TUVvPLKr8' },
    ],
  },
];

const ZONES_TABLE: [string, string][] = [
  ['ゾーン1 — バック右', '5-1システムでセッターの飛び出しを封じる'],
  ['ゾーン2 — フロント右の短いボール', '右サイドのスタートを崩し、リベロを排除する'],
  ['ゾーン3 — フロント中央の短いボール', 'ミドルを封じ、クイック攻撃を崩す'],
  ['ゾーン4 — フロント左の短いボール', 'メインアタッカーにレシーブとアタックの両方を強いる'],
  ['ゾーン5 — バック左の深いゾーン', '長い対角線、ミス率は高い'],
  ['ゾーン6 — バック中央の深いゾーン', '背の低いセッターに対して長いサーブを打つ'],
];

const S: Record<string, React.CSSProperties> = {
  sectionTitle: {
    fontFamily: '"Bungee", sans-serif', fontSize: 18, letterSpacing: '0.03em',
    margin: '0 0 18px 0', paddingBottom: 10, borderBottom: '3px solid var(--ink)',
  },
  label: { fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.14em', marginBottom: 10 },
  labelTeal: { fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.14em', color: 'var(--teal)', marginBottom: 10 },
  labelOrange: { fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.14em', color: 'var(--orange)', marginBottom: 10 },
  card: { border: '3px solid var(--ink)', background: 'var(--cream)', boxShadow: 'var(--shadow)', padding: 20 },
  alert: { border: '3px solid var(--ink)', background: 'var(--yellow)', boxShadow: 'var(--shadow-sm)', padding: '14px 20px' },
};

export default function GuideServiceJa() {
  const [activeId, setActiveId] = useState('cuillere');
  const current = SERVICE_TYPES.find(t => t.id === activeId)!;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>

      {/* Golden rule */}
      <GoldenRule>
        サーブのミスの80%はトスに起因する。パワーを追い求める前に、まずトスを安定させること。
      </GoldenRule>

      {/* Service type selector */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <h2 style={S.sectionTitle}>サーブの種類</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {SERVICE_TYPES.map(t => {
            const on = activeId === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveId(t.id)}
                style={{
                  padding: '7px 16px',
                  fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.06em',
                  border: '2.5px solid var(--ink)',
                  background: on ? LEVEL_COLOR[t.level] : 'var(--cream)',
                  color: on && LEVEL_TEXT[t.level] ? LEVEL_TEXT[t.level] : 'var(--ink)',
                  cursor: 'pointer',
                  boxShadow: on ? 'var(--shadow-sm)' : 'none',
                  transform: on ? 'translate(-1px,-1px)' : 'none',
                  transition: 'all 0.08s',
                }}
              >
                {t.name}
              </button>
            );
          })}
        </div>

        <span style={{
          padding: '3px 12px',
          border: '2.5px solid var(--ink)',
          background: LEVEL_COLOR[current.level],
          fontFamily: '"Bungee", sans-serif', fontSize: 9, letterSpacing: '0.1em',
          display: 'inline-block',
          color: LEVEL_TEXT[current.level] || 'var(--ink)',
        }}>{current.level.toUpperCase()}</span>

        <div style={S.card}>
          <h3 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 16, margin: '0 0 4px 0' }}>{current.name}</h3>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, letterSpacing: '0.08em', opacity: 0.6, marginBottom: 14 }}>{current.tagline}</div>
          <p style={{ margin: '0 0 18px 0', fontSize: 14, lineHeight: 1.6, opacity: 0.8 }}>{current.description}</p>

          <div style={{ marginBottom: 18 }}>
            <div style={S.labelTeal}>主な生体力学</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {current.biomechanics.map((b, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13.5 }}>
                  <span style={{ fontFamily: '"Bungee", sans-serif', color: 'var(--teal)', flexShrink: 0 }}>▸</span>{b}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginBottom: 18 }}>
            <div style={{ ...S.label, opacity: 0.7 }}>実行ステップ（右利きの場合）</div>
            <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {current.steps.map((s, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13.5 }}>
                  <span style={{
                    background: 'var(--orange)', color: 'var(--ink)',
                    fontFamily: '"Bungee", sans-serif', fontSize: 11,
                    width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            <div>
              <div style={S.labelOrange}>✗ よくある間違い</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {current.errors.map(([label, fix], i) => (
                  <li key={i} style={{ fontSize: 13 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{ fontFamily: '"Bungee", sans-serif', color: 'var(--orange)', flexShrink: 0 }}>✗</span>
                      <strong>{label}</strong>
                    </div>
                    <div style={{ paddingLeft: 20, marginTop: 3, fontSize: 12, opacity: 0.65 }}>{fix}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div style={S.labelTeal}>★ 練習ドリル</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
                {current.exercises.map((e, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13.5 }}>
                    <span style={{ fontFamily: '"Bungee", sans-serif', color: 'var(--teal)', flexShrink: 0 }}>▸</span>{e}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {current.videos.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ ...S.label, opacity: 0.6 }}>動画 — {current.name}</div>
            {current.videos.map((v, i) => (
              <VideoLink key={i} title={v.title} url={v.url} />
            ))}
          </div>
        )}
      </section>

      {/* Zones */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 style={S.sectionTitle}>狙うべきゾーンと戦術</h2>
        <div style={{ border: '3px solid var(--ink)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--ink)', color: 'var(--cream)' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.12em' }}>相手のゾーン</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.12em' }}>戦術的効果</th>
              </tr>
            </thead>
            <tbody>
              {ZONES_TABLE.map(([zone, effect], i) => (
                <tr key={i} style={{ borderBottom: i < ZONES_TABLE.length - 1 ? '2px solid var(--ink)' : 'none' }}>
                  <td style={{ padding: '12px 16px', fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--orange)' }}>{zone}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13.5, opacity: 0.8 }}>{effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            ['シーム（つなぎ目）', '選手を狙うより、2人のレシーバーの間を狙うほうが効果的 — 相手のコミュニケーションが試される。'],
            ['短いボールと長いボールの使い分け', 'セッターがいつ下がるべきか判断できなくなる。アタックラインの後ろに落ちる短いフローター（ゾーン2-3-4）は特に有効。'],
            ['FBSO％指標', 'エースを取らなくても、相手のFirst Ball Side Outを70%から45%に下げるサーブは非常に効果的である。'],
          ].map(([title, text], i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13.5 }}>
              <span style={{ fontFamily: '"Bungee", sans-serif', color: 'var(--teal)', flexShrink: 0 }}>▸</span>
              <span><strong>{title}: </strong><span style={{ opacity: 0.8 }}>{text}</span></span>
            </div>
          ))}
        </div>
      </section>

      {/* Hierarchy */}
      <section>
        <div style={{ border: '3px solid var(--ink)', background: 'var(--cream)', boxShadow: 'var(--shadow)', padding: 20 }}>
          <div style={{ ...S.label, marginBottom: 16 }}>★ 習得の順序</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: 14 }}>
            {SERVICE_TYPES.map(t => {
              const textColor = LEVEL_TEXT[t.level] || 'var(--ink)';
              return (
                <div key={t.id} style={{
                  border: '2.5px solid var(--ink)',
                  background: LEVEL_COLOR[t.level],
                  padding: '10px 12px',
                  textAlign: 'center',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 11, color: textColor, marginBottom: 4 }}>{t.name}</div>
                  <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: textColor, opacity: 0.7 }}>{t.level}</div>
                </div>
              );
            })}
          </div>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5 }}>
            次のレベルへ進む前に、各レベルを習得すること。<strong>パワーより一貫性。</strong>
          </p>
        </div>
      </section>

    </div>
  );
}
