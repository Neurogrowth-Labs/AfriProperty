import React from 'react';
import { CloseIcon } from './icons/NavIcons';
import { useTranslations } from '../contexts/LanguageContext';

interface CareersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyClick: (jobTitle: string) => void;
}

const JobOpening: React.FC<{ title: string, location: string, type: string, onApplyClick: (title: string) => void }> = ({ title, location, type, onApplyClick }) => (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <div>
            <h4 className="font-bold text-slate-800 dark:text-white">{title}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">{location} &middot; {type}</p>
        </div>
        <button 
            onClick={() => onApplyClick(title)}
            className="bg-brand-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-opacity-90 text-sm transition-colors"
        >
            Apply Now
        </button>
    </div>
);


const CareersModal: React.FC<CareersModalProps> = ({ isOpen, onClose, onApplyClick }) => {
  const { t } = useTranslations();
  if (!isOpen) return null;

  const jobs = [
    { title: t.careersModal.job1Title, location: 'Urbanville, SA', type: 'Full-time' },
    { title: t.careersModal.job2Title, location: 'Remote', type: 'Full-time' },
    { title: t.careersModal.job3Title, location: 'Cape Town, SA', type: 'Internship' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] p-4" onClick={onClose}>
      <div 
        className="bg-slate-50 dark:bg-brand-dark rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" 
        onClick={e => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-brand-dark dark:text-white">{t.careersModal.title}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t.careersModal.subtitle}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="p-6 md:p-8 space-y-6 overflow-y-auto">
            <p className="text-slate-600 dark:text-slate-300">{t.careersModal.intro}</p>
            <div className="space-y-4">
                {jobs.map(job => (
                    <JobOpening key={job.title} {...job} onApplyClick={onApplyClick} />
                ))}
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

export default CareersModal;