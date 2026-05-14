import { useState } from 'react';
import GoldenRule from './GoldenRule';
import VideoLink from './VideoLink';
import { S } from './styles';

const LEVEL_COLOR: Record<string, string> = {
  'Beginner': 'var(--mint)',
  'Beginner → Intermediate': 'var(--mint)',
  'Intermediate': 'var(--yellow)',
  'Intermediate+': 'var(--orange)',
  'Advanced': 'var(--orange)',
};

const PHASES = [
  ['イニシエーション', 'トスを読み、助走を決定する'],
  ['ワインドアップ', '助走の開始'],
  ['コッキング', '肘を肩より高く、手を耳の後ろに — パワーポジション'],
  ['加速', '順序立てた回旋：腰 → 体幹 → 肩 → 肘 → 手首'],
  ['インパクト＋フォロースルー', '手首のスナップ、手がボールの上を「掻き出す」 → トップスピン'],
];

const APPROACH_3 = [
  ['第1歩（左）', '短い方向付けのステップ、アタックの方向に体を向ける'],
  ['第2歩（右）', 'パワーステップ — 長く低く、かかとから入って重心を下げる'],
  ['第3歩（左）', '締めのステップ — 短く、水平方向の動きを止めて垂直方向に変換'],
];

const APPROACH_4 = [
  ['第1歩（右）', '観察のステップ、ゆっくりとしたリズム'],
  ['第2歩（左）', '加速'],
  ['第3歩（右）', 'パワーステップ — 最も重要、長く低く'],
  ['第4歩（左）', 'ネットに平行な締めのステップ'],
];

const TIMING_TABLE: [string, string][] = [
  ['高いボール（3rd tempo）', '遅めにスタート — ボールがセッターの手から離れた瞬間'],
  ['2nd tempo（Hut/Go）', 'パスがセッターに向かう途中でスタート'],
  ['1st tempo（クイック）', '早めにスタート — セッターがボールに触れる時点ですでに空中に'],
  ['スライド', 'セッターがパスを受けた瞬間にスタート'],
];

type AttackType = {
  id: string;
  name: string;
  position: string;
  description: string;
  keyPoints: string[];
  shots: string[];
};

const ATTACK_TYPES: AttackType[] = [
  {
    id: 'outside',
    name: 'ゾーン4のアタック（アウトサイド／OH）',
    position: '左ウィング',
    description: 'アタックを学ぶ基礎。アウトサイドヒッターは最も多くのボールを受ける — セッターの「安全な」選択肢。左から45度の角度で助走する。',
    keyPoints: [
      'ネットに対して約45度で4歩の助走',
      'ネットから30〜50cmの位置で踏み切る',
      '「Hut」セット（高い3rd tempo）または「Go」（速い2nd tempo）',
      '垂直にジャンプ — ネットに向かわない',
      '打つ肩のわずかに前でインパクト',
    ],
    shots: ['クロスコート', 'ライン', 'カットショット（3m未満の鋭角）', 'フェイント', 'ロールショット（トップスピンのオフスピード）'],
  },
  {
    id: 'middle',
    name: 'ミドルアタック（クイック／1st tempo）',
    position: 'フロントミドル',
    description: '最も速いアタック。ミドルブロッカーはセッターがボールに触れる前または同時にすでに空中にいる。非常に低く（30〜50cm）短いトス。',
    keyPoints: [
      '早めに助走を始動 — セッターがリリースする時点ですでに空中に',
      '2〜3歩の助走、上昇中に腕はすでにセットされている',
      '「ゴーストミドル」コンセプト：ボールが来なくてもクイックを全速力で走り、相手のブロックを引きつける → アウトサイドヒッターを解放する',
      'ネットの30〜50cm上でインパクト',
      '素早い転換：ブロック → 助走を1〜2秒で',
    ],
    shots: ['セッターの前のクイック（「1」）', 'セッターの後ろのバック1', 'スライド（ネット沿いの後ろ向きスタート）', '31/Gap（セッターとアンテナの間のずれた位置）'],
  },
  {
    id: 'opposite',
    name: 'ゾーン2のアタック（オポジット）',
    position: '右ウィング',
    description: 'オポジットはゾーン2から攻撃する。左利きに最適（打つ肩が右アンテナ側＝最大のウィンドウ）。右利きの場合：体幹の回旋をより大きく、アンテナから少し離れた位置に。',
    keyPoints: [
      '助走はアウトサイドヒッターと対称で右から',
      'カットショットでは親指を下に向けて打ち終わる',
      'レセプションが悪いときのセッターの「リリース」オプション',
      'バックローのときはP1（ゾーンD）からのバックロー攻撃',
    ],
    shots: ['クロスコート', 'ライン', 'バックローからのパイプ／D', 'ゾーン5への対角線カットショット'],
  },
  {
    id: 'backrow',
    name: 'バックロー・アタック（パイプ）',
    position: 'バックミドルまたはバック右',
    description: 'バックゾーンからの攻撃。踏み切りは必ず3mラインの後ろで行わなければならない。3人のブロッカーに対して4人のアタッカーを成立させる。',
    keyPoints: [
      '踏み切りは3mラインの後ろで必須（さもなくば反則）',
      '合法的なジャンプの後でフロントゾーンへの着地はOK',
      'パイプ：P6から、クイックの上にバックトス（BIC＝クイックのすぐ上）',
      'ゾーンD：P1から、オポジットの予備の攻撃としてよく使われる'],
    shots: ['パイプ（バックミドル）', 'ゾーンD（バック右）', 'ゾーンA（バック左、稀）', 'トスが悪い時のフェイント'],
  },
];

const SPECIAL_SHOTS = [
  {
    name: 'フェイント',
    level: 'Beginner → Intermediate',
    desc: 'スパイクと同じ助走（偽装が重要）、インパクトで腕を緩め、指先でボールを置く。方向：ジャンプ前に見つけた空きゾーン。',
  },
  {
    name: 'ロールショット／トップスピン・オフスピード',
    level: 'Intermediate',
    desc: '減速したスピード（約50〜70%）で強いトップスピンをかけ、ブロックの後ろに短く落とすボール。フェイントより速いため読みにくい。',
  },
  {
    name: 'カットショット／鋭角',
    level: 'Intermediate+',
    desc: 'ゾーン1（4から）またはゾーン5（2から）への鋭角。親指を下にして打ち終わり、手をボールの横に切るように動かす。ボールの上ではなく横をとらえる。',
  },
  {
    name: 'ツーリング／ワイプ',
    level: 'Intermediate+',
    desc: 'ブロッカーの手に意図的に当ててボールを外へ押し出す。ネット際に近いトスでは垂直にジャンプし、ブロッカーの外側の手を「レール」のように使って横にボールを押し出す。',
  },
];

const ERRORS = [
  ['助走のタイミング', '早すぎ：パワーなしの再ジャンプ。遅すぎ：インパクトで腕が後ろに伸び切る。'],
  ['足の順序の間違い', '常に左-右で終える（右利きの場合） — 両足はほぼ同時に。'],
  ['トップスピンがない', '手が平ら＝スナップなし＝ボールが流れる。ボールの上を「掻き出す」。'],
  ['ネットの反則', 'ネット際のトスで前へ飛んでしまう。垂直にジャンプ、前へ飛ばない。'],
  ['バックローの反則', '踏み切り時に足が3mラインの上または前にある。'],
  ['片足着地', 'スライドを除いて、両足で着地し膝を守る（ACL損傷リスク）。'],
];

const VIDEOS = [
  { title: 'アタックの仕方 — 3ステップ (Sikana)', url: 'https://www.youtube.com/watch?v=3aQgfk0VtEA' },
  { title: 'バレーボールのスパイク (CEPSUM)', url: 'https://www.youtube.com/watch?v=Gn1Otje3beg' },
  { title: 'アタックの助走を詳しく', url: 'https://www.youtube.com/watch?v=ub4XoCJMUzU' },
  { title: 'Sebのシーケンス — スパイクのすべて', url: 'https://www.youtube.com/watch?v=JvxZgViw_os' },
  { title: 'アタックのためにジャンプする (Sikana)', url: 'https://www.youtube.com/watch?v=6GOHF5cNIKs' },
  { title: 'プレースアタック (Sikana)', url: 'https://www.youtube.com/watch?v=sCiu8Mqm1d0' },
];

export default function GuideAttaqueJa() {
  const [activeAttack, setActiveAttack] = useState('outside');
  const current = ATTACK_TYPES.find(t => t.id === activeAttack)!;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

      {/* Règle d'or */}
      <GoldenRule mantra="ゆっくり助走 → 速く → パワーステップ → 締め → 垂直ジャンプ → 腕を前に伸ばす → 手首のスナップ">
        パワーは腕だけでなく、全身の運動連鎖から生まれる。最後の2歩を速くするリズミカルな助走が、最終的なパワーの70%を生む。
      </GoldenRule>

      {/* Biomécanique */}
      <section>
        <h2 style={S.section}>スパイクの5つのフェーズ</h2>
        <div style={{ ...S.card, border: '2.5px solid var(--orange)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {PHASES.map(([phase, desc], i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={S.stepBadge}>{i + 1}</span>
              <div>
                <strong style={{ fontSize: 14, color: 'var(--ink)' }}>{phase}: </strong>
                <span style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75 }}>{desc}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, borderLeft: '4px solid var(--orange)', paddingLeft: 16, paddingTop: 4, fontSize: 14 }}>
          <strong style={{ color: 'var(--ink)' }}>理想的なインパクト： </strong>
          <span style={{ color: 'var(--ink)', opacity: 0.7 }}>打つ肩のわずかに前、決して頭の後ろではない（パワー低下＋怪我のリスク）。踏み切り時のネットからの距離：最低30〜50cm。</span>
        </div>
      </section>

      {/* Approach */}
      <section>
        <h2 style={S.section}>助走</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          <div style={S.card}>
            <div style={S.label}>3歩 — 初級</div>
            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, color: 'var(--ink)', opacity: 0.5, marginBottom: 10 }}>左-右-左（右利き）</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {APPROACH_3.map(([label, text], i) => (
                <li key={i} style={{ fontSize: 13 }}>
                  <strong style={{ color: 'var(--ink)' }}>{label}: </strong>
                  <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ ...S.card, border: '2.5px solid var(--orange)' }}>
            <div style={S.label}>4歩 — 競技の標準</div>
            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, color: 'var(--ink)', opacity: 0.5, marginBottom: 10 }}>右-左-右-左（右利き）</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {APPROACH_4.map(([label, text], i) => (
                <li key={i} style={{ fontSize: 13 }}>
                  <strong style={{ color: 'var(--ink)' }}>{label}: </strong>
                  <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{text}</span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 10, borderLeft: '3px solid var(--orange)', paddingLeft: 10, fontSize: 12, color: 'var(--orange)', fontFamily: '"DM Mono", monospace' }}>
              黄金ルール：最後の2歩が最速 — ゆっくり → 速く。
            </div>
          </div>
        </div>
      </section>

      {/* Timing */}
      <section>
        <h2 style={S.section}>トスの種類別タイミング</h2>
        <div style={{ border: '2.5px solid var(--ink)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--ink)' }}>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>トスの種類</th>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>助走開始のタイミング</th>
              </tr>
            </thead>
            <tbody>
              {TIMING_TABLE.map(([type, timing], i) => (
                <tr key={i} style={{ borderBottom: i < TIMING_TABLE.length - 1 ? '1px solid var(--paper)' : 'none', background: i % 2 === 0 ? 'var(--cream)' : 'var(--paper)' }}>
                  <td style={{ padding: '10px 14px', color: 'var(--orange)', fontFamily: '"Bungee", sans-serif', fontSize: 11 }}>{type}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--ink)', opacity: 0.75 }}>{timing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Attack types */}
      <section>
        <h2 style={S.section}>ポジション別のアタックの種類</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {ATTACK_TYPES.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveAttack(t.id)}
              style={{
                padding: '6px 14px',
                fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.1em',
                border: '2.5px solid var(--ink)',
                background: activeAttack === t.id ? 'var(--orange)' : 'var(--cream)',
                color: activeAttack === t.id ? '#fff' : 'var(--ink)',
                cursor: 'pointer',
                boxShadow: activeAttack === t.id ? 'var(--shadow-sm)' : 'none',
              }}
            >
              {t.position}
            </button>
          ))}
        </div>
        <div style={S.card}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 14, color: 'var(--ink)', marginBottom: 4 }}>{current.name}</div>
            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: 'var(--ink)', opacity: 0.5, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{current.position}</div>
          </div>
          <p style={{ fontSize: 14, color: 'var(--ink)', opacity: 0.8, lineHeight: 1.6, marginBottom: 16 }}>{current.description}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <div>
              <div style={S.labelTeal}>要点</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {current.keyPoints.map((pt, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                    <span style={S.bullet}>▸</span>
                    <span style={{ color: 'var(--ink)', opacity: 0.85 }}>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div style={S.label}>ショットの選択</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {current.shots.map((s, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                    <span style={S.bulletOrange}>▸</span>
                    <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Special shots */}
      <section>
        <h2 style={S.section}>特殊ショット</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SPECIAL_SHOTS.map((s, i) => (
            <div key={i} style={S.card}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
                <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)' }}>{s.name}</div>
                <span style={{
                  fontFamily: '"DM Mono", monospace', fontSize: 10, padding: '2px 10px',
                  border: '1.5px solid var(--ink)',
                  background: LEVEL_COLOR[s.level] || 'var(--paper)',
                  color: 'var(--ink)', flexShrink: 0,
                }}>{s.level}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Errors */}
      <section>
        <h2 style={S.section}>よくあるミス</h2>
        <div style={{ borderLeft: '5px solid var(--orange)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ ...S.label, color: 'var(--orange)' }}>避けるべき点</div>
          {ERRORS.map(([label, text], i) => (
            <div key={i} style={{ fontSize: 13 }}>
              <strong style={{ color: 'var(--ink)' }}>{label}: </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Videos */}
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
