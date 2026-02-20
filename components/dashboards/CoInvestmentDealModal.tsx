
import React, { useState } from 'react';
import type { Property } from '../types';
import { CloseIcon } from './icons/NavIcons';
import { useCurrency } from '../contexts/CurrencyContext';
import { DocumentTextIcon, ChartBarIcon } from './icons/ActionIcons';
import { BriefcaseIcon } from './icons/InvestorDashboardIcons';

interface DealWithProperty {
    id: string;
    propertyId: string;
    fundingGoal: number;
    fundedAmount: number;
    investorCount: number;
    property: Property;
}

interface CoInvestmentDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: DealWithProperty;
}

const CoInvestmentDealModal: React.FC<CoInvestmentDealModalProps> = ({ isOpen, onClose, deal }) => {
    const { formatCurrency } = useCurrency();
    const [activeTab, setActiveTab] = useState<'financials' | 'structure' | 'documents'>('financials');

    if (!isOpen) return null;

    const fundingPercentage = (deal.fundedAmount / deal.fundingGoal) * 100;
    
    // Mock data for projections
    const projectedROI = deal.property.marketROI || 12.5;
    const estimatedYield = (projectedROI / 2) + 1;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[120] p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-brand-dark dark:text-white">Co-Investment Opportunity</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{deal.property.title}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><CloseIcon className="w-6 h-6" /></button>
                </header>

                <div className="flex-grow overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <img src={deal.property.images[0]} alt={deal.property.title} className="w-full h-64 object-cover rounded-lg" />
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{deal.property.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400">{deal.property.address.street}, {deal.property.address.city}</p>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1 font-semibold">
                                    <span>Funded: {formatCurrency(deal.fundedAmount)}</span>
                                    <span>Goal: {formatCurrency(deal.fundingGoal)}</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4"><div className="bg-brand-primary h-4 rounded-full" style={{ width: `${fundingPercentage}%` }}></div></div>
                                <p className="text-right text-sm font-bold mt-1">{fundingPercentage.toFixed(1)}% Funded</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg"><p className="text-xs font-semibold text-slate-500 dark:text-slate-400">MIN. INVESTMENT</p><p className="font-bold text-lg">{formatCurrency(5000)}</p></div>
                                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg"><p className="text-xs font-semibold text-slate-500 dark:text-slate-400">INVESTORS</p><p className="font-bold text-lg">{deal.investorCount}</p></div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div>
                             <div className="border-b border-slate-200 dark:border-slate-700">
                                <nav className="-mb-px flex space-x-4">
                                    <button onClick={() => setActiveTab('financials')} className={`tab-btn ${activeTab === 'financials' ? 'tab-btn-active' : ''}`}><ChartBarIcon className="w-5 h-5"/> Financials</button>
                                    <button onClick={() => setActiveTab('structure')} className={`tab-btn ${activeTab === 'structure' ? 'tab-btn-active' : ''}`}><BriefcaseIcon className="w-5 h-5"/> Deal Structure</button>
                                    <button onClick={() => setActiveTab('documents')} className={`tab-btn ${activeTab === 'documents' ? 'tab-btn-active' : ''}`}><DocumentTextIcon className="w-5 h-5"/> Documents</button>
                                </nav>
                            </div>
                            <div className="mt-6">
                                {activeTab === 'financials' && (
                                    <div className="space-y-4 animate-fade-in">
                                        <h4 className="font-bold text-lg">Financial Projections</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg"><p className="text-sm text-green-800 dark:text-green-300">Projected ROI</p><p className="text-3xl font-bold text-green-600">{projectedROI.toFixed(1)}%</p></div>
                                            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg"><p className="text-sm text-blue-800 dark:text-blue-300">Est. Annual Yield</p><p className="text-3xl font-bold text-blue-600">{estimatedYield.toFixed(1)}%</p></div>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">These are forward-looking statements and are not guaranteed. Past performance is not indicative of future results.</p>
                                    </div>
                                )}
                                {activeTab === 'structure' && (
                                    <div className="space-y-4 text-sm animate-fade-in">
                                        <h4 className="font-bold text-lg">Deal Structure</h4>
                                        <p><strong className="w-32 inline-block">Investment Type:</strong> Equity Crowdfunding</p>
                                        <p><strong className="w-32 inline-block">Term Length:</strong> 5-7 Years (estimated)</p>
                                        <p><strong className="w-32 inline-block">Exit Strategy:</strong> Sale of property on the open market after value-add improvements and market appreciation.</p>
                                        <div className="pt-4 border-t dark:border-slate-700">
                                            <h5 className="font-semibold text-red-600">Risk Assessment</h5>
                                            <ul className="list-disc list-inside text-xs mt-1">
                                                <li>Market Risk: Real estate values can fluctuate.</li>
                                                <li>Liquidity Risk: Investment is illiquid for the term length.</li>
                                                <li>Execution Risk: Project may face unforeseen delays or costs.</li>
                                            </ul>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'documents' && (
                                    <div className="space-y-3 animate-fade-in">
                                        <h4 className="font-bold text-lg">Due Diligence Documents</h4>
                                        <button className="doc-btn"><DocumentTextIcon className="w-5 h-5"/> Investment Prospectus.pdf</button>
                                        <button className="doc-btn"><DocumentTextIcon className="w-5 h-5"/> Financial Statements Q3 2023.xlsx</button>
                                        <button className="doc-btn"><DocumentTextIcon className="w-5 h-5"/> Legal Agreement.pdf</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-b-2xl border-t border-slate-200 dark:border-slate-700 flex-shrink-0 flex justify-end">
                    <button onClick={() => alert('Proceeding to investment pledge...')} className="bg-brand-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors">Pledge Investment</button>
                </footer>
            </div>
            <style>{`
                .tab-btn { @apply py-2 px-1 border-b-2 font-semibold text-sm flex items-center gap-2 border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200; }
                .tab-btn-active { @apply border-brand-primary text-brand-primary; }
                .doc-btn { @apply w-full text-left flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg font-medium text-slate-700 dark:text-slate-200; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
                @keyframes fadeInScale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                .animate-fade-in-scale { animation: fadeInScale 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default CoInvestmentDealModal;