import GoldenRule from './GoldenRule';
import VideoLink from './VideoLink';
import { S } from './styles';

const TIMING_STEPS = [
  {
    title: 'ボールではなくアタッカーを見る',
    desc: 'アタッカーの肩と腕を見て、スパイクの瞬間と方向を予測する。',
  },
  {
    title: 'アタッカーの後にジャンプする',
    desc: 'アタッカーが踏み切りに入るまで待つ。同時または先にジャンプすると、早く下りすぎてしまう。',
  },
  {
    title: '理想的な遅れ：0.2〜0.3秒',
    desc: 'アタッカーがジャンプしたら心の中で「イチ」と数え、その直後にジャンプする。この一瞬の差が決定的に重要となる。',
  },
  {
    title: 'ネットの上に侵入する',
    desc: 'ジャンプの最高点で、手と腕を前方かつ下方に押し出す — 上方だけではない。',
  },
];

const CONTRE_TYPES = [
  {
    name: '攻撃的ブロック',
    objectif: 'ボールを直接相手コートに返す',
    points: [
      ['ポジション', '手を広く開き、指を伸ばして開く'],
      ['動作', 'できる限りネットの上に侵入し、腕を前に伸ばす'],
      ['ターゲット', '手首を固めてボールを相手の床に叩き落とす'],
      ['使う場面', '良い位置に入り、アタックを読めたとき'],
    ],
  },
  {
    name: 'カバーブロック',
    objectif: 'ボールを減速させて味方のディフェンスが拾えるようにする',
    points: [
      ['ポジション', '手を近づけ、手のひらを自分の側に傾ける'],
      ['動作', '押し返すのではなく衝撃を吸収する'],
      ['結果', 'ボールが自コートに柔らかく落ちてプレー可能になる'],
      ['使う場面', '遅れたとき、ポジショニングが悪いとき'],
    ],
  },
  {
    name: 'ゾーンブロック',
    objectif: '特定のアタックゾーンを消す',
    points: [
      ['ポジション', '特定のゾーン（ラインまたはクロス）を塞ぐ'],
      ['動作', '守りたいゾーンに向けて手を傾ける'],
      ['戦術', '味方のディフェンダーが準備しているゾーンへアタッカーを誘導する'],
      ['使う場面', 'バックローディフェンスとの取り決めの上で'],
    ],
  },
  {
    name: '2枚または3枚ブロック（集団ブロック）',
    objectif: '突破不可能な壁を作る',
    points: [
      ['コーディネーション', '同じ瞬間に一緒にジャンプする'],
      ['配置', 'サイドのブロッカーはミドルブロッカーに対して位置を取る'],
      ['手', 'チームメイトの手と合わせる（隙間を作らない）'],
      ['コミュニケーション', '1人のブロッカーが「ライン」または「クロス」とコールして連携を取る'],
    ],
  },
];

const TIMING_TIPS = [
  ['「イチ・ニ」ドリル', '練習でアタッカーがジャンプしたら「イチ」、自分がジャンプしたら「ニ」と言う。必要な遅れが生まれる。'],
  ['肩を見る', 'アタッカーの肩の向きがスパイクの方向を示す。'],
  ['トスを読む', '高いトス＝時間がある。ネット際のトス＝素早い反応。'],
  ['早めにポジションに入る', 'ぎりぎりに走るより、構えて待つ方がよい。'],
  ['垂直跳びを鍛える', '高く跳べるほどタイミングのミスの余地が大きくなる。'],
];

const SAUT_POSITION = [
  '足は肩幅に開く',
  '体重は母指球に',
  '膝は軽く曲げる',
  '腕は体の横またはわずかに前',
  'ネットから約30〜50cmの位置',
];

const SAUT_IMPULSION = [
  ['サイドステップ', '移動が必要な場合は素早いサイドステップを使う'],
  ['屈伸', '脚を素早く曲げる（下げすぎない）'],
  ['腕の振り上げ', '腕を爆発的に上へ振り上げる'],
  ['完全伸展', '脚を完全に伸ばして最大高さを得る'],
];

const SAUT_EN_LAIR = [
  '腕を伸ばして締めた状態を保つ',
  '手を広く開き、指を伸ばして開く',
  'ネットの上に侵入する（ネットに触れない！）',
  '体幹を引き締めて安定させる',
];

const ERREURS = [
  ['早すぎるジャンプ', 'アタッカーがスパイクする時に自分は下りている — もっと待つこと！'],
  ['ボールを見る', 'アタッカーの情報を失う — 選手を見ること！'],
  ['手が柔らかい', 'ボールが自コートに跳ね返る — 指を硬く締めること！'],
  ['前にジャンプする', 'ネットに触れる — 垂直にジャンプすること！'],
  ['腕を早く下ろす', '着地まで腕を上げ続ける。'],
];

const EXERCICES = [
  {
    title: 'パートナーとのタイミング練習',
    desc: 'パートナーがボールなしでアタックを真似る。ジャンプのタイミングだけを練習する。20回繰り返す。',
  },
  {
    title: '固定アタックに対するブロック',
    desc: 'アタッカーが固定位置からスパイクする。タイミングと技術に集中する。徐々にスピードを上げる。',
  },
  {
    title: '肩の読み取り',
    desc: 'アタッカーがスパイクを変える（ライン／クロス）。肩を読んで方向を予測する。',
  },
  {
    title: 'フットワーク＋ブロック',
    desc: '素早い横移動からブロックへの動きを練習する。試合状況を再現する。',
  },
];

const CONSEILS_PRO = [
  ['忍耐', 'ブロックは最も難しい技術の一つ。自分自身に忍耐強く接する。'],
  ['反復', '筋肉記憶は何百回もの反復によって作られる。'],
  ['動画', '自分を撮影してタイミングと技術を分析する。'],
  ['プロを見る', 'プロ選手がどのようにゲームを読み、ジャンプのタイミングを取るかを観察する。'],
  ['シンプルから始める', '速いアタックに進む前に、遅いアタックに対するブロックを習得する。'],
];

export default function GuideContreJa() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

      {/* Règle d'or */}
      <GoldenRule mantra="ボール → セッター → ボール → アタッカーの肩 → ジャンプ → ネット上への侵入">
        定期的な練習とタイミングへの特別な注意により、ブロックは大きく向上する。タイミングの合った平均的な垂直跳びのブロックは、タイミングの悪い高いジャンプより優れる。
      </GoldenRule>

      {/* Fondamentaux */}
      <section>
        <h2 style={S.section}>ブロックの基本</h2>
        <div style={S.card}>
          <p style={{ fontSize: 14, color: 'var(--ink)', opacity: 0.85, margin: 0, lineHeight: 1.6 }}>
            ブロックは攻撃的な武器にもなり得る重要な守備動作である。
            鍵は<strong style={{ color: 'var(--orange)' }}>完璧なタイミング</strong>とゲームの良い読みにある。
          </p>
        </div>
      </section>

      {/* Timing */}
      <section>
        <h2 style={S.section}>タイミング：成功の鍵</h2>
        <div style={{ ...S.card, border: '2.5px solid var(--orange)', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {TIMING_STEPS.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <span style={S.stepBadge}>{i + 1}</span>
              <div>
                <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)', margin: '0 0 4px 0' }}>{step.title}</p>
                <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: 0 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Types de contres */}
      <section>
        <h2 style={S.section}>ブロックの種類</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {CONTRE_TYPES.map((type, i) => (
            <div key={i} style={S.card}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 4 }}>{i + 1}. {type.name}</div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', marginBottom: 10 }}>
                <span style={{ color: 'var(--ink)', opacity: 0.5, textTransform: 'uppercase' }}>目的: </span>
                <span style={{ color: 'var(--teal)' }}>{type.objectif}</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {type.points.map(([label, text], j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                    <span style={S.bullet}>▸</span>
                    <span>
                      <strong style={{ color: 'var(--ink)' }}>{label}: </strong>
                      <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Astuces timing */}
      <section>
        <h2 style={S.section}>タイミング向上のヒント</h2>
        <div style={{ borderLeft: '5px solid var(--orange)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {TIMING_TIPS.map(([label, text], i) => (
            <div key={i} style={{ fontSize: 13 }}>
              <strong style={{ color: 'var(--ink)' }}>{label}: </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Séquence visuelle élite */}
      <section>
        <h2 style={S.section}>エリートの視線の流れ</h2>
        <div style={{ ...S.card, border: '2.5px solid var(--orange)', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.8, margin: 0 }}>最高のブロッカーはボールを見ない — 正確な視線の流れに従う：</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
            {['ボール', 'セッター', 'ボール', 'アタッカーの肩'].map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ background: 'var(--orange)', color: '#fff', fontFamily: '"Bungee", sans-serif', fontSize: 10, padding: '4px 10px', letterSpacing: '0.08em' }}>{step}</span>
                {i < 3 && <span style={{ color: 'var(--orange)', fontWeight: 700 }}>→</span>}
              </div>
            ))}
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              ['1. ボール', 'ボールがセッターへ向かう様子を見る'],
              ['2. セッター', 'インパクトの瞬間のセッターの手を読む — トスの方向'],
              ['3. ボール', '方向を確認するために短くボールを追う'],
              ['4. アタッカーの肩', 'アタッカーの肩に視線を固定する — インパクト前にスパイクの方向が分かる'],
            ].map(([label, text], i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                <span style={S.bulletOrange}>▸</span>
                <span>
                  <strong style={{ color: 'var(--ink)' }}>{label}: </strong>
                  <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Timing précis par type d'attaque */}
      <section>
        <h2 style={S.section}>アタックの種類別の正確なタイミング</h2>
        <div style={{ border: '2.5px solid var(--ink)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--ink)' }}>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>アタックの種類</th>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>ブロッカーのジャンプタイミング</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['クイック／1st tempo（ミドル）', 'アタッカーと同時または直前（コミットブロック）'],
                ['シュート／2nd tempoアウトサイド', 'アタッカーから約0.1秒遅れて'],
                ['高いボール、アウトサイド（3rd tempo）', 'アタッカーから0.2〜0.3秒遅れて'],
                ['ネット際の近いトス', 'アタッカーと同時に'],
                ['ネットから離れたトス', '約0.5秒遅れて、またはジャンプしない'],
                ['スライド（ミドル）', '同時または直後 — 横方向に追う'],
              ].map(([type, timing], i, arr) => (
                <tr key={i} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--paper)' : 'none', background: i % 2 === 0 ? 'var(--cream)' : 'var(--paper)' }}>
                  <td style={{ padding: '10px 14px', color: 'var(--orange)', fontFamily: '"Bungee", sans-serif', fontSize: 11 }}>{type}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--ink)', opacity: 0.75 }}>{timing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Read vs Commit blocking */}
      <section>
        <h2 style={S.section}>リードブロッキング vs コミットブロッキング</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          <div style={{ ...S.card, border: '2.5px solid var(--orange)' }}>
            <div style={S.label}>リードブロッキング — 推奨</div>
            <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.8, margin: '0 0 10px 0', lineHeight: 1.6 }}>ブロッカーはセッターの判断を待ち、ボールとアタッカーを読んでから動く。「バンチリード」ポジション（全員がミドルに近く、その後ピンに向かって爆発的に動く）。</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['ほとんどのトスに対し安定して対応できる', '腰と膝を守る', 'すべてのアマチュアレベルに適する'].map((pt, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                  <span style={S.bullet}>▸</span>
                  <span style={{ color: 'var(--ink)', opacity: 0.85 }}>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={S.card}>
            <div style={{ ...S.labelTeal, color: 'var(--ink)', opacity: 0.6 }}>コミットブロッキング — 上級／プロ</div>
            <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: '0 0 10px 0', lineHeight: 1.6 }}>ミドルブロッカーはセッターがボールをリリースする前に、クイックと一緒にジャンプすることを決断する。相手の速い攻撃を封じるが、セッターが別の場所にトスすると、ミドルは完全にプレーから外れる。</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['支配的なミドルブロッカーに対して有効', 'セッターが対応するとリスクが高い', '優れた読みを持つ選手に限定'].map((pt, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                  <span style={{ color: 'var(--ink)', opacity: 0.35, marginTop: 2 }}>▸</span>
                  <span style={{ color: 'var(--ink)', opacity: 0.55 }}>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Technique de saut */}
      <section>
        <h2 style={S.section}>ブロックのジャンプ技術</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {([
            { title: '構えの姿勢', items: SAUT_POSITION.map(p => ({ text: p })) },
            { title: '踏み切り', items: SAUT_IMPULSION.map(([l, t]) => ({ label: l, text: t })) },
            { title: '空中', items: SAUT_EN_LAIR.map(p => ({ text: p })) },
          ] as Array<{ title: string; items: Array<{ label?: string; text: string }> }>).map((col, ci) => (
            <div key={ci} style={S.card}>
              <div style={S.label}>{col.title}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {col.items.map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                    <span style={S.bullet}>▸</span>
                    <span style={{ color: 'var(--ink)', opacity: 0.85 }}>
                      {'label' in item && item.label ? <><strong>{item.label}: </strong></> : null}
                      <span style={{ opacity: 0.8 }}>{item.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Erreurs fréquentes */}
      <section>
        <h2 style={S.section}>避けるべきよくあるミス</h2>
        <div style={{ borderLeft: '5px solid var(--orange)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ ...S.label, color: 'var(--orange)' }}>よくあるミス</div>
          {ERREURS.map(([label, text], i) => (
            <div key={i} style={{ fontSize: 13 }}>
              <strong style={{ color: 'var(--ink)' }}>{label}: </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Exercices */}
      <section>
        <h2 style={S.section}>練習ドリル</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {EXERCICES.map((ex, i) => (
            <div key={i} style={{ ...S.card, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <span style={{ fontFamily: '"Bungee", sans-serif', fontSize: 14, color: 'var(--orange)', flexShrink: 0, width: 24, textAlign: 'right' }}>{i + 1}.</span>
              <div>
                <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 4 }}>{ex.title}</div>
                <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: 0 }}>{ex.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Conseils de pro */}
      <section>
        <h2 style={S.section}>プロのアドバイス</h2>
        <div style={{ borderLeft: '5px solid var(--teal)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {CONSEILS_PRO.map(([label, text], i) => (
            <div key={i} style={{ fontSize: 13 }}>
              <strong style={{ color: 'var(--ink)' }}>{label}: </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Vidéos */}
      <section>
        <h2 style={S.section}>動画リソース</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { title: 'ブロックを学ぶ (Sikana)', url: 'https://www.youtube.com/watch?v=hJKueZn-tNQ' },
            { title: 'バレーボールのブロック (CEPSUM)', url: 'https://www.youtube.com/watch?v=_MchJmDMn0E' },
            { title: 'ドリル：ブロックのためのジャンプ', url: 'https://www.youtube.com/watch?v=GDS8PoWxO6Q' },
            { title: 'ドリル：アタックをブロックする', url: 'https://www.youtube.com/watch?v=S6TcodMWFz4' },
          ].map((v, i) => (
            <VideoLink key={i} title={v.title} url={v.url} />
          ))}
        </div>
      </section>

    </div>
  );
}
