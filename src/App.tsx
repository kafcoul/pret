import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useGeoLanguage } from './hooks/useGeoLanguage';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopButton from './components/ui/ScrollToTopButton';
import CookieConsent from './components/ui/CookieConsent';
import FloatingContact from './components/ui/FloatingContact';
import SEO from './components/SEO';
import JsonLd from './components/JsonLd';
import { ToastProvider } from './components/ui/Toast';
import { SiteContentProvider } from './lib/SiteContentContext';

// Eagerly load the homepage for instant display
import Accueil from './pages/Accueil';

// Lazy load all other pages
const Profil = lazy(() => import('./pages/Profil'));
const ServicesParticuliers = lazy(() => import('./pages/ServicesParticuliers'));
const FinancementTemporaire = lazy(() => import('./pages/FinancementTemporaire'));
const ConsolidationDettes = lazy(() => import('./pages/ConsolidationDettes'));
const DeuxiemeChanceCredit = lazy(() => import('./pages/DeuxiemeChanceCredit'));
const ServicesEntreprises = lazy(() => import('./pages/ServicesEntreprises'));
const EviterFaillite = lazy(() => import('./pages/EviterFaillite'));
const DemandeEnLigne = lazy(() => import('./pages/DemandeEnLigne'));
const NousJoindre = lazy(() => import('./pages/NousJoindre'));
const NotFound = lazy(() => import('./pages/NotFound'));
const PolitiqueConfidentialite = lazy(() => import('./pages/PolitiqueConfidentialite'));
const CalculateurPret = lazy(() => import('./pages/CalculateurPret'));
const FAQ = lazy(() => import('./pages/FAQ'));
const VillesIndex = lazy(() => import('./pages/VillesIndex'));
const VillePage = lazy(() => import('./pages/VillePage'));
const MentionsLegales = lazy(() => import('./pages/MentionsLegales'));
const Admin = lazy(() => import('./pages/Admin'));
const DemandeConfirmation = lazy(() => import('./pages/DemandeConfirmation'));

import PageSkeleton from './components/ui/PageSkeleton';


function App() {
  useGeoLanguage();

  return (
    <BrowserRouter>
      <SiteContentProvider>
        <ToastProvider>
          <ScrollToTop />
          <SEO />
          <JsonLd />
          <ScrollToTopButton />
          <FloatingContact />
          <CookieConsent />
          <Suspense fallback={<PageSkeleton />}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Accueil />} />
                <Route path="/profil" element={<Profil />} />
                <Route path="/services/particuliers" element={<ServicesParticuliers />} />
                <Route path="/services/financement-temporaire" element={<FinancementTemporaire />} />
                <Route path="/services/consolidation-dettes" element={<ConsolidationDettes />} />
                <Route path="/services/deuxieme-chance-credit" element={<DeuxiemeChanceCredit />} />
                <Route path="/services/entreprises" element={<ServicesEntreprises />} />
                <Route path="/services/eviter-faillite" element={<EviterFaillite />} />
                <Route path="/demande-en-ligne" element={<DemandeEnLigne />} />
                <Route path="/demande-confirmation" element={<DemandeConfirmation />} />
                <Route path="/nous-joindre" element={<NousJoindre />} />
                <Route path="/calculateur" element={<CalculateurPret />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
                <Route path="/mentions-legales" element={<MentionsLegales />} />
                <Route path="/preteur-alternatif" element={<VillesIndex />} />
                <Route path="/preteur-alternatif/:ville" element={<VillePage />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </ToastProvider>
      </SiteContentProvider>
    </BrowserRouter>
  );
}

export default App;
