import PageHero from '../components/ui/PageHero';
import PropertyGuaranteeList from '../components/ui/PropertyGuaranteeList';
import CTABanner from '../components/ui/CTABanner';
import { useSiteContent } from '../lib/SiteContentContext';

export default function DeuxiemeChanceCredit() {
  const { c } = useSiteContent();
  return (
    <>
      <PageHero
        title={c('deuxieme.hero.titre', '2e chance au crédit')}
        subtitle={c('deuxieme.hero.soustitre', 'Faillite, mauvais crédit, revenus atypiques ? Partout au Canada, nous évaluons votre dossier sur la valeur de votre propriété — pas sur votre cote de crédit.')}
        breadcrumb={[
          { label: c('breadcrumb.services', 'Services'), path: '/services/particuliers' },
          { label: c('breadcrumb.deuxieme.credit', '2e chance au crédit') },
        ]}
      />

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="bg-accent-50 border-l-4 border-accent-500 p-6 rounded-r-xl mb-10">
            <p className="text-primary-700 font-medium">
              {c('deuxieme.bandeau', "Faites une demande de financement en ligne pour une 2e chance au crédit — nous évaluons votre dossier rapidement et confidentiellement, sans frais d'analyse.")}
            </p>
          </div>

          <h2 className="font-serif text-2xl font-bold text-primary-700 mb-4">
            {c('deuxieme.retablir.titre', 'Rétablissez votre crédit')}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            {c('deuxieme.retablir.p1', 'Faillite antérieure, proposition de consommateur, cote de crédit insuffisante ? Les banques traditionnelles vous ont fermé leurs portes — mais Solutions Financement Fortier peut vous offrir une deuxième chance. Peu importe votre profil financier, nous évaluons votre dossier en fonction de l\'équité de votre propriété.')}
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            {c('deuxieme.retablir.p2a', 'Notre approche est entièrement basée sur la')} <strong>{c('deuxieme.retablir.p2b', "valeur de l'équité")}</strong> {c('deuxieme.retablir.p2c', "que vous détenez dans votre propriété immobilière. Même si votre dossier de crédit est défavorable, si vous avez de l'équité, nous pouvons vous proposer une solution de financement adaptée.")}
          </p>

          <h2 className="font-serif text-2xl font-bold text-primary-700 mb-4 mt-10">
            {c('deuxieme.situations.titre', 'Situations admissibles')}
          </h2>
          <ul className="space-y-3 text-gray-700 mb-6">
            <li className="flex items-start gap-3">
              <span className="text-accent-500 font-bold">•</span>
              {c('deuxieme.situation.1', 'Faillite antérieure (libérée ou non)')}
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent-500 font-bold">•</span>
              {c('deuxieme.situation.2', 'Proposition de consommateur en cours')}
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent-500 font-bold">•</span>
              {c('deuxieme.situation.3', 'Cote de crédit faible ou inexistante')}
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent-500 font-bold">•</span>
              {c('deuxieme.situation.4', 'Retards de paiement ou comptes en recouvrement')}
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent-500 font-bold">•</span>
              {c('deuxieme.situation.5', 'Revenus non traditionnels ou non documentés')}
            </li>
          </ul>

          <div className="bg-primary-50 rounded-2xl p-6 mb-10">
            <h3 className="font-serif text-xl font-bold text-primary-700 mb-3">
              {c('deuxieme.important.titre', 'Important à savoir')}
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {c('deuxieme.important.texte', "Les taux d'intérêt pour une 2e chance au crédit peuvent être plus élevés que les taux bancaires traditionnels en raison du niveau de risque. Cependant, en respectant vos obligations de paiement, vous pourrez progressivement rétablir votre cote de crédit et éventuellement accéder à du financement traditionnel à meilleur taux.")}
            </p>
          </div>

          <PropertyGuaranteeList />
        </div>
      </section>

      <CTABanner
        title={c('deuxieme.cta.titre', 'Prêt pour une 2e chance au crédit ?')}
        subtitle={c('deuxieme.cta.soustitre', 'Faites le premier pas vers votre rétablissement financier — un spécialiste vous contacte dans les 48 heures, sans engagement.')}
        buttonText={c('deuxieme.cta.bouton', 'Demande de 2e chance au crédit')}
      />
    </>
  );
}
