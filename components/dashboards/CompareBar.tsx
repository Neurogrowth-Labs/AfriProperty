
import React, { useState, useEffect } from 'react';
import type { Property } from '../types';
import { CloseIcon } from './icons/NavIcons';
import { Square2StackIcon } from './icons/ActionIcons';

interface CompareBarProps {
  properties: Property[];
  onCompare: () => void;
  onClear: () => void;
  onRemove: (property: Property) => void;
}

const CompareBar: React.FC<CompareBarProps> = ({ properties, onCompare, onClear, onRemove }) => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('compareOnboardingSeen');
    if (!hasSeenOnboarding && properties.length > 0) {
        setShowOnboarding(true);
        const timer = setTimeout(() => {
            setShowOnboarding(false);
            localStorage.setItem('compareOnboardingSeen', 'true');
        }, 5000);
        return () => clearTimeout(timer);
    }
  }, [properties.length]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 transform transition-transform duration-300 animate-slide-up">
      <div className="container mx-auto bg-brand-dark text-white rounded-xl shadow-2xl p-4 flex flex-col sm:flex-row items-center justify-between relative gap-4">
        {showOnboarding && (
            <div className="absolute -top-20 right-4 bg-white text-brand-dark p-3 rounded-lg shadow-lg text-sm max-w-xs animate-fade-in-up after:absolute after:top-full after:right-8 after:border-8 after:border-transparent after:border-t-white">
                <p>Nice! Add at least two properties to compare them side-by-side.</p>
            </div>
        )}
        <div className="flex items-center gap-4 flex-grow min-w-0 w-full">
          <div className="hidden sm:block">
            <Square2StackIcon className="w-8 h-8 text-brand-gold" />
          </div>
          <div className="flex-grow min-w-0">
            <h3 className="font-bold text-lg">Compare Properties ({properties.length}/4)</h3>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
                {properties.map(p => (
                    <div key={p.id} className="relative group flex-shrink-0">
                        <img src={p.images[0]} alt={p.title} className="w-12 h-12 rounded-md object-cover"/>
                        <button onClick={() => onRemove(p)} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <CloseIcon className="w-3 h-3" />
                        </button>
                    </div>
                ))}
                {[...Array(4 - properties.length)].map((_, i) => (
                    <div key={i} className="w-12 h-12 rounded-md bg-slate-700 border-2 border-dashed border-slate-500 hidden md:block"></div>
                ))}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3 flex-shrink-0 w-full sm:w-auto">
          <button onClick={onClear} className="flex-1 sm:flex-none bg-slate-600 hover:bg-slate-500 text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">Clear</button>
          <button 
            onClick={onCompare} 
            disabled={properties.length < 2}
            className="flex-1 sm:flex-none bg-brand-primary hover:bg-opacity-90 text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-300 disabled:bg-slate-500 disabled:cursor-not-allowed"
          >
            Compare
          </button>
        </div>
      </div>
       <style>{`
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-up {
            animation: slideUp 0.3s ease-out forwards;
          }
          .animate-fade-in-up {
              animation: fadeInUp 0.5s ease-out forwards;
          }
        `}</style>
    </div>
  );
};

export default CompareBar;
