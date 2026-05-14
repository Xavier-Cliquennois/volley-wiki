import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import type { TeamSize } from '../pages/Positions';
import GoldenRule from './GoldenRule';
import VideoLink from './VideoLink';
import { S } from './styles';

type ReceptionSystem = {
  name: string;
  level: string;
  desc: string;
  pros: string[];
  cons: string[];
  recommended?: boolean;
};

type PasseurRole = {
  title: string;
  bullets: string[];
  note?: string;
};

type LiberoAccent = 'orange' | 'teal' | 'plum';

type LiberoNote = {
  title: string;
  text: string;
  accent: LiberoAccent;
};

type LabelText = { label: string; text: string };
type PlatformTip = { title: string; text: string };
type Displacement = { name: string; desc: string };
type ReadingRow = { type: string; adapt: string };
type VideoItem = { title: string; url: string };

export default function GuideReception() {
  const { t } = useTranslation('guideContent');
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSize = parseInt(searchParams.get('size') ?? '6') as TeamSize;
  const [teamSize, setTeamSize] = useState<TeamSize>([4, 5, 6].includes(initialSize) ? initialSize : 6);

  useEffect(() => {
    setSearchParams({ size: String(teamSize) }, { replace: true });
  }, [teamSize, setSearchParams]);

  const readyPoints = t('reception.readyPosition.points', { returnObjects: true }) as string[];
  const platformTips = t('reception.platform.tips', { returnObjects: true }) as PlatformTip[];
  const stepsItems = t('reception.steps.items', { returnObjects: true }) as string[];
  const displacements = t('reception.displacements.items', { returnObjects: true }) as Displacement[];
  const systems = t(`reception.systems.byTeamSize.${teamSize}`, { returnObjects: true }) as ReceptionSystem[];
  const passeurRoles = t(`reception.passeur.byTeamSize.${teamSize}`, { returnObjects: true }) as PasseurRole[];
  const liberoNote = t(`reception.libero.byTeamSize.${teamSize}`, { returnObjects: true }) as LiberoNote;
  const readingRows = t('reception.reading.rows', { returnObjects: true }) as ReadingRow[];
  const readingCues = t('reception.reading.cues', { returnObjects: true }) as string[];
  const errorsCommon = t('reception.errors.common', { returnObjects: true }) as LabelText[];
  const errorsSize = t(`reception.errors.byTeamSize.${teamSize}`, { returnObjects: true }) as LabelText[];
  const videos = t('reception.videos.items', { returnObjects: true }) as VideoItem[];

  const btnBase: React.CSSProperties = {
    padding: '6px 16px',
    fontFamily: '"Bungee", sans-serif', fontSize: 10, letterSpacing: '0.1em',
    border: '2.5px solid var(--ink)',
    background: 'var(--cream)', color: 'var(--ink)',
    cursor: 'pointer',
  };
  const btnActive: React.CSSProperties = { ...btnBase, background: 'var(--orange)', color: '#fff', boxShadow: 'var(--shadow-sm)' };

  const accentColor = (a: LiberoAccent) =>
    a === 'orange' ? 'var(--orange)' : a === 'teal' ? 'var(--teal)' : 'var(--plum)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

      {/* Règle d'or */}
      <GoldenRule>
        {t('reception.goldenRule.body')}
      </GoldenRule>

      {/* Team size selector */}
      <section style={{ ...S.card, border: '2.5px solid var(--orange)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={S.label}>{t('reception.format.title')}</div>
        <p
          style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.8, margin: 0 }}
          dangerouslySetInnerHTML={{ __html: t('reception.format.description') }}
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {([6, 5, 4] as const).map(size => (
            <button key={size} onClick={() => setTeamSize(size)} style={teamSize === size ? btnActive : btnBase}>
              {size}v{size}
            </button>
          ))}
        </div>
      </section>

      {/* Ready position */}
      <section>
        <h2 style={S.section}>{t('reception.readyPosition.title')}</h2>
        <div style={S.card}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {readyPoints.map((pt, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14 }}>
                <span style={S.bullet}>▸</span>
                <span style={{ color: 'var(--ink)', opacity: 0.85 }}>{pt}</span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 12, borderLeft: '4px solid var(--orange)', paddingLeft: 12, fontSize: 13 }}>
            <strong style={{ color: 'var(--orange)' }}>{t('reception.readyPosition.errorLabel')} : </strong>
            <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{t('reception.readyPosition.errorText')}</span>
          </div>
        </div>
      </section>

      {/* Platform */}
      <section>
        <h2 style={S.section}>{t('reception.platform.title')}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {platformTips.map((tip, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 14 }}>
              <span style={S.bullet}>▸</span>
              <span>
                <strong style={{ color: 'var(--ink)', fontFamily: '"DM Sans", sans-serif' }}>{tip.title} : </strong>
                <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{tip.text}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Execution steps */}
      <section>
        <h2 style={S.section}>{t('reception.steps.title')}</h2>
        <div style={{ ...S.card, background: 'var(--cream)', border: '2.5px solid var(--orange)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {stepsItems.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={S.stepBadge}>{i + 1}</span>
              <p style={{ fontSize: 14, color: 'var(--ink)', opacity: 0.85, margin: 0 }}>{step}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, borderLeft: '4px solid var(--orange)', paddingLeft: 16, paddingTop: 4, fontSize: 14, color: 'var(--ink)', opacity: 0.7 }}>
          <strong style={{ color: 'var(--ink)', opacity: 1 }}>{t('reception.steps.freezeLabel')} : </strong>
          {t('reception.steps.freezeText')}
        </div>
      </section>

      {/* Displacements */}
      <section>
        <h2 style={S.section}>{t('reception.displacements.title')}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {displacements.map((d, i) => (
            <div key={i} style={S.card}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 6 }}>{d.name}</div>
              <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: 0, lineHeight: 1.6 }}>{d.desc}</p>
            </div>
          ))}
          <div style={S.card}>
            <div style={S.label}>{t('reception.displacements.oneHand.label')}</div>
            <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: 0, lineHeight: 1.6 }}>
              {t('reception.displacements.oneHand.text')}
            </p>
          </div>
        </div>
      </section>

      {/* Systems — TEAM-SIZE AWARE */}
      <section>
        <h2 style={S.section}>{t('reception.systems.titlePrefix')} — {teamSize}v{teamSize}</h2>
        {teamSize !== 6 && (
          <div style={{ ...S.alert, background: 'var(--cream)', borderColor: 'var(--orange)', marginBottom: 14 }}>
            <div style={S.label}>{t('reception.systems.nonOfficialLabel')}</div>
            <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.85, margin: 0, lineHeight: 1.6 }}>
              {teamSize === 5 ? t('reception.systems.alert5') : t('reception.systems.alert4')}
            </p>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
          {systems.map((s, i) => (
            <div key={i} style={{ ...S.card, borderColor: s.recommended ? 'var(--orange)' : 'var(--ink)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 2 }}>{s.name}</div>
                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: s.recommended ? 'var(--orange)' : 'var(--ink)', opacity: s.recommended ? 1 : 0.5 }}>{s.level}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.75, margin: 0 }}>{s.desc}</p>
              <div>
                <div style={S.labelTeal}>{t('reception.systems.prosLabel')}</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {s.pros.map((p, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                      <span style={S.bullet}>▸</span>
                      <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div style={{ ...S.label, color: 'var(--ink)', opacity: 0.5 }}>{t('reception.systems.consLabel')}</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {s.cons.map((c, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                      <span style={{ color: 'var(--ink)', opacity: 0.35, marginTop: 2 }}>▸</span>
                      <span style={{ color: 'var(--ink)', opacity: 0.55 }}>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Passeur role — TEAM-SIZE AWARE */}
      <section>
        <h2 style={S.section}>{t('reception.passeur.titlePrefix')} — {teamSize}v{teamSize}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {passeurRoles.map((role, i) => (
            <div key={i} style={S.card}>
              <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: 'var(--ink)', marginBottom: 8 }}>{role.title}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
                {role.bullets.map((b, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                    <span style={S.bulletOrange}>▸</span>
                    <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{b}</span>
                  </li>
                ))}
              </ul>
              {role.note && (
                <div style={{ marginTop: 10, borderLeft: '4px solid var(--teal)', paddingLeft: 12, fontSize: 12, color: 'var(--ink)', opacity: 0.7 }}>
                  <strong style={{ color: 'var(--teal)' }}>{t('reception.passeur.noteLabel')} : </strong>{role.note}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Libero / receiver specialist — TEAM-SIZE AWARE */}
      <section>
        <h2 style={S.section}>{t('reception.libero.title')}</h2>
        <div style={{ ...S.card, borderLeft: `5px solid ${accentColor(liberoNote.accent)}` }}>
          <div style={{ fontFamily: '"Bungee", sans-serif', fontSize: 12, color: accentColor(liberoNote.accent), marginBottom: 8 }}>
            {liberoNote.title}
          </div>
          <p style={{ fontSize: 13, color: 'var(--ink)', opacity: 0.8, margin: 0, lineHeight: 1.65 }}>
            {liberoNote.text}
          </p>
        </div>
      </section>

      {/* Reading the serve */}
      <section>
        <h2 style={S.section}>{t('reception.reading.title')}</h2>
        <div style={{ border: '2.5px solid var(--ink)', overflow: 'hidden', marginBottom: 12 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--ink)' }}>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>{t('reception.reading.headerType')}</th>
                <th style={{ padding: '8px 14px', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: '0.12em', color: 'var(--cream)', fontWeight: 400 }}>{t('reception.reading.headerWhen')}</th>
              </tr>
            </thead>
            <tbody>
              {readingRows.map((row, i) => (
                <tr key={i} style={{ borderBottom: i < readingRows.length - 1 ? '1px solid var(--paper)' : 'none', background: i % 2 === 0 ? 'var(--cream)' : 'var(--paper)' }}>
                  <td style={{ padding: '10px 14px', color: 'var(--orange)', fontFamily: '"Bungee", sans-serif', fontSize: 11 }}>{row.type}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--ink)', opacity: 0.75 }}>{row.adapt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginBottom: 8 }}>
          <div style={S.labelTeal}>{t('reception.reading.cuesLabel')}</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {readingCues.map((cue, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                <span style={S.bullet}>▸</span>
                <span style={{ color: 'var(--ink)', opacity: 0.8 }}>{cue}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Errors — common + team-size aware */}
      <section>
        <h2 style={S.section}>{t('reception.errors.title')}</h2>
        <div style={{ borderLeft: '5px solid var(--orange)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
          <div style={{ ...S.label, color: 'var(--orange)' }}>{t('reception.errors.commonLabel')}</div>
          {errorsCommon.map((err, i) => (
            <div key={i} style={{ fontSize: 13 }}>
              <strong style={{ color: 'var(--ink)' }}>{err.label} : </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{err.text}</span>
            </div>
          ))}
        </div>
        <div style={{ borderLeft: '5px solid var(--teal)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ ...S.labelTeal }}>{t('reception.errors.sizeLabelPrefix')} {teamSize}v{teamSize}</div>
          {errorsSize.map((err, i) => (
            <div key={i} style={{ fontSize: 13 }}>
              <strong style={{ color: 'var(--ink)' }}>{err.label} : </strong>
              <span style={{ color: 'var(--ink)', opacity: 0.7 }}>{err.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Videos */}
      <section>
        <h2 style={S.section}>{t('reception.videos.title')}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {videos.map((v, i) => (
            <VideoLink key={i} title={v.title} url={v.url} />
          ))}
        </div>
      </section>

    </div>
  );
}
