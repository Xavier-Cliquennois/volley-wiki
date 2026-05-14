import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { TeamSize } from '../pages/Positions';
import GoldenRule from './GoldenRule';
import VideoLink from './VideoLink';
import { S } from './styles';

const PLATFORM_TIPS = [
  ['Sweet spot', 'Idealna powierzchnia kontaktu znajduje się 2,5 do 15 cm powyżej nadgarstków.'],
  ['Cup and fold', "Zalecana technika: jedna pięść zaciśnięta, druga dłoń obejmuje ją od góry — kciuki równolegle, skierowane do dołu."],
  ['Kciuki w dół', "Skierowanie kciuków w stronę podłoża obraca przedramiona na zewnątrz i napina platformę."],
  ['Nigdy nie splataj palców', 'NIGDY nie splataj palców przy silnej zagrywce — ryzyko złamania.'],
  ["Kąt wyznacza kierunek", '"Piłka leci tam, gdzie patrzy platforma" — przy głębokim odbiorze: platforma pod kątem 45°; przy krótkim odbiorze: platforma bardziej równolegle do podłogi.'],
];

const STEPS = [
  'Odczytaj zagrywającego: zidentyfikuj typ zagrywki przed kontaktem.',
  "Pozycja gotowa z rozdzielonymi ramionami (NIE złączonymi wcześniej).",
  'Odczytaj tor lotu w momencie, gdy przeciwnik uderza piłkę.',
  'Przemieść się (kroki dostawne), znajdź się ZA piłką zanim ramiona się złączą.',
  'Buduj platformę wcześnie: łącz dłonie, gdy piłka nadlatuje, nie zbyt szybko.',
  'FREEZE: znieruchom się tuż przed kontaktem, ciężar na nodze wykrocznej — utrzymaj przez 1-2 sekundy.',
  'Kontakt w sweet spot, barki skierowane w stronę docelowego rozgrywającego.',
  'Follow-through: biodra i barki idą do przodu w kierunku celu — bez zamachu ramionami.',
];

const DISPLACEMENTS = [
  {
    name: 'Bocznie (kroki dostawne)',
    desc: 'Noga po stronie piłki rusza pierwsza. Kroki dostawne bez krzyżowania, biodra nisko. Znajdź się za piłką, zwróć się w stronę celu, freeze + platforma w ostatnim momencie. Na dłuższe dystanse: kroki krzyżowe, potem obrót.',
  },
  {
    name: 'Do przodu (krótka piłka)',
    desc: 'Przy krótkich zagrywkach lub kiwkach. Często kończy się wykrokiem do przodu: kolano opadające do podłogi, platforma umieszczona przed kolanem wykrocznym.',
  },
  {
    name: 'Do tyłu (drop step)',
    desc: "Obróć stopę, potem kroki dostawne do tyłu. NIGDY nie biegnij tyłem (utrata równowagi). Jeśli jest za późno na cofnięcie: obróć się i utwórz platformę z boku.",
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
      name: 'System W — 5 przyjmujących',
      level: 'Początkujący',
      desc: '3 graczy na linii przedniej, 2 na drugiej — wszyscy oprócz rozgrywającego biorą udział. Historyczny układ, który dał nazwę "formacji W" (FIVB, USAV IMPACT).',
      pros: ['Zmniejszone strefy na gracza (~1,8 m tor)', 'Mała wymagana komunikacja', 'Idealny dla szkółki siatkarskiej i U13-U15'],
      cons: ['Wiele stref nakładających się między 5 graczami', 'Słabi przyjmujący zmuszeni do udziału', 'Dezorganizuje atakujących (3 graczy linii przedniej w przyjęciu)'],
    },
    {
      name: 'System U — 3 przyjmujących',
      level: 'Standard nowoczesny',
      desc: 'Libero w strefie 6 (główny cel zagrywających), skrzydłowi w strefach 5 i 1. 3 najlepszych przyjmujących bierze każdą piłkę, wszyscy atakujący z linii przedniej wychodzą.',
      pros: ['Komunikacja uproszczona do 3 graczy', '3 najlepszych przyjmujących pokrywa wszystko', 'Atakujący z linii przedniej wolni do doskoku'],
      cons: ['Szersze strefy boczne do pokrycia (~3 m na gracza)', 'Wymaga libero na wysokim poziomie', 'Wrażliwy na krótkie zagrywki w narożniki'],
      recommended: true,
    },
    {
      name: 'Przyjęcie 2-osobowe — libero + przyjmujący',
      level: 'Elita',
      desc: 'Tylko 2 przyjmujących (libero + jeden wybrany przyjmujący) pokrywa całą szerokość. Stosowane na najwyższym poziomie, by uwolnić drugiego przyjmującego i zachować jego świeżość do ataku bez zmęczenia przyjęciem.',
      pros: ['Wszyscy atakujący dostępni do tranzycji ofensywnej', 'Lepszy blok/atak, bo atakujący nie są zmęczeni przyjęciem', 'System preferowany przez zawodowe zespoły (Polska, Francja, Włochy)'],
      cons: ['Wymaga 2 bardzo wysportowanych przyjmujących (~4,5 m toru każdy)', 'Brak marginesu błędu — błędnie odczytana zagrywka = punkt przeciwnika', 'Niemożliwy do użycia bez libero na poziomie międzynarodowym'],
    },
  ],
  5: [
    {
      name: 'Przyjęcie 3-osobowe — układ 2F-3B',
      level: 'Zalecane',
      desc: '3 graczy z linii tylnej (P5, P6, P1) przyjmuje. Rozgrywający w P1 wychodzi z przyjęcia i penetruje w momencie, gdy zagrywający dotyka piłki, tak jak w 5-1 w 6v6. 2 graczy z linii przedniej (P4, P3) są wolni do doskoku.',
      pros: ['Układ najbliższy 5-1 w 6v6 (pedagogicznie idealny)', 'Dobra tranzycja przyjęcie → atak', '2 atakujących z linii przedniej + pipe z drugiej linii możliwy'],
      cons: ['3 przyjmujących na 9 m (~3 m na gracza)', 'Rozgrywający musi szybko czytać i zdecydować o penetracji w < 1 sekundę', 'Luka w P1 jeśli rozgrywający odchodzi za wcześnie'],
      recommended: true,
    },
    {
      name: 'Przyjęcie 4-osobowe — układ 3F-2B',
      level: 'Standard',
      desc: '2 graczy z linii tylnej (P5, P1) + 2 graczy z linii przedniej (zwykle P4 i P3 — rozgrywający w P2 wychodzi) przyjmuje. Rozgrywający stoi w celu: brak penetracji, natychmiastowa wystawa.',
      pros: ['Zmniejszone strefy (~2,25 m na gracza)', 'Idealny dla zespołów mieszanych lub początkujących', 'Rozgrywający już w celu — brak tranzycji'],
      cons: ['Tylko 2 atakujących dostępnych z przodu (P4 + P3 lub P4 + środkowy)', 'Gracze z linii przedniej, którzy przyjmują, muszą potem biec do doskoku', 'Blok 2-osobowy trudny, bo rozgrywający idzie do siatki'],
    },
    {
      name: 'Przyjęcie pentagonem — 4 lub 5 graczy',
      level: 'Początkujący / rekreacyjny',
      desc: '5 przyjmujących (odpowiednik W z 5 graczami). 1 gracz na środku przy siatce (często dedykowany rozgrywający), 2 skrzydłowych w środku, 2 graczy z linii tylnej w głębokiej strefie. Wszyscy uczestniczą, chyba że gracz w środku jest dedykowanym rozgrywającym.',
      pros: ['Równomierne pokrycie boiska', 'Bardzo niskie wymagania techniczne', 'Odpowiedni do treningów wprowadzających'],
      cons: ['Wiele nakładań przy 5 przyjmujących', 'Żaden atakujący nie jest wolny', 'Nieskuteczny gdy tylko poziom rośnie'],
    },
  ],
  4: [
    {
      name: 'Diament (3 przyjmujących)',
      level: 'Standard 4v4',
      desc: 'Rozgrywający na środku przy siatce (P3, wychodzi z przyjęcia). 2 skrzydłowych (P4, P2) w środku boiska + samotny gracz z linii tylnej (P1) w głębokiej strefie przyjmują. Najczęstsza formacja w halowym 4v4 (intramuralne ligi uczelniane).',
      pros: ['Rozgrywający już w celu — brak penetracji', '3 jasne i symetryczne strefy', 'Idealny dla rozgrywek wewnątrzuczelnianych, gry rekreacyjnej, plażówki 4v4'],
      cons: ['Pokrywanie 9 m szerokości przez 3 = ~3 m na gracza', 'Samotny gracz z linii tylnej musi bronić całej głębokiej strefy po przyjęciu', 'Tylko 2 atakujących z przodu'],
      recommended: true,
    },
    {
      name: 'Linia 3-1 (3 przyjmujących)',
      level: 'Średniozaawansowany',
      desc: 'Jeden rozgrywający w P1 (linia tylna), który penetruje w momencie kontaktu zagrywki przeciwnika w stronę strefy 2. 3 atakujących z linii przedniej (P4, P3, P2) przyjmuje. Uproszczony odpowiednik 5-1 w 6v6.',
      pros: ['3 atakujących z przodu przez cały czas', 'Pożyteczna pedagogika do przygotowania 5-1 w 6v6', 'Rozgrywający może też atakować po wystawie'],
      cons: ['Wymaga bardzo czystego przyjęcia (penetracja nie wybacza)', 'Luka w P1 jeśli rozgrywający odchodzi przed obronieniem piłki', 'Każdy atakujący musi umieć przyjmować'],
    },
    {
      name: 'Box 2-2 (4 przyjmujących)',
      level: 'Początkujący',
      desc: '2 graczy z linii przedniej (P4, P2) + 2 graczy z linii tylnej (P5, P1), bez dedykowanego rozgrywającego przy siatce. Najlepiej ustawiony gracz wystawia drugą piłkę. Typowe dla sesji wprowadzających lub U11-U13.',
      pros: ['Pokrywa całe boisko (4 strefy po 2,25 m)', 'Brak wymagań technicznych wobec rozgrywającego', 'Każdy przyjmuje — bardzo edukacyjne'],
      cons: ['Brak dedykowanego rozgrywającego — losowa wystawa', 'Żaden atakujący nie jest wolny do doskoku', 'Nieskuteczne gdy tylko poziom rośnie'],
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
      title: 'Rozgrywający z LINII TYLNEJ (P1 / P6 / P5) — rotacje P1, P6, P5 systemu 5-1',
      bullets: [
        'Wychodzi z przyjęcia: żadna piłka nie jest do niego kierowana.',
        'Zaczyna w specjalnej pozycji (np. P1: ~7,5 m od siatki, 1 m od linii bocznej), schowany za innym graczem (stack).',
        'Penetruje w stronę celu (między Z2 i Z3, ~1 m od siatki, 3 m na prawo od środka) W MOMENCIE GDY PRZECIWNIK DOTYKA PIŁKI ZAGRYWKĄ — nie wcześniej (błąd overlap).',
        'P1: najkrótsza penetracja; P6: penetracja centralna; P5: najdłuższa penetracja (po przekątnej).',
        '3 atakujących z przodu dostępnych (przyjmujący + środkowy + atakujący) + ataki z drugiej linii.',
      ],
    },
    {
      title: 'Rozgrywający z LINII PRZEDNIEJ (P2 / P3 / P4) — rotacje P2, P3, P4 systemu 5-1',
      bullets: [
        'Wychodzi z przyjęcia: jest już blisko celu.',
        'W P2: już w celu — staje się też blokującym po linii przeciwko przyjmującemu rywala z Z4 (podwójne obciążenie defensywne).',
        'W P3: boczne przesunięcie w stronę celu natychmiast po kontakcie zagrywki.',
        'W P4: przebiega całą szerokość siatki do celu (najdłuższy ruch z linii przedniej).',
        'Tylko 2 atakujących z przodu (zrekompensowane pipe\'m w P6 i atakiem z drugiej linii atakującego w P1).',
      ],
    },
  ],
  5: [
    {
      title: 'Rozgrywający PENETRUJĄCY (układ 2F-3B, zalecany)',
      bullets: [
        'Zaczyna w P1 na linii tylnej, wychodzi z przyjęcia.',
        'Penetruje w stronę celu (Z2/Z3, ~1 m od siatki) W MOMENCIE kontaktu zagrywki przeciwnika — identycznie jak w 5-1 w 6v6.',
        '3 graczy z linii tylnej (P5 + P6 + P1 odchodzący) pokrywa 3-osobowe przyjęcie.',
        'Musi czekać aż piłka będzie obroniona, zanim odejdzie (częsty błąd: wczesne odejście → luka w P1).',
      ],
      note: 'Układ najbliższy 6v6 — zalecany do przygotowania tranzycji.',
    },
    {
      title: 'STAŁY rozgrywający z linii przedniej (układ 3F-2B lub pentagon)',
      bullets: [
        'Zostaje w celu (P2 lub P3 zależnie od układu): brak penetracji.',
        'Wychodzi z przyjęcia: żadna piłka nie jest do niego kierowana.',
        'Natychmiastowa wystawa zaraz po nadejściu przyjęcia — brak tranzycji.',
        'W P2: staje się też blokującym po linii przeciwko przyjmującemu rywala (jak w 5-1 6v6).',
      ],
    },
  ],
  4: [
    {
      title: 'Rozgrywający z linii przedniej w diamencie (P3 środek siatki)',
      bullets: [
        'Zostaje w celu (Z3, ~1 m od siatki): brak penetracji.',
        'Wychodzi z przyjęcia: pozostała trójka (2 skrzydłowych + 1 z tyłu) przyjmuje.',
        'Szybka wystawa do Z4 lub Z2 zależnie od jakości przyjęcia.',
        'Jego tranzycja obrona → wystawa musi być wykonana w mniej niż 2 sekundy (tylko 1 gracz z linii tylnej = dużo pokrywania).',
      ],
      note: 'Najczęściej używana formacja w halowym 4v4.',
    },
    {
      title: 'Rozgrywający PENETRUJĄCY w linii 3-1 (P1 linia tylna)',
      bullets: [
        'Zaczyna w P1 na linii tylnej, wychodzi z przyjęcia.',
        'Penetruje w stronę strefy 2 w momencie kontaktu zagrywki przeciwnika.',
        '3 atakujących z linii przedniej (P4, P3, P2) przyjmuje.',
        'Wymaga bardzo czystego przyjęcia — w przeciwnym razie rozgrywający nie dotrze do celu na czas.',
      ],
    },
    {
      title: 'Brak dedykowanego rozgrywającego (box 2-2)',
      bullets: [
        'Najlepiej ustawiony gracz po pierwszym dotknięciu wystawia drugie.',
        'Każdy przyjmuje — 4 strefy po ~2,25 m.',
        'Losowa wystawa do jednego z pozostałych 3 graczy.',
        'Zarezerwowane dla sesji wprowadzających (U11-U13, szkoła).',
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
    title: 'Libero — centralna postać przyjęcia w 6v6',
    text: 'Specjalista defensywny w kontrastowej koszulce. Systematycznie zastępuje środkowych, gdy rotują na linię tylną (nieograniczone zmiany, nieliczone przez FIVB Rule 19). Gra 3 kolejne rotacje w Z5-Z6-Z1. Preferowana pozycja przyjęcia: Z6 (główny cel zagrywających) lub Z5. Ograniczenia FIVB: brak bloku, brak ataku ponad siatką, brak wystawy oburącz przed linią 3 m jeśli partner następnie atakuje ponad siatką.',
    accent: 'orange',
  },
  5: {
    title: 'Brak oficjalnego libero w 5v5',
    text: 'Halowe 5v5 nie ma regulacji FIVB. W praktyce żadna federacja nie dopuszcza libero w tym formacie. Najlepszy przyjmujący ustawiany jest w P6 lub P5 i systematycznie gra na linii tylnej — staje się "de facto libero" bez kontrastowej koszulki i ograniczeń. Może więc blokować i atakować w razie potrzeby.',
    accent: 'teal',
  },
  4: {
    title: 'Brak libero w 4v4',
    text: 'Żadne libero nie jest dozwolone w przepisach 4v4 (intramuralne ligi uczelniane, gra edukacyjna FFVb, plażówka 4v4). Samotny gracz z linii tylnej w diamencie — lub penetrujący rozgrywający w linii 3-1 — bierze na siebie rolę najlepszego przyjmującego/obrońcy. Przy ~3 m toru na przyjmującego w diamencie, antycypacja liczy się bardziej niż technika.',
    accent: 'plum',
  },
};

const READING_TABLE: [string, string][] = [
  ['Dolna', 'Normalna postawa, przyjmuj piłkę wysoko'],
  ['Float w miejscu', "Wysoka postawa, krok do przodu by przyjąć wcześnie zanim zboczy"],
  ['Topspin', 'Niska postawa, gotowy do wycofania, kątowana platforma'],
  ['Jump float', 'Można grać sposobem górnym 4 m od siatki'],
  ['Jump topspin', 'Niska postawa, antycypowane wycofanie, sztywna pasywna platforma'],
  ['Zagrywka hybrydowa', 'Platforma gotowa na oba scenariusze (float lub topspin)'],
];

const READING_CUES = [
  'Pozycja zagrywającego na linii → preferowany kąt',
  'Wysokość i ustawienie podrzutu: wysoko+do tyłu → topspin; nisko+do przodu → float',
  "Długość doskoku: długi → jump topspin; krótki → jump float",
  'Kierunek barków zagrywającego przy kontakcie → kierunek piłki',
];

const ERRORS_COMMON: [string, string][] = [
  ['Zamach ramionami', 'Przyczyna nr 1 — ramiona kołyszące przy kontakcie, piłka nieprzewidywalna. Naprawa: "platforma jest pasywna, nogi są aktywne".'],
  ['Załamana platforma', "Jedno przedramię wyżej niż drugie — zablokuj łokcie i naciśnij kciukami w dół."],
  ['Zbyt wczesne złączenie ramion', "Spowalnia ruch i uniemożliwia późny wybór między odbiciem dołem a górą. Łącz dłonie dopiero gdy dochodzisz."],
  ['Tułów zbyt wyprostowany', "Platforma przechodzi pod piłką → piłka kończy zbyt daleko od siatki. Pochyl się 30-45° do przodu."],
  ['Kontakt powyżej pępka', 'Zbyt wysoko = zmniejszona kontrola. Celuj w kontakt na wysokości pasa lub niżej.'],
  ['Brak freeze', "Nadal w ruchu przy kontakcie = niemożliwe do kontrolowania kierunku. Zatrzymaj się całkowicie."],
];

const ERRORS_BY_SIZE: Record<TeamSize, [string, string][]> = {
  6: [
    ['Źle ustawione libero', 'Zbyt centralnie omijają krótkie zagrywki w narożniki; zbyt bocznie porzucają środek. Punkt odniesienia: Z6 w jednej linii z zagrywającym przeciwnika.'],
    ['Overlap rozgrywającego', 'Rozgrywający opuszcza pozycję przed kontaktem zagrywki przeciwnika — błąd nr 1 w 5-1 (FIVB Rule 7.4). Jego stopy muszą zachowywać relacje przód/tył do momentu kontaktu.'],
    ['Przyjęcie 5-osobowe bez jasnych ról', 'W W, 3 graczy z linii przedniej przeszkadza w centralnej strefie. Wyraźnie zdefiniuj, kto bierze piłkę między P3 a P6 przy zagrywkach środkiem.'],
  ],
  5: [
    ['Zbyt wczesne odejście rozgrywającego', 'W układzie 2F-3B z penetrującym rozgrywającym, odejście przed obronieniem piłki = luka w P1. Czekaj na potwierdzenie.'],
    ['2 przyjmujących obok siebie', 'W układzie 3F-2B, P5 i P1 muszą być rozdzieleni (jeden na stronę). Wycentrowani razem = odsłonięte boczne linie.'],
    ['Przyjmujący z linii przedniej zapominający o ataku', 'W układzie 3F-2B, gracz z linii przedniej, który przyjmuje, musi potem biec do doskoku — odruch do specjalnego ćwiczenia.'],
    ['Brak zdefiniowanego de-facto libero', 'Bez jasnej roli, 3 graczy z linii tylnej odbija sobie odpowiedzialność. Wyraźnie wyznacz najlepszego przyjmującego jako priorytet w centralnej strefie.'],
  ],
  4: [
    ['Rozgrywający diamentu, który przyjmuje', 'W diamencie rozgrywający w P3 musi WYJŚĆ z przyjęcia — inaczej szybka wystawa jest niemożliwa. Pozostała trójka bierze piłkę.'],
    ['Przeciążony samotny gracz z linii tylnej', 'W diamencie gracz z P1 pokrywa ~3,5 m głębokiego boiska sam. Antycypacja = umiejętność nr 1; stałe kroki dostawne i wczesne czytanie.'],
    ['Box 2-2 bez wołania przy drugiej piłce', 'Bez dedykowanego rozgrywającego, kto wystawia? Krzyknięcie "MOJA!" przy drugiej piłce zaraz po przyjęciu jest nienegocjowalne.'],
    ['Skrzydłowi diamentu w jednej linii', 'P4 i P2 w środku boiska na tym samym poziomie co P1 → krótkie cięte zagranie spada między nich. Ustaw pozycje schodkowo.'],
  ],
};

const VIDEOS = [
  { title: 'Jak odbijać dołem (Sikana)', url: 'https://www.youtube.com/watch?v=aZkZwAFeye0' },
  { title: 'Odbicie sposobem dolnym (CEPSUM)', url: 'https://www.youtube.com/watch?v=qIPlthgJvHU' },
  { title: 'Kontrolowane odbicie do rozgrywającego', url: 'https://www.youtube.com/watch?v=eUDY6AGS1-A' },
  { title: 'Nauka przyjęcia wysokiego i niskiego (Sikana)', url: 'https://www.youtube.com/watch?v=ZLRy_Gu9LVA' },
  { title: 'Indywidualna rozgrzewka odbicia sposobem dolnym', url: 'https://www.youtube.com/watch?v=nGiE_y09vTY' },
];

export default function GuideReceptionPl() {
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
        Odbicie sposobem dolnym decyduje o 60% sukcesu ofensywnego zespołu. Bez dobrego przyjęcia nie ma szybkiego ataku. Platforma jest pasywna — nogi są aktywne.
      </GoldenRule>

      <section style={{ ...S.card, border: '2.5px solid var(--orange)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={S.label}>Format gry</div>
        <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.8, margin: 0 }}>
          <strong>Systemy przyjęcia</strong>, <strong>rola rozgrywającego</strong> i <strong>częste błędy</strong> poniżej dostosowują się do wybranego formatu.
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
        <h2 style={S.section}>Pozycja gotowa</h2>
        <div style={S.card}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              'Stopy nieco szerzej niż barki, jedna stopa lekko wysunięta',
              "Kolana ugięte do wewnątrz stóp, biodra nisko, tułów pochylony 30-45°",
              'Plecy proste, ciężar na śródstopiach (pięty lekko odciążone, ale nie uniesione)',
              'Ramiona ROZDZIELONE (nie złączone), zgięte 90-145°, na wysokości pasa',
              'Wzrok na zagrywającym od momentu podrzutu',
            ].map((pt, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14 }}>
                <span style={S.bullet}>▸</span>
                <span style={{ color: 'var(--ink)', opacity: 0.85 }}>{pt}</span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 12, borderLeft: '4px solid var(--orange)', paddingLeft: 12, fontSize: 13 }}>
            <strong style={{ color: 'var(--orange)' }}>Główny błąd: </strong>
            <span style={{ color: 'var(--ink)', opacity: 0.7 }}>złączone ramiona w platformę zanim piłka nadleci — to spowalnia ruch i uniemożliwia późny wybór między odbiciem dołem a górą.</span>
          </div>
        </div>
      </section>

      <section>
        <h2 style={S.section}>Platforma</h2>
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
        <h2 style={S.section}>Wykonanie — kluczowe kroki</h2>
        <div style={{ ...S.card, background: 'var(--cream)', border: '2.5px solid var(--orange)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {STEPS.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={S.stepBadge}>{i + 1}</span>
              <p style={{ fontSize: 14, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>{step}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, borderLeft: '4px solid var(--orange)', paddingLeft: 16, paddingTop: 4, fontSize: 14, color: 'var(--ink)', opacity: 0.7 }}>
          <strong style={{ color: 'var(--ink)', opacity: 1 }}>Freeze: </strong>
          "Pozuj do zdjęcia" — znieruchom się całkowicie na 1-2 sekundy po kontakcie. Przy 50-90 km/h obrońca w ruchu nie może dostosować kąta. Stojąc nieruchomo, może ruszyć w dowolnym kierunku.
        </div>
      </section>

      <section>
        <h2 style={S.section}>Przemieszczenia</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {DISPLACEMENTS.map((d, i) => (
            <div key={i} style={S.card}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 6 }}>{d.name}</div>
              <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: 0, lineHeight: 1.6 }}>{d.desc}</p>
            </div>
          ))}
          <div style={S.card}>
            <div style={S.label}>Odbicie jednorącz — awaryjne</div>
            <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: 0, lineHeight: 1.6 }}>
              Ruch ostatniej szansy, gdy piłka jest za daleko dla obu ramion. Ramię wyprostowane, platforma płasko na wewnętrznej stronie przedramienia, bez zamachu — tylko pchnięcie odbijające piłkę do góry. Warianty: pchnięcie pięścią (zaciśnięta pięść przy silnym smeczu), nabranie otwartą dłonią (otwarta dłoń skierowana w górę, niska piłka).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 style={S.section}>Systemy przyjęcia — {teamSize}v{teamSize}</h2>
        {teamSize !== 6 && (
          <div style={{ ...S.alert, background: 'var(--cream)', borderColor: 'var(--orange)', marginBottom: 14 }}>
            <div style={S.label}>⚠ Format nieoficjalny FIVB</div>
            <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0, lineHeight: 1.6 }}>
              {teamSize === 5
                ? "Halowe 5v5 nie ma dedykowanej regulacji FIVB ani FFVb. Systemy poniżej to logiczne adaptacje 5-1 w 6v6 udokumentowane przez VolleyballXL, The Art of Coaching Volleyball i Volleyball Canada."
                : "Halowe 4v4 nie ma oficjalnej regulacji FIVB. Formacje poniżej pochodzą z intramuralnych lig uczelnianych (USA), podręczników edukacyjnych FFVb / Volleyball Canada i literatury plażowej (Brandon Joyner, Better at Beach)."}
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
                <div style={S.labelTeal}>Plusy</div>
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
                <div style={{ ...S.label, color: 'var(--ink)', opacity: 0.5 }}>Minusy</div>
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
        <h2 style={S.section}>Rola rozgrywającego w przyjęciu — {teamSize}v{teamSize}</h2>
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
                  <strong style={{ color: 'var(--teal)' }}>Uwaga: </strong>{role.note}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={S.section}>Libero — specjalistka przyjęcia</h2>
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
        <h2 style={S.section}>Czytanie zagrywki by ustawić się we właściwej pozycji</h2>
        <div style={{ border: '2.5px solid var(--ink)', overflow: 'hidden', marginBottom: 12 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--ink)' }}>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Typ zagrywki</th>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>Dostosowanie przyjmującego</th>
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
          <div style={S.labelTeal}>Wskazówki przed kontaktem zagrywającego</div>
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
        <h2 style={S.section}>Częste błędy</h2>
        <div style={{ borderLeft: '5px solid var(--orange)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
          <div style={{ ...S.label, color: 'var(--orange)' }}>Błędy techniczne (wszystkie formaty)</div>
          {ERRORS_COMMON.map(([label, text], i) => (
            <div key={i} style={{ fontSize: 13 }}>
              <strong style={{ color: 'var(--ink)' }}>{label}: </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{text}</span>
            </div>
          ))}
        </div>
        <div style={{ borderLeft: '5px solid var(--teal)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ ...S.labelTeal }}>Błędy specyficzne dla {teamSize}v{teamSize}</div>
          {errorsSize.map(([label, text], i) => (
            <div key={i} style={{ fontSize: 13 }}>
              <strong style={{ color: 'var(--ink)' }}>{label}: </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{text}</span>
            </div>
          ))}
        </div>
      </section>

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
