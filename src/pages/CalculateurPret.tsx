import { useState, useMemo } from 'react';
import { Calculator, DollarSign, Percent, CalendarDays, TrendingUp, Info } from 'lucide-react';
import PageHero from '../components/ui/PageHero';
import CTABanner from '../components/ui/CTABanner';
import { useSiteContent } from '../lib/SiteContentContext';

interface LoanResult {
    mensualite: number;
    totalInterets: number;
    coutTotal: number;
    ratio: number;
}

function calculateLoan(montant: number, tauxAnnuel: number, dureeAnnees: number): LoanResult | null {
    if (montant <= 0 || tauxAnnuel <= 0 || dureeAnnees <= 0) return null;
    const tauxMensuel = tauxAnnuel / 100 / 12;
    const nombrePaiements = dureeAnnees * 12;
    const mensualite =
        (montant * tauxMensuel * Math.pow(1 + tauxMensuel, nombrePaiements)) /
        (Math.pow(1 + tauxMensuel, nombrePaiements) - 1);
    const coutTotal = mensualite * nombrePaiements;
    const totalInterets = coutTotal - montant;
    const ratio = (totalInterets / coutTotal) * 100;
    return { mensualite, totalInterets, coutTotal, ratio };
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-CA', {
        style: 'currency',
        currency: 'CAD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

const presets = [
    { label: '50 000 $', value: 50000 },
    { label: '100 000 $', value: 100000 },
    { label: '200 000 $', value: 200000 },
    { label: '300 000 $', value: 300000 },
    { label: '500 000 $', value: 500000 },
];

export default function CalculateurPret() {
    const { c } = useSiteContent();
    const [montant, setMontant] = useState(100000);
    const [taux, setTaux] = useState(8.5);
    const [duree, setDuree] = useState(1);

    const result = useMemo(() => calculateLoan(montant, taux, duree), [montant, taux, duree]);

    return (
        <>
            <PageHero
                title={c('calculateur.hero.titre', 'Calculateur de prêt')}
                subtitle={c('calculateur.hero.soustitre', 'Estimez vos versements mensuels en quelques secondes')}
                breadcrumb={[{ label: c('breadcrumb.calculateur', 'Calculateur') }]}
            />

            <section className="py-16 md:py-20">
                <div className="mx-auto max-w-6xl px-4">
                    {/* Info banner */}
                    <div className="bg-accent-50 border-l-4 border-accent-500 p-5 rounded-r-xl mb-10">
                        <p className="text-primary-700 font-medium text-sm">
                            {c(
                                'calculateur.info',
                                'Cet outil vous donne une estimation de vos paiements mensuels. Les taux et conditions réels peuvent varier selon votre situation. Contactez-nous pour une soumission personnalisée.'
                            )}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* ─── Formulaire (3 cols) ─── */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                                <h2 className="font-serif text-xl font-bold text-primary-700 mb-6 flex items-center gap-2">
                                    <Calculator className="h-5 w-5 text-accent-500" />
                                    Paramètres du prêt
                                </h2>

                                {/* Montant */}
                                <div className="mb-8">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-primary-700 mb-3">
                                        <DollarSign className="h-4 w-4 text-accent-500" />
                                        Montant du prêt
                                    </label>
                                    <input
                                        type="range"
                                        min={10000}
                                        max={1000000}
                                        step={5000}
                                        value={montant}
                                        onChange={(e) => setMontant(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent-500"
                                    />
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs text-gray-400">10 000 $</span>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={montant.toLocaleString('fr-CA')}
                                            onChange={(e) => {
                                                const v = parseInt(e.target.value.replace(/\D/g, ''), 10);
                                                if (!isNaN(v)) setMontant(Math.min(v, 2000000));
                                            }}
                                            className="text-center font-bold text-primary-700 text-lg bg-primary-50 rounded-lg px-4 py-1.5 w-40 border border-gray-200 focus:ring-2 focus:ring-accent-400 focus:border-accent-400 outline-none"
                                            aria-label="Montant du prêt"
                                        />
                                        <span className="text-xs text-gray-400">1 000 000 $</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {presets.map((p) => (
                                            <button
                                                key={p.value}
                                                type="button"
                                                onClick={() => setMontant(p.value)}
                                                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${montant === p.value
                                                        ? 'bg-accent-500 text-white border-accent-500'
                                                        : 'bg-white text-gray-600 border-gray-200 hover:border-accent-300'
                                                    }`}
                                            >
                                                {p.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Taux */}
                                <div className="mb-8">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-primary-700 mb-3">
                                        <Percent className="h-4 w-4 text-accent-500" />
                                        Taux d'intérêt annuel
                                    </label>
                                    <input
                                        type="range"
                                        min={3}
                                        max={20}
                                        step={0.25}
                                        value={taux}
                                        onChange={(e) => setTaux(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent-500"
                                    />
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs text-gray-400">3 %</span>
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            value={taux}
                                            onChange={(e) => {
                                                const v = parseFloat(e.target.value);
                                                if (!isNaN(v)) setTaux(Math.min(v, 30));
                                            }}
                                            className="text-center font-bold text-primary-700 text-lg bg-primary-50 rounded-lg px-4 py-1.5 w-28 border border-gray-200 focus:ring-2 focus:ring-accent-400 focus:border-accent-400 outline-none"
                                            aria-label="Taux d'intérêt"
                                        />
                                        <span className="text-xs text-gray-400">20 %</span>
                                    </div>
                                </div>

                                {/* Durée */}
                                <div className="mb-4">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-primary-700 mb-3">
                                        <CalendarDays className="h-4 w-4 text-accent-500" />
                                        Durée du prêt
                                    </label>
                                    <input
                                        type="range"
                                        min={0.5}
                                        max={5}
                                        step={0.5}
                                        value={duree}
                                        onChange={(e) => setDuree(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent-500"
                                    />
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs text-gray-400">6 mois</span>
                                        <span className="font-bold text-primary-700 text-lg bg-primary-50 rounded-lg px-4 py-1.5 border border-gray-200">
                                            {duree < 1 ? `${duree * 12} mois` : duree === 1 ? '1 an' : `${duree} ans`}
                                        </span>
                                        <span className="text-xs text-gray-400">5 ans</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ─── Résultats (2 cols) ─── */}
                        <div className="lg:col-span-2">
                            <div className="bg-primary-700 rounded-2xl shadow-lg p-6 md:p-8 text-white sticky top-24">
                                <h2 className="font-serif text-xl font-bold mb-6 flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-accent-400" />
                                    Résultat estimé
                                </h2>

                                {result ? (
                                    <>
                                        {/* Mensualité */}
                                        <div className="text-center mb-8">
                                            <p className="text-sm text-white/70 mb-1">Versement mensuel estimé</p>
                                            <p className="text-4xl md:text-5xl font-bold text-accent-400 font-serif">
                                                {formatCurrency(result.mensualite)}
                                            </p>
                                            <p className="text-xs text-white/50 mt-1">par mois</p>
                                        </div>

                                        {/* Détails */}
                                        <div className="space-y-4 mb-8">
                                            <div className="flex justify-between items-center py-3 border-b border-white/10">
                                                <span className="text-sm text-white/80">Montant emprunté</span>
                                                <span className="font-semibold">{formatCurrency(montant)}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-3 border-b border-white/10">
                                                <span className="text-sm text-white/80">Total des intérêts</span>
                                                <span className="font-semibold text-accent-300">{formatCurrency(result.totalInterets)}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-3 border-b border-white/10">
                                                <span className="text-sm text-white/80">Coût total du prêt</span>
                                                <span className="font-semibold">{formatCurrency(result.coutTotal)}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-3">
                                                <span className="text-sm text-white/80">Nombre de paiements</span>
                                                <span className="font-semibold">{Math.round(duree * 12)}</span>
                                            </div>
                                        </div>

                                        {/* Barre ratio capital / intérêts */}
                                        <div className="mb-6">
                                            <p className="text-xs text-white/60 mb-2">Répartition du coût total</p>
                                            <div className="flex h-3 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-accent-400 transition-all duration-500"
                                                    style={{ width: `${100 - result.ratio}%` }}
                                                    title={`Capital : ${(100 - result.ratio).toFixed(1)}%`}
                                                />
                                                <div
                                                    className="bg-white/30 transition-all duration-500"
                                                    style={{ width: `${result.ratio}%` }}
                                                    title={`Intérêts : ${result.ratio.toFixed(1)}%`}
                                                />
                                            </div>
                                            <div className="flex justify-between text-xs mt-1">
                                                <span className="text-accent-400">Capital {(100 - result.ratio).toFixed(0)} %</span>
                                                <span className="text-white/50">Intérêts {result.ratio.toFixed(0)} %</span>
                                            </div>
                                        </div>

                                        {/* CTA */}
                                        <a
                                            href="/demande-en-ligne"
                                            className="block w-full text-center bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                                        >
                                            Faire une demande →
                                        </a>
                                    </>
                                ) : (
                                    <div className="text-center py-10">
                                        <Info className="h-10 w-10 text-white/30 mx-auto mb-3" />
                                        <p className="text-white/50 text-sm">Ajustez les paramètres pour voir le résultat.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Avertissement */}
                    <div className="mt-10 bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        <div className="flex items-start gap-3">
                            <Info className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                            <div className="text-sm text-gray-500 space-y-1">
                                <p>
                                    <strong className="text-gray-700">Avertissement :</strong> Ce calculateur fournit une estimation
                                    à titre indicatif seulement. Les résultats ne constituent pas une offre de prêt ni un engagement
                                    de notre part.
                                </p>
                                <p>
                                    Les taux affichés par défaut sont représentatifs du financement alternatif. Les conditions
                                    réelles (taux, durée, frais) dépendent de votre situation personnelle, de la valeur de
                                    l'équité et du type de garantie offerte.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <CTABanner
                title={c('calculateur.cta.titre', 'Prêt à passer à l\'action ?')}
                subtitle={c('calculateur.cta.soustitre', 'Faites une demande en ligne et obtenez une réponse en 48 heures.')}
            />
        </>
    );
}
