import React, { useState } from 'react';
import { CloseIcon } from './icons/NavIcons';
import { ClipboardDocumentIcon, CheckBadgeIcon } from './icons/ActionIcons';

interface ShareAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const timeSlots = [
    "09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM",
    "01:00 PM - 02:00 PM", "02:00 PM - 03:00 PM", "03:00 PM - 04:00 PM",
];

const ShareAvailabilityModal: React.FC<ShareAvailabilityModalProps> = ({ isOpen, onClose }) => {
    const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
    const [generatedLink, setGeneratedLink] = useState('');
    const [copied, setCopied] = useState(false);

    const handleSlotToggle = (slot: string) => {
        setSelectedSlots(prev => {
            const newSet = new Set(prev);
            if (newSet.has(slot)) {
                newSet.delete(slot);
            } else {
                newSet.add(slot);
            }
            return newSet;
        });
    };

    const handleGenerateLink = () => {
        if (selectedSlots.size > 0) {
            const mockId = Math.random().toString(36).substring(2, 8);
            setGeneratedLink(`https://afriproperty.co.za/book/jane-doe/${mockId}`);
        }
    };
    
    const handleCopyToClipboard = () => {
        if (!generatedLink) return;
        navigator.clipboard.writeText(generatedLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[110] p-4" onClick={onClose}>
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" 
                onClick={e => e.stopPropagation()}
            >
                <header className="flex justify-between items-center p-5 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-brand-dark">Share Availability for Showings</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 transition-colors">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </header>
                
                <div className="p-6">
                    <p className="text-sm text-slate-600 mb-4">Select the time slots you're available for showings. A shareable link will be generated for clients to book a time that works for them.</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {timeSlots.map(slot => (
                            <label key={slot} className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${selectedSlots.has(slot) ? 'bg-brand-light border-brand-primary' : 'bg-white border-slate-300 hover:border-slate-400'}`}>
                                <input 
                                    type="checkbox" 
                                    checked={selectedSlots.has(slot)}
                                    onChange={() => handleSlotToggle(slot)}
                                    className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                                />
                                <span className="text-sm font-medium text-slate-700">{slot}</span>
                            </label>
                        ))}
                    </div>

                    {generatedLink && (
                        <div className="mt-6">
                             <label className="block text-sm font-medium text-slate-700 mb-1">Your Shareable Link</label>
                             <div className="flex items-center gap-2">
                                <input type="text" readOnly value={generatedLink} className="w-full bg-slate-100 border-slate-300 rounded-md text-sm" />
                                <button onClick={handleCopyToClipboard} className="bg-slate-600 text-white px-3 py-2 rounded-lg font-semibold hover:bg-slate-700 flex items-center gap-2">
                                     {copied ? <CheckBadgeIcon className="w-5 h-5"/> : <ClipboardDocumentIcon className="w-5 h-5"/>}
                                    <span>{copied ? 'Copied' : 'Copy'}</span>
                                </button>
                             </div>
                        </div>
                    )}
                </div>

                <footer className="bg-slate-50 p-4 rounded-b-xl flex justify-end">
                     <button 
                        onClick={handleGenerateLink}
                        disabled={selectedSlots.size === 0}
                        className="bg-brand-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-opacity-90 disabled:bg-slate-400"
                    >
                        {generatedLink ? 'Update Link' : 'Generate Link'}
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

export default ShareAvailabilityModal;