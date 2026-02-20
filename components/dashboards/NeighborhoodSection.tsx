import React from 'react';
import { NEIGHBORHOOD_GUIDES } from '../constants';
import { useTranslations } from '../contexts/LanguageContext';
import { SparklesIcon } from './icons/ActionIcons';

interface NeighborhoodSectionProps {
    onOpenExplorer: (neighborhoodId?: string) => void;
}

const NeighborhoodSection: React.FC<NeighborhoodSectionProps> = ({ onOpenExplorer }) => {
    const { t } = useTranslations();

    return (
        <section id="neighborhoods" className="py-12 lg:py-16 bg-white dark:bg-brand-dark">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-brand-dark dark:text-white">{t.neighborhoodGuides.title}</h2>
                    <p className="text-center text-slate-500 dark:text-slate-400 mt-4 max-w-2xl mx-auto">
                        {t.neighborhoodGuides.subtitle}
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {NEIGHBORHOOD_GUIDES.map((guide) => (
                        <div key={guide.id} className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                            <img src={guide.image} alt={guide.name} className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-6 text-white">
                                <h3 className="text-2xl font-bold mb-1">{guide.name}</h3>
                                <p className="text-sm opacity-90">{guide.description}</p>
                            </div>
                            <button onClick={() => onOpenExplorer(guide.id)} className="absolute inset-0" aria-label={`Learn more about ${guide.name}`}></button>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-12">
                    <button onClick={() => onOpenExplorer()} className="bg-brand-primary text-white font-semibold px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto">
                        <SparklesIcon className="w-5 h-5" />
                        Find Your Perfect Neighborhood
                    </button>
                </div>
            </div>
        </section>
    );
};

export default NeighborhoodSection;