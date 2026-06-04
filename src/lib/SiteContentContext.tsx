import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase } from './supabaseClient';
import { getSiteContentDefault } from './siteContentDefaults';
import i18n from './i18n';

// ── Types ──────────────────────────────────────────────────
interface SiteContentContextValue {
    /** Get a content value by key, with a fallback default */
    c: (key: string, fallback?: string) => string;
    /** Whether the content is still loading */
    loading: boolean;
    /** Force reload all content */
    reload: () => Promise<void>;
    /** Raw content map (for admin) */
    contentMap: Map<string, string>;
    /** Current language code */
    lang: string;
    /** Change language manually */
    setLang: (lang: string) => void;
}

const SiteContentContext = createContext<SiteContentContextValue>({
    c: (key, fallback) => getSiteContentDefault(key, fallback ?? ''),
    loading: true,
    reload: async () => { },
    contentMap: new Map(),
    lang: 'fr',
    setLang: () => { },
});

// ── Cache config ───────────────────────────────────────────
const CACHE_KEY = 'sff_site_content';
const CACHE_TS_KEY = 'sff_site_content_ts';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function readCache(): Map<string, string> | null {
    try {
        const ts = localStorage.getItem(CACHE_TS_KEY);
        if (!ts || Date.now() - Number(ts) > CACHE_TTL_MS) return null;

        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;

        const entries: [string, string][] = JSON.parse(raw);
        return new Map(entries);
    } catch {
        return null;
    }
}

function writeCache(map: Map<string, string>) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify([...map.entries()]));
        localStorage.setItem(CACHE_TS_KEY, String(Date.now()));
    } catch {
        // Storage full or unavailable — ignore
    }
}

// ── Provider ───────────────────────────────────────────────
export function SiteContentProvider({ children }: { children: ReactNode }) {
    const [contentMap, setContentMap] = useState<Map<string, string>>(() => readCache() ?? new Map());
    const [loading, setLoading] = useState(true);
    const [lang, setLangState] = useState<string>(i18n.language || 'fr');

    const setLang = useCallback((newLang: string) => {
        i18n.changeLanguage(newLang);
        localStorage.setItem('sff_language', newLang);
        setLangState(newLang);
        document.documentElement.lang = newLang === 'fr' ? 'fr-CA' : 'en-CA';
    }, []);

    useEffect(() => {
        const handler = (lng: string) => {
            setLangState(lng.startsWith('fr') ? 'fr' : 'en');
            document.documentElement.lang = lng.startsWith('fr') ? 'fr-CA' : 'en-CA';
        };
        i18n.on('languageChanged', handler);
        return () => { i18n.off('languageChanged', handler); };
    }, []);

    const load = useCallback(async (bypassCache = false) => {
        try {
            // Serve from cache on initial load if valid
            if (!bypassCache) {
                const cached = readCache();
                if (cached && cached.size > 0) {
                    setContentMap(cached);
                    setLoading(false);
                    return;
                }
            }

            const { data, error } = await supabase
                .from('site_content')
                .select('cle, valeur')
                .order('section')
                .order('ordre');

            if (error) {
                console.error('SiteContent load error:', error);
                return;
            }

            const map = new Map<string, string>();
            data?.forEach((row) => map.set(row.cle, row.valeur));
            setContentMap(map);
            writeCache(map);
        } catch (err) {
            console.error('SiteContent fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    /** Force reload bypasses cache */
    const reload = useCallback(async () => {
        await load(true);
    }, [load]);

    const c = useCallback(
        (key: string, fallback?: string): string => {
            if (lang === 'en') {
                const enKey = `${key}.en`;
                const enValue = contentMap.get(enKey) ?? getSiteContentDefault(enKey, '');
                if (enValue) return enValue;
            }
            return contentMap.get(key) ?? getSiteContentDefault(key, fallback ?? '');
        },
        [contentMap, lang]
    );

    return (
        <SiteContentContext.Provider value={{ c, loading, reload, contentMap, lang, setLang }}>
            {children}
        </SiteContentContext.Provider>
    );
}

// ── Hook ───────────────────────────────────────────────────
// eslint-disable-next-line react-refresh/only-export-components
export function useSiteContent() {
    return useContext(SiteContentContext);
}
