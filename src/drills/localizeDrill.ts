import { useTranslation } from 'react-i18next';
import type { Drill } from './types';

type LocalizedDrillEntry = {
  title?: string;
  goal?: string;
  equipment?: string[];
  duration?: string;
  // Variant descriptions, in the same order as the source variants.
  variants?: string[];
  successCriteria?: string[];
  coachingCues?: string[];
};

// Arrays are only taken when they have the same length as the source, so a
// partial translation can never drop or misalign content.
function sameLength<T>(overlay: T[] | undefined, source: T[]): T[] {
  return overlay && overlay.length === source.length ? overlay : source;
}

function applyOverlay(drill: Drill, overlay: LocalizedDrillEntry | undefined): Drill {
  if (!overlay) return drill;
  return {
    ...drill,
    title: overlay.title ?? drill.title,
    goal: overlay.goal ?? drill.goal,
    setup: {
      ...drill.setup,
      duration: overlay.duration ?? drill.setup.duration,
      equipment: sameLength(overlay.equipment, drill.setup.equipment),
    },
    variants: drill.variants.map((v, i) => ({
      ...v,
      description: overlay.variants?.length === drill.variants.length
        ? overlay.variants[i]
        : v.description,
    })),
    successCriteria: sameLength(overlay.successCriteria, drill.successCriteria),
    coachingCues: drill.coachingCues
      ? sameLength(overlay.coachingCues, drill.coachingCues)
      : drill.coachingCues,
  };
}

// Overlay the translated texts of the current language, keyed by the stable
// drill id, on a French-authored drill (`src/drills/data.ts`). A language
// without a `content` bundle in its `drills` namespace keeps the French source.
export function useLocalizedDrill(drill: Drill): Drill {
  const { i18n } = useTranslation('drills');
  const bundle = i18n.getResourceBundle(i18n.language, 'drills') as
    | { content?: Record<string, LocalizedDrillEntry> }
    | undefined;
  return applyOverlay(drill, bundle?.content?.[drill.id]);
}
