
import React, { useMemo } from 'react';
import type { User } from '../../../types';
import { getInvestorReturns } from '../../../lib/data';
import { BanknotesIcon, ChartBarIcon } from '../../icons/ActionIcons';
import { useCurrency } from '../../../contexts/CurrencyContext';

interface InvestorReturnsProps {
    user: User;
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType; }> = ({ title, value, icon: Icon }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2">{value}</p>
            </div>
            <div className="bg-brand-light dark:bg-slate-700 p-3 rounded-full">
                <Icon className="w-6 h-6 text-brand-primary" />
            </div>
        </div>
    </div>
);

const InvestorReturns: React.FC<InvestorReturnsProps> = ({ user }) => {
    const { formatCurrency } = useCurrency();
    const returnsData = useMemo(() => getInvestorReturns(), []);

    const totals = useMemo(() => {
        const total = returnsData.reduce((sum, item) => sum + item.amount, 0);
        const ytd = returnsData.filter(item => new Date(item.date).getFullYear() === new Date().getFullYear()).reduce((sum, item) => sum + item.amount, 0);
        return { total, ytd };
    }, [returnsData]);

    return (
        <div className="p-4 sm:p-8 space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Returns & Dividends</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Track your investment returns and dividend payout history.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard title="Total Returns (All Time)" value={formatCurrency(totals.total)} icon={BanknotesIcon} />
                <StatCard title="YTD Dividends" value={formatCurrency(totals.ytd)} icon={ChartBarIcon} />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white p-4 border-b border-slate-200 dark:border-slate-700">Dividend History</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[600px]">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="p-3 text-left font-semibold text-slate-600 dark:text-slate-300">Date</th>
                                <th className="p-3 text-left font-semibold text-slate-600 dark:text-slate-300">Property</th>
                                <th className="p-3 text-left font-semibold text-slate-600 dark:text-slate-300">Type</th>
                                <th className="p-3 text-right font-semibold text-slate-600 dark:text-slate-300">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {returnsData.map(item => (
                                <tr key={item.id}>
                                    <td className="p-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">{new Date(item.date).toLocaleDateString()}</td>
                                    <td className="p-3 font-medium text-slate-800 dark:text-white">{item.propertyTitle}</td>
                                    <td className="p-3">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300`}>
                                            {item.type}
                                        </span>
                                    </td>
                                    <td className="p-3 text-right font-semibold text-green-600 whitespace-nowrap">{formatCurrency(item.amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {returnsData.length === 0 && (
                    <p className="text-center text-slate-500 py-10">No dividend history found.</p>
                )}
            </div>

        </div>
    );
};

export default InvestorReturns;
