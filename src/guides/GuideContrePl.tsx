import GoldenRule from './GoldenRule';
import VideoLink from './VideoLink';
import { S } from './styles';

const TIMING_STEPS = [
  {
    title: 'Patrz na atakującego, nie na piłkę',
    desc: "Obserwuj barki i ramię atakującego, by przewidzieć moment i kierunek smecza.",
  },
  {
    title: 'Wyskakuj PO atakującym',
    desc: 'Poczekaj, aż atakujący wejdzie w fazę odbicia. Jeśli wyskoczysz w tym samym czasie lub wcześniej, opadniesz zbyt szybko.',
  },
  {
    title: 'Idealne opóźnienie: 0,2 do 0,3 sekundy',
    desc: `W myślach licz "RAZ", gdy atakujący wyskakuje, potem wyskocz natychmiast po. Ten ułamek sekundy jest kluczowy.`,
  },
  {
    title: 'Przenieś ramiona nad siatkę',
    desc: 'W szczycie wyskoku popchnij dłonie i ramiona do przodu i w dół — nie tylko do góry.',
  },
];

const CONTRE_TYPES = [
  {
    name: 'Blok ofensywny',
    objectif: "Odeślij piłkę bezpośrednio na boisko przeciwnika",
    points: [
      ['Pozycja', 'Dłonie szeroko rozstawione, palce wyciągnięte i rozłożone'],
      ['Akcja', 'Przenieś ramiona jak najdalej nad siatkę, ramiona wyciągnięte do przodu'],
      ['Cel', "Usztywnij nadgarstki, by skierować piłkę w dół na boisko przeciwnika"],
      ['Kiedy', 'Gdy jesteś dobrze ustawiony i odczytałeś atak'],
    ],
  },
  {
    name: 'Blok kryjący',
    objectif: 'Zwolnij piłkę, by twoja obrona mogła zareagować',
    points: [
      ['Pozycja', 'Dłonie blisko siebie, wewnętrzne strony skierowane w twoją stronę'],
      ['Akcja', 'Absorbuj uderzenie zamiast pchać'],
      ['Rezultat', 'Piłka miękko opada na twoje boisko do rozegrania'],
      ['Kiedy', 'Gdy jesteś spóźniony lub źle ustawiony'],
    ],
  },
  {
    name: 'Blok strefowy',
    objectif: 'Odebranie konkretnych stref ataku',
    points: [
      ['Pozycja', 'Blokuj konkretną strefę (linia lub skos)'],
      ['Akcja', 'Skieruj dłonie w stronę strefy, którą chcesz chronić'],
      ['Taktyka', 'Zmuś atakującego do uderzenia w strefę, gdzie twoi obrońcy są gotowi'],
      ['Kiedy', 'W porozumieniu z obroną drugiej linii'],
    ],
  },
  {
    name: 'Blok 2- lub 3-osobowy (blok zbiorowy)',
    objectif: 'Stwórz nieprzeniknioną ścianę',
    points: [
      ['Koordynacja', 'Wyskakujcie razem w tym samym momencie'],
      ['Ustawienie', 'Blokujący po bokach ustawiają się względem środkowego'],
      ['Dłonie', 'Połącz dłonie z partnerami (bez luki)'],
      ['Komunikacja', 'Jeden blokujący woła "linia" lub "skos" by skoordynować'],
    ],
  },
];

const TIMING_TIPS = [
  ['Ćwiczenie "raz-dwa"', `Na treningu mów "RAZ", gdy atakujący wyskakuje, "DWA", gdy ty wyskakujesz. To tworzy potrzebne opóźnienie.`],
  ['Obserwuj barki', "Ustawienie barków atakującego wskazuje kierunek smecza."],
  ['Odczytaj wystawę', 'Wysoka wystawa = więcej czasu. Wystawa blisko siatki = szybka reakcja.'],
  ['Ustaw się wcześnie', 'Lepiej być ustawionym i czekać niż biec w ostatniej chwili.'],
  ['Pracuj nad wyskokiem', 'Im wyżej wyskakujesz, tym większy margines błędu masz przy timingu.'],
];

const SAUT_POSITION = [
  'Stopy rozstawione na szerokość barków',
  'Ciężar na śródstopiach',
  'Kolana lekko ugięte',
  'Ramiona po bokach lub lekko z przodu',
  'Pozycja około 30–50 cm od siatki',
];

const SAUT_IMPULSION = [
  ['Krok dostawny', 'Jeśli musisz się przemieścić, użyj szybkiego kroku dostawnego'],
  ['Ugięcie', 'Ugnij szybko nogi (nie idź zbyt nisko)'],
  ['Zamach ramion', 'Zamach ramion w górę eksplozywnie'],
  ['Pełne wyprostowanie', 'Wyprostuj nogi w pełni, by zmaksymalizować wysokość'],
];

const SAUT_EN_LAIR = [
  'Trzymaj ramiona wyciągnięte i zwarte',
  'Dłonie szeroko rozstawione, palce wyciągnięte i rozłożone',
  'Przenieś ramiona nad siatkę (bez dotknięcia siatki!)',
  'Napnij brzuch, by zachować stabilność',
];

const ERREURS = [
  ['Zbyt wczesny wyskok', 'Opadasz w momencie, gdy atakujący smeczuje — czekaj dłużej!'],
  ['Patrzenie na piłkę', 'Tracisz informację o atakującym — patrz na gracza!'],
  ['Miękkie dłonie', 'Piłka odbija się z powrotem na twoje boisko — usztywnij i napnij palce!'],
  ['Wyskok do przodu', 'Dotykasz siatki — wyskakuj pionowo!'],
  ['Zbyt wczesne opuszczanie ramion', 'Trzymaj ramiona w górze do lądowania.'],
];

const EXERCICES = [
  {
    title: 'Timing z partnerem',
    desc: 'Partner udaje atak (bez piłki). Pracujesz tylko nad timingiem wyskoku. Powtórz 20 razy.',
  },
  {
    title: 'Blok przeciwko atakowi z miejsca',
    desc: 'Atakujący smeczuje z ustalonej pozycji. Skup się na timingu i technice. Stopniowo zwiększaj prędkość.',
  },
  {
    title: 'Czytanie barków',
    desc: 'Atakujący zmienia kierunki smeczów (linia/skos). Próbuj odczytywać jego barki, by przewidzieć kierunek.',
  },
  {
    title: 'Praca nóg + blok',
    desc: 'Pracuj nad szybkim ruchem bocznym, po którym następuje blok. Symuluje sytuacje meczowe.',
  },
];

const CONSEILS_PRO = [
  ['Cierpliwość', 'Blok jest jedną z najtrudniejszych technik. Bądź cierpliwy wobec siebie.'],
  ['Powtarzalność', 'Pamięć mięśniowa budowana jest setkami powtórzeń.'],
  ['Wideo', 'Nagrywaj się, by analizować swój timing i technikę.'],
  ['Obserwuj zawodowców', 'Patrz, jak zawodowcy czytają grę i wyczuwają moment wyskoku.'],
  ['Zacznij od prostych', 'Opanuj blok przeciwko wolnym atakom, zanim przejdziesz do szybkich ataków.'],
];

export default function GuideContrePl() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

      {/* Règle d'or */}
      <GoldenRule mantra="PIŁKA → ROZGRYWAJĄCY → PIŁKA → BARK ATAKUJĄCEGO → WYSKOK → PRZENIESIENIE NAD SIATKĘ">
        Przy regularnym treningu i szczególnej uwadze na timing znacznie poprawisz swoje bloki. Dobrze wyczuty blok ze średnim wyskokiem jest lepszy niż bardzo wysoki, ale źle wyczuty wyskok.
      </GoldenRule>

      {/* Fondamentaux */}
      <section>
        <h2 style={S.section}>Fundamenty bloku</h2>
        <div style={S.card}>
          <p style={{ fontSize: 14, color: 'var(--ink)', opacity: 0.85, margin: 0, lineHeight: 1.6 }}>
            Blok jest kluczowym ruchem defensywnym, który może stać się bronią ofensywną.
            Klucz leży w <strong style={{ color: 'var(--orange)' }}>idealnym timingu</strong> i dobrym czytaniu gry.
          </p>
        </div>
      </section>

      {/* Timing */}
      <section>
        <h2 style={S.section}>Timing: klucz do sukcesu</h2>
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
        <h2 style={S.section}>Różne typy bloków</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {CONTRE_TYPES.map((type, i) => (
            <div key={i} style={S.card}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 4 }}>{i + 1}. {type.name}</div>
              <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.1em', marginBottom: 10 }}>
                <span style={{ color: 'var(--ink)', opacity: 0.5, textTransform: 'uppercase' }}>Cel: </span>
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
        <h2 style={S.section}>Wskazówki poprawiające timing</h2>
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
        <h2 style={S.section}>Sekwencja wzrokowa elity</h2>
        <div style={{ ...S.card, border: '2.5px solid var(--orange)', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.8, margin: 0 }}>Najlepsi blokujący nie patrzą na piłkę — śledzą precyzyjną sekwencję:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
            {['PIŁKA', 'ROZGRYWAJĄCY', 'PIŁKA', "BARK ATAKUJĄCEGO"].map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ background: 'var(--orange)', color: '#fff', fontFamily: '"Bungee", sans-serif', fontSize: 10, padding: '4px 10px', letterSpacing: '0.08em' }}>{step}</span>
                {i < 3 && <span style={{ color: 'var(--orange)', fontWeight: 700 }}>→</span>}
              </div>
            ))}
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              ['1. PIŁKA', 'Zobacz piłkę lecącą do rozgrywającego'],
              ['2. ROZGRYWAJĄCY', "Odczytaj dłonie rozgrywającego w momencie kontaktu — kierunek wystawy"],
              ['3. PIŁKA', 'Krótko prześledź piłkę by potwierdzić kierunek'],
              ['4. BARK ATAKUJĄCEGO', "Zafiksuj się na barku atakującego — zdradza kierunek smecza przed kontaktem"],
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
        <h2 style={S.section}>Precyzyjny timing według typu ataku</h2>
        <div style={{ border: '2.5px solid var(--ink)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--ink)' }}>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Typ ataku</th>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Timing wyskoku blokującego</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Quick / 1 tempo (środkowy)', 'RAZEM lub odrobinę przed atakującym (commit block)'],
                ['Shoot / 2 tempo na skrzydle', '~0,1s po atakującym'],
                ['Wysoka piłka na skrzydle (3 tempo)', '0,2–0,3s po atakującym'],
                ['Wystawa blisko siatki', 'RAZEM z atakującym'],
                ['Wystawa odsunięta od siatki', '~0,5s po, lub nie wyskakuj'],
                ['Slide (środkowy)', 'RAZEM lub tuż po — śledź bocznie'],
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
            <div style={S.label}>Read blocking — zalecany</div>
            <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.8, margin: '0 0 10px 0', lineHeight: 1.6 }}>Blokujący czeka na decyzję rozgrywającego, odczytuje piłkę i atakującego, dopiero potem się przemieszcza. Pozycja "bunch read" (wszyscy blisko środka, potem eksplozja w stronę anteny).</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['Stabilny i obecny przy większości wystaw', 'Oszczędza biodra i kolana', 'Odpowiedni dla wszystkich amatorskich poziomów'].map((pt, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                  <span style={S.bullet}>▸</span>
                  <span style={{ color: 'var(--ink)', opacity: 0.85 }}>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={S.card}>
            <div style={{ ...S.labelTeal, color: 'var(--ink)', opacity: 0.6 }}>Commit blocking — zaawansowany/zawodowy</div>
            <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: '0 0 10px 0', lineHeight: 1.6 }}>Środkowy decyduje PRZED wypuszczeniem piłki przez rozgrywającego, by wyskoczyć z quickiem. Wyłącza szybki atak przeciwnika, ale jeśli rozgrywający wystawi gdzie indziej, środkowy całkowicie wypada z gry.</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['Skuteczny przeciwko dominującym środkowym', 'Wysokie ryzyko, gdy rozgrywający się dostosowuje', 'Zarezerwowany dla graczy z doskonałym czytaniem'].map((pt, i) => (
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
        <h2 style={S.section}>Technika wyskoku do bloku</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {([
            { title: 'Pozycja wyjściowa', items: SAUT_POSITION.map(p => ({ text: p })) },
            { title: 'Odbicie', items: SAUT_IMPULSION.map(([l, t]) => ({ label: l, text: t })) },
            { title: 'W powietrzu', items: SAUT_EN_LAIR.map(p => ({ text: p })) },
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
        <h2 style={S.section}>Częste błędy do uniknięcia</h2>
        <div style={{ borderLeft: '5px solid var(--orange)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ ...S.label, color: 'var(--orange)' }}>Częste błędy</div>
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
        <h2 style={S.section}>Ćwiczenia treningowe</h2>
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
        <h2 style={S.section}>Wskazówki zawodowców</h2>
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
        <h2 style={S.section}>Materiały wideo</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { title: 'Nauka blokowania (Sikana)', url: 'https://www.youtube.com/watch?v=hJKueZn-tNQ' },
            { title: 'Blok w siatkówce (CEPSUM)', url: 'https://www.youtube.com/watch?v=_MchJmDMn0E' },
            { title: 'Ćwiczenie: wyskok do bloku', url: 'https://www.youtube.com/watch?v=GDS8PoWxO6Q' },
            { title: 'Ćwiczenie: blokowanie ataku', url: 'https://www.youtube.com/watch?v=S6TcodMWFz4' },
          ].map((v, i) => (
            <VideoLink key={i} title={v.title} url={v.url} />
          ))}
        </div>
      </section>

    </div>
  );
}
