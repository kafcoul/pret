import { useEffect } from 'react';
import i18n from '../lib/i18n';

// Key used ONLY when the user explicitly clicks the language switcher
export const USER_LANG_KEY = 'sff_user_lang';

// QC and NB → French; all other Canadian provinces/territories → English
const FRENCH_PROVINCES = new Set(['QC', 'NB']);

interface IpApiResponse {
  region_code?: string;
  country_code?: string;
  error?: boolean;
}

async function detectFromIp(): Promise<string> {
  try {
    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return 'fr';
    const data: IpApiResponse = await res.json();
    if (data.error) return 'fr';

    if (data.country_code !== 'CA') {
      // Outside Canada: use browser language preference
      const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
      for (const l of langs) {
        if (l.toLowerCase().startsWith('fr')) return 'fr';
        if (l.toLowerCase().startsWith('en')) return 'en';
      }
      return 'fr';
    }

    // Canadian IP: province decides the language
    const province = data.region_code ?? '';
    return FRENCH_PROVINCES.has(province) ? 'fr' : 'en';
  } catch {
    return 'fr';
  }
}

export function useGeoLanguage() {
  useEffect(() => {
    // Only skip geo if the user explicitly changed the language themselves
    const userChoice = localStorage.getItem(USER_LANG_KEY);
    if (userChoice === 'fr' || userChoice === 'en') {
      i18n.changeLanguage(userChoice);
      return;
    }

    // Always detect by IP — no caching between sessions
    detectFromIp().then((lang) => i18n.changeLanguage(lang));
  }, []);
}
