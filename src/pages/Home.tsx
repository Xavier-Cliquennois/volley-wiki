import { Link } from 'react-router-dom';

const FEATURES = [
  { icon: '🎯', title: 'Techniques', desc: 'Animations 3D interactives des gestes fondamentaux', to: '/techniques' },
  { icon: '📍', title: 'Positions', desc: 'Rôles et responsabilités de chaque poste sur le terrain', to: '/positions' },
  { icon: '📋', title: 'Règles', desc: 'Règlement officiel FIVB simplifié et expliqué', to: '/rules' },
  { icon: '📖', title: 'Glossaire', desc: 'Vocabulaire technique du volleyball', to: '/glossary' },
];

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center space-y-6 py-8">
        <div className="inline-block border-2 border-yellow-400 px-6 py-2 text-yellow-400 text-xs uppercase tracking-widest mb-4">
          Documentation interactive
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white leading-none">
          Volley<span className="text-yellow-400">Wiki</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          La référence technique du volleyball — techniques animées en 3D, règles, positions, et glossaire.
        </p>
        <div className="flex items-center justify-center gap-4 pt-2">
          <Link to="/techniques" className="px-6 py-3 bg-yellow-400 text-black text-sm font-bold uppercase tracking-wider hover:bg-yellow-300 transition-colors border-2 border-yellow-600">
            Voir les techniques
          </Link>
          <Link to="/rules" className="px-6 py-3 border-2 border-gray-600 text-gray-300 text-sm uppercase tracking-wider hover:border-gray-400 transition-colors">
            Lire les règles
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-800" />
        <span className="text-gray-600 text-xs uppercase tracking-widest">Sections</span>
        <div className="flex-1 h-px bg-gray-800" />
      </div>

      {/* Feature cards */}
      <section className="grid md:grid-cols-2 gap-4">
        {FEATURES.map(f => (
          <Link
            key={f.to}
            to={f.to}
            className="border-2 border-gray-700 hover:border-yellow-400 p-6 transition-colors group"
          >
            <div className="text-3xl mb-3">{f.icon}</div>
            <h2 className="text-white font-bold text-lg mb-2 group-hover:text-yellow-400 transition-colors">{f.title}</h2>
            <p className="text-gray-500 text-sm">{f.desc}</p>
            <div className="mt-4 text-yellow-400 text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
              Explorer →
            </div>
          </Link>
        ))}
      </section>

      {/* Court dimensions teaser */}
      <section className="border-2 border-gray-800 p-6 space-y-4">
        <div className="text-yellow-400 text-xs uppercase tracking-widest">À savoir</div>
        <h2 className="text-white text-2xl font-bold">Le terrain en chiffres</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          {[
            { value: '18 × 9 m', label: 'Dimensions du terrain' },
            { value: '2,43 m', label: 'Hauteur du filet (hommes)' },
            { value: '6 × 6', label: 'Joueurs par équipe' },
            { value: '3 m', label: 'Zone d\'attaque' },
          ].map(stat => (
            <div key={stat.label} className="border border-gray-700 p-4 text-center">
              <div className="text-yellow-400 text-xl font-bold mb-1">{stat.value}</div>
              <div className="text-gray-500 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
