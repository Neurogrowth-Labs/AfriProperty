
import React from 'react';
import type { Review, Property, User } from '../types';
import { StarIcon, StarIconOutline, UserCircleIcon } from './icons/ActionIcons';

interface AgentReviewsProps {
  reviews: Review[];
  agent: Property['agent'];
  currentUser: User | null;
  onLeaveReview: (agent: Property['agent']) => void;
}

const StarRating: React.FC<{ rating: number, className?: string }> = ({ rating, className = 'w-5 h-5' }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) =>
                i < Math.round(rating) ? (
                    <StarIcon key={i} className={`${className} text-amber-400`} />
                ) : (
                    <StarIconOutline key={i} className={`${className} text-slate-300`} />
                )
            )}
        </div>
    );
};

const AgentReviews: React.FC<AgentReviewsProps> = ({ reviews, agent, currentUser, onLeaveReview }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-brand-dark">Agent Reviews ({agent.reviewCount})</h3>
                {currentUser && currentUser.username !== agent.name && (
                    <button 
                        onClick={() => onLeaveReview(agent)}
                        className="bg-brand-primary text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all"
                    >
                        Leave a Review
                    </button>
                )}
            </div>

            {reviews.length > 0 ? (
                <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                    {reviews.map(review => (
                        <div key={review.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <UserCircleIcon className="w-6 h-6 text-slate-400"/>
                                    <span className="font-semibold text-sm text-slate-800">{review.reviewerUsername}</span>
                                </div>
                                <StarRating rating={review.rating} />
                            </div>
                            <p className="text-sm text-slate-600 mt-2 pl-8">{review.comment}</p>
                            <p className="text-xs text-slate-400 mt-2 text-right">{new Date(review.timestamp).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 bg-slate-50 rounded-lg">
                    <p className="text-slate-500 text-sm">No reviews for this agent yet.</p>
                </div>
            )}
        </div>
    );
};

export default AgentReviews;
