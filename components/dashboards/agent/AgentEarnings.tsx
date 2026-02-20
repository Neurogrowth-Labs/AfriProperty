

import React, { useMemo } from 'react';
import type { Property, User } from '../../../types';
import { PropertyStatus } from '../../../types';
import { BanknotesIcon, ClockIcon } from '../../icons/ActionIcons';
import { useCurrency } from '../../../contexts/CurrencyContext';

interface AgentEarningsProps {
  user: User;
  allProperties: Property[];
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


const AgentEarnings: React.FC<AgentEarningsProps> = ({ user, allProperties }) => {
    const { formatCurrency } = useCurrency();
    const commissionRate = 0.025; // Assume a 2.5% commission rate

    const soldProperties = useMemo(() => {
        return allProperties
            .filter(p => p.agent.name === user.username && p.status === PropertyStatus.SOLD)
            .map(p => {
                const commission = p.price * commissionRate;
                // Mocking payout status
                const isPaid = p.id.includes('1') || p.id.includes('5'); 
                return { ...p, commission, isPaid };
            });
    }, [allProperties, user.username]);

    const earnings = useMemo(() => {
        const total = soldProperties.reduce((sum, p) => sum + p.commission, 0);
        const pending = soldProperties.filter(p => !p.isPaid).reduce((sum, p) => sum + p.commission, 0);
        return { total, pending };
    }, [soldProperties]);

    return (
        <div className="p-8 space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Earnings & Commissions</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Track your commissions and view your transaction history.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard title="Total Earnings (All Time)" value={formatCurrency(earnings.total)} icon={BanknotesIcon} />
                <StatCard title="Pending Payouts" value={formatCurrency(earnings.pending)} icon={ClockIcon} />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white p-4 border-b border-slate-200 dark:border-slate-700">Transaction History</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="p-3 text-left font-semibold text-slate-600 dark:text-slate-300">Property</th>
                                <th className="p-3 text-right font-semibold text-slate-600 dark:text-slate-300">Sale Price</th>
                                <th className="p-3 text-right font-semibold text-slate-600 dark:text-slate-300">Commission ({commissionRate * 100}%)</th>
                                <th className="p-3 text-center font-semibold text-slate-600 dark:text-slate-300">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {soldProperties.map(p => (
                                <tr key={p.id}>
                                    <td className="p-3 font-medium text-slate-800 dark:text-white">{p.title}</td>
                                    <td className="p-3 text-right text-slate-600 dark:text-slate-300">{formatCurrency(p.price)}</td>
                                    <td className="p-3 text-right font-semibold text-green-600">{formatCurrency(p.commission)}</td>
                                    <td className="p-3 text-center">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${p.isPaid ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' : 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300'}`}>
                                            {p.isPaid ? 'Paid' : 'Pending'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {soldProperties.length === 0 && (
                    <p className="text-center text-slate-500 py-10">No completed sales yet.</p>
                )}
            </div>

        </div>
    );
};

export default AgentEarnings;
