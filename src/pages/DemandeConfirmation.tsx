import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Phone, Clock, FileText, Home, Send, Check } from 'lucide-react';
import { useSiteContent } from '../lib/SiteContentContext';
import { interpolateContent } from '../lib/siteContentDefaults';

export default function DemandeConfirmation() {
    const location = useLocation();
    const navigate = useNavigate();
    const { c } = useSiteContent();
    const prenom = (location.state as { prenom?: string } | null)?.prenom ?? '';
    const telephone = c('coord.telephone1');
    const fromForm = !!location.state;
    const delay = c('confirmation.delay');
    const documents = c('confirmation.documents.items').split('\n').filter(Boolean);
    const steps = [
        {
            icon: Phone,
            title: c('confirmation.step.1.title'),
            description: c('confirmation.step.1.desc'),
            color: 'bg-blue-50 text-blue-600',
        },
        {
            icon: FileText,
            title: c('confirmation.step.2.title'),
            description: c('confirmation.step.2.desc'),
            color: 'bg-amber-50 text-amber-600',
        },
        {
            icon: CheckCircle,
            title: c('confirmation.step.3.title'),
            description: c('confirmation.step.3.desc'),
            color: 'bg-green-50 text-green-600',
        },
    ];
    const subtitle = interpolateContent(c('confirmation.subtitle'), { delay });
    const [subtitleBefore, subtitleAfter] = subtitle.split(delay);

    return (
        <div className="min-h-screen bg-linear-to-b from-primary-50 to-white py-16 px-4">
            <div className="mx-auto max-w-2xl">
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center animate-[bounce_0.6s_ease-out]">
                            <CheckCircle className="h-12 w-12 text-green-500" />
                        </div>
                        <span className="absolute inset-0 rounded-full bg-green-200 animate-ping opacity-30" />
                    </div>
                </div>

                <div className="text-center mb-10">
                    <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary-800 mb-3">
                        {prenom ? interpolateContent(c('confirmation.title.with_name'), { prenom }) : c('confirmation.title.default')}
                    </h1>
                    <p className="text-gray-600 text-lg leading-relaxed max-w-lg mx-auto">
                        {subtitleBefore}
                        <strong className="text-primary-700">{delay}</strong>
                        {subtitleAfter}
                    </p>
                </div>

                <div className="bg-accent-50 border border-accent-200 rounded-2xl p-5 mb-8 text-center">
                    <p className="text-sm text-accent-700 font-medium mb-1">{c('confirmation.urgent.title')}</p>
                    <a
                        href={`tel:${telephone.replace(/\s/g, '')}`}
                        className="text-2xl font-bold text-accent-600 hover:text-accent-700 transition-colors"
                    >
                        {telephone}
                    </a>
                    <p className="text-xs text-gray-500 mt-1">{c('confirmation.urgent.hours')}</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                    <h2 className="font-serif text-lg font-bold text-primary-700 mb-5 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-accent-500" />
                        {c('confirmation.next.title')}
                    </h2>
                    <div className="space-y-5">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <div key={step.title} className="flex items-start gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${step.color}`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-primary-700 text-sm">{index + 1}. {step.title}</p>
                                        <p className="text-gray-500 text-sm mt-0.5">{step.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-blue-50 rounded-2xl p-6 mb-10">
                    <h2 className="font-semibold text-primary-700 mb-4 flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-blue-500" />
                        {c('confirmation.documents.title')}
                    </h2>
                    <ul className="space-y-2">
                        {documents.map((documentLabel) => (
                            <li key={documentLabel} className="flex items-start gap-2 text-sm text-gray-700">
                                <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                <span>{documentLabel}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
                    >
                        <Home className="h-4 w-4" />
                        {c('confirmation.actions.home')}
                    </Link>
                    <Link
                        to="/demande-en-ligne"
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-semibold transition-colors"
                        onClick={() => {
                            navigate('/demande-en-ligne', { replace: true });
                        }}
                    >
                        <Send className="h-4 w-4" />
                        {c('confirmation.actions.retry')}
                    </Link>
                </div>

                {!fromForm && (
                    <p className="text-center text-sm text-gray-400 mt-8">
                        {c('confirmation.actions.empty')}{' '}
                        <Link to="/demande-en-ligne" className="text-accent-500 hover:underline font-medium">
                            {c('confirmation.actions.empty_link')}
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
}
