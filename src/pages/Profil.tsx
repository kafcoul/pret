import PageHero from '../components/ui/PageHero';
import CTABanner from '../components/ui/CTABanner';
import { useSiteContent } from '../lib/SiteContentContext';

export default function Profil() {
  const { c } = useSiteContent();
  return (
    <>
      <PageHero
        title={c('profil.hero.titre', "Profil de l'entreprise")}
        subtitle={c('profil.hero.soustitre', "Prêteur alternatif de confiance fondé en 1998 — plus de 25 ans au service des particuliers et des entreprises à travers le pays")}
        breadcrumb={[{ label: 'Profil' }]}
      />

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4">
          {/* Company history */}
          <div className="prose prose-lg max-w-none">
            <div className="bg-accent-50 border-l-4 border-accent-500 p-6 rounded-r-xl mb-10">
              <p className="text-primary-700 font-medium text-lg italic mb-0">
                « {c('profil.citation', 'Solutions Financement Fortier inc. est un prêteur alternatif canadien spécialisé dans le financement avec garanties immobilières depuis 1998 — au service des particuliers et des entreprises d\'un bout à l\'autre du pays.')} »
              </p>
            </div>

            <h2 className="font-serif text-2xl font-bold text-primary-700 mb-4">{c('profil.histoire.titre', 'Notre histoire')}</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              {c('profil.histoire.p1', 'Fondée en 1998 par M. Claude Gosselin, Solutions Financement Fortier inc. est un chef de file canadien en financement alternatif. Fort de plus de 25 années d\'expérience dans le domaine financier et immobilier, M. Gosselin a développé une expertise reconnue dans le financement temporaire avec garanties immobilières, au service des particuliers et des entreprises d\'un bout à l\'autre du pays.')}
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              {c('profil.histoire.p2', 'Cette expertise, transmise d\'une génération à l\'autre, nous permet d\'offrir un service personnalisé et adapté aux besoins de chaque client. Notre approche se distingue des institutions bancaires traditionnelles par notre flexibilité et notre rapidité d\'exécution.')}
            </p>

            <h2 className="font-serif text-2xl font-bold text-primary-700 mb-4 mt-10">{c('profil.approche.titre', 'Notre approche')}</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              {c('profil.approche.p1', 'Contrairement aux banques traditionnelles, nous basons nos décisions de prêt sur la valeur de l\'équité que vous détenez dans votre propriété, et non uniquement sur votre dossier de crédit. Cette approche nous permet d\'aider des clients que les institutions traditionnelles ne peuvent pas servir.')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
              <div className="bg-primary-50 rounded-2xl p-6">
                <h3 className="font-serif text-xl font-bold text-primary-700 mb-3">{c('profil.mission.titre', 'Notre mission')}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {c('profil.mission.texte', 'Aider nos clients à traverser des périodes financières difficiles en leur offrant des solutions de financement temporaire rapides, confidentielles et adaptées à leur situation.')}
                </p>
              </div>
              <div className="bg-primary-50 rounded-2xl p-6">
                <h3 className="font-serif text-xl font-bold text-primary-700 mb-3">{c('profil.valeurs.titre', 'Nos valeurs')}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {c('profil.valeurs.texte', 'Rapidité, confidentialité, flexibilité et respect du client. Nous traitons chaque dossier avec le plus grand soin et la plus grande discrétion.')}
                </p>
              </div>
            </div>

            <h2 className="font-serif text-2xl font-bold text-primary-700 mb-4">Pourquoi nous choisir ?</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-accent-500 font-bold text-xl leading-none mt-0.5">✓</span>
                <span>Plus de 25 ans d'expérience en financement alternatif</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent-500 font-bold text-xl leading-none mt-0.5">✓</span>
                <span>Approbation en aussi peu que 48 heures</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent-500 font-bold text-xl leading-none mt-0.5">✓</span>
                <span>Confidentialité totale de vos informations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent-500 font-bold text-xl leading-none mt-0.5">✓</span>
                <span>Financement basé sur l'équité, pas le crédit</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent-500 font-bold text-xl leading-none mt-0.5">✓</span>
                <span>Solutions personnalisées pour chaque situation</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <CTABanner
        title={c('profil.cta.titre', 'Besoin de financement ?')}
        subtitle={c('profil.cta.soustitre', 'Faites une demande en ligne et recevez une réponse en 48 heures.')}
      />
    </>
  );
}
