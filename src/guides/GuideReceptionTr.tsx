import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { TeamSize } from '../pages/Positions';
import GoldenRule from './GoldenRule';
import VideoLink from './VideoLink';
import { S } from './styles';

const PLATFORM_TIPS = [
  ['Sweet spot', 'İdeal temas yüzeyi bileklerin 2,5 ile 15 cm üzerindedir.'],
  ['Cup and fold', "Önerilen teknik: bir el yumruk yapılır, diğer el üzerinden sarılır — başparmaklar paralel, aşağıyı gösterir."],
  ['Başparmaklar aşağı', "Başparmakları yere doğru çevirmek ön kolları dışa döndürür ve platformu sıkılaştırır."],
  ['Asla parmak kenetlemeyin', 'Güçlü bir serviste parmakları ASLA kenetlemeyin — kırık riski.'],
  ["Açı yönü belirler", "\"Top platformun baktığı yere gider\" — derin karşılama için: platform 45°; kısa karşılama için: platform yere daha paralel."],
];

const STEPS = [
  'Servisi atanı okuyun: temas öncesi servis tipini tespit edin.',
  "Kollar ayrık şekilde hazır pozisyon (önceden birleştirilmemiş).",
  'Rakip topa vurduğu anda yörüngeyi okuyun.',
  'Hareket edin (kayma adımları), kollar birleşmeden topun ARKASINA gelin.',
  'Platformu erken kurun: kollar erken değil, top geldiğinde birleşsin.',
  'DONDUR: temas öncesi tamamen sabit kalın, ağırlık ön ayakta — 1-2 saniye tutun.',
  'Sweet spot ile temas, omuzlar hedef pasöre dönük.',
  'Takip: kalça ve omuzlar hedefe doğru ilerler — kol salınımı yok.',
];

const DISPLACEMENTS = [
  {
    name: 'Yanal (kayma adımları)',
    desc: 'Top tarafındaki ayak önce hareket eder. Çaprazlama yapmadan kayma adımları, kalça alçak. Topun arkasına gelin, hedefe yeniden yönelin, son anda dondurun + platform. Uzun mesafeler için: çapraz adımlar sonra dönüş.',
  },
  {
    name: 'Öne (kısa top)',
    desc: 'Kısa servisler veya plaseler için. Genellikle öne hamleyle biter: diz yere doğru çöker, platform öndeki dizin önüne yerleştirilir.',
  },
  {
    name: 'Geriye (drop step)',
    desc: "Ayağı döndürün sonra geriye kayın. Geriye ASLA koşmayın (denge kaybı). Geri çekilmek için çok geçse: dönün ve yana platform oluşturun.",
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
      name: 'W sistemi — 5 karşılayıcı',
      level: 'Başlangıç',
      desc: 'Ön hatta 3 oyuncu, ikinci hatta 2 — pasör hariç herkes katılır. "W-formation" adını veren tarihi şekil (FIVB, USAV IMPACT).',
      pros: ['Oyuncu başına azaltılmış bölgeler (~1,8 m şerit)', 'Az iletişim gerektirir', 'Voleybol okulu ve U13-U15 için ideal'],
      cons: ['5 oyuncu arasında çok sayıda örtüşme bölgesi', 'Zayıf karşılayıcılar katılmaya zorlanır', 'Smaçörleri dağıtır (karşılamada 3 ön hat oyuncusu)'],
    },
    {
      name: 'U sistemi — 3 karşılayıcı',
      level: 'Modern standart',
      desc: '6. bölgede libero (servis atanların ana hedefi), 5 ve 1. bölgelerde kenarlar. En iyi 3 karşılayıcı her topu alır, tüm ön hat smaçörleri çıkar.',
      pros: ['İletişim 3 oyuncuya basitleştirilmiş', 'En iyi 3 karşılayıcı her şeyi kapsar', 'Ön hat smaçörleri yaklaşmaları için serbest'],
      cons: ['Kapsanacak daha geniş yanal bölgeler (oyuncu başına ~3 m)', 'Yüksek performanslı bir libero gerektirir', 'Köşelere kısa servislere karşı savunmasız'],
      recommended: true,
    },
    {
      name: '2 kişilik karşılama — libero + R4',
      level: 'Elit',
      desc: 'Sadece 2 karşılayıcı (libero + seçilmiş bir R4) tüm genişliği kapsar. 2. R4\'ü serbest bırakmak ve onları karşılama yorgunluğu olmadan hücum için taze tutmak amacıyla en üst seviyede kullanılır.',
      pros: ['Tüm smaçörler hücum geçişi için müsait', 'Smaçörler karşılamada yıpranmadığı için daha iyi blok/hücum', 'Profesyonel takımlar tarafından tercih edilen sistem (Polonya, Fransa, İtalya)'],
      cons: ['2 çok atletik karşılayıcı gerektirir (her biri ~4,5 m şerit)', 'Hata payı yok — yanlış okunan servis = rakibe sayı', 'Uluslararası seviye libero olmadan kullanılamaz'],
    },
  ],
  5: [
    {
      name: '3 kişilik karşılama — 2F-3B düzeni',
      level: 'Önerilen',
      desc: 'Arka hattaki 3 oyuncu (P5, P6, P1) karşılar. P1\'deki pasör karşılamadan çıkar ve 6v6\'daki 5-1 gibi servis atan temas ettiği anda penetre eder. Ön hattaki 2 oyuncu (P4, P3) yaklaşmaları için serbesttir.',
      pros: ['6v6 5-1\'e en yakın düzen (pedagojik olarak ideal)', 'İyi karşılama → hücum geçişi', '2 ön hat smaçörü + arka hat pipe mümkün'],
      cons: ['9 m boyunca 3 karşılayıcı (oyuncu başına ~3 m)', 'Pasör hızlı okumalı ve < 1 saniyede penetreyi seçmeli', 'Pasör çok erken giderse P1\'de boşluk'],
      recommended: true,
    },
    {
      name: '4 kişilik karşılama — 3F-2B düzeni',
      level: 'Standart',
      desc: 'Arka hattaki 2 oyuncu (P5, P1) + ön hattaki 2 oyuncu (genellikle P4 ve P3 — P2\'deki pasör çıkar) karşılar. Pasör hedefte kalır: penetre yok, anında dağıtım.',
      pros: ['Azaltılmış bölgeler (oyuncu başına ~2,25 m)', 'Karma veya başlangıç takımları için ideal', 'Pasör zaten hedefte — geçiş yok'],
      cons: ['Ön hatta sadece 2 smaçör müsait (P4 + P3 veya P4 + orta)', 'Karşılayan ön hat oyuncularının sonra yaklaşmalarını koşması gerekir', '2 kişilik blok zor çünkü pasör fileye çıkıyor'],
    },
    {
      name: 'Beşgen karşılama — 4 veya 5 oyuncu',
      level: 'Başlangıç / rekreasyonel',
      desc: '5 karşılayıcı (5 oyunculu W eşdeğeri). File merkezinde 1 oyuncu (genellikle özel pasör), kenarlardaki 2 oyuncu ortada, arka hattaki 2 oyuncu derin bölgede. Merkez oyuncu özel pasör olmadıkça herkes katılır.',
      pros: ['Eşit saha kapsamı', 'Çok düşük teknik gereksinim', 'Tanıtım antrenmanlarına uygun'],
      cons: ['5 karşılayıcı ile çok sayıda örtüşme', 'Hiçbir smaçör serbest bırakılmaz', 'Seviye yükseldiğinde etkisiz'],
    },
  ],
  4: [
    {
      name: 'Elmas (3 karşılayıcı)',
      level: 'Standart 4v4',
      desc: 'Pasör file merkezinde (P3, karşılamadan çıkıyor). 2 kenar (P4, P2) orta sahada + tek arka hat oyuncusu (P1) derin bölgede karşılar. Salon 4v4\'te en yaygın dizilim (kolej intramurals).',
      pros: ['Pasör zaten hedefte — penetre yok', '3 net ve simetrik bölge', 'Intramurals, rekreasyonel oyun, plaj 4\'lü için ideal'],
      cons: ['9 m genişliği 3 ile kapsamak = oyuncu başına ~3 m', 'Tek arka hat oyuncusu karşılamadan sonra tüm derin bölgeyi savunmalı', 'Ön hatta sadece 2 smaçör'],
      recommended: true,
    },
    {
      name: '3-1 hattı (3 karşılayıcı)',
      level: 'Orta',
      desc: 'P1\'de (arka hat) tek pasör, rakibin servisi 2. bölgeye temas ettiği anda penetre eder. 3 ön hat smaçörü (P4, P3, P2) karşılar. 6v6 5-1\'in basitleştirilmiş eşdeğeri.',
      pros: ['Her zaman ön hatta 3 smaçör', '6v6 5-1\'i hazırlamak için yararlı pedagoji', 'Pasör dağıttıktan sonra da hücum edebilir'],
      cons: ['Çok temiz bir karşılama gerektirir (penetre affetmez)', 'Pasör top savunulmadan giderse P1\'de boşluk', 'Her smaçör karşılama yapmayı bilmeli'],
    },
    {
      name: 'Kutu 2-2 (4 karşılayıcı)',
      level: 'Başlangıç',
      desc: '2 ön hat oyuncusu (P4, P2) + 2 arka hat oyuncusu (P5, P1), filede özel pasör yok. En iyi konumdaki oyuncu 2. dokunuşu alır. Tanıtım antrenmanları veya U11-U13 için tipik.',
      pros: ['Tüm sahayı kapsar (4 bölge x 2,25 m)', 'Pasöre teknik gereksinim yok', 'Herkes karşılar — çok eğitici'],
      cons: ['Özel pasör yok — rastgele dağıtım', 'Hiçbir smaçör yaklaşma için serbest değil', 'Seviye yükseldiğinde etkisiz'],
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
      title: 'ARKA HAT pasörü (P1 / P6 / P5) — 5-1\'in P1, P6, P5 rotasyonları',
      bullets: [
        'Karşılamadan çıkar: kendisine top gönderilmez.',
        'Özel bir pozisyonda başlar (örn. P1: fileden ~7,5 m, kenar çizgisinden 1 m), başka bir oyuncunun arkasına gizlenir (stack).',
        'RAKİP SERVİSE TEMAS ETTİĞİ ANDA hedefe doğru (Z2 ve Z3 arası, fileden ~1 m, merkezin sağında 3 m) penetre eder — daha önce değil (örtüşme hatası).',
        'P1: en kısa penetre; P6: merkezi penetre; P5: en uzun penetre (çapraz).',
        'Ön hatta 3 smaçör müsait (R4 + orta + pasör çaprazı) + arka hat hücumları.',
      ],
    },
    {
      title: 'ÖN HAT pasörü (P2 / P3 / P4) — 5-1\'in P2, P3, P4 rotasyonları',
      bullets: [
        'Karşılamadan çıkar: zaten hedefe yakın.',
        'P2\'de: zaten hedefte — ayrıca Z4\'ten rakip R4\'e karşı çizgi blokçusu olur (çift savunma yükü).',
        'P3\'te: servise temas edilir edilmez hedefe yanal geçiş.',
        'P4\'te: hedefe ulaşmak için tüm fileyi geçer (en uzun ön hat hareketi).',
        'Ön hatta sadece 2 smaçör (P6\'da pipe ve P1\'deki pasör çaprazının arka hat hücumuyla telafi edilir).',
      ],
    },
  ],
  5: [
    {
      title: 'PENETRE EDEN pasör (2F-3B düzeni, önerilen)',
      bullets: [
        'P1 arka hatta başlar, karşılamadan çıkar.',
        'Rakibin servisine temas edildiği anda hedefe (Z2/Z3, fileden ~1 m) penetre eder — 6v6 5-1 ile aynı.',
        '3 arka hat oyuncusu (P5 + P6 + ayrılan P1) 3 kişilik karşılamayı kapsar.',
        'Ayrılmadan önce topun savunulmasını beklemeli (yaygın hata: erken ayrılış → P1\'de boşluk).',
      ],
      note: '6v6\'ya en yakın düzen — geçişi hazırlamak için önerilir.',
    },
    {
      title: 'SABİT ÖN HAT pasörü (3F-2B veya beşgen düzeni)',
      bullets: [
        'Hedefte kalır (düzene göre P2 veya P3): penetre yok.',
        'Karşılamadan çıkar: kendisine top gönderilmez.',
        'Pas geldiği anda anında dağıtım — geçiş yok.',
        'P2\'de: ayrıca rakip smaçöre karşı çizgi blokçusu olur (6v6 5-1\'deki gibi).',
      ],
    },
  ],
  4: [
    {
      title: 'Elmasta ön hat pasörü (P3 file merkezi)',
      bullets: [
        'Hedefte kalır (Z3, fileden ~1 m): penetre yok.',
        'Karşılamadan çıkar: diğer 3 (2 kenar + 1 arka) karşılar.',
        'Pasın kalitesine göre Z4 veya Z2\'ye hızlı dağıtım.',
        'Savunma → pas geçişi 2 saniyeden kısa sürede yapılmalı (sadece 1 arka hat oyuncusu = çok fazla kapsama).',
      ],
      note: 'Salon 4v4\'te en çok kullanılan dizilim.',
    },
    {
      title: '3-1 hattında penetre eden pasör (P1 arka hat)',
      bullets: [
        'P1 arka hatta başlar, karşılamadan çıkar.',
        'Rakibin servisine temas edildiği anda 2. bölgeye penetre eder.',
        '3 ön hat smaçörü (P4, P3, P2) karşılar.',
        'Çok temiz bir karşılama gerektirir — aksi halde pasör zamanında hedefe ulaşamaz.',
      ],
    },
    {
      title: 'Özel pasör yok (kutu 2-2)',
      bullets: [
        '1. dokunuştan sonra en iyi konumdaki oyuncu 2. dokunuşu alır.',
        'Herkes karşılar — ~2,25 m\'lik 4 bölge.',
        'Diğer 3 oyuncudan birine rastgele dağıtım.',
        'Tanıtım antrenmanları için saklayın (U11-U13, okul).',
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
    title: '6v6\'da karşılamanın merkezi — libero',
    text: 'Farklı renk formayla savunma uzmanı. Orta oyuncular arka hatta rotasyon yaptığında onları sistematik olarak değiştirir (sınırsız değişiklik, FIVB Kural 19 tarafından sayılmaz). Z5-Z6-Z1\'de 3 ardışık rotasyon oynar. Tercih edilen karşılama pozisyonu: Z6 (servis atanların ana hedefi) veya Z5. FIVB kısıtlamaları: blok yok, file üzerinde hücum yok, bir takım arkadaşı sonra file üzerinde hücum ederse 3 m çizgisinin önünde parmak pas yok.',
    accent: 'orange',
  },
  5: {
    title: '5v5\'te resmi libero yok',
    text: 'Salon 5v5\'in FIVB düzenlemesi yok. Pratikte hiçbir federasyon bu formatta libero izin vermez. En iyi karşılayıcı P6 veya P5\'e yerleştirilir ve sistematik olarak arka hatta oynar — farklı forma veya kısıtlamalar olmadan "fiili libero" olur. Bu nedenle gerekirse blok ve hücum yapabilirler.',
    accent: 'teal',
  },
  4: {
    title: '4v4\'te libero yok',
    text: '4v4 düzenlemeleri altında libero izin verilmez (kolej intramurals, FFVb eğitsel oyun, plaj 4\'lü). Elmasta tek arka hat oyuncusu — veya 3-1 hattındaki penetre eden pasör — en iyi karşılayıcı/savunucu rolünü üstlenir. Elmasta karşılayıcı başına ~3 m şerit ile anticipation teknikten daha önemlidir.',
    accent: 'plum',
  },
};

const READING_TABLE: [string, string][] = [
  ['Alttan', 'Normal duruş, topu yüksekten alın'],
  ['Ayakta float', "Yüksek duruş, sapmadan önce erken almak için öne adım atın"],
  ['Topspin', 'Alçak duruş, geri çekilmeye hazır, açılı platform'],
  ['Jump float', 'Fileden 4 m mesafede parmak pas ile oynanabilir'],
  ['Jump topspin', 'Alçak duruş, önceden geri çekilme, sert pasif platform'],
  ['Hibrit servis', 'Her iki senaryo için hazır platform (float veya topspin)'],
];

const READING_CUES = [
  'Servis atanın çizgideki pozisyonu → tercih edilen açı',
  'Atışın yüksekliği ve yerleşimi: yüksek+geride → topspin; alçak+önde → float',
  "Yaklaşmanın uzunluğu: uzun → jump topspin; kısa → jump float",
  'Servis atanın temas anındaki omuzlarının yönü → topun yönü',
];

const ERRORS_COMMON: [string, string][] = [
  ['Sallanan kollar', 'Sebep #1 — temas anında sallanan kollar, top öngörülemez. Düzeltme: "platform pasif, bacaklar aktif".'],
  ['Bozuk platform', "Bir ön kol diğerinden yüksek — dirsekleri kilitleyin ve başparmakları aşağı itin."],
  ['Çok erken birleştirilmiş kollar', "Hareketi yavaşlatır ve geç manşet/parmak pas seçimini engeller. Ellerinizi sadece gelirken birleştirin."],
  ['Çok dik gövde', "Platform topun altından geçer → top fileden çok uzakta biter. 30-45° öne eğilin."],
  ['Göbek hizasının üzerinde temas', 'Çok yüksek = azalmış kontrol. Bel hizasında veya altında temas hedefleyin.'],
  ['Dondurma yok', "Temas anında hala hareket halinde = yönü kontrol etmek imkansız. Tam bir durmaya gelin."],
];

const ERRORS_BY_SIZE: Record<TeamSize, [string, string][]> = {
  6: [
    ['Yanlış konumlanmış libero', 'Çok merkezi olursa köşelere kısa servisleri kaçırır; çok yanal olursa merkezi terk eder. Referans hedef: rakip servis atanla aynı hizada Z6.'],
    ['Pasör örtüşmesi', 'Pasör rakip servise temas etmeden önce pozisyonundan ayrılır — 5-1\'de #1 hata (FIVB Kural 7.4). Ayakları, temasa kadar ön/arka ilişkilere uymalı.'],
    ['Net rolleri olmayan 5 kişilik karşılama', 'W\'de 3 ön hat oyuncusu merkez bölgede birbirlerine girer. Orta servislerde P3 ile P6 arasında topu kimin alacağını açıkça tanımlayın.'],
  ],
  5: [
    ['Çok erken ayrılan pasör', 'Penetre eden pasörlü 2F-3B düzeninde, top savunulmadan önce ayrılmak = P1\'de boşluk. Onay bekleyin.'],
    ['Yan yana 2 karşılayıcı', '3F-2B düzeninde, P5 ve P1 aralıklı olmalı (her biri bir tarafta). Birlikte ortalanmış = açık kenar çizgileri.'],
    ['Hücum etmeyi unutan ön hat karşılayıcı', '3F-2B düzeninde, karşılayan ön hat oyuncusu sonra hücum yaklaşmasını koşmalı — özellikle çalışılması gereken bir refleks.'],
    ['Tanımlanmış fiili libero yok', 'Net bir rol olmadan, 3 arka hat oyuncusu sorumluluğu birbirine atar. Merkez bölgede öncelik olarak en iyi karşılayıcıyı açıkça belirleyin.'],
  ],
  4: [
    ['Karşılama yapan elmas pasörü', 'Elmasta P3\'teki pasör karşılamadan ÇIKMALI — aksi halde hızlı dağıtım imkansız. Diğer 3 alır.'],
    ['Aşırı yüklenmiş tek arka hat', 'Elmasta arka hat P1 tek başına derin sahanın ~3,5 m\'sini kapsar. Anticipation = 1 numaralı beceri; sürekli kayma adımları ve erken okuma.'],
    ['2. dokunuş çağrısı olmayan kutu 2-2', 'Özel pasör olmadan, kim pas verir? Karşılama olur olmaz 2. dokunuşta "BENİM!" diye bağırmak vazgeçilmezdir.'],
    ['Düz hatta elmas kenarları', 'P4 ve P2 P1 ile aynı hizada orta sahada → kısa kesik atış aralarına düşer. Pozisyonları kademeli yapın.'],
  ],
};

const VIDEOS = [
  { title: 'Manşet nasıl yapılır (Sikana)', url: 'https://www.youtube.com/watch?v=aZkZwAFeye0' },
  { title: 'Ön kol pası (CEPSUM)', url: 'https://www.youtube.com/watch?v=qIPlthgJvHU' },
  { title: 'Pasöre kontrollü manşet', url: 'https://www.youtube.com/watch?v=eUDY6AGS1-A' },
  { title: 'Yüksek ve alçak karşılamayı öğrenme (Sikana)', url: 'https://www.youtube.com/watch?v=ZLRy_Gu9LVA' },
  { title: 'Bireysel ön kol pası ısınması', url: 'https://www.youtube.com/watch?v=nGiE_y09vTY' },
];

export default function GuideReceptionTr() {
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
        Ön kol pası bir takımın hücum başarısının %60'ını belirler. İyi bir karşılama olmadan hızlı hücum olmaz. Platform pasif — bacaklar aktif.
      </GoldenRule>

      <section style={{ ...S.card, border: '2.5px solid var(--orange)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={S.label}>Oyun formatı</div>
        <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.8, margin: 0 }}>
          Aşağıdaki <strong>karşılama sistemleri</strong>, <strong>pasörün rolü</strong> ve <strong>yaygın hatalar</strong> seçilen formata uyum sağlar.
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
        <h2 style={S.section}>Hazır pozisyon</h2>
        <div style={S.card}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              'Ayaklar omuzlardan biraz daha geniş, bir ayak hafif önde',
              "Dizler ayakların iç tarafına bükülü, kalça alçak, gövde 30-45° eğik",
              'Sırt düz, ağırlık ayakların ön kısmında (topuklar hafif hafifletilmiş ama kalkmamış)',
              'Kollar AYRIK (birleşmemiş), 90-145° bükülü, bel hizasında',
              'Atışın yapıldığı andan itibaren gözler servis atanda',
            ].map((pt, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14 }}>
                <span style={S.bullet}>▸</span>
                <span style={{ color: 'var(--ink)', opacity: 0.85 }}>{pt}</span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 12, borderLeft: '4px solid var(--orange)', paddingLeft: 12, fontSize: 13 }}>
            <strong style={{ color: 'var(--orange)' }}>Ana hata: </strong>
            <span style={{ color: 'var(--ink)', opacity: 0.7 }}>top gelmeden önce kolları zaten platform halinde birleştirmiş olmak — bu hareketi yavaşlatır ve geç manşet/parmak pas seçimini engeller.</span>
          </div>
        </div>
      </section>

      <section>
        <h2 style={S.section}>Platform</h2>
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
        <h2 style={S.section}>Uygulama — temel adımlar</h2>
        <div style={{ ...S.card, background: 'var(--cream)', border: '2.5px solid var(--orange)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {STEPS.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={S.stepBadge}>{i + 1}</span>
              <p style={{ fontSize: 14, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>{step}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, borderLeft: '4px solid var(--orange)', paddingLeft: 16, paddingTop: 4, fontSize: 14, color: 'var(--ink)', opacity: 0.7 }}>
          <strong style={{ color: 'var(--ink)', opacity: 1 }}>Dondurma: </strong>
          "Fotoğraf için poz verin" — temas sonrası 1-2 saniye tamamen sabit kalın. 50-90 km/s\'de hareket halindeki bir savunmacı açısını ayarlayamaz. Sabit durarak her yöne hareket edebilir.
        </div>
      </section>

      <section>
        <h2 style={S.section}>Hareketler</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {DISPLACEMENTS.map((d, i) => (
            <div key={i} style={S.card}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 6 }}>{d.name}</div>
              <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: 0, lineHeight: 1.6 }}>{d.desc}</p>
            </div>
          ))}
          <div style={S.card}>
            <div style={S.label}>Tek kol manşeti — acil durum</div>
            <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: 0, lineHeight: 1.6 }}>
              Top her iki kol için fazla uzaktayken son çare hareket. Kol uzanmış, platform iç ön kolda düz, salınım yok — sadece topu yukarı saptırmak için bir dürtüş. Varyantlar: tek kol stab (güçlü smaçta yumruk), tek kol kepçe (alçak top için yukarı bakan açık avuç).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 style={S.section}>Karşılama sistemleri — {teamSize}v{teamSize}</h2>
        {teamSize !== 6 && (
          <div style={{ ...S.alert, background: 'var(--cream)', borderColor: 'var(--orange)', marginBottom: 14 }}>
            <div style={S.label}>⚠ Resmi olmayan FIVB formatı</div>
            <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0, lineHeight: 1.6 }}>
              {teamSize === 5
                ? "Salon 5v5'in özel FIVB veya FFVb düzenlemesi yoktur. Aşağıdaki sistemler VolleyballXL, The Art of Coaching Volleyball ve Volleyball Canada tarafından belgelenen 6v6 5-1'in mantıksal uyarlamalarıdır."
                : "Salon 4v4'ün resmi FIVB düzenlemesi yoktur. Aşağıdaki dizilimler kolej intramurals (ABD), FFVb / Volleyball Canada eğitsel kılavuzları ve plaj literatüründen (Brandon Joyner, Better at Beach) gelmektedir."}
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
                <div style={S.labelTeal}>Artıları</div>
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
                <div style={{ ...S.label, color: 'var(--ink)', opacity: 0.5 }}>Eksileri</div>
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
        <h2 style={S.section}>Pasörün karşılamadaki rolü — {teamSize}v{teamSize}</h2>
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
                  <strong style={{ color: 'var(--teal)' }}>Not: </strong>{role.note}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={S.section}>Libero — uzmanlaşmış karşılama</h2>
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
        <h2 style={S.section}>Pozisyon almak için servisi okuma</h2>
        <div style={{ border: '2.5px solid var(--ink)', overflow: 'hidden', marginBottom: 12 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--ink)' }}>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Servis tipi</th>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Karşılayıcının uyumu</th>
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
          <div style={S.labelTeal}>Servis atanın temasından önceki ipuçları</div>
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
        <h2 style={S.section}>Yaygın hatalar</h2>
        <div style={{ borderLeft: '5px solid var(--orange)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
          <div style={{ ...S.label, color: 'var(--orange)' }}>Teknik hatalar (tüm formatlar)</div>
          {ERRORS_COMMON.map(([label, text], i) => (
            <div key={i} style={{ fontSize: 13 }}>
              <strong style={{ color: 'var(--ink)' }}>{label}: </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{text}</span>
            </div>
          ))}
        </div>
        <div style={{ borderLeft: '5px solid var(--teal)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ ...S.labelTeal }}>{teamSize}v{teamSize}'ye özgü hatalar</div>
          {errorsSize.map(([label, text], i) => (
            <div key={i} style={{ fontSize: 13 }}>
              <strong style={{ color: 'var(--ink)' }}>{label}: </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{text}</span>
            </div>
          ))}
        </div>
      </section>

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
