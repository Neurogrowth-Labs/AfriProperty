

import React from 'react';
import type { Property } from '../types';
import { CloseIcon } from './icons/NavIcons';
import { BedIcon, BathIcon, AreaIcon } from './icons/PropertyIcons';
import { CheckBadgeIcon } from './icons/ActionIcons';
import { useCurrency } from '../contexts/CurrencyContext';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
}

const CompareModal: React.FC<CompareModalProps> = ({ isOpen, onClose, properties }) => {
  const { formatCurrency } = useCurrency();
  if (!isOpen) return null;
  
  const allAmenities = [...new Set(properties.flatMap(p => p.amenities))].sort();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100] p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" 
        onClick={e => e.stopPropagation()}
      >
        <header className="relative flex justify-center sm:justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <button onClick={onClose} className="sm:hidden absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-brand-primary hover:underline">&larr; Back</button>
          <h2 className="text-xl font-bold text-brand-dark dark:text-white">Compare Properties</h2>
          <button onClick={onClose} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:block">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-grow overflow-auto">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left min-w-[800px]">
                    <thead className="sticky top-0 bg-white dark:bg-slate-900 shadow-sm z-10">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 w-[15%]">Feature</th>
                            {properties.map(p => (
                                <th key={p.id} className="p-4 border-l dark:border-slate-700 w-[21.25%]">
                                    <div className="flex flex-col">
                                        <img src={p.images[0]} alt={p.title} className="w-full h-32 object-cover rounded-md mb-2"/>
                                        <h3 className="font-bold text-brand-dark dark:text-white truncate">{p.title}</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs truncate">{p.address.street}, {p.address.city}</p>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        <tr className="bg-slate-50 dark:bg-slate-800/50">
                            <td className="p-4 font-semibold">Price</td>
                            {properties.map(p => <td key={p.id} className="p-4 border-l dark:border-slate-700 font-bold text-brand-dark dark:text-white text-lg">{p.listingType === 'For Rent' ? `${formatCurrency(p.price)}/mo` : formatCurrency(p.price)}</td>)}
                        </tr>
                        <tr>
                            <td className="p-4 font-semibold">Details</td>
                            {properties.map(p => (
                                <td key={p.id} className="p-4 border-l dark:border-slate-700 space-y-2">
                                    <div className="flex items-center gap-2"><BedIcon className="w-4 h-4 text-slate-400"/><span>{p.details.beds} Beds</span></div>
                                    <div className="flex items-center gap-2"><BathIcon className="w-4 h-4 text-slate-400"/><span>{p.details.baths} Baths</span></div>
                                    <div className="flex items-center gap-2"><AreaIcon className="w-4 h-4 text-slate-400"/><span>{p.details.area.toLocaleString()} sqft</span></div>
                                </td>
                            ))}
                        </tr>
                        <tr className="bg-slate-50 dark:bg-slate-800/50">
                            <td className="p-4 font-semibold">Listing / Type</td>
                            {properties.map(p => <td key={p.id} className="p-4 border-l dark:border-slate-700">{p.listingType} / {p.propertyType}</td>)}
                        </tr>
                        <tr>
                            <td colSpan={properties.length + 1} className="p-3 bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-200">Amenities</td>
                        </tr>
                        {allAmenities.map(amenity => (
                            <tr key={amenity}>
                                <td className="p-4 font-semibold">{amenity}</td>
                                {properties.map(p => (
                                    <td key={p.id} className="p-4 border-l dark:border-slate-700 text-center">
                                        {p.amenities.includes(amenity) ? (
                                            <CheckBadgeIcon className="w-6 h-6 text-green-500 mx-auto" />
                                        ) : (
                                            <span className="text-slate-400">-</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={properties.length + 1} className="p-3 bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-200">Agent Info</td>
                        </tr>
                        <tr className="bg-slate-50 dark:bg-slate-800/50">
                            <td className="p-4 font-semibold">Agent Name</td>
                            {properties.map(p => <td key={p.id} className="p-4 border-l dark:border-slate-700">{p.agent.name} {p.agent.verified && <span title="Verified Agent">✅</span>}</td>)}
                        </tr>
                        <tr>
                            <td className="p-4 font-semibold">Agent Rating</td>
                            {properties.map(p => <td key={p.id} className="p-4 border-l dark:border-slate-700">⭐ {p.agent.rating} ({p.agent.reviewCount} reviews)</td>)}
                        </tr>
                    </tbody>
                </table>
            </div>
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

export default CompareModal;