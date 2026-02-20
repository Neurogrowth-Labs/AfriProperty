
import React, { useState } from 'react';
import type { Review } from '../types';
import { CloseIcon } from './icons/NavIcons';
import { StarIcon } from './icons/ActionIcons';

interface AgentReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentName: string;
  onSubmit: (review: Omit<Review, 'id' | 'timestamp' | 'reviewerUsername' | 'agentName'>) => void;
}

const AgentReviewModal: React.FC<AgentReviewModalProps> = ({ isOpen, onClose, agentName, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            alert("Please select a star rating.");
            return;
        }
        onSubmit({ rating, comment });
    };
    
    if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[110] p-4" onClick={onClose}>
        <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" 
            onClick={e => e.stopPropagation()}
        >
            <header className="flex justify-between items-center p-5 border-b border-slate-200">
                <div>
                    <h2 className="text-xl font-bold text-brand-dark">Leave a Review</h2>
                    <p className="text-sm text-slate-500">For agent: {agentName}</p>
                </div>
                <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 transition-colors">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </header>
            
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Your Rating</label>
                        <div className="flex items-center space-x-1" onMouseLeave={() => setHoverRating(0)}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    type="button"
                                    key={star}
                                    className="text-slate-300 transition-colors"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                >
                                    <StarIcon className={`w-8 h-8 ${(hoverRating >= star || rating >= star) ? 'text-amber-400' : 'text-slate-300'}`}/>
                                </button>
                            ))}
                        </div>
                    </div>
                     <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-slate-700 mb-1">Your Comment (optional)</label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder={`Share your experience with ${agentName}...`}
                            rows={4}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-brand-primary focus:border-brand-primary resize-none"
                        />
                    </div>
                </div>
                <footer className="bg-slate-50 p-4 rounded-b-xl flex justify-end">
                     <button 
                        type="submit"
                        className="bg-brand-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300"
                    >
                        Submit Review
                    </button>
                </footer>
            </form>
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

export default AgentReviewModal;
