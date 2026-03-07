import { createI18n } from 'vue-i18n';
import en from '../locales/en';
import id from '../locales/id';

const i18n = createI18n({
    legacy: false, // Use Composition API mode
    locale: localStorage.getItem('language') || 'id', // Default to Indonesian or persisted value
    fallbackLocale: 'en',
    messages: {
        en,
        id
    }
});

export default i18n;
