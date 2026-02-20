

import React, { useState, useEffect, useMemo } from 'react';
import { CloseIcon } from './icons/NavIcons';
import { useCurrency } from '../contexts/CurrencyContext';
import { CURRENCY_CONVERSION_RATES } from '../constants';

interface MortgageCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  propertyPrice: number; // Base price in USD
  propertyTitle: string;
}

const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({ isOpen, onClose, propertyPrice, propertyTitle }) => {
  const { currency, formatCurrency } = useCurrency();
  const conversionRate = CURRENCY_CONVERSION_RATES[currency];

  const [downPayment, setDownPayment] = useState(propertyPrice * 0.2 * conversionRate); // in current currency
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);

  const downPaymentUSD = downPayment / conversionRate;
  const loanAmountUSD = (propertyPrice - downPaymentUSD) > 0 ? (propertyPrice - downPaymentUSD) : 0;
  const platformFeeUSD = useMemo(() => loanAmountUSD * 0.001, [loanAmountUSD]);

  useEffect(() => {
    // When currency changes, re-calculate the initial down payment suggestion
    setDownPayment(propertyPrice * 0.2 * conversionRate);
  }, [currency, propertyPrice, conversionRate]);

  const monthlyPaymentUSD = useMemo(() => {
    if (loanAmountUSD <= 0 || interestRate <= 0) return 0;

    const monthlyInterestRate = (interestRate / 100) / 12;
    const numberOfPayments = loanTerm * 12;

    const principalAndInterest = (loanAmountUSD * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
    if (isNaN(principalAndInterest)) return 0;
    
    return principalAndInterest + (platformFeeUSD / (loanTerm * 12));
  }, [loanAmountUSD, interestRate, loanTerm, platformFeeUSD]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" 
        onClick={e => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-brand-dark dark:text-white">Mortgage Calculator</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-xs">{propertyTitle}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="p-6 space-y-5">
            <div className="text-center bg-brand-light dark:bg-slate-800 p-4 rounded-lg">
                <p className="text-slate-600 dark:text-slate-300">Estimated Monthly Payment</p>
                <p className="text-4xl font-bold text-brand-dark dark:text-white mt-1">
                    {formatCurrency(monthlyPaymentUSD, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 space-y-1">
                  <p>This is an estimate and does not include taxes or insurance.</p>
                  <p className="font-medium text-slate-600 dark:text-slate-200">Includes small Platform Fee for security & verification services.</p>
                </div>
            </div>
          
            <div>
                <label htmlFor="price" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Property Price</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <input type="text" id="price" value={formatCurrency(propertyPrice)} readOnly className="w-full pl-4 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md" />
                </div>
            </div>

            <div>
                <label htmlFor="downPayment" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Down Payment ({currency})</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                     <input type="number" id="downPayment" value={downPayment} onChange={e => setDownPayment(Number(e.target.value))} className="w-full pl-4 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-brand-primary focus:border-brand-primary dark:bg-slate-900" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="interestRate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Interest Rate</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <input type="number" step="0.1" id="interestRate" value={interestRate} onChange={e => setInterestRate(Number(e.target.value))} className="w-full pl-4 pr-7 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-brand-primary focus:border-brand-primary dark:bg-slate-900" />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">%</div>
                    </div>
                </div>
                 <div>
                    <label htmlFor="loanTerm" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Loan Term (Years)</label>
                    <select id="loanTerm" value={loanTerm} onChange={e => setLoanTerm(Number(e.target.value))} className="mt-1 w-full pl-3 pr-8 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-brand-primary focus:border-brand-primary dark:bg-slate-900">
                        <option>30</option>
                        <option>20</option>
                        <option>15</option>
                        <option>10</option>
                    </select>
                </div>
            </div>
        </div>

        <footer className="bg-slate-50 dark:bg-slate-800 p-4 rounded-b-xl text-center">
            <button 
                onClick={onClose}
                className="w-full sm:w-auto bg-brand-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300"
            >
                Done
            </button>
        </footer>
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

export default MortgageCalculator;