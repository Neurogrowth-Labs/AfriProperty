

import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Language } from '../types';
import { translations as englishTranslations } from '../translations';

const defaultTranslations = englishTranslations[Language.EN];

type TranslationsType = typeof defaultTranslations;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationsType;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: Language.EN,
  setLanguage: () => {},
  t: defaultTranslations,
  isTranslating: false,
});

// Helper to deep merge the AI translation with the English fallback to prevent crashes from incomplete translations.
const mergeTranslations = (base: any, incoming: any): any => {
    const merged = { ...base };

    for (const key in base) {
        if (Object.prototype.hasOwnProperty.call(base, key)) {
            const baseValue = base[key];
            const incomingValue = incoming[key];
            
            if (
                typeof baseValue === 'object' && baseValue !== null &&
                typeof incomingValue === 'object' && incomingValue !== null
            ) {
                merged[key] = mergeTranslations(baseValue, incomingValue);
            } else if (Object.prototype.hasOwnProperty.call(incoming, key) && typeof incomingValue === 'string') {
                 merged[key] = incomingValue;
            }
        }
    }
    return merged;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language');
    return (savedLang && Object.values(Language).includes(savedLang as Language)) 
      ? savedLang as Language 
      : Language.EN;
  });
  
  const [translationsCache, setTranslationsCache] = useState<Partial<Record<Language, TranslationsType>>>({
      [Language.EN]: defaultTranslations,
  });
  const [isTranslating, setIsTranslating] = useState(false);

  const setLanguage = async (lang: Language) => {
      if (lang === language || isTranslating) return;

      if (translationsCache[lang]) {
          setLanguageState(lang);
          return;
      }
      
      setIsTranslating(true);
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
          
          const languageMap: Record<string, string> = {
              [Language.FR]: 'French',
              [Language.PT]: 'Portuguese',
              [Language.ES]: 'Spanish',
              [Language.AR]: 'Arabic',
          };
          const targetLanguageName = languageMap[lang];

          if (!targetLanguageName) {
              setLanguageState(lang); // Should not happen with current setup
              return;
          }

          const prompt = `Translate the values in this JSON object from English to ${targetLanguageName}. Keep the JSON structure and keys exactly the same. Only translate the string values. For strings with placeholders like {{placeholder}}, keep the placeholder exactly as is in the translated string.

          ${JSON.stringify(defaultTranslations, null, 2)}
          `;
          
          const response = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: prompt,
              config: {
                  responseMimeType: 'application/json',
              }
          });
          
          const translatedJson = JSON.parse(response.text.trim());
          
          // Merge with English defaults to prevent crashes on incomplete AI response
          const completeTranslations = mergeTranslations(defaultTranslations, translatedJson);

          setTranslationsCache(prev => ({
              ...prev,
              [lang]: completeTranslations,
          }));
          setLanguageState(lang);

      } catch (error) {
          console.error(`Failed to translate to ${lang}:`, error);
          // Fallback to English if translation fails
          setLanguageState(Language.EN);
          alert(`Sorry, we couldn't switch to that language. Please try again later.`);
      } finally {
          setIsTranslating(false);
      }
  };

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === Language.AR ? 'rtl' : 'ltr';
  }, [language]);

  const t = useMemo(() => (translationsCache[language] || defaultTranslations), [language, translationsCache]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isTranslating }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslations = () => useContext(LanguageContext);