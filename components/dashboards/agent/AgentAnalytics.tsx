
import React, { useMemo } from 'react';
import type { Property, TourRequest, User } from '../../../types';
import { ListingType } from '../../../types';
import { DownloadIcon } from '../../icons/AgentDashboardIcons';
import { ArrowUpIcon, ArrowDownIcon, CpuChipIcon, ChartBarIcon } from '../../icons/ActionIcons';

interface AgentAnalyticsProps {
  user: User;
  allProperties: Property[];
  receivedInquiries: TourRequest[];
  onOpenAIImprovementModal: (property: Property) => void;
}

const StatCard: React.FC<{ title: string; value: string; trend: string; trendDirection: 'up' | 'down' | 'neutral' }> = ({ title, value, trend, trendDirection }) => {
    const trendColor = trendDirection === 'up' ? 'text-green-600' : trendDirection === 'down' ? 'text-red-600' : 'text-slate-500';
    return (
        <div className="bg-white p-5 rounded-lg shadow-sm">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-3xl font-bold text-slate-800 mt-2">{value}</p>
            <p className={`text-xs mt-1 flex items-center ${trendColor}`}>
                {trendDirection === 'up' && <ArrowUpIcon className="w-3 h-3 mr-0.5" />}
                {trendDirection === 'down' && <ArrowDownIcon className="w-3 h-3 mr-0.5" />}
                {trend} vs last period
            </p>
        </div>
    );
};

const PerformanceChart: React.FC = () => {
    const data = useMemo(() => [
        { day: 'Mon', views: 120, inquiries: 5 }, { day: 'Tue', views: 150, inquiries: 8 },
        { day: 'Wed', views: 130, inquiries: 7 }, { day: 'Thu', views: 180, inquiries: 10 },
        { day: 'Fri', views: 220, inquiries: 15 }, { day: 'Sat', views: 300, inquiries: 20 },
        { day: 'Sun', views: 250, inquiries: 18 },
    ], []);

    const maxViews = Math.max(...data.map(d => d.views));
    const maxInquiries = Math.max(...data.map(d => d.inquiries));
    const maxVal = Math.max(maxViews, maxInquiries);

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm h-full">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Performance Over Time</h3>
            <div className="h-64 flex items-end gap-3 border-l border-b border-slate-200 p-2">
                {data.map((d, i) => (
                    <div key={i} className="w-full flex flex-col items-center justify-end h-full gap-2 group">
                        <div className="flex items-end h-full w-full gap-1 relative">
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-700 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                Views: {d.views}<br/>Inquiries: {d.inquiries}
                            </div>
                            <div className="w-1/2 bg-blue-200 hover:bg-blue-400 rounded-t-sm transition-colors" style={{ height: `${(d.views / maxVal) * 100}%` }}></div>
                            <div className="w-1/2 bg-green-200 hover:bg-green-400 rounded-t-sm transition-colors" style={{ height: `${(d.inquiries / maxVal) * 100}%` }}></div>
                        </div>
                        <span className="text-xs font-medium text-slate-500">{d.day}</span>
                    </div>
                ))}
            </div>
             <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-blue-300"></div><span>Views</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-green-300"></div><span>Inquiries</span></div>
            </div>
        </div>
    );
};

export const AgentAnalytics: React.FC<AgentAnalyticsProps> = ({ user, allProperties, receivedInquiries, onOpenAIImprovementModal }) => {
    
    const userProperties = useMemo(() => allProperties.filter(p => p.agent.name === user.username), [allProperties, user.username]);
    
    const analytics = useMemo(() => {
        const totalViews = userProperties.reduce((sum, p) => sum + p.views, 0);
        const totalInquiries = receivedInquiries.length;
        const conversionRate = totalViews > 0 ? (totalInquiries / totalViews) * 100 : 0;
        
        // Mocked sales data: 10% of inquiries convert to sales
        const sales = Math.floor(totalInquiries * 0.1);

        const leadDemographics = {
            byLocation: receivedInquiries.reduce((acc: Record<string, number>, inquiry) => {
                const prop = allProperties.find(p => p.id === inquiry.propertyId);
                if (prop) {
                    const city = prop.address.city;
                    acc[city] = (acc[city] || 0) + 1;
                }
                return acc;
            }, {} as Record<string, number>),
            byBudget: receivedInquiries.reduce((acc: Record<string, number>, inquiry) => {
                 const prop = allProperties.find(p => p.id === inquiry.propertyId);
                 if (prop) {
                     // FIX: Use enum for comparison instead of string literal
                     const price = prop.listingType === ListingType.SALE ? prop.price : (prop.price * 40); // Estimate sale price for rentals
                     let bracket = "1M+";
                     if (price < 150000) bracket = "<150k";
                     else if (price < 500000) bracket = "150k-500k";
                     else if (price < 1000000) bracket = "500k-1M";
                     acc[bracket] = (acc[bracket] || 0) + 1;
                 }
                 return acc;
            }, {} as Record<string, number>),
        };
        
        const listingPerformance = userProperties.map(p => {
            const inquiryCount = receivedInquiries.filter(i => i.propertyId === p.id).length;
            return {
                ...p,
                inquiryCount,
                // Score prioritizes inquiries > saves > views
                score: p.views + (inquiryCount * 10) + (p.saves * 2) 
            }
        }).sort((a,b) => b.score - a.score);

        return {
            totalViews, totalInquiries, conversionRate, sales, leadDemographics,
            topPerforming: listingPerformance.slice(0, 3),
            underperforming: listingPerformance.length > 3 ? listingPerformance.slice(-3).reverse() : [],
        };
    }, [userProperties, receivedInquiries, allProperties]);

    const budgetBrackets = Object.keys(analytics.leadDemographics.byBudget).sort();
    
    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Analytics & Reporting</h2>
                    <p className="text-slate-500 mt-1">Track your performance and gain actionable insights.</p>
                </div>
                <button onClick={() => alert("Downloading report...")} className="px-4 py-2 text-sm font-semibold bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2">
                    <DownloadIcon className="w-4 h-4" /> Export Report
                </button>
            </div>
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Views" value={analytics.totalViews.toLocaleString()} trend="+15%" trendDirection="up" />
                <StatCard title="Total Inquiries" value={analytics.totalInquiries.toLocaleString()} trend="+8%" trendDirection="up" />
                <StatCard title="Conversion Rate" value={`${analytics.conversionRate.toFixed(1)}%`} trend="-0.5%" trendDirection="down" />
                <StatCard title="Est. Sales" value={analytics.sales.toLocaleString()} trend="+2" trendDirection="up" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2"><PerformanceChart /></div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Conversion Funnel</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between"><span className="font-medium text-slate-600">Views</span><span className="font-bold text-slate-800">{analytics.totalViews.toLocaleString()}</span></div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5"><div className="bg-blue-400 h-2.5 rounded-full" style={{width: '100%'}}></div></div>
                        <div className="flex items-center justify-between"><span className="font-medium text-slate-600">Inquiries</span><span className="font-bold text-slate-800">{analytics.totalInquiries.toLocaleString()}</span></div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5"><div className="bg-green-400 h-2.5 rounded-full" style={{width: `${analytics.conversionRate}%`}}></div></div>
                        <div className="flex items-center justify-between"><span className="font-medium text-slate-600">Sales (Est.)</span><span className="font-bold text-slate-800">{analytics.sales.toLocaleString()}</span></div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5"><div className="bg-purple-400 h-2.5 rounded-full" style={{width: `${(analytics.sales / analytics.totalViews) * 100}%`}}></div></div>
                    </div>
                </div>
            </div>

            {/* Demographics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Leads by Location</h3>
                    <div className="flex justify-around items-center">
                    {Object.entries(analytics.leadDemographics.byLocation).map(([city, count]) => (
                        <div key={city} className="text-center"><p className="text-2xl font-bold text-brand-primary">{count}</p><p className="text-sm text-slate-500">{city}</p></div>
                    ))}
                    </div>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Leads by Budget (Est.)</h3>
                    <div className="flex items-end gap-2 h-24">
                        {budgetBrackets.map(bracket => (
                             <div key={bracket} className="w-full flex flex-col items-center justify-end h-full gap-1">
                                <div className="w-full bg-slate-200 hover:bg-slate-300 rounded-sm" style={{ height: `${((analytics.leadDemographics.byBudget[bracket] || 0) / Math.max(1, ...Object.values(analytics.leadDemographics.byBudget).map(v => Number(v))))*100}%`}}></div>
                                <span className="text-xs text-slate-500">{bracket}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Listing Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Top Performing Listings</h3>
                    <div className="space-y-3">
                        {analytics.topPerforming.map(p => (
                            <div key={p.id} className="text-sm flex justify-between items-center p-2 rounded-md bg-slate-50">
                                <span className="font-medium text-slate-700 truncate pr-2">{p.title}</span>
                                <span className="font-bold text-green-600">Score: {p.score.toFixed(0)}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Underperforming Listings</h3>
                    <div className="space-y-3">
                        {analytics.underperforming.map(p => (
                            <div key={p.id} className="text-sm flex justify-between items-center p-2 rounded-md bg-slate-50">
                                <div>
                                    <span className="font-medium text-slate-700 truncate">{p.title}</span>
                                    <p className="text-xs text-slate-400">Score: {p.score.toFixed(0)}</p>
                                </div>
                                <button onClick={() => onOpenAIImprovementModal(p)} className="text-xs font-semibold bg-brand-primary text-white px-3 py-1.5 rounded-md hover:bg-opacity-90 flex items-center gap-1">
                                    <CpuChipIcon className="w-4 h-4" /> Get Suggestions
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
