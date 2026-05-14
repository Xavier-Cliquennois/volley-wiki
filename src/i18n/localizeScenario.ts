import { useTranslation } from 'react-i18next';
import type { Scenario, ScenarioStep, PhaseKind } from '../scenarios/types';

type LocalizedStep = { title?: string; description?: string };
type LocalizedSummary = { keyPoints?: string[]; commonMistakes?: string[] };
type LocalizedScenarioEntry = {
  title?: string;
  shortDescription?: string;
  contextLabel?: string;
  steps?: Record<string, LocalizedStep>;
  summary?: LocalizedSummary;
  players?: Record<string, string>;
};

type Resources = Record<string, LocalizedScenarioEntry>;

function applyOverlay(scenario: Scenario, overlay: LocalizedScenarioEntry | undefined): Scenario {
  if (!overlay) return scenario;
  const steps: ScenarioStep[] = scenario.steps.map((step) => {
    const tr = overlay.steps?.[step.id];
    if (!tr) return step;
    return {
      ...step,
      title: tr.title ?? step.title,
      description: tr.description ?? step.description,
    };
  });
  return {
    ...scenario,
    title: overlay.title ?? scenario.title,
    shortDescription: overlay.shortDescription ?? scenario.shortDescription,
    config: {
      ...scenario.config,
      contextLabel: overlay.contextLabel ?? scenario.config.contextLabel,
    },
    players: scenario.players.map((p) => {
      const label = overlay.players?.[p.id];
      return label ? { ...p, label } : p;
    }),
    steps,
    summary: {
      keyPoints: overlay.summary?.keyPoints ?? scenario.summary.keyPoints,
      commonMistakes: overlay.summary?.commonMistakes ?? scenario.summary.commonMistakes,
    },
  };
}

export function useLocalizedScenario(scenario: Scenario | undefined): Scenario | undefined {
  const { i18n } = useTranslation();
  if (!scenario) return scenario;
  const bundle = i18n.getResourceBundle(i18n.language, 'scenarioContent') as Resources | undefined;
  return applyOverlay(scenario, bundle?.[scenario.id]);
}

export function useLocalizedScenarios(scenarios: readonly Scenario[]): Scenario[] {
  const { i18n } = useTranslation();
  const bundle = i18n.getResourceBundle(i18n.language, 'scenarioContent') as Resources | undefined;
  if (!bundle) return [...scenarios];
  return scenarios.map((s) => applyOverlay(s, bundle[s.id]));
}

export function usePhaseLabel() {
  const { t } = useTranslation('scenarios');
  return (phase: PhaseKind) => t(`phase.${phase}`);
}
