
import React, { useState } from 'react';
import { CloseIcon, SendIcon } from './icons/NavIcons';

interface InvestmentRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendRequest: (details: string) => void;
}

const InvestmentRequestModal: React.FC<InvestmentRequestModalProps> = ({ isOpen, onClose, onSendRequest }) => {
    const [details, setDetails] = useState('');

    const handleSend = () => {
        if (!details.trim()) return;
        onSendRequest(details);
    };

    if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[110] p-4" onClick={onClose}>
        <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" 
            onClick={e => e.stopPropagation()}
        >
            <header className="flex justify-between items-center p-5 border-b border-slate-200">
                <div>
                    <h2 className="text-xl font-bold text-brand-dark">Make an Investment Request</h2>
                    <p className="text-sm text-slate-500">Your request will be sent to verified agents on the platform.</p>
                </div>
                <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 transition-colors">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </header>
            
            <div className="p-6">
                <label htmlFor="request-details" className="block text-sm font-medium text-slate-700 mb-1">Request Details</label>
                <textarea
                    id="request-details"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Describe the type of investment you're looking for. e.g., 'Seeking a 2-bedroom apartment in Urbanville for under $500,000 with a potential rental yield of over 6%...'"
                    rows={6}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-brand-primary focus:border-brand-primary resize-none"
                />
            </div>

            <footer className="bg-slate-50 p-4 rounded-b-xl flex justify-end">
                 <button 
                    onClick={handleSend}
                    className="bg-brand-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300 flex items-center gap-2"
                >
                    <SendIcon className="w-5 h-5"/>
                    <span>Send to Agents</span>
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

export default InvestmentRequestModal;
