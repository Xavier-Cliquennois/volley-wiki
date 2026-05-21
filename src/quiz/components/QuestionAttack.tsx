import { useMemo } from 'react';
import type { AttackQuestion } from '../types';
import { getSystemById } from '../../systems/data';
import { Court, type CourtLayout, type CourtPlayer } from '../../components/court';
import { OptionList } from './OptionList';
import { pastilleLabel, pastilleSub } from './_playerLabel';

type Props = {
  question: AttackQuestion;
  selectedId: string | null;
  onSelect: (id: string) => void;
};

// Where the ball lands on our half depending on reception quality. Y in
// [0,100] with y=0 at the net. Perfect = right at the setter target,
// medium = drifted away, poor = far from net & off-platform.
const BALL_POSITION = {
  perfect: { x: 65, y: 14 },
  medium: { x: 55, y: 35 },
  poor: { x: 35, y: 55 },
};

const QUALITY_LABEL = {
  perfect: 'Réception parfaite',
  medium: 'Réception moyenne',
  poor: 'Réception dégradée',
};

const QUALITY_COLOR = {
  perfect: 'var(--teal)',
  medium: 'var(--yellow)',
  poor: 'var(--orange)',
};

// Renders the rotation with a ball icon at the reception-quality position,
// then a list of attack options. The user picks which call makes sense
// given where the ball just landed.
export function QuestionAttack({ question, selectedId, onSelect }: Props) {
  const layout = useMemo<CourtLayout>(() => {
    const system = getSystemById(question.systemId);
    const rotation = system?.rotations[question.rotationId];
    if (!rotation) return {};

    const players: CourtPlayer[] = rotation.slots.map(slot => ({
      id: slot.role,
      x: slot.servePosition.x,
      y: slot.servePosition.y,
      label: pastilleLabel(slot.role),
      sub: pastilleSub(slot.role),
      role: slot.color,
    }));

    return {
      players,
      ball: BALL_POSITION[question.receptionQuality],
    };
  }, [question.systemId, question.rotationId, question.receptionQuality]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ maxWidth: 480, margin: '0 auto', width: '100%' }}>
        <Court
          layout={layout}
          view="our-side"
          show3mLine
          idSuffix={`attack-${question.id}`}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            border: '2.5px solid var(--ink)',
            background: QUALITY_COLOR[question.receptionQuality],
            color: question.receptionQuality === 'medium' ? 'var(--ink)' : 'var(--cream)',
            fontFamily: '"Bungee", sans-serif',
            fontSize: 11,
            letterSpacing: '0.1em',
          }}
        >
          ● {QUALITY_LABEL[question.receptionQuality]}
        </span>
      </div>
      <OptionList
        options={question.options}
        selectedId={selectedId}
        correctId={question.correctId}
        onSelect={onSelect}
      />
    </div>
  );
}

