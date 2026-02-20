
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { Property } from '../../../types';
import { SparklesIcon } from '../../icons/ActionIcons';

interface AIPortfolioSummaryProps {
    userProperties: Property[];
}

const AIPortfolioSummary: React.FC<AIPortfolioSummaryProps> = ({ userProperties }) => {
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerateSummary = async () => {
        setIsLoading(true);
        setError('');
        setSummary('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const simplifiedPortfolio = userProperties.map(p => ({
                type: p.propertyType,
                location: p.address.city,
                current_value: p.price,
                purchase_price: p.purchasePrice,
                rental_income_monthly: p.listingType === 'For Rent' ? p.price : 0
            }));

            const prompt = `You are a concise AI real estate portfolio analyst. Based on the following JSON data of an investor's properties, provide a 3-4 sentence summary of their portfolio's health. Highlight its main strength (e.g., strong cash flow, high appreciation) and a potential area for improvement or a key opportunity (e.g., diversification, refinancing). Speak directly to the investor in a professional, encouraging tone.

            Portfolio Data:
            ${JSON.stringify(simplifiedPortfolio, null, 2)}
            `;

            const result = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setSummary(result.text);

        } catch (err) {
            console.error(err);
            setError('Failed to generate summary. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">AI Portfolio Summary</h3>
                <button onClick={handleGenerateSummary} disabled={isLoading} className="px-4 py-1.5 text-xs font-semibold bg-brand-primary text-white rounded-lg hover:bg-opacity-90 disabled:bg-slate-400 flex items-center gap-1.5">
                    {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <SparklesIcon className="w-4 h-4"/>}
                    {isLoading ? 'Analyzing...' : 'Generate Summary'}
                </button>
            </div>
            
            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="text-sm text-slate-600 dark:text-slate-300 bg-brand-light dark:bg-slate-700/50 p-4 rounded-lg min-h-[80px]">
                {summary ? (
                    <p>{summary}</p>
                ) : (
                    <p className="text-slate-400">Click "Generate Summary" for an AI-powered analysis of your portfolio.</p>
                )}
            </div>
        </div>
    );
};

export default AIPortfolioSummary;
