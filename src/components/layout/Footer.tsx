import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useToast } from '../ui/Toast';
import { useSiteContent } from '../../lib/SiteContentContext';
import { useTranslation } from 'react-i18next';

function NewsletterSection() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const { toast } = useToast();
    const { t } = useTranslation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setStatus('loading');
        try {
            const { data, error } = await supabase.functions.invoke('subscribe-newsletter', {
                body: { courriel: email },
            });
            if (error) throw error;
            setStatus('success');
            setMessage(data?.message || t('footer.newsletter.success'));
            toast(t('footer.newsletter.toast'), 'success');
            setEmail('');
        } catch {
            setStatus('error');
            setMessage(t('footer.newsletter.error'));
        }
    };

    return (
        <div className="border-t border-primary-700 mt-4 md:mt-8">
            <div className="mx-auto max-w-7xl px-4 py-5 md:py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="font-serif font-bold text-lg text-white">{t('footer.newsletter.title')}</h3>
                        <p className="text-primary-200 text-sm mt-1">{t('footer.newsletter.subtitle')}</p>
                    </div>
                    {status === 'success' ? (
                        <div className="flex items-center gap-2 text-green-300 text-sm font-medium">
                            <CheckCircle className="h-5 w-5" />
                            {message}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex w-full md:w-auto gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
                                placeholder={t('footer.newsletter.placeholder')}
                                required
                                className="flex-1 md:w-64 px-4 py-2.5 rounded-lg bg-primary-700 border border-primary-500 text-white placeholder:text-primary-300 text-sm focus:outline-none focus:border-accent-400 transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="bg-accent-500 hover:bg-accent-400 disabled:opacity-60 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
                            >
                                {status === 'loading' ? '...' : t('footer.newsletter.subscribe')}
                            </button>
                        </form>
                    )}
                    {status === 'error' && (
                        <p className="text-red-300 text-xs">{message}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function Footer() {
    const { c } = useSiteContent();
    const { t } = useTranslation();

    return (
        <footer className="bg-primary-800 text-white">
            <div className="mx-auto max-w-7xl px-4 py-8 md:py-16">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                    {/* Brand */}
                    <div className="col-span-2 lg:col-span-1">
                        <div className="mb-3">
                            <img src="/logo.svg" alt={c('coord.nom.entreprise', 'Solutions Financement Fortier')} className="h-9 w-auto" />
                        </div>
                        <p className="text-primary-200 text-sm leading-relaxed hidden md:block">
                            {c('footer.description', 'Prêteur alternatif canadien depuis 1998. Prêts rapides avec garanties immobilières, approuvés en 48 heures.')}
                        </p>

                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="font-serif font-bold text-base md:text-lg mb-2 md:mb-4 text-accent-400">{t('footer.services_title')}</h3>
                        <ul className="space-y-1.5 md:space-y-2.5 text-sm">
                            <li><Link to="/services/particuliers" className="text-primary-200 hover:text-white transition-colors">{t('footer.services_list.particuliers')}</Link></li>
                            <li><Link to="/services/entreprises" className="text-primary-200 hover:text-white transition-colors">{t('footer.services_list.entreprises')}</Link></li>
                            <li><Link to="/services/financement-temporaire" className="text-primary-200 hover:text-white transition-colors">{t('footer.services_list.temporaire')}</Link></li>
                            <li><Link to="/services/consolidation-dettes" className="text-primary-200 hover:text-white transition-colors">{t('footer.services_list.consolidation')}</Link></li>
                            <li><Link to="/services/deuxieme-chance-credit" className="text-primary-200 hover:text-white transition-colors">{t('footer.services_list.credit')}</Link></li>
                            <li><Link to="/services/eviter-faillite" className="text-primary-200 hover:text-white transition-colors">{t('footer.services_list.faillite')}</Link></li>
                        </ul>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h3 className="font-serif font-bold text-base md:text-lg mb-2 md:mb-4 text-accent-400">{t('footer.links_title')}</h3>
                        <ul className="space-y-1.5 md:space-y-2.5 text-sm">
                            <li><Link to="/" className="text-primary-200 hover:text-white transition-colors">{t('footer.links_list.home')}</Link></li>
                            <li><Link to="/profil" className="text-primary-200 hover:text-white transition-colors">{t('footer.links_list.profile')}</Link></li>
                            <li><Link to="/demande-en-ligne" className="text-primary-200 hover:text-white transition-colors">{t('footer.links_list.application')}</Link></li>
                            <li><Link to="/nous-joindre" className="text-primary-200 hover:text-white transition-colors">{t('footer.links_list.contact')}</Link></li>
                            <li><Link to="/calculateur" className="text-primary-200 hover:text-white transition-colors">{t('footer.links_list.calculator')}</Link></li>
                            <li><Link to="/faq" className="text-primary-200 hover:text-white transition-colors">{t('footer.links_list.faq')}</Link></li>
                            <li><Link to="/preteur-alternatif" className="text-primary-200 hover:text-white transition-colors">{t('footer.links_list.regions')}</Link></li>
                            <li><Link to="/mentions-legales" className="text-primary-200 hover:text-white transition-colors">{t('footer.links_list.legal')}</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="col-span-2 lg:col-span-1">
                        <h3 className="font-serif font-bold text-base md:text-lg mb-2 md:mb-4 text-accent-400">{t('footer.contact_title')}</h3>
                        <ul className="flex flex-wrap gap-x-6 gap-y-2 md:flex-col md:space-y-3 text-sm">
                            <li className="flex items-start gap-2.5">
                                <MapPin className="h-4 w-4 mt-0.5 text-accent-400 shrink-0" />
                                <span className="text-primary-200">
                                    {c('coord.adresse.ligne1', '490, rue de Kilkenny')}<br />
                                    {c('coord.adresse.ligne2', 'Fossambault-sur-le-Lac, QC G3N 3C4')}
                                </span>
                            </li>
                            <li>
                                <a href={`tel:${c('coord.telephone1', '450 914-5709').replace(/\s/g, '')}`} className="flex items-center gap-2.5 text-primary-200 hover:text-white transition-colors">
                                    <Phone className="h-4 w-4 text-accent-400" />
                                    {c('coord.telephone1', '450 914-5709')}
                                </a>
                            </li>
                            <li>
                                <a href={`mailto:${c('coord.courriel', 'info@solutionsfortier.com')}`} className="flex items-center gap-2.5 text-primary-200 hover:text-white transition-colors">
                                    <Mail className="h-4 w-4 text-accent-400" />
                                    {c('coord.courriel', 'info@solutionsfortier.com')}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Newsletter */}
            <NewsletterSection />

            {/* Régions desservies — internal linking */}
            <div className="border-t border-primary-700">
                <div className="mx-auto max-w-7xl px-4 py-5 md:py-8">
                    <h3 className="font-serif font-bold text-base text-accent-400 mb-3">{t('footer.regions_title')}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-primary-300">
                        {[
                            { to: '/preteur-alternatif/quebec', label: 'Québec' },
                            { to: '/preteur-alternatif/montreal', label: 'Montréal' },
                            { to: '/preteur-alternatif/laval', label: 'Laval' },
                            { to: '/preteur-alternatif/gatineau', label: 'Gatineau' },
                            { to: '/preteur-alternatif/longueuil', label: 'Longueuil' },
                            { to: '/preteur-alternatif/sherbrooke', label: 'Sherbrooke' },
                            { to: '/preteur-alternatif/levis', label: 'Lévis' },
                            { to: '/preteur-alternatif/trois-rivieres', label: 'Trois-Rivières' },
                            { to: '/preteur-alternatif/saguenay', label: 'Saguenay' },
                            { to: '/preteur-alternatif/terrebonne', label: 'Terrebonne' },
                            { to: '/preteur-alternatif/drummondville', label: 'Drummondville' },
                            { to: '/preteur-alternatif/saint-jerome', label: 'Saint-Jérôme' },
                            { to: '/preteur-alternatif/granby', label: 'Granby' },
                            { to: '/preteur-alternatif/rimouski', label: 'Rimouski' },
                        ].map(({ to, label }) => (
                            <Link key={to} to={to} className="hover:text-white transition-colors">{label}</Link>
                        ))}
                        <Link to="/preteur-alternatif" className="text-accent-400 hover:text-accent-300 transition-colors font-semibold">{t('footer.all_cities')}</Link>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-primary-600">
                <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-primary-300">
                    <span>&copy; {new Date().getFullYear()} {c('coord.nom.entreprise', 'Solutions Financement Fortier')} Inc. {t('footer.copyright')}</span>
                    <div className="flex items-center gap-4">
                        <Link to="/politique-confidentialite" className="hover:text-white transition-colors">{t('footer.privacy')}</Link>
                        <Link to="/mentions-legales" className="hover:text-white transition-colors">{t('footer.legal')}</Link>
                        <span>{c('coord.slogan', 'Prêteur alternatif canadien depuis 1998')}</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
