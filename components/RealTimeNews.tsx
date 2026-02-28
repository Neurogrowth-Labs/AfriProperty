
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { CpuChipIcon } from './icons/ActionIcons';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

interface GroundingChunk {
  /* Updated to match GroundingChunkWeb from @google/genai */
  web?: {
    uri?: string;
    title?: string;
  };
}

const RealTimeNews: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{ text: string; sources: GroundingChunk[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
      if (!query.trim()) return;
      setLoading(true);
      setError(null);
      setResult(null);

      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
          
          const response = await ai.models.generateContent({
              model: "gemini-3-flash-preview",
              contents: query,
              config: {
                 tools: [{googleSearch: {}}],
              },
          });
          
          const text = response.text || '';
          const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

          setResult({ text, sources });

      } catch (err) {
          console.error("Error with Search Grounding:", err);
          setError("Sorry, I couldn't fetch real-time information right now. Please try again later.");
      } finally {
          setLoading(false);
      }
  };

  return (
    <section id="real-time-news" className="py-12 lg:py-16 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-brand-dark dark:text-white">Real-Time News & Trends</h2>
            <p className="text-center text-slate-500 dark:text-slate-400 mt-4 max-w-2xl mx-auto">Ask about current market trends, recent policy changes, or news affecting the real estate sector, powered by Google Search.</p>
        </div>
        
        <div className="max-w-xl mx-auto flex items-center gap-2 mb-12">
            <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., 'Latest mortgage rate trends in South Africa'"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary dark:bg-slate-800 dark:border-slate-600 dark:text-white"
            />
            <button onClick={handleSearch} disabled={loading} className="bg-brand-primary text-white px-5 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all disabled:bg-slate-400 flex items-center justify-center space-x-2 h-[50px] w-48">
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <>
                    <CpuChipIcon className="w-5 h-5"/>
                    <span>Ask AI</span>
                    </>
                )}
            </button>
        </div>
        
        {loading && (
             <div className="max-w-3xl mx-auto bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl p-6 animate-pulse">
                <div className="space-y-3">
                    <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-5/6"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-1/2 mt-4"></div>
                </div>
             </div>
        )}
        
        {error && <p className="text-center text-red-500">{error}</p>}

        {result && (
            <div className="max-w-3xl mx-auto bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl p-8 transform transition-all duration-500 opacity-0 animate-fade-in-up">
                <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>{result.text}</ReactMarkdown>
                </div>
                {result.sources.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <h4 className="font-semibold text-sm text-slate-600 dark:text-slate-300 mb-2">Sources:</h4>
                        <ul className="list-decimal list-inside space-y-1">
                            {result.sources.map((source, index) => source.web && (
                                <li key={index} className="text-xs">
                                    <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">
                                        {source.web.title || source.web.uri}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        )}

      </div>
       <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.5s ease-out forwards;
          }
          .prose h2 { @apply text-2xl font-bold mb-4 mt-6; }
          .prose p { @apply my-4 leading-relaxed; }
          .prose ul { @apply list-disc list-inside my-4; }
          .prose li { @apply my-2; }
        `}</style>
    </section>
  );
};

export default RealTimeNews;
