
import React from 'react';
import SearchBar from './SearchBar';
import type { SearchFilters } from '../types';
import { useTranslations } from '../contexts/LanguageContext';

interface HeroProps {
    onSearch: (query: string) => void;
    isSearchingAI: boolean;
    filters: SearchFilters;
    onFilterChange: (key: keyof SearchFilters, value: any) => void;
    searchError?: string | null;
}

const Hero: React.FC<HeroProps> = (props) => {
  const { t } = useTranslations();

  return (
    <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center text-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 hover:scale-110"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1600585154340-be6199f3e009?q=80&w=2070&auto=format&fit=crop)' }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/90 via-brand-primary/40 to-brand-secondary/60"></div>
      
      {/* Decorative blobs for color pops */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-brand-accent/30 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-brand-gold/20 blur-3xl rounded-full animate-pulse delay-700"></div>

      <div className="relative z-10 text-white px-4 w-full max-w-5xl mx-auto">
        <h1 
          className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 tracking-tight animate-fade-in-up" 
          style={{ textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
        >
          {t.hero.title}
        </h1>
        <p 
          className="text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium opacity-90 animate-fade-in-up delay-100"
          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
        >
          {t.hero.subtitle}
        </p>
        <div className="animate-fade-in-up delay-200">
          <SearchBar {...props} />
        </div>
      </div>
      <style>{`
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-700 { animation-delay: 0.7s; }
      `}</style>
    </div>
  );
};

export default Hero;
