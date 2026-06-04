import PageHero from '../components/ui/PageHero';
import PropertyGuaranteeList from '../components/ui/PropertyGuaranteeList';
import CTABanner from '../components/ui/CTABanner';
import { useSiteContent } from '../lib/SiteContentContext';

const USAGE_KEYS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
const PRODUIT_KEYS = [1, 2, 3, 4, 5] as const;

export default function ServicesEntreprises() {
  const { c } = useSiteContent();
  return (
    <>
      <PageHero
        title={c('entreprises.hero.titre', 'Services financiers pour entreprises')}
        subtitle={c('entreprises.hero.soustitre', "Solutions de financement alternatif pour vos projets d'affaires")}
        breadcrumb={[{ label: c('breadcrumb.services.entreprises', 'Services pour entreprises') }]}
      />

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="bg-accent-50 border-l-4 border-accent-500 p-6 rounded-r-xl mb-10">
            <p className="text-primary-700 font-medium">
              {c('entreprises.bandeau', "Faites une demande de financement alternatif en ligne pour votre entreprise — un spécialiste vous contactera rapidement.")}
            </p>
          </div>

          <h2 className="font-serif text-2xl font-bold text-primary-700 mb-4">
            {c('entreprises.intro.titre', 'Financement alternatif pour entreprises')}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            {c('entreprises.intro.p1', 'Solutions Financement Fortier offre des solutions de financement alternatif pour les entreprises et les projets commerciaux. Nos prêts sont garantis par des hypothèques immobilières de 1er ou 2e rang.')}
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            {c('entreprises.intro.p2', "Nous collaborons avec des courtiers hypothécaires partout au Canada pour offrir à nos clients les meilleures solutions possibles.")}
          </p>

          <h2 className="font-serif text-2xl font-bold text-primary-700 mb-4 mt-10">
            {c('entreprises.usages.titre', 'Utilisations courantes')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {USAGE_KEYS.map((n) => (
              <div
                key={n}
                className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 p-4"
              >
                <span className="text-accent-500 font-bold text-lg leading-none mt-0.5">✓</span>
                <span className="text-gray-700 text-sm">{c(`entreprises.usage.${n}`, '')}</span>
              </div>
            ))}
          </div>

          <h2 className="font-serif text-2xl font-bold text-primary-700 mb-4">
            {c('entreprises.produits.titre', 'Nos produits pour entreprises')}
          </h2>
          <ul className="space-y-3 text-gray-700 mb-10">
            {PRODUIT_KEYS.map((n) => (
              <li key={n} className="flex items-start gap-3">
                <span className="text-accent-500 font-bold">•</span>
                {c(`entreprises.produit.${n}`, '')}
              </li>
            ))}
          </ul>

          <PropertyGuaranteeList />
        </div>
      </section>

      <CTABanner
        title={c('entreprises.cta.titre', 'Financement pour votre entreprise')}
        subtitle={c('entreprises.cta.soustitre', "Des solutions rapides et flexibles pour vos projets d'affaires.")}
        buttonText={c('entreprises.cta.bouton', 'Demande de financement entreprise')}
      />
    </>
  );
}
