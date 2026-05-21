import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  buildRandomQuiz,
  getQuizBySlug,
  RANDOM_QUIZ_SLUG,
} from '../quiz/data';
import { QuizPlayer } from '../quiz/components/QuizPlayer';
import { useCurrentLang } from '../i18n/paths';
import { Head } from '../seo/Head';
import { buildBreadcrumb } from '../seo/structuredData';

export default function QuizDetail() {
  const { slug } = useParams<{ slug: string }>();
  const lang = useCurrentLang();
  const navigate = useNavigate();

  // Random-mode quizzes are rebuilt once per mount: a fresh shuffle each time
  // the user lands on /quiz/random, but stable through a single playthrough.
  const quiz = useMemo(() => {
    if (slug === RANDOM_QUIZ_SLUG) return buildRandomQuiz();
    if (!slug) return undefined;
    return getQuizBySlug(slug);
  }, [slug]);

  if (!quiz) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Head
          title="Quiz introuvable | Volley-Wiki"
          description="Ce quiz n'existe pas. Revenez à la liste des quizzes."
          path={`/quiz/${slug ?? ''}`}
          noindex
        />
        <Link
          to={`/${lang}/quiz`}
          style={{
            fontFamily: '"Bungee", sans-serif',
            fontSize: 10,
            letterSpacing: '0.12em',
            color: 'var(--orange)',
            textDecoration: 'none',
          }}
        >
          ← TOUS LES QUIZZES
        </Link>
        <p style={{ opacity: 0.6 }}>Quiz introuvable.</p>
      </div>
    );
  }

  const isRandom = slug === RANDOM_QUIZ_SLUG;
  const path = `/quiz/${quiz.slug}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <Head
        title={`${quiz.title} — Quiz Volley-Wiki`}
        description={quiz.description}
        path={path}
        jsonLd={buildBreadcrumb(
          [
            { name: 'Accueil', path: '/' },
            { name: 'Quiz', path: '/quiz' },
            { name: quiz.title, path },
          ],
          lang,
        )}
      />

      <Link
        to={`/${lang}/quiz`}
        style={{
          fontFamily: '"Bungee", sans-serif',
          fontSize: 10,
          letterSpacing: '0.12em',
          color: 'var(--orange)',
          textDecoration: 'none',
        }}
      >
        ← TOUS LES QUIZZES
      </Link>

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
          ★ {quiz.category.toUpperCase()}
        </div>
        <h1
          style={{
            fontFamily: '"Bungee", sans-serif',
            fontSize: 'clamp(26px, 4vw, 38px)',
            margin: '0 0 10px 0',
            letterSpacing: '0.03em',
          }}
        >
          {quiz.title.toUpperCase()}
        </h1>
        <p style={{ margin: '0 0 14px 0', fontSize: 15, opacity: 0.7 }}>
          {quiz.subtitle}
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span
            style={{
              padding: '3px 12px',
              border: '2.5px solid var(--ink)',
              background: 'var(--cream)',
              fontFamily: '"DM Mono", monospace',
              fontSize: 11,
            }}
          >
            {quiz.level}
          </span>
          <span
            style={{
              padding: '3px 12px',
              border: '2.5px solid var(--ink)',
              background: 'var(--cream)',
              fontFamily: '"DM Mono", monospace',
              fontSize: 11,
            }}
          >
            {quiz.questions.length} questions
          </span>
          <span
            style={{
              padding: '3px 12px',
              border: '2.5px solid var(--ink)',
              background: 'var(--cream)',
              fontFamily: '"DM Mono", monospace',
              fontSize: 11,
            }}
          >
            {quiz.estimatedTime}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ flex: 1, height: 3, background: 'var(--ink)' }} />
        <span
          style={{
            fontFamily: '"Bungee", sans-serif',
            fontSize: 9,
            letterSpacing: '0.2em',
            color: 'var(--orange)',
            whiteSpace: 'nowrap',
          }}
        >
          C&apos;EST PARTI
        </span>
        <div style={{ flex: 1, height: 3, background: 'var(--ink)' }} />
      </div>

      <QuizPlayer
        quiz={quiz}
        persistProgress={!isRandom}
        onBackToHub={() => navigate(`/${lang}/quiz`)}
      />
    </div>
  );
}
