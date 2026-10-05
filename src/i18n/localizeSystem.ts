import { useTranslation } from 'react-i18next';
import type { SystemDef } from '../systems/types';

type LocalizedRotation = {
  summary?: string;
  details?: Record<string, string>;
};

type LocalizedSystemEntry = {
  title?: string;
  tagline?: string;
  philosophy?: string;
  pros?: string[];
  cons?: string[];
  rotations?: Record<string, LocalizedRotation>;
};

// The bundle holds one entry per system id, plus `attackLabels` which maps a
// source (French) attack label to its translation.
type SystemContentBundle = Record<string, unknown> & {
  attackLabels?: Record<string, string>;
};

function applyOverlay(system: SystemDef, overlay: LocalizedSystemEntry | undefined): SystemDef {
  if (!overlay) return system;
  const rotations: SystemDef['rotations'] = {};
  for (const rotation of Object.values(system.rotations)) {
    if (!rotation) continue;
    const tr = overlay.rotations?.[rotation.id];
    rotations[rotation.id] = tr
      ? {
          ...rotation,
          summary: tr.summary ?? rotation.summary,
          details: rotation.details.map(d => ({ ...d, body: tr.details?.[d.id] ?? d.body })),
        }
      : rotation;
  }
  return {
    ...system,
    title: overlay.title ?? system.title,
    tagline: overlay.tagline ?? system.tagline,
    philosophy: overlay.philosophy ?? system.philosophy,
    pros: overlay.pros ?? system.pros,
    cons: overlay.cons ?? system.cons,
    rotations,
  };
}

function useBundle(): SystemContentBundle | undefined {
  const { i18n } = useTranslation();
  return i18n.getResourceBundle(i18n.language, 'systemContent') as SystemContentBundle | undefined;
}

// Overlay the translated texts of the current language on a system. A language
// without a `systemContent` bundle (or without an entry for this system) keeps
// the French source texts authored in `src/systems/data`.
export function useLocalizedSystem(system: SystemDef | undefined): SystemDef | undefined {
  const bundle = useBundle();
  if (!system) return system;
  return applyOverlay(system, bundle?.[system.id] as LocalizedSystemEntry | undefined);
}

// Same, for a record of systems (hub page).
export function useLocalizedSystems(
  systems: Partial<Record<string, SystemDef>>,
): Partial<Record<string, SystemDef>> {
  const bundle = useBundle();
  if (!bundle) return systems;
  return Object.fromEntries(
    Object.entries(systems).map(([id, s]) => [
      id,
      s && applyOverlay(s, bundle[id] as LocalizedSystemEntry | undefined),
    ]),
  );
}

// Translate an attack option label (authored in French in the data files).
export function useAttackLabel(): (label: string) => string {
  const bundle = useBundle();
  return label => bundle?.attackLabels?.[label] ?? label;
}
