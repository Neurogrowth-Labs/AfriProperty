import React, { useState } from 'react';
import { CloseIcon } from './icons/NavIcons';
import { LIFESTYLE_QUIZ_QUESTIONS, NEIGHBORHOOD_GUIDES } from '../constants';
import type { NeighborhoodGuide } from '../types';
import { SparklesIcon } from './icons/ActionIcons';

interface LifestyleMatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMatchFound: (neighborhoodId: string) => void;
}

const LifestyleMatcherModal: React.FC<LifestyleMatcherModalProps> = ({ isOpen, onClose, onMatchFound }) => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [match, setMatch] = useState<NeighborhoodGuide | null>(null);

    const handleAnswer = (key: string, value: string) => {
        setAnswers(prev => ({ ...prev, [key]: value }));
        if (step < LIFESTYLE_QUIZ_QUESTIONS.length - 1) {
            setStep(step + 1);
        } else {
            calculateMatch({ ...answers, [key]: value });
            setStep(step + 1);
        }
    };
    
    const calculateMatch = (finalAnswers: Record<string, string>) => {
        let scores: Record<string, number> = {};
        NEIGHBORHOOD_GUIDES.forEach(n => scores[n.id] = 0);

        // Vibe
        if (finalAnswers.vibe === "Family time at the park") {
            scores['suburbia_green_valley'] += 3;
        } else if (finalAnswers.vibe === "Exploring cafes and art galleries") {
            scores['urbanville_arts_district'] += 3;
            scores['soweto_cultural_hub'] += 2;
        } else if (finalAnswers.vibe === "Quiet time at home or in nature") {
            scores['stellenbosch_winelands'] += 3;
        } else if (finalAnswers.vibe === "Going to bars and live music venues") {
            scores['urbanville_arts_district'] += 2;
            scores['soweto_cultural_hub'] += 3;
        }
        
        // Budget
        const budget = finalAnswers.budget;
        if (budget === "Under $1,000") {
            scores['soweto_cultural_hub'] += 3;
        } else if (budget === "$1,000 - $2,500") {
            scores['suburbia_green_valley'] += 2;
            scores['soweto_cultural_hub'] += 2;
        } else if (budget === "$2,500 - $4,000") {
            scores['urbanville_arts_district'] += 3;
        } else if (budget === "$4,000+") {
            scores['stellenbosch_winelands'] += 3;
        }

        const bestMatchId = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
        setMatch(NEIGHBORHOOD_GUIDES.find(n => n.id === bestMatchId) || null);
    };

    const resetQuiz = () => {
        setStep(0);
        setAnswers({});
        setMatch(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[120] p-4" onClick={onClose}>
            <div 
                className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" 
                onClick={e => e.stopPropagation()}
            >
                <header className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-brand-dark dark:text-white">Find Your Perfect Neighborhood</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </header>

                <div className="p-8 min-h-[300px]">
                    {step < LIFESTYLE_QUIZ_QUESTIONS.length ? (
                        <div>
                             <p className="text-sm font-semibold text-brand-primary">Question {step + 1} of {LIFESTYLE_QUIZ_QUESTIONS.length}</p>
                             <h3 className="text-xl font-semibold text-slate-800 dark:text-white mt-2">{LIFESTYLE_QUIZ_QUESTIONS[step].question}</h3>
                             <div className="mt-6 space-y-3">
                                {LIFESTYLE_QUIZ_QUESTIONS[step].options.map(option => (
                                    <button 
                                        key={option}
                                        onClick={() => handleAnswer(LIFESTYLE_QUIZ_QUESTIONS[step].key, option)}
                                        className="w-full text-left p-4 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-brand-light dark:hover:bg-slate-700 hover:border-brand-primary transition-colors font-medium"
                                    >
                                        {option}
                                    </button>
                                ))}
                             </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <SparklesIcon className="w-12 h-12 text-brand-primary mx-auto" />
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-4">We Found Your Match!</h3>
                            {match && (
                                <>
                                    <p className="text-slate-500 dark:text-slate-400 mt-2">Based on your answers, we think you'll love:</p>
                                    <p className="text-4xl font-extrabold text-brand-primary my-4">{match.name}</p>
                                    <div className="flex gap-3 justify-center">
                                        <button onClick={resetQuiz} className="px-6 py-2.5 font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600">Retake Quiz</button>
                                        <button onClick={() => onMatchFound(match.id)} className="px-6 py-2.5 font-semibold bg-brand-primary text-white rounded-lg hover:bg-opacity-90">Explore This Area</button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
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

export default LifestyleMatcherModal;
