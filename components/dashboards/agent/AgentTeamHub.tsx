

import React from 'react';
import { UsersIcon } from '../../icons/AgentDashboardIcons';

const AgentTeamHub: React.FC = () => {
    return (
        <div className="p-4 md:p-8 h-full flex items-center justify-center text-center">
            <div>
                <div className="mx-auto bg-slate-200 dark:bg-slate-700 p-4 rounded-full w-fit">
                     <UsersIcon className="w-12 h-12 text-slate-500 dark:text-slate-400" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white mt-6">Team Hub is Coming Soon</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
                    Manage your team, share listings, and track collective performance all in one place. We're building powerful collaboration tools for agencies and teams.
                </p>
            </div>
        </div>
    );
};

export default AgentTeamHub;
