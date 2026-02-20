
import React, { useState } from 'react';
import { CloseIcon } from './icons/NavIcons';
import { CalendarIcon, LockClosedIcon } from './icons/ActionIcons';
import type { TourRequest } from '../types';

interface ScheduleTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle: string;
  propertyId: string;
  agentName: string;
  // FIX: Added userId to required onSubmit payload
  userId: string;
  onSubmit: (request: Omit<TourRequest, 'id' | 'username' | 'status' | 'timestamp'>) => Promise<void>;
}

const ScheduleTourModal: React.FC<ScheduleTourModalProps> = ({ isOpen, onClose, propertyTitle, propertyId, agentName, userId, onSubmit }) => {
    const [tourDate, setTourDate] = useState('');
    const [tourTime, setTourTime] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit({
                propertyId,
                propertyTitle,
                // FIX: Pass userId in the onSubmit call
                userId,
                date: tourDate,
                time: tourTime,
            });
            // Success alert is handled in App.tsx typically, but we reset here
            setTourDate('');
            setTourTime('');
        } catch (error) {
            alert("Failed to schedule tour. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] p-4" onClick={onClose}>
            <div 
                className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" 
                onClick={e => e.stopPropagation()}
            >
                <header className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700">
                    <div>
                        <h2 className="text-xl font-bold text-brand-dark dark:text-white">Schedule a Tour</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-xs">{propertyTitle}</p>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </header>
                
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Request a tour with the listing agent, <span className="font-semibold text-brand-dark dark:text-brand-primary">{agentName}</span>.</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="tour-date" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Preferred Date</label>
                                <input type="date" id="tour-date" value={tourDate} onChange={(e) => setTourDate(e.target.value)} required disabled={isSubmitting} className="input-base"/>
                            </div>
                             <div>
                                <label htmlFor="tour-time" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Preferred Time</label>
                                <input type="time" id="tour-time" value={tourTime} onChange={(e) => setTourTime(e.target.value)} required disabled={isSubmitting} className="input-base"/>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name (for agent)</label>
                            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isSubmitting} className="input-base"/>
                        </div>
                        
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contact Email</label>
                            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isSubmitting} className="input-base"/>
                        </div>
                    </div>

                    <footer className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-b-xl flex justify-between items-center border-t dark:border-slate-700">
                        <button 
                            type="button"
                            disabled
                            className="bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 cursor-not-allowed text-sm"
                        >
                           <LockClosedIcon className="w-4 h-4"/>
                           <span>Deposit Not Required</span>
                        </button>
                        <div className="flex space-x-3">
                             <button 
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-lg font-semibold border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-brand-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300 flex items-center space-x-2 disabled:bg-slate-400"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <CalendarIcon className="w-5 h-5"/>
                                )}
                                <span>{isSubmitting ? 'Sending...' : 'Request Tour'}</span>
                            </button>
                        </div>
                    </footer>
                </form>
            </div>
             <style>{`
              .input-base {
                @apply w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-brand-primary focus:border-brand-primary dark:bg-slate-800 dark:text-white disabled:bg-slate-100 dark:disabled:bg-slate-700;
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

export default ScheduleTourModal;
