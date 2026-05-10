import { useMemo, useState } from 'react';
import { ROLE_COLORS } from '../constants/positions';

type ZoneId = 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6' | 'L';
type TeamSize = 4 | 5 | 6;

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

const POSITIONS_6: Position[] = [
  {
    id: 'P4',
    number: '④',
    name: 'Avant gauche',
    role: 'Attaquant aile (Outside)',
    row: 'front',
    col: 0,
    description: "Zone d'attaque principale. L'attaquant aile reçoit la plupart des balles hautes et doit être polyvalent : attaque, contre et réception.",
    skills: ['Attaque', 'Contre', 'Réception', 'Service'],
    traits: ["Puissance et précision d'attaque", 'Grande envergure', 'Polyvalence', 'Endurance'],
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
    description: "Le chef d'orchestre. Il reçoit la deuxième touche et distribue le jeu vers les attaquants. Sa précision et sa lecture du jeu sont cruciales.",
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
    description: `L'opposé (ou "pointu") est placé en opposition au passeur dans la rotation. Ne participe pas à la réception — c'est le finisseur de l'équipe. En arrière 3 rotations sur 6 (il doit attaquer depuis le fond).`,
    skills: ['Attaque forte', 'Service', 'Contre', 'Attaque arrière (D/Pipe)'],
    traits: ['Puissance de frappe maximale', 'Attaque back-row obligatoire (3 rotations/6)', 'Libéré de la réception', `"Pointu" = synonyme exact d'opposé (FFVolley)`],
  },
  {
    id: 'L',
    number: 'L',
    name: 'Libéro',
    role: 'Spécialiste défensif',
    row: 'off',
    col: 0,
    description: 'Spécialiste défensif en maillot contrastant. Remplace les joueurs arrière (P1, P5, P6) sans que cela compte comme substitution. Peut servir depuis 2021 dans une rotation par set. Peut être capitaine depuis 2021.',
    skills: ['Manchette', 'Réception de service', 'Défense', 'Lecture de trajectoire'],
    traits: ['Agilité et réflexes maximaux', 'Ne peut pas bloquer ni attaquer au-dessus du filet', 'Remplacements illimités hors quota', 'Peut servir (1 rotation/set, FIVB 2021)'],
  },
];

// 5v5: pas de libéro officiel. Système 4-1 simplifié (1 passeur + 1 central + 2 R4 + 1 arrière polyvalent).
// On garde la grille 2x3 mais sans le poste 1 (back-droit), souvent absorbé par le passeur arrière.
const POSITIONS_5: Position[] = [
  {
    id: 'P4',
    number: '④',
    name: 'Avant gauche',
    role: 'Aile (Outside)',
    row: 'front', col: 0,
    description: "Aile principale en attaque comme en réception. En 5v5 il enchaîne souvent réception puis course d'élan d'attaque sans libéro pour le couvrir.",
    skills: ['Attaque', 'Contre', 'Réception', 'Service'],
    traits: ["Polyvalence renforcée (~30 m² à défendre)", 'Endurance', 'Réception haute pour libérer la passe', 'Attaque en zone 4 majoritaire'],
  },
  {
    id: 'P3',
    number: '③',
    name: 'Avant centre',
    role: 'Central (Middle)',
    row: 'front', col: 1,
    description: "Contreur principal au filet. En 5v5 le block reste à 2 (avec le pointu ou le R4 selon la zone d'attaque). Les rapides centrales restent possibles si la réception est propre.",
    skills: ['Contre', 'Attaque rapide', 'Couverture de filet'],
    traits: ['Garde un rôle dominant au bloc', 'Tempo 1 / tempo 2 conservés', 'Permutation avec le pointu sur Z2', 'Souvent dispensé de réception'],
  },
  {
    id: 'P2',
    number: '②',
    name: 'Avant droit',
    role: 'Passeur (Setter)',
    row: 'front', col: 2,
    description: "Distributeur unique en système 4-1 (équivalent du 5-1 à 5 joueurs). Caché au filet en P2 puis pénètre depuis l'arrière selon la rotation.",
    skills: ['Passe en touche', 'Pénétration', 'Lecture du bloc adverse', 'Communication'],
    traits: ['Précision technique maximale', 'Recommandation : conserver le 5-1 du 6v6 en retirant un arrière', 'Couverture courte après chaque passe', 'Leadership'],
  },
  {
    id: 'P5',
    number: '⑤',
    name: 'Arrière gauche',
    role: 'Défense / réception',
    row: 'back', col: 0,
    description: "En 5v5 ce poste reste un appui défensif en grande diagonale et en réception côté gauche. Sans libéro, c'est souvent le meilleur réceptionneur de l'équipe.",
    skills: ['Manchette', 'Réception de service', 'Défense', 'Lecture'],
    traits: ['Pilier de la défense au sol', '~30 m² à couvrir (vs 20 m² en 6v6)', 'Rôle proche du libéro 6v6', 'Souvent réceptionneur principal'],
  },
  {
    id: 'P6',
    number: '⑥',
    name: 'Arrière centre',
    role: 'Polyvalent fond',
    row: 'back', col: 1,
    description: "Couvre le centre du fond et les balles longues. En 5v5 il monte sur les feintes (système 6 avant) ou reste en lecture (read defense).",
    skills: ['Défense longue', 'Couverture', 'Manchette', 'Soutien'],
    traits: ['Mobilité maximale', 'Communication arrière', 'Couvre la pipe adverse seul', "Soutien d'attaque indispensable"],
  },
];

// 4v4: 4 postes — 2-3-4 alignés au service, 1 seul arrière. Pas de libéro.
const POSITIONS_4: Position[] = [
  {
    id: 'P4',
    number: '④',
    name: 'Aile gauche',
    role: 'Attaquant principal',
    row: 'front', col: 0,
    description: "Cible principale du passeur. En losange ou en carré, c'est lui qui finit la majorité des points en zone 4.",
    skills: ['Attaque', 'Contre', 'Réception', 'Couverture'],
    traits: ['Polyvalence absolue (~35 m² à défendre)', "Course d'élan courte (3 m)", 'Block à 1 ou 2 selon configuration', "Pas d'option centrale rapide en 4v4"],
  },
  {
    id: 'P3',
    number: '③',
    name: 'Central (filet)',
    role: 'Passeur ou contreur',
    row: 'front', col: 1,
    description: "En losange c'est souvent le passeur (variante « passeur centre »). En carré il devient le contreur principal et permute avec un ailier en attaque.",
    skills: ['Passe', 'Contre', 'Lecture du jeu', 'Communication'],
    traits: ["Hub du jeu en losange", 'Block à 1 standard en 4v4', "Distribue sans pénétration", 'Pas de tempo 1 traditionnel'],
  },
  {
    id: 'P2',
    number: '②',
    name: 'Aile droite',
    role: 'Attaquant / passeur avant',
    row: 'front', col: 2,
    description: "Passeur avant fixe (variante simplifiée du 3-1) ou attaquant secondaire en losange. Il assure la 2ᵉ touche s'il est plus proche du filet.",
    skills: ['Passe', 'Attaque ligne', 'Contre', 'Service'],
    traits: ['Passeur avant = pas de pénétration', "Attaque exceptionnelle en zone 4 lorsqu'il prend la passe", 'Block à 2 occasionnel avec le central', 'Couverture courte côté droit'],
  },
  {
    id: 'P1',
    number: '①',
    name: 'Arrière unique',
    role: 'Défenseur / réceptionneur',
    row: 'back', col: 1,
    description: "Pas de libéro autorisé : c'est le meilleur défenseur de l'équipe qui occupe ce poste. Couvre tout le fond seul après le block.",
    skills: ['Réception', 'Défense profonde', 'Lecture', 'Communication'],
    traits: ['~40 m² à couvrir seul', 'Anticipation = compétence n°1', 'Doit savoir relayer en 2ᵉ touche', "Sert depuis derrière la ligne de fond"],
  },
];

const POSITIONS_BY_SIZE: Record<TeamSize, Position[]> = {
  6: POSITIONS_6,
  5: POSITIONS_5,
  4: POSITIONS_4,
};

const TEAM_INTRO: Record<TeamSize, { tagline: string; rules: string }> = {
  6: {
    tagline: 'Format officiel FIVB / FFVolley : 6 joueurs + libéro, terrain 9×18 m.',
    rules: '5-1, 6-2 ou 4-2. Le libéro remplace les arrières (P1/P5/P6) sans compter comme substitution. Bloc à 1, 2 ou 3 selon la zone.',
  },
  5: {
    tagline: 'Format hybride (entraînement, loisir). Pas de règlement officiel français.',
    rules: 'Système 4-1 conseillé : conserver le 5-1 en retirant un arrière non passeur. Libéro toléré en entraînement, pas en compétition. Block à 2 reste la norme.',
  },
  4: {
    tagline: 'Format UNSS et loisir FFVB. Terrain 7×14 m ou 8×16 m, ligne d\'attaque à 3 m.',
    rules: 'Pas de libéro. Rotation à 4 positions (1→2→3→4). Block à 1 standard (le central). Configurations losange (1-2-1) ou carré (2-2).',
  },
};

const LIBERO_HIGHLIGHTED_ZONES: ZoneId[] = ['P1', 'P5', 'P6'];

export default function Positions() {
  const [teamSize, setTeamSize] = useState<TeamSize>(6);
  const [selectedId, setSelectedId] = useState<ZoneId | null>(null);

  const positions = POSITIONS_BY_SIZE[teamSize];
  const courtZones = useMemo(() => positions.filter(p => p.row !== 'off'), [positions]);
  const liberoEntry = positions.find(p => p.id === 'L');

  const visiblePositions = selectedId
    ? positions.filter(p => p.id === selectedId)
    : positions;

  const isZoneActive = (zone: ZoneId): boolean => {
    if (!selectedId) return false;
    if (selectedId === 'L') return LIBERO_HIGHLIGHTED_ZONES.includes(zone);
    return selectedId === zone;
  };

  const toggle = (id: ZoneId) => setSelectedId(prev => (prev === id ? null : id));

  // Reset selection when team size changes (selected position may not exist in new layout)
  const changeTeamSize = (size: TeamSize) => {
    setTeamSize(size);
    setSelectedId(null);
  };

  return (
    <div className="space-y-12">
      <div>
        <div className="text-yellow-400 text-xs uppercase tracking-widest mb-2">Documentation</div>
        <h1 className="text-4xl font-bold text-white mb-3">Positions et rôles</h1>
        <p className="text-gray-400">
          Postes du volleyball indoor. Choisissez le format ci-dessous pour adapter les rôles et la rotation.
        </p>
      </div>

      {/* Team size selector */}
      <div className="border-2 border-gray-700 p-4 space-y-3">
        <div className="text-gray-500 text-xs uppercase tracking-widest">Format de jeu</div>
        <div className="flex flex-wrap gap-2">
          {([6, 5, 4] as const).map(size => (
            <button
              key={size}
              onClick={() => changeTeamSize(size)}
              className={`px-4 py-2 text-xs uppercase tracking-wider border-2 transition-colors ${
                teamSize === size
                  ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                  : 'border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
            >
              {size}v{size}
            </button>
          ))}
        </div>
        <div className="text-gray-300 text-sm leading-relaxed">{TEAM_INTRO[teamSize].tagline}</div>
        <div className="text-gray-500 text-xs leading-relaxed border-l-2 border-gray-700 pl-3">
          {TEAM_INTRO[teamSize].rules}
        </div>
      </div>

      {/* Court diagram */}
      <div className="border-2 border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-gray-500 text-xs uppercase tracking-widest">
            Terrain — demi-court vu de dessus ({teamSize}v{teamSize})
          </div>
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
              {courtZones.map(zone => {
                const active = isZoneActive(zone.id);
                const roleColor = ROLE_COLORS[zone.id];
                const cellStyle: React.CSSProperties = {
                  gridRow: zone.row === 'front' ? 1 : 2,
                  gridColumn: zone.col + 1,
                  ...(active ? { borderColor: roleColor, backgroundColor: `${roleColor}1a`, color: roleColor, zIndex: 10 } : {}),
                };
                return (
                  <button
                    key={zone.id}
                    onClick={() => toggle(zone.id)}
                    className={`relative border-2 -ml-px -mt-px flex flex-col items-center justify-center transition-colors ${
                      active ? '' : 'border-gray-700 hover:border-gray-500 text-gray-300'
                    }`}
                    style={cellStyle}
                  >
                    <span className="text-2xl font-bold">{zone.id}</span>
                    <span className="text-[10px] uppercase tracking-wider mt-1" style={active ? { color: roleColor } : { color: '#6b7280' }}>
                      {zone.row === 'front' ? 'Avant' : 'Arrière'}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex w-full max-w-[480px] justify-between mt-2 text-gray-600 text-[10px] uppercase tracking-widest">
              <span>Fond de court</span>
              <span>{teamSize === 4 ? '7×14 m / 8×16 m' : '9 m × 9 m'}</span>
            </div>
          </div>

          {/* Side legend */}
          <div className="flex flex-col gap-3 w-full">
            <div className="border-2 border-gray-800 p-3">
              <div className="text-gray-500 text-[10px] uppercase tracking-widest mb-2">Zones</div>
              <ul className="space-y-1 text-gray-400 text-xs">
                <li><span className="text-white font-bold">Avant</span> — 3 m du filet (attaque)</li>
                <li>
                  <span className="text-white font-bold">Arrière</span>
                  {teamSize === 4 ? ' — un seul joueur, ~40 m² à couvrir' : ' — 6 m (réception, défense)'}
                </li>
              </ul>
            </div>
            {liberoEntry ? (
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
            ) : (
              <div className="border-2 border-gray-800 p-3 text-gray-500 text-xs leading-relaxed">
                <span className="text-white font-bold uppercase tracking-wider">Pas de libéro</span> en {teamSize}v{teamSize}.
                Tous les joueurs (sauf passeur dédié) doivent savoir réceptionner.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Position cards */}
      <div className="space-y-6">
        {visiblePositions.map(pos => {
          const roleColor = ROLE_COLORS[pos.id];
          return (
            <div key={pos.id} className="border-2 border-gray-700 overflow-hidden">
              <div className="px-6 py-4 flex items-center gap-4 border-l-4" style={{ borderLeftColor: roleColor }}>
                <span className="text-4xl font-bold min-w-[2.5rem] text-center" style={{ color: roleColor }}>{pos.number}</span>
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
          );
        })}
      </div>

      {/* Rotation note */}
      <div className="border-2 border-gray-800 bg-gray-900/50 p-6">
        <div className="text-yellow-400 text-xs uppercase tracking-widest mb-2">Note sur la rotation</div>
        <p className="text-gray-400 text-sm leading-relaxed">
          {teamSize === 6 && (
            <>Les joueurs tournent dans le sens des aiguilles d'une montre à chaque récupération de service adverse.
            La position sur le terrain au moment du service ne correspond pas forcément au rôle du joueur : après le contact du serveur,
            les joueurs se repositionnent librement selon leur formation tactique. Une équipe en système 5-1 a 1 passeur, 2 attaquants ailes, 1 opposé, 2 centraux et 1 libéro — qui passent par tous les postes au fil de la rotation.</>
          )}
          {teamSize === 5 && (
            <>Pas de règlement officiel : la rotation suit le 6v6 en supprimant une position (généralement P1 ou P6).
            En entraînement, conservez votre système 5-1 en retirant l'arrière non passeur ; le libéro reste possible mais n'est pas obligatoire.
            Au service, les 3 avants doivent être devant les 2 arrières.</>
          )}
          {teamSize === 4 && (
            <>Rotation horaire à 4 positions dans l'ordre 1→2→3→4 après reconquête du service.
            Au service, les 3 avants doivent être alignés 2-3-4 de droite à gauche, le poste 1 derrière. Après la frappe, déplacement libre.
            Pas de libéro autorisé, contre interdit sur service adverse.</>
          )}
        </p>
      </div>
    </div>
  );
}
