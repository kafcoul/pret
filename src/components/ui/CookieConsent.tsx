import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CONSENT_KEY = 'sff-cookie-consent';

export default function CookieConsent() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem(CONSENT_KEY);
        if (!consent) {
            // Show banner after a small delay to not block initial render
            const timer = setTimeout(() => setVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const accept = () => {
        localStorage.setItem(CONSENT_KEY, 'accepted');
        setVisible(false);
    };

    const decline = () => {
        localStorage.setItem(CONSENT_KEY, 'declined');
        setVisible(false);
    };

    const { t } = useTranslation();

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 pointer-events-none">
            <div className="mx-auto max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-200 p-5 sm:p-6 pointer-events-auto">
                <div className="flex items-start gap-4">
                    <div className="bg-primary-50 p-2 rounded-lg shrink-0 hidden sm:block">
                        <Shield className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                            <h3 className="font-semibold text-primary-700 text-sm">
                                {t('cookie.title')}
                            </h3>
                            <button
                                onClick={decline}
                                className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                                aria-label={t('cookie.close')}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                            {t('cookie.text')}{' '}
                            <Link to="/politique-confidentialite" className="underline hover:text-primary-700">{t('cookie.law')}</Link>{' '}
                            {t('cookie.law_suffix')}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-4">
                            <button
                                onClick={accept}
                                className="bg-primary-700 hover:bg-primary-600 text-white px-5 py-2 rounded-lg text-xs font-semibold transition-colors"
                            >
                                {t('cookie.accept')}
                            </button>
                            <button
                                onClick={decline}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded-lg text-xs font-semibold transition-colors"
                            >
                                {t('cookie.decline')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
