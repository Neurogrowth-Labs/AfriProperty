import React from 'react';
import { CloseIcon } from './icons/NavIcons';
import { useTranslations } from '../contexts/LanguageContext';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{title}</h4>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{children}</p>
    </div>
);

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslations();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] p-4" onClick={onClose}>
      <div 
        className="bg-slate-50 dark:bg-brand-dark rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" 
        onClick={e => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-brand-dark dark:text-white">{t.privacyPolicyModal.title}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t.privacyPolicyModal.lastUpdated}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="p-6 md:p-8 space-y-6 overflow-y-auto">
            <Section title={t.privacyPolicyModal.section1Title}>
                {t.privacyPolicyModal.section1Content}
            </Section>
            <Section title={t.privacyPolicyModal.section2Title}>
                {t.privacyPolicyModal.section2Content}
            </Section>
            <Section title={t.privacyPolicyModal.section3Title}>
                {t.privacyPolicyModal.section3Content}
            </Section>
            <Section title={t.privacyPolicyModal.section4Title}>
                {t.privacyPolicyModal.section4Content}
            </Section>
             <Section title={t.privacyPolicyModal.section5Title}>
                {t.privacyPolicyModal.section5Content}
            </Section>
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

export default PrivacyPolicyModal;