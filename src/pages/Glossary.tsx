import { useState, useMemo } from 'react';

const TERMS = [
  { term: 'Ace', def: 'Service direct qui tombe dans le terrain adverse sans être touché, ou touché mais impossible à relever.' },
  { term: 'Antenne', def: 'Tige verticale fixée sur le filet aux extrémités de celui-ci, marquant les limites latérales du terrain de jeu.' },
  { term: 'Attaque', def: 'Toute action offensive visant à faire chuter le ballon dans le terrain adverse. Terme générique pour spike, smash, amorti.' },
  { term: 'Amorti (Tip)', def: 'Attaque douce qui place le ballon juste derrière le bloc adverse, plutôt que de frapper fort.' },
  { term: 'Block / Contre', def: 'Action défensive au filet où un ou plusieurs joueurs sautent pour intercepter l\'attaque adverse.' },
  { term: 'Bump', def: 'Terme anglais pour la manchette, réception des avant-bras joints.' },
  { term: 'Changement de service (Side-out)', def: 'Récupération du service par l\'équipe en réception, entraînant une rotation.' },
  { term: 'Chevauchement (Overlap)', def: 'Faute commise quand deux joueurs voisins ne respectent pas leur ordre de rotation au moment du service.' },
  { term: 'Coup de poignet (Wrist snap)', def: 'Mouvement final du poignet lors d\'un spike, qui ajoute vitesse et rotation descendante au ballon.' },
  { term: 'Course d\'élan', def: 'Les 3 à 4 pas d\'approche de l\'attaquant avant son saut pour frapper.' },
  { term: 'Diagonal', def: 'Direction d\'attaque vers le coin opposé du terrain adverse — l\'angle le plus large disponible.' },
  { term: 'Dig', def: 'Terme anglais pour la défense basse, souvent en manchette ou en extension complète vers le sol.' },
  { term: 'Dump', def: 'Attaque surprise du passeur sur la deuxième touche, souvent du revers de la main.' },
  { term: 'Filet', def: 'Séparation entre les deux camps. Hauteur officielle : 2,43 m (hommes) / 2,24 m (femmes).' },
  { term: 'Float serve', def: 'Service flottant sans rotation du ballon, qui oscille de façon imprévisible pendant son vol.' },
  { term: 'Free ball', def: 'Ballon renvoyé facilement par l\'adversaire (souvent une manchette haute), offrant une bonne opportunité de construire l\'attaque.' },
  { term: 'Joker / Wildcard', def: 'Remplacement exceptionnel (blessure) accordé par l\'arbitre.' },
  { term: 'Jump serve', def: 'Service sauté : le serveur lance le ballon haut, court et le frappe en saut comme une attaque.' },
  { term: 'Libero', def: 'Joueur défensif spécialisé portant un maillot de couleur différente. Règles spéciales : pas de service, pas d\'attaque au-dessus du filet, rotations illimitées.' },
  { term: 'Line (Ligne)', def: 'Direction d\'attaque le long de la ligne latérale, dans l\'angle de l\'attaquant.' },
  { term: 'Manchette', def: 'Geste de réception ou de défense utilisant la face interne des avant-bras joints.' },
  { term: 'Passe haute (Set)', def: 'Deuxième touche, généralement effectuée par le passeur avec les doigts, pour préparer l\'attaque.' },
  { term: 'Passeur (Setter)', def: 'Joueur chargé de la deuxième touche et de la distribution du jeu offensif.' },
  { term: 'Pipeline', def: 'Système de jeu où le passeur distribue principalement sur les ailes.' },
  { term: 'Quick (Tempo 1)', def: 'Attaque très rapide du central, souvent en tempo 1 (le ballon est levé juste au-dessus du filet).' },
  { term: 'Rally point', def: 'Système de décompte où chaque échange vaut un point, quelle que soit l\'équipe au service. En vigueur depuis 1999.' },
  { term: 'Réception', def: 'Première touche après le service adverse, visant à diriger le ballon vers le passeur.' },
  { term: 'Rotation', def: 'Déplacement dans le sens des aiguilles d\'une montre effectué par l\'équipe qui récupère le service.' },
  { term: 'Service (Serve)', def: 'Coup frappé depuis la zone de service pour mettre le ballon en jeu et lancer l\'échange.' },
  { term: 'Setter dump', def: 'Voir "Dump".' },
  { term: 'Side-out', def: 'Voir "Changement de service".' },
  { term: 'Spike / Smash', def: 'Attaque frappée fort vers le bas par un attaquant en saut. La technique offensive principale.' },
  { term: 'Saut en foulée (Jump from approach)', def: 'Saut dynamique précédé d\'une course d\'élan pour maximiser la hauteur de contact.' },
  { term: 'Tempo', def: 'Vitesse à laquelle la balle est levée pour l\'attaquant. Tempo 1 = rapide, Tempo 3 = lent.' },
  { term: 'Time-out', def: 'Interruption de jeu demandée par un entraîneur, de 30 secondes. 2 par set disponibles.' },
  { term: 'Touche (Touch)', def: 'Contact avec le ballon. Une équipe a droit à 3 touches maximum pour renvoyer le ballon.' },
  { term: 'Zone d\'attaque', def: 'Les 3 premiers mètres depuis le filet. Les attaquants avant peuvent y sauter et frapper au-dessus du filet.' },
].sort((a, b) => a.term.localeCompare(b.term));

export default function Glossary() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return TERMS;
    const q = search.toLowerCase();
    return TERMS.filter(t => t.term.toLowerCase().includes(q) || t.def.toLowerCase().includes(q));
  }, [search]);

  const letters = useMemo(() => {
    const set = new Set(filtered.map(t => t.term[0]?.toUpperCase()));
    return Array.from(set).sort();
  }, [filtered]);

  return (
    <div className="space-y-8">
      <div>
        <div className="text-yellow-400 text-xs uppercase tracking-widest mb-2">Documentation</div>
        <h1 className="text-4xl font-bold text-white mb-3">Glossaire</h1>
        <p className="text-gray-400">Vocabulaire technique du volleyball — {TERMS.length} termes.</p>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
        <input
          type="text"
          placeholder="Rechercher un terme…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-gray-900 border-2 border-gray-700 focus:border-yellow-400 outline-none px-10 py-3 text-white text-sm placeholder-gray-600 transition-colors"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">✕</button>
        )}
      </div>

      {/* Letter index */}
      {!search && (
        <div className="flex flex-wrap gap-1">
          {letters.map(l => (
            <a key={l} href={`#letter-${l}`} className="w-8 h-8 border border-gray-700 flex items-center justify-center text-xs text-gray-400 hover:border-yellow-400 hover:text-yellow-400 transition-colors">
              {l}
            </a>
          ))}
        </div>
      )}

      {/* Terms */}
      {filtered.length === 0 ? (
        <div className="text-center text-gray-600 py-12">Aucun terme trouvé pour « {search} »</div>
      ) : (
        <div className="space-y-6">
          {letters.map(letter => {
            const terms = filtered.filter(t => t.term[0]?.toUpperCase() === letter);
            if (terms.length === 0) return null;
            return (
              <div key={letter} id={`letter-${letter}`}>
                <div className="text-yellow-400 font-bold text-2xl mb-3 border-b-2 border-gray-800 pb-2">{letter}</div>
                <div className="space-y-3">
                  {terms.map(t => (
                    <div key={t.term} className="border-l-2 border-gray-700 pl-4 hover:border-yellow-400 transition-colors">
                      <div className="text-white font-bold text-sm mb-1">{t.term}</div>
                      <p className="text-gray-400 text-sm leading-relaxed">{t.def}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
