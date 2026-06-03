import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CITY_MAP } from '../data/cities';

const SITE_URL = 'https://www.solutionsfortier.com';
const SITE_NAME = 'Solutions Financement Fortier';
const OG_IMAGE = `${SITE_URL}/og-image.png`;
const OG_IMAGE_WIDTH = '1200';
const OG_IMAGE_HEIGHT = '630';
const LOCALE = 'fr_CA';

interface PageSEO {
    title: string;
    description: string;
    keywords: string;
    ogType?: string;
}

const defaultMeta: PageSEO = {
    title: 'Solutions Financement Fortier — Prêteur Alternatif au Canada',
    description:
        'Prêteur alternatif canadien depuis 1998. Prêts rapides avec garanties immobilières approuvés en 48h. Financement pour particuliers et entreprises partout au Canada.',
    keywords:
        'prêteur alternatif Canada, prêt hypothécaire, financement rapide, garantie immobilière, prêt relais, 2e chance crédit, consolidation dettes',
};

const pageMeta: Record<string, PageSEO> = {
    '/': {
        title: 'Solutions Financement Fortier — Prêteur Alternatif au Canada | Depuis 1998',
        description:
            'Prêteur alternatif canadien depuis 1998. Prêts rapides avec garanties immobilières approuvés en 48h. Financement temporaire pour particuliers et entreprises partout au Canada, même avec un dossier de crédit difficile.',
        keywords:
            'prêteur alternatif Canada, prêt rapide, financement temporaire, garantie immobilière, prêt relais, approbation 48h, financement hypothécaire Canada, prêt privé Canada',
    },
    '/profil': {
        title: 'Profil — Solutions Financement Fortier | 25+ Ans d\'Expertise en Financement Alternatif',
        description:
            'Découvrez Solutions Financement Fortier, prêteur alternatif canadien fondé en 1998 par Claude Gosselin. Plus de 25 ans d\'expertise en financement avec garanties immobilières. Solutions pour particuliers et entreprises partout au Canada.',
        keywords:
            'profil prêteur alternatif, Claude Gosselin, solutions financement fortier, expertise financement, prêteur privé Canada, depuis 1998, financement alternatif Canada',
    },
    '/services/particuliers': {
        title: 'Services Financiers pour Particuliers — Solutions Financement Fortier | Canada',
        description:
            'Financement pour particuliers avec garanties immobilières partout au Canada. Prêts rénovation, achat immobilier, refinancement, consolidation de dettes et 2e chance au crédit. Approuvé en 48h.',
        keywords:
            'prêt particulier Canada, financement rénovation, achat immobilier, refinancement hypothécaire, prêt travailleur autonome, prêt avec garantie immobilière, prêteur privé particulier',
    },
    '/services/financement-temporaire': {
        title: 'Financement Temporaire & Prêt Relais — Solutions Financement Fortier | Canada',
        description:
            'Prêts relais et financement temporaire partout au Canada. Solutions de financement à court terme approuvées en 48h, même avec un dossier de crédit difficile. Prêt pont entre deux transactions immobilières.',
        keywords:
            'financement temporaire Canada, prêt relais, prêt pont, financement court terme, prêt rapide 48h, crédit difficile, prêt entre deux transactions',
    },
    '/services/consolidation-dettes': {
        title: 'Consolidation de Dettes avec Garantie Immobilière — Solutions Financement Fortier',
        description:
            'Consolidez vos dettes en un seul paiement mensuel avec Solutions Financement Fortier. Regroupement de dettes avec garantie immobilière partout au Canada. Réduisez vos paiements et simplifiez vos finances.',
        keywords:
            'consolidation dettes Canada, regroupement dettes, paiement unique, rachat crédit, réduire paiements mensuels, consolidation hypothécaire, dette immobilière',
    },
    '/services/deuxieme-chance-credit': {
        title: '2e Chance au Crédit — Solutions Financement Fortier | Prêt Après Faillite Canada',
        description:
            'Obtenez une 2e chance au crédit avec Solutions Financement Fortier. Prêts disponibles même après faillite, proposition consommateur ou mauvais dossier de crédit. Garantie immobilière partout au Canada.',
        keywords:
            '2e chance crédit, deuxième chance crédit Canada, prêt après faillite, mauvais crédit, proposition consommateur, prêt refusé banque, rétablir crédit',
    },
    '/services/entreprises': {
        title: 'Financement Alternatif pour Entreprises — Solutions Financement Fortier | Canada',
        description:
            'Financement alternatif pour entreprises partout au Canada. Prêts fonds de roulement, équipements, affacturage, acquisition et expansion avec garanties immobilières. Solutions rapides pour PME.',
        keywords:
            'financement entreprise Canada, prêt commercial, fonds de roulement, financement PME, prêt équipement, affacturage, prêt acquisition entreprise, prêteur alternatif entreprise',
    },
    '/services/eviter-faillite': {
        title: 'Éviter la Faillite — Alternatives et Solutions | Solutions Financement Fortier Canada',
        description:
            'Alternatives à la faillite avec Solutions Financement Fortier. Consultation budgétaire gratuite, consolidation de dettes et financement d\'urgence avec garantie immobilière. Protégez votre patrimoine.',
        keywords:
            'éviter faillite Canada, alternative faillite, consultation budgétaire, refinancement urgence, protéger patrimoine, consolidation dettes urgence, prêt urgence',
    },
    '/demande-en-ligne': {
        title: 'Demande de Financement en Ligne — Solutions Financement Fortier | Réponse Rapide',
        description:
            'Faites une demande de financement en ligne avec Solutions Financement Fortier. Formulaire simple, réponse rapide en 48h. Prêteur alternatif canadien depuis 1998. Tous types de financement disponibles.',
        keywords:
            'demande financement en ligne, formulaire prêt, demande prêt hypothécaire, soumission financement, prêt en ligne Canada, demande rapide',
    },
    '/nous-joindre': {
        title: 'Nous Joindre — Solutions Financement Fortier | 450 914-5709',
        description:
            'Contactez Solutions Financement Fortier au 450 914-5709. Situé au 490, rue de Kilkenny, Fossambault-sur-le-Lac QC G3N 3C4. Consultation gratuite. Prêteur alternatif canadien depuis 1998.',
        keywords:
            'contacter solutions financement fortier, 450 914-5709, 490 rue de kilkenny Fossambault-sur-le-Lac, prêteur alternatif Canada, consultation gratuite, rendez-vous financement',
    },
    '/calculateur': {
        title: 'Calculateur de Prêt Hypothécaire Gratuit — Solutions Financement Fortier | Simulateur',
        description:
            'Calculez vos versements mensuels avec notre simulateur de prêt gratuit. Estimez le coût total de votre financement hypothécaire. Outil interactif avec taux et durée personnalisables.',
        keywords:
            'calculateur prêt, simulateur hypothécaire, calcul versement mensuel, calculatrice prêt, estimation paiement hypothécaire, outil calcul prêt gratuit, simulateur financement',
    },
    '/faq': {
        title: 'Questions Fréquentes (FAQ) — Solutions Financement Fortier | Tout Savoir',
        description:
            'Trouvez les réponses à toutes vos questions sur le financement alternatif, les prêts avec garantie immobilière, la consolidation de dettes et la 2e chance au crédit. FAQ complète.',
        keywords:
            'FAQ prêt alternatif, questions fréquentes financement, aide prêt hypothécaire, information consolidation dettes, questions 2e chance crédit, guide financement alternatif Canada',
    },
    '/politique-confidentialite': {
        title: 'Politique de Confidentialité — Solutions Financement Fortier',
        description:
            'Politique de confidentialité de Solutions Financement Fortier. Protection de vos renseignements personnels conformément aux lois canadiennes sur la protection des données. Transparence et sécurité.',
        keywords:
            'politique confidentialité, protection données, lois canadiennes, renseignements personnels, vie privée',
    },
    '/mentions-legales': {
        title: 'Mentions Légales — Solutions Financement Fortier',
        description:
            'Mentions légales de Solutions Financement Fortier Inc. Informations juridiques, propriété intellectuelle, hébergement et réglementation canadienne applicable.',
        keywords:
            'mentions légales, informations juridiques, Solutions Financement Fortier, prêteur privé Canada',
    },
    '/admin': {
        title: 'Administration — Solutions Financement Fortier',
        description: 'Tableau de bord administrateur de Solutions Financement Fortier.',
        keywords: '',
    },
    '/preteur-alternatif': {
        title: 'Prêteur Alternatif au Canada — Toutes les Régions | Solutions Financement Fortier',
        description:
            'Solutions Financement Fortier dessert l\'ensemble du Canada. Trouvez votre prêteur alternatif à Toronto, Vancouver, Calgary, Montréal, Ottawa et dans plus de 50 villes canadiennes.',
        keywords:
            'prêteur alternatif Canada, prêt privé villes Canada, financement alternatif Toronto, prêt hypothécaire Canada, prêteur privé régions Canada',
    },
};

/** Dynamic meta for /preteur-alternatif/:ville pages */
function getCityMeta(slug: string): PageSEO | null {
    const city = CITY_MAP.get(slug);
    if (!city) return null;
    return {
        title: `Prêteur Alternatif à ${city.name} — Solutions Financement Fortier | Financement Rapide`,
        description:
            `Prêteur alternatif à ${city.name}. Prêts rapides avec garantie immobilière approuvés en 48h. Financement pour particuliers et entreprises à ${city.name}. Depuis 1998.`,
        keywords:
            `prêteur alternatif ${city.name}, prêt privé ${city.name}, financement ${city.name}, hypothèque ${city.name}, prêt rapide ${city.name}, consolidation dettes ${city.name}, 2e chance crédit ${city.name}`,
    };
}

function setMetaTag(name: string, content: string, isProperty = false) {
    const attr = isProperty ? 'property' : 'name';
    let tag = document.querySelector(`meta[${attr}="${name}"]`);
    if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
}

function setLinkTag(rel: string, href: string, extraAttrs?: Record<string, string>) {
    const selector = extraAttrs
        ? `link[rel="${rel}"]${Object.entries(extraAttrs).map(([k, v]) => `[${k}="${v}"]`).join('')}`
        : `link[rel="${rel}"]`;
    let tag = document.querySelector(selector);
    if (!tag) {
        tag = document.createElement('link');
        tag.setAttribute('rel', rel);
        if (extraAttrs) {
            Object.entries(extraAttrs).forEach(([k, v]) => tag!.setAttribute(k, v));
        }
        document.head.appendChild(tag);
    }
    (tag as HTMLLinkElement).href = href;
}

export default function SEO() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Dynamic city page meta
        const villeMatch = pathname.match(/^\/preteur-alternatif\/([^/]+)$/);
        const meta = villeMatch ? (getCityMeta(villeMatch[1]) || defaultMeta) : (pageMeta[pathname] || defaultMeta);
        const canonicalUrl = `${SITE_URL}${pathname === '/' ? '' : pathname}`;
        const isAdmin = pathname === '/admin';

        // Title
        document.title = meta.title;

        // Basic meta
        setMetaTag('description', meta.description);
        if (meta.keywords) {
            setMetaTag('keywords', meta.keywords);
        }
        setMetaTag('author', 'Solutions Financement Fortier');
        setMetaTag('robots', isAdmin ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
        setMetaTag('googlebot', isAdmin ? 'noindex, nofollow' : 'index, follow');
        setMetaTag('bingbot', isAdmin ? 'noindex, nofollow' : 'index, follow');

        // Geo meta (local SEO) — use city coordinates if on a city page
        const cityData = villeMatch ? CITY_MAP.get(villeMatch[1]) : undefined;
        setMetaTag('geo.region', cityData ? `CA-${cityData.region.substring(0, 2).toUpperCase()}` : 'CA');
        setMetaTag('geo.placename', cityData?.name || 'Canada');
        setMetaTag('geo.position', cityData ? `${cityData.lat};${cityData.lng}` : '56.1304;-106.3468');
        setMetaTag('ICBM', cityData ? `${cityData.lat}, ${cityData.lng}` : '56.1304, -106.3468');

        // Language
        setMetaTag('language', 'French');
        setMetaTag('content-language', 'fr-CA, en-CA');

        // Canonical URL
        setLinkTag('canonical', canonicalUrl);

        // Hreflang
        setLinkTag('alternate', canonicalUrl, { hreflang: 'fr-CA' });
        setLinkTag('alternate', canonicalUrl, { hreflang: 'x-default' });

        // Open Graph
        setMetaTag('og:title', meta.title, true);
        setMetaTag('og:description', meta.description, true);
        setMetaTag('og:type', meta.ogType || 'website', true);
        setMetaTag('og:locale', LOCALE, true);
        setMetaTag('og:site_name', SITE_NAME, true);
        setMetaTag('og:url', canonicalUrl, true);
        setMetaTag('og:image', OG_IMAGE, true);
        setMetaTag('og:image:width', OG_IMAGE_WIDTH, true);
        setMetaTag('og:image:height', OG_IMAGE_HEIGHT, true);
        setMetaTag('og:image:alt', `${SITE_NAME} — Prêteur alternatif au Canada`, true);
        setMetaTag('og:image:type', 'image/png', true);

        // Twitter Card
        setMetaTag('twitter:card', 'summary_large_image');
        setMetaTag('twitter:title', meta.title);
        setMetaTag('twitter:description', meta.description);
        setMetaTag('twitter:image', OG_IMAGE);
        setMetaTag('twitter:image:alt', `${SITE_NAME} — Prêteur alternatif au Canada`);

        // Additional SEO signals
        setMetaTag('format-detection', 'telephone=yes');
        setMetaTag('mobile-web-app-capable', 'yes');
        setMetaTag('apple-mobile-web-app-capable', 'yes');
        setMetaTag('apple-mobile-web-app-status-bar-style', 'default');
        setMetaTag('apple-mobile-web-app-title', SITE_NAME);
        setMetaTag('application-name', SITE_NAME);
        setMetaTag('msapplication-TileColor', '#0F2B4C');
        setMetaTag('msapplication-config', 'none');

    }, [pathname]);

    return null;
}
