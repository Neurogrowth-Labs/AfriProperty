
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { User } from '../../../types';
import { CreditCardIcon, BanknotesIcon, CheckCircleIcon, ClockIcon, ExclamationCircleIcon } from '../../icons/AgentDashboardIcons';

interface SubscriptionManagementProps {
    user: User;
}

interface Bill {
    id: string;
    amount: number;
    currency: string;
    status: 'pending' | 'paid' | 'overdue';
    due_date: string;
    paid_at: string | null;
    billing_period_start: string;
    billing_period_end: string;
}

interface PaymentMethod {
    id: string;
    card_holder: string;
    brand: string;
    last_four: string;
    expiry_month: number;
    expiry_year: number;
    is_default: boolean;
}

const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({ user }) => {
    const [activeTab, setActiveTab] = useState<'bills' | 'payment_methods'>('bills');
    const [bills, setBills] = useState<Bill[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [user.id]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [billsRes, pmRes] = await Promise.all([
                supabase.from('subscription_bills').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
                supabase.from('subscription_payment_methods').select('*').eq('user_id', user.id).order('is_default', { ascending: false })
            ]);

            if (billsRes.data) setBills(billsRes.data);
            if (pmRes.data) setPaymentMethods(pmRes.data);
            
            // If no bills exist, let's "mock" or generate one based on current plan for demo purposes if it's a new user
            if (billsRes.data?.length === 0 && user.planPrice && user.planPrice > 0) {
                const mockBill: Bill = {
                    id: 'mock-1',
                    amount: user.planPrice,
                    currency: 'USD',
                    status: 'pending',
                    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    paid_at: null,
                    billing_period_start: new Date().toISOString(),
                    billing_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                };
                setBills([mockBill]);
            }
        } catch (error) {
            console.error('Error fetching subscription data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'paid': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
            case 'pending': return <ClockIcon className="w-5 h-5 text-amber-500" />;
            case 'overdue': return <ExclamationCircleIcon className="w-5 h-5 text-red-500" />;
            default: return null;
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex border-b border-slate-200 dark:border-slate-800">
                <button 
                    onClick={() => setActiveTab('bills')}
                    className={`flex-1 py-4 px-6 text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'bills' ? 'text-brand-primary border-b-2 border-brand-primary bg-brand-light/10' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    <BanknotesIcon className="w-5 h-5" />
                    Subscription Bills
                </button>
                <button 
                    onClick={() => setActiveTab('payment_methods')}
                    className={`flex-1 py-4 px-6 text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'payment_methods' ? 'text-brand-primary border-b-2 border-brand-primary bg-brand-light/10' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    <CreditCardIcon className="w-5 h-5" />
                    Payment Methods
                </button>
            </div>

            <div className="p-6">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
                    </div>
                ) : activeTab === 'bills' ? (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Billing History</h3>
                            <div className="text-sm text-slate-500">
                                Current Plan: <span className="font-bold text-brand-primary">{user.planId?.toUpperCase() || 'FREE'}</span>
                            </div>
                        </div>

                        {bills.length === 0 ? (
                            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                                <BanknotesIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 dark:text-slate-400">No billing records found.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                                            <th className="px-4 py-3 font-bold">Bill ID</th>
                                            <th className="px-4 py-3 font-bold">Period</th>
                                            <th className="px-4 py-3 font-bold">Amount</th>
                                            <th className="px-4 py-3 font-bold">Status</th>
                                            <th className="px-4 py-3 font-bold">Due Date</th>
                                            <th className="px-4 py-3 font-bold text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                        {bills.map(bill => (
                                            <tr key={bill.id} className="text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="px-4 py-4 font-mono text-xs text-slate-500">#{bill.id.slice(0, 8)}</td>
                                                <td className="px-4 py-4">
                                                    <div className="text-slate-700 dark:text-slate-200">
                                                        {new Date(bill.billing_period_start).toLocaleDateString()} - {new Date(bill.billing_period_end).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 font-bold text-slate-800 dark:text-white">
                                                    {bill.currency} {bill.amount.toLocaleString()}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-1.5">
                                                        {getStatusIcon(bill.status)}
                                                        <span className={`capitalize font-medium ${
                                                            bill.status === 'paid' ? 'text-green-600' : 
                                                            bill.status === 'overdue' ? 'text-red-600' : 'text-amber-600'
                                                        }`}>
                                                            {bill.status}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-slate-600 dark:text-slate-400">
                                                    {new Date(bill.due_date).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    {bill.status !== 'paid' && (
                                                        <button className="px-3 py-1.5 bg-brand-primary text-white text-xs font-bold rounded-lg hover:bg-brand-primary/90 transition-all">
                                                            Pay Now
                                                        </button>
                                                    )}
                                                    {bill.status === 'paid' && (
                                                        <button className="text-brand-primary hover:underline text-xs font-bold">
                                                            Invoice
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Saved Payment Methods</h3>
                            <button className="text-sm font-bold text-brand-primary hover:underline flex items-center gap-1">
                                + Add New Card
                            </button>
                        </div>

                        {paymentMethods.length === 0 ? (
                            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                                <CreditCardIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 dark:text-slate-400">No payment methods saved.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {paymentMethods.map(pm => (
                                    <div key={pm.id} className={`p-4 rounded-xl border-2 transition-all ${pm.is_default ? 'border-brand-primary bg-brand-light/5 dark:bg-slate-800' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                                <CreditCardIcon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                                            </div>
                                            {pm.is_default && (
                                                <span className="text-[10px] font-bold bg-brand-primary text-white px-2 py-0.5 rounded-full uppercase">Default</span>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-slate-800 dark:text-white">•••• •••• •••• {pm.last_four}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{pm.brand} • Expires {pm.expiry_month}/{pm.expiry_year}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{pm.card_holder}</p>
                                        </div>
                                        <div className="mt-4 flex justify-end gap-3">
                                            <button className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors">Remove</button>
                                            {!pm.is_default && <button className="text-xs font-bold text-brand-primary hover:underline">Set Default</button>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubscriptionManagement;
