import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Импортируем переводы напрямую
import ruTranslations from './locales/ru/common.json';
import kgTranslations from './locales/kg/common.json';
import enTranslations from './locales/en/common.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ru: {
        translation: {
          libraryTitle: 'Электронная Библиотека',
          searchPlaceholder: 'Поиск по книгам...',
          allCategories: 'Все категории',
          loading: 'Загрузка...'
        }
      },
      kg: {
        translation: {
          libraryTitle: 'Электрондук Китепкана',
          searchPlaceholder: 'Китептер боюнча издөө...',
          allCategories: 'Бардык категориялар',
          loading: 'Жүктөлүүдө...'
        }
      },
      en: {
        translation: {
          libraryTitle: 'Digital Library',
          searchPlaceholder: 'Search by books...',
          allCategories: 'All Categories',
          loading: 'Loading...'
        }
      }
    },
    lng: 'ru',
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false
    }
  });


i18n
  .use(initReactI18next)
  .init({
    resources: {
      ru: {
        translation: ruTranslations
      },
      kg: {
        translation: kgTranslations
      },
      en: {
        translation: enTranslations
      }
    },
    lng: 'ru', // язык по умолчанию
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false
    }
  });
export default i18n;