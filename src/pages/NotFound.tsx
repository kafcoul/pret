import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { useSiteContent } from '../lib/SiteContentContext';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { c } = useSiteContent();
  const { t } = useTranslation();

  useEffect(() => {
    document.title = c('notfound.meta.title');
    let tag = document.querySelector('meta[name="robots"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', 'robots');
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', 'noindex, nofollow');
  }, [c]);
  return (
    <section className="min-h-[60vh] flex items-center justify-center py-20">
      <div className="mx-auto max-w-lg px-4 text-center">
        <div className="text-8xl font-bold font-serif text-primary-200 mb-4">404</div>
        <h1 className="font-serif text-3xl font-bold text-primary-700 mb-4">
          {t('notfound.title')}
        </h1>
        <p className="text-gray-600 mb-8">
          {t('notfound.description')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            <Home className="h-5 w-5" />
            {t('notfound.home')}
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            {t('notfound.back')}
          </button>
        </div>
      </div>
    </section>
  );
}
