import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useSiteContent } from '../../lib/SiteContentContext';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const location = useLocation();
    const { c, lang } = useSiteContent();
    const { t } = useTranslation();
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const services = [
        { label: t('nav.services_items.particuliers'), path: '/services/particuliers' },
        { label: t('nav.services_items.temporaire'), path: '/services/financement-temporaire' },
        { label: t('nav.services_items.consolidation'), path: '/services/consolidation-dettes' },
        { label: t('nav.services_items.credit'), path: '/services/deuxieme-chance-credit' },
        { label: t('nav.services_items.entreprises'), path: '/services/entreprises' },
        { label: t('nav.services_items.faillite'), path: '/services/eviter-faillite' },
    ];
    const navLinks = [
        { label: t('nav.home'), path: '/' },
        { label: t('nav.profile'), path: '/profil' },
        { label: t('nav.services'), path: '/services', dropdown: true },
        { label: t('nav.calculator'), path: '/calculateur' },
        { label: t('nav.faq'), path: '/faq' },
        { label: t('nav.application'), path: '/demande-en-ligne' },
        { label: t('nav.contact'), path: '/nous-joindre' },
    ];

    const isActive = (path: string) => location.pathname === path;
    const isServicesActive = location.pathname.startsWith('/services');

    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const handleMobileKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setMobileOpen(false);
            return;
        }

        if (e.key !== 'Tab') return;

        const panel = mobileMenuRef.current;
        if (!panel) return;

        const focusable = panel.querySelectorAll<HTMLElement>(
            'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }, []);

    useEffect(() => {
        if (mobileOpen) {
            const panel = mobileMenuRef.current;
            if (panel) {
                const closeBtn = panel.querySelector<HTMLElement>('button[aria-label="Fermer le menu"]');
                closeBtn?.focus();
            }
        }
    }, [mobileOpen]);

    useEffect(() => {
        setMobileOpen(false);
        setServicesOpen(false);
    }, [location.pathname]);

    return (
        <nav aria-label="Navigation principale" className="bg-white shadow-md sticky top-0 z-50">
            <div className="mx-auto max-w-7xl px-4">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="shrink-0">
                        <img src="/logo.svg" alt={c('coord.nom.entreprise')} className="h-10 w-auto" />
                    </Link>

                    <div className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) =>
                            link.dropdown ? (
                                <div
                                    key={link.path}
                                    className="relative"
                                    onMouseEnter={() => setServicesOpen(true)}
                                    onMouseLeave={() => setServicesOpen(false)}
                                    onFocus={() => setServicesOpen(true)}
                                    onBlur={(e) => {
                                        if (!e.currentTarget.contains(e.relatedTarget)) setServicesOpen(false);
                                    }}
                                >
                                    <button
                                        onClick={() => setServicesOpen(!servicesOpen)}
                                        aria-expanded={servicesOpen}
                                        aria-haspopup="true"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Escape') { setServicesOpen(false); e.currentTarget.focus(); }
                                        }}
                                        className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isServicesActive
                                            ? 'text-accent-500 bg-accent-50'
                                            : 'text-gray-700 hover:text-primary-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        {link.label}
                                        <ChevronDown className={`h-4 w-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {servicesOpen && (
                                        <div
                                            className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 mt-1"
                                            role="menu"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Escape') setServicesOpen(false);
                                            }}
                                        >
                                            {services.map((service) => (
                                                <Link
                                                    key={service.path}
                                                    to={service.path}
                                                    role="menuitem"
                                                    className={`block px-4 py-2.5 text-sm transition-colors ${isActive(service.path)
                                                        ? 'text-accent-500 bg-accent-50'
                                                        : 'text-gray-700 hover:bg-primary-50 hover:text-primary-700'
                                                        }`}
                                                >
                                                    {service.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(link.path)
                                        ? 'text-accent-500 bg-accent-50'
                                        : 'text-gray-700 hover:text-primary-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            )
                        )}
                        <Link
                            to="/demande-en-ligne"
                            className="ml-2 bg-accent-500 hover:bg-accent-600 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
                        >
                            {t('nav.cta')}
                        </Link>
                    </div>

                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label={mobileOpen ? (lang === 'fr' ? 'Fermer le menu' : 'Close menu') : (lang === 'fr' ? 'Ouvrir le menu' : 'Open menu')}
                    >
                        {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            <div
                className={`fixed inset-0 bg-black/30 z-40 lg:hidden transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setMobileOpen(false)}
            />

            <div
                ref={mobileMenuRef}
                role="dialog"
                aria-modal="true"
                aria-label="Menu de navigation"
                onKeyDown={handleMobileKeyDown}
                className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 lg:hidden shadow-2xl transition-transform duration-300 ease-out ${mobileOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <span className="font-serif font-bold text-primary-700">{t('nav.menu')}</span>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label={lang === 'fr' ? 'Fermer le menu' : 'Close menu'}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="px-4 py-3 space-y-1 overflow-y-auto h-[calc(100%-65px)]">
                    {navLinks.map((link) =>
                        link.dropdown ? (
                            <div key={link.path}>
                                <button
                                    onClick={() => setServicesOpen(!servicesOpen)}
                                    className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700"
                                >
                                    {link.label}
                                    <ChevronDown className={`h-4 w-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {servicesOpen && (
                                    <div className="ml-4 space-y-1">
                                        {services.map((service) => (
                                            <Link
                                                key={service.path}
                                                to={service.path}
                                                onClick={() => setMobileOpen(false)}
                                                className={`block px-3 py-2 rounded-lg text-sm ${isActive(service.path)
                                                    ? 'text-accent-500 bg-accent-50'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {service.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setMobileOpen(false)}
                                className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${isActive(link.path)
                                    ? 'text-accent-500 bg-accent-50'
                                    : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        )
                    )}
                    <Link
                        to="/demande-en-ligne"
                        onClick={() => setMobileOpen(false)}
                        className="block text-center bg-accent-500 hover:bg-accent-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold mt-3"
                    >
                        {t('nav.cta')}
                    </Link>
                </div>
            </div>
        </nav>
    );
}
