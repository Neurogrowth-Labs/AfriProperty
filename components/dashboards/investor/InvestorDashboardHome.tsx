
import React, { useMemo, useState, useEffect } from 'react';
import type { Property, User, InvestorSettings, Achievement, Currency } from '../../../types';
import { ListingType } from '../../../types';
import PortfolioMap from './PortfolioMap';
import { useCurrency } from '../../../contexts/CurrencyContext';
import AIPortfolioSummary from './AIPortfolioSummary';
import InvestorGamification from './InvestorGamification';
import DashboardHomeSkeleton from './DashboardHomeSkeleton';


interface InvestorDashboardHomeProps {
  user: User;
  allProperties: Property[];
  savedProperties: Property[];
  propertiesToCompare: Property[];
  investorSettings: InvestorSettings | null;
  currency: Currency;
  investorAchievements: Achievement[];
  onCompareClick: () => void;
  onClose: () => void;
  onUpdateInvestorAchievements: (achievements: Achievement[]) => void;
}

const StatCard: React.FC<{ title: string; value: string; subValue?: string; }> = ({ title, value, subValue }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-4xl font-bold text-slate-800 dark:text-white mt-2">{value}</p>
        {subValue && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subValue}</p>}
    </div>
);

const InvestorDashboardHome: React.FC<InvestorDashboardHomeProps> = (props) => {
    const { user, allProperties, savedProperties, propertiesToCompare, onCompareClick, onClose, investorSettings, currency } = props;
    const [isLoading, setIsLoading] = useState(true);
    const { formatCurrency } = useCurrency();

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500); // Simulate loading time
        return () => clearTimeout(timer);
    }, []);
    
    const userProperties = useMemo(() => {
        return allProperties.filter(p => p.agent.name === 'Peter Van der Merwe'); // Demo: Peter is investor
    }, [allProperties, user.username]);

    const portfolioAnalytics = useMemo(() => {
        const totalInvestment = userProperties.reduce((sum, p) => sum + (p.purchasePrice || p.price), 0);
        const currentValue = userProperties.reduce((sum, p) => sum + p.price, 0);
        const appreciation = totalInvestment > 0 ? ((currentValue - totalInvestment) / totalInvestment) * 100 : 0;
        const monthlyIncome = userProperties.filter(p => p.listingType === ListingType.RENT).reduce((sum, p) => sum + p.price, 0);

        return { totalInvestment, currentValue, appreciation, monthlyIncome };
    }, [userProperties]);

    const handleFindInvestments = () => {
        onClose();
        setTimeout(() => {
            document.getElementById('all-listings')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const isWidgetVisible = (id: string) => {
        return investorSettings?.widgets.find(w => w.id === id)?.isVisible ?? true;
    };

    if (isLoading) {
        return <DashboardHomeSkeleton />;
    }

    return (
        <div className="p-4 md:p-8 space-y-8 overflow-y-auto">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Portfolio Snapshot</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">An overview of your real estate assets and performance.</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={handleFindInvestments} className="quick-action-btn">
                        Find New Investments
                    </button>
                     <button 
                        onClick={onCompareClick} 
                        disabled={propertiesToCompare.length < 2} 
                        className="quick-action-btn disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:cursor-not-allowed disabled:text-slate-400"
                    >
                        Compare ({propertiesToCompare.length})
                    </button>
                    <button onClick={() => alert("Exporting report...")} className="quick-action-btn">
                        Export Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {isWidgetVisible('total_investment') && <StatCard 
                    title="Total Investment" 
                    value={formatCurrency(portfolioAnalytics.totalInvestment, { notation: 'compact' })} 
                />}
                {isWidgetVisible('portfolio_value') && <StatCard 
                    title="Current Portfolio Value" 
                    value={formatCurrency(portfolioAnalytics.currentValue, { notation: 'compact' })} 
                />}
                 {isWidgetVisible('asset_appreciation') && <StatCard 
                    title="Asset Appreciation" 
                    value={`${portfolioAnalytics.appreciation.toFixed(1)}%`}
                    subValue={portfolioAnalytics.appreciation >= 0 ? 'Growth' : 'Decline'}
                />}
                {isWidgetVisible('monthly_income') && <StatCard 
                    title="Monthly Rental Income" 
                    value={formatCurrency(portfolioAnalytics.monthlyIncome)} 
                />}
                {isWidgetVisible('watchlist_properties') && 
                    <StatCard 
                        title="Watchlist Properties" 
                        value={savedProperties.length.toString()}
                        subValue="Properties you're tracking"
                    />
                }
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                    {isWidgetVisible('global_map') && (
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Global Asset Overview</h3>
                            <PortfolioMap ownedProperties={userProperties} watchlistProperties={savedProperties} />
                        </div>
                    )}
                    <AIPortfolioSummary userProperties={userProperties} />
                </div>
                 <div className="lg:col-span-1">
                     <InvestorGamification 
                        investorAchievements={props.investorAchievements}
                        userProperties={userProperties}
                        onUpdateInvestorAchievements={props.onUpdateInvestorAchievements}
                        currency={currency}
                     />
                 </div>
            </div>

             <style>{`
                .quick-action-btn {
                    @apply px-4 py-2 text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700;
                }
            `}</style>
        </div>
    );
};

export default InvestorDashboardHome;