import React, { createContext, useContext, useState } from 'react';
import { translations } from './translations';

const LangContext = createContext();

export function LangProvider({ children }) {
  const [lang, setLang] = useState('en');
  const t = translations[lang];
  const toggleLang = () => setLang(prev => prev === 'en' ? 'am' : 'en');

  return (
    <LangContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
