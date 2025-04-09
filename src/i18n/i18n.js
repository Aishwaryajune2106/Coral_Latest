import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from '../Translation/locales/en.json';
import hi from '../Translation/locales/hi.json';
import ar from '../Translation/locales/ar.json';

const LANGUAGES = {
  en: { translation: en },
  hi: { translation: hi },
  ar: { translation: ar },
};

const initI18n = async () => {
  const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
  const defaultLanguage = savedLanguage || 'en'; // Fallback to English

  i18next
    .use(initReactI18next)
    .init({
      compatibilityJSON: 'v3',
      resources: LANGUAGES,
      lng: defaultLanguage,
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
    });
};

initI18n(); // Initialize i18n with the stored language

export default i18next;
