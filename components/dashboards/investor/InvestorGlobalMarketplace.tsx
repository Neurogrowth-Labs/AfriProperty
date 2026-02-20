

import React, { useState, useMemo, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import type { MarketHotspot, Property, ExclusiveDeal, MarketComparison } from '../../../types';
import { DealType } from '../../../types';
import { MarketplaceIcon, TagIcon, ScaleIcon } from '../../icons/InvestorDashboardIcons';
import { CpuChipIcon } from '../../icons/ActionIcons';
import { EXCLUSIVE_DEALS, ALL_PROPERTIES } from '../../../constants';

type MarketplaceTab = 'hotspots' | 'deals' | 'analysis';

interface InvestorGlobalMarketplaceProps {
    onOpenDetailModal: (property: Property) => void;
}

const comparisonSchema = {
    type: Type.OBJECT,
    properties: {
        country_a: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                summary: { type: Type.STRING },
                pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                cons: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['name', 'summary', 'pros', 'cons']
        },
        country_b: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                summary: { type: Type.STRING },
                pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                cons: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['name', 'summary', 'pros', 'cons']
        }
    }
};

const InvestorGlobalMarketplace: React.FC<InvestorGlobalMarketplaceProps> = ({ onOpenDetailModal }) => {
    const [activeTab, setActiveTab] = useState<MarketplaceTab>('hotspots');
    
    return (
        <div className="p-8 space-y-8 h-full flex flex-col">
            <div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Global Marketplace</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Discover and analyze cross-border investment opportunities.</p>
            </div>
            
             <div className="border-b border-slate-200 dark:border-slate-700">
                <nav className="-mb-px flex space-x-6">
                    <TabButton id="hotspots" label="AI Hotspots" icon={MarketplaceIcon} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="deals" label="Exclusive Deals" icon={TagIcon} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="analysis" label="Cross-Border Analysis" icon={ScaleIcon} activeTab={activeTab} setActiveTab={setActiveTab} />
                </nav>
            </div>

            <div className="flex-grow bg-white dark:bg-slate-800/50 rounded-lg shadow-sm overflow-y-auto p-6">
                {activeTab === 'hotspots' && <AIHotspots />}
                {activeTab === 'deals' && <ExclusiveDeals onOpenDetailModal={onOpenDetailModal} />}
                {activeTab === 'analysis' && <CrossBorderAnalysis />}
            </div>
        </div>
    );
};

// --- Tab Button Component ---
const TabButton: React.FC<{id: MarketplaceTab, label: string, icon: React.ElementType, activeTab: MarketplaceTab, setActiveTab: (tab: MarketplaceTab) => void}> = 
({ id, label, icon: Icon, activeTab, setActiveTab }) => (
    <button 
        onClick={() => setActiveTab(id)} 
        className={`py-3 px-1 border-b-2 font-semibold text-sm flex items-center gap-2 ${activeTab === id ? 'border-brand-primary text-brand-primary' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
    >
        <Icon className="w-5 h-5" /> {label}
    </button>
);


// --- AI Hotspots Component ---
const AIHotspots: React.FC = () => {
    const [hotspots, setHotspots] = useState<MarketHotspot[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerateHotspots = async () => {
        setIsLoading(true);
        setError('');
        setHotspots([]);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = "Analyze current global economic and real estate trends to identify 5 emerging property investment hotspots. For each, provide the location, a risk/reward profile, and a brief analysis. Return a JSON array of objects.";
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          location: { type: Type.STRING },
                          risk_reward_profile: { type: Type.STRING },
                          analysis: { type: Type.STRING }
                        },
                        required: ['location', 'risk_reward_profile', 'analysis']
                      }
                    },
                }
            });
            setHotspots(JSON.parse(response.text.trim()));
        } catch (err) {
            console.error(err);
            setError("Failed to generate market hotspots. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };
    
     return (
        <div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">AI-Generated Hotspots Heatmap</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 my-2">Generate an up-to-date analysis of emerging real estate markets around the globe.</p>
                <button onClick={handleGenerateHotspots} disabled={isLoading} className="btn-primary">
                    {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <CpuChipIcon className="w-5 h-5" />}
                    {isLoading ? 'Analyzing...' : 'Generate Hotspots'}
                </button>
            </div>
            {error && <p className="text-center text-red-500 mt-4">{error}</p>}
            {hotspots.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {hotspots.map((spot, index) => (
                        <div key={index} className="bg-slate-50 dark:bg-slate-800 rounded-lg p-5 border-l-4 border-brand-secondary">
                            <h4 className="font-bold text-lg text-slate-800 dark:text-white">{spot.location}</h4>
                            <p className="text-sm font-semibold text-brand-primary my-2">{spot.risk_reward_profile}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-300">{spot.analysis}</p>
                        </div>
                    ))}
                </div>
            )}
            <style>{`.btn-primary { @apply px-6 py-2.5 font-semibold bg-brand-primary text-white rounded-lg hover:bg-opacity-90 disabled:bg-slate-400 flex items-center gap-2; }`}</style>
        </div>
    );
};

// --- Exclusive Deals Component ---
interface ExclusiveDealsProps {
    onOpenDetailModal: (property: Property) => void;
}
const ExclusiveDeals: React.FC<ExclusiveDealsProps> = ({ onOpenDetailModal }) => {
    const deals = useMemo(() => EXCLUSIVE_DEALS.map(deal => ({ ...deal, property: ALL_PROPERTIES.find(p => p.id === deal.propertyId) })).filter((d): d is { property: Property } & ExclusiveDeal => d.property !== undefined), []);
    return (
        <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Exclusive Investment Deals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {deals.map(deal => (
                    <div key={deal.id} className="bg-slate-50 dark:bg-slate-800 rounded-lg shadow-sm p-4 border-t-4 border-brand-primary">
                        <div className="flex gap-4">
                            <img src={deal.property?.images[0]} alt={deal.property?.title} className="w-32 h-32 object-cover rounded-md flex-shrink-0" />
                            <div>
                                <span className="text-xs font-bold bg-brand-primary text-white px-2 py-1 rounded-full">{deal.type}</span>
                                <h4 className="font-bold text-slate-800 dark:text-white mt-2">{deal.property?.title}</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400">${deal.property?.price.toLocaleString()}</p>
                                {deal.type === DealType.AUCTION && deal.auctionEnds && <CountdownTimer endTime={deal.auctionEnds} />}
                            </div>
                        </div>
                         <button onClick={() => onOpenDetailModal(deal.property)} className="w-full mt-4 bg-brand-primary text-white font-semibold py-2 rounded-lg hover:bg-opacity-90 text-sm">View Opportunity</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CountdownTimer: React.FC<{ endTime: number }> = ({ endTime }) => {
    const calculateTimeLeft = () => {
        const diff = endTime - Date.now();
        if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        return {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / 1000 / 60) % 60),
            seconds: Math.floor((diff / 1000) % 60),
        };
    };
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    useEffect(() => {
        const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
        return () => clearInterval(timer);
    }, []);
    return (
        <div className="mt-2 text-sm font-semibold text-red-600">
            Auction ends in: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </div>
    );
};

// --- Cross-Border Analysis Component ---
const CrossBorderAnalysis: React.FC = () => {
    const [countryA, setCountryA] = useState('South Africa');
    const [countryB, setCountryB] = useState('Portugal');
    const [comparison, setComparison] = useState<MarketComparison | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const handleCompare = async () => {
        setIsLoading(true);
        setError('');
        setComparison(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `You are an international real estate investment analyst. Compare ${countryA} and ${countryB} for a foreign investor. Analyze market summary, pros, and cons for each. Return a JSON object.`;
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: { responseMimeType: 'application/json', responseSchema: comparisonSchema }
            });
            setComparison(JSON.parse(response.text.trim()));
        } catch (err) {
            console.error(err);
            setError("Failed to generate comparison. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
         <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Cross-Border Market Analysis</h3>
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <CountrySelector value={countryA} onChange={setCountryA} />
                <span className="text-slate-400">vs.</span>
                <CountrySelector value={countryB} onChange={setCountryB} />
                <button onClick={handleCompare} disabled={isLoading} className="btn-primary flex-shrink-0">
                    {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <CpuChipIcon className="w-5 h-5" />}
                    Compare Markets
                </button>
            </div>
             {error && <p className="text-center text-red-500 mt-4">{error}</p>}
            {comparison && (
                <div className="grid grid-cols-2 gap-6 mt-6">
                    <MarketAnalysisCard market={comparison.country_a} />
                    <MarketAnalysisCard market={comparison.country_b} />
                </div>
            )}
             <style>{`.btn-primary { @apply px-4 py-2.5 text-sm font-semibold bg-brand-primary text-white rounded-lg hover:bg-opacity-90 disabled:bg-slate-400 flex items-center gap-2; }`}</style>
        </div>
    );
};

const countryList = ["South Africa", "Portugal", "United Arab Emirates", "Thailand", "Mexico", "United States"];
const CountrySelector: React.FC<{ value: string, onChange: (val: string) => void }> = ({ value, onChange }) => (
    <select value={value} onChange={e => onChange(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900">
        {countryList.map(c => <option key={c}>{c}</option>)}
    </select>
);

const MarketAnalysisCard: React.FC<{ market: MarketComparison['country_a']}> = ({ market }) => (
    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg space-y-3">
        <h4 className="text-lg font-bold text-slate-800 dark:text-white">{market.name}</h4>
        <p className="text-sm text-slate-600 dark:text-slate-300">{market.summary}</p>
        <div>
            <h5 className="font-semibold text-green-600 text-sm">Pros</h5>
            <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1 mt-1">
                {market.pros.map((pro, i) => <li key={i}>{pro}</li>)}
            </ul>
        </div>
        <div>
            <h5 className="font-semibold text-red-600 text-sm">Cons</h5>
            <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1 mt-1">
                {market.cons.map((con, i) => <li key={i}>{con}</li>)}
            </ul>
        </div>
    </div>
);


export default InvestorGlobalMarketplace;