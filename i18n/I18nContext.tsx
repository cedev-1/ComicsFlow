import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Language, Translations, translations, getBrowserLanguage } from './translations';

interface I18nContextType {
  language: Language;
  t: Translations;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('webtoon-editor-lang') as Language;
    return saved && (saved === 'fr' || saved === 'en') ? saved : getBrowserLanguage();
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('webtoon-editor-lang', lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    const newLang = language === 'fr' ? 'en' : 'fr';
    setLanguage(newLang);
  }, [language, setLanguage]);

  const value: I18nContextType = {
    language,
    t: translations[language],
    setLanguage,
    toggleLanguage,
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

// Composant de sélection de langue
export const LanguageSelector: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage } = useI18n();

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        onClick={() => setLanguage('fr')}
        className={`px-2 py-1 text-xs rounded transition-colors ${
          language === 'fr'
            ? 'bg-neutral-700 text-white'
            : 'text-neutral-500 hover:text-neutral-300'
        }`}
      >
        FR
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 text-xs rounded transition-colors ${
          language === 'en'
            ? 'bg-neutral-700 text-white'
            : 'text-neutral-500 hover:text-neutral-300'
        }`}
      >
        EN
      </button>
    </div>
  );
};
