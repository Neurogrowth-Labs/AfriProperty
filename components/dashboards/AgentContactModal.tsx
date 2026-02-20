
import React, { useState } from 'react';
import { CloseIcon } from './icons/NavIcons';
import { PhoneXMarkIcon, MicrophoneIcon, VideoCameraIcon, VideoCameraSlashIcon, UserCircleIcon } from './icons/ActionIcons';

interface AgentContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'chat' | 'video';
  agentName: string;
}

const AgentContactModal: React.FC<AgentContactModalProps> = ({ isOpen, onClose, mode, agentName }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[120] p-4" onClick={onClose}>
            <div 
                className="bg-brand-dark rounded-2xl shadow-2xl w-full max-w-sm transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale flex flex-col text-white" 
                onClick={e => e.stopPropagation()}
            >
                <header className="flex justify-between items-center p-4">
                    <p className="text-sm font-semibold">{mode === 'video' ? 'Video Call' : 'Live Chat'}</p>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-white/10 transition-colors">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </header>
                
                <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
                     <div className="w-32 h-32 bg-slate-700 rounded-full flex items-center justify-center mb-4 ring-4 ring-slate-600">
                        <UserCircleIcon className="w-24 h-24 text-slate-500"/>
                     </div>
                     <h2 className="text-2xl font-bold">Connecting to {agentName}...</h2>
                     <p className="text-slate-400 mt-2">The agent will be with you shortly.</p>
                </div>
                
                <footer className="bg-slate-800/50 p-4 rounded-b-2xl flex justify-center items-center space-x-4">
                    <button 
                        onClick={() => setIsMuted(!isMuted)}
                        className={`p-3 rounded-full transition-colors ${isMuted ? 'bg-white text-brand-dark' : 'bg-slate-600 hover:bg-slate-500'}`}
                    >
                        <MicrophoneIcon className="w-6 h-6"/>
                    </button>
                     <button 
                        onClick={() => setIsCameraOff(!isCameraOff)}
                        className={`p-3 rounded-full transition-colors ${isCameraOff ? 'bg-white text-brand-dark' : 'bg-slate-600 hover:bg-slate-500'}`}
                    >
                        {isCameraOff ? <VideoCameraSlashIcon className="w-6 h-6"/> : <VideoCameraIcon className="w-6 h-6"/>}
                    </button>
                    <button 
                        onClick={onClose}
                        className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
                    >
                        <PhoneXMarkIcon className="w-7 h-7"/>
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

export default AgentContactModal;