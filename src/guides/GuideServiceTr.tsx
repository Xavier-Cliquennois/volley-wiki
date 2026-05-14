import { useState } from 'react';
import GoldenRule from './GoldenRule';
import VideoLink from './VideoLink';

const LEVEL_COLOR: Record<string, string> = {
  'Başlangıç': 'var(--mint)',
  'Orta': 'var(--yellow)',
  'İleri': 'var(--orange)',
  'Yarışma': 'var(--plum)',
};

const LEVEL_TEXT: Record<string, string> = {
  'Yarışma': '#fff',
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
    name: 'Alttan servis',
    level: 'Başlangıç',
    tagline: 'alttan — bel altından sarkaç salınımı',
    description: "Topa bel altında vurmak için sarkaç şeklinde kol hareketi. Her seviyede kuraldır, başlangıç seviyesi için veya omuz sakatlığı durumunda önerilir. Yetişkin bölgesel seviyenin üzerinde neredeyse hiç kullanılmaz.",
    biomechanics: [
      'Kısa kinetik zincir: kalça → omuz → kol → el',
      'Gövde rotasyonu olmadan sarkaç hareketi',
      'Ağırlık aktarımı: arka ayak → ön ayak',
      'Temas: topun ortasının altına el ayası veya kapalı yumruk',
    ],
    steps: [
      'Sol ayak önde, ağırlık arka bacakta',
      "Sol el topu vuruş kolunun hizasında, kalça yüksekliğinde tutar",
      'Sağ kol geride hazır, avuç açık veya yumruk kapalı',
      'Topa vurmadan hemen önce bırakın — yukarı atmayın',
      "Öne doğru sallayın, topun ortasının altına vurun",
      'Kol hedefe doğru uzanır, ağırlık ön ayağa aktarılır',
    ],
    errors: [
      ['Top çok düşük veya merkez dışında tutuluyor', "Topu vuruş kolunun hizasında, kalça yüksekliğinde tutun"],
      ['Parmaklarla vurmak', 'El ayasını kullanın — daha geniş ve daha stabil bir yüzey'],
      ['Çok yüksek atmak', 'Topu sadece bırakın, yukarı atmayın'],
      ['Gevşek bilek', 'Temiz bir vuruş için temas anında kolu kilitleyin'],
    ],
    exercises: [
      'Çember bowling: fileden 4 m uzaklıktaki bölgeleri hedefleyin',
      "4 m mesafeden 10 servis, sonra her seri sonunda 1 m geri çekilin",
      'Yere 4x3 m hedefler — %50 isabet hedefi',
    ],
    videos: [
      { title: 'Alttan servis + tenis servisi (Sikana)', url: 'https://www.youtube.com/watch?v=xl6twpn3Qs8' },
      { title: 'Alttan servis nasıl atılır', url: 'https://www.youtube.com/watch?v=MWna318SrKo' },
    ],
  },
  {
    id: 'float',
    name: 'Ayakta float servis',
    level: 'Orta',
    tagline: "ayakta float — amatörlerin %90'ının varsayılan servisi",
    description: `Rotasyonsuz, öngörülemez yörüngeli servis ("knuckleball" etkisi). Kritik bir hızda (~12-13 m/s), asimetrik girdaplar rastgele yanal kaldırma kuvvetleri yaratır. İlk olarak ustalaşılması gereken servis budur.`,
    biomechanics: [
      'Tam kinetik zincir: bacaklar → kalça → gövde → omuz → dirsek → el',
      `"Yay ve ok" pozisyonu: dirsek omuzun üzerinde yüksekte, el kulağın arkasında`,
      "Bilek KİLİTLİ ve sağlam — float etkisi için mutlak gereklilik",
      'Temas: el ayası topun ortasında',
      `"Yumrukla ve dondur": KISA takip — el temastan hemen sonra durur`,
    ],
    steps: [
      "Vücut fileye 45° açıyla, ayaklar omuz genişliğinde",
      "Sol kol omuzun önünde uzatılmış, top baş hizasında",
      `Çok kısa atış: topu omzun 30-50 cm üstüne "yerleştirin" — top dönmemeli`,
      'Top yerleştirildikten hemen sonra sol ayak hedefe doğru adım atar',
      'Temas anında kol tam uzanmış, el sağlam ve düz',
      'DONDUR: temas sonrası hareketi anında durdurun — kol takibi yok',
    ],
    errors: [
      ['Uzun kol takibi', "Başarısızlık sebebi #1: takip rotasyon ekler ve float'ı bozar — hemen dondurun"],
      ['Çok yüksek atış', 'Top file dibine düşer — kısa atın, sadece 30-50 cm'],
      ['Dönüşlü atış', 'Topa rotasyon kazandırır — topu yerleştirin, atmayın'],
      ['Sadece avuçla temas', 'Düz bir yüzey için el ayasını (avucun alt kısmı) kullanın'],
    ],
    exercises: [
      'Toss & Drop: yerde bir nokta işaretleyin, vurmadan 20 kez atın — hedef 18/20 nokta üzerinde',
      `3 m mesafede duvarda "yumrukla ve dondur": hareketin anlık durmasını çalışın`,
      'Bir partner tarafından görsel olarak doğrulanmış 5 rotasyonsuz servis',
    ],
    videos: [
      { title: '4 dakikada float servis', url: 'https://www.youtube.com/watch?v=0z2_R2cMU7g' },
      { title: 'Float servisinizi geliştirme', url: 'https://www.youtube.com/watch?v=mdEXHKNjfQ8' },
      { title: 'Servis: float + tenis (CEPSUM)', url: 'https://www.youtube.com/watch?v=_e00ogqoNZw' },
    ],
  },
  {
    id: 'jumpfloat',
    name: 'Jump float servis',
    level: 'İleri',
    tagline: 'jump float — elit kadın oyuncuların standardı',
    description: "Kısa yaklaşma ve sıçramayla atılan float. Temas yüksekliği, hız ve daha dik iniş açısı kazanır. Elit kadın oyuncular arasında standart haline geldi (son araştırmalara göre profesyonel kadın voleybolunda servislerin %86'sı). Jump topspin'den daha az riskli, ayakta float'tan daha bozucu.",
    biomechanics: [
      "Kısa yaklaşma (2 ila 4 adım)",
      'Sıçrama sırasında kollar yay-ok pozisyonunda — kolların itme yaptığı smaçtan farklı',
      "Topa hızı yaklaşma sağlar, sadece kol değil",
      'Temas en yüksek noktada, başın hafif önünde',
      'Kilitli bilek + dondurma, ayakta float ile aynı',
    ],
    steps: [
      'Çizginin 2-3 m gerisinde pozisyon, top sol elde',
      "Adım 1 (sağ) hazırlık adımı olarak, kollar gevşek",
      'Adım 2 (sol): topu yaklaşık 1,5 m yukarı, rotasyonsuz atın',
      'Adım 3 + sıçrama: çizginin arkasında iki ayakla kalkış — kollar yay-ok pozisyonuna yükselir',
      "Hafif öne doğru dikey sıçrama, vücut gergin",
      'Kol uzanmış, el ayası topun ortasında vuruş yapın',
      'Anında DONDURUN — saha içine inin',
    ],
    errors: [
      ['Çok yüksek atış', 'Jump spin refleksi — ayakta float gibi atışı kısa tutun'],
      ["Saldırıdaki gibi kol salınımı", 'Rotasyonlu smaca dönüşür — yay-ok pozisyonunu koruyun'],
      ['Uzun takip hareketi', 'Ayakta float ile aynı: dondurma zorunlu'],
      ['Kalkışta ayak hatası', "Kalkışın dip çizginin arkasında olduğundan emin olun"],
    ],
    exercises: [
      "Yaklaşma eklemeden önce ayakta float'ta ustalaşın (sağlam dondurma)",
      'Vurmadan sadece yaklaşma: stabil, alçak atışı çalışın',
      'Kontrollü hızda jump float: güçten önce tutarlılık',
    ],
    videos: [
      { title: "Jump float servis — INF'AUX ENTRAÎNEURS (Bretagne)", url: 'https://www.youtube.com/watch?v=P5xCgV7nfO8' },
      { title: 'Jump float + smaç (Volleyball Canada)', url: 'https://www.youtube.com/watch?v=X1Mq9K90FCk' },
    ],
  },
  {
    id: 'jumpspin',
    name: 'Jump topspin servis',
    level: 'Yarışma',
    tagline: 'jump servis — çizginin arkasından smaç',
    description: `"Çizginin arkasından smaç": tam hızda topspin'li vuruş (güçlü kulüplerde 80-95 km/s). En yüksek ace potansiyeli ama aynı zamanda en yüksek hata oranı. Antrenmanda 1000+ tekrar yapanlara özel.`,
    biomechanics: [
      "Arka bölge smacıyla aynı 3-4 adımlık yaklaşma",
      'Önünüze 1-1,5 m yüksek atış, hafif öne dönüş verilerek',
      'Sıralı rotasyon: kalça → gövde → omuz → dirsek → bilek',
      'Topun üzerinde saat 10-11 yönünde temas bölgesi',
      "Topspin için tam bilek savurması (elit seviyede ~30 rotasyon/s)",
      "Tam takip — float'ın tersi",
    ],
    steps: [
      'Çizginin 3-4 m gerisinde pozisyon, top vuruş elinde',
      'Adım 1 (sağ) + hafif topspin verilmiş yüksek atış',
      'Adım 2 (sol): hızlanma',
      "Adım 3 (sağ): uzun güç adımı, ağırlık merkezi alçalır",
      "Adım 4 (sol): kalkış, kollar yukarı doğru savrulur",
      'Patlayıcı dikey-öne sıçrama',
      "Tepe noktasında vuruş: el topun üzerinden geçer (saat 10), avuç ardından parmaklar yuvarlanır",
      'Tam bilek savurması + takip — sahanın 1-2 m içine inin',
    ],
    errors: [
      ['Çok alçak veya geride atış', 'Filenin altına vurmanın #1 nedeni — atış yüksek ve önde olmalı'],
      ['Çok öne atış', 'Ayak hatası — servis bölgesinin sınırlarına uyun'],
      ['Bilek savurması eksikliği', 'Top aşağı dönüş olmadan uzağa uçar'],
      ['Hazırlıksız maçta kullanmak', "Önce antrenmanda 1000 tekrar — altın kural"],
    ],
    exercises: [
      "Altın kural: maçta kullanmadan önce antrenmanda 1000 tekrar",
      'Jump spin "kontrol": daha alçak atış, hassas bölgeleri hedeflemek için azaltılmış hız',
      "Atışınızı filme alın: hataların %80'i atış yerleşiminden kaynaklanır",
    ],
    videos: [
      { title: 'Güçlü jump topspin + float servis (Sikana)', url: 'https://www.youtube.com/watch?v=50TUVvPLKr8' },
    ],
  },
];

const ZONES_TABLE: [string, string][] = [
  ['Bölge 1 — arka sağ', '5-1 sisteminde pasörün çıkışını engeller'],
  ['Bölge 2 — kısa ön sağ', 'Sağ taraf başlangıcını bozar, liberoyu dışlar'],
  ['Bölge 3 — kısa ön orta', 'Orta oyuncuyu engeller, çabuk hücumları bozar'],
  ['Bölge 4 — kısa ön sol', "Ana smaçörü hem karşılamaya hem hücum etmeye zorlar"],
  ['Bölge 5 — derin arka sol', "Uzun çapraz, yüksek hata oranı"],
  ['Bölge 6 — derin arka orta', 'Kısa boylu pasörlere karşı uzun servis'],
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

export default function GuideServiceTr() {
  const [activeId, setActiveId] = useState('cuillere');
  const current = SERVICE_TYPES.find(t => t.id === activeId)!;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>

      {/* Golden rule */}
      <GoldenRule>
        Servis hatalarının %80'i atıştan kaynaklanır. Güç peşinde koşmadan önce öncelikli olarak atışı stabilize edin.
      </GoldenRule>

      {/* Service type selector */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <h2 style={S.sectionTitle}>SERVİS TÜRLERİ</h2>
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
            <div style={S.labelTeal}>TEMEL BİYOMEKANİK</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {current.biomechanics.map((b, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13.5 }}>
                  <span style={{ fontFamily: '"Bungee", sans-serif', color: 'var(--teal)', flexShrink: 0 }}>▸</span>{b}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginBottom: 18 }}>
            <div style={{ ...S.label, opacity: 0.7 }}>UYGULAMA ADIMLARI (SAĞ ELLİ)</div>
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
              <div style={S.labelOrange}>✗ YAYGIN HATALAR</div>
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
              <div style={S.labelTeal}>★ EGZERSİZLER</div>
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
            <div style={{ ...S.label, opacity: 0.6 }}>VİDEOLAR — {current.name.toUpperCase()}</div>
            {current.videos.map((v, i) => (
              <VideoLink key={i} title={v.title} url={v.url} />
            ))}
          </div>
        )}
      </section>

      {/* Zones */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 style={S.sectionTitle}>HEDEF BÖLGELER VE TAKTİKLER</h2>
        <div style={{ border: '3px solid var(--ink)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--ink)', color: 'var(--cream)' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.12em' }}>RAKİP BÖLGESİ</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.12em' }}>TAKTİK ETKİ</th>
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
            ['Boşluklar', "İki karşılayıcı arasındaki boşluğu hedeflemek bir oyuncuyu hedeflemekten daha etkilidir — rakibin iletişimi sınanır."],
            ['Kısa/uzun değişimi', "Pasörün ne zaman geri çekileceğini bilmesini önler. Hücum çizgisinin gerisindeki kısa float (2-3-4 bölgeleri) özellikle bozucu olur."],
            ['FBSO% metriği', "Ace üretmeden rakibin First Ball Side Out'unu %70'ten %45'e düşüren bir servis çok etkili bir servistir."],
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
          <div style={{ ...S.label, marginBottom: 16 }}>★ ÖĞRENME HİYERARŞİSİ</div>
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
            Bir sonrakine geçmeden önce her seviyede ustalaşın. <strong>Güçten önce tutarlılık.</strong>
          </p>
        </div>
      </section>

    </div>
  );
}
