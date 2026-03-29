import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { es, en } from '../i18n/translations';

export type Language = 'es' | 'en';
type Translations = typeof es;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Translations> = { es, en };

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('language');
    if (stored === 'en' || stored === 'es') return stored;
    // Detect browser language
    const browserLang = navigator.language.slice(0, 2);
    return browserLang === 'es' ? 'es' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const t = useMemo(() => translations[language], [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
