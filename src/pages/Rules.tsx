import { useState } from 'react';

const RULE_SECTIONS = [
  {
    id: 'basics',
    title: 'L\'essentiel',
    icon: '📌',
    rules: [
      { title: 'Format de jeu', content: 'Un match se joue en 3 sets gagnants (best of 5). Chaque set se joue à 25 points, avec au moins 2 points d\'écart. En cas de 5ème set, on joue à 15 points.' },
      { title: 'Équipes', content: '6 joueurs de chaque côté sur le terrain. Une équipe peut avoir jusqu\'à 6 remplaçants et un libero. Maximum 6 remplacements réguliers par set.' },
      { title: 'Service', content: 'Le service est effectué depuis la zone de service derrière la ligne de fond. Le ballon doit passer au-dessus du filet dans le terrain adverse. Un service faute entraîne un point adverse.' },
      { title: 'Point à chaque échange', content: 'Depuis 1999 (système rally point), un point est marqué à chaque échange, quelle que soit l\'équipe qui a servi. L\'équipe qui marque récupère le service.' },
    ],
  },
  {
    id: 'touches',
    title: 'Contacts et fautes',
    icon: '✋',
    rules: [
      { title: 'Maximum 3 touches', content: 'Une équipe a droit à 3 touches pour renvoyer le ballon. Le contre (block) ne compte pas comme une touche d\'équipe.' },
      { title: 'Double touche', content: 'Un joueur ne peut pas toucher le ballon deux fois consécutivement (sauf lors du contre).' },
      { title: 'Faute au filet', content: 'Toucher le filet pendant le jeu est une faute, sauf si cela ne perturbe pas le jeu adverse. Toucher la bande supérieure est toujours une faute.' },
      { title: 'Ballon sur les limites', content: 'Un ballon qui tombe sur la ligne est considéré "dans". Un ballon qui sort des antennes est hors.' },
    ],
  },
  {
    id: 'positions',
    title: 'Rotation et positions',
    icon: '🔄',
    rules: [
      { title: 'Rotation obligatoire', content: 'À chaque changement de service, l\'équipe qui récupère le service tourne dans le sens des aiguilles d\'une montre.' },
      { title: 'Faute de position', content: 'Au moment du service, chaque joueur doit être dans sa position de rotation. Le non-respect entraîne une faute de position.' },
      { title: 'Règle des 3 mètres', content: 'Les joueurs arrière (rangs 1, 5, 6) ne peuvent pas attaquer au-dessus du niveau du filet depuis la zone avant (les 3 premiers mètres).' },
      { title: 'Libero', content: 'Le libero porte un maillot différent. Il ne peut pas attaquer au-dessus du filet, servir, ni bloquer. Il peut remplacer tout joueur arrière sans que cela compte comme remplacement.' },
    ],
  },
  {
    id: 'special',
    title: 'Situations spéciales',
    icon: '⚡',
    rules: [
      { title: 'Time-outs', content: 'Chaque équipe a droit à 2 time-outs de 30 secondes par set. Des time-outs techniques automatiques à 8 et 16 points sont prévus dans certaines compétitions.' },
      { title: 'Pénétration sous le filet', content: 'Passer partiellement sous le filet n\'est pas une faute si cela ne gêne pas l\'adversaire. Passer complètement sous le filet est une faute.' },
      { title: 'Ballon tenu', content: 'Le contact avec le ballon doit être bref. Un ballon "tenu" (porté, lancé) est une faute. La manchette peut être plus prolongée sans être fautée si c\'est un seul geste.' },
      { title: 'Coup de sifflet', content: 'Le jeu s\'arrête au coup de sifflet de l\'arbitre. Si le ballon est en jeu au moment d\'une interruption autorisée, l\'échange est à rejouer.' },
    ],
  },
];

export default function Rules() {
  const [open, setOpen] = useState<string | null>('basics');

  return (
    <div className="space-y-8">
      <div>
        <div className="text-yellow-400 text-xs uppercase tracking-widest mb-2">Documentation</div>
        <h1 className="text-4xl font-bold text-white mb-3">Règles du volleyball</h1>
        <p className="text-gray-400">Règlement FIVB simplifié — les règles essentielles pour comprendre et jouer.</p>
      </div>

      <div className="border-2 border-yellow-400/30 bg-yellow-400/5 px-6 py-4 text-sm text-yellow-200">
        ⚠️ Cette page est un résumé pédagogique. Pour les compétitions officielles, référez-vous au <span className="text-yellow-400">règlement FIVB officiel</span>.
      </div>

      <div className="space-y-2">
        {RULE_SECTIONS.map(section => (
          <div key={section.id} className="border-2 border-gray-700 overflow-hidden">
            <button
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-900 transition-colors"
              onClick={() => setOpen(open === section.id ? null : section.id)}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{section.icon}</span>
                <span className="text-white font-bold">{section.title}</span>
              </div>
              <span className={`text-yellow-400 text-lg transition-transform ${open === section.id ? 'rotate-45' : ''}`}>+</span>
            </button>
            {open === section.id && (
              <div className="border-t border-gray-700 divide-y divide-gray-800">
                {section.rules.map(rule => (
                  <div key={rule.title} className="px-6 py-4">
                    <div className="text-yellow-400 text-sm font-bold mb-1">{rule.title}</div>
                    <p className="text-gray-400 text-sm leading-relaxed">{rule.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick reference */}
      <div className="border-2 border-gray-700 p-6">
        <div className="text-yellow-400 text-xs uppercase tracking-widest mb-4">Référence rapide — fautes courantes</div>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            'Toucher le filet pendant le jeu',
            'Plus de 3 touches par équipe',
            'Double touche d\'un même joueur',
            'Ballon tenu / porté',
            'Attaque de la zone arrière au-dessus du filet',
            'Faute de pied au service (marcher sur la ligne)',
            'Service avant le coup de sifflet',
            'Faute de position à la rotation',
          ].map(fault => (
            <div key={fault} className="flex items-start gap-2 text-sm text-gray-400">
              <span className="text-red-400 mt-0.5">✗</span>
              {fault}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
