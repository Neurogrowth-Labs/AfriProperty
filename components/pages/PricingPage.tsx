
import React from 'react';
import { CheckBadgeIcon } from '../icons/ActionIcons';

interface PricingPageProps {
  onPlanSelect: (role: 'user' | 'agent' | 'investor') => void;
}

const plans = [
    {
        role: 'user' as 'user' | 'agent' | 'investor',
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
        role: 'agent' as 'user' | 'agent' | 'investor',
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
        role: 'investor' as 'user' | 'agent' | 'investor',
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

const featureComparison = [
    { feature: 'Property Browsing & Saving', user: true, agent: true, investor: true },
    { feature: 'Personalized Matches', user: true, agent: false, investor: true },
    { feature: 'Property Alerts & Tour Scheduling', user: true, agent: false, investor: true },
    { feature: 'Unlimited Property Listings', user: false, agent: true, investor: false },
    { feature: 'Lead & Inquiry Management', user: false, agent: true, investor: false },
    { feature: 'AI Listing Tools', user: false, agent: true, investor: true },
    { feature: 'Agent Performance Analytics', user: false, agent: true, investor: false },
    { feature: 'Access Investment Marketplace', user: false, agent: false, investor: true },
    { feature: 'Advanced ROI Calculators', user: false, agent: false, investor: true },
    { feature: 'Global Market Analysis', user: false, agent: false, investor: true },
    { feature: 'Investor Community Access', user: false, agent: false, investor: true },
];

const faqs = [
    { q: 'Can I change my plan later?', a: 'Yes, you can upgrade your account at any time from your dashboard settings. Downgrading is also possible at the end of your billing cycle.' },
    { q: 'What counts as a "confirmed lead" for agents?', a: 'A confirmed lead is when a property seeker schedules a tour or initiates a direct message conversation with you through the platform for one of your listings.' },
    { q: 'Is there a trial for the Investor Pro plan?', a: 'We do not offer a free trial, but we have a 14-day money-back guarantee. If you\'re not satisfied with the Investor Pro tools, you can request a full refund within the first 14 days.' },
    { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, as well as bank transfers for annual subscriptions.' },
];

const FaqItem: React.FC<{ question: string, children: React.ReactNode }> = ({ question, children }) => {
    return (
        <div className="border-t border-slate-200 dark:border-slate-700 py-5">
            <h4 className="font-semibold text-slate-800 dark:text-white">{question}</h4>
            <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm">{children}</p>
        </div>
    );
};


const PricingPage: React.FC<PricingPageProps> = ({ onPlanSelect }) => {
  return (
    <div className="animate-fade-in bg-slate-50 dark:bg-slate-900">
      {/* Hero */}
      <header className="bg-white dark:bg-brand-dark py-16 text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark dark:text-white">Find the Perfect Plan</h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Whether you're searching for a home, selling properties, or investing, we have a plan designed for your success.
          </p>
        </div>
      </header>
      
      {/* Pricing Cards */}
      <section className="py-16">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
                {plans.map((plan) => (
                    <div key={plan.role} className={`border rounded-xl p-8 flex flex-col relative transform transition-transform hover:scale-105 ${plan.isRecommended ? 'border-brand-primary border-2 bg-brand-light dark:bg-slate-800/50' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                        {plan.isRecommended && (
                            <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>
                        )}
                        <h3 className="text-2xl font-bold text-brand-dark dark:text-white text-center">{plan.name}</h3>
                        <div className="text-center my-6">
                            <span className="text-5xl font-extrabold text-brand-dark dark:text-white">{plan.price}</span>
                            <p className="text-slate-500 dark:text-slate-400 text-sm h-10">{plan.priceDetail}</p>
                        </div>
                        <ul className="space-y-4 mb-8 flex-grow">
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex items-start">
                                    <CheckBadgeIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                                    <span className="text-slate-600 dark:text-slate-300">{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => onPlanSelect(plan.role)} className={`w-full py-3 rounded-lg font-semibold transition-colors ${plan.isRecommended ? 'bg-brand-primary text-white hover:bg-opacity-90 shadow-lg' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
                            {plan.cta}
                        </button>
                    </div>
                ))}
            </div>
        </div>
      </section>
      
      {/* App Mockups */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-brand-dark dark:text-white">Experience Your Dashboard</h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Each plan comes with a powerful, tailored dashboard to help you achieve your goals.</p>
            <div className="mt-10 grid md:grid-cols-3 gap-8 items-center">
                <div>
                    <img src="https://picsum.photos/seed/user-dash/600/400" alt="User Dashboard" className="rounded-lg shadow-xl" />
                    <h3 className="font-bold text-lg mt-4 text-brand-dark dark:text-white">Seeker Dashboard</h3>
                </div>
                 <div>
                    <img src="https://picsum.photos/seed/agent-dash/600/400" alt="Agent Dashboard" className="rounded-lg shadow-xl" />
                    <h3 className="font-bold text-lg mt-4 text-brand-dark dark:text-white">Agent Dashboard</h3>
                </div>
                 <div>
                    <img src="https://picsum.photos/seed/investor-dash/600/400" alt="Investor Dashboard" className="rounded-lg shadow-xl" />
                    <h3 className="font-bold text-lg mt-4 text-brand-dark dark:text-white">Investor Dashboard</h3>
                </div>
            </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16">
        <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-brand-dark dark:text-white mb-10">Feature Comparison</h2>
            <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden border border-slate-200 dark:border-slate-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left min-w-[600px]">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 w-2/5">Feature</th>
                                <th className="p-4 text-center font-semibold text-slate-600 dark:text-slate-300">Seeker (Free)</th>
                                <th className="p-4 text-center font-semibold text-slate-600 dark:text-slate-300">Agent</th>
                                <th className="p-4 text-center font-semibold text-slate-600 dark:text-slate-300">Investor Pro</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {featureComparison.map(({ feature, user, agent, investor }) => (
                                <tr key={feature}>
                                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{feature}</td>
                                    <td className="p-4 text-center">{user ? <CheckBadgeIcon className="w-6 h-6 text-green-500 mx-auto" /> : <span className="text-slate-400">-</span>}</td>
                                    <td className="p-4 text-center">{agent ? <CheckBadgeIcon className="w-6 h-6 text-green-500 mx-auto" /> : <span className="text-slate-400">-</span>}</td>
                                    <td className="p-4 text-center">{investor ? <CheckBadgeIcon className="w-6 h-6 text-green-500 mx-auto" /> : <span className="text-slate-400">-</span>}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-3xl font-bold text-center text-brand-dark dark:text-white mb-10">Frequently Asked Questions</h2>
            <div>
                {faqs.map(faq => <FaqItem key={faq.q} question={faq.q}>{faq.a}</FaqItem>)}
            </div>
        </div>
      </section>

      <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
          }
        `}</style>
    </div>
  );
};

export default PricingPage;
