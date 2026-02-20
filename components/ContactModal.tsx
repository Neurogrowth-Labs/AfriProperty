

import React from 'react';
import { CloseIcon, GlobeAltIcon } from './icons/NavIcons';
import { LocationPinIcon } from './icons/NavIcons';
import { EnvelopeIcon, PhoneIcon } from './icons/ActionIcons';
import { useTranslations } from '../contexts/LanguageContext';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactInfoItem: React.FC<{ icon: React.ElementType, title: string, children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
    <div className="flex items-start gap-4">
        <div className="bg-brand-light dark:bg-slate-700 p-3 rounded-full mt-1">
            <Icon className="w-6 h-6 text-brand-primary" />
        </div>
        <div>
            <h4 className="font-semibold text-slate-700 dark:text-slate-200">{title}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">{children}</p>
        </div>
    </div>
);


const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslations();
  if (!isOpen) return null;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you shortly.');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[120] p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-brand-dark rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale overflow-hidden" 
        onClick={e => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <h2 className="text-2xl font-bold text-brand-dark dark:text-white">{t.contactModal.title}</h2>
          <button onClick={onClose} className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="grid md:grid-cols-2 overflow-y-auto">
            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 space-y-6">
                <h3 className="text-xl font-bold text-brand-dark dark:text-white">{t.contactModal.infoTitle}</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">{t.contactModal.infoDesc}</p>
                <div className="space-y-5">
                    <ContactInfoItem icon={LocationPinIcon} title={t.contactModal.hq}>
                        123 Main Street, Urbanville, 10001, SA
                    </ContactInfoItem>
                     <ContactInfoItem icon={EnvelopeIcon} title={t.contactModal.inquiries}>
                        info@afriproperty.co.za
                    </ContactInfoItem>
                     <ContactInfoItem icon={PhoneIcon} title={t.contactModal.hotline}>
                        +27 21 456 7890
                    </ContactInfoItem>
                    <ContactInfoItem icon={GlobeAltIcon} title="Website">
                        <a href="https://www.afriproperty.co.za" target="_blank" rel="noopener noreferrer" className="hover:underline">www.afriproperty.co.za</a>
                    </ContactInfoItem>
                </div>
            </div>
            <div className="p-8 bg-white dark:bg-brand-dark">
                 <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-200">{t.contactModal.formName}</label>
                        <input type="text" id="name" required className="mt-1 w-full input" />
                    </div>
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-200">{t.contactModal.formEmail}</label>
                        <input type="email" id="email" required className="mt-1 w-full input" />
                    </div>
                     <div>
                        <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-200">{t.contactModal.formMessage}</label>
                        <textarea id="message" required rows={4} className="mt-1 w-full input resize-none"></textarea>
                    </div>
                    <div className="text-right">
                        <button type="submit" className="bg-brand-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300">
                            {t.contactModal.formSend}
                        </button>
                    </div>
                </form>
            </div>
        </div>

      </div>
       <style>{`
          .input {
                @apply px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-brand-primary focus:border-brand-primary;
            }
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

export default ContactModal;