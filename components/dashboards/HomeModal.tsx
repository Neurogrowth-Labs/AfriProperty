

import React from 'react';
import { CloseIcon } from './icons/NavIcons';
import { CpuChipIcon, CubeTransparentIcon } from './icons/ActionIcons';
import { SearchIcon } from './icons/SearchIcons';
import { TownshipIcon } from './icons/CategoryIcons';
import { useTranslations } from '../contexts/LanguageContext';

interface HomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchClick: () => void;
}

const FeatureCard: React.FC<{ icon: React.ElementType, title: string, children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
    <div className="text-center">
        <div className="mx-auto bg-brand-light dark:bg-slate-700 p-4 rounded-full w-fit">
            <Icon className="w-8 h-8 text-brand-primary" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mt-4">{title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{children}</p>
    </div>
);

const HomeModal: React.FC<HomeModalProps> = ({ isOpen, onClose, onSearchClick }) => {
  const { t } = useTranslations();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] p-4" onClick={onClose}>
      <div 
        className="bg-slate-50 dark:bg-brand-dark rounded-xl shadow-2xl w-[95vw] sm:w-full max-w-2xl transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" 
        onClick={e => e.stopPropagation()}
      >
        <header className="flex justify-end p-3">
          <button onClick={onClose} className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="p-6 md:p-10 pt-0 text-center">
            <div className="mx-auto bg-brand-primary p-4 rounded-full w-fit mb-4">
                 <SearchIcon className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark dark:text-white">{t.homeModal.welcome}</h2>
            <p className="text-slate-600 dark:text-slate-300 mt-3 max-w-xl mx-auto">{t.homeModal.desc}</p>

            <div className="grid md:grid-cols-3 gap-8 my-10">
                <FeatureCard icon={CpuChipIcon} title={t.homeModal.aiTitle}>
                    {t.homeModal.aiDesc}
                </FeatureCard>
                <FeatureCard icon={TownshipIcon} title={t.homeModal.marketTitle}>
                    {t.homeModal.marketDesc}
                </FeatureCard>
                <FeatureCard icon={CubeTransparentIcon} title={t.homeModal.secureTitle}>
                    {t.homeModal.secureDesc}
                </FeatureCard>
            </div>
            
            <button 
                onClick={onSearchClick}
                className="bg-brand-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-brand-primary/40"
            >
                {t.homeModal.cta}
            </button>
        </div>

      </div>
       <style>{`
          @keyframes fadeInScale {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in-scale {
            animation: fadeInScale 0.3s ease-out forwards;
          }
        `}</style>
    </div>
  );
};

export default HomeModal;