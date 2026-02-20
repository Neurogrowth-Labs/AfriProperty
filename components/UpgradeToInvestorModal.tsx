
import React from 'react';
import { CloseIcon } from './icons/NavIcons';
import { RocketLaunchIcon } from './icons/AgentDashboardIcons';

interface UpgradeToInvestorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const UpgradeToInvestorModal: React.FC<UpgradeToInvestorModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[110] p-4" onClick={onClose}>
        <div 
            className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale text-center p-8" 
            onClick={e => e.stopPropagation()}
        >
            <div className="mx-auto bg-brand-light dark:bg-slate-700 p-4 rounded-full w-fit">
                <RocketLaunchIcon className="w-10 h-10 text-brand-primary" />
            </div>

            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mt-5">Unlock Investment Features</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
                This property is an exclusive investment opportunity. To view details, save, or make inquiries, please create a free Investor account.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button 
                    onClick={onClose}
                    className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-5 py-2.5 rounded-lg font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                >
                    Maybe Later
                </button>
                <button 
                    onClick={onConfirm}
                    className="flex-1 bg-brand-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                >
                    Sign Up as an Investor
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

export default UpgradeToInvestorModal;
