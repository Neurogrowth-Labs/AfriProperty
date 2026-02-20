
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import type { TourRequest } from '../types';
import { CloseIcon } from './icons/NavIcons';
import { CpuChipIcon, ClipboardDocumentIcon } from './icons/ActionIcons';

interface AIResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourRequest: TourRequest;
}

const AIResponseModal: React.FC<AIResponseModalProps> = ({ isOpen, onClose, tourRequest }) => {
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setResponse('');
            setCopied(false);
            return;
        };

        const generateResponse = async () => {
            setLoading(true);
            setError(null);

            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                const prompt = `
                    You are an AI assistant for a real estate agent. Your task is to draft a professional, friendly, and helpful email reply to a potential client who has requested a property tour.

                    Property Details: "${tourRequest.propertyTitle}"
                    Client's Name: "${tourRequest.username || 'Valued Client'}"
                    Client's Requested Date: "${tourRequest.date}"
                    Client's Requested Time: "${tourRequest.time}"

                    Instructions for the reply:
                    1. Address the client by their name.
                    2. Acknowledge the request for the specific property.
                    3. Express enthusiasm about showing them the property.
                    4. Suggest 2-3 specific alternative times close to their requested time.
                    5. Ask them to confirm which time works best for them.
                    6. End with a friendly and professional closing.

                    Draft the email content below.
                `;

                const result = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });

                setResponse(result.text);

            } catch (err) {
                console.error("Error generating AI response:", err);
                setError("Failed to generate response. The AI may be busy. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        generateResponse();
    }, [isOpen, tourRequest]);

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(response);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[110] p-4" onClick={onClose}>
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale flex flex-col" 
                onClick={e => e.stopPropagation()}
            >
                <header className="flex justify-between items-center p-5 border-b border-slate-200">
                    <div>
                        <h2 className="text-xl font-bold text-brand-dark flex items-center gap-2">
                            <CpuChipIcon className="w-6 h-6 text-brand-primary" />
                            AI-Generated Reply
                        </h2>
                        <p className="text-sm text-slate-500">For inquiry on "{tourRequest.propertyTitle}"</p>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 transition-colors">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </header>

                <div className="p-6 flex-grow min-h-[300px]">
                    {loading && (
                        <div className="space-y-3 animate-pulse">
                            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                            <div className="h-4 bg-slate-200 rounded"></div>
                            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                            <div className="h-4 bg-slate-200 rounded w-1/2 mt-4"></div>
                        </div>
                    )}
                    {error && <p className="text-red-500">{error}</p>}
                    {!loading && !error && (
                        <textarea
                            readOnly
                            value={response}
                            className="w-full h-full text-sm text-slate-700 bg-slate-50 p-3 rounded-md border-slate-200 focus:ring-0 focus:border-slate-300 resize-none"
                            rows={12}
                        />
                    )}
                </div>

                <footer className="bg-slate-50 p-4 rounded-b-xl flex justify-end">
                    <button 
                        onClick={handleCopyToClipboard}
                        disabled={!response || loading}
                        className="bg-brand-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300 flex items-center gap-2 disabled:bg-slate-400"
                    >
                        <ClipboardDocumentIcon className="w-5 h-5"/>
                        <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
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

export default AIResponseModal;
