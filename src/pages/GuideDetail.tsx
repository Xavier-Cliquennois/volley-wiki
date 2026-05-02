import { useParams, Link } from 'react-router-dom';
import { GUIDES } from '../guides/data';
import GuideContre from '../guides/GuideContre';
import GuidePositionnement from '../guides/GuidePositionnement';

const COMPONENTS: Record<string, React.ComponentType> = {
  'contre': GuideContre,
  'positionnement-defense': GuidePositionnement,
};

export default function GuideDetail() {
  const { slug } = useParams<{ slug: string }>();
  const guide = GUIDES.find(g => g.slug === slug);
  const Component = slug ? COMPONENTS[slug] : undefined;

  if (!guide || !Component) {
    return (
      <div className="space-y-4">
        <Link to="/guides" className="text-gray-500 text-xs hover:text-yellow-400 transition-colors">← Guides</Link>
        <p className="text-gray-400">Guide introuvable.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Link to="/guides" className="text-gray-500 text-xs hover:text-yellow-400 transition-colors">← Guides</Link>
      </div>
      <div className="space-y-3">
        <div className="text-yellow-400 text-xs uppercase tracking-widest">{guide.category}</div>
        <h1 className="text-4xl font-bold text-white">{guide.title}</h1>
        <p className="text-gray-400">{guide.subtitle}</p>
        <div className="flex gap-2">
          <span className="text-xs text-gray-600 border border-gray-700 px-2 py-1">{guide.level}</span>
          <span className="text-xs text-gray-600 border border-gray-700 px-2 py-1">{guide.readingTime}</span>
        </div>
      </div>
      <Component />
    </div>
  );
}
