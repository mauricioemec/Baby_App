import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import pt from './locales/pt.json';
import en from './locales/en.json';
import es from './locales/es.json';

// Get language from localStorage or browser
const getInitialLanguage = () => {
  const stored = localStorage.getItem('babytrack_language');
  if (stored) return stored;

  const browserLang = navigator.language.split('-')[0];
  return ['pt', 'en', 'es'].includes(browserLang) ? browserLang : 'pt';
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      pt: { translation: pt },
      en: { translation: en },
      es: { translation: es }
    },
    lng: getInitialLanguage(),
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false // React already escapes values
    },
    react: {
      useSuspense: false
    }
  });

// Save language changes to localStorage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('babytrack_language', lng);
  document.documentElement.lang = lng;
});

export default i18n;
