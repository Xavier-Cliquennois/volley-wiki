import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import DrillCard from './DrillCard';
import { drillsBySkill } from './data';
import { filterDrills } from './filters';
import type { LevelFilter, TeamSizeFilter } from './filters';
import type { DrillSkill, TeamSize } from './types';
import { useUserLevel } from '../userLevel/useUserLevel';

const LEVEL_VALUES: LevelFilter[] = ['all', 'beginner', 'intermediate', 'advanced'];
const TEAM_SIZE_VALUES: TeamSizeFilter[] = ['all', 4, 5, 6];

const S: Record<string, CSSProperties> = {
  toolbar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 18,
    alignItems: 'center',
    padding: '12px 14px',
    border: '2.5px solid var(--ink)',
    background: 'var(--cream)',
    boxShadow: 'var(--shadow-sm)',
    marginBottom: 18,
  },
  filterGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
  },
  filterLabel: {
    fontFamily: '"DM Mono", monospace',
    fontSize: 10,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    opacity: 0.6,
    marginRight: 4,
  },
  pill: {
    padding: '4px 12px',
    fontFamily: '"Bungee", sans-serif',
    fontSize: 10,
    letterSpacing: '0.06em',
    border: '2px solid var(--ink)',
    background: 'var(--paper)',
    color: 'var(--ink)',
    cursor: 'pointer',
  },
  pillActive: {
    background: 'var(--orange)',
    color: '#fff',
    boxShadow: 'var(--shadow-sm)',
    transform: 'translate(-1px,-1px)',
  },
  empty: {
    padding: '24px 20px',
    border: '2.5px dashed var(--ink)',
    fontFamily: '"DM Mono", monospace',
    fontSize: 12,
    opacity: 0.6,
    textAlign: 'center',
  },
  count: {
    fontFamily: '"DM Mono", monospace',
    fontSize: 10,
    letterSpacing: '0.12em',
    opacity: 0.5,
    marginLeft: 'auto',
  },
};

export type DrillListProps = {
  skill: DrillSkill;
  // Restrict the displayed team-size pills if the host guide is already
  // scoped (e.g. a 6v6-only guide).
  availableTeamSizes?: TeamSize[];
};

// Maps the global LevelSwitcher into the drill list filter. The user-level
// hook returns one selected level; we default the filter to that level so
// the list opens already scoped to what the reader cares about, and they
// can broaden to "All" if they want.
export default function DrillList({ skill, availableTeamSizes }: DrillListProps) {
  const { t } = useTranslation('drills');
  const [userLevel] = useUserLevel();
  const [levelFilter, setLevelFilter] = useState<LevelFilter>(userLevel);
  const [teamSizeFilter, setTeamSizeFilter] = useState<TeamSizeFilter>('all');

  const allDrills = useMemo(() => drillsBySkill(skill), [skill]);
  const visible = useMemo(
    () => filterDrills(allDrills, levelFilter, teamSizeFilter),
    [allDrills, levelFilter, teamSizeFilter],
  );

  const teamSizeValues = availableTeamSizes
    ? (['all', ...TEAM_SIZE_VALUES.slice(1).filter(v => availableTeamSizes.includes(v as TeamSize))] as TeamSizeFilter[])
    : TEAM_SIZE_VALUES;

  const labelForLevel = (v: LevelFilter) => (v === 'all' ? t('levels.all') : t(`levels.${v}`));
  const labelForTeamSize = (v: TeamSizeFilter) => (v === 'all' ? t('teamSize.all') : `${v}v${v}`);

  return (
    <div>
      <div style={S.toolbar}>
        <div style={S.filterGroup}>
          <span style={S.filterLabel}>{t('filters.level')}</span>
          {LEVEL_VALUES.map(v => {
            const on = levelFilter === v;
            return (
              <button
                key={v}
                onClick={() => setLevelFilter(v)}
                style={{ ...S.pill, ...(on ? S.pillActive : {}) }}
                aria-pressed={on}
              >
                {labelForLevel(v)}
              </button>
            );
          })}
        </div>

        <div style={S.filterGroup}>
          <span style={S.filterLabel}>{t('filters.format')}</span>
          {teamSizeValues.map(v => {
            const on = teamSizeFilter === v;
            return (
              <button
                key={String(v)}
                onClick={() => setTeamSizeFilter(v)}
                style={{ ...S.pill, ...(on ? S.pillActive : {}) }}
                aria-pressed={on}
              >
                {labelForTeamSize(v)}
              </button>
            );
          })}
        </div>

        <span style={S.count}>
          {t('count', { visible: visible.length, total: allDrills.length })}
        </span>
      </div>

      {visible.length === 0 ? (
        <div style={S.empty}>{t('empty')}</div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 16,
          }}
        >
          {visible.map((drill, idx) => (
            <DrillCard key={drill.id} drill={drill} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
