
import React from 'react';

const PropertyCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
      <div className="relative">
        <div className="w-full h-56 bg-slate-200"></div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="h-6 bg-slate-200 rounded w-1/3"></div>
        </div>
        <div className="h-5 bg-slate-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
        
        <div className="border-t border-b border-slate-100 my-4 py-3">
            <div className="h-5 bg-slate-200 rounded w-full"></div>
        </div>

        <div className="flex justify-around">
            <div className="h-5 bg-slate-200 rounded w-1/4"></div>
            <div className="h-5 bg-slate-200 rounded w-1/4"></div>
            <div className="h-5 bg-slate-200 rounded w-1/4"></div>
        </div>

        <div className="mt-6 pt-6">
            <div className="h-12 bg-slate-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCardSkeleton;
