import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CITY_MAP } from '../data/cities';

const SITE_URL = 'https://www.solutionsfortier.com';
const LOGO_URL = `${SITE_URL}/logo.svg`;
const OG_IMAGE = `${SITE_URL}/og-image.png`;

// ─── Organization / FinancialService (always present) ─────────
const jsonLdOrganization = {
    '@context': 'https://schema.org',
    '@type': ['FinancialService', 'LocalBusiness'],
    '@id': `${SITE_URL}/#organization`,
    name: 'Solutions Financement Fortier',
    alternateName: 'SFF',
    url: SITE_URL,
    logo: {
        '@type': 'ImageObject',
        '@id': `${SITE_URL}/#logo`,
        url: LOGO_URL,
        contentUrl: LOGO_URL,
        caption: 'Solutions Financement Fortier',
    },
    image: {
        '@type': 'ImageObject',
        url: OG_IMAGE,
        width: 1200,
        height: 630,
    },
    description:
        'Prêteur alternatif canadien depuis 1998. Prêts rapides avec garanties immobilières approuvés en 48h pour particuliers et entreprises partout au Canada.',
    foundingDate: '1998',
    founder: {
        '@type': 'Person',
        name: 'Claude Gosselin',
    },
    address: {
        '@type': 'PostalAddress',
        streetAddress: '490, rue de Kilkenny',
        addressLocality: 'Fossambault-sur-le-Lac',
        addressRegion: 'QC',
        postalCode: 'G3N 3C4',
        addressCountry: 'CA',
    },
    geo: {
        '@type': 'GeoCoordinates',
        latitude: 46.8780,
        longitude: -71.6170,
    },
    telephone: '+1-450-914-5709',
    email: 'info@solutionsfortier.com',
    faxNumber: '+1-450-914-5709',
    areaServed: [
        {
            '@type': 'Country',
            name: 'Canada',
            '@id': 'https://en.wikipedia.org/wiki/Canada',
        },
        { '@type': 'Province', name: 'Québec' },
        { '@type': 'Province', name: 'Ontario' },
        { '@type': 'Province', name: 'British Columbia' },
        { '@type': 'Province', name: 'Alberta' },
        { '@type': 'Province', name: 'Manitoba' },
        { '@type': 'Province', name: 'Saskatchewan' },
        { '@type': 'Province', name: 'Nova Scotia' },
        { '@type': 'Province', name: 'New Brunswick' },
        { '@type': 'Province', name: 'Prince Edward Island' },
        { '@type': 'Province', name: 'Newfoundland and Labrador' },
    ],
    serviceArea: {
        '@type': 'Country',
        name: 'Canada',
    },
    sameAs: ['https://www.facebook.com/solutionsfortier'],
    openingHoursSpecification: [
        {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '08:30',
            closes: '17:00',
        },
    ],
    priceRange: '$$',
    currenciesAccepted: 'CAD',
    paymentAccepted: 'Chèque, Virement bancaire',
    hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Services de financement',
        itemListElement: [
            {
                '@type': 'Offer',
                itemOffered: {
                    '@type': 'FinancialProduct',
                    name: 'Financement pour particuliers',
                    description: 'Prêts avec garantie immobilière pour particuliers',
                },
            },
            {
                '@type': 'Offer',
                itemOffered: {
                    '@type': 'FinancialProduct',
                    name: 'Financement pour entreprises',
                    description: 'Solutions de financement commercial avec garantie immobilière',
                },
            },
            {
                '@type': 'Offer',
                itemOffered: {
                    '@type': 'FinancialProduct',
                    name: 'Consolidation de dettes',
                    description: 'Regroupement de dettes en un seul paiement mensuel',
                },
            },
            {
                '@type': 'Offer',
                itemOffered: {
                    '@type': 'FinancialProduct',
                    name: '2e chance au crédit',
                    description: 'Financement après faillite ou mauvais dossier de crédit',
                },
            },
        ],
    },
    aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '127',
        bestRating: '5',
        worstRating: '1',
    },
    review: [
        {
            '@type': 'Review',
            author: { '@type': 'Person', name: 'Marie-Claude L.' },
            datePublished: '2024-08-15',
            reviewBody: 'Service rapide et professionnel. Approuvé en moins de 48 heures!',
            reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        },
        {
            '@type': 'Review',
            author: { '@type': 'Person', name: 'Jean-Philippe R.' },
            datePublished: '2024-06-20',
            reviewBody: 'Excellente solution pour notre refinancement. Très satisfait du service.',
            reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        },
    ],
    slogan: 'Votre prêteur alternatif canadien de confiance depuis 1998',
    knowsAbout: [
        'Prêt hypothécaire alternatif',
        'Financement avec garantie immobilière',
        'Consolidation de dettes',
        'Prêt relais',
        'Financement temporaire',
        '2e chance au crédit',
        'Prêt après faillite',
        'Financement commercial',
    ],
};

// ─── WebSite schema (enables sitelinks searchbox) ─────────────
const jsonLdWebSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: 'Solutions Financement Fortier',
    alternateName: 'SFF',
    url: SITE_URL,
    description: 'Prêteur alternatif canadien depuis 1998.',
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'fr-CA',
    potentialAction: {
        '@type': 'SearchAction',
        target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_URL}/faq?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
    },
};

// ─── Page-specific JSON-LD ────────────────────────────────────
const pageJsonLd: Record<string, object | object[]> = {
    '/': [
        {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            '@id': `${SITE_URL}/#webpage`,
            name: 'Solutions Financement Fortier — Prêteur Alternatif au Canada',
            description:
                'Prêteur alternatif canadien depuis 1998. Prêts rapides avec garanties immobilières approuvés en 48h.',
            url: SITE_URL,
            isPartOf: { '@id': `${SITE_URL}/#website` },
            about: { '@id': `${SITE_URL}/#organization` },
            primaryImageOfPage: { '@type': 'ImageObject', url: OG_IMAGE },
            inLanguage: 'fr-CA',
        },
    ],
    '/profil': {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'Profil — Solutions Financement Fortier',
        description:
            'Solutions Financement Fortier, prêteur alternatif canadien fondé en 1998. Plus de 25 ans d\'expertise en financement partout au Canada.',
        url: `${SITE_URL}/profil`,
        mainEntity: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'fr-CA',
    },
    '/services/particuliers': [
        {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Financement pour particuliers',
            description:
                'Prêts avec garantie immobilière pour particuliers partout au Canada. Rénovation, achat, refinancement, consolidation de dettes.',
            url: `${SITE_URL}/services/particuliers`,
            provider: { '@id': `${SITE_URL}/#organization` },
            areaServed: { '@type': 'Country', name: 'Canada' },
            serviceType: 'Prêt hypothécaire alternatif',
            category: 'Financial Services',
            offers: {
                '@type': 'Offer',
                availability: 'https://schema.org/InStock',
                areaServed: 'CA',
            },
        },
        {
            '@context': 'https://schema.org',
            '@type': 'FinancialProduct',
            name: 'Prêt avec garantie immobilière — Particuliers',
            description: 'Financement rapide pour particuliers avec équité immobilière comme garantie.',
            url: `${SITE_URL}/services/particuliers`,
            provider: { '@id': `${SITE_URL}/#organization` },
            feesAndCommissionsSpecification: 'Frais d\'ouverture de dossier applicables',
        },
    ],
    '/services/financement-temporaire': {
        '@context': 'https://schema.org',
        '@type': 'FinancialProduct',
        name: 'Financement Temporaire et Prêt Relais',
        description:
            'Prêts relais et financement temporaire à court terme. Approuvé en 48h, même avec un dossier difficile.',
        url: `${SITE_URL}/services/financement-temporaire`,
        provider: { '@id': `${SITE_URL}/#organization` },
        category: 'Bridge Loan',
    },
    '/services/consolidation-dettes': {
        '@context': 'https://schema.org',
        '@type': 'FinancialProduct',
        name: 'Consolidation de Dettes',
        description:
            'Regroupement de dettes en un seul paiement mensuel avec garantie immobilière.',
        url: `${SITE_URL}/services/consolidation-dettes`,
        provider: { '@id': `${SITE_URL}/#organization` },
        category: 'Debt Consolidation',
    },
    '/services/deuxieme-chance-credit': {
        '@context': 'https://schema.org',
        '@type': 'FinancialProduct',
        name: '2e Chance au Crédit',
        description:
            'Prêts disponibles après faillite ou mauvais dossier de crédit avec garantie immobilière.',
        url: `${SITE_URL}/services/deuxieme-chance-credit`,
        provider: { '@id': `${SITE_URL}/#organization` },
        category: 'Second Chance Credit',
    },
    '/services/entreprises': {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Financement pour Entreprises',
        description:
            'Financement alternatif pour entreprises. Fonds de roulement, équipements, acquisition.',
        url: `${SITE_URL}/services/entreprises`,
        provider: { '@id': `${SITE_URL}/#organization` },
        serviceType: 'Financement commercial',
        category: 'Business Financial Services',
    },
    '/services/eviter-faillite': {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Alternatives à la Faillite',
        description:
            'Consultation budgétaire gratuite et solutions pour éviter la faillite.',
        url: `${SITE_URL}/services/eviter-faillite`,
        provider: { '@id': `${SITE_URL}/#organization` },
        serviceType: 'Financial Counseling',
    },
    '/demande-en-ligne': {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Demande de financement en ligne',
        description:
            'Faites une demande de financement en ligne avec Solutions Financement Fortier.',
        url: `${SITE_URL}/demande-en-ligne`,
        potentialAction: {
            '@type': 'ApplyAction',
            target: `${SITE_URL}/demande-en-ligne`,
            name: 'Demande de financement',
            description: 'Remplir le formulaire de demande de financement en ligne',
        },
    },
    '/nous-joindre': [
        {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Nous Joindre — Solutions Financement Fortier',
            description: 'Contactez Solutions Financement Fortier. 490, rue de Kilkenny, Fossambault-sur-le-Lac.',
            url: `${SITE_URL}/nous-joindre`,
            mainEntity: { '@id': `${SITE_URL}/#organization` },
        },
    ],
    '/calculateur': {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Calculateur de Prêt Hypothécaire',
        description:
            'Outil gratuit pour calculer vos versements mensuels et le coût total d\'un prêt hypothécaire.',
        url: `${SITE_URL}/calculateur`,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'CAD',
        },
        provider: { '@id': `${SITE_URL}/#organization` },
    },
    '/faq': {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        name: 'Questions Fréquentes — Solutions Financement Fortier',
        description: 'Réponses aux questions fréquentes sur le financement alternatif, les prêts avec garantie immobilière et la consolidation de dettes.',
        url: `${SITE_URL}/faq`,
        mainEntity: [],  // Populated dynamically via FAQ_SCRIPT_ID
        inLanguage: 'fr-CA',
    },
    '/politique-confidentialite': {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Politique de Confidentialité',
        description: 'Politique de confidentialité de Solutions Financement Fortier.',
        url: `${SITE_URL}/politique-confidentialite`,
    },
};

// ─── SiteNavigationElement ────────────────────────────────────
const jsonLdNavigation = {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    name: 'Menu principal',
    hasPart: [
        { '@type': 'SiteNavigationElement', name: 'Accueil', url: SITE_URL },
        { '@type': 'SiteNavigationElement', name: 'Profil', url: `${SITE_URL}/profil` },
        { '@type': 'SiteNavigationElement', name: 'Services Particuliers', url: `${SITE_URL}/services/particuliers` },
        { '@type': 'SiteNavigationElement', name: 'Financement Temporaire', url: `${SITE_URL}/services/financement-temporaire` },
        { '@type': 'SiteNavigationElement', name: 'Consolidation de Dettes', url: `${SITE_URL}/services/consolidation-dettes` },
        { '@type': 'SiteNavigationElement', name: '2e Chance Crédit', url: `${SITE_URL}/services/deuxieme-chance-credit` },
        { '@type': 'SiteNavigationElement', name: 'Services Entreprises', url: `${SITE_URL}/services/entreprises` },
        { '@type': 'SiteNavigationElement', name: 'Éviter la Faillite', url: `${SITE_URL}/services/eviter-faillite` },
        { '@type': 'SiteNavigationElement', name: 'Calculateur', url: `${SITE_URL}/calculateur` },
        { '@type': 'SiteNavigationElement', name: 'FAQ', url: `${SITE_URL}/faq` },
        { '@type': 'SiteNavigationElement', name: 'Demande en Ligne', url: `${SITE_URL}/demande-en-ligne` },
        { '@type': 'SiteNavigationElement', name: 'Nous Joindre', url: `${SITE_URL}/nous-joindre` },
    ],
};

// ─── Breadcrumb map ───────────────────────────────────────────
const SCRIPT_ID = 'jsonld-organization';
const SCRIPT_WEBSITE_ID = 'jsonld-website';
const SCRIPT_PAGE_ID = 'jsonld-page';
const SCRIPT_BREADCRUMB_ID = 'jsonld-breadcrumb';
const SCRIPT_NAV_ID = 'jsonld-navigation';
const SCRIPT_CITY_ID = 'jsonld-city';

const breadcrumbMap: Record<string, { name: string; path: string }[]> = {
    '/profil': [{ name: 'Profil', path: '/profil' }],
    '/services/particuliers': [
        { name: 'Services', path: '/services/particuliers' },
        { name: 'Particuliers', path: '/services/particuliers' },
    ],
    '/services/financement-temporaire': [
        { name: 'Services', path: '/services/particuliers' },
        { name: 'Financement temporaire', path: '/services/financement-temporaire' },
    ],
    '/services/consolidation-dettes': [
        { name: 'Services', path: '/services/particuliers' },
        { name: 'Consolidation de dettes', path: '/services/consolidation-dettes' },
    ],
    '/services/deuxieme-chance-credit': [
        { name: 'Services', path: '/services/particuliers' },
        { name: '2e chance au crédit', path: '/services/deuxieme-chance-credit' },
    ],
    '/services/entreprises': [
        { name: 'Services', path: '/services/particuliers' },
        { name: 'Entreprises', path: '/services/entreprises' },
    ],
    '/services/eviter-faillite': [
        { name: 'Services', path: '/services/particuliers' },
        { name: 'Éviter la faillite', path: '/services/eviter-faillite' },
    ],
    '/demande-en-ligne': [{ name: 'Demande en ligne', path: '/demande-en-ligne' }],
    '/nous-joindre': [{ name: 'Nous joindre', path: '/nous-joindre' }],
    '/calculateur': [{ name: 'Calculateur de prêt', path: '/calculateur' }],
    '/faq': [{ name: 'Questions fréquentes', path: '/faq' }],
    '/politique-confidentialite': [{ name: 'Politique de confidentialité', path: '/politique-confidentialite' }],
};

function buildBreadcrumbLd(pathname: string) {
    const items = breadcrumbMap[pathname];
    if (!items) return null;
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE_URL}/` },
            ...items.map((item, i) => ({
                '@type': 'ListItem',
                position: i + 2,
                name: item.name,
                item: `${SITE_URL}${item.path}`,
            })),
        ],
    };
}

function injectScript(id: string, data: object | object[]) {
    let script = document.getElementById(id);
    if (!script) {
        script = document.createElement('script');
        script.id = id;
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
    }
    // If array of schemas, inject each separately or as array
    if (Array.isArray(data)) {
        script.textContent = JSON.stringify(data);
    } else {
        script.textContent = JSON.stringify(data);
    }
}

function removeScript(id: string) {
    const script = document.getElementById(id);
    if (script) script.remove();
}

export default function JsonLd() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Organization — always present
        injectScript(SCRIPT_ID, jsonLdOrganization);

        // WebSite — always present
        injectScript(SCRIPT_WEBSITE_ID, jsonLdWebSite);

        // Navigation — always present
        injectScript(SCRIPT_NAV_ID, jsonLdNavigation);

        // Page-specific
        const pageData = pageJsonLd[pathname];
        if (pageData) {
            injectScript(SCRIPT_PAGE_ID, pageData);
        } else {
            removeScript(SCRIPT_PAGE_ID);
        }

        // City-specific JSON-LD
        const villeMatch = pathname.match(/^\/preteur-alternatif\/([^/]+)$/);
        if (villeMatch) {
            const city = CITY_MAP.get(villeMatch[1]);
            if (city) {
                const cityLd = [
                    {
                        '@context': 'https://schema.org',
                        '@type': 'FinancialService',
                        name: `Solutions Financement Fortier — ${city.name}`,
                        description: `Pr\u00eateur alternatif desservant ${city.name} et la r\u00e9gion ${city.region}. Pr\u00eats rapides avec garantie immobili\u00e8re depuis 1998.`,
                        url: `${SITE_URL}/preteur-alternatif/${city.slug}`,
                        telephone: '+1-450-914-5709',
                        email: 'info@solutionsfortier.com',
                        areaServed: {
                            '@type': 'City',
                            name: city.name,
                            geo: {
                                '@type': 'GeoCoordinates',
                                latitude: city.lat,
                                longitude: city.lng,
                            },
                        },
                        provider: { '@id': `${SITE_URL}/#organization` },
                        parentOrganization: { '@id': `${SITE_URL}/#organization` },
                    },
                    {
                        '@context': 'https://schema.org',
                        '@type': 'FAQPage',
                        mainEntity: [
                            {
                                '@type': 'Question',
                                name: `Comment obtenir un pr\u00eat alternatif \u00e0 ${city.name} ?`,
                                acceptedAnswer: {
                                    '@type': 'Answer',
                                    text: `Remplissez notre formulaire en ligne ou appelez-nous au 450 914-5709. Nous \u00e9valuons votre dossier et votre propri\u00e9t\u00e9 dans la r\u00e9gion de ${city.name} pour vous proposer une solution adapt\u00e9e. L'approbation peut se faire en 48 heures.`,
                                },
                            },
                            {
                                '@type': 'Question',
                                name: `Quelle est la diff\u00e9rence entre un pr\u00eateur alternatif et une banque \u00e0 ${city.name} ?`,
                                acceptedAnswer: {
                                    '@type': 'Answer',
                                    text: `Contrairement aux banques traditionnelles de ${city.name}, un pr\u00eateur alternatif accorde davantage d'importance \u00e0 la valeur de la garantie immobili\u00e8re qu'au pointage de cr\u00e9dit.`,
                                },
                            },
                            {
                                '@type': 'Question',
                                name: `Combien puis-je emprunter avec ma propri\u00e9t\u00e9 \u00e0 ${city.name} ?`,
                                acceptedAnswer: {
                                    '@type': 'Answer',
                                    text: `Le montant d\u00e9pend de la valeur de votre propri\u00e9t\u00e9 \u00e0 ${city.name} et de l'\u00e9quit\u00e9 disponible. Nous finan\u00e7ons g\u00e9n\u00e9ralement jusqu'\u00e0 75% de la valeur marchande.`,
                                },
                            },
                        ],
                    },
                    {
                        '@context': 'https://schema.org',
                        '@type': 'BreadcrumbList',
                        itemListElement: [
                            { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE_URL}/` },
                            { '@type': 'ListItem', position: 2, name: 'R\u00e9gions', item: `${SITE_URL}/preteur-alternatif` },
                            { '@type': 'ListItem', position: 3, name: city.name, item: `${SITE_URL}/preteur-alternatif/${city.slug}` },
                        ],
                    },
                ];
                injectScript(SCRIPT_CITY_ID, cityLd);
            }
        } else {
            removeScript(SCRIPT_CITY_ID);
        }

        // Breadcrumb
        const breadcrumbData = buildBreadcrumbLd(pathname);
        if (breadcrumbData) {
            injectScript(SCRIPT_BREADCRUMB_ID, breadcrumbData);
        } else {
            removeScript(SCRIPT_BREADCRUMB_ID);
        }
    }, [pathname]);

    return null;
}
