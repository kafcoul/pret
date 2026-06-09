import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from '../locales/fr.json';
import en from '../locales/en.json';

// Language is always set by useGeoLanguage (IP-based) or explicit user choice.
// No browser/localStorage auto-detection — useGeoLanguage owns the logic.
i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
    },
    lng: 'fr',
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'en'],
    interpolation: { escapeValue: false },
  });

export default i18n;
