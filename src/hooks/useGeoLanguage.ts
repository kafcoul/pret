import { useEffect } from 'react';
import i18n from '../lib/i18n';

const LS_KEY = 'sff_language';

// Provinces where French is dominant → fr
const FRENCH_PROVINCES = new Set(['QC', 'NB']);

// Provinces where English is dominant → en
const ENGLISH_PROVINCES = new Set([
  'ON', 'BC', 'AB', 'MB', 'SK', 'NS', 'PE', 'NL', 'NT', 'NU', 'YT',
]);

interface IpApiResponse {
  region_code?: string;
  country_code?: string;
  error?: boolean;
}

function detectFromBrowser(): string | null {
  const langs = navigator.languages ?? [navigator.language];
  for (const lang of langs) {
    if (lang.toLowerCase().startsWith('fr')) return 'fr';
    if (lang.toLowerCase().startsWith('en')) return 'en';
  }
  return null;
}

async function detectFromIp(): Promise<string | null> {
  try {
    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return null;
    const data: IpApiResponse = await res.json();
    if (data.error || data.country_code !== 'CA') return null;

    const province = data.region_code ?? '';
    if (FRENCH_PROVINCES.has(province)) return 'fr';
    if (ENGLISH_PROVINCES.has(province)) return 'en';
    return null;
  } catch {
    return null;
  }
}

export function useGeoLanguage() {
  useEffect(() => {
    // If user already chose a language, respect it
    const saved = localStorage.getItem(LS_KEY);
    if (saved === 'fr' || saved === 'en') {
      i18n.changeLanguage(saved);
      return;
    }

    (async () => {
      // 1. Try browser language first (fast, no network)
      const fromBrowser = detectFromBrowser();
      if (fromBrowser) {
        i18n.changeLanguage(fromBrowser);
        // Still check geo in background to refine if browser lang is ambiguous
      }

      // 2. Geo detection (Canada only) to confirm or override
      const fromIp = await detectFromIp();
      if (fromIp) {
        i18n.changeLanguage(fromIp);
      } else {
        // IP outside Canada or geo unavailable → French by default
        i18n.changeLanguage('fr');
      }
    })();
  }, []);
}
