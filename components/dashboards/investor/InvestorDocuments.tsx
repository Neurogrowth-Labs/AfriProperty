
import React, { useMemo } from 'react';
import type { User } from '../../../types';
import { getInvestorDocuments } from '../../../lib/data';
import { DocumentTextIcon } from '../../icons/ActionIcons';
import { DownloadIcon } from '../../icons/AgentDashboardIcons';

interface InvestorDocumentsProps {
    user: User;
}

const InvestorDocuments: React.FC<InvestorDocumentsProps> = ({ user }) => {
    const documents = useMemo(() => getInvestorDocuments(), []);

    return (
        <div className="p-4 sm:p-8 space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Contracts & Statements</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Access and download all your important investment documents.</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden border border-slate-200 dark:border-slate-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[600px]">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="p-3 text-left font-semibold text-slate-600 dark:text-slate-300">Document Name</th>
                                <th className="p-3 text-left font-semibold text-slate-600 dark:text-slate-300">Type</th>
                                <th className="p-3 text-left font-semibold text-slate-600 dark:text-slate-300">Date</th>
                                <th className="p-3 text-right font-semibold text-slate-600 dark:text-slate-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {documents.map(doc => (
                                <tr key={doc.id}>
                                    <td className="p-3 font-medium text-slate-800 dark:text-white flex items-center gap-2">
                                        <DocumentTextIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                        <span className="truncate">{doc.name}</span>
                                    </td>
                                    <td className="p-3 text-slate-600 dark:text-slate-300">{doc.type}</td>
                                    <td className="p-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">{new Date(doc.date).toLocaleDateString()}</td>
                                    <td className="p-3 text-right">
                                        <a href={doc.url} download className="font-semibold text-brand-primary hover:underline flex items-center gap-1 justify-end">
                                            <DownloadIcon className="w-4 h-4" /> Download
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {documents.length === 0 && (
                    <p className="text-center text-slate-500 py-10">No documents found.</p>
                )}
            </div>
        </div>
    );
};

export default InvestorDocuments;
