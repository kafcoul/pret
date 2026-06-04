import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumb?: { label: string; path?: string }[];
}

export default function PageHero({ title, subtitle, breadcrumb }: PageHeroProps) {
  return (
    <section className="bg-linear-to-br from-primary-700 via-primary-600 to-primary-800 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav aria-label="Fil d'Ariane" className="flex items-center gap-1.5 text-sm text-primary-200 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Accueil</Link>
            {breadcrumb.map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5" />
                {item.path ? (
                  <Link to={item.path} className="hover:text-white transition-colors">{item.label}</Link>
                ) : (
                  <span className="text-white" aria-current="page">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-white mb-4">{title}</h1>
        {subtitle && (
          <p className="text-primary-100 text-lg md:text-xl max-w-3xl">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
