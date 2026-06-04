import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, Shield, CheckCircle, Phone, ArrowRight, Building2, Users, TrendingDown, RefreshCw, AlertTriangle, Banknote } from 'lucide-react';
import PageHero from '../components/ui/PageHero';
import CTABanner from '../components/ui/CTABanner';
import { CITY_MAP, LOAN_TYPES, type City } from '../data/cities';
import { useSiteContent } from '../lib/SiteContentContext';
import { interpolateContent } from '../lib/siteContentDefaults';

const SERVICE_ICONS: Record<string, React.ReactNode> = {
    particuliers: <Users className="h-6 w-6 text-accent-500" />,
    entreprises: <Building2 className="h-6 w-6 text-accent-500" />,
    'financement-temporaire': <Banknote className="h-6 w-6 text-accent-500" />,
    'consolidation-dettes': <TrendingDown className="h-6 w-6 text-accent-500" />,
    'deuxieme-chance-credit': <RefreshCw className="h-6 w-6 text-accent-500" />,
    'eviter-faillite': <AlertTriangle className="h-6 w-6 text-accent-500" />,
};

function CityNotFound() {
    const { c } = useSiteContent();

    return (
        <section className="min-h-[60vh] flex items-center justify-center py-20">
            <div className="mx-auto max-w-lg px-4 text-center">
                <div className="text-6xl font-bold font-serif text-primary-200 mb-4">404</div>
                <h1 className="font-serif text-2xl font-bold text-primary-700 mb-4">{c('city.notfound.title')}</h1>
                <p className="text-gray-600 mb-8">{c('city.notfound.description')}</p>
                <Link to="/" className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                    {c('city.notfound.home')}
                </Link>
            </div>
        </section>
    );
}

function TrustBadges({ phone }: { phone: string }) {
    const { c } = useSiteContent();

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
                { icon: <Clock className="h-6 w-6" />, label: c('city.trust.1') },
                { icon: <Shield className="h-6 w-6" />, label: c('city.trust.2') },
                { icon: <CheckCircle className="h-6 w-6" />, label: c('city.trust.3') },
                { icon: <Phone className="h-6 w-6" />, label: interpolateContent(c('city.trust.4_template'), { phone }) },
            ].map((b) => (
                <div key={b.label} className="flex flex-col items-center gap-2 bg-primary-50 rounded-xl p-4 text-center">
                    <div className="text-primary-600">{b.icon}</div>
                    <span className="text-sm font-semibold text-primary-700">{b.label}</span>
                </div>
            ))}
        </div>
    );
}

function NearbySection({ city }: { city: City }) {
    const { c } = useSiteContent();
    const nearbyCities = city.nearby
        .map((slug) => CITY_MAP.get(slug))
        .filter((c): c is City => !!c);
    if (nearbyCities.length === 0) return null;

    return (
        <section className="py-12 bg-gray-50">
            <div className="mx-auto max-w-5xl px-4">
                <h2 className="font-serif text-2xl font-bold text-primary-700 mb-6">
                    {interpolateContent(c('city.nearby.titre_template'), { city: city.name })}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {nearbyCities.map((nc) => (
                        <Link
                            key={nc.slug}
                            to={`/preteur-alternatif/${nc.slug}`}
                            className="flex items-center gap-2 bg-white rounded-lg px-4 py-3 text-sm font-medium text-primary-700 hover:bg-primary-50 hover:text-accent-600 transition-colors border border-gray-100 shadow-sm"
                        >
                            <MapPin className="h-4 w-4 text-accent-400 shrink-0" />
                            {nc.name}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function VillePage() {
    const { c } = useSiteContent();
    const { ville } = useParams<{ ville: string }>();
    const city = ville ? CITY_MAP.get(ville) : undefined;

    if (!city) return <CityNotFound />;

    const phone = c('coord.telephone1');
    const nearby = city.nearby.slice(0, 3).map((slug) => CITY_MAP.get(slug)?.name).filter(Boolean).join(', ');
    const heroTitle = interpolateContent(c('city.hero.titre_template'), { city: city.name });
    const heroSubtitle = interpolateContent(c('city.hero.soustitre_template'), { city: city.name });

    return (
        <>
            <PageHero
                title={heroTitle}
                subtitle={heroSubtitle}
                breadcrumb={[
                    { label: 'Régions', path: '/preteur-alternatif' },
                    { label: city.name },
                ]}
            />

            {/* Intro + Trust */}
            <section className="py-12 md:py-16">
                <div className="mx-auto max-w-5xl px-4">
                    <div className="prose prose-lg max-w-none mb-10">
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary-700">
                            {interpolateContent(c('city.intro.titre_template'), { city: city.name, region: city.region })}
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            {interpolateContent(c('city.intro.body1_template'), { city: city.name, nearby, region: city.region })}
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            {interpolateContent(c('city.intro.body2_template'), { city: city.name, distance: city.distance })}
                        </p>
                    </div>
                    <TrustBadges phone={phone} />
                </div>
            </section>

            {/* Services grid */}
            <section className="py-12 md:py-16 bg-gray-50">
                <div className="mx-auto max-w-5xl px-4">
                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary-700 mb-8 text-center">
                        {interpolateContent(c('city.services.titre_template'), { city: city.name })}
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {LOAN_TYPES.map((lt) => (
                            <Link
                                key={lt.slug}
                                to={lt.path}
                                className="group bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-accent-200 transition-all"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="shrink-0 mt-0.5">{SERVICE_ICONS[lt.slug]}</div>
                                    <div>
                                        <h3 className="font-semibold text-primary-700 group-hover:text-accent-600 transition-colors mb-1.5">
                                            {c(`city.services.${lt.slug}`, lt.label)}
                                        </h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">
                                            {interpolateContent(c('city.services.card_desc_template'), { city: city.name, region: city.region })}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center gap-1 text-accent-500 text-sm font-medium">
                                    {c('city.services.more')} <ArrowRight className="h-4 w-4" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why choose us */}
            <section className="py-12 md:py-16">
                <div className="mx-auto max-w-5xl px-4">
                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary-700 mb-8">
                        {interpolateContent(c('city.why.titre_template'), { city: city.name })}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            {
                                title: c('city.why.1.titre'),
                                text: interpolateContent(c('city.why.1.texte_template'), { city: city.name }),
                            },
                            {
                                title: c('city.why.2.titre'),
                                text: interpolateContent(c('city.why.2.texte_template'), { city: city.name }),
                            },
                            {
                                title: c('city.why.3.titre'),
                                text: interpolateContent(c('city.why.3.texte_template'), { city: city.name }),
                            },
                            {
                                title: c('city.why.4.titre'),
                                text: c('city.why.4.texte'),
                            },
                        ].map((item) => (
                            <div key={item.title} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                                <h3 className="font-semibold text-primary-700 mb-2">{item.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Local FAQ */}
            <section className="py-12 md:py-16 bg-primary-50">
                <div className="mx-auto max-w-4xl px-4">
                    <h2 className="font-serif text-2xl font-bold text-primary-700 mb-8 text-center">
                        {interpolateContent(c('city.faq.titre_template'), { city: city.name })}
                    </h2>
                    <div className="space-y-4">
                        {[
                            {
                                q: interpolateContent(c('city.faq.1.q_template'), { city: city.name }),
                                a: interpolateContent(c('city.faq.1.a_template'), { city: city.name, phone }),
                            },
                            {
                                q: interpolateContent(c('city.faq.2.q_template'), { city: city.name }),
                                a: interpolateContent(c('city.faq.2.a_template'), { city: city.name }),
                            },
                            {
                                q: interpolateContent(c('city.faq.3.q_template'), { city: city.name }),
                                a: interpolateContent(c('city.faq.3.a_template'), { city: city.name }),
                            },
                            {
                                q: interpolateContent(c('city.faq.4.q_template'), { region: city.region }),
                                a: interpolateContent(c('city.faq.4.a_template'), { city: city.name, region: city.region, nearby }),
                            },
                        ].map((faq) => (
                            <details key={faq.q} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm group">
                                <summary className="flex items-start gap-3 cursor-pointer font-medium text-primary-700 list-none [&::-webkit-details-marker]:hidden">
                                    <span className="text-accent-500 mt-0.5 shrink-0">▸</span>
                                    {faq.q}
                                </summary>
                                <p className="mt-3 text-gray-600 text-sm leading-relaxed pl-6">{faq.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Nearby cities */}
            <NearbySection city={city} />

            {/* CTA */}
            <CTABanner
                title={interpolateContent(c('city.cta.titre_template'), { city: city.name })}
                subtitle={c('city.cta.soustitre')}
            />
        </>
    );
}
