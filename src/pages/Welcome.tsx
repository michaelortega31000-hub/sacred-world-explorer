import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { LanguageSelector } from '@/components/LanguageSelector';
import { SacredEmblem } from '@/components/quest/SacredEmblem';

const Welcome = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (!savedLanguage) {
      const browserLang = navigator.language.split('-')[0];
      const supportedLangs = ['en', 'fr', 'es', 'it', 'de', 'pt', 'ar'];
      const detectedLang = supportedLangs.includes(browserLang) ? browserLang : 'fr';
      i18n.changeLanguage(detectedLang);
      localStorage.setItem('language', detectedLang);
    }
  }, [i18n]);

  return (
    <div className="cathedral-rose-bg min-h-screen flex flex-col relative">
      {/* Header — language only */}
      <header className="w-full p-4 flex justify-end items-center relative z-10">
        <LanguageSelector />
      </header>

      {/* Hero — emblem, single line, single CTA */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-16 relative z-10">
        <div className="w-full max-w-md text-center">
          {/* Vector emblem */}
          <div className="mb-10 flex justify-center animate-fade-in relative">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-amber-300/20 blur-3xl scale-110" />
              <SacredEmblem size={188} className="relative z-10" />
            </div>
          </div>

          {/* Single welcome line */}
          <h1 className="font-cinzel text-3xl md:text-4xl text-amber-50 leading-tight mb-12 animate-fade-in">
            Bienvenue, pèlerin
          </h1>

          {/* CTA */}
          <button
            onClick={() => navigate('/home')}
            className="hub-breath inline-flex items-center gap-2 px-10 py-4 text-lg font-semibold rounded-full
                       text-amber-950 bg-gradient-to-r from-amber-300 to-orange-400
                       shadow-[0_0_28px_rgba(244,197,66,0.55)] hover:scale-105 active:scale-95
                       transition-transform duration-200"
          >
            Commencer
            <ArrowRight className="ml-1 w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default Welcome;
