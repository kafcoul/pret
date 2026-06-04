import PageHero from '../components/ui/PageHero';
import PropertyGuaranteeList from '../components/ui/PropertyGuaranteeList';
import CTABanner from '../components/ui/CTABanner';
import { useSiteContent } from '../lib/SiteContentContext';

export default function ServicesEntreprises() {
  const { c } = useSiteContent();
  return (
    <>
      <PageHero
        title={c('entreprises.hero.titre', 'Services financiers pour entreprises')}
        subtitle={c('entreprises.hero.soustitre', "Solutions de financement alternatif pour vos projets d'affaires")}
        breadcrumb={[{ label: 'Services pour entreprises' }]}
      />

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="bg-accent-50 border-l-4 border-accent-500 p-6 rounded-r-xl mb-10">
            <p className="text-primary-700 font-medium">
              Faites une demande de financement alternatif en ligne pour votre entreprise —
              un spécialiste vous contactera rapidement.
            </p>
          </div>

          <h2 className="font-serif text-2xl font-bold text-primary-700 mb-4">
            {c('entreprises.intro.titre', 'Financement alternatif pour entreprises')}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            {c('entreprises.intro.p1', 'Solutions Financement Fortier offre des solutions de financement alternatif pour les entreprises et les projets commerciaux. Nos prêts sont garantis par des hypothèques immobilières de 1er ou 2e rang.')}
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Nous collaborons avec des courtiers hypothécaires partout au Canada pour
            offrir à nos clients les meilleures solutions possibles.
          </p>

          <h2 className="font-serif text-2xl font-bold text-primary-700 mb-4 mt-10">
            Utilisations courantes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {[
              'Traverser une période financière difficile',
              'Saisir une opportunité d\'affaires rapidement',
              'Acquérir de l\'équipement ou de la machinerie',
              'Financer l\'acquisition d\'un concurrent',
              'Augmenter le fonds de roulement',
              'Financer un projet de construction commerciale',
              'Acheter un terrain pour développement',
              'Obtenir une lettre de garantie ou cautionnement',
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 p-4"
              >
                <span className="text-accent-500 font-bold text-lg leading-none mt-0.5">✓</span>
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>

          <h2 className="font-serif text-2xl font-bold text-primary-700 mb-4">
            Nos produits pour entreprises
          </h2>
          <ul className="space-y-3 text-gray-700 mb-10">
            <li className="flex items-start gap-3">
              <span className="text-accent-500 font-bold">•</span>
              Prêt fonds de roulement
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent-500 font-bold">•</span>
              Prêt pour équipements et machinerie
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent-500 font-bold">•</span>
              Affacturage
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent-500 font-bold">•</span>
              Acquisition d'immobilisations
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent-500 font-bold">•</span>
              Lettre de garantie et cautionnement
            </li>
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
