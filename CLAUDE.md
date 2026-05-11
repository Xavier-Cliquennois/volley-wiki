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
- Setters on our side face the antenne gauche (rotation `-π/2`) instead of the net.

## Scroll behaviour

- `App.tsx` has a `ScrollToTop` component that scrolls window to top on every route change.
- The scenario player auto-scrolls only the inner step strip horizontally, never the page.
