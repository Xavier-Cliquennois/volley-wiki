import { Suspense, lazy } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getScenarioById } from '../scenarios/data';

const ScenarioPlayer = lazy(() => import('../scenarios/ScenarioPlayer'));

export default function ScenarioDetail() {
  const { id } = useParams<{ id: string }>();
  const scenario = id ? getScenarioById(id) : undefined;

  if (!scenario) {
    return (
      <div className="space-y-6">
        <Link to="/scenarios" className="text-yellow-400 text-xs uppercase tracking-wider hover:underline">
          ← Retour aux scénarios
        </Link>
        <div className="border-2 border-gray-700 p-8 text-center">
          <div className="text-3xl mb-2">⚠️</div>
          <div className="text-white font-bold mb-2">Scénario introuvable</div>
          <p className="text-gray-500 text-sm">L'identifiant <code className="text-yellow-400">{id}</code> ne correspond à aucun scénario.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/scenarios" className="text-yellow-400 text-xs uppercase tracking-wider hover:underline inline-block">
        ← Retour aux scénarios
      </Link>

      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{scenario.title}</h1>
        <p className="text-gray-400 text-sm md:text-base">{scenario.shortDescription}</p>
      </div>

      <Suspense
        fallback={
          <div className="border-2 border-gray-700 bg-gray-900 h-96 flex items-center justify-center">
            <span className="text-gray-500 text-sm uppercase tracking-wider">Chargement du scénario…</span>
          </div>
        }
      >
        <ScenarioPlayer scenario={scenario} />
      </Suspense>
    </div>
  );
}
