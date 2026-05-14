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
    name: 'Zagrywka dolna',
    level: 'Beginner',
    tagline: 'dolna — wahadłowy zamach poniżej pasa',
    description: "Wahadłowy ruch ramienia uderzający piłkę poniżej pasa. Legalna na wszystkich poziomach, polecana początkującym lub w przypadku kontuzji barku. Praktycznie niespotykana powyżej poziomu regionalnego seniorów.",
    biomechanics: [
      'Krótki łańcuch kinematyczny: biodra → bark → ramię → dłoń',
      'Ruch wahadłowy bez rotacji tułowia',
      'Przeniesienie ciężaru: noga zakroczna → noga wykroczna',
      'Kontakt: nasada dłoni lub zaciśnięta pięść poniżej środka piłki',
    ],
    steps: [
      'Lewa noga wykroczna, ciężar na nodze zakrocznej',
      "Lewa ręka trzyma piłkę na wysokości biodra, w linii z ramieniem uderzającym",
      'Prawe ramię odciągnięte do tyłu, otwarta dłoń lub zaciśnięta pięść',
      'Wypuść piłkę tuż przed uderzeniem — nie podrzucaj jej',
      "Zamach do przodu, uderzenie poniżej środka piłki",
      'Ramię kończy ruch wskazując cel, ciężar przeniesiony na nogę wykroczną',
    ],
    errors: [
      ['Piłka trzymana zbyt nisko lub poza linią', "Trzymaj piłkę na wysokości biodra, w linii z ramieniem uderzającym"],
      ['Uderzenie palcami', 'Używaj nasady dłoni — szerszej i bardziej stabilnej powierzchni'],
      ['Zbyt wysokie podrzucanie', 'Po prostu wypuść piłkę, nie podrzucaj jej do góry'],
      ['Luźny nadgarstek', 'Usztywnij ramię w momencie kontaktu dla czystego uderzenia'],
    ],
    exercises: [
      'Kręgle-obręcze: celuj w strefy 4 m od siatki',
      "10 zagrywek z 4 m, potem cofaj się o 1 m co serię aż do linii końcowej",
      'Cele 4x3 m na podłodze — cel: 50% trafień',
    ],
    videos: [
      { title: 'Zagrywka dolna + zagrywka tenisowa (Sikana)', url: 'https://www.youtube.com/watch?v=xl6twpn3Qs8' },
      { title: 'Jak zagrywać sposobem dolnym', url: 'https://www.youtube.com/watch?v=MWna318SrKo' },
    ],
  },
  {
    id: 'float',
    name: 'Zagrywka tenisowa float',
    level: 'Intermediate',
    tagline: 'float w miejscu — domyślna zagrywka 90% amatorów',
    description: `Zagrywka bez rotacji, dająca nieprzewidywalny tor lotu (efekt "knuckleball"). Przy krytycznej prędkości (~12-13 m/s) asymetryczne wiry tworzą losowe boczne siły nośne. To zagrywka, którą trzeba opanować w pierwszej kolejności.`,
    biomechanics: [
      'Pełny łańcuch kinematyczny: nogi → biodra → tułów → bark → łokieć → dłoń',
      `Pozycja "łuk i strzała": łokieć wysoko ponad barkiem, dłoń za uchem`,
      "Nadgarstek ZABLOKOWANY i sztywny — bezwzględny warunek efektu float",
      'Kontakt: nasada dłoni w środku piłki',
      `"Punch and freeze": KRÓTKI follow-through — dłoń zatrzymuje się natychmiast po kontakcie`,
    ],
    steps: [
      "Ciało pod kątem 45° do siatki, stopy rozstawione na szerokość barków",
      "Lewa ręka wyciągnięta przed bark, piłka na wysokości głowy",
      `Bardzo krótki podrzut: "ustaw" piłkę 30-50 cm nad barkiem — piłka nie rotuje`,
      'Lewa noga robi krok w kierunku celu tuż po umieszczeniu piłki',
      'Pełne wyprostowanie ramienia w momencie kontaktu, dłoń sztywna i płaska',
      'FREEZE: natychmiastowe zatrzymanie ruchu po kontakcie — bez follow-through ramienia',
    ],
    errors: [
      ['Wydłużony follow-through ramienia', "Przyczyna porażki nr 1: follow-through dodaje rotację, która zabija float — zatrzymaj się natychmiast"],
      ['Zbyt wysoki podrzut', 'Piłka opada w siatkę — podrzucaj krótko, tylko 30-50 cm'],
      ['Rotujący podrzut', 'Wywołuje rotację piłki — ustaw piłkę, nie podrzucaj jej'],
      ['Kontakt samą wewnętrzną stroną dłoni', 'Używaj nasady dłoni (dolnej części dłoni) dla płaskiej powierzchni'],
    ],
    exercises: [
      'Toss & Drop: zaznacz punkt na podłodze, podrzucaj 20 razy bez uderzania — cel 18/20 w punkcie',
      `"Punch and freeze" przy ścianie z 3 m: pracuj nad natychmiastowym zatrzymaniem ruchu`,
      '5 kolejnych zagrywek bez rotacji potwierdzonych wzrokowo przez partnera',
    ],
    videos: [
      { title: 'Zagrywka float w 4 minuty', url: 'https://www.youtube.com/watch?v=0z2_R2cMU7g' },
      { title: 'Poprawa zagrywki float', url: 'https://www.youtube.com/watch?v=mdEXHKNjfQ8' },
      { title: 'Zagrywka: float + tenisowa (CEPSUM)', url: 'https://www.youtube.com/watch?v=_e00ogqoNZw' },
    ],
  },
  {
    id: 'jumpfloat',
    name: 'Zagrywka jump float',
    level: 'Advanced',
    tagline: 'jump float — standard elitarnych zawodniczek',
    description: "Float z krótkim doskokiem i wyskokiem. Zyskuje wysokość kontaktu, prędkość i bardziej stromy kąt opadania. Stała się standardem wśród elitarnych zawodniczek (86% zagrywek w zawodowej siatkówce kobiet według ostatnich badań). Mniej ryzykowna niż jump topspin, jednocześnie bardziej dokuczliwa niż float w miejscu.",
    biomechanics: [
      "Krótki doskok (2 do 4 kroków)",
      'Ramiona w pozycji łuku i strzały podczas wyskoku — inaczej niż w smeczu, gdzie ramiona napędzają',
      "Doskok zapewnia prędkość piłki, a nie samo ramię",
      'Kontakt w najwyższym punkcie, lekko przed głową',
      'Zablokowany nadgarstek + freeze identyczny jak we floacie w miejscu',
    ],
    steps: [
      'Pozycja 2-3 m za linią, piłka w lewej ręce',
      "Krok 1 (prawa) jako przygotowanie, ramiona rozluźnione",
      'Krok 2 (lewa): podrzuć piłkę około 1,5 m, bez rotacji',
      'Krok 3 + doskok: odbicie z obu nóg za linią — ramiona unoszą się do pozycji łuku i strzały',
      "Wyskok pionowy lekko do przodu, ciało napięte",
      'Uderzenie z wyprostowanym ramieniem, nasadą dłoni w środek piłki',
      'FREEZE natychmiast — lądowanie wewnątrz boiska',
    ],
    errors: [
      ['Zbyt wysoki podrzut', 'Odruch jump spina — utrzymuj krótki podrzut jak we floacie w miejscu'],
      ["Ramiona kołyszące jak w ataku", 'Zamienia się w smecz z rotacją — utrzymuj pozycję łuku i strzały'],
      ['Wydłużony follow-through', 'Tak samo jak we floacie w miejscu: freeze jest obowiązkowy'],
      ['Przekroczenie linii przy odbiciu', "Upewnij się, że odbicie następuje za linią końcową"],
    ],
    exercises: [
      "Opanuj float w miejscu (solidny freeze) przed dodaniem doskoku",
      'Sam doskok bez uderzania: pracuj nad stabilnym, niskim podrzutem',
      'Jump float przy kontrolowanej prędkości: powtarzalność przed mocą',
    ],
    videos: [
      { title: "Zagrywka jump float — INF'AUX ENTRAÎNEURS (Bretagne)", url: 'https://www.youtube.com/watch?v=P5xCgV7nfO8' },
      { title: 'Jump float + smecz (Volleyball Canada)', url: 'https://www.youtube.com/watch?v=X1Mq9K90FCk' },
    ],
  },
  {
    id: 'jumpspin',
    name: 'Zagrywka jump topspin',
    level: 'Competition',
    tagline: 'jump serve — smecz zza linii',
    description: `"Smecz zza linii": piłka uderzana z pełną mocą z rotacją topspin (80-100 km/h w silnych klubach). Najwyższy potencjał asa, ale też najwyższy procent błędów. Zarezerwowana dla tych, którzy zainwestowali 1000+ powtórzeń na treningach.`,
    biomechanics: [
      "Doskok 3-4 krokowy identyczny jak przy ataku z drugiej linii",
      'Wysoki podrzut (1-1,5 m przed sobą) z lekką wymuszoną rotacją do przodu',
      'Rotacja sekwencyjna: biodra → tułów → bark → łokieć → nadgarstek',
      'Strefa kontaktu na godzinie 10-11 na piłce',
      'Pełne strzepnięcie nadgarstka dla topspina (~30 rotacji/s na poziomie elitarnym)',
      'Pełny follow-through — przeciwieństwo floata',
    ],
    steps: [
      'Pozycja 3-4 m za linią, piłka w ręce uderzającej',
      'Krok 1 (prawa) + wysoki podrzut z lekko wymuszoną rotacją topspin',
      'Krok 2 (lewa): przyspieszenie',
      "Krok 3 (prawa): długi krok mocy, środek ciężkości opada",
      "Krok 4 (lewa): odbicie, ramiona zamachem do góry",
      'Eksplozywny wyskok pionowo-do przodu',
      'Uderzenie w szczycie: dłoń przechodzi nad piłką (godzina 10), wewnętrzna strona dłoni, potem palce rolują się nad piłką',
      'Pełne strzepnięcie nadgarstka + follow-through — lądowanie 1-2 m wewnątrz boiska',
    ],
    errors: [
      ['Zbyt niski lub do tyłu podrzut', 'Przyczyna nr 1 trafiania w siatkę — podrzut musi być wysoki i do przodu'],
      ['Podrzut zbyt daleko do przodu', 'Przekroczenie linii — przestrzegaj granic strefy zagrywki'],
      ['Brak strzepnięcia nadgarstka', 'Piłka leci długo bez rotacji do dołu'],
      ['Używanie na meczu bez przygotowania', "Najpierw 1000 powtórzeń na treningu — złota zasada"],
    ],
    exercises: [
      "Złota zasada: 1000 powtórzeń na treningu przed użyciem w meczu",
      'Jump spin "kontrola": niższy podrzut, zmniejszona prędkość, celuj w precyzyjne strefy',
      'Nagrywaj swój podrzut: 80% błędów wynika z umiejscowienia podrzutu',
    ],
    videos: [
      { title: 'Potężny jump topspin + zagrywka float (Sikana)', url: 'https://www.youtube.com/watch?v=50TUVvPLKr8' },
    ],
  },
];

const ZONES_TABLE: [string, string][] = [
  ['Strefa 1 — prawy tył', 'Blokuje wyjście rozgrywającego w systemie 5-1'],
  ['Strefa 2 — krótka prawa przednia', 'Łamie wejście prawej strony, wyklucza libero'],
  ['Strefa 3 — krótka środkowa przednia', 'Blokuje środkowego, łamie szybkie ataki'],
  ['Strefa 4 — krótka lewa przednia', "Zmusza głównego atakującego do przyjęcia ORAZ ataku"],
  ['Strefa 5 — głęboka lewa tylna', "Długa po przekątnej, wysoki procent błędów"],
  ['Strefa 6 — głęboka środkowa tylna', 'Zagrywaj długo przeciwko niższym rozgrywającym'],
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

export default function GuideServicePl() {
  const [activeId, setActiveId] = useState('cuillere');
  const current = SERVICE_TYPES.find(t => t.id === activeId)!;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>

      {/* Golden rule */}
      <GoldenRule>
        80% błędów zagrywki wynika z podrzutu. Ustabilizuj podrzut w pierwszej kolejności, zanim zaczniesz gonić za mocą.
      </GoldenRule>

      {/* Service type selector */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <h2 style={S.sectionTitle}>RODZAJE ZAGRYWEK</h2>
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
            <div style={S.labelTeal}>KLUCZOWA BIOMECHANIKA</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {current.biomechanics.map((b, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13.5 }}>
                  <span style={{ fontFamily: '"Bungee", sans-serif', color: 'var(--teal)', flexShrink: 0 }}>▸</span>{b}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginBottom: 18 }}>
            <div style={{ ...S.label, opacity: 0.7 }}>KROKI WYKONANIA (PRAWORĘCZNI)</div>
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
              <div style={S.labelOrange}>✗ CZĘSTE BŁĘDY</div>
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
              <div style={S.labelTeal}>★ ĆWICZENIA</div>
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
            <div style={{ ...S.label, opacity: 0.6 }}>FILMY — {current.name.toUpperCase()}</div>
            {current.videos.map((v, i) => (
              <VideoLink key={i} title={v.title} url={v.url} />
            ))}
          </div>
        )}
      </section>

      {/* Zones */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 style={S.sectionTitle}>STREFY CELOWANIA I TAKTYKA</h2>
        <div style={{ border: '3px solid var(--ink)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--ink)', color: 'var(--cream)' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.12em' }}>STREFA PRZECIWNIKA</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.12em' }}>EFEKT TAKTYCZNY</th>
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
            ['Szwy', "Celowanie w przestrzeń między dwoma przyjmującymi jest skuteczniejsze niż celowanie w gracza — komunikacja przeciwnika jest wystawiona na próbę."],
            ['Naprzemiennie krótko/długo', "Uniemożliwia rozgrywającemu wycofanie się we właściwym momencie. Krótki float (strefy 2-3-4) za linią ataku jest szczególnie dokuczliwy."],
            ['Wskaźnik FBSO%', "Zagrywka, która zmniejsza First Ball Side Out przeciwnika z 70% do 45% bez asa, jest bardzo skuteczną zagrywką."],
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
          <div style={{ ...S.label, marginBottom: 16 }}>★ HIERARCHIA NAUKI</div>
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
            Opanuj każdy poziom przed przejściem do kolejnego. <strong>Powtarzalność przed mocą.</strong>
          </p>
        </div>
      </section>

    </div>
  );
}
