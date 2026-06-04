import { useState, useEffect, useMemo } from 'react';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';
import PageHero from '../components/ui/PageHero';
import CTABanner from '../components/ui/CTABanner';
import { supabase } from '../lib/supabaseClient';
import { useSiteContent } from '../lib/SiteContentContext';

interface FaqItem {
    id: number;
    question: string;
    reponse: string;
    categorie: string;
    ordre: number;
}

const CATEGORY_LABELS: Record<string, string> = {
    general: 'Général',
    admissibilite: 'Admissibilité',
    processus: 'Processus de demande',
    remboursement: 'Remboursement',
};

const CATEGORY_ICONS: Record<string, string> = {
    general: '💡',
    admissibilite: '✅',
    processus: '📋',
    remboursement: '💰',
};

function AccordionItem({ item, isOpen, onToggle }: { item: FaqItem; isOpen: boolean; onToggle: () => void }) {
    return (
        <div className="border-b border-gray-100 last:border-b-0">
            <button
                onClick={onToggle}
                className="w-full flex items-start gap-3 py-5 px-1 text-left group"
                aria-expanded={isOpen}
            >
                <ChevronDown
                    className={`h-5 w-5 text-accent-500 shrink-0 mt-0.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
                <span className="font-medium text-primary-700 group-hover:text-accent-600 transition-colors text-[15px] leading-snug">
                    {item.question}
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-5' : 'max-h-0 opacity-0'}`}
            >
                <p className="text-gray-600 text-sm leading-relaxed pl-8 pr-4">
                    {item.reponse}
                </p>
            </div>
        </div>
    );
}

export default function FAQ() {
    const { c } = useSiteContent();
    const [faqs, setFaqs] = useState<FaqItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [openId, setOpenId] = useState<number | null>(null);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    useEffect(() => {
        (async () => {
            const { data } = await supabase
                .from('faq')
                .select('id, question, reponse, categorie, ordre')
                .eq('visible', true)
                .order('ordre', { ascending: true });
            setFaqs(data || []);
            setLoading(false);
        })();
    }, []);

    // Inject FAQPage structured data for Google rich results
    useEffect(() => {
        if (faqs.length === 0) return;
        const faqSchema = {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((f) => ({
                '@type': 'Question',
                name: f.question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: f.reponse,
                },
            })),
        };
        let script = document.getElementById('jsonld-faqpage');
        if (!script) {
            script = document.createElement('script');
            script.id = 'jsonld-faqpage';
            script.setAttribute('type', 'application/ld+json');
            document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(faqSchema);
        return () => { script?.remove(); };
    }, [faqs]);

    const categories = useMemo(() => {
        const cats = new Set(faqs.map((f) => f.categorie));
        return Array.from(cats);
    }, [faqs]);

    const filtered = useMemo(() => {
        let items = faqs;
        if (activeCategory !== 'all') {
            items = items.filter((f) => f.categorie === activeCategory);
        }
        if (search.trim()) {
            const q = search.toLowerCase();
            items = items.filter(
                (f) => f.question.toLowerCase().includes(q) || f.reponse.toLowerCase().includes(q)
            );
        }
        return items;
    }, [faqs, activeCategory, search]);

    const groupedByCategory = useMemo(() => {
        const map = new Map<string, FaqItem[]>();
        filtered.forEach((f) => {
            if (!map.has(f.categorie)) map.set(f.categorie, []);
            map.get(f.categorie)!.push(f);
        });
        return map;
    }, [filtered]);

    return (
        <>
            <PageHero
                title={c('faq.hero.titre', 'Foire aux questions')}
                subtitle={c('faq.hero.soustitre', 'Trouvez rapidement les réponses à vos questions sur nos services de financement')}
                breadcrumb={[{ label: c('breadcrumb.faq', 'FAQ') }]}
            />

            <section className="py-16 md:py-20">
                <div className="mx-auto max-w-4xl px-4">
                    {/* Search + filters */}
                    <div className="mb-10 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Rechercher une question…"
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-colors"
                                aria-label="Rechercher dans la FAQ"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setActiveCategory('all')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === 'all' ? 'bg-primary-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                Toutes ({faqs.length})
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === cat ? 'bg-primary-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    {CATEGORY_ICONS[cat] || '📌'} {CATEGORY_LABELS[cat] || cat} ({faqs.filter((f) => f.categorie === cat).length})
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="flex justify-center py-20">
                            <div className="h-8 w-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                        </div>
                    )}

                    {/* No results */}
                    {!loading && filtered.length === 0 && (
                        <div className="text-center py-16">
                            <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 mb-2">Aucun résultat trouvé</p>
                            <p className="text-gray-400 text-sm">
                                Essayez avec d'autres mots-clés ou{' '}
                                <a href="/nous-joindre" className="text-accent-500 hover:underline">contactez-nous</a> directement.
                            </p>
                        </div>
                    )}

                    {/* FAQ grouped by category */}
                    {!loading && Array.from(groupedByCategory.entries()).map(([cat, items]) => (
                        <div key={cat} className="mb-8">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-lg">{CATEGORY_ICONS[cat] || '📌'}</span>
                                <h2 className="font-serif text-xl font-bold text-primary-700">
                                    {CATEGORY_LABELS[cat] || cat}
                                </h2>
                                <span className="text-xs text-gray-400 ml-1">({items.length})</span>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 md:px-6">
                                {items.map((item) => (
                                    <AccordionItem
                                        key={item.id}
                                        item={item}
                                        isOpen={openId === item.id}
                                        onToggle={() => setOpenId(openId === item.id ? null : item.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Schema.org FAQPage structured data */}
                    {!loading && faqs.length > 0 && (
                        <script
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{
                                __html: JSON.stringify({
                                    '@context': 'https://schema.org',
                                    '@type': 'FAQPage',
                                    mainEntity: faqs.map((f) => ({
                                        '@type': 'Question',
                                        name: f.question,
                                        acceptedAnswer: {
                                            '@type': 'Answer',
                                            text: f.reponse,
                                        },
                                    })),
                                }),
                            }}
                        />
                    )}
                </div>
            </section>

            <CTABanner
                title={c('faq.cta.titre', "Vous avez d'autres questions ?")}
                subtitle={c('faq.cta.soustitre', "N'hésitez pas à nous contacter — notre équipe se fera un plaisir de vous répondre.")}
                buttonText={c('faq.cta.bouton')}
                buttonLink="/nous-joindre"
            />
        </>
    );
}
