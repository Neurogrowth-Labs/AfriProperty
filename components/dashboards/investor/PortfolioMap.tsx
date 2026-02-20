
import React, { useMemo } from 'react';
import type { Property } from '../../../types';

interface PortfolioMapProps {
  ownedProperties: Property[];
  watchlistProperties: Property[];
}

const PortfolioMap: React.FC<PortfolioMapProps> = ({ ownedProperties, watchlistProperties }) => {

    const allPoints = useMemo(() => {
        return [
            ...ownedProperties.map(p => ({ ...p.coordinates, type: 'owned' })),
            ...watchlistProperties.map(p => ({ ...p.coordinates, type: 'watchlist' }))
        ];
    }, [ownedProperties, watchlistProperties]);

    const projectedPoints = useMemo(() => {
        if (allPoints.length === 0) return [];

        const latitudes = allPoints.map(p => p.lat);
        const longitudes = allPoints.map(p => p.lng);
        
        const minLat = Math.min(...latitudes);
        const maxLat = Math.max(...latitudes);
        const minLng = Math.min(...longitudes);
        const maxLng = Math.max(...longitudes);

        const latRange = maxLat - minLat;
        const lngRange = maxLng - minLng;
        
        // Add padding to avoid points on the edge
        const padding = 0.1;

        return allPoints.map((p, i) => {
            // Invert latitude for correct top-down mapping
            const y = latRange > 0 ? (1 - (p.lat - minLat) / latRange) * (1 - 2 * padding) + padding : 0.5;
            const x = lngRange > 0 ? ((p.lng - minLng) / lngRange) * (1 - 2 * padding) + padding : 0.5;
            
            return {
                id: i,
                x: x * 100,
                y: y * 100,
                type: p.type
            };
        });

    }, [allPoints]);


    return (
        <div className="relative aspect-[2/1] bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600">
            {/* Simplified world map background */}
            <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full text-slate-300 dark:text-slate-500" preserveAspectRatio="none">
               <path d="M500 250 m -250 0 a 250,250 0 1,0 500,0 a 250,250 0 1,0 -500,0" fill="currentColor" opacity="0.1" />
               <path d="M250 250 m -150 0 a 150,150 0 1,0 300,0 a 150,150 0 1,0 -300,0" fill="currentColor" opacity="0.05" />
               <path d="M750 250 m -150 0 a 150,150 0 1,0 300,0 a 150,150 0 1,0 -300,0" fill="currentColor" opacity="0.05" />
            </svg>
            
            {projectedPoints.map(p => (
                <div key={p.id} className="absolute group" style={{ left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%, -50%)' }}>
                    <div className={`w-3 h-3 rounded-full transition-all group-hover:scale-150 ${p.type === 'owned' ? 'bg-brand-primary' : 'bg-brand-secondary'}`} />
                    <div className={`w-5 h-5 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping ${p.type === 'owned' ? 'bg-brand-primary/50' : 'bg-brand-secondary/50'}`} />
                     <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap capitalize">
                        {p.type} Property
                    </div>
                </div>
            ))}

            <div className="absolute bottom-4 right-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm p-2 rounded-lg text-xs space-y-1">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-brand-primary"></div><span className="font-semibold text-slate-700 dark:text-slate-200">Owned Asset</span></div>
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-brand-secondary"></div><span className="font-semibold text-slate-700 dark:text-slate-200">Watchlist</span></div>
            </div>
        </div>
    );
};

export default PortfolioMap;
