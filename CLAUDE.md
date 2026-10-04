# CLAUDE.md

Project context for AI assistants working on `volley-wiki`.

## Project

`volley-wiki` is a French volleyball wiki built with React + Vite + TypeScript and rendered with Tailwind. It targets indoor 6v6 but adapts content for 5v5 and 4v4 formats. The 3D scenario player uses `@react-three/fiber` + `gsap`.

## Position colour palette (single source of truth)

These colours are used everywhere positions are visualized: position cards, court diagrams, scenario players (3D), guides. Keep them in sync between code and this file.

| Position | Hex       | Role                       | Notes                                  |
|----------|-----------|----------------------------|----------------------------------------|
| P1       | `#9b59b6` | Opposé (opposite, "pointu")| Purple                                 |
| P2       | `#e74c3c` | Passeur (setter)           | Red                                    |
| P3       | `#2ecc71` | Central (middle, front)    | Green                                  |
| P4       | `#3498db` | Aile (outside, front)      | Blue                                   |
| P5       | `#f0c84c` | Aile (outside, back)       | Retro yellow (--yellow token) — harmonized with design system |
| P6       | `#e67e22` | Central (middle, back)     | Orange                                 |
| L        | `#ec4899` | Libéro                     | Magenta — distinct contrasting jersey  |

Code locations:
- `src/constants/positions.ts` exports `ROLE_COLORS` for guides, court diagrams, 3D zones.
- `src/scenarios/data/_shared.ts` exports `COLORS` for scenario players (by role rather than by zone).

When a position colour changes, update **both** files **and** this table.

## Team-size aware content

The wiki supports three formats. Several pages let the user toggle between them:
- `/positions` — toggle 4 / 5 / 6
- `/guides/positionnement-defense` — toggle 4 / 5 / 6
- `/scenarios` — each scenario declares its own `teamSize` (4 | 5 | 6)

When adding new scenarios, ensure each format gets coverage of attack / defense / reception variants where it makes sense.

## Coordinate system (3D)

- Court is 9 m wide (X) x 18 m long (Z). Net at z = 0.
- Our side: z > 0. Opponent side: z < 0.
- Y is height.
- FIVB positions on our side (looking from behind):
  - Front row: P4 (x<0) — P3 (x=0) — P2 (x>0)
  - Back row: P5 (x<0) — P6 (x=0) — P1 (x>0)

### Orientation des joueurs

Règle unique, calculée par `computeFacing` (`src/scenarios/facing.ts`) et appliquée
par le lecteur (`ScenarioScene.tsx`, actions `player_face` jouées par
`useTactic.ts`). Les fichiers de scénario n'ont rien à déclarer.

- **Tout le monde fait face au filet** par défaut : rotation `π` dans notre camp,
  `0` en face. Attente, réception, défense, contre, couverture : face au filet,
  quel que soit le rôle ou la zone. Un passeur arrière qui attend (zone 1, 5 ou 6)
  regarde donc le filet, pas la ligne de côté.
- **Celui qui passe se tourne vers SON antenne gauche** pendant la passe : geste
  `SET` dont la balle reste dans son camp. Il pivote pendant l'arrivée de la balle
  (au plus 0,6 s avant le contact), passe de profil, puis se retourne face au filet
  0,05 s après pour couvrir. Notre antenne gauche est en x < 0 (rotation `-π/2`),
  celle de l'adversaire en x > 0 (rotation `+π/2`). La règle suit le geste, pas le
  rôle : un pointu ou un ailier qui joue la 2ᵉ touche se tourne aussi, le passeur
  adverse aussi.
- Une passe jouée à plus de 3 m du filet tourne le passeur vers le point visé
  plutôt que vers l'antenne. Une balle poussée par-dessus le filet avec le geste
  `SET` ne tourne personne.
- Un joueur qui tient la balle au début du scénario et la passe en première
  touche démarre déjà de profil.

### Touches de balle (règle FIVB, vérifiée par `pnpm check:scenarios`)

Tout scénario, nouveau ou corrigé, respecte ces règles :

- **3 touches maximum** par équipe avant de renvoyer la balle.
- **Jamais deux touches de suite par le même joueur.** Seule exception : le contre
  ne compte pas comme une touche, et le contreur peut jouer la touche suivante.
  Une attaque après réception, c'est donc : réception (A), passe (B ≠ A), attaque
  (C ≠ B).
- **En 4v4, les 3 touches sont jouées par 3 joueurs différents** : réceptionneur,
  passeur, attaquant ; le quatrième couvre. C'est plus strict que la FIVB (qui
  laisse le réceptionneur attaquer), c'est le choix du wiki pour ses formations
  4v4. Si un scénario ne tient pas avec 4 joueurs, le dire dans le ticket plutôt
  que tricher sur la règle.

`pnpm check:scenarios` (`scripts/check-scenarios.ts`) compile chaque scénario
comme le site, rejoue la timeline et relève qui touche la balle à chaque étape
(`--verbose` pour la liste, un id de scénario en argument pour le restreindre). Il
signale aussi une balle qui change de trajectoire en l'air sans que personne ne la
touche. Il sort en erreur au moindre défaut.

## Scroll behaviour

- `App.tsx` has a `ScrollToTop` component that scrolls window to top on every route change.
- The scenario player auto-scrolls only the inner step strip horizontally, never the page.

## Tickets : notre façon de travailler

**Tout travail part d'un ticket GitHub** (`Xavier-Cliquennois/volley-wiki`). Pas de
code sans ticket, pas de ticket fermé sans preuve.

### Titre

`<portée>: <ce que le ticket rend vrai>`, en français, en minuscules :

```
scenarios: le 5v5 a une réception en W et une réception en W inversé
positions: la bascule 4 / 5 / 6 garde la position choisie au changement de page
guides: le guide d'attaque cite la source des schémas
```

Portées : `scenarios`, `positions`, `guides`, `drills`, `quiz`, `court` (terrain 2D
et 3D), `player` (lecteur 3D), `ui`, `i18n`, `seo`, `infra`, `docs`, `epic`.

### Corps

```markdown
## Contexte

Pourquoi ce ticket existe, ce qu'on sait déjà.

## Sources

- `src/scenarios/data/_shared.ts` : ce qu'on y lit
- `docs/Wiki complet du beach.md`, section « Réception » : ce qu'on y reprend
- Le ticket dont ce ticket reprend le résultat (#N)

## À faire

- [ ] Étape concrète et vérifiable

## Fini quand

Le critère observable qui permet de fermer : une page qui s'affiche, un scénario
qui se joue, `pnpm build` qui passe.

## Note (facultatif)

Limite connue, piste écartée et pourquoi.
```

« Fini quand » et « Sources » sont obligatoires (« Sources » sauf pour un epic).
**Un agent ne doit rien avoir à chercher** : chaque fichier utile est cité avec son
chemin, et pour un document long la section. « Fini quand » décrit **un
résultat**, pas une activité.

### Labels

Chaque ticket porte **exactement un label de chaque groupe** :

| Groupe | Labels | Sens |
|---|---|---|
| Priorité | `P0`, `P1`, `P2` | `P0` bloque, `P1` attendu, `P2` bonus |
| Modèle | `opus`, `sonnet`, `manuel` | Le modèle à lancer, ou `manuel` si c'est une personne |

- `opus` : conception, schéma, diagnostic, ou plusieurs modules à la fois.
- `sonnet` : changement borné, dont le ticket dit déjà quoi faire et comment le
  vérifier.
- `manuel` : fait par une personne. **Aucun agent ne le lance.** La session qui
  orchestre le signale quand il bloque une vague.
- Dans le doute, `opus`.
- `epic` en plus pour un ticket qui regroupe d'autres tickets : son « À faire » est
  la liste des tickets (`- [ ] #12 : …`) et sa section `## Vagues` dit quoi lancer
  ensemble.

### Dépendances

**Dépendances natives de GitHub** (`blocked by` / `blocking`), pas une mention dans
le texte. Tickets attaquables, recalculés plutôt que lus sur le board :

```bash
gh issue list --state open --limit 200 --json number,title,blockedBy \
  --jq '.[] | select([.blockedBy.nodes[] | select(.state != "CLOSED")] | length == 0) | "\(.number)\t\(.title)"'
```

### Board

Projet GitHub n°6 du compte, champ `Status` :
**Bloqué / Prêt / En cours / À tester / Terminé**.

- `À tester` : le code est écrit et `pnpm lint` + `pnpm build` passent, mais une
  vérification visuelle reste à faire. La liste va **en commentaire du ticket**.
- **Ne pas modifier les options de `Status`** sans sauvegarder le board : l'API
  recrée les options avec de nouveaux identifiants et efface le statut des cartes.

Board : <https://github.com/users/Xavier-Cliquennois/projects/6>

Identifiants des options de `Status` : `Bloqué` = `e3469209`, `Prêt` = `f378d8d9`,
`En cours` = `a10cdce7`, `À tester` = `edd492df`, `Terminé` = `79a31e95`. Ils
changent si les options sont recréées.

Changer le statut d'un ticket :

```bash
ITEM=$(gh project item-list 6 --owner Xavier-Cliquennois --limit 300 --format json \
  --jq '.items[] | select(.content.number == <N>) | .id')
gh project item-edit --id "$ITEM" --project-id PVT_kwHOAGkC_M4Blicw \
  --field-id PVTSSF_lAHOAGkC_M4BlicwzhkO8wI --single-select-option-id 79a31e95
```

Quand un ticket se ferme, ceux qu'il débloquait et qui n'attendent plus rien
passent de **Bloqué** à **Prêt**. Un nouveau ticket est rattaché à son epic en
**sous-issue** et ajouté à sa liste.

## Deux branches : `dev` pour développer, `main` pour livrer

Le site est en production sur `volley-wiki.fr`. Pour ne pas multiplier les builds
et les déploiements (et ce qu'ils coûtent), **on livre par lots** :

```
branche de ticket ──PR──▶ dev ──PR de promotion──▶ main ──▶ production
```

- **`dev`** est la branche d'intégration. **Chaque ticket part de `dev`** et y
  revient par une PR. Rien ne se déploie.
- **`main`** est la branche de production. Elle ne reçoit **que** des promotions de
  `dev`, jamais une branche de ticket, jamais un commit de développement. Elle doit
  rester déployable à tout instant.
- **Promotion `dev` → `main`** : décidée par Xavier, quand le lot est vérifié
  (`pnpm lint` et `pnpm build` verts sur `dev`, et le lot regardé dans le
  navigateur). **Aucun agent ne promeut.** La session qui orchestre propose la
  promotion quand une vague est terminée.
- **Correctif urgent en production** : seul cas qui contourne `dev`. Branche
  `hotfix/<N>-<mots-cles>` coupée dans `origin/main`, PR vers `main`, puis report
  immédiat dans `dev`.
- **Un hook garde `main`** (`.claude/hooks/guard-main.py`, branché dans
  `.claude/settings.json`) : refuse un `git push` vers `main`, un `gh pr create
  --base main` ou un `gh pr merge` vers `main` dont la branche source n'est ni
  `dev` ni `hotfix/*`. S'il te bloque, ta PR vise la mauvaise base : vise `dev`, ne
  cherche pas à le contourner.

```bash
# Promotion, par Xavier
gh pr create --base main --head dev --title "release: <lot>"
gh pr merge <n> --merge   # jamais --squash ni --delete-branch : dev est permanente
git fetch origin && git push origin origin/main:dev   # remet dev à niveau, sans checkout
```

Fusion par merge commit pour la promotion, pour que `dev` et `main` ne divergent
pas. Aucun commit de développement directement sur `dev` ni sur `main`.

## On travaille par vagues, jusqu'à 4 agents en même temps

La session principale **orchestre** : elle lance les sous-agents, elle ne code pas
elle-même les tickets. **Jusqu'à 4 sous-agents en parallèle**, un par ticket, chacun
dans son worktree.

Règles pour composer une vague :

- **Pas de dépendance entre deux tickets d'une même vague.**
- **Pas deux tickets sur les mêmes fichiers.** Sont tolérés, parce que chaque agent
  se rebase avant de merger : `package.json`, `pnpm-lock.yaml`, `src/App.tsx`,
  les fichiers de routes et de traductions i18n.
- **4 tickets maximum.** Au-delà, deux vagues.
- Une vague d'un seul ticket est un goulot : le dire dans l'epic.

Pour lancer une vague : **un seul message** avec un appel `Agent` par ticket,
`isolation: "worktree"`, `run_in_background: true`, et le modèle du label. Chaque
agent reçoit son numéro de ticket et la consigne de le lire en entier avant de
commencer.

**Les vagues sont un guide, les dépendances font foi.** Quand un agent finit, la
session recalcule les tickets attaquables et lance tout de suite celui qui vient de
se libérer, dans la limite de 4 agents et de la règle des fichiers. Elle passe à
**Prêt** les tickets libérés et à **En cours** ceux qu'elle lance. Quand un ticket
est créé, découpé ou reçoit une dépendance, la section `## Vagues` de son epic est
mise à jour dans la foulée.

## Un sous-agent travaille dans un worktree, et referme tout seul

Un sous-agent ne touche à aucun fichier qu'il n'a pas à modifier pour son ticket.
Quand sa tâche est **finie et vérifiée**, il referme tout, dans cet ordre, sans
attendre qu'on le lui demande :

1. **Les vérifications passent** : `pnpm lint` et `pnpm build`, plus
   `pnpm check:scenarios` dès que le ticket touche un scénario 3D
   (`src/scenarios/`, `src/editor/`, `src/3d/`). Sinon il **ne merge pas** : il
   laisse la branche, dit pourquoi dans le ticket, et s'arrête.
2. **Le rebase** sur `origin/dev`, puis les vérifications relancées. Un conflit sur
   `pnpm-lock.yaml` ne se résout pas à la main : reprendre la version de `dev` et
   relancer `pnpm install`. Si le conflit touche le fond du ticket d'un autre agent,
   s'arrêter et le signaler dans le ticket.
3. **La PR** vers `dev` : ce que le changement rend vrai, ce qui a été vérifié et
   ce qui ne l'est pas, avec `Refs #N` (pas `Closes`, qui fermerait le ticket même
   avec des cases non cochées).
4. **Le merge tout de suite** dans `dev` : `gh pr merge <n> --rebase`.
5. **Le ticket** : cocher les cases réellement faites, commenter le reste, passer la
   carte à **Terminé** (ou **À tester**, liste en commentaire), fermer le ticket si
   tout est coché, cocher sa ligne dans l'epic.
6. **Le ménage**, en dernier : worktree (`git -C <arbre principal> worktree remove`,
   puisque le worktree est le répertoire courant), branche locale (`git branch -D`),
   branche distante (`git push origin --delete`), puis `git worktree prune`.

Le worktree part de `dev` : `git worktree add <chemin> -b <branche> origin/dev
--no-track` (sans `--no-track`, un `git push` nu viserait `dev`). Premier envoi :
`git push -u origin <branche>`.

Branche : `<N>-<portee>-<mots-cles>`, par exemple `12-scenarios-reception-5v5`.

## Tests dans un navigateur

Pour regarder l'interface tourner, on utilise les outils `mcp__claude-in-chrome__*`
et **pas** Playwright. Charger les outils avec `ToolSearch` avant le premier appel,
commencer par `tabs_context_mcp`. Si une instance de `pnpm dev` tourne déjà, en
lancer une autre sur un autre port plutôt que de la tuer.
