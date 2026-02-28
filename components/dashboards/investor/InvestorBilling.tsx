
import React from 'react';
import { CheckBadgeIcon, CpuChipIcon } from '../../icons/ActionIcons';
import { User } from '../../../types';

interface InvestorBillingProps {
    user: User;
}

const plans = [
    {
        name: 'Freemium',
        price: 'Free',
        priceDetail: 'Basic features',
        features: ['Browse Properties', 'Save Favorites', 'Standard Support'],
        cta: 'Current Plan',
        isCurrent: false,
    },
    {
        name: 'Investor Pro',
        price: 'R1490',
        priceDetail: '/ month',
        features: ['Exclusive Marketplace', 'AI Portfolio Analysis', 'Advanced ROI Tools', 'Global Market Analysis'],
        cta: 'Upgrade Plan',
        isCurrent: true,
    }
];

const InvestorBilling: React.FC<InvestorBillingProps> = ({ user }) => {
  const currentPlanName = user.planId ? (user.planId.charAt(0).toUpperCase() + user.planId.slice(1)) : 'Investor Pro';
  const currentPlanPrice = user.planPrice !== undefined ? `R${user.planPrice}` : 'R1490';

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Subscription & Billing</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your investment plan and view your billing history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-lg text-slate-800 dark:text-white">Current Plan</h3>
            <p className="text-4xl font-bold text-brand-primary mt-2">{currentPlanName}</p>
            <p className="text-xl font-semibold text-slate-700 dark:text-slate-300">{currentPlanPrice}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Duration: {user.planDuration || '1 month'}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-lg text-slate-800 dark:text-white">Next Billing Date</h3>
            <p className="text-4xl font-bold text-brand-primary mt-2">Dec 24, 2023</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Your plan will automatically renew.</p>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Plan Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch max-w-4xl">
            {plans.map((plan, index) => {
                const isCurrent = (user.planId === 'investor' && plan.name === 'Investor Pro') || (!user.planId && plan.name === 'Investor Pro');
                return (
                    <div key={index} className={`border rounded-lg p-6 flex flex-col ${isCurrent ? 'border-brand-primary border-2 bg-brand-light dark:bg-slate-800/50' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
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
                        <button disabled={isCurrent} className={`w-full py-3 rounded-lg font-semibold transition-colors ${isCurrent ? 'bg-slate-200 text-slate-500 cursor-not-allowed dark:bg-slate-700 dark:text-slate-400' : 'bg-brand-primary text-white hover:bg-opacity-90'}`}>
                            {isCurrent ? 'Your Current Plan' : plan.cta}
                        </button>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default InvestorBilling;
