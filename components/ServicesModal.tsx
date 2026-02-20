

import React from 'react';
import { CloseIcon } from './icons/NavIcons';
import { BanknotesIcon, ShieldCheckIcon, TruckIcon, HomeIcon as HomeServiceIcon } from './icons/ActionIcons';
import { useTranslations } from '../contexts/LanguageContext';

interface ServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onServiceClick: (service: string) => void;
}

const ServiceCard: React.FC<{ icon: React.ElementType, title: string, description: string, cta: string, onClick: () => void }> = ({ icon: Icon, title, description, cta, onClick }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col">
        <div className="bg-brand-light dark:bg-slate-700 p-3 rounded-full w-fit">
            <Icon className="w-7 h-7 text-brand-primary" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mt-4">{title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 flex-grow">{description}</p>
        <button 
            onClick={onClick}
            className="mt-5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-2.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm w-full"
        >
            {cta}
        </button>
    </div>
);

const ServicesModal: React.FC<ServicesModalProps> = ({ isOpen, onClose, onServiceClick }) => {
  const { t } = useTranslations();
  if (!isOpen) return null;

  const services = [
    {
        title: t.servicesModal.loanTitle,
        description: t.servicesModal.loanDesc,
        icon: BanknotesIcon,
        cta: t.servicesModal.loanCta,
        serviceKey: 'Financial Services'
    },
    {
        title: t.servicesModal.rentalTitle,
        description: t.servicesModal.rentalDesc,
        icon: HomeServiceIcon,
        cta: t.servicesModal.rentalCta,
        serviceKey: 'Property Management'
    },
    {
        title: t.servicesModal.insuranceTitle,
        description: t.servicesModal.insuranceDesc,
        icon: ShieldCheckIcon,
        cta: t.servicesModal.insuranceCta,
        serviceKey: 'Insurance'
    },
    {
        title: t.servicesModal.movingTitle,
        description: t.servicesModal.movingDesc,
        icon: TruckIcon,
        cta: t.servicesModal.movingCta,
        serviceKey: 'Moving Services'
    }
];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] p-4" onClick={onClose}>
      <div 
        className="bg-slate-50 dark:bg-brand-dark rounded-xl shadow-2xl w-full max-w-3xl transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" 
        onClick={e => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-brand-dark dark:text-white">{t.servicesModal.title}</h2>
          <button onClick={onClose} className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="p-6 md:p-8">
             <div className="text-center mb-8">
                <h3 className="text-xl md:text-2xl font-bold text-brand-dark dark:text-white">{t.servicesModal.tagline}</h3>
                <p className="text-slate-600 dark:text-slate-300 mt-2 max-w-2xl mx-auto text-sm">{t.servicesModal.desc}</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {services.map(service => <ServiceCard key={service.title} title={service.title} description={service.description} icon={service.icon} cta={service.cta} onClick={() => onServiceClick(service.serviceKey)} />)}
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

export default ServicesModal;