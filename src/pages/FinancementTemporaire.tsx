import PageHero from '../components/ui/PageHero';
import PropertyGuaranteeList from '../components/ui/PropertyGuaranteeList';
import CTABanner from '../components/ui/CTABanner';
import { useSiteContent } from '../lib/SiteContentContext';

export default function FinancementTemporaire() {
  const { c } = useSiteContent();
  return (
    <>
      <PageHero
        title={c('temporaire.hero.titre', 'Financement et refinancement temporaire')}
        subtitle={c('temporaire.hero.soustitre', 'Prêts relais à court terme pour ceux que les banques ont refusés — approbation en 48 heures, garantis par l\'équité de votre propriété.')}
        breadcrumb={[
          { label: 'Services', path: '/services/particuliers' },
          { label: 'Financement temporaire' },
        ]}
      />

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="bg-accent-50 border-l-4 border-accent-500 p-6 rounded-r-xl mb-10">
            <p className="text-primary-700 font-medium">
              Refusé par votre banque ? Besoin de liquidités rapidement ? Faites une demande en ligne
              — un spécialiste évalue votre dossier dans les 48 heures, sans frais ni engagement.
            </p>
          </div>

          <h2 className="font-serif text-2xl font-bold text-primary-700 mb-4">
            {c('temporaire.intro.titre', 'Prêts relais avec garanties immobilières')}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            {c('temporaire.intro.p1', 'Votre banque vous a dit non ? Nos prêts relais sont conçus pour les Canadiens qui ont besoin d\'une solution de financement temporaire, peu importe leur province, leur historique de crédit ou leur situation d\'emploi. Nous évaluons votre dossier en fonction de l\'équité de votre propriété — pas de votre cote de crédit.')}
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Achat immobilier, refinancement, rénovations majeures, acquisition d'entreprise,
            financement d'équipements ou transition entre deux hypothèques — si vous détenez
            de l'équité dans un bien immobilier au Canada, nous pouvons vous aider.
          </p>

          <h2 className="font-serif text-2xl font-bold text-primary-700 mb-4 mt-10">
            À qui s'adresse le financement temporaire ?
          </h2>
          <ul className="space-y-3 text-gray-700 mb-10">
            <li className="flex items-start gap-3">
              <span className="text-accent-500 font-bold">•</span>
              Particuliers avec problèmes de crédit ou faillite antérieure
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent-500 font-bold">•</span>
              Travailleurs autonomes et revenus non traditionnels
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent-500 font-bold">•</span>
              Projets de construction ou de rénovation majeure
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent-500 font-bold">•</span>
              Achat de terrain ou propriété à revenus au Canada
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent-500 font-bold">•</span>
              Acquisition d'entreprise ou d'équipements commerciaux
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent-500 font-bold">•</span>
              Transition entre deux hypothèques (prêt pont)
            </li>
          </ul>

          <PropertyGuaranteeList />
        </div>
      </section>

      <CTABanner
        title={c('temporaire.cta.titre', 'Besoin de financement temporaire ?')}
        subtitle={c('temporaire.cta.soustitre', 'Remplissez notre formulaire en ligne pour une évaluation rapide et confidentielle — un spécialiste vous répond dans les 48 heures.')}
        buttonText={c('temporaire.cta.bouton', 'Demande de financement temporaire')}
      />
    </>
  );
}
