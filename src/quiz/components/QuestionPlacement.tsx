import { useMemo } from 'react';
import type { PlacementQuestion } from '../types';
import { getSystemById } from '../../systems/data';
import { Court, type CourtLayout, type CourtPlayer } from '../../components/court';
import type { ZoneId } from '../../systems/types';
import { OptionList } from './OptionList';
import { pastilleLabel, pastilleSub } from './_playerLabel';

type Props = {
  question: PlacementQuestion;
  selectedId: string | null;
  onSelect: (id: string) => void;
};

// Canonical FIVB zone centroids in 'our-side' coordinates (mirror of the
// ZONES constant in system-5-1.ts — duplicated here to avoid leaking system
// internals into the quiz module).
const ZONE_POSITIONS: Record<ZoneId, { x: number; y: number }> = {
  P1: { x: 80, y: 75 },
  P2: { x: 80, y: 22 },
  P3: { x: 50, y: 22 },
  P4: { x: 20, y: 22 },
  P5: { x: 20, y: 75 },
  P6: { x: 50, y: 75 },
};

// Renders the rotation diagram with the hidden role removed AND any player
// who happens to stand on a candidate zone temporarily hidden, so the "?"
// markers don't visually clash with real pastilles. The user still sees the
// other roles (enough to deduce which rotation is being asked about) but
// the candidate slots are presented as a clean choice.
export function QuestionPlacement({ question, selectedId, onSelect }: Props) {
  const fullLayout = useMemo<CourtLayout>(() => {
    const system = getSystemById(question.systemId);
    const rotation = system?.rotations[question.rotationId];
    if (!rotation) return {};

    const candidateZones = new Set(question.options.map(z => `${ZONE_POSITIONS[z].x}|${ZONE_POSITIONS[z].y}`));

    const visiblePlayers: CourtPlayer[] = rotation.slots
      .filter(slot => slot.role !== question.hiddenRole)
      .filter(slot => !candidateZones.has(`${slot.servePosition.x}|${slot.servePosition.y}`))
      .map(slot => ({
        id: slot.role,
        x: slot.servePosition.x,
        y: slot.servePosition.y,
        label: pastilleLabel(slot.role),
        sub: pastilleSub(slot.role),
        role: slot.color,
      }));

    const candidateMarkers: CourtPlayer[] = question.options.map(zoneId => ({
      id: `candidate-${zoneId}`,
      x: ZONE_POSITIONS[zoneId].x,
      y: ZONE_POSITIONS[zoneId].y,
      label: '?',
      caption: zoneId,
    }));

    return { players: [...visiblePlayers, ...candidateMarkers] };
  }, [question.systemId, question.rotationId, question.hiddenRole, question.options]);

  const options = question.options.map(id => ({ id, label: `Zone ${id}` }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ maxWidth: 480, margin: '0 auto', width: '100%' }}>
        <Court
          layout={fullLayout}
          view="our-side"
          show3mLine
          idSuffix={`placement-${question.id}`}
        />
      </div>
      <div
        style={{
          fontFamily: '"DM Mono", monospace',
          fontSize: 11,
          letterSpacing: '0.06em',
          color: 'var(--ink)',
          opacity: 0.7,
          textAlign: 'center',
        }}
      >
        ★ Les pastilles « ? » sont les zones candidates. Quelle est la bonne ?
      </div>
      <OptionList
        options={options}
        selectedId={selectedId}
        correctId={question.correctId}
        onSelect={onSelect}
      />
    </div>
  );
}

