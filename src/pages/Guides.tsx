import { Link } from 'react-router-dom';
import { GUIDES } from '../guides/data';

export default function Guides() {
  return (
    <div className="space-y-12">
      <div>
        <div className="text-yellow-400 text-xs uppercase tracking-widest mb-2">Documentation</div>
        <h1 className="text-4xl font-bold text-white mb-3">Guides</h1>
        <p className="text-gray-400">Guides techniques et tactiques détaillés pour progresser au volleyball.</p>
      </div>

      <div className="space-y-4">
        {GUIDES.map(guide => (
          <Link
            key={guide.slug}
            to={`/guides/${guide.slug}`}
            className="border-2 border-gray-700 hover:border-yellow-400 p-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4 transition-colors group block"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-xs uppercase tracking-wider">{guide.category}</span>
                <span className="text-gray-700">·</span>
                <span className="text-gray-600 text-xs">{guide.level}</span>
              </div>
              <h2 className="text-white font-bold text-xl group-hover:text-yellow-400 transition-colors">
                {guide.title}
              </h2>
              <p className="text-gray-400 text-sm">{guide.subtitle}</p>
              <p className="text-gray-600 text-sm">{guide.description}</p>
            </div>
            <div className="flex-shrink-0 flex items-center gap-4">
              <span className="text-gray-600 text-xs border border-gray-700 px-2 py-1">{guide.readingTime}</span>
              <span className="text-yellow-400 text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                Lire →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
