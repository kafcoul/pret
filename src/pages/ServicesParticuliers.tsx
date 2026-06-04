import { Link } from 'react-router-dom';
import { CreditCard, RefreshCw, Star, ArrowRight } from 'lucide-react';
import PageHero from '../components/ui/PageHero';
import PropertyGuaranteeList from '../components/ui/PropertyGuaranteeList';
import CTABanner from '../components/ui/CTABanner';
import { useSiteContent } from '../lib/SiteContentContext';

const SERVICE_ICONS = [RefreshCw, CreditCard, Star];
const SERVICE_PATHS = ['/services/financement-temporaire', '/services/consolidation-dettes', '/services/deuxieme-chance-credit'];
const SERVICE_DEFAULT_TITRES = ['Financement et refinancement temporaire', 'Consolidation de dettes', '2e chance au crédit'];
const SERVICE_DEFAULT_DESCS = [
  "Solutions de financement à court terme pour répondre à vos besoins immédiats, même si les institutions bancaires ne peuvent vous aider.",
  "Regroupez toutes vos dettes en un seul prêt avec un seul paiement mensuel. Une solution temporaire pour reprendre le contrôle.",
  "Vous avez un mauvais dossier de crédit ou une faillite antérieure ? Nous pouvons vous aider à vous rétablir financièrement.",
];

export default function ServicesParticuliers() {
  const { c } = useSiteContent();
  const subServices = ([1, 2, 3] as const).map((n, i) => ({
    icon: SERVICE_ICONS[i],
    title: c(`particuliers.service.${n}.titre`, SERVICE_DEFAULT_TITRES[i]),
    description: c(`particuliers.service.${n}.desc`, SERVICE_DEFAULT_DESCS[i]),
    path: SERVICE_PATHS[i],
  }));
  return (
    <>
      <PageHero
        title={c('particuliers.hero.titre', 'Services financiers pour particuliers')}
        subtitle={c('particuliers.hero.soustitre', 'Refusé par votre banque ? Prêts alternatifs garantis par votre propriété — nous aidons les particuliers d\'un bout à l\'autre du pays, peu importe votre dossier de crédit.')}
        breadcrumb={[{ label: c('breadcrumb.services.particuliers', 'Services pour particuliers') }]}
      />

      {/* Intro */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="max-w-3xl mb-12">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary-700 mb-4">
              {c('particuliers.intro.titre', 'Financement rapide pour particuliers')}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {c('particuliers.intro.p1', 'Solutions Financement Fortier offre des prêts alternatifs avec garantie immobilière aux particuliers de partout au Canada. Que vous soyez en Ontario, en Colombie-Britannique, en Alberta ou au Québec, nous évaluons votre dossier en fonction de la valeur de votre propriété — pas uniquement de votre cote de crédit.')}
            </p>
            <p className="text-gray-700 leading-relaxed">
              {c('particuliers.intro.p2', 'Travailleur autonome, revenus irréguliers, faillite antérieure, mauvais crédit ou situation atypique ? Peu importe votre profil, si vous détenez une équité immobilière au Canada, nous pouvons vous aider.')}
            </p>
          </div>

          {/* Sub-service links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {subServices.map((service) => (
              <Link
                key={service.path}
                to={service.path}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 p-6 transition-all"
              >
                <div className="bg-primary-50 group-hover:bg-accent-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors">
                  <service.icon className="h-6 w-6 text-primary-600 group-hover:text-accent-500 transition-colors" />
                </div>
                <h3 className="font-serif font-bold text-lg text-primary-700 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{service.description}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent-500 group-hover:text-accent-600 transition-colors">
                  {c('particuliers.service.lien', 'En savoir plus')} <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>

          {/* Objectif */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 md:p-10 mb-12">
            <h2 className="font-serif text-2xl font-bold text-primary-700 mb-4">{c('particuliers.objectif.titre', 'Notre objectif')}</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {c('particuliers.objectif.texte', "Notre objectif est simple : vous redonner accès au financement dont vous avez besoin, peu importe où vous vivez au Canada. Conditions flexibles, versements adaptés à votre capacité, et un traitement rapide et confidentiel.")}
            </p>
            <p className="text-gray-700 leading-relaxed">
              {c('particuliers.objectif.p2a', 'Les demandes de prêt sont généralement')} <strong>{c('particuliers.objectif.p2b', 'approuvées en 48 heures')}</strong>.{' '}
              {c('particuliers.objectif.p2c', 'Toutes les informations transmises demeurent strictement')} <strong>{c('particuliers.objectif.p2d', 'confidentielles')}</strong>.
            </p>
          </div>

          <PropertyGuaranteeList />
        </div>
      </section>

      <CTABanner
        title={c('particuliers.cta.titre', 'Faites une demande de financement en ligne')}
        subtitle={c('particuliers.cta.soustitre', 'Un spécialiste vous contacte dans les 48 heures — sans frais, sans engagement.')}
        buttonText={c('particuliers.cta.bouton', 'Demande de financement pour particuliers')}
      />
    </>
  );
}
