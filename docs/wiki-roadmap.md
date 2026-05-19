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

### 3.1 — Lecture du jeu / scouting (Intermédiaire+)
Comment **lire l'adversaire** avant et pendant un échange.
- Indices au service : pied d'appel, position relative au filet, regard du serveur.
- Lecture de la passe adverse : qui va attaquer ? Quel tempo ? Comment le contre se positionne.
- Lecture du frappeur : épaules, course d'approche, bras armé.
- Idéal en format `/guides/lecture-du-jeu` avec animations sur le terrain 3D existant.

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

### 3.4 — Comparatif indoor ↔ beach
Maintenant qu'on a les deux branches.
- Tableau des différences (taille du terrain, nombre de joueurs, hauteur du filet, règles spécifiques).
- Adaptations techniques (manchette beach vs indoor, service flottant vs jump, set vs passe…).
- Quand passer de l'un à l'autre (saisons, profil de joueur).

### 3.5 — Erreurs typiques par poste
Format court, très pédagogique (Débutant) :
- Passeur : se précipiter, ne pas regarder la cible, mauvaise pénétration.
- Pointu : attaquer en force sans regarder le bloc, oublier la pipe.
- Central : suivre la balle au lieu de lire le passeur, lâcher trop tôt en quick.
- Aile : ne pas alterner les tirs, course d'approche trop longue.
- Libéro : sortir de sa zone autorisée, geste sur la 2ᵉ touche au filet.

### 3.6 — Signaux d'arbitre
Geste par geste (fault, side-out, time-out, replay, etc.). Page courte mais utile pour les joueurs qui apprennent à arbitrer en interne.

---

## 4. Petits ajouts à faible coût

- [ ] **Pénétration animée** sur le 5-1 : le passeur a un mouvement, le central dégage. Pas que des flèches statiques. (~1 jour) — flèche statique livrée, animation à ajouter.
- [x] **Hover sur les pastilles joueurs** : tooltip avec rôle (FR : Passeur / Pointu / …) + clic = navigation vers `/positions/<size>/<system>` quand un mapping existe.
- [x] **Légende du diagramme** : cartouche affiché sous chaque diagramme (1er tempo orange plein, 2e tempo gris pointillé, mouvement teal pointillé fin quand le toggle est actif).
- [x] **Lien depuis `/positions/6/5-1`** vers `/systems/5-1` (et inversement) — bouton « VOIR LE SYSTÈME → » côté Positions, bouton « VOIR LES POSTES → » côté Systems, étendu à tous les couples (6v6/5v5/4v4).
- [ ] **Bouton « test rapide »** sur chaque page de guide : 3 questions à choix multiples sans persistance.
- [ ] **i18n des contenus de rotation** (FR seulement aujourd'hui — extraire vers les locales).
- [ ] **Mode sombre** : le design system retro est en cream/ink, un mode sombre demanderait une variante du palette mais reste faisable.

---

## 5. Priorisation suggérée

| Priorité | Tâche | Pourquoi |
|---|---|---|
| ✅ P0 | Compléter 5-1 (flèches secondaires + cards interactives) | Livré |
| ✅ P1 | Authoring 6-2 et 4-2 | Livré (en place + cartes hub actives) |
| ✅ P1 | Tag scénarios par système/rotation | Livré (tags + filtre URL + lien depuis rotations) |
| 🟡 P2 | Lecture du jeu (guide) | Gros impact pédagogique pour intermédiaires |
| 🟡 P2 | Comparatif indoor ↔ beach | Peu de boulot, comble un vrai trou |
| 🟢 P3 | Quiz interactif | Engageant mais demande du temps de dev |
| 🟢 P3 | Erreurs typiques + signaux arbitre | Petites pages utiles à glisser quand l'envie passe |
| 🟢 P3 | Exercices / drills | Beaucoup de rédaction, peu de tech — bon contenu de fond |

---

## 6. Décisions de design en cours à valider

- **Flèches multiples vs toggle « voir tous les mouvements »** : tout afficher est lisible aujourd'hui (3-4 flèches max). Au-delà, prévoir un toggle.
- **Niveau global persisté** : actuellement valable pour tout le wiki — à confirmer si on veut que certaines pages forcent un niveau.
- **Cartes 6-2 et 4-2 grisées** : OK pour l'instant ; à activer dès que le contenu est prêt.
- **Diagramme 2D vs animations 3D** : 2D top-down pour rotations (clair, peu coûteux). 3D réservé aux scénarios existants.
