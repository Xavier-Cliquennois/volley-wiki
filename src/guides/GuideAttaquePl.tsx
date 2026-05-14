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
  ['Inicjacja', 'Czytanie wystawy i decyzja o doskoku'],
  ['Wind-up', 'Początek doskoku'],
  ['Cocking', 'Łokieć ponad barkiem, dłoń za uchem — pozycja mocy'],
  ['Akceleracja', 'Rotacja sekwencyjna: biodra → tułów → bark → łokieć → nadgarstek'],
  ['Kontakt + follow-through', 'Strzepnięcie nadgarstka, dłoń "drapie" nad piłką → topspin'],
];

const APPROACH_3 = [
  ['Krok 1 (lewa)', 'Krótki krok kierunkowy, zwrócony w stronę ataku'],
  ['Krok 2 (prawa)', 'Krok mocy — długi i niski, piętą najpierw, obniżenie środka ciężkości'],
  ['Krok 3 (lewa)', 'Krok zamykający — krótki, hamuje przesunięcie poziome i zamienia je na pionowe'],
];

const APPROACH_4 = [
  ['Krok 1 (prawa)', 'Krok obserwacyjny, wolny rytm'],
  ['Krok 2 (lewa)', 'Akceleracja'],
  ['Krok 3 (prawa)', 'Krok mocy — najważniejszy, długi i niski'],
  ['Krok 4 (lewa)', 'Krok zamykający równolegle do siatki'],
];

const TIMING_TABLE: [string, string][] = [
  ['Wysoka piłka (3 tempo)', 'Rozpocznij PÓŹNO — gdy piłka opuszcza ręce rozgrywającego'],
  ['2 tempo (Hut/Go)', 'Rozpocznij, gdy przyjęcie zbliża się do rozgrywającego'],
  ['1 tempo (Quick)', 'Rozpocznij WCZEŚNIE — już w powietrzu, gdy rozgrywający dotyka piłki'],
  ['Slide', 'Rozpocznij w momencie, gdy rozgrywający odbiera przyjęcie'],
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
    name: 'Atak ze strefy 4 (Przyjmujący / OH)',
    position: 'Lewe skrzydło',
    description: `Fundament nauki atakowania. Przyjmujący otrzymuje największą liczbę piłek — to "bezpieczna" opcja rozgrywającego. Doskok pod kątem 45° od lewej strony.`,
    keyPoints: [
      'Doskok 4-krokowy pod kątem ~45° do siatki',
      'Odbicie 30-50 cm od siatki',
      'Wystawa "Hut" (wysokie 3 tempo) lub "Go" (szybkie 2 tempo)',
      'Wyskok PIONOWO — nie w stronę siatki',
      'Kontakt lekko przed barkiem uderzającym',
    ],
    shots: ['Po skosie', 'Po linii', 'Cięte zagranie (ostry kąt <3 m)', 'Kiwka', 'Roll shot (off-speed z topspinem)'],
  },
  {
    id: 'middle',
    name: 'Atak środkowego (Quick / 1 tempo)',
    position: 'Środkowy linii przedniej',
    description: 'Najszybszy atak. Środkowy jest w powietrzu PRZED lub w momencie gdy rozgrywający dotyka piłki. Bardzo niska (30-50 cm) i bardzo krótka wystawa.',
    keyPoints: [
      'Rozpocznij doskok WCZEŚNIE — już w powietrzu w momencie odbicia rozgrywającego',
      'Doskok 2-3 krokowy, ramię już naładowane podczas wznoszenia',
      `Koncepcja "Ghost Middle": nawet jeśli piłka nie dochodzi, biegnij quicka z pełną prędkością by przytrzymać blok przeciwnika → uwalnia przyjmujących`,
      'Kontakt 30-50 cm ponad siatką',
      'Szybka tranzycja: blok → doskok w 1-2 sekundy',
    ],
    shots: ['Quick przed rozgrywającym ("1")', 'Back-1 za rozgrywającym', 'Slide (start z tyłu wzdłuż siatki)', '31/Gap (między rozgrywającym a anteną)'],
  },
  {
    id: 'opposite',
    name: 'Atak ze strefy 2 (Atakujący)',
    position: 'Prawe skrzydło',
    description: 'Atakujący atakuje ze strefy 2. Idealne dla leworęcznych (ramię uderzające po stronie prawej anteny = maksymalne okno). Dla praworęcznych: bardziej wyraźna rotacja tułowia, pozycja dalej od anteny.',
    keyPoints: [
      'Doskok symetryczny do przyjmującego, ale z prawej',
      'Wykończenie kciukiem w dół przy ciętym zagraniu',
      '"Release" — opcja dla rozgrywającego, gdy przyjęcie jest słabe',
      'Atak z drugiej linii z P1 (strefa D), gdy na drugiej linii',
    ],
    shots: ['Po skosie', 'Po linii', 'Pipe/D z drugiej linii', 'Cięte zagranie po skosie do strefy 5'],
  },
  {
    id: 'backrow',
    name: 'Atak z drugiej linii (Pipe)',
    position: 'Środek tylny lub prawy tylny',
    description: 'Atak z tylnej strefy. Odbicie MUSI nastąpić ZA linią 3 m. Pozwala na 4 atakujących przeciwko 3 blokującym.',
    keyPoints: [
      'Odbicie obowiązkowo za linią 3 m (w przeciwnym razie błąd)',
      'Lądowanie w strefie przedniej po legalnym wyskoku = OK',
      'Pipe: z P6, wystawa za quicka (BIC = tuż ponad quickiem)',
      'Strefa D: z P1, często atak awaryjny atakującego',
    ],
    shots: ['Pipe (środek tylny)', 'Strefa D (prawy tył)', 'Strefa A (lewy tył, rzadko)', 'Kiwka na złą wystawę'],
  },
];

const SPECIAL_SHOTS = [
  {
    name: 'Kiwka',
    level: 'Beginner → Intermediate',
    desc: 'IDENTYCZNY doskok do smecza (zamaskowanie jest kluczowe), potem w momencie kontaktu zwolnij ramię i ułóż piłkę pstryknięciem palców. Kierunek: pusta strefa wypatrzona PRZED wyskokiem.',
  },
  {
    name: 'Roll shot / Off-speed z topspinem',
    level: 'Intermediate',
    desc: 'Uderzenie ze zmniejszoną prędkością (~50-70%) z silnym topspinem, by piłka opadała krótko za blokiem. Trudniejsza do odczytania niż kiwka, bo szybsza.',
  },
  {
    name: 'Cięte zagranie / Ostry kąt',
    level: 'Intermediate+',
    desc: 'Ostry kąt do strefy 1 (z 4) lub strefy 5 (z 2). Wykończenie kciukiem w dół, dłoń tnąca bocznie przez piłkę. Uderz w bok piłki, nie w górę.',
  },
  {
    name: 'Tooling / Wipe',
    level: 'Intermediate+',
    desc: 'Celowe wypchnięcie piłki na aut z rąk blokujących. Przy wystawie blisko siatki wyskocz pionowo i wypchnij piłkę bocznie używając zewnętrznej ręki blokującego jako "szyny".',
  },
];

const ERRORS = [
  ['Timing doskoku', 'Za wcześnie: powtórny wyskok bez mocy. Za późno: ramię wyciągnięte do tyłu w momencie kontaktu.'],
  ['Zła kolejność stóp', 'Zawsze kończ na lewo-prawo (praworęczni) — obie stopy niemal jednocześnie.'],
  ['Brak topspinu', 'Płaska dłoń = brak strzepnięcia = piłka leci daleko. "Drapnij" nad piłką.'],
  ['Błąd siatki', 'Wyskok do przodu przy wystawie blisko siatki. Wyskocz PIONOWO, nie do przodu.'],
  ['Błąd drugiej linii', 'Stopa na lub przed linią 3 m przy odbiciu.'],
  ['Lądowanie na jednej nodze', 'Z wyjątkiem slide\'a: lądowanie na obu stopach by chronić kolano (ryzyko ACL).'],
];

const VIDEOS = [
  { title: 'Jak atakować — 3 kroki (Sikana)', url: 'https://www.youtube.com/watch?v=3aQgfk0VtEA' },
  { title: 'Smecz w siatkówce (CEPSUM)', url: 'https://www.youtube.com/watch?v=Gn1Otje3beg' },
  { title: 'Szczegółowy doskok do ataku', url: 'https://www.youtube.com/watch?v=ub4XoCJMUzU' },
  { title: 'Seb\'s Sequence — wszystko o smeczu', url: 'https://www.youtube.com/watch?v=JvxZgViw_os' },
  { title: 'Wyskok do ataku (Sikana)', url: 'https://www.youtube.com/watch?v=6GOHF5cNIKs' },
  { title: 'Ataki plasowane (Sikana)', url: 'https://www.youtube.com/watch?v=sCiu8Mqm1d0' },
];

export default function GuideAttaquePl() {
  const [activeAttack, setActiveAttack] = useState('outside');
  const current = ATTACK_TYPES.find(t => t.id === activeAttack)!;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

      {/* Règle d'or */}
      <GoldenRule mantra="WOLNY DOSKOK → SZYBKO → KROK MOCY → KROK ZAMYKAJĄCY → WYSKOK PIONOWY → RAMIĘ WYCIĄGNIĘTE DO PRZODU → STRZEPNIĘCIE NADGARSTKA">
        Moc pochodzi z pełnego łańcucha kinematycznego, a nie z samego ramienia. Rytmiczny doskok z szybkimi dwoma ostatnimi krokami generuje 70% końcowej mocy.
      </GoldenRule>

      {/* Biomécanique */}
      <section>
        <h2 style={S.section}>5 faz smecza</h2>
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
          <strong style={{ color: 'var(--ink)' }}>Idealny kontakt: </strong>
          <span style={{ color: 'var(--ink)', opacity: 0.7 }}>Lekko przed barkiem uderzającym, nigdy za głową (utrata mocy + ryzyko kontuzji). Odległość od siatki przy odbiciu: minimum 30-50 cm.</span>
        </div>
      </section>

      {/* Approach */}
      <section>
        <h2 style={S.section}>Doskok</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          <div style={S.card}>
            <div style={S.label}>3 kroki — Początkujący</div>
            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, color: 'var(--ink)', opacity: 0.5, marginBottom: 10 }}>Lewa-prawa-lewa (praworęczni)</div>
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
            <div style={S.label}>4 kroki — Standard wyczynowy</div>
            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, color: 'var(--ink)', opacity: 0.5, marginBottom: 10 }}>Prawa-lewa-prawa-lewa (praworęczni)</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {APPROACH_4.map(([label, text], i) => (
                <li key={i} style={{ fontSize: 13 }}>
                  <strong style={{ color: 'var(--ink)' }}>{label}: </strong>
                  <span style={{ color: 'var(--ink)', opacity: 0.75 }}>{text}</span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 10, borderLeft: '3px solid var(--orange)', paddingLeft: 10, fontSize: 12, color: 'var(--orange)', fontFamily: '"DM Mono", monospace' }}>
              Złota zasada: dwa ostatnie kroki są najszybsze — wolno → szybko.
            </div>
          </div>
        </div>
      </section>

      {/* Timing */}
      <section>
        <h2 style={S.section}>Timing według typu wystawy</h2>
        <div style={{ border: '2.5px solid var(--ink)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--ink)' }}>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Typ wystawy</th>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Kiedy rozpocząć doskok</th>
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
        <h2 style={S.section}>Typy ataków według pozycji</h2>
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
              <div style={S.labelTeal}>Punkty kluczowe</div>
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
              <div style={S.label}>Wybór zagrania</div>
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
        <h2 style={S.section}>Zagrania specjalne</h2>
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
        <h2 style={S.section}>Częste błędy</h2>
        <div style={{ borderLeft: '5px solid var(--orange)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ ...S.label, color: 'var(--orange)' }}>Unikaj</div>
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
        <h2 style={S.section}>Materiały wideo</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {VIDEOS.map((v, i) => (
            <VideoLink key={i} title={v.title} url={v.url} />
          ))}
        </div>
      </section>

    </div>
  );
}
