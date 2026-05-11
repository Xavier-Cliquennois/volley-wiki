import type { CSSProperties } from 'react';

export const S = {
  section: {
    fontFamily: '"Bungee", sans-serif',
    fontSize: 13,
    letterSpacing: '0.08em',
    color: 'var(--ink)',
    marginBottom: 14,
    paddingBottom: 8,
    borderBottom: '2.5px solid var(--ink)',
  } as CSSProperties,
  label: {
    fontFamily: '"DM Mono", monospace',
    fontSize: 10,
    letterSpacing: '0.14em',
    textTransform: 'uppercase' as const,
    color: 'var(--orange)',
    marginBottom: 4,
  } as CSSProperties,
  labelTeal: {
    fontFamily: '"DM Mono", monospace',
    fontSize: 10,
    letterSpacing: '0.14em',
    textTransform: 'uppercase' as const,
    color: 'var(--teal)',
    marginBottom: 4,
  } as CSSProperties,
  card: {
    background: 'var(--paper)',
    border: '2.5px solid var(--ink)',
    padding: '16px 20px',
    boxShadow: 'var(--shadow-sm)',
  } as CSSProperties,
  alert: {
    background: 'var(--yellow)',
    border: '2.5px solid var(--ink)',
    padding: '14px 18px',
    boxShadow: 'var(--shadow-sm)',
  } as CSSProperties,
  bullet: {
    color: 'var(--teal)',
    marginTop: 2,
    flexShrink: 0,
  } as CSSProperties,
  bulletOrange: {
    color: 'var(--orange)',
    marginTop: 2,
    flexShrink: 0,
  } as CSSProperties,
  stepBadge: {
    background: 'var(--orange)',
    color: '#fff',
    fontFamily: '"Bungee", sans-serif',
    fontSize: 12,
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  } as CSSProperties,
};
