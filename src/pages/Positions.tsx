import { useState } from 'react';

type ZoneId = 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6' | 'L';

type Position = {
  id: ZoneId;
  number: string;
  name: string;
  role: string;
  row: 'front' | 'back' | 'off';
  col: 0 | 1 | 2;
  description: string;
  skills: string[];
  traits: string[];
};

const POSITIONS: Position[] = [
  {
    id: 'P4',
    number: '④',
    name: 'Avant gauche',
    role: 'Attaquant aile (Outside)',
    row: 'front',
    col: 0,
    description: 'Zone d\'attaque principale. L\'attaquant aile reçoit la plupart des balles hautes et doit être polyvalent : attaque, contre et réception.',
    skills: ['Attaque', 'Contre', 'Réception', 'Service'],
    traits: ['Puissance et précision d\'attaque', 'Grande envergure', 'Polyvalence', 'Endurance'],
  },
  {
    id: 'P3',
    number: '③',
    name: 'Avant centre',
    role: 'Central (Middle)',
    row: 'front',
    col: 1,
    description: 'Joueur du filet en zone centrale. Il contre les attaques adverses et attaque en tempo rapide. Sa hauteur et sa détente sont des atouts majeurs.',
    skills: ['Contre', 'Attaque rapide', 'Couverture de filet'],
    traits: ['Grande taille requise', 'Contre dominant', 'Attaques en tempo 1 et 2', 'Rôle défensif limité au filet'],
  },
  {
    id: 'P2',
    number: '②',
    name: 'Avant droit',
    role: 'Passeur (Setter)',
    row: 'front',
    col: 2,
    description: 'Le chef d\'orchestre. Il reçoit la deuxième touche et distribue le jeu vers les attaquants. Sa précision et sa lecture du jeu sont cruciales.',
    skills: ['Passe en touche', 'Lecture du bloc adverse', 'Communication', 'Coordination'],
    traits: ['Précision technique maximale', 'Vision du jeu 360°', 'Sang-froid sous pression', 'Leadership'],
  },
  {
    id: 'P5',
    number: '⑤',
    name: 'Arrière gauche',
    role: 'Réception / défense',
    row: 'back',
    col: 0,
    description: 'Zone de réception et de défense côté gauche. Souvent occupée par le second attaquant aile en rotation arrière. Le libéro peut le remplacer.',
    skills: ['Manchette', 'Réception de service', 'Défense', 'Lecture de trajectoire'],
    traits: ['Lecture des attaques adverses', 'Premier rideau de défense', 'Couverture du fond gauche', 'Souvent remplacé par le libéro'],
  },
  {
    id: 'P6',
    number: '⑥',
    name: 'Arrière centre',
    role: 'Défense centrale',
    row: 'back',
    col: 1,
    description: 'Pivot défensif au fond du terrain. Couvre les balles longues et soutient ses coéquipiers. Le libéro y est souvent en rotation pour libérer un central.',
    skills: ['Défense longue', 'Couverture', 'Soutien', 'Manchette'],
    traits: ['Lecture du jeu adverse', 'Mobilité maximale', 'Communication arrière', 'Souvent remplacé par le libéro'],
  },
  {
    id: 'P1',
    number: '①',
    name: 'Arrière droit (service)',
    role: 'Opposé (Opposite)',
    row: 'back',
    col: 2,
    description: 'Zone de service. L\'opposant attaque depuis l\'arrière droite et n\'a pas à réceptionner. Souvent le meilleur attaquant de l\'équipe, en face du passeur.',
    skills: ['Attaque forte', 'Service', 'Contre', 'Attaque arrière'],
    traits: ['Puissance de frappe maximale', 'Attaque en suspension longue', 'Moins impliqué en réception', 'Frappe depuis l\'arrière'],
  },
  {
    id: 'L',
    number: 'L',
    name: 'Libéro',
    role: 'Spécialiste défensif',
    row: 'off',
    col: 0,
    description: 'Spécialiste défensif en maillot de couleur distincte. Il remplace les joueurs arrière sans compter sur le quota de remplacements. Meilleur récepteur de l\'équipe.',
    skills: ['Manchette', 'Réception de service', 'Défense', 'Lecture de trajectoire'],
    traits: ['Agilité maximale', 'Réflexes rapides', 'Ne peut pas attaquer au-dessus du filet', 'Ne peut pas servir'],
  },
];

const COURT_ZONES = POSITIONS.filter(p => p.row !== 'off');
const LIBERO_HIGHLIGHTED_ZONES: ZoneId[] = ['P1', 'P5', 'P6'];

export default function Positions() {
  const [selectedId, setSelectedId] = useState<ZoneId | null>(null);

  const visiblePositions = selectedId ? POSITIONS.filter(p => p.id === selectedId) : POSITIONS;

  const isZoneActive = (zone: ZoneId): boolean => {
    if (!selectedId) return false;
    if (selectedId === 'L') return LIBERO_HIGHLIGHTED_ZONES.includes(zone);
    return selectedId === zone;
  };

  const toggle = (id: ZoneId) => setSelectedId(prev => (prev === id ? null : id));

  return (
    <div className="space-y-12">
      <div>
        <div className="text-yellow-400 text-xs uppercase tracking-widest mb-2">Documentation</div>
        <h1 className="text-4xl font-bold text-white mb-3">Positions et rôles</h1>
        <p className="text-gray-400">Les six postes du volleyball et le libéro. Cliquez sur une zone du terrain pour afficher sa fiche.</p>
      </div>

      {/* Court diagram */}
      <div className="border-2 border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-gray-500 text-xs uppercase tracking-widest">Terrain — demi-court vu de dessus</div>
          {selectedId && (
            <button
              onClick={() => setSelectedId(null)}
              className="px-3 py-1 border border-yellow-400 text-yellow-400 text-xs uppercase tracking-wider hover:bg-yellow-400/10 transition-colors"
            >
              Tout afficher
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-[2fr_1fr] gap-6 items-start">
          {/* Half court */}
          <div className="flex flex-col items-center w-full">
            <div className="text-gray-500 text-xs uppercase tracking-widest mb-2">Filet</div>
            <div className="border-t-2 border-yellow-400 w-full max-w-[480px]" />
            <div
              className="grid grid-cols-3 w-full max-w-[480px]"
              style={{ gridTemplateRows: '1fr 2fr', aspectRatio: '1 / 1' }}
            >
              {COURT_ZONES.map(zone => {
                const active = isZoneActive(zone.id);
                return (
                  <button
                    key={zone.id}
                    onClick={() => toggle(zone.id)}
                    className={`relative border-2 -ml-px -mt-px flex flex-col items-center justify-center transition-colors ${
                      active
                        ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400 z-10'
                        : 'border-gray-700 hover:border-gray-500 text-gray-300'
                    }`}
                    style={{ gridRow: zone.row === 'front' ? 1 : 2, gridColumn: zone.col + 1 }}
                  >
                    <span className="text-2xl font-bold">{zone.id}</span>
                    <span className={`text-[10px] uppercase tracking-wider mt-1 ${active ? 'text-yellow-400' : 'text-gray-500'}`}>
                      {zone.row === 'front' ? 'Avant' : 'Arrière'}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex w-full max-w-[480px] justify-between mt-2 text-gray-600 text-[10px] uppercase tracking-widest">
              <span>Fond de court</span>
              <span>9 m × 9 m</span>
            </div>
          </div>

          {/* Side legend */}
          <div className="flex flex-col gap-3 w-full">
            <div className="border-2 border-gray-800 p-3">
              <div className="text-gray-500 text-[10px] uppercase tracking-widest mb-2">Zones</div>
              <ul className="space-y-1 text-gray-400 text-xs">
                <li><span className="text-white font-bold">Avant</span> — 3 m du filet (attaque)</li>
                <li><span className="text-white font-bold">Arrière</span> — 6 m (réception, défense)</li>
              </ul>
            </div>
            <button
              onClick={() => toggle('L')}
              className={`border-2 p-3 text-left transition-colors ${
                selectedId === 'L'
                  ? 'border-yellow-400 bg-yellow-400/10'
                  : 'border-gray-700 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`inline-flex items-center justify-center w-6 h-6 border-2 text-xs font-bold ${
                  selectedId === 'L' ? 'border-yellow-400 text-yellow-400' : 'border-gray-600 text-gray-300'
                }`}>L</span>
                <span className={`text-xs uppercase tracking-wider font-bold ${
                  selectedId === 'L' ? 'text-yellow-400' : 'text-white'
                }`}>Libéro</span>
              </div>
              <p className="text-gray-500 text-[10px] leading-relaxed">Hors rotation. Remplace les arrières (P1, P5, P6) — surligne les 3 zones.</p>
            </button>
          </div>
        </div>
      </div>

      {/* Position cards */}
      <div className="space-y-6">
        {visiblePositions.map(pos => (
          <div key={pos.id} className="border-2 border-gray-700 overflow-hidden">
            <div className="px-6 py-4 flex items-center gap-4 border-l-4 border-l-yellow-400">
              <span className="text-4xl font-bold text-yellow-400 min-w-[2.5rem] text-center">{pos.number}</span>
              <div>
                <h2 className="text-white font-bold text-xl">{pos.name}</h2>
                <div className="text-gray-500 text-xs uppercase tracking-wider">{pos.role}</div>
              </div>
            </div>
            <div className="px-6 pb-6 space-y-4">
              <p className="text-gray-400 text-sm leading-relaxed">{pos.description}</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">Compétences principales</div>
                  <div className="flex flex-wrap gap-2">
                    {pos.skills.map(s => (
                      <span key={s} className="px-2 py-1 border border-gray-600 text-gray-300 text-xs">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">Caractéristiques</div>
                  <ul className="space-y-1">
                    {pos.traits.map(t => (
                      <li key={t} className="text-xs text-gray-400 flex items-start gap-2">
                        <span className="text-yellow-400">▸</span>{t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Rotation note */}
      <div className="border-2 border-gray-800 bg-gray-900/50 p-6">
        <div className="text-yellow-400 text-xs uppercase tracking-widest mb-2">Note sur la rotation</div>
        <p className="text-gray-400 text-sm leading-relaxed">
          Les joueurs tournent dans le sens des aiguilles d'une montre à chaque récupération de service adverse.
          La position sur le terrain au moment du service ne correspond pas forcément au rôle du joueur : après le contact du serveur,
          les joueurs se repositionnent librement selon leur formation tactique. Une équipe en système 5-1 a 1 passeur, 2 attaquants ailes, 1 opposé, 2 centraux et 1 libéro — qui passent par tous les postes au fil de la rotation.
        </p>
      </div>
    </div>
  );
}
