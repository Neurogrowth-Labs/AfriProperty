import React from 'react';
import { CloseIcon } from './icons/NavIcons';
import { CheckBadgeIcon, CpuChipIcon } from './icons/ActionIcons';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanSelect: (role: 'user' | 'agent' | 'investor') => void;
}

const plans = [
    {
        role: 'user',
        name: 'Freemium',
        price: 'Free',
        priceDetail: 'For Property Seekers',
        features: [
            'Save & Compare Properties',
            'Schedule Property Tours',
            'Get Personalized Matches',
            'Create Property Alerts',
            'Secure Document Vault',
        ],
        cta: 'Sign Up for Free',
        isRecommended: false,
    },
    {
        role: 'agent',
        name: 'Pay-per-Lead',
        price: 'R250',
        priceDetail: '/ confirmed lead',
        features: [
            'Unlimited Property Listings',
            'Lead & Inquiry Management',
            'AI Description Writer',
            'Performance Analytics',
            'Calendar & Scheduling',
        ],
        cta: 'Become an Agent',
        isRecommended: true,
    },
    {
        role: 'investor',
        name: 'Investor Pro',
        price: 'R1490',
        priceDetail: '/ month',
        features: [
            'Exclusive Investment Marketplace',
            'AI Portfolio Analysis',
            'Advanced Financial & ROI Tools',
            'Global Market Analysis',
            'Community & Networking',
        ],
        cta: 'Become an Investor',
        isRecommended: false,
    },
];

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onPlanSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-4xl transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" 
        onClick={e => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-brand-dark dark:text-white">Choose Your Role on AfriProperty</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Select a plan that best fits your needs to get started.</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan, index) => (
                <div key={index} className={`border rounded-lg p-6 flex flex-col relative ${plan.isRecommended ? 'border-brand-primary border-2 bg-brand-light dark:bg-slate-800/50' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                    {plan.isRecommended && (
                        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>
                    )}
                    <h3 className="text-xl font-bold text-brand-dark dark:text-white text-center">{plan.name}</h3>
                    <div className="text-center my-6">
                        <span className="text-4xl font-extrabold text-brand-dark dark:text-white">{plan.price}</span>
                        <p className="text-slate-500 dark:text-slate-400 text-sm h-10">{plan.priceDetail}</p>
                    </div>
                    <ul className="space-y-3 mb-8 flex-grow">
                        {plan.features.map((feature, fIndex) => (
                            <li key={fIndex} className="flex items-start">
                                {feature.includes('AI') ? 
                                    <CpuChipIcon className="w-5 h-5 text-brand-primary mr-2 flex-shrink-0 mt-0.5" /> : 
                                    <CheckBadgeIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                }
                                <span className="text-slate-600 dark:text-slate-300 text-sm">{feature}</span>
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => onPlanSelect(plan.role as 'user' | 'agent' | 'investor')} className={`w-full py-3 rounded-lg font-semibold transition-colors ${plan.isRecommended ? 'bg-brand-primary text-white hover:bg-opacity-90 shadow-lg' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
                        {plan.cta}
                    </button>
                </div>
            ))}
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

export default PricingModal;