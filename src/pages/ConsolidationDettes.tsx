import { AlertTriangle } from 'lucide-react';
import PageHero from '../components/ui/PageHero';
import PropertyGuaranteeList from '../components/ui/PropertyGuaranteeList';
import CTABanner from '../components/ui/CTABanner';
import { useSiteContent } from '../lib/SiteContentContext';

export default function ConsolidationDettes() {
  const { c } = useSiteContent();
  return (
    <>
      <PageHero
        title={c('consolidation.hero.titre', 'Consolidation de dettes')}
        subtitle={c('consolidation.hero.soustitre', 'Regroupez toutes vos dettes en un seul paiement mensuel — une solution temporaire accessible aux Canadiens de toutes les provinces, même avec un mauvais crédit.')}
        breadcrumb={[
          { label: 'Services', path: '/services/particuliers' },
          { label: 'Consolidation de dettes' },
        ]}
      />

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="bg-accent-50 border-l-4 border-accent-500 p-6 rounded-r-xl mb-10">
            <p className="text-primary-700 font-medium">
              {c('consolidation.intro.bandeau', "Faites une demande en ligne pour consolider vos dettes — un spécialiste en financement vous contacte dans les 48 heures, sans frais ni engagement.")}
            </p>
          </div>

          <h2 className="font-serif text-2xl font-bold text-primary-700 mb-4">
            {c('consolidation.quest.titre', "Qu'est-ce que la consolidation de dettes ?")}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            {c('consolidation.quest.texte', "La consolidation de dettes consiste à regrouper l'ensemble de vos dettes (cartes de crédit, prêts personnels, marges de crédit, etc.) en un seul prêt garanti par votre propriété immobilière, avec un seul paiement mensuel adapté à votre capacité. C'est une solution temporaire — accessible aux Canadiens de toutes les provinces — qui vous permet de reprendre le contrôle de vos finances et d'éviter la faillite.")}
          </p>

          <h2 className="font-serif text-2xl font-bold text-primary-700 mb-4 mt-10">
            {c('consolidation.avantages.titre', 'Les avantages')}
          </h2>
          <ul className="space-y-3 text-gray-700 mb-10">
            {c('consolidation.avantages.items', "Tous vos créanciers sont payés rapidement\nUn seul prêt, un seul paiement par mois\nPréservation de votre cote de crédit (si vous agissez rapidement)\nAlternative à la faillite\nRéduction du stress financier").split('\n').filter(Boolean).map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-accent-500 font-bold text-xl leading-none mt-0.5">✓</span>
                {item}
              </li>
            ))}
          </ul>

          {/* Warning box */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-10">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-serif font-bold text-lg text-red-700 mb-2">{c('consolidation.piege.titre', 'Piège à éviter !')}</h3>
                <p className="text-red-700 text-sm leading-relaxed">
                  {c('consolidation.piege.texte', "Attention ! Après avoir consolidé vos dettes, il est crucial de ne pas retomber dans le même cycle d'endettement. Ne réutilisez pas vos cartes de crédit et marges de crédit une fois qu'elles sont payées. Établissez un budget strict et respectez-le.")}
                </p>
              </div>
            </div>
          </div>

          <PropertyGuaranteeList />
        </div>
      </section>

      <CTABanner
        title={c('consolidation.cta.titre', 'Besoin de consolider vos dettes ?')}
        subtitle={c('consolidation.cta.soustitre', "Peu importe votre historique de crédit, nous regroupons vos dettes en un seul paiement adapté à votre capacité — et vous aidons à reprendre le contrôle.")}
        buttonText={c('consolidation.cta.bouton', 'Demande de consolidation de dettes')}
      />
    </>
  );
}
