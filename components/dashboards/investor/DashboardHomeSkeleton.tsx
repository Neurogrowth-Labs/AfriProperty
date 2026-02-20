
import React from 'react';

const DashboardHomeSkeleton: React.FC = () => {
    return (
        <div className="p-8 space-y-8 animate-pulse">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-64"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-80"></div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg w-32"></div>
                    <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg w-24"></div>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mt-3"></div>
                    </div>
                ))}
            </div>

            {/* Map & Other Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm">
                     <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
                     <div className="aspect-[2/1] bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHomeSkeleton;
