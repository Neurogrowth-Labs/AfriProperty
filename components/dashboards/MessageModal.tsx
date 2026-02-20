
import React, { useState } from 'react';
import type { Property } from '../types';
import { CloseIcon, SendIcon } from './icons/NavIcons';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  onSend: (message: string) => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ isOpen, onClose, property, onSend }) => {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (!message.trim()) return;
        onSend(message);
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
                    <h2 className="text-xl font-bold text-brand-dark">Send a Message</h2>
                    <p className="text-sm text-slate-500">To: {property.agent.name} regarding "{property.title}"</p>
                </div>
                <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 transition-colors">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </header>
            
            <div className="p-6">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={`Hi ${property.agent.name}, I have a question about this property...`}
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
                    <span>Send Message</span>
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

export default MessageModal;
