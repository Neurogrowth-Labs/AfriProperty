
import React, { useState, useMemo, useEffect } from 'react';
import type { ServiceProvider } from '../types';
import { SERVICE_PROVIDERS } from '../constants';
import { CloseIcon } from './icons/NavIcons';
import { SearchIcon } from './icons/SearchIcons';
import { StarIcon, EnvelopeIcon, PhoneIcon, ChatBubbleLeftRightIcon } from './icons/ActionIcons';
import { WhatsAppIcon } from './icons/SocialIcons';

interface ProviderServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContactProvider: (name: string) => void;
  initialServiceFilter?: string;
}

const ProviderCard: React.FC<{ provider: ServiceProvider; onContact: (name: string) => void; }> = ({ provider, onContact }) => {
    const whatsappNumber = provider.phone.replace(/\D/g, '');

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-4 flex flex-col items-center text-center">
            <img src={provider.image} alt={provider.name} className="w-20 h-20 rounded-full mb-3" />
            <h4 className="font-bold text-slate-800 dark:text-white">{provider.name}</h4>
            <p className="text-sm font-semibold text-brand-primary mb-2">{provider.service}</p>
            <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                <StarIcon className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-slate-700 dark:text-slate-200">{provider.rating}</span>
                <span>({provider.reviewCount} reviews)</span>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 w-full flex justify-center gap-2">
                <a href={`mailto:${provider.email}`} title="Email" className="contact-btn"><EnvelopeIcon className="w-5 h-5"/></a>
                <a href={`tel:${provider.phone}`} title="Call" className="contact-btn"><PhoneIcon className="w-5 h-5"/></a>
                <button onClick={() => onContact(provider.name)} title="Message" className="contact-btn"><ChatBubbleLeftRightIcon className="w-5 h-5"/></button>
                <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" title="WhatsApp" className="contact-btn"><WhatsAppIcon className="w-5 h-5"/></a>
            </div>
        </div>
    );
};

const ProviderServicesModal: React.FC<ProviderServicesModalProps> = ({ isOpen, onClose, onContactProvider, initialServiceFilter }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedService, setSelectedService] = useState(initialServiceFilter || 'All');

    const allServices = useMemo(() => ['All', ...new Set(SERVICE_PROVIDERS.map(p => p.service))], []);

    useEffect(() => {
        if (isOpen) {
            setSelectedService(initialServiceFilter || 'All');
            setSearchTerm('');
        }
    }, [isOpen, initialServiceFilter]);

    const filteredProviders = useMemo(() => {
        return SERVICE_PROVIDERS.filter(provider => {
            const matchesService = selectedService === 'All' || provider.service === selectedService;
            const matchesSearch = searchTerm === '' || 
                provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                provider.service.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesService && matchesSearch;
        });
    }, [searchTerm, selectedService]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[110] p-4" onClick={onClose}>
            <div 
                className="bg-slate-50 dark:bg-brand-dark rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" 
                onClick={e => e.stopPropagation()}
            >
                <header className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-brand-dark dark:text-white">Find a Professional</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Browse our network of trusted service providers.</p>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </header>

                <div className="p-4 flex-shrink-0 border-b border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name or service..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-brand-primary focus:border-brand-primary bg-white dark:bg-slate-900"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {allServices.map(service => (
                            <button 
                                key={service}
                                onClick={() => setSelectedService(service)}
                                className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-colors ${selectedService === service ? 'bg-brand-primary text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                            >
                                {service}
                            </button>
                        ))}
                    </div>
                </div>
                
                <main className="flex-grow overflow-y-auto p-6">
                    {filteredProviders.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProviders.map(provider => (
                                <ProviderCard key={provider.id} provider={provider} onContact={onContactProvider} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-slate-500 dark:text-slate-400">No service providers found for your search.</p>
                        </div>
                    )}
                </main>
            </div>
            <style>{`
                .contact-btn {
                    @apply p-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-brand-primary dark:hover:text-brand-gold transition-colors;
                }
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

export default ProviderServicesModal;