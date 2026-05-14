import { useState } from 'react';
import GoldenRule from './GoldenRule';
import VideoLink from './VideoLink';
import { S } from './styles';

const LEVEL_COLOR: Record<string, string> = {
  'Başlangıç': 'var(--mint)',
  'Başlangıç → Orta': 'var(--mint)',
  'Orta': 'var(--yellow)',
  'Orta+': 'var(--orange)',
  'İleri': 'var(--orange)',
};

const PHASES = [
  ['Başlangıç', 'Pası okumak ve yaklaşmaya karar vermek'],
  ['Hazırlık', 'Yaklaşmanın başlangıcı'],
  ['Kurulum', 'Dirsek omzun üstünde, el kulağın arkasında — güç pozisyonu'],
  ['Hızlanma', 'Sıralı rotasyon: kalça → gövde → omuz → dirsek → bilek'],
  ['Temas + takip', 'Bilek savurması, el topun üstünden "pençeler" → topspin'],
];

const APPROACH_3 = [
  ['Adım 1 (sol)', 'Kısa yönlendirici adım, hücuma yönelik'],
  ['Adım 2 (sağ)', 'Güç adımı — uzun ve alçak, topuk önce, ağırlık merkezini alçaltır'],
  ['Adım 3 (sol)', 'Kapanış adımı — kısa, yatay ötelemeyi frenler ve dikeye dönüştürür'],
];

const APPROACH_4 = [
  ['Adım 1 (sağ)', 'Gözlem adımı, yavaş ritim'],
  ['Adım 2 (sol)', 'Hızlanma'],
  ['Adım 3 (sağ)', 'Güç adımı — en önemlisi, uzun ve alçak'],
  ['Adım 4 (sol)', 'Fileye paralel kapanış adımı'],
];

const TIMING_TABLE: [string, string][] = [
  ['Yüksek top (3. tempo)', 'GEÇ başla — top pasörün ellerinden ayrıldığında'],
  ['2. tempo (Hut/Go)', 'Pas pasöre doğru gelirken başla'],
  ['1. tempo (Quick)', 'ERKEN başla — pasör topa dokunduğunda zaten havada'],
  ['Slide', 'Pasör pası aldığı anda başla'],
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
    name: '4. bölge hücumu (Smaçör / OH)',
    position: 'Sol kanat',
    description: `Hücumu öğrenmenin temeli. Smaçör en yüksek top hacmini alır — pasörün "güvenlik" seçeneğidir. Soldan 45° açıyla yaklaşma.`,
    keyPoints: [
      'Fileye ~45° açıyla 4 adımlık yaklaşma',
      'Fileden 30-50 cm uzakta zıplama',
      '"Hut" pası (yüksek 3. tempo) veya "Go" (hızlı 2. tempo)',
      'DİKEY zıpla — fileye doğru değil',
      'Vuruş omzunun hafif önünde temas',
    ],
    shots: ['Çapraz', 'Çizgi vuruşu', 'Kesik vuruş (sert açı <3 m)', 'Plase', 'Roll shot (yumuşak topspin)'],
  },
  {
    id: 'middle',
    name: 'Orta hücum (Quick / 1. tempo)',
    position: 'Ön orta',
    description: 'En hızlı hücum. Orta blokçu, pasör topa dokunmadan ÖNCE veya dokunurken havadadır. Çok alçak (30-50 cm) ve çok kısa pas.',
    keyPoints: [
      "Yaklaşmayı ERKEN tetikle — pasörün bırakışında zaten havada",
      '2-3 adımlık yaklaşma, kol kalkışta zaten yüklenmiş',
      `"Ghost Middle" konsepti: top gelmese bile rakip blokunu tutmak için quick\'i tam hızda koş → smaçörleri serbest bırakır`,
      'Filenin 30-50 cm üstünde temas',
      'Hızlı geçiş: blok → yaklaşma 1-2 saniyede',
    ],
    shots: ['Pasörün önünde quick ("1")', 'Pasörün arkasında back-1', 'Slide (file boyunca arka başlangıç)', '31/Gap (pasör ile anten arasında offset)'],
  },
  {
    id: 'opposite',
    name: '2. bölge hücumu (Pasör çaprazı)',
    position: 'Sağ kanat',
    description: 'Pasör çaprazı 2. bölgeden hücum eder. Sol elliler için ideal (vuruş omzu sağ anten tarafında = maksimum açıklık). Sağ elliler için: daha belirgin gövde rotasyonu, antenden daha uzak pozisyon.',
    keyPoints: [
      'Smaçöre simetrik yaklaşma ama sağdan',
      'Kesik vuruş için başparmak aşağı bitirin',
      "Karşılama kötü olduğunda pasör için \"release\" seçeneği",
      'Arka hatta iken P1\'den arka hat hücumu (D bölgesi)',
    ],
    shots: ['Çapraz', 'Çizgi vuruşu', 'Arka hattan pipe/D', '5. bölgeye çapraz kesik vuruş'],
  },
  {
    id: 'backrow',
    name: 'Arka hat hücumu (Pipe)',
    position: 'Arka orta veya arka sağ',
    description: 'Arka bölgeden hücum. Zıplama 3 m çizgisinin ARKASINDA gerçekleşmek ZORUNDA. 3 blokçuya karşı 4 smaçör sağlar.',
    keyPoints: [
      '3 m çizgisinin arkasından kalkış zorunlu (aksi halde hata)',
      'Yasal zıplama sonrası ön bölgeye iniş = TAMAM',
      'Pipe: P6\'dan, quick\'in arkasından geri pas (BIC = quick\'in hemen üstünde)',
      'D bölgesi: P1\'den, genellikle pasör çaprazı için yedek hücum',
    ],
    shots: ['Pipe (arka orta)', 'D bölgesi (arka sağ)', 'A bölgesi (arka sol, nadir)', 'Kötü pasta plase'],
  },
];

const SPECIAL_SHOTS = [
  {
    name: 'Plase',
    level: 'Başlangıç → Orta',
    desc: 'Smaca AYNI yaklaşma (gizleme çok önemli), sonra temasta kolu yavaşlatın ve topu parmakların hafif bir hareketiyle yerleştirin. Yön: zıplamadan ÖNCE tespit edilen boş bölge.',
  },
  {
    name: 'Roll shot / Yumuşak topspin',
    level: 'Orta',
    desc: 'Bloğun arkasında kısa düşen bir top için azaltılmış hızda (~%50-70) güçlü topspin ile vuruş. Plaseden okuması daha zor çünkü daha hızlı.',
  },
  {
    name: 'Kesik vuruş / Sert açı',
    level: 'Orta+',
    desc: '1. bölgeye (4\'ten) veya 5. bölgeye (2\'den) sert açı. Başparmak aşağı bitirin, el topun üzerinden yana keser. Topun yan tarafına vurun, üstüne değil.',
  },
  {
    name: 'Tooling / Wipe',
    level: 'Orta+',
    desc: "Topu kasıtlı olarak blokçuların ellerine sürtüp dışarı itin. Fileye yakın bir pasta dikey zıplayın ve blokçunun dış elini bir \"ray\" olarak kullanarak topu yana itin.",
  },
];

const ERRORS = [
  ['Yaklaşma zamanlaması', 'Çok erken: güçsüz tekrar zıplama. Çok geç: temas anında kol geride uzanmış.'],
  ['Yanlış ayak sırası', 'Her zaman sol-sağ ile bitirin (sağ elli) — her iki ayak neredeyse eş zamanlı.'],
  ['Topspin yok', 'Düz el = savurma yok = top uzun uçar. Topun üstüne "pençeleyin".'],
  ['File hatası', 'Yakın pasta öne zıplamak. DİKEY zıpla, öne değil.'],
  ['Arka hat hatası', 'Kalkışta ayak 3 m çizgisinde veya önünde.'],
  ['Tek ayak inişi', 'Slide hariç: dizi korumak için iki ayak üzerine inin (ACL riski).'],
];

const VIDEOS = [
  { title: 'Nasıl hücum edilir — 3 adım (Sikana)', url: 'https://www.youtube.com/watch?v=3aQgfk0VtEA' },
  { title: 'Voleybolda smaç (CEPSUM)', url: 'https://www.youtube.com/watch?v=Gn1Otje3beg' },
  { title: 'Ayrıntılı hücum yaklaşması', url: 'https://www.youtube.com/watch?v=ub4XoCJMUzU' },
  { title: "Seb'in Sıralaması — smaç hakkında her şey", url: 'https://www.youtube.com/watch?v=JvxZgViw_os' },
  { title: 'Hücum için zıplama (Sikana)', url: 'https://www.youtube.com/watch?v=6GOHF5cNIKs' },
  { title: 'Plase hücumlar (Sikana)', url: 'https://www.youtube.com/watch?v=sCiu8Mqm1d0' },
];

export default function GuideAttaqueTr() {
  const [activeAttack, setActiveAttack] = useState('outside');
  const current = ATTACK_TYPES.find(t => t.id === activeAttack)!;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

      {/* Règle d'or */}
      <GoldenRule mantra="YAVAŞ YAKLAŞMA → HIZLI → GÜÇ ADIMI → KAPANIŞ → DİKEY ZIPLAMA → KOL ÖNE UZATILMIŞ → BİLEK SAVURMASI">
        Güç sadece koldan değil, tüm kinetik zincirden gelir. Son iki adımı hızlı olan ritmik bir yaklaşma, son gücün %70'ini üretir.
      </GoldenRule>

      {/* Biomécanique */}
      <section>
        <h2 style={S.section}>Smacın 5 fazı</h2>
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
          <strong style={{ color: 'var(--ink)' }}>İdeal temas: </strong>
          <span style={{ color: 'var(--ink)', opacity: 0.7 }}>Vuruş omzunun hafif önünde, asla başın arkasında değil (güç kaybı + sakatlık riski). Kalkışta fileye mesafe: minimum 30-50 cm.</span>
        </div>
      </section>

      {/* Approach */}
      <section>
        <h2 style={S.section}>Yaklaşma</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          <div style={S.card}>
            <div style={S.label}>3 adım — Başlangıç</div>
            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, color: 'var(--ink)', opacity: 0.5, marginBottom: 10 }}>Sol-sağ-sol (sağ elli)</div>
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
            <div style={S.label}>4 adım — Yarışma standardı</div>
            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, color: 'var(--ink)', opacity: 0.5, marginBottom: 10 }}>Sağ-sol-sağ-sol (sağ elli)</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {APPROACH_4.map(([label, text], i) => (
                <li key={i} style={{ fontSize: 13 }}>
                  <strong style={{ color: 'var(--ink)' }}>{label}: </strong>
                  <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{text}</span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 10, borderLeft: '3px solid var(--orange)', paddingLeft: 10, fontSize: 12, color: 'var(--orange)', fontFamily: '"DM Mono", monospace' }}>
              Altın kural: son iki adım en hızlısıdır — yavaş → hızlı.
            </div>
          </div>
        </div>
      </section>

      {/* Timing */}
      <section>
        <h2 style={S.section}>Pas tipine göre zamanlama</h2>
        <div style={{ border: '2.5px solid var(--ink)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--ink)' }}>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Pas tipi</th>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Yaklaşmaya ne zaman başlamalı</th>
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
        <h2 style={S.section}>Pozisyona göre hücum tipleri</h2>
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
              <div style={S.labelTeal}>Anahtar noktalar</div>
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
              <div style={S.label}>Vuruş seçimi</div>
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
        <h2 style={S.section}>Özel vuruşlar</h2>
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
        <h2 style={S.section}>Yaygın hatalar</h2>
        <div style={{ borderLeft: '5px solid var(--orange)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ ...S.label, color: 'var(--orange)' }}>Kaçınılması gerekenler</div>
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
        <h2 style={S.section}>Video kaynakları</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {VIDEOS.map((v, i) => (
            <VideoLink key={i} title={v.title} url={v.url} />
          ))}
        </div>
      </section>

    </div>
  );
}
