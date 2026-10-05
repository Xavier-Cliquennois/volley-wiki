import { useState } from 'react';
import type { CSSProperties } from 'react';
import { Q } from './styles';

type OptionRenderProps = {
  id: string;
  index: number;
};

type Props = {
  options: { id: string; label: string }[];
  selectedId: string | null;
  correctId: string;
  onSelect: (id: string) => void;
  // Optional renderer for richer option content (e.g. attack cards with risk
  // badge). Default renders the plain label string.
  renderLabel?: (option: { id: string; label: string }, ctx: OptionRenderProps) => React.ReactNode;
};

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

// Pressable option list with answered/correct/incorrect visual states.
// Locks input as soon as one option is selected — the parent reads
// `selectedId` to drive the feedback and the "Next" button.
export function OptionList({ options, selectedId, correctId, onSelect, renderLabel }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const answered = selectedId !== null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {options.map((option, index) => {
        const isSelected = selectedId === option.id;
        const isCorrect = option.id === correctId;
        const isHovered = hoveredId === option.id && !answered;

        const style: CSSProperties = { ...Q.option };
        if (answered) {
          if (isCorrect) Object.assign(style, Q.optionCorrect);
          else if (isSelected) Object.assign(style, Q.optionIncorrect);
          else Object.assign(style, Q.optionDisabled);
        } else if (isHovered) {
          Object.assign(style, Q.optionHover);
        }

        return (
          <button
            key={option.id}
            type="button"
            disabled={answered}
            onMouseEnter={() => setHoveredId(option.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => !answered && onSelect(option.id)}
            style={style}
          >
            <span style={Q.optionLetter}>{LETTERS[index] ?? '?'}</span>
            <span style={{ flex: 1 }}>
              {renderLabel ? renderLabel(option, { id: option.id, index }) : option.label}
            </span>
            {answered && isCorrect && <span aria-hidden="true">✓</span>}
            {answered && isSelected && !isCorrect && <span aria-hidden="true">✗</span>}
          </button>
        );
      })}
    </div>
  );
}
