
import React, { useMemo } from 'react';
import type { Achievement, Property, Review } from '../../../types';
import { PropertyStatus } from '../../../types';

interface AgentGamificationProps {
    achievements: Achievement[];
    userProperties: Property[];
    agentReviews: Review[];
}

const AgentGamification: React.FC<AgentGamificationProps> = ({ achievements, userProperties, agentReviews }) => {

    const progress = useMemo(() => {
        const listingCount = userProperties.length;
        const soldCount = userProperties.filter(p => p.status === PropertyStatus.SOLD).length;
        const reviewCount = agentReviews.length;

        return {
            'First Listing': listingCount,
            'Sales Pro': soldCount,
            'Review Star': reviewCount,
        };
    }, [userProperties, agentReviews]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Achievements & Milestones</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {achievements.map(ach => {
                    const currentProgress = progress[ach.title as keyof typeof progress] || 0;
                    const isCompleted = currentProgress >= ach.goal;
                    const percentage = Math.min((currentProgress / ach.goal) * 100, 100);

                    return (
                        <div key={ach.id} className={`p-4 rounded-lg flex items-center gap-4 ${isCompleted ? 'bg-green-50 border-green-200 border' : 'bg-slate-50'}`}>
                            <div className={`p-3 rounded-full ${isCompleted ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                <ach.badge className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">{ach.title}</p>
                                <p className="text-xs text-slate-500">{ach.description}</p>
                                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                                    <div className={`h-1.5 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-brand-primary'}`} style={{ width: `${percentage}%` }}></div>
                                </div>
                                <p className="text-xs text-slate-400 text-right mt-1">{currentProgress}/{ach.goal}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AgentGamification;
