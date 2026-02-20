import React, { useState } from 'react';
import { SparklesIcon } from './icons/SearchIcons';
import { useTranslations } from '../contexts/LanguageContext';
import { PropertyType, ListingType } from '../types';
import type { SearchFilters } from '../types';
import { BuildingStorefrontIcon, MapPinIcon, TruckIcon } from '@heroicons/react/24/outline';
import { WellnessIcon } from './icons/CategoryIcons';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isSearchingAI: boolean;
  filters: SearchFilters;
  onFilterChange: (key: keyof SearchFilters, value: any) => void;
}

type SearchTab = 'buy_rent' | 'stays' | 'transport' | 'wellness';

const TabButton: React.FC<{
    label: string;
    icon: React.ElementType;
    isActive: boolean;
    onClick: () => void;
    color: string;
}> = ({ label, icon: Icon, isActive, onClick, color }) => (
    <button
        type="button"
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-4 text-sm font-black rounded-t-2xl transition-all flex-shrink-0 ${
            isActive
                ? `bg-white dark:bg-slate-800 ${color} shadow-[0_-4px_10px_rgba(0,0,0,0.1)]`
                : 'text-white/70 hover:text-white hover:bg-white/10'
        }`}
    >
        <Icon className="w-5 h-5" />
        <span className="uppercase tracking-widest">{label}</span>
    </button>
);


const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isSearchingAI, filters, onFilterChange }) => {
    const [query, setQuery] = useState('');
    const [activeTab, setActiveTab] = useState<SearchTab>('buy_rent');
    const { t } = useTranslations();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query);
    };
    
    const setTabAndPropertyType = (tab: SearchTab, propType: PropertyType) => {
        setActiveTab(tab);
        onFilterChange('propertyType', propType);
    };

    const renderFilters = () => {
        switch (activeTab) {
            case 'stays':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                        <input type="text" placeholder="Location: e.g. Cape Town" name="location" value={filters.location} onChange={(e) => onFilterChange('location', e.target.value)} className="input-field md:col-span-2" />
                        <input type="date" name="checkIn" value={filters.checkIn || ''} onChange={(e) => onFilterChange('checkIn', e.target.value)} className="input-field" title="Check-in Date" />
                        <input type="date" name="checkOut" value={filters.checkOut || ''} onChange={(e) => onFilterChange('checkOut', e.target.value)} className="input-field" title="Check-out Date" />
                        <input type="number" placeholder="Guests" name="guests" min="1" value={filters.guests || ''} onChange={(e) => onFilterChange('guests', Number(e.target.value))} className="input-field" />
                        <input type="number" placeholder="Max Price" name="priceMax" value={filters.priceMax === 10000000 ? '' : filters.priceMax} onChange={(e) => onFilterChange('priceMax', e.target.value === '' ? 10000000 : Number(e.target.value))} className="input-field" />
                    </div>
                );
            case 'transport':
                 return (
                     <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        <input type="text" placeholder="Pick-up location" name="location" value={filters.location} onChange={(e) => onFilterChange('location', e.target.value)} className="input-field md:col-span-2" />
                        <input type="date" name="checkIn" value={filters.checkIn || ''} onChange={(e) => onFilterChange('checkIn', e.target.value)} className="input-field" title="Pick-up Date" />
                        <select name="vehicleType" value={filters.vehicleType || ''} onChange={(e) => onFilterChange('vehicleType', e.target.value)} className="input-field">
                            <option value="">Any Vehicle</option>
                            <option>Sedan</option>
                            <option>SUV</option>
                            <option>Van</option>
                            <option>Luxury</option>
                        </select>
                        <input type="number" placeholder="Max Price" name="priceMax" value={filters.priceMax === 10000000 ? '' : filters.priceMax} onChange={(e) => onFilterChange('priceMax', e.target.value === '' ? 10000000 : Number(e.target.value))} className="input-field" />
                    </div>
                );
             case 'wellness':
                return (
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <input type="text" placeholder="Destination" name="location" value={filters.location} onChange={(e) => onFilterChange('location', e.target.value)} className="input-field md:col-span-2" />
                        <input type="date" name="checkIn" value={filters.checkIn || ''} onChange={(e) => onFilterChange('checkIn', e.target.value)} className="input-field" title="Start Date" />
                        <input type="number" placeholder="Max Price" name="priceMax" value={filters.priceMax === 10000000 ? '' : filters.priceMax} onChange={(e) => onFilterChange('priceMax', e.target.value === '' ? 10000000 : Number(e.target.value))} className="input-field" />
                    </div>
                );
            case 'buy_rent':
            default:
                return (
                     <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                        <input type="text" placeholder="Location, City..." name="location" value={filters.location} onChange={(e) => onFilterChange('location', e.target.value)} className="input-field col-span-2" />
                        <select name="listingType" value={filters.listingType} onChange={(e) => onFilterChange('listingType', e.target.value)} className="input-field">
                            <option value={ListingType.ALL}>For Sale or Rent</option>
                            <option value={ListingType.SALE}>For Sale</option>
                            <option value={ListingType.RENT}>For Rent</option>
                        </select>
                        <input type="number" placeholder="Min Price" name="priceMin" value={filters.priceMin || ''} onChange={(e) => onFilterChange('priceMin', e.target.value === '' ? 0 : Number(e.target.value))} className="input-field" />
                        <input type="number" placeholder="Max Price" name="priceMax" value={filters.priceMax === 10000000 ? '' : filters.priceMax} onChange={(e) => onFilterChange('priceMax', e.target.value === '' ? 10000000 : Number(e.target.value))} className="input-field" />
                        <div className="flex items-center gap-2 input-field">
                            <input type="number" name="bedrooms" min="0" value={filters.bedrooms || ''} onChange={(e) => onFilterChange('bedrooms', Number(e.target.value))} className="w-full bg-transparent focus:outline-none" placeholder="Beds"/>
                            <span className="text-slate-400 font-bold text-xs uppercase">Beds</span>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="bg-white/10 dark:bg-slate-800/10 backdrop-blur-2xl p-3 rounded-[2rem] shadow-2xl w-full border border-white/20">
            <div className="bg-transparent">
                <div className="overflow-x-auto no-scrollbar">
                    <div className="flex items-center px-2 whitespace-nowrap">
                        <TabButton label="Homes" icon={BuildingStorefrontIcon} isActive={activeTab === 'buy_rent'} onClick={() => setTabAndPropertyType('buy_rent', PropertyType.ALL)} color="text-brand-primary" />
                        <TabButton label="Stays" icon={MapPinIcon} isActive={activeTab === 'stays'} onClick={() => setTabAndPropertyType('stays', PropertyType.SHORT_TERM_RENTAL)} color="text-brand-secondary" />
                        <TabButton label="Transport" icon={TruckIcon} isActive={activeTab === 'transport'} onClick={() => setTabAndPropertyType('transport', PropertyType.TRANSPORT)} color="text-brand-accent" />
                        <TabButton label="Wellness" icon={WellnessIcon} isActive={activeTab === 'wellness'} onClick={() => setTabAndPropertyType('wellness', PropertyType.WELLNESS)} color="text-brand-gold" />
                    </div>
                </div>
                <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
                    {renderFilters()}
                    <form onSubmit={handleSearch} className="mt-4">
                        <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <div className="relative flex-grow">
                                <SparklesIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-primary pointer-events-none z-10" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="...or find a property with AI Magic"
                                    className="w-full pl-12 pr-4 py-4 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary dark:bg-slate-700 dark:text-white placeholder:text-slate-400 font-medium"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSearchingAI}
                                className="bg-brand-primary text-white font-black uppercase tracking-widest px-10 py-4 rounded-xl hover:bg-brand-dark transition-all disabled:bg-slate-400 shadow-lg shadow-brand-primary/20 transform hover:scale-105 active:scale-95"
                            >
                                {isSearchingAI ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                                ) : "Search"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
             <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .input-field { @apply w-full px-4 py-3.5 text-base border border-slate-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-primary dark:bg-slate-700 dark:text-white placeholder:text-slate-400 font-medium transition-all hover:border-brand-primary/30 bg-slate-50 dark:bg-slate-900/30; }
             `}</style>
        </div>
    );
};

export default SearchBar;