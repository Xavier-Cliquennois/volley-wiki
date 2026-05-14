import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type GoldenRuleProps = {
  /** Optional all-caps key phrase displayed between the label and the body */
  mantra?: string;
  /** Main rule text */
  children: ReactNode;
};

const ALERT: React.CSSProperties = {
  background: 'var(--yellow)',
  border: '2.5px solid var(--ink)',
  padding: '14px 18px',
  boxShadow: 'var(--shadow-sm)',
};

const LABEL: React.CSSProperties = {
  fontFamily: '"DM Mono", monospace',
  fontSize: 10,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'var(--ink)',
  marginBottom: 8,
};

const MANTRA: React.CSSProperties = {
  fontFamily: '"Bungee", sans-serif',
  fontSize: 13,
  letterSpacing: '0.04em',
  color: 'var(--ink)',
  margin: '0 0 8px 0',
  lineHeight: 1.5,
};

const BODY: React.CSSProperties = {
  margin: 0,
  fontFamily: '"Bungee", sans-serif',
  fontSize: 14,
  lineHeight: 1.45,
  color: 'var(--ink)',
};

export default function GoldenRule({ mantra, children }: GoldenRuleProps) {
  const { t } = useTranslation('common');
  return (
    <div style={ALERT}>
      <div style={LABEL}>★ {t('labels.goldenRule')}</div>
      {mantra && <p style={MANTRA}>{mantra}</p>}
      <p style={BODY}>{children}</p>
    </div>
  );
}
