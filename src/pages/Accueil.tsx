import { Link } from 'react-router-dom';
import { Users, Building2, HardHat, Shield, Clock, Award } from 'lucide-react';
import ServiceCard from '../components/ui/ServiceCard';
import ProcessSteps from '../components/ui/ProcessSteps';
import StatsCounter from '../components/ui/StatsCounter';
import MortgageCalculator from '../components/ui/MortgageCalculator';
import Testimonials from '../components/ui/Testimonials';
import FAQ from '../components/ui/FAQ';
import CTABanner from '../components/ui/CTABanner';
import AnimateOnScroll from '../components/ui/AnimateOnScroll';
import { useSiteContent } from '../lib/SiteContentContext';
import { useTranslation } from 'react-i18next';

export default function Accueil() {
  const { c } = useSiteContent();
  const { t } = useTranslation();

  return (
    <>
      {/* Hero */}
      <section className="relative bg-linear-to-br from-primary-800 via-primary-700 to-primary-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(200, 150, 62, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(200, 150, 62, 0.2) 0%, transparent 50%)',
          }} />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-14 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 md:gap-2 bg-accent-500/20 text-accent-300 px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6">
              <Shield className="h-3.5 w-3.5 md:h-4 md:w-4" />
              {c('accueil.hero.badge', 'Prêteur alternatif canadien depuis 1998')}
            </div>
            <h1 className="font-serif text-3xl md:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
              {c('accueil.hero.titre', 'Quand votre banque dit non, nous trouvons une solution')}
            </h1>
            <p className="text-base md:text-xl text-primary-100 mb-6 md:mb-8 leading-relaxed max-w-2xl mx-auto">
              {c('accueil.hero.soustitre', 'Financement approuvé en aussi peu que 48 heures, garanti par vos actifs immobiliers. Peu importe votre province, votre situation d\'emploi ou votre dossier de crédit — nous trouvons une solution.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Link
                to="/demande-en-ligne"
                className="inline-flex items-center justify-center bg-accent-500 hover:bg-accent-400 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg transition-all hover:scale-105"
              >
                {c('accueil.hero.cta1', 'Faire une demande en ligne')}
              </Link>
              <Link
                to="/services/particuliers"
                className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg transition-all"
              >
                {t('hero.cta2')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust indicators */}
      <section className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <AnimateOnScroll animation="fade-up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center gap-4">
                <div className="bg-primary-50 p-3 rounded-xl">
                  <Clock className="h-7 w-7 text-primary-600" />
                </div>
                <div>
                  <p className="font-bold text-primary-700">{c('accueil.trust.1.titre', 'Approbation en 48h')}</p>
                  <p className="text-sm text-gray-500">{c('accueil.trust.1.desc', 'Réponse rapide garantie')}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-primary-50 p-3 rounded-xl">
                  <Shield className="h-7 w-7 text-primary-600" />
                </div>
                <div>
                  <p className="font-bold text-primary-700">{c('accueil.trust.2.titre', 'Partout au Canada')}</p>
                  <p className="text-sm text-gray-500">{c('accueil.trust.2.desc', 'Service dans toutes les provinces')}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-primary-50 p-3 rounded-xl">
                  <Award className="h-7 w-7 text-primary-600" />
                </div>
                <div>
                  <p className="font-bold text-primary-700">{c('accueil.trust.3.titre', 'Depuis 1998')}</p>
                  <p className="text-sm text-gray-500">{c('accueil.trust.3.desc', "Plus de 25 ans d'expérience")}</p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Services cards */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4">
          <AnimateOnScroll animation="fade-up">
            <div className="text-center mb-8 md:mb-14">
              <h2 className="font-serif text-2xl md:text-4xl font-bold text-primary-700 mb-2 md:mb-4">
                {c('accueil.services.titre', 'Nos services de financement')}
              </h2>
              <p className="text-gray-600 text-sm md:text-lg max-w-2xl mx-auto">
                {c('accueil.services.soustitre', 'Des solutions sur mesure avec garanties immobilières en 1er ou 2e rang, pour particuliers et entreprises — peu importe votre profil financier.')}
              </p>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            <AnimateOnScroll animation="fade-up" delay={0}>
              <ServiceCard
                icon={Users}
                title={c('accueil.carte.1.titre', 'Particuliers')}
                description={c('accueil.carte.1.desc', 'Refusé par votre banque ? Travailleur autonome, faillite antérieure, revenus irréguliers — peu importe votre situation, nous évaluons votre dossier.')}
                items={c('accueil.carte.1.items', 'Prêt rénovation\nAchat immobilier\nRefinancement\nConsolidation de dettes\nLettre de caution').split('\n').filter(Boolean)}
                link="/services/particuliers"
              />
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-up" delay={150}>
              <ServiceCard
                icon={Building2}
                title={c('accueil.carte.2.titre', 'Entreprises')}
                description={c('accueil.carte.2.desc', 'Accélérez vos projets commerciaux avec un financement rapide et flexible, garanti par vos actifs immobiliers d\'entreprise.')}
                items={c("accueil.carte.2.items", "Prêt fonds de roulement\nPrêt équipements\nAffacturage\nAcquisition d'immobilisations\nLettre de garantie").split('\n').filter(Boolean)}
                link="/services/entreprises"
              />
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-up" delay={300}>
              <ServiceCard
                icon={HardHat}
                title={c('accueil.carte.3.titre', 'Construction')}
                description={c('accueil.carte.3.desc', 'Financement de construction adapté aux promoteurs et contracteurs canadiens — du terrain au bâtiment livré.')}
                items={c("accueil.carte.3.items", "Achat de terrain\nBridge de construction\nFinancement d'infrastructure\nAccommodation pour clients acheteurs\nCautionnement permis").split('\n').filter(Boolean)}
                link="/services/entreprises"
              />
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <ProcessSteps />

      {/* Stats */}
      <StatsCounter />

      {/* Courtiers section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4">
          <AnimateOnScroll animation="zoom-in">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary-700 mb-4">
                  {c('accueil.courtiers.titre', 'Courtiers hypothécaires')}
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {c('accueil.courtiers.desc', 'Vous êtes courtier hypothécaire au Canada ? Joignez notre réseau de partenaires indépendants. Commissions compétitives, dossiers traités en 48 heures et service professionnel pour vos clients les plus complexes.')}
                </p>
                <Link
                  to="/nous-joindre"
                  className="inline-flex items-center text-accent-500 hover:text-accent-600 font-semibold transition-colors"
                >
                  {c('accueil.courtiers.cta', 'Communiquez avec nous →')}
                </Link>
              </div>
              <div className="bg-primary-50 rounded-2xl p-8 text-center shrink-0">
                <div className="text-4xl font-bold text-primary-700 font-serif">{c('accueil.courtiers.stat.chiffre', '25+')}</div>
                <div className="text-sm text-gray-600 mt-1">{c('accueil.courtiers.stat.label', "années d'expérience")}</div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Mortgage Calculator */}
      <MortgageCalculator />

      {/* Testimonials */}
      <Testimonials />

      {/* FAQ */}
      <FAQ />

      {/* CTA */}
      <CTABanner
        title={c('accueil.cta.titre', 'Obtenez votre financement en aussi peu que 48 heures')}
        subtitle={c('accueil.cta.soustitre', 'Remplissez notre formulaire en ligne — un spécialiste vous contacte rapidement, sans engagement.')}
      />
    </>
  );
}
