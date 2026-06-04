import { FileText, Search, Handshake, Banknote } from 'lucide-react';
import { useSiteContent } from '../../lib/SiteContentContext';

const ICONS = [FileText, Search, Handshake, Banknote];
const DEFAULTS = [
    { label: 'Remplissez le formulaire', description: 'Soumettez votre demande de financement en ligne en quelques minutes.' },
    { label: 'Analyse rapide', description: 'Un spécialiste en financement vous contacte rapidement pour évaluer votre dossier.' },
    { label: 'Entente de prêt', description: "Conclusion de l'entente de prêt avec des conditions ajustées à vos besoins." },
    { label: 'Recevez votre financement', description: 'Obtenez votre prêt relais en aussi peu que 48 heures.' },
];

export default function ProcessSteps() {
    const { c } = useSiteContent();
    const steps = ([1, 2, 3, 4] as const).map((n, i) => ({
        Icon: ICONS[i],
        label: c(`processus.${n}.titre`, DEFAULTS[i].label),
        description: c(`processus.${n}.desc`, DEFAULTS[i].description),
    }));

    return (
        <section className="py-12 md:py-20 bg-white">
            <div className="mx-auto max-w-7xl px-4">
                <div className="text-center mb-10 md:mb-14">
                    <h2 className="font-serif text-2xl md:text-4xl font-bold text-primary-700 mb-3 md:mb-4">
                        {c('processus.titre', 'Un processus simple et rapide')}
                    </h2>
                    <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
                        {c('processus.soustitre', 'Obtenez votre financement en 4 étapes faciles')}
                    </p>
                </div>

                {/* Desktop / Tablet : grille centrée */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="text-center group">
                            <div className="relative w-fit mx-auto mb-6">
                                <div className="w-20 h-20 bg-primary-50 group-hover:bg-accent-50 rounded-2xl flex items-center justify-center transition-colors">
                                    <step.Icon className="h-9 w-9 text-primary-600 group-hover:text-accent-500 transition-colors" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    {index + 1}
                                </div>
                            </div>
                            <h3 className="font-serif font-bold text-lg text-primary-700 mb-2">{step.label}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                        </div>
                    ))}
                </div>

                {/* Mobile : disposition horizontale compacte */}
                <div className="flex flex-col gap-6 md:hidden">
                    {steps.map((step, index) => (
                        <div key={index} className="flex items-start gap-4 group">
                            <div className="relative shrink-0">
                                <div className="w-14 h-14 bg-primary-50 group-hover:bg-accent-50 rounded-xl flex items-center justify-center transition-colors">
                                    <step.Icon className="h-7 w-7 text-primary-600 group-hover:text-accent-500 transition-colors" />
                                </div>
                                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-accent-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                    {index + 1}
                                </div>
                            </div>
                            <div className="pt-1">
                                <h3 className="font-serif font-bold text-base text-primary-700 mb-1">{step.label}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
