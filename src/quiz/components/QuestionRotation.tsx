import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { RotationQuestion } from '../types';
import RotationDiagram from '../../systems/RotationDiagram';
import { getSystemById } from '../../systems/data';
import { OptionList } from './OptionList';

type Props = {
  question: RotationQuestion;
  selectedId: string | null;
  onSelect: (id: string) => void;
};

// Renders the rotation diagram and asks the user to identify which rotation
// of the system it is. Reuses RotationDiagram as-is — the title is on the
// page, not on the diagram, so nothing reveals the answer.
export function QuestionRotation({ question, selectedId, onSelect }: Props) {
  const { t } = useTranslation();
  const rotation = useMemo(() => {
    const system = getSystemById(question.systemId);
    return system?.rotations[question.rotationId];
  }, [question.systemId, question.rotationId]);

  if (!rotation) {
    return (
      <p style={{ color: 'var(--orange)' }}>
        {t('quiz.rotationNotFound', { system: question.systemId, rotation: question.rotationId })}
      </p>
    );
  }

  const options = question.options.map(id => ({ id, label: t('quiz.rotationOption', { id }) }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <RotationDiagram rotation={rotation} />
      <OptionList
        options={options}
        selectedId={selectedId}
        correctId={question.correctId}
        onSelect={onSelect}
      />
    </div>
  );
}
