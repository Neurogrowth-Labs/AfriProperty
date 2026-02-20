import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { TrendingUpIcon } from './icons/NavIcons';
import { CpuChipIcon } from './icons/ActionIcons';
import { useTranslations } from '../contexts/LanguageContext';

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        market_summary: { type: Type.STRING },
        key_trends: { type: Type.ARRAY, items: { type: Type.STRING } },
        investment_outlook: { type: Type.STRING }
    },
    required: ["market_summary", "key_trends", "investment_outlook"]
};

const MarketInsights: React.FC = () => {
  const [city, setCity] = useState('');
  const [report, setReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeepAnalysis, setIsDeepAnalysis] = useState(false);
  const { t } = useTranslations();

  const handleGenerateReport = async () => {
      if (!city.trim()) return;
      setLoading(true);
      setError(null);
      setReport(null);

      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
          const prompt = `Generate a concise real estate market insights report for ${city}. Focus on current residential trends. Provide a market summary, 3-4 key bullet-point trends, and a brief investment outlook.`;

          const model = isDeepAnalysis ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
          const config: any = {
              responseMimeType: 'application/json',
              responseSchema: responseSchema,
          };
          
          if (isDeepAnalysis) {
              config.thinkingConfig = { thinkingBudget: 32768 };
          }

          const response = await ai.models.generateContent({
              model,
              contents: prompt,
              config
          });

          const jsonText = response.text.trim();
          setReport(JSON.parse(jsonText));

      } catch (err) {
          console.error("Error generating market report:", err);
          setError(t.marketInsights.error);
      } finally {
          setLoading(false);
      }
  };

  return (
    <section id="market-insights" className="py-24 bg-white dark:bg-brand-dark">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 text-brand-primary font-bold text-xs uppercase tracking-widest mb-4">
                <CpuChipIcon className="w-4 h-4" /> AI Analytics
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-brand-dark dark:text-white tracking-tight">{t.marketInsights.title}</h2>
            <p className="text-center text-slate-500 dark:text-slate-400 mt-4 text-lg max-w-2xl mx-auto">{t.marketInsights.subtitle}</p>
        </div>
        
        <div className="max-w-2xl mx-auto mb-16">
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input 
                        type="text" 
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder={t.marketInsights.placeholder}
                        className="w-full px-6 py-4 border-2 border-transparent bg-white dark:bg-slate-800 rounded-2xl focus:border-brand-primary focus:ring-0 dark:text-white text-lg font-medium shadow-inner"
                    />
                    <button onClick={handleGenerateReport} disabled={loading} className="w-full sm:w-auto bg-brand-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-brand-dark transition-all disabled:bg-slate-400 flex items-center justify-center space-x-2 h-[60px] sm:w-56 shadow-lg shadow-brand-primary/30">
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                            <TrendingUpIcon className="w-6 h-6"/>
                            <span>Analyze</span>
                            </>
                        )}
                    </button>
                </div>
                <div className="mt-4 flex justify-center">
                    <label className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-300 cursor-pointer">
                        <input type="checkbox" checked={isDeepAnalysis} onChange={(e) => setIsDeepAnalysis(e.target.checked)} className="h-5 w-5 rounded-lg border-slate-300 text-brand-primary focus:ring-brand-primary"/>
                        Deep Market Reasoning
                    </label>
                </div>
            </div>
        </div>
        
        {loading && (
             <div className="max-w-3xl mx-auto bg-slate-50 dark:bg-slate-800 border-2 border-brand-primary/10 rounded-[2.5rem] p-10 animate-pulse">
                <div className="h-8 bg-slate-200 dark:bg-slate-600 rounded-full w-1/2 mb-8"></div>
                <div className="space-y-4">
                    <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded-full"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded-full w-5/6"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded-full w-4/6"></div>
                </div>
                <div className="h-6 bg-slate-200 dark:bg-slate-600 rounded-full w-1/3 my-10"></div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-slate-200 dark:bg-slate-600 rounded-2xl"></div>
                    <div className="h-20 bg-slate-200 dark:bg-slate-600 rounded-2xl"></div>
                </div>
             </div>
        )}
        
        {error && <p className="text-center text-brand-accent font-bold text-lg">{error}</p>}

        {report && (
            <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 border-2 border-brand-primary/20 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-brand-primary/5 transform transition-all duration-700 opacity-0 animate-fade-in-up">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h3 className="text-3xl font-black text-brand-dark dark:text-white mb-2">{t.marketInsights.reportTitle.replace('{{city}}', city)}</h3>
                        <p className="text-brand-primary font-bold text-sm tracking-widest uppercase">Proprietary AI Forecast</p>
                    </div>
                    <div className="bg-brand-primary/10 p-4 rounded-3xl">
                        <TrendingUpIcon className="w-10 h-10 text-brand-primary" />
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl mb-10 border border-slate-100 dark:border-slate-700">
                    <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed italic">"{report.market_summary}"</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-10">
                    <div>
                        <h4 className="font-black text-brand-dark dark:text-white mb-4 uppercase tracking-widest text-sm border-b-2 border-brand-secondary pb-2 inline-block">{t.marketInsights.keyTrends}</h4>
                        <ul className="space-y-4">
                            {report.key_trends.map((trend: string, i: number) => (
                                <li key={i} className="flex gap-3 text-slate-600 dark:text-slate-300 font-medium">
                                    <span className="w-6 h-6 rounded-full bg-brand-secondary text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">{i+1}</span>
                                    {trend}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-brand-primary/5 p-8 rounded-[2rem] border border-brand-primary/10">
                        <h4 className="font-black text-brand-dark dark:text-white mb-4 uppercase tracking-widest text-sm">{t.marketInsights.investmentOutlook}</h4>
                        <p className="text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">{report.investment_outlook}</p>
                    </div>
                </div>
            </div>
        )}

      </div>
       <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>
    </section>
  );
};

export default MarketInsights;