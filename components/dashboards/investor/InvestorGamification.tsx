
import React, { useMemo } from 'react';
import type { Achievement, Property, Currency } from '../../../types';
import { ListingType } from '../../../types';
import { CURRENCY_SYMBOLS, CURRENCY_CONVERSION_RATES } from '../../../constants';

interface InvestorGamificationProps {
    investorAchievements: Achievement[];
    userProperties: Property[];
    onUpdateInvestorAchievements: (achievements: Achievement[]) => void;
    currency: Currency;
}

const InvestorGamification: React.FC<InvestorGamificationProps> = ({ investorAchievements, userProperties, currency }) => {

    const progress = useMemo(() => {
        const investmentCount = userProperties.length;
        const cityCount = new Set(userProperties.map(p => p.address.city)).size;
        const monthlyIncome = userProperties
            .filter(p => p.listingType === ListingType.RENT)
            .reduce((sum, p) => sum + p.price, 0);

        return {
            'First Investment': investmentCount,
            'Diversified': cityCount,
            'Cashflow King': monthlyIncome,
        };
    }, [userProperties]);

    const formatGoal = (title: string, goal: number) => {
        if (title === 'Cashflow King') {
            const rate = CURRENCY_CONVERSION_RATES[currency] || 1;
            const symbol = CURRENCY_SYMBOLS[currency] || '$';
            return `${symbol}${(goal * rate).toLocaleString()}`;
        }
        return goal;
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm h-full">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Achievements</h3>
            <div className="space-y-4">
                {investorAchievements.map(ach => {
                    const currentProgress = progress[ach.title as keyof typeof progress] || 0;
                    const isCompleted = currentProgress >= ach.goal;
                    const percentage = Math.min((currentProgress / ach.goal) * 100, 100);

                    return (
                        <div key={ach.id} className={`p-3 rounded-lg flex items-center gap-4 ${isCompleted ? 'bg-green-50 dark:bg-green-900/30' : 'bg-slate-50 dark:bg-slate-700/50'}`}>
                            <div className={`p-3 rounded-full ${isCompleted ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-300'}`}>
                                <ach.badge className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 dark:text-white">{ach.title}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{ach.description}</p>
                                <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-1.5 mt-2">
                                    <div className={`h-1.5 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-brand-primary'}`} style={{ width: `${percentage}%` }}></div>
                                </div>
                                <p className="text-xs text-slate-400 dark:text-slate-500 text-right mt-1">{formatGoal(ach.title, currentProgress)} / {formatGoal(ach.title, ach.goal)}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default InvestorGamification;
