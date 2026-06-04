import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import PageHero from '../components/ui/PageHero';
import CTABanner from '../components/ui/CTABanner';
import { CITIES, type City } from '../data/cities';
import { useSiteContent } from '../lib/SiteContentContext';

/** Group cities by region */
function groupByRegion(cities: City[]): Map<string, City[]> {
    const map = new Map<string, City[]>();
    for (const c of cities) {
        if (!map.has(c.region)) map.set(c.region, []);
        map.get(c.region)!.push(c);
    }
    // Sort cities within each region by population desc
    for (const arr of map.values()) {
        arr.sort((a, b) => b.population - a.population);
    }
    return map;
}

const REGION_ORDER = [
    // Québec
    'Capitale-Nationale',
    'Portneuf',
    'Chaudière-Appalaches',
    'Montréal',
    'Laval',
    'Montérégie',
    'Lanaudière',
    'Laurentides',
    'Mauricie',
    'Estrie',
    'Centre-du-Québec',
    'Saguenay–Lac-Saint-Jean',
    'Outaouais',
    'Bas-Saint-Laurent',
    // Autres provinces
    'Ontario',
    'Colombie-Britannique',
    'Alberta',
    'Manitoba',
    'Saskatchewan',
    'Nouvelle-Écosse',
    'Nouveau-Brunswick',
];

export default function VillesIndex() {
    const { c } = useSiteContent();
    const grouped = groupByRegion(CITIES);
    const regions = REGION_ORDER.filter((r) => grouped.has(r));

    return (
        <>
            <PageHero
                title={c('regions.hero.titre')}
                subtitle={c('regions.hero.soustitre')}
                breadcrumb={[{ label: c('breadcrumb.regions', 'Régions') }]}
            />

            <section className="py-12 md:py-16">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="prose prose-lg max-w-3xl mb-12">
                        <p className="text-gray-600 leading-relaxed">
                            {c('regions.intro')}
                        </p>
                    </div>

                    <div className="space-y-10">
                        {regions.map((regionName) => {
                            const cities = grouped.get(regionName)!;
                            return (
                                <div key={regionName}>
                                    <h2 className="font-serif text-xl font-bold text-primary-700 mb-4 flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-accent-400" />
                                        {regionName}
                                    </h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                        {cities.map((c) => (
                                            <Link
                                                key={c.slug}
                                                to={`/preteur-alternatif/${c.slug}`}
                                                className="bg-white rounded-lg px-4 py-3 text-sm font-medium text-primary-700 hover:bg-primary-50 hover:text-accent-600 transition-colors border border-gray-100 shadow-sm text-center"
                                            >
                                                {c.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <CTABanner
                title={c('regions.cta.titre')}
                subtitle={c('regions.cta.soustitre')}
            />
        </>
    );
}
