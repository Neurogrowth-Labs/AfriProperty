

import React, { useState, useMemo } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import type { TaxLegalInfo, Currency } from '../../../types';
import { ToolsIcon, BuildingLibraryIcon } from '../../icons/InvestorDashboardIcons';
// FIX: Imported the missing ChartBarIcon component.
import { CpuChipIcon, ArrowUpIcon, ArrowDownIcon, ChartBarIcon } from '../../icons/ActionIcons';
import { useCurrency } from '../../../contexts/CurrencyContext';

type FinancialToolTab = 'calculator' | 'tax';

interface InvestorFinancialToolsProps {
    currency: Currency;
}

const taxLegalSchema = {
    type: Type.OBJECT,
    properties: {
        tax_benefits: { type: Type.ARRAY, items: { type: Type.STRING } },
        legal_restrictions: { type: Type.ARRAY, items: { type: Type.STRING } },
        ownership_structures: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ['tax_benefits', 'legal_restrictions', 'ownership_structures'],
};

const InvestorFinancialTools: React.FC<InvestorFinancialToolsProps> = ({ currency }) => {
    const [activeTab, setActiveTab] = useState<FinancialToolTab>('calculator');

    return (
        <div className="p-4 md:p-8 space-y-8 h-full flex flex-col">
            <div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Financial & ROI Tools</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Analyze potential investments and forecast profitability.</p>
            </div>
            
             <div className="border-b border-slate-200 dark:border-slate-700">
                <nav className="-mb-px flex space-x-6">
                    <TabButton id="calculator" label="Smart ROI Calculator" icon={ToolsIcon} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="tax" label="Tax & Legal Hub" icon={BuildingLibraryIcon} activeTab={activeTab} setActiveTab={setActiveTab} />
                </nav>
            </div>

            <div className="flex-grow bg-white dark:bg-slate-800/50 rounded-lg shadow-sm overflow-y-auto p-6">
                 {activeTab === 'calculator' && <SmartROICalculator />}
                 {activeTab === 'tax' && <TaxLegalHub />}
            </div>
        </div>
    );
};

const TabButton: React.FC<{id: FinancialToolTab, label: string, icon: React.ElementType, activeTab: FinancialToolTab, setActiveTab: (tab: FinancialToolTab) => void}> = 
({ id, label, icon: Icon, activeTab, setActiveTab }) => (
    <button 
        onClick={() => setActiveTab(id)} 
        className={`py-3 px-1 border-b-2 font-semibold text-sm flex items-center gap-2 ${activeTab === id ? 'border-brand-primary text-brand-primary' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
    >
        <Icon className="w-5 h-5" /> {label}
    </button>
);


const InputField: React.FC<{ label: string; name: string; type?: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; symbol?: string; isCurrency?: boolean; unit?: string }> = 
({ label, name, type = 'number', value, onChange, symbol, isCurrency = false, unit }) => {
    const { currency } = useCurrency();
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-slate-600 dark:text-slate-300">{label}</label>
            <div className="relative mt-1">
                {isCurrency && <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 text-sm">{symbol}</span>}
                <input 
                    type={type} 
                    name={name} 
                    id={name} 
                    value={value} 
                    onChange={onChange} 
                    className={`w-full py-2.5 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-brand-primary focus:border-brand-primary bg-slate-50 dark:bg-slate-700 ${isCurrency ? 'pl-8' : 'px-3'} ${unit ? 'pr-8' : ''}`} 
                    step={name === 'interestRate' ? '0.1' : '1'}
                />
                 {unit && <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 text-sm">{unit}</span>}
            </div>
        </div>
    )
};

const ResultCard: React.FC<{ title: string; value: string; color: string; icon: React.ElementType }> = ({ title, value, color, icon: Icon }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
             <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full">
                <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <p className="font-semibold text-slate-700 dark:text-slate-200">{title}</p>
        </div>
        <p className={`text-5xl font-extrabold mt-4 ${color}`}>{value}</p>
    </div>
);

const SmartROICalculator: React.FC = () => {
    const { currency, formatCurrency } = useCurrency();
    const [inputs, setInputs] = useState({
        price: 500000,
        downPayment: 100000,
        interestRate: 6.5,
        loanTerm: 30,
        monthlyRent: 3000,
        propertyTax: 5000,
        insurance: 1200,
        maintenance: 2500,
        vacancyRate: 5,
    });
    
    const [simulation, setSimulation] = useState({
        rentIncrease: 2,
        appreciation: 3,
        expenseIncrease: 2,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs(prev => ({ ...prev, [e.target.name]: Number(e.target.value) }));
    };
    
    const handleSimChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSimulation(prev => ({ ...prev, [e.target.name]: Number(e.target.value) }));
    }

    const results = useMemo(() => {
        const { price, downPayment, interestRate, loanTerm, monthlyRent, propertyTax, insurance, maintenance, vacancyRate } = inputs;
        const loanAmount = price - downPayment;
        
        const monthlyInterest = (interestRate / 100) / 12;
        const numPayments = loanTerm * 12;
        const monthlyMortgage = (loanAmount * monthlyInterest * Math.pow(1 + monthlyInterest, numPayments)) / (Math.pow(1 + monthlyInterest, numPayments) - 1) || 0;
        
        const totalInvestment = downPayment;
        const grossMonthlyIncome = monthlyRent;
        const monthlyVacancyLoss = grossMonthlyIncome * (vacancyRate / 100);
        
        const monthlyExpenses = (propertyTax / 12) + (insurance / 12) + (maintenance / 12);
        const totalMonthlyExpenses = monthlyExpenses + monthlyVacancyLoss;
        const monthlyCashFlow = grossMonthlyIncome - (monthlyMortgage + totalMonthlyExpenses);
        
        const annualCashFlow = monthlyCashFlow * 12;
        const cashOnCashROI = totalInvestment > 0 ? (annualCashFlow / totalInvestment) * 100 : 0;
        
        const totalMonthlyPayment = monthlyMortgage + monthlyExpenses;

        return { monthlyCashFlow, cashOnCashROI, monthlyMortgage, monthlyExpenses, totalMonthlyPayment };
    }, [inputs]);

    const projection = useMemo(() => {
        let futureValue = inputs.price;
        let futureRent = inputs.monthlyRent;
        let futureExpenses = results.monthlyExpenses;
        const years = [];
        for (let i = 1; i <= 5; i++) {
            futureValue *= (1 + simulation.appreciation / 100);
            futureRent *= (1 + simulation.rentIncrease / 100);
            futureExpenses *= (1 + simulation.expenseIncrease / 100);
            const futureCashFlow = futureRent - (results.monthlyMortgage + futureExpenses);
            years.push({ year: i, cashFlow: futureCashFlow * 12 });
        }
        const maxProjectedCashflow = Math.max(...years.map(y => y.cashFlow), 0);
        return { years, endValue: futureValue, maxProjectedCashflow };
    }, [inputs, simulation, results]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Inputs Column */}
            <div className="lg:col-span-2 space-y-6">
                 <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-200 pb-2 mb-4">Purchase & Loan</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Purchase Price" name="price" value={inputs.price} onChange={handleInputChange} isCurrency symbol={currency}/>
                        <InputField label="Down Payment" name="downPayment" value={inputs.downPayment} onChange={handleInputChange} isCurrency symbol={currency}/>
                        <InputField label="Interest Rate" name="interestRate" value={inputs.interestRate} onChange={handleInputChange} unit="%" />
                        <InputField label="Loan Term" name="loanTerm" value={inputs.loanTerm} onChange={handleInputChange} unit="Yrs" />
                    </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-200 pb-2 mb-4">Income & Expenses</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Monthly Rent" name="monthlyRent" value={inputs.monthlyRent} onChange={handleInputChange} isCurrency symbol={currency}/>
                        <InputField label="Annual Property Tax" name="propertyTax" value={inputs.propertyTax} onChange={handleInputChange} isCurrency symbol={currency}/>
                        <InputField label="Annual Insurance" name="insurance" value={inputs.insurance} onChange={handleInputChange} isCurrency symbol={currency}/>
                        <InputField label="Annual Maintenance" name="maintenance" value={inputs.maintenance} onChange={handleInputChange} isCurrency symbol={currency}/>
                        <InputField label="Vacancy Rate" name="vacancyRate" value={inputs.vacancyRate} onChange={handleInputChange} unit="%" />
                    </div>
                </div>
            </div>

            {/* Results Column */}
            <div className="lg:col-span-3 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ResultCard title="Monthly Cash Flow" value={formatCurrency(results.monthlyCashFlow)} color={results.monthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-600'} icon={results.monthlyCashFlow >= 0 ? ArrowUpIcon : ArrowDownIcon} />
                    <ResultCard title="Cash on Cash ROI" value={`${results.cashOnCashROI.toFixed(2)}%`} color={results.cashOnCashROI >= 0 ? 'text-green-600' : 'text-red-600'} icon={ChartBarIcon} />
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">Monthly Payment Breakdown</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center"><span className="text-slate-500 dark:text-slate-400">Principal & Interest</span><span className="font-mono font-medium">{formatCurrency(results.monthlyMortgage)}</span></div>
                        <div className="flex justify-between items-center"><span className="text-slate-500 dark:text-slate-400">Taxes & Insurance</span><span className="font-mono font-medium">{formatCurrency((inputs.propertyTax + inputs.insurance)/12)}</span></div>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700 mt-2"><span className="font-semibold text-slate-800 dark:text-white">Total Monthly Payment</span><span className="font-mono font-bold text-lg text-slate-800 dark:text-white">{formatCurrency(results.totalMonthlyPayment)}</span></div>
                    </div>
                </div>
                
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">"What If" Analysis</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div><label className="text-sm font-medium">Rent Increase: <span className="font-bold">{simulation.rentIncrease}%</span>/yr</label><input type="range" name="rentIncrease" min="0" max="10" step="0.5" value={simulation.rentIncrease} onChange={handleSimChange} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-600" /></div>
                        <div><label className="text-sm font-medium">Appreciation: <span className="font-bold">{simulation.appreciation}%</span>/yr</label><input type="range" name="appreciation" min="0" max="10" step="0.5" value={simulation.appreciation} onChange={handleSimChange} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-600" /></div>
                        <div><label className="text-sm font-medium">Expense Increase: <span className="font-bold">{simulation.expenseIncrease}%</span>/yr</label><input type="range" name="expenseIncrease" min="0" max="10" step="0.5" value={simulation.expenseIncrease} onChange={handleSimChange} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-600" /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">5-Year Annual Cash Flow</h4>
                            <div className="flex items-end h-32 gap-2 border-l border-b border-slate-300 dark:border-slate-600 p-2">
                                {projection.years.map(y => (
                                    <div key={y.year} className="w-full flex flex-col items-center justify-end h-full gap-1 group relative">
                                        <div className="absolute -top-6 bg-slate-700 text-white text-xs px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">{formatCurrency(y.cashFlow)}</div>
                                        <div className="w-full bg-brand-primary/20 hover:bg-brand-primary/40 rounded-t-sm" style={{ height: `${y.cashFlow > 0 ? (y.cashFlow / projection.maxProjectedCashflow) * 100 : 0}%`}}></div>
                                        <span className="text-xs text-slate-500">Yr {y.year}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                         <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg flex flex-col justify-center text-center">
                            <h4 className="font-semibold">Projected Value in 5 Yrs</h4>
                            <p className="text-3xl font-bold text-brand-primary mt-2">{formatCurrency(Number(projection.endValue))}</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

const TaxLegalHub: React.FC = () => {
    const [country, setCountry] = useState('South Africa');
    const [report, setReport] = useState<TaxLegalInfo | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const handleGenerate = async () => {
        setIsLoading(true);
        setError('');
        setReport(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Generate a summary of the tax and legal landscape for foreign real estate investors in ${country}. Provide JSON with arrays for tax_benefits, legal_restrictions, and common ownership_structures.`;
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash", contents: prompt,
                config: { responseMimeType: 'application/json', responseSchema: taxLegalSchema }
            });
            setReport(JSON.parse(response.text.trim()));
        } catch(err) {
            console.error(err);
            setError('Failed to generate report. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="p-4 bg-brand-light dark:bg-slate-900/50 rounded-lg flex items-center gap-4">
                <select value={country} onChange={e => setCountry(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800">
                    {["South Africa", "United States", "Portugal", "Thailand"].map(c => <option key={c}>{c}</option>)}
                </select>
                 <button onClick={handleGenerate} disabled={isLoading} className="bg-brand-primary text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 disabled:bg-slate-400 flex-shrink-0">
                    {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <CpuChipIcon className="w-5 h-5"/>}
                    Generate Report
                </button>
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {report && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InfoCard title="Tax Benefits" items={report.tax_benefits} />
                    <InfoCard title="Legal Restrictions" items={report.legal_restrictions} />
                    <InfoCard title="Ownership Structures" items={report.ownership_structures} />
                </div>
            )}
        </div>
    );
};

const InfoCard: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
        <h4 className="font-bold text-slate-800 dark:text-white mb-2">{title}</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-300">
            {items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
    </div>
);


export default InvestorFinancialTools;