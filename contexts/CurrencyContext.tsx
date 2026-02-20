import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { Currency } from '../types';
import { CURRENCY_SYMBOLS, CURRENCY_CONVERSION_RATES } from '../constants';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatCurrency: (amount: number, options?: Intl.NumberFormatOptions) => string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: Currency.USD,
  setCurrency: () => {},
  formatCurrency: (amount) => `$${amount.toLocaleString()}`,
});

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const savedCurrency = localStorage.getItem('currency');
    return (savedCurrency && Object.values(Currency).includes(savedCurrency as Currency))
      ? savedCurrency as Currency
      : Currency.USD;
  });

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
  };

  const formatCurrency = useMemo(() => (amount: number, options: Intl.NumberFormatOptions = {}) => {
    const rate = CURRENCY_CONVERSION_RATES[currency] || 1;
    const symbol = CURRENCY_SYMBOLS[currency] || '$';
    const convertedAmount = amount * rate;
    
    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        ...options,
    });
    
    return `${symbol}${formatter.format(convertedAmount)}`;
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
