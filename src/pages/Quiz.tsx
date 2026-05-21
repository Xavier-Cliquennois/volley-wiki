import { Link } from 'react-router-dom';
import { QUIZZES, RANDOM_QUIZ_SLUG } from '../quiz/data';
import { useQuizProgress } from '../quiz/useQuizProgress';
import { useCurrentLang } from '../i18n/paths';
import { Head } from '../seo/Head';
import { buildBreadcrumb } from '../seo/structuredData';

export default function Quiz() {
  const lang = useCurrentLang();
  const [progress] = useQuizProgress();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
      <Head
        title="Quiz interactif — Volley-Wiki"
        description="Teste tes connaissances tactiques au volley : rotations, options offensives, placement défensif, systèmes et lecture du jeu. Cinq quizzes thématiques et un mode aléatoire."
        path="/quiz"
        jsonLd={buildBreadcrumb(
          [
            { name: 'Accueil', path: '/' },
            { name: 'Quiz', path: '/quiz' },
          ],
          lang,
        )}
      />

      <div>
        <div
          style={{
            fontFamily: '"Bungee", sans-serif',
            fontSize: 11,
            letterSpacing: '0.18em',
            color: 'var(--teal)',
            marginBottom: 10,
          }}
        >
          ★ TESTE-TOI
        </div>
        <h1
          style={{
            fontFamily: '"Bungee", sans-serif',
            fontSize: 'clamp(28px, 4vw, 40px)',
            margin: '0 0 10px 0',
            letterSpacing: '0.03em',
          }}
        >
          QUIZ INTERACTIF
        </h1>
        <p style={{ margin: 0, fontSize: 15, opacity: 0.7, maxWidth: 680 }}>
          Cinq quizzes thématiques pour vérifier tes connaissances tactiques.
          Chaque question est suivie d&apos;une justification — l&apos;objectif
          est de comprendre, pas seulement de deviner.
        </p>
      </div>

      <Link
        to={`/${lang}/quiz/${RANDOM_QUIZ_SLUG}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 18,
          padding: '20px 24px',
          border: '3px solid var(--ink)',
          background: 'var(--orange)',
          color: 'var(--cream)',
          textDecoration: 'none',
          boxShadow: 'var(--shadow)',
          transition: 'transform 0.08s, box-shadow 0.08s',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.transform = 'translate(-2px, -2px)';
          (e.currentTarget as HTMLElement).style.boxShadow = '7px 7px 0 var(--ink)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.transform = '';
          (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow)';
        }}
      >
        <div>
          <div
            style={{
              fontFamily: '"Bungee", sans-serif',
              fontSize: 11,
              letterSpacing: '0.14em',
              marginBottom: 6,
              opacity: 0.85,
            }}
          >
            ★ MODE ALÉATOIRE
          </div>
          <h2
            style={{
              fontFamily: '"Bungee", sans-serif',
              fontSize: 22,
              margin: 0,
              letterSpacing: '0.03em',
            }}
          >
            QUIZ ALÉATOIRE
          </h2>
          <p style={{ margin: '6px 0 0 0', fontSize: 13, opacity: 0.85 }}>
            10 questions tirées au hasard parmi tous les quizzes. Pas de score
            persistant, juste un défi.
          </p>
        </div>
        <div
          style={{
            fontFamily: '"Bungee", sans-serif',
            fontSize: 11,
            letterSpacing: '0.14em',
          }}
        >
          JOUER →
        </div>
      </Link>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {QUIZZES.map((quiz, idx) => {
          const score = progress[quiz.slug];
          return (
            <Link
              key={quiz.slug}
              to={`/${lang}/quiz/${quiz.slug}`}
              style={{
                display: 'block',
                border: '3px solid var(--ink)',
                background: 'var(--cream)',
                boxShadow: 'var(--shadow)',
                padding: '20px 24px',
                textDecoration: 'none',
                color: 'var(--ink)',
                transition: 'transform 0.08s, box-shadow 0.08s',
                position: 'relative',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translate(-2px, -2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '7px 7px 0 var(--ink)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = '';
                (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow)';
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -10,
                  right: 14,
                  padding: '2px 10px',
                  background: 'var(--cream)',
                  border: '2.5px solid var(--ink)',
                  fontFamily: '"Bungee", sans-serif',
                  fontSize: 10,
                  letterSpacing: '0.1em',
                }}
              >
                N° {String(idx + 1).padStart(2, '0')}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span
                    style={{
                      padding: '2px 10px',
                      border: '2.5px solid var(--ink)',
                      background: 'var(--teal)',
                      fontFamily: '"Bungee", sans-serif',
                      fontSize: 9,
                      letterSpacing: '0.1em',
                      color: 'var(--cream)',
                    }}
                  >
                    {quiz.category.toUpperCase()}
                  </span>
                  <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, opacity: 0.6 }}>
                    {quiz.level}
                  </span>
                  <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, opacity: 0.4 }}>·</span>
                  <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, opacity: 0.6 }}>
                    {quiz.estimatedTime} · {quiz.questions.length} questions
                  </span>
                  {score && (
                    <span
                      style={{
                        marginLeft: 'auto',
                        padding: '2px 10px',
                        border: '2.5px solid var(--ink)',
                        background: 'var(--orange)',
                        color: 'var(--cream)',
                        fontFamily: '"Bungee", sans-serif',
                        fontSize: 10,
                        letterSpacing: '0.1em',
                      }}
                    >
                      ★ {score.bestScore} / {score.total}
                    </span>
                  )}
                </div>

                <h2 style={{ fontFamily: '"Bungee", sans-serif', fontSize: 18, margin: 0, letterSpacing: '0.03em' }}>
                  {quiz.title}
                </h2>
                <p style={{ margin: 0, fontSize: 14, opacity: 0.7, lineHeight: 1.5 }}>{quiz.subtitle}</p>
                <p style={{ margin: 0, fontSize: 13, opacity: 0.55, lineHeight: 1.4 }}>
                  {quiz.description}
                </p>

                <div
                  style={{
                    fontFamily: '"Bungee", sans-serif',
                    fontSize: 10,
                    letterSpacing: '0.12em',
                    color: 'var(--orange)',
                    marginTop: 4,
                  }}
                >
                  COMMENCER →
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
