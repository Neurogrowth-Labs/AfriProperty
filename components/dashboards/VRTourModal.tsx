
import React from 'react';
import { CloseIcon } from './icons/NavIcons';

interface VRTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

const VRTourModal: React.FC<VRTourModalProps> = ({ isOpen, onClose, url }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col z-[130] p-4 animate-fade-in" onClick={onClose}>
        <header className="flex justify-end w-full mb-2 flex-shrink-0">
             <button onClick={onClose} className="p-2 rounded-full text-white bg-white/10 hover:bg-white/20 transition-colors">
                <CloseIcon className="w-6 h-6" />
            </button>
        </header>
        <div className="flex-grow w-full h-full">
             <iframe
                src={url}
                title="Virtual Reality Tour"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; xr-spatial-tracking"
                allowFullScreen
                className="w-full h-full rounded-lg"
            ></iframe>
        </div>
        <style>{`
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .animate-fade-in {
                animation: fadeIn 0.3s ease-out forwards;
            }
        `}</style>
    </div>
  );
};

export default VRTourModal;