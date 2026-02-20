
import React, { useMemo, useState, useEffect } from 'react';
import type { Property, User, InvestmentMetrics, Currency } from '../../../types';
import { ListingType } from '../../../types';
import { ChartBarIcon, ArrowUpIcon, ArrowDownIcon } from '../../icons/ActionIcons';
import { ListBulletIcon, Squares2X2Icon, MapIcon } from '@heroicons/react/20/solid';
import PortfolioMap from './PortfolioMap';
import { useCurrency } from '../../../contexts/CurrencyContext';

interface InvestorPortfolioProps {
  user: User;
  allProperties: Property[];
  savedProperties: Property[];
  currency: Currency;
}

type ViewMode = 'list' | 'grid' | 'map';

const calculateMetrics = (property: Property): InvestmentMetrics => {
    const purchasePrice = property.purchasePrice || property.price * 0.8;
    const currentPrice = property.price;
    const roi = ((currentPrice - purchasePrice) / purchasePrice) * 100;
    
    let annualYield = 0;
    if (property.listingType === ListingType.RENT) {
        const annualRent = property.price * 12;
        annualYield = (annualRent / purchasePrice) * 100;
    }
    return { roi, annualYield };
};

const PerformanceGraph: React.FC<{ data: {date: number; price: number}[] }> = ({ data }) => {
    const points = useMemo(() => {
        if (!data || data.length < 2) return '';
        const prices = data.map(d => d.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const priceRange = maxPrice - minPrice;

        const dates = data.map(d => d.date);
        const minDate = Math.min(...dates);
        const maxDate = Math.max(...dates);
        const dateRange = maxDate - minDate;

        return data.map(d => {
            const x = dateRange > 0 ? ((d.date - minDate) / dateRange) * 100 : 50;
            const y = priceRange > 0 ? 18 - ((d.price - minPrice) / priceRange) * 14 : 10;
            return `${x},${y}`;
        }).join(' ');
    }, [data]);

    return (
    <div className="h-16 flex items-end">
        <svg viewBox="0 0 100 20" className="w-full h-full" preserveAspectRatio="none">
            <polyline points={points} stroke="#0055A4" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    </div>
    );
};


const InvestmentCard: React.FC<{ property: Property, metrics: InvestmentMetrics, formatCurrency: (amount: number) => string }> = ({ property, metrics, formatCurrency }) => {
    const isOutperforming = property.marketROI && metrics.roi > property.marketROI;
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 flex flex-col lg:flex-row gap-5">
            <img src={property.images[0]} alt={property.title} className="w-full lg:w-48 h-48 lg:h-auto object-cover rounded-lg flex-shrink-0" />
            <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Column 1: Core Info */}
                <div>
                    <h4 className="font-bold text-lg text-slate-800 dark:text-white truncate">{property.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{property.address.city}, {property.address.zip}</p>
                    <div className="mt-4 space-y-2">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">CURRENT VALUE</p>
                            <p className="font-bold text-xl text-slate-700 dark:text-slate-200">{formatCurrency(property.price)}</p>
                        </div>
                         <div>
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">TOTAL ROI</p>
                            <p className={`font-bold text-xl ${metrics.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>{metrics.roi.toFixed(1)}%</p>
                        </div>
                    </div>
                </div>
                {/* Column 2: Performance Metrics */}
                <div className="space-y-4">
                    {property.occupancyRate && (
                        <div className="flex items-center gap-4">
                             <div className="relative w-16 h-16">
                                <svg className="w-full h-full" viewBox="0 0 36 36">
                                    <path className="text-slate-200 dark:text-slate-700" stroke="currentColor" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    <path className="text-blue-600" stroke="currentColor" strokeWidth="3" strokeDasharray={`${property.occupancyRate}, 100`} strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-lg font-bold text-slate-700 dark:text-slate-200">{property.occupancyRate}%</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">OCCUPANCY RATE</p>
                                <p className="text-sm text-slate-600 dark:text-slate-300">Annual Average</p>
                            </div>
                        </div>
                    )}
                    {property.marketROI && (
                         <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-full ${isOutperforming ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
                                {isOutperforming ? <ArrowUpIcon className="w-5 h-5 text-green-600" /> : <ArrowDownIcon className="w-5 h-5 text-red-600" />}
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">BENCHMARK</p>
                                <p className={`font-bold text-sm ${isOutperforming ? 'text-green-600' : 'text-red-600'}`}>
                                    {isOutperforming ? 'Outperforming' : 'Underperforming'} by {Math.abs(metrics.roi - property.marketROI).toFixed(1)}%
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                {/* Column 3: History & Financials */}
                <div className="space-y-4">
                     {property.priceHistory && (
                        <div>
                             <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">PRICE HISTORY</p>
                             <PerformanceGraph data={property.priceHistory} />
                        </div>
                    )}
                    {property.financials && property.financials.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">CASH FLOW</p>
                            <div className="mt-1 space-y-1">
                                {property.financials.map(fin => (
                                    <div key={fin.date} className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500 dark:text-slate-400">{fin.description} ({new Date(fin.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})})</span>
                                        <span className={`font-semibold ${fin.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                                            {fin.type === 'Income' ? '+' : '-'}{formatCurrency(Math.abs(fin.amount))}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const GridCard: React.FC<{ property: Property, metrics: InvestmentMetrics }> = ({ property, metrics }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden group">
        <img src={property.images[0]} alt={property.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"/>
        <div className="p-4">
            <h4 className="font-bold text-slate-800 dark:text-white truncate">{property.title}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{property.address.city}</p>
            <div className="flex justify-between items-center mt-3">
                 <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">ROI</p>
                 <p className={`font-bold text-lg ${metrics.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>{metrics.roi.toFixed(1)}%</p>
            </div>
        </div>
    </div>
);

const ViewToggleButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode; }> = ({ active, onClick, children }) => (
    <button onClick={onClick} className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-sm font-semibold transition-colors ${active ? 'bg-brand-primary text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
        {children}
    </button>
);


const InvestorPortfolio: React.FC<InvestorPortfolioProps> = ({ user, allProperties, savedProperties, currency }) => {
    const [view, setView] = useState<ViewMode>('list');
    const [isLoading, setIsLoading] = useState(true);
    const { formatCurrency } = useCurrency();

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000); // Simulate loading time
        return () => clearTimeout(timer);
    }, []);

    const userProperties = useMemo(() => {
        return allProperties.filter(p => p.agent.name === 'Peter Van der Merwe');
    }, [allProperties, user.username]);
    
    if (isLoading) {
        return (
            <div className="p-8 space-y-6 animate-pulse">
                <div className="flex justify-between items-center">
                    <div className="space-y-2">
                        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-64"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-80"></div>
                    </div>
                    <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg w-48"></div>
                </div>
                <div className="space-y-6">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 flex gap-5">
                            <div className="w-48 h-48 bg-slate-200 dark:bg-slate-700 rounded-lg flex-shrink-0"></div>
                            <div className="flex-grow grid grid-cols-3 gap-5">
                                <div className="space-y-4"><div className="h-5 rounded bg-slate-200 dark:bg-slate-700 w-3/4"></div><div className="h-4 rounded bg-slate-200 dark:bg-slate-700 w-full"></div></div>
                                <div className="space-y-4"><div className="h-5 rounded bg-slate-200 dark:bg-slate-700 w-3/4"></div><div className="h-4 rounded bg-slate-200 dark:bg-slate-700 w-full"></div></div>
                                <div className="space-y-4"><div className="h-5 rounded bg-slate-200 dark:bg-slate-700 w-3/4"></div><div className="h-4 rounded bg-slate-200 dark:bg-slate-700 w-full"></div></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white">My Investments</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Detailed performance of your owned properties.</p>
                </div>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/50 p-1 rounded-lg">
                    <ViewToggleButton active={view === 'list'} onClick={() => setView('list')}><ListBulletIcon className="w-5 h-5"/> List</ViewToggleButton>
                    <ViewToggleButton active={view === 'grid'} onClick={() => setView('grid')}><Squares2X2Icon className="w-5 h-5"/> Grid</ViewToggleButton>
                    <ViewToggleButton active={view === 'map'} onClick={() => setView('map')}><MapIcon className="w-5 h-5"/> Map</ViewToggleButton>
                </div>
            </div>

            {userProperties.length > 0 ? (
                <div>
                    {view === 'list' && (
                        <div className="space-y-6">
                            {userProperties.map(prop => (
                                <InvestmentCard key={prop.id} property={prop} metrics={calculateMetrics(prop)} formatCurrency={formatCurrency} />
                            ))}
                        </div>
                    )}
                    {view === 'grid' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {userProperties.map(prop => (
                                <GridCard key={prop.id} property={prop} metrics={calculateMetrics(prop)} />
                            ))}
                        </div>
                    )}
                    {view === 'map' && (
                        <div className="aspect-[2/1] rounded-xl overflow-hidden shadow-sm">
                            <PortfolioMap ownedProperties={userProperties} watchlistProperties={savedProperties} />
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                    <ChartBarIcon className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
                    <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-4">No Investments Found</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        Properties you own or manage will appear here.
                    </p>
                </div>
            )}
        </div>
    );
};

export default InvestorPortfolio;