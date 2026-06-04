import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import PageHero from '../components/ui/PageHero';
import PropertyGuaranteeList from '../components/ui/PropertyGuaranteeList';
import CTABanner from '../components/ui/CTABanner';
import { useSiteContent } from '../lib/SiteContentContext';

export default function EviterFaillite() {
  const { c } = useSiteContent();
  return (
    <>
      <PageHero
        title={c('faillite.hero.titre', 'Éviter la faillite')}
        subtitle={c('faillite.hero.soustitre', 'Si vous détenez de l\'équité dans votre propriété, un prêt temporaire peut vous éviter la faillite — nous vous aidons à trouver une sortie avant qu\'il ne soit trop tard.')}
        breadcrumb={[{ label: c('breadcrumb.eviter.faillite', 'Éviter la faillite') }]}
      />

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="bg-accent-50 border-l-4 border-accent-500 p-6 rounded-r-xl mb-10">
            <p className="text-primary-700 font-medium">
              {c('faillite.bandeau', 'Faites une demande de financement en ligne pour éviter la faillite — nous aidons les Canadiens de toutes les provinces à trouver une alternative. Consultation gratuite, sans engagement.')}
            </p>
          </div>

          <h2 className="font-serif text-2xl font-bold text-primary-700 mb-4">
            {c('faillite.intro.titre', 'Ne laissez pas la faillite ruiner votre avenir')}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            {c('faillite.intro.texte', "La faillite est une solution de dernier recours qui comporte des conséquences importantes et durables sur votre vie financière, professionnelle et personnelle. Si vous possédez de l'équité dans un bien immobilier au Canada, un prêt temporaire garanti pourrait vous permettre d'éviter la faillite, de régler vos créanciers et de repartir sur des bases solides.")}
          </p>

          {/* Consequences warning */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-10">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-serif font-bold text-lg text-red-700 mb-3">
                  {c('faillite.consequences.titre', 'Conséquences de la faillite')}
                </h3>
                <ul className="space-y-2 text-red-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    {c('faillite.consequences.1', 'Perte possible de votre maison, auto et autres actifs')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    {c('faillite.consequences.2', 'Cote de crédit affectée pendant 7 ans (1re faillite) ou 14 ans (2e faillite)')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    {c('faillite.consequences.3', 'Difficulté à obtenir du crédit, un emploi ou un logement')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    {c('faillite.consequences.4', 'Impact sur votre réputation personnelle et professionnelle')}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="font-serif text-2xl font-bold text-primary-700 mb-4">
            {c('faillite.etapes.titre', 'Les étapes pour éviter la faillite')}
          </h2>
          <div className="space-y-4 mb-10">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start gap-4">
                <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-primary-700 mb-1">{c('faillite.etape1.titre', 'Consultation budgétaire gratuite')}</h3>
                  <p className="text-gray-600 text-sm">
                    {c('faillite.etape1.texte', 'Un spécialiste en budget analysera votre situation financière et vous proposera des solutions adaptées.')}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start gap-4">
                <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-primary-700 mb-1">{c('faillite.evaluation.titre', 'Évaluation de votre équité immobilière')}</h3>
                  <p className="text-gray-600 text-sm">
                    {c('faillite.evaluation.texte', "Si vous possédez un bien immobilier, nous évaluerons l'équité disponible pour garantir un prêt.")}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start gap-4">
                <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-primary-700 mb-1">{c('faillite.consolidation.titre', 'Consolidation de vos dettes')}</h3>
                  <p className="text-gray-600 text-sm">
                    {c('faillite.consolidation.texte', "Un prêt de consolidation vous permet de rembourser tous vos créanciers et de n'avoir qu'un seul paiement mensuel.")}{' '}
                    <Link to="/services/consolidation-dettes" className="text-accent-500 hover:underline">
                      {c('faillite.etape3.lien', 'En savoir plus →')}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <PropertyGuaranteeList />
        </div>
      </section>

      <CTABanner
        title={c('faillite.cta.titre', "N'attendez pas qu'il soit trop tard")}
        subtitle={c('faillite.cta.soustitre', 'Contactez-nous dès maintenant pour une consultation gratuite et confidentielle — nous travaillons avec vous pour trouver une issue avant que la situation empire.')}
        buttonText={c('faillite.cta.bouton', "Demande d'aide pour éviter la faillite")}
      />
    </>
  );
}
