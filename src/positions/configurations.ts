// Position configurations shared by the /positions page, the guides and the
// scenario player. Kept out of the page component file so Fast Refresh only
// sees components there.
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import i18nDefault from '../i18n';

export type ZoneId = 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6' | 'L';
export type TeamSize = 4 | 5 | 6;

export type CourtPos = { x: number; y: number };

export const POS_6v6_GRID: Record<ZoneId, CourtPos> = {
  P4: { x: 20, y: 22 },
  P3: { x: 50, y: 22 },
  P2: { x: 80, y: 22 },
  P5: { x: 20, y: 75 },
  P6: { x: 50, y: 75 },
  P1: { x: 80, y: 75 },
  L:  { x: 50, y: 92 },
};

const NUMBER_BY_ZONE: Record<ZoneId, string> = {
  P4: '④', P3: '③', P2: '②', P5: '⑤', P6: '⑥', P1: '①', L: 'L',
};

// Per-configuration layout: which zones appear in the configuration + court
// positions. The textual content (name/role/description/skills/traits) is
// resolved from i18n.
type ConfigLayoutEntry = { zoneId: ZoneId; court: CourtPos };
export type ConfigLayout = {
  id: string;
  hasLibero: boolean;
  positions: ConfigLayoutEntry[];
};

export const CONFIG_LAYOUTS: Record<TeamSize, ConfigLayout[]> = {
  6: [
    {
      id: '5-1',
      hasLibero: true,
      positions: [
        { zoneId: 'P4', court: POS_6v6_GRID.P4 },
        { zoneId: 'P3', court: POS_6v6_GRID.P3 },
        { zoneId: 'P2', court: POS_6v6_GRID.P2 },
        { zoneId: 'P5', court: POS_6v6_GRID.P5 },
        { zoneId: 'P6', court: POS_6v6_GRID.P6 },
        { zoneId: 'P1', court: POS_6v6_GRID.P1 },
        { zoneId: 'L',  court: POS_6v6_GRID.L  },
      ],
    },
    {
      id: '4-2',
      hasLibero: false,
      positions: [
        { zoneId: 'P4', court: POS_6v6_GRID.P4 },
        { zoneId: 'P3', court: POS_6v6_GRID.P3 },
        { zoneId: 'P2', court: POS_6v6_GRID.P2 },
        { zoneId: 'P5', court: POS_6v6_GRID.P5 },
        { zoneId: 'P6', court: POS_6v6_GRID.P6 },
        { zoneId: 'P1', court: POS_6v6_GRID.P1 },
      ],
    },
    {
      id: '6-2',
      hasLibero: true,
      positions: [
        { zoneId: 'P4', court: POS_6v6_GRID.P4 },
        { zoneId: 'P3', court: POS_6v6_GRID.P3 },
        { zoneId: 'P2', court: POS_6v6_GRID.P2 },
        { zoneId: 'P5', court: POS_6v6_GRID.P5 },
        { zoneId: 'P6', court: POS_6v6_GRID.P6 },
        { zoneId: 'P1', court: POS_6v6_GRID.P1 },
        { zoneId: 'L',  court: POS_6v6_GRID.L  },
      ],
    },
  ],
  5: [
    {
      id: 'pentagon',
      hasLibero: false,
      positions: [
        { zoneId: 'P3', court: { x: 50, y: 18 } },
        { zoneId: 'P4', court: { x: 20, y: 42 } },
        { zoneId: 'P2', court: { x: 80, y: 42 } },
        { zoneId: 'P5', court: { x: 25, y: 78 } },
        { zoneId: 'P1', court: { x: 75, y: 78 } },
      ],
    },
    {
      id: '3F-2B',
      hasLibero: false,
      positions: [
        { zoneId: 'P4', court: { x: 20, y: 22 } },
        { zoneId: 'P3', court: { x: 50, y: 22 } },
        { zoneId: 'P2', court: { x: 80, y: 22 } },
        { zoneId: 'P5', court: { x: 25, y: 75 } },
        { zoneId: 'P1', court: { x: 75, y: 75 } },
      ],
    },
    {
      id: '2F-3B',
      hasLibero: false,
      positions: [
        { zoneId: 'P4', court: { x: 25, y: 22 } },
        { zoneId: 'P3', court: { x: 75, y: 22 } },
        { zoneId: 'P5', court: { x: 15, y: 75 } },
        { zoneId: 'P6', court: { x: 50, y: 75 } },
        { zoneId: 'P1', court: { x: 85, y: 75 } },
      ],
    },
  ],
  4: [
    {
      id: 'losange',
      hasLibero: false,
      positions: [
        { zoneId: 'P3', court: { x: 50, y: 18 } },
        { zoneId: 'P4', court: { x: 20, y: 48 } },
        { zoneId: 'P2', court: { x: 80, y: 48 } },
        { zoneId: 'P1', court: { x: 50, y: 80 } },
      ],
    },
    {
      id: 'carre',
      hasLibero: false,
      positions: [
        { zoneId: 'P4', court: { x: 25, y: 22 } },
        { zoneId: 'P2', court: { x: 75, y: 22 } },
        { zoneId: 'P5', court: { x: 25, y: 75 } },
        { zoneId: 'P1', court: { x: 75, y: 75 } },
      ],
    },
    {
      id: '3-1',
      hasLibero: false,
      positions: [
        { zoneId: 'P4', court: { x: 20, y: 22 } },
        { zoneId: 'P3', court: { x: 50, y: 22 } },
        { zoneId: 'P2', court: { x: 80, y: 22 } },
        { zoneId: 'P1', court: { x: 50, y: 78 } },
      ],
    },
  ],
};

// Legacy export: the CONFIGURATIONS shape consumed by GuideDefenseSized only
// reads `.id`, `.name`, `.shortName`, `.positions`. The labels here are
// resolved from i18n at the call site, but keeping the structured export
// lets the existing imports compile without changes.
export type Configuration = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  hasLibero: boolean;
  positions: { zoneId: ZoneId; number: string; name: string; role: string; description: string; skills: string[]; traits: string[]; court: CourtPos }[];
};


// Re-export shape consumed by GuideDefenseSized — it only reads `.id` and uses
// `.shortName`/`.name` from the resolved object. We build a lightweight
// shim that mirrors the legacy shape using a fake `t` (caller may inject the
// real translations).
function makeConfiguration(layout: ConfigLayout, getText: (key: string) => string): Configuration {
  const positions = layout.positions.map(p => ({
    zoneId: p.zoneId,
    number: NUMBER_BY_ZONE[p.zoneId],
    name: getText(`configurations.${layout.id}.positions.${p.zoneId}.name`) || getText(`commonZones.${p.zoneId}.name`) || '',
    role: getText(`configurations.${layout.id}.positions.${p.zoneId}.role`) || '',
    description: getText(`configurations.${layout.id}.positions.${p.zoneId}.description`) || '',
    skills: [] as string[],
    traits: [] as string[],
    court: p.court,
  }));
  return {
    id: layout.id,
    name: getText(`configurations.${layout.id}.name`),
    shortName: getText(`configurations.${layout.id}.shortName`),
    description: getText(`configurations.${layout.id}.description`),
    hasLibero: layout.hasLibero,
    positions,
  };
}

// Hook-based access for callers that need the resolved configuration shape.
export function useConfigurations(): Record<TeamSize, Configuration[]> {
  const { t } = useTranslation('positions');
  return useMemo(() => ({
    6: CONFIG_LAYOUTS[6].map(l => makeConfiguration(l, t as unknown as (k: string) => string)),
    5: CONFIG_LAYOUTS[5].map(l => makeConfiguration(l, t as unknown as (k: string) => string)),
    4: CONFIG_LAYOUTS[4].map(l => makeConfiguration(l, t as unknown as (k: string) => string)),
  }), [t]);
}

// Language-aware legacy export. The default i18n singleton's language is
// synchronised with the active route by LanguageGate, so each CONFIGURATIONS[..]
// access resolves config names in the current language.
function buildConfigurations(): Record<TeamSize, Configuration[]> {
  const tr = (k: string) => i18nDefault.t(k, { ns: 'positions' });
  return {
    6: CONFIG_LAYOUTS[6].map(l => makeConfiguration(l, tr)),
    5: CONFIG_LAYOUTS[5].map(l => makeConfiguration(l, tr)),
    4: CONFIG_LAYOUTS[4].map(l => makeConfiguration(l, tr)),
  };
}
export const CONFIGURATIONS = new Proxy({} as Record<TeamSize, Configuration[]>, {
  get(_target, prop) {
    const fresh = buildConfigurations();
    return fresh[Number(prop) as TeamSize];
  },
}) as Record<TeamSize, Configuration[]>;
