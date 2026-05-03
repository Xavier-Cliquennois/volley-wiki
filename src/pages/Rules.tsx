import { useState } from 'react';

const RULE_SECTIONS = [
  {
    id: 'basics',
    title: "L'essentiel",
    icon: '📌',
    rules: [
      { title: 'Format de jeu', content: "Un match se joue en 3 sets gagnants (best of 5). Chaque set se joue à 25 points, avec au moins 2 points d'écart. En cas de 5ème set, on joue à 15 points." },
      { title: 'Équipes', content: "6 joueurs de chaque côté sur le terrain. Une équipe peut avoir jusqu'à 6 remplaçants et un libero. Maximum 6 remplacements réguliers par set (libero non compté)." },
      { title: 'Service', content: 'Le service est effectué depuis la zone de service derrière la ligne de fond. Le ballon doit passer au-dessus du filet dans le terrain adverse. Le serveur dispose de 8 secondes après le coup de sifflet pour frapper. Un service qui touche le filet et retombe dans le terrain adverse est BON (let serve légal depuis 2001).' },
      { title: 'Point à chaque échange', content: "Depuis 1999 (système rally point), un point est marqué à chaque échange, quelle que soit l'équipe qui a servi. L'équipe qui marque récupère le service." },
    ],
  },
  {
    id: 'touches',
    title: 'Contacts et fautes',
    icon: '✋',
    rules: [
      { title: 'Maximum 3 touches', content: "Une équipe a droit à 3 touches pour renvoyer le ballon. Le contre (block) ne compte pas comme une touche d'équipe — l'équipe a toujours 3 touches après un contre." },
      { title: 'Double touche', content: "Un joueur ne peut pas toucher le ballon deux fois consécutivement, sauf lors du premier contact d'équipe (réception/défense). Exception au contre. Nouveauté test FIVB 2025-2026 : double-contact autorisé lors de l'action de passe (2e touche) tant que le ballon reste du même côté." },
      { title: 'Faute au filet', content: `Toucher le filet pendant l'action de jouer le ballon est une faute. Toucher hors action ou hors antennes n'est pas une faute. Passer partiellement sous le filet est autorisé si cela ne gêne pas l'adversaire. Objectif FIVB 2025 : "promouvoir le jeu fluide".` },
      { title: 'Ballon sur les limites', content: `Un ballon qui tombe sur la ligne est considéré "dans". Un ballon qui sort des antennes ou passe hors de l'espace de passage est hors.` },
    ],
  },
  {
    id: 'positions',
    title: 'Rotation et positions',
    icon: '🔄',
    rules: [
      { title: 'Rotation obligatoire', content: "À chaque récupération de service, l'équipe gagnante tourne dans le sens des aiguilles d'une montre : P2→P1, P3→P2, P4→P3, P5→P4, P6→P5, P1→P6. Le joueur en P2→P1 devient le nouveau serveur." },
      { title: 'Faute de position', content: "Au moment de la frappe du serveur, les joueurs doivent respecter leur ordre de rotation (pas de chevauchement diagonal). Faute = point + service à l'adversaire. Nouveauté 2025 : la règle d'overlap ne s'applique plus qu'à l'équipe en RÉCEPTION — l'équipe au service peut se positionner librement." },
      { title: 'Règle des 3 mètres', content: "Les joueurs arrière (P1, P5, P6) ne peuvent pas attaquer au-dessus du filet depuis la zone avant. Ils peuvent sauter depuis derrière la ligne des 3 m et atterrir en zone avant — c'est légal." },
      { title: 'Libero', content: 'Le libero porte un maillot contrastant et joue uniquement en arrière (P1, P5, P6). Remplacements illimités non comptés. Ne peut pas bloquer ni attaquer au-dessus du filet. Peut servir depuis 2021 dans une seule rotation par set. Peut être capitaine depuis 2021. Restriction : si le libero fait une passe haute à 10 doigts depuis la zone avant, le coéquipier ne peut pas attaquer le ballon au-dessus du filet.' },
    ],
  },
  {
    id: 'special',
    title: 'Situations spéciales',
    icon: '⚡',
    rules: [
      { title: 'Time-outs', content: 'Chaque équipe a droit à 2 time-outs de 30 secondes par set. Des time-outs techniques automatiques aux 8e et 16e points dans les sets 1-4 sont prévus dans certaines compétitions FIVB.' },
      { title: 'Service — règles clés', content: "8 secondes pour frapper après le sifflet. Un seul lancer autorisé, mais le serveur peut laisser tomber le ballon une fois sans pénalité. Faute de pied : au moment de la frappe (ou l'impulsion en saut), le serveur ne doit pas toucher la ligne de fond ni le terrain. Service masqué : les coéquipiers ne doivent pas lever les mains au-dessus de la tête pendant le service (règle 2025)." },
      { title: 'Attaque arrière', content: 'Un joueur arrière peut attaquer si son appel est derrière la ligne des 3 m (les 2 pieds). Il peut aussi frapper le ballon si une partie est sous le niveau du filet. Bloquer ou attaquer le service au-dessus du filet en zone avant est une faute.' },
      { title: 'Ballon tenu', content: `Le contact avec le ballon doit être bref et net. "Ugly contact ≠ fault" : un contact imparfait n'est pas automatiquement une faute si le ballon rebondit. Standard plus permissif pour la manchette que pour la passe haute.` },
    ],
  },
  {
    id: 'nouveautes2025',
    title: 'Nouveautés FIVB 2025-2028',
    icon: '🆕',
    rules: [
      { title: 'Overlap : seulement en réception', content: "Depuis 2025, la règle d'overlap (chevauchement) ne s'applique plus qu'à l'équipe en réception. L'équipe au service peut occuper n'importe quelle position sur le terrain au moment du service." },
      { title: 'Anti-écran au service', content: "Il est désormais interdit pour les joueurs de l'équipe au service de lever les mains au-dessus de la tête pendant le service jusqu'au franchissement du filet. Un écran de ce type est directement sanctionné." },
      { title: 'Double-contact en passe — test', content: "Test FIVB 2025-2026 : le double-contact lors de l'action de passe (2e touche) est autorisé tant que le ballon reste du même côté du terrain. Si le test est concluant, la règle pourrait être permanente." },
      { title: 'Libero peut servir (depuis 2021)', content: "Le libero peut servir depuis 2021 dans une seule rotation par set. Règle variable selon les fédérations (certains tournois USAV et NFHS ne l'autorisent pas — vérifier le règlement de la compétition)." },
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
            "Double touche d'un même joueur",
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
