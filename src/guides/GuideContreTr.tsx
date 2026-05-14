import GoldenRule from './GoldenRule';
import VideoLink from './VideoLink';
import { S } from './styles';

const TIMING_STEPS = [
  {
    title: 'Topu değil, smaçörü izle',
    desc: "Smacın anını ve yönünü tahmin etmek için smaçörün omuzlarını ve kolunu izle.",
  },
  {
    title: 'Smaçörden SONRA zıpla',
    desc: 'Smaçörün kalkış fazında olmasını bekle. Aynı anda veya öncesinde zıplarsan çok erken ineceksin.',
  },
  {
    title: 'İdeal gecikme: 0,2 ile 0,3 saniye',
    desc: `Smaçör zıpladığında zihninde "BİR" say, sonra hemen ardından zıpla. Bu saniyenin küçük bir kısmı kritiktir.`,
  },
  {
    title: 'File üzerine geç',
    desc: 'Zıplamanın tepe noktasında ellerini ve kollarını ileriye ve aşağıya itin — sadece yukarı değil.',
  },
];

const CONTRE_TYPES = [
  {
    name: 'Hücum bloğu',
    objectif: "Topu doğrudan rakibin sahasına geri gönder",
    points: [
      ['Pozisyon', 'Eller geniş açık, parmaklar uzanmış ve ayrık'],
      ['Hareket', 'File üzerinden mümkün olduğunca uzağa geç, kollar öne uzanmış'],
      ['Hedef', "Topu rakibin zeminine indirmek için bileklerini sertleştir"],
      ['Ne zaman', 'İyi konumlandığında ve hücumu okuduğunda'],
    ],
  },
  {
    name: 'Kapanış bloğu',
    objectif: 'Savunmanın toparlanması için topu yavaşlat',
    points: [
      ['Pozisyon', 'Eller birbirine yakın, avuçlar sana doğru açılı'],
      ['Hareket', 'İtmek yerine darbeyi sönümle'],
      ['Sonuç', 'Top sahanıza yumuşakça düşer ve oynanabilir'],
      ['Ne zaman', 'Geç kaldığında veya kötü konumlandığında'],
    ],
  },
  {
    name: 'Bölge bloğu',
    objectif: 'Belirli hücum bölgelerini kapat',
    points: [
      ['Pozisyon', 'Belirli bir bölgeyi blokla (çizgi veya çapraz)'],
      ['Hareket', 'Ellerini korumak istediğin bölgeye doğru açılı tut'],
      ['Taktik', 'Smaçörü, savunmacılarınızın hazır olduğu bir bölgeye smaç yapmaya zorla'],
      ['Ne zaman', 'Arka hat savunmanızla anlaşarak'],
    ],
  },
  {
    name: '2 veya 3 kişilik blok (kolektif blok)',
    objectif: 'Geçilmez bir duvar oluştur',
    points: [
      ['Koordinasyon', 'Aynı anda birlikte zıplayın'],
      ['Yerleşim', 'Kenar blokçular orta blokçuya göre konumlanır'],
      ['Eller', 'Ellerinizi takım arkadaşlarınızla birleştirin (boşluk yok)'],
      ['İletişim', 'Bir blokçu koordinasyon için "çizgi" veya "çapraz" diye seslenir'],
    ],
  },
];

const TIMING_TIPS = [
  ['"Bir-iki" egzersizi', `Antrenmanda smaçör zıpladığında "BİR", siz zıpladığınızda "İKİ" deyin. Bu gerekli gecikmeyi oluşturur.`],
  ['Omuzları izleyin', "Smaçörün omuzlarının yönü smacın yönünü gösterir."],
  ['Pası okuyun', 'Yüksek pas = daha fazla zaman. Yakın pas = hızlı tepki.'],
  ['Erkenden pozisyon alın', 'Son anda koşmaktansa hazır ve bekliyor olmak daha iyidir.'],
  ['Dikey sıçramanızı geliştirin', 'Ne kadar yüksek zıplarsanız, zamanlamada o kadar fazla hata payınız olur.'],
];

const SAUT_POSITION = [
  'Ayaklar omuz genişliğinde',
  'Ağırlık ayakların ön kısmında',
  'Dizler hafif bükük',
  'Kollar yanlarda veya hafif önde',
  'Fileden yaklaşık 30–50 cm uzakta pozisyon',
];

const SAUT_IMPULSION = [
  ['Kayma adımı', 'Hareket etmen gerekirse hızlı bir kayma adımı kullan'],
  ['Bükme', 'Bacaklarını hızlıca bük (çok aşağı inme)'],
  ['Kol salınımı', 'Kollarını patlayıcı şekilde yukarı savur'],
  ['Tam uzanma', 'Yüksekliği maksimize etmek için bacaklarını tam uzat'],
];

const SAUT_EN_LAIR = [
  'Kollarını uzanmış ve sıkı tut',
  'Eller geniş açık, parmaklar uzanmış ve ayrık',
  'File üzerine geç (file dokunuşu yok!)',
  'Stabil kalmak için karın kasını sıkı tut',
];

const ERREURS = [
  ['Çok erken zıplamak', 'Smaçör smaç yaparken siz iniyorsunuz — daha uzun bekleyin!'],
  ['Topu izlemek', 'Smaçör hakkında bilgi kaybedersiniz — oyuncuyu izleyin!'],
  ['Yumuşak eller', 'Top kendi sahanıza geri seker — parmaklarınızı sertleştirin ve sıkın!'],
  ['Öne zıplamak', 'Fileye dokunursunuz — dikey zıplayın!'],
  ['Kollarınızı çok erken indirmek', 'İnene kadar kollarınızı yukarıda tutun.'],
];

const EXERCICES = [
  {
    title: 'Partner ile zamanlama',
    desc: 'Bir partner hücum ediyormuş gibi yapar (topsuz). Sadece zıplamanın zamanlamasını çalışırsınız. 20 kez tekrarlayın.',
  },
  {
    title: 'Sabit hücuma karşı blok',
    desc: 'Bir smaçör sabit pozisyondan smaç yapar. Zamanlama ve tekniğe odaklanın. Hızı kademeli olarak artırın.',
  },
  {
    title: 'Omuz okuma',
    desc: 'Smaçör smaçlarını değiştirir (çizgi/çapraz). Yönü tahmin etmek için omuzlarını okumaya çalışın.',
  },
  {
    title: 'Ayak çalışması + blok',
    desc: 'Bloktan önce hızlı yanal hareket çalışın. Maç durumlarını simüle eder.',
  },
];

const CONSEILS_PRO = [
  ['Sabır', 'Blok, en zor tekniklerden biridir. Kendinize karşı sabırlı olun.'],
  ['Tekrar', 'Kas hafızası yüzlerce tekrarla oluşur.'],
  ['Video', 'Zamanlamanızı ve tekniğinizi analiz etmek için kendinizi filme alın.'],
  ['Profesyonelleri izleyin', 'Profesyonel oyuncuların oyunu nasıl okuduğunu ve zıplamalarını nasıl zamanladığını izleyin.'],
  ['Basitten başlayın', 'Hızlı hücumlara geçmeden önce yavaş hücumlara karşı blokta ustalaşın.'],
];

export default function GuideContreTr() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

      {/* Règle d'or */}
      <GoldenRule mantra="TOP → PASÖR → TOP → SMAÇÖRÜN OMZU → ZIPLAMA → FİLE ÜZERİNE GEÇİŞ">
        Düzenli pratik ve özellikle zamanlamaya gösterilen dikkatle bloklarınızı önemli ölçüde geliştireceksiniz. Ortalama dikey sıçramayla iyi zamanlanmış bir blok, çok yüksek ama kötü zamanlanmış bir sıçramadan daha iyidir.
      </GoldenRule>

      {/* Fondamentaux */}
      <section>
        <h2 style={S.section}>Bloğun temelleri</h2>
        <div style={S.card}>
          <p style={{ fontSize: 14, color: 'var(--ink)', opacity: 0.85, margin: 0, lineHeight: 1.6 }}>
            Blok, hücum silahına dönüşebilen kritik bir savunma hamlesidir.
            Anahtar, <strong style={{ color: 'var(--orange)' }}>kusursuz zamanlama</strong> ve oyunu iyi okumadadır.
          </p>
        </div>
      </section>

      {/* Timing */}
      <section>
        <h2 style={S.section}>Zamanlama: başarının anahtarı</h2>
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
        <h2 style={S.section}>Farklı blok türleri</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {CONTRE_TYPES.map((type, i) => (
            <div key={i} style={S.card}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 4 }}>{i + 1}. {type.name}</div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', marginBottom: 10 }}>
                <span style={{ color: 'var(--ink)', opacity: 0.5, textTransform: 'uppercase' }}>Amaç: </span>
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
        <h2 style={S.section}>Zamanlamanızı geliştirmek için ipuçları</h2>
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
        <h2 style={S.section}>Elit görsel sıralama</h2>
        <div style={{ ...S.card, border: '2.5px solid var(--orange)', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.8, margin: 0 }}>En iyi blokçular topu izlemez — kesin bir sıralamayı takip ederler:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
            {['TOP', 'PASÖR', 'TOP', "SMAÇÖRÜN OMZU"].map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ background: 'var(--orange)', color: '#fff', fontFamily: '"Bungee", sans-serif', fontSize: 10, padding: '4px 10px', letterSpacing: '0.08em' }}>{step}</span>
                {i < 3 && <span style={{ color: 'var(--orange)', fontWeight: 700 }}>→</span>}
              </div>
            ))}
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              ['1. TOP', 'Topun pasöre doğru gittiğini görün'],
              ['2. PASÖR', "Temas anında pasörün ellerini okuyun — pasın yönü"],
              ['3. TOP', 'Yönü doğrulamak için kısaca topu takip edin'],
              ['4. SMAÇÖRÜN OMZU', "Smaçörün omzuna kilitlenin — temas öncesi smaç yönünü ele verir"],
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
        <h2 style={S.section}>Hücum tipine göre kesin zamanlama</h2>
        <div style={{ border: '2.5px solid var(--ink)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--ink)' }}>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Hücum tipi</th>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Blokçunun zıplama zamanlaması</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Quick / 1. tempo (orta)', 'Smaçörle BİRLİKTE veya bir an önce (commit block)'],
                ['Shoot / 2. tempo kenar', 'Smaçörden ~0,1s sonra'],
                ['Yüksek top kenar (3. tempo)', 'Smaçörden 0,2–0,3s sonra'],
                ['Fileye yakın pas', 'Smaçörle BİRLİKTE'],
                ['Fileden uzak pas', '~0,5s sonra veya zıplama'],
                ['Slide (orta)', 'BİRLİKTE veya hemen sonra — yanal takip'],
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
        <h2 style={S.section}>Read blocking vs Commit blocking</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          <div style={{ ...S.card, border: '2.5px solid var(--orange)' }}>
            <div style={S.label}>Read blocking — önerilen</div>
            <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.8, margin: '0 0 10px 0', lineHeight: 1.6 }}>Blokçu pasörün kararını bekler, topu ve smaçörü okur, sonra hareket eder. "Bunch read" pozisyonu (hepsi ortaya yakın, sonra antene doğru patlar).</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['Pasların çoğunda stabil ve hazır', 'Kalçaları ve dizleri korur', 'Tüm amatör seviyeler için uygun'].map((pt, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                  <span style={S.bullet}>▸</span>
                  <span style={{ color: 'var(--ink)', opacity: 0.85 }}>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={S.card}>
            <div style={{ ...S.labelTeal, color: 'var(--ink)', opacity: 0.6 }}>Commit blocking — ileri/profesyonel</div>
            <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: '0 0 10px 0', lineHeight: 1.6 }}>Orta blokçu, pasör topu bırakmadan ÖNCE quick ile zıplamaya karar verir. Rakibin hızlı hücumunu kapatır, ama pasör başka yere pas atarsa, orta blokçu tamamen oyun dışı kalır.</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['Baskın orta blokçulara karşı etkili', 'Pasör uyum sağlarsa yüksek risk', 'Mükemmel okuma yeteneği olan oyunculara özel'].map((pt, i) => (
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
        <h2 style={S.section}>Blok için zıplama tekniği</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {([
            { title: 'Başlangıç pozisyonu', items: SAUT_POSITION.map(p => ({ text: p })) },
            { title: 'Kalkış', items: SAUT_IMPULSION.map(([l, t]) => ({ label: l, text: t })) },
            { title: 'Havada', items: SAUT_EN_LAIR.map(p => ({ text: p })) },
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
        <h2 style={S.section}>Kaçınılması gereken yaygın hatalar</h2>
        <div style={{ borderLeft: '5px solid var(--orange)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ ...S.label, color: 'var(--orange)' }}>Yaygın hatalar</div>
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
        <h2 style={S.section}>Antrenman egzersizleri</h2>
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
        <h2 style={S.section}>Profesyonel tavsiyeleri</h2>
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
        <h2 style={S.section}>Video kaynakları</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { title: 'Blok yapmayı öğrenme (Sikana)', url: 'https://www.youtube.com/watch?v=hJKueZn-tNQ' },
            { title: 'Voleybolda blok (CEPSUM)', url: 'https://www.youtube.com/watch?v=_MchJmDMn0E' },
            { title: 'Egzersiz: blok için zıplama', url: 'https://www.youtube.com/watch?v=GDS8PoWxO6Q' },
            { title: 'Egzersiz: bir hücumu bloklama', url: 'https://www.youtube.com/watch?v=S6TcodMWFz4' },
          ].map((v, i) => (
            <VideoLink key={i} title={v.title} url={v.url} />
          ))}
        </div>
      </section>

    </div>
  );
}
