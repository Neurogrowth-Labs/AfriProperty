
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { Property } from '../types';
import { CloseIcon } from './icons/NavIcons';
import { CpuChipIcon, SparklesIcon, SpeakerWaveIcon, PauseIcon } from './icons/ActionIcons';
import { decode, decodeAudioData } from '../lib/audioUtils';


interface AIImprovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
}

const improvementSchema = {
    type: Type.OBJECT,
    properties: {
        title_suggestion: { type: Type.STRING, description: "A more compelling and SEO-friendly title for the property." },
        description_suggestion: { type: Type.STRING, description: "A rewritten, more engaging property description highlighting key features." },
        pricing_suggestion: { type: Type.STRING, description: "Advice on pricing strategy (e.g., 'Consider a slight reduction to match market...' or 'Highlight value at this price point...')." },
        media_suggestion: { type: Type.STRING, description: "Suggestions for improving photos or media (e.g., 'Add twilight photos...' or 'A video tour would be beneficial...')." },
    },
    required: ["title_suggestion", "description_suggestion", "pricing_suggestion", "media_suggestion"]
};

interface Suggestions {
    title_suggestion: string;
    description_suggestion: string;
    pricing_suggestion: string;
    media_suggestion: string;
}

const SuggestionCard: React.FC<{ title: string; onListen?: () => void; isListening?: boolean; children: React.ReactNode }> = ({ title, onListen, isListening, children }) => (
    <div>
        <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-slate-800 dark:text-white">{title}</h4>
            {onListen && (
                 <button onClick={onListen} className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
                    {isListening ? <PauseIcon className="w-5 h-5"/> : <SpeakerWaveIcon className="w-5 h-5" />}
                 </button>
            )}
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 p-3 rounded-md border border-slate-200 dark:border-slate-600">
            {children}
        </div>
    </div>
);


const AIImprovementModal: React.FC<AIImprovementModalProps> = ({ isOpen, onClose, property }) => {
    const [suggestions, setSuggestions] = useState<Suggestions | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setSuggestions(null);
            return;
        }

        const generateSuggestions = async () => {
            setLoading(true);
            setError(null);

            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                const prompt = `
                    You are an expert real estate marketing AI. Analyze this underperforming property listing and provide actionable suggestions to improve its performance.

                    Property Details:
                    - Title: "${property.title}"
                    - Description: "${property.description}"
                    - Type: ${property.propertyType}
                    - Price: $${property.price.toLocaleString()}
                    - Location: ${property.address.city}
                    - Beds: ${property.details.beds}, Baths: ${property.details.baths}
                    - Amenities: ${property.amenities.join(', ')}

                    Based on these details, provide a JSON object with specific suggestions for the title, description, pricing, and media.
                `;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: {
                        responseMimeType: 'application/json',
                        responseSchema: improvementSchema,
                    }
                });
                
                const jsonText = response.text.trim();
                setSuggestions(JSON.parse(jsonText));

            } catch (err) {
                console.error("Error generating suggestions:", err);
                setError("Failed to generate suggestions. The AI may be busy. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        generateSuggestions();

    }, [isOpen, property]);
    
    const handleListen = async (text: string) => {
        if (isListening) {
             // We'd need to manage audio contexts to pause/resume, for now just stop
            setIsListening(false);
            return;
        }
        setIsListening(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-preview-tts',
                contents: [{ parts: [{ text }] }],
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
                    },
                },
            });
            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
                const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
                const source = outputAudioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputAudioContext.destination);
                source.start();
                source.onended = () => setIsListening(false);
            } else {
                setIsListening(false);
            }
        } catch(e) {
            console.error(e);
            setIsListening(false);
        }
    }


    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[110] p-4" onClick={onClose}>
            <div 
                className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale flex flex-col" 
                onClick={e => e.stopPropagation()}
            >
                <header className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700">
                    <div>
                        <h2 className="text-xl font-bold text-brand-dark dark:text-white flex items-center gap-2">
                            <CpuChipIcon className="w-6 h-6 text-brand-primary" />
                            AI Listing Improvement
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">Suggestions for "{property.title}"</p>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </header>

                <div className="p-6 flex-grow space-y-4 max-h-[60vh] overflow-y-auto">
                    {loading && (
                        <div className="space-y-4 animate-pulse">
                            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
                            <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
                            <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        </div>
                    )}
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    {suggestions && (
                        <>
                            <SuggestionCard title="Title Suggestion">
                                <p className="font-semibold">{suggestions.title_suggestion}</p>
                            </SuggestionCard>
                             <SuggestionCard title="Description Suggestion" onListen={() => handleListen(suggestions.description_suggestion)} isListening={isListening}>
                                <p>{suggestions.description_suggestion}</p>
                            </SuggestionCard>
                             <SuggestionCard title="Pricing Suggestion">
                                <p>{suggestions.pricing_suggestion}</p>
                            </SuggestionCard>
                             <SuggestionCard title="Media Suggestion">
                                <p>{suggestions.media_suggestion}</p>
                            </SuggestionCard>
                        </>
                    )}
                </div>

                <footer className="bg-slate-50 dark:bg-slate-900 p-4 rounded-b-xl flex justify-end">
                    <button 
                        onClick={onClose}
                        className="bg-brand-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-opacity-90"
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

export default AIImprovementModal;