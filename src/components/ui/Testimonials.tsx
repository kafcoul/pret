import { useState, useRef, useEffect, useCallback } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSiteContent } from '../../lib/SiteContentContext';

type Testimonial = { name: string; location: string; text: string; rating: number; service: string };

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    className={`h-4 w-4 ${i < rating ? 'text-accent-400 fill-accent-400' : 'text-gray-300'}`}
                />
            ))}
        </div>
    );
}

function TestimonialCard({ t }: { t: Testimonial }) {
    return (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10 h-full flex flex-col">
            <div className="flex items-start gap-3 md:gap-4 flex-1">
                <div className="bg-accent-500/20 p-1.5 md:p-2 rounded-lg shrink-0 mt-0.5">
                    <Quote className="h-4 w-4 md:h-5 md:w-5 text-accent-400" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col">
                    <p className="text-primary-100 text-xs md:text-sm leading-relaxed mb-3 md:mb-4 flex-1">
                        « {t.text} »
                    </p>
                    <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                            <p className="font-semibold text-white text-xs md:text-sm">{t.name}</p>
                            <p className="text-primary-300 text-[11px] md:text-xs truncate">{t.location} — {t.service}</p>
                        </div>
                        <StarRating rating={t.rating} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Testimonials() {
    const { c } = useSiteContent();
    const [active, setActive] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef(0);

    const DEFAULTS: Testimonial[] = [
        { name: 'Marie-Claire D.', location: 'Montréal, QC',  text: "Après avoir été refusée par ma banque, l'équipe m'a aidée à consolider mes dettes en moins d'une semaine. Le service est rapide, confidentiel et professionnel. Je recommande à 100 %.", rating: 5, service: 'Consolidation de dettes' },
        { name: 'Jean-François T.', location: 'Toronto, ON',   text: "En tant que travailleur autonome, obtenir du financement bancaire était impossible. Grâce à eux, j'ai pu acheter mon duplex et le rénover. Approuvé en 48 heures, comme promis !",       rating: 5, service: 'Financement temporaire' },
        { name: 'Stéphanie R.',     location: 'Calgary, AB',   text: "Après ma faillite, je pensais ne plus jamais pouvoir obtenir de prêt. L'équipe m'a guidée avec respect et m'a offert une 2e chance. Aujourd'hui, ma cote de crédit est rétablie.",         rating: 5, service: '2e chance au crédit' },
        { name: 'Patrick L.',       location: 'Vancouver, BC', text: "J'avais besoin de fonds rapidement pour saisir une opportunité d'affaires. Le processus a été simple et transparent. Un service exceptionnel que je recommande à tous les entrepreneurs.", rating: 5, service: 'Financement entreprise' },
    ];

    const testimonials: Testimonial[] = ([1, 2, 3, 4] as const).map((n, i) => ({
        name:     c(`temoignage.${n}.nom`,     DEFAULTS[i].name),
        location: c(`temoignage.${n}.ville`,   DEFAULTS[i].location),
        text:     c(`temoignage.${n}.texte`,   DEFAULTS[i].text),
        service:  c(`temoignage.${n}.service`, DEFAULTS[i].service),
        rating:   5,
    }));

    const goTo = useCallback((index: number) => {
        const clamped = Math.max(0, Math.min(index, testimonials.length - 1));
        setActive(clamped);
        const container = scrollRef.current;
        const child = container?.children[clamped] as HTMLElement | undefined;
        if (container && child) {
            container.scrollTo({
                left: child.offsetLeft - container.offsetLeft,
                behavior: 'smooth',
            });
        }
    }, [testimonials.length]);

    // Auto-défilement toutes les 5 secondes sur mobile
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 767px)');
        if (!mq.matches) return;

        const interval = setInterval(() => {
            setActive((prev) => {
                const next = (prev + 1) % testimonials.length;
                const container = scrollRef.current;
                const child = container?.children[next] as HTMLElement | undefined;
                if (container && child) {
                    container.scrollTo({
                        left: child.offsetLeft - container.offsetLeft,
                        behavior: 'smooth',
                    });
                }
                return next;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [testimonials.length]);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            goTo(active + (diff > 0 ? 1 : -1));
        }
    };

    return (
        <section className="py-12 md:py-20 bg-primary-800 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 20% 50%, rgba(200,150,62,0.4) 0%, transparent 40%), radial-gradient(circle at 80% 50%, rgba(200,150,62,0.3) 0%, transparent 40%)',
                    }}
                />
            </div>

            <div className="relative mx-auto max-w-7xl px-4">
                <div className="text-center mb-8 md:mb-14">
                    <h2 className="font-serif text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4">
                        {c('temoignage.titre', 'Ce que nos clients disent de nous')}
                    </h2>
                    <p className="text-primary-200 text-sm md:text-lg max-w-2xl mx-auto">
                        {c('temoignage.soustitre', 'Des milliers de Québécois nous font confiance depuis 1998')}
                    </p>
                </div>

                {/* Mobile : carrousel horizontal */}
                <div className="md:hidden">
                    <div
                        ref={scrollRef}
                        className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide pb-4 -mx-4 px-4"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        {testimonials.map((t, i) => (
                            <div
                                key={i}
                                className="snap-center shrink-0 w-[85vw] max-w-sm"
                            >
                                <TestimonialCard t={t} />
                            </div>
                        ))}
                    </div>

                    {/* Indicateurs + flèches */}
                    <div className="flex items-center justify-center gap-4 mt-4">
                        <button
                            onClick={() => goTo(active - 1)}
                            className="p-1.5 rounded-full bg-white/10 text-white disabled:opacity-30 transition-opacity"
                            disabled={active === 0}
                            aria-label="Témoignage précédent"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        <div className="flex gap-1.5">
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goTo(i)}
                                    className={`h-2 rounded-full transition-all ${i === active ? 'w-5 bg-accent-400' : 'w-2 bg-white/30'}`}
                                    aria-label={`Aller au témoignage ${i + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={() => goTo(active + 1)}
                            className="p-1.5 rounded-full bg-white/10 text-white disabled:opacity-30 transition-opacity"
                            disabled={active === testimonials.length - 1}
                            aria-label="Témoignage suivant"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Desktop : grille 2 colonnes */}
                <div className="hidden md:grid md:grid-cols-2 gap-6">
                    {testimonials.map((t, i) => (
                        <TestimonialCard key={i} t={t} />
                    ))}
                </div>
            </div>
        </section>
    );
}
