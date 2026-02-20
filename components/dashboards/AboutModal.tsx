
import React from 'react';
import { CloseIcon } from './icons/NavIcons';
import { RocketLaunchIcon } from './icons/AgentDashboardIcons';
import { EyeIcon, CpuChipIcon } from './icons/ActionIcons';
import { useTranslations } from '../contexts/LanguageContext';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoCard: React.FC<{ icon: React.ElementType, title: string, children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-4">
            <div className="bg-brand-light dark:bg-slate-700 p-3 rounded-full">
                <Icon className="w-6 h-6 text-brand-primary" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-3">{children}</p>
    </div>
);

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslations();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] p-4" onClick={onClose}>
      <div 
        className="bg-slate-50 dark:bg-brand-dark rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" 
        onClick={e => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-brand-dark dark:text-white">{t.aboutModal.title}</h2>
          <button onClick={onClose} className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="p-6 md:p-8 space-y-6">
            <div className="text-center">
                <h3 className="text-xl md:text-2xl font-bold text-brand-dark dark:text-white">{t.aboutModal.tagline}</h3>
            </div>
            
            <div className="space-y-4">
                <InfoCard icon={RocketLaunchIcon} title={t.aboutModal.missionTitle}>
                    {t.aboutModal.missionDesc}
                </InfoCard>
                <InfoCard icon={EyeIcon} title={t.aboutModal.visionTitle}>
                    {t.aboutModal.visionDesc}
                </InfoCard>
                 <InfoCard icon={CpuChipIcon} title={t.aboutModal.techTitle}>
                    {t.aboutModal.techDesc}
                </InfoCard>
            </div>
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

export default AboutModal;
