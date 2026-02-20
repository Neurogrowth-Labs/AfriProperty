
import React from 'react';
// FIX: Imports updated to match root types definitions
import type { Lead } from '../../../types';
import { ActivityType } from '../../../types';
import { ChatBubbleLeftRightIcon, CalendarIcon } from '../../icons/ActionIcons';

const activityIcons: Record<string, React.ElementType> = {
    [ActivityType.MESSAGE_SENT]: ChatBubbleLeftRightIcon,
    [ActivityType.TOUR_REQUESTED]: CalendarIcon,
};

const LeadDetailView: React.FC<{ lead: Lead }> = ({ lead }) => {
    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start pb-6 border-b border-slate-200 dark:border-slate-700">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{lead.username}</h2>
                    <p className="text-slate-500 dark:text-slate-400">{lead.email} &middot; {lead.phone}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Lead Score</p>
                    <p className="text-3xl font-bold text-brand-primary">{lead.score}</p>
                </div>
            </div>
            {/* Timeline */}
            <div className="mt-6">
                <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Activity Timeline</h3>
                <div className="flow-root">
                    <ul className="-mb-8">
                        {lead.activity.map((item, itemIdx) => (
                            <li key={item.timestamp}>
                                <div className="relative pb-8">
                                    {itemIdx !== lead.activity.length - 1 ? (
                                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200 dark:bg-slate-700" aria-hidden="true" />
                                    ) : null}
                                    <div className="relative flex space-x-3">
                                        <div>
                                            <span className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center ring-8 ring-slate-50 dark:ring-slate-800/50">
                                                {React.createElement(activityIcons[item.type] || CalendarIcon, { className: "h-5 w-5 text-slate-500 dark:text-slate-400" })}
                                            </span>
                                        </div>
                                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                            <div>
                                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                                    {item.type} for <span className="font-medium text-slate-900 dark:text-white">{item.propertyTitle}</span>
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.detail}</p>
                                            </div>
                                            <div className="whitespace-nowrap text-right text-sm text-slate-500 dark:text-slate-400">
                                                <time dateTime={new Date(item.timestamp).toISOString()}>{new Date(item.timestamp).toLocaleDateString()}</time>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default LeadDetailView;
