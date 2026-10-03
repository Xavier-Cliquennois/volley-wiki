# volley-wiki

Wiki français du volley-ball, en indoor (6v6, avec adaptations 5v5 et 4v4) et en beach. Positions, rotations, systèmes de jeu (5-1, 6-2, 4-2), guides techniques et tactiques, exercices, quiz et un lecteur de scénarios en 3D.

Publié sur <https://volley-wiki.fr>.

## Stack

React, Vite et TypeScript, Tailwind pour le style, `@react-three/fiber` et `gsap` pour le lecteur 3D, `i18next` pour les 8 langues (fr, en, es, it, ja, pl, pt, tr ; le français sert de repli), rendu statique par `react-ssg`.

## Démarrer

Le gestionnaire de paquets est **pnpm**.

```bash
pnpm install
pnpm dev        # serveur de développement
pnpm lint       # eslint
pnpm build      # tsc -b puis vite build, sortie dans dist/
pnpm preview    # sert dist/ en local
```

Il n'y a pas de tests automatiques : `pnpm lint` et `pnpm build` font office de vérification, puis on regarde l'interface tourner.

## Organisation du code

| Chemin | Contenu |
|---|---|
| `src/routes.tsx` | Routes, préfixées par la langue (`/:lang/…`), avec une branche `beach/` |
| `src/pages/`, `src/guides/` | Pages et guides |
| `src/systems/` | Systèmes de jeu et `RotationDiagram` (terrain 2D) |
| `src/scenarios/`, `src/3d/`, `src/editor/` | Scénarios, lecteur 3D, éditeur de scénarios |
| `src/drills/`, `src/quiz/` | Catalogue d'exercices et module de quiz |
| `src/constants/positions.ts` | Palette des positions (voir `CLAUDE.md`) |
| `src/locales/` | Traductions par langue |
| `docs/` | Matériel de référence et contenu source, pas de plan de travail |

## Déploiement

`Dockerfile` construit le site et le sert avec nginx ; `docker-compose.prod.yml` le publie derrière Traefik.

## Contribuer

Tout travail part d'un ticket du dépôt, suivi dans le [projet Volley Wiki](https://github.com/users/Xavier-Cliquennois/projects/6). Les conventions (tickets, labels, vagues d'agents, commits, palette des positions, système de coordonnées 3D) sont dans [`CLAUDE.md`](./CLAUDE.md).
