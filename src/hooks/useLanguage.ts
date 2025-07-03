
import { useState, useEffect } from 'react';
import { getTranslation, SupportedLanguage } from '@/utils/translations';

export const useLanguage = () => {
  const [language, setLanguage] = useState<SupportedLanguage>('pt-BR');

  useEffect(() => {
    // Carregar idioma salvo das configurações do usuário
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.appearance?.language) {
          setLanguage(settings.appearance.language);
          console.log('Idioma carregado:', settings.appearance.language);
        }
      } catch (error) {
        console.error('Erro ao carregar idioma das configurações:', error);
      }
    }
  }, []);

  const changeLanguage = (newLanguage: SupportedLanguage) => {
    setLanguage(newLanguage);
    console.log('Idioma alterado para:', newLanguage);
    
    // Force a re-render of components that use translations
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: newLanguage } 
    }));
  };

  const t = (key: string) => getTranslation(key, language);

  return { language, setLanguage: changeLanguage, t };
};
