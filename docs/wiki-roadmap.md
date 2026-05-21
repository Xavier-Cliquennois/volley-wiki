# Roadmap — Volley-Wiki

État des pistes discutées pour enrichir le wiki, avec ce qui est déjà livré et ce qui reste à faire.

---

## 1. Ce qui est en place

- **Toggle de niveau global** (`Débutant / Intermédiaire / Avancé`) avec persistance localStorage.
- **Composants génériques** : `useUserLevel`, `<LevelSwitcher>`, `<LevelFilterPanel>`, `<LeveledContent>`.
- **Page `/systems`** : hub avec cartes 5-1, 6-2, 4-2 (5-1 cliquable, 6-2 et 4-2 marquées « bientôt disponible »).
- **Page `/systems/5-1`** complète : philosophie, avantages/inconvénients, 6 rotations.
- **Composant `<RotationDiagram>`** : terrain 2D avec joueurs aux zones FIVB + flèches d'attaque (quick MB en orange plein, ailes et pipe en pointillés gris).
- **Détails à 3 niveaux** pour chaque rotation : Débutant (forces/faiblesses), Intermédiaire (overlap + déplacement passeur), Avancé (transitions + signaux).
- **i18n** : nav `Systèmes` traduit dans les 8 langues ; contenu UI complet en FR + EN, le reste tombe sur FR via fallback.

---

## 2. Suite logique sur les systèmes de jeu

### 2.1 — Compléter le 5-1
- [x] **Flèches secondaires** (toggle « voir tous les mouvements ») : pénétration passeur livrée comme première itération. Restent à modéliser : déplacements des receveurs en W, course d'approche des attaquants, descente couverture (requiert des release positions authorées par rotation).
- [x] **Targets d'attaque par rotation** : `buildAttacks` factorisé via `frontAttackTarget` ; les cibles restent OH→aile gauche par défaut mais la mécanique d'extension par zone est en place.
- [x] **Attaque arrière du pointu (P1)** : flèche + card « Bic D / Bic centre / Bic A » générées pour les rotations où OPP est arrière.
- [x] **Cards d'options offensives** : hover/focus relie la card à sa flèche (autres flèches assombries, card surélevée).

### 2.2 — Authoring 6-2 ✅
- Livré : 6 rotations authorées (philosophie, pros/cons, summary + 5 niveaux de détail), `buildAttacks` reconnaît le passeur avant comme 3e attaquant.
- Reste optionnel : un toggle visuel pour distinguer S/S2, et appliquer le même affinage `frontAttackTarget` côté OH/MB que le 5-1.

### 2.3 — Authoring 4-2 ✅
- Livré : 6 rotations authorées, `frontSetterRole()` détecte le passeur distributeur, attaques OH alternées gauche/droite selon le côté du passeur actif.

### 2.4 — Versions par taille d'équipe
- 5v5 et 4v4 utilisent les mêmes systèmes (ou des variantes simplifiées). Le wiki gère déjà `teamSize` dans Positions et Scénarios — à étendre aux systèmes.

### 2.5 — Tag des scénarios par rotation ✅
- [x] Champs `system?: ScenarioSystemTag` et `rotation?: ScenarioRotationTag` ajoutés à `ScenarioConfig`, propagés depuis `EditorState.metadata`.
- [x] 9 scénarios taggés : 6 attaques 5-1 (mapping `pN→Rotation` selon zone du passeur), 1 attaque 4-2, 1 attaque 6-2, 2 réceptions (5-1 générique + 5-1 R4), 1 réception 4-2.
- [x] Filtres sur `/scenarios?system=…&rotation=…` : banner « FILTRE TACTIQUE » avec bouton EFFACER, auto-sélection `teamSize=6` quand un système est tagué.
- [x] Lien depuis chaque rotation : bouton « → N scénario(s) lié(s) » sur la `RotationCard` quand `countTaggedScenarios > 0`, navigue vers `/scenarios?system=…&rotation=…`.

---

## 3. Autres directions discutées au départ

### 3.1 — Lecture du jeu / scouting (Intermédiaire+) ✅
- [x] Guide livré à `/guides/lecture-du-jeu` (Intermédiaire, ~20 min) en 12 sections.
- [x] Règle d'or « Tu ne bloques pas le ballon — tu bloques l'attaquant ».
- [x] Séquence visuelle (eye work) en 3 phases : service, réception, bloc/défense.
- [x] Indices détaillés par moment : lire serveur (Débutant), lire passe adverse 1er contact (Inter.), lire passeur distributeur (Inter.), lire attaquant (Avancé), timing du bloc (Avancé).
- [x] Cadre IF/THEN avec table de 12 scénarios concrets.
- [x] Scouting pré-match : 4 axes (attaquants/passeur/serveurs/défense) + format feuille d'avant-match.
- [x] Erreurs classiques (cards jaunes) + drills progressifs niveaux 1-5.
- [x] Section "Scénarios liés" avec 6 scénarios tagués cliquables.
- [x] i18n FR (contenu) + EN (titres + listing dans hub).
- Sources : USA Volleyball, Coaching Volleyball, Athletes Untapped, Get The Pancake, Impact Volleyball Club, JVA, Mark Lebedew, HowToCoachVolleyball, ConsultaDeTodos, VolleyballOverview.

### 3.2 — Mode quiz interactif (toutes catégories)
Tests interactifs courts pour valider la compréhension.
- « Où dois-tu te placer ? » sur un terrain cliquable.
- Reconnaissance de rotations à partir d'un schéma.
- Choix de l'option d'attaque selon la qualité de la réception.
- Capitalise sur le moteur 3D et le composant `Court`. ~1-2 semaines de dev.

### 3.3 — Exercices / drills (Coachs et capitaines)
Pour chaque skill (passe, attaque, défense, service, contre) :
- Objectif technique
- Mise en place (matos, joueurs, durée)
- Variantes débutant / intermédiaire / avancé
- Critères de réussite
- ~30 drills à rédiger → gros volume de contenu, peu de tech.

### 3.4 — Comparatif indoor ↔ beach ✅
- [x] Guide livré à `/guides/indoor-vs-beach` (Tactique, ~15 min, Intermédiaire) en 7 sections.
- [x] Tableau comparatif 16 lignes (joueurs, terrain, règles, contre, set, etc.) avec marker ★ orange sur les différences à fort impact.
- [x] Adaptations techniques skill par skill (service, réception, set, attaque, contre, défense) en cartes indoor/beach côte à côte.
- [x] Adaptations tactiques (rôles dynamiques, signaux derrière le dos, pas de pénétration, vent, pas d'overlap).
- [x] Préparation physique spécifique (force sand, endurance, cheville, hydratation, protection solaire).
- [x] Quand passer de l'un à l'autre (5 profils-cas).
- [x] Pièges typiques de l'indoor → beach (5 erreurs en cartes jaunes).
- [x] 5 drills progressifs d'adaptation.
- [x] i18n FR (contenu) + EN (listing hub).
- Sources : AVP, VolleyballMag, Olympics.com, Pakmen, BetterAtBeach, JVA.

### 3.5 — Erreurs typiques par poste ✅
- [x] Guide livré à `/guides/erreurs-typiques` (Technique, ~10 min, Débutant).
- [x] 5 postes (Passeur, Pointu, Central, Aile, Libéro) × 4 erreurs chacun = 20 erreurs avec solution corrective pour chacune.
- [x] Cards colorées par poste (palette ROLE_COLORS partagée avec /positions).
- [x] i18n FR (contenu) + EN (listing hub).

### 3.6 — Signaux d'arbitre ✅
- [x] Guide livré à `/guides/signaux-arbitre` (Technique, ~5 min, Débutant).
- [x] 15 signaux FIVB avec pictogramme SVG inline + nom + description du geste + contexte d'utilisation.
- [x] i18n FR (contenu) + EN (listing hub).
- Sources : Judgemate, documentation officielle FIVB hand signals.

---

## 4. Petits ajouts à faible coût

- [x] **Pénétration animée** sur le 5-1 : flèche du passeur en pénétration animée via `<animate>` SVG (stroke-dashoffset → effet « fourmis qui marchent ») sur la flèche `movement` quand le toggle « Voir tous les mouvements » est actif. Anim seulement sur kind=movement, les flèches d'attaque restent statiques.
- [x] **Hover sur les pastilles joueurs** : tooltip avec rôle (FR : Passeur / Pointu / …) + clic = navigation vers `/positions/<size>/<system>` quand un mapping existe.
- [x] **Légende du diagramme** : cartouche affiché sous chaque diagramme (1er tempo orange plein, 2e tempo gris pointillé, mouvement teal pointillé fin quand le toggle est actif).
- [x] **Lien depuis `/positions/6/5-1`** vers `/systems/5-1` (et inversement) — bouton « VOIR LE SYSTÈME → » côté Positions, bouton « VOIR LES POSTES → » côté Systems, étendu à tous les couples (6v6/5v5/4v4).
- [ ] **Bouton « test rapide »** sur chaque page de guide : 3 questions à choix multiples sans persistance.
- [ ] **i18n des contenus de rotation** (FR seulement aujourd'hui — extraire vers les locales).

---

## 5. Priorisation suggérée

| Priorité | Tâche | Pourquoi |
|---|---|---|
| ✅ P0 | Compléter 5-1 (flèches secondaires + cards interactives) | Livré |
| ✅ P1 | Authoring 6-2 et 4-2 | Livré (en place + cartes hub actives) |
| ✅ P1 | Tag scénarios par système/rotation | Livré (tags + filtre URL + lien depuis rotations) |
| ✅ P2 | Lecture du jeu (guide) | Livré — 12 sections, IF/THEN, scouting, drills |
| ✅ P2 | Comparatif indoor ↔ beach | Livré — tableau 16 lignes + 7 sections |
| 🟢 P3 | Quiz interactif | Engageant mais demande du temps de dev |
| ✅ P3 | Erreurs typiques + signaux arbitre | Livré — 2 guides + 15 signaux SVG + 20 erreurs |
| 🟢 P3 | Exercices / drills | Beaucoup de rédaction, peu de tech — bon contenu de fond |

---

## 6. Décisions de design en cours à valider

- **Flèches multiples vs toggle « voir tous les mouvements »** : tout afficher est lisible aujourd'hui (3-4 flèches max). Au-delà, prévoir un toggle.
- **Niveau global persisté** : actuellement valable pour tout le wiki — à confirmer si on veut que certaines pages forcent un niveau.
- **Cartes 6-2 et 4-2 grisées** : OK pour l'instant ; à activer dès que le contenu est prêt.
- **Diagramme 2D vs animations 3D** : 2D top-down pour rotations (clair, peu coûteux). 3D réservé aux scénarios existants.
