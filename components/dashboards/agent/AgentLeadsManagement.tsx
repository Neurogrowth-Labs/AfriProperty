
import React, { useState } from 'react';
import type { Lead } from '../../../types';
import LeadDetailView from './LeadDetailView';
import { LeadsIcon } from '../../icons/AgentDashboardIcons';

interface AgentLeadsManagementProps {
    leads: Lead[];
}

const AgentLeadsManagement: React.FC<AgentLeadsManagementProps> = ({ leads }) => {
    const [selectedLead, setSelectedLead] = useState<Lead | null>(leads[0] || null);

    if (leads.length === 0) {
        return (
            <div className="p-8 h-full flex items-center justify-center text-center">
                <div>
                    <LeadsIcon className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600" />
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mt-4">No Leads Yet</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
                        When potential buyers or renters interact with your listings by sending messages or requesting tours, they will appear here as leads.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full bg-white dark:bg-slate-900">
            {/* Left panel: leads list */}
            <div className="w-96 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-y-auto flex-shrink-0">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-10">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">All Leads ({leads.length})</h3>
                </div>
                <div>
                    {leads.map(lead => (
                        <button 
                            key={lead.id} 
                            onClick={() => setSelectedLead(lead)} 
                            className={`w-full text-left p-4 border-b border-slate-100 dark:border-slate-800 block transition-colors ${selectedLead?.id === lead.id ? 'bg-brand-light dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                        >
                            <div className="flex justify-between items-center">
                                <p className="font-semibold text-slate-800 dark:text-white">{lead.username}</p>
                                <span className="text-xs font-bold px-2 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">Score: {lead.score}</span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Last contact: {new Date(lead.lastContact).toLocaleDateString()}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Right panel: lead detail */}
            <div className="flex-grow overflow-y-auto bg-slate-50 dark:bg-slate-800/50">
                {selectedLead ? (
                    <LeadDetailView lead={selectedLead} />
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400 p-8 text-center">
                        Select a lead from the list to see their details and activity timeline.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgentLeadsManagement;