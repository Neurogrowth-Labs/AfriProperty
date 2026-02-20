
import React, { useMemo } from 'react';
import type { Property, TourRequest, User, Message, Achievement, Review } from '../../../types';
import { PropertyStatus } from '../../../types';
import { ChartBarIcon, EyeIcon, BellIcon, ArrowUpIcon } from '../../icons/ActionIcons';
import { ListingsIcon } from '../../icons/AgentDashboardIcons';
import AgentGamification from './AgentGamification';


interface AgentDashboardHomeProps {
  user: User;
  allProperties: Property[];
  receivedInquiries: TourRequest[];
  onListPropertyClick: () => void;
  achievements: Achievement[];
  agentReviews: Review[];
  onUpdateAchievements: (achievements: Achievement[]) => void;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType; change?: string; }> = ({ title, value, icon: Icon, change }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
        <div className="flex justify-between items-start">
            <div className="flex flex-col">
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">{value}</p>
            </div>
            <div className="bg-brand-light p-3 rounded-full">
                <Icon className="w-6 h-6 text-brand-primary" />
            </div>
        </div>
        {change && (
             <p className="text-xs text-slate-500 mt-2 flex items-center">
                <span className="flex items-center text-green-600 mr-1"><ArrowUpIcon className="w-3 h-3"/> {change}</span> vs last week
            </p>
        )}
    </div>
);

const PerformanceChart: React.FC<{ data: { label: string; views: number; inquiries: number }[] }> = ({ data }) => {
    const maxVal = Math.max(...data.flatMap(d => [d.views, d.inquiries]));
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm transition-all hover:shadow-md">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Weekly Performance</h3>
            <div className="h-64 flex items-end gap-1 sm:gap-2 border-l border-b border-slate-200 p-2 sm:p-4">
                {data.map((d, i) => (
                    <div key={i} className="w-full flex flex-col items-center justify-end h-full gap-2 group">
                        <div className="flex items-end h-full w-full gap-1">
                             <div className="w-1/2 bg-blue-100 hover:bg-blue-300 rounded-t" style={{ height: `${(d.views / maxVal) * 100}%` }} title={`Views: ${d.views}`}></div>
                            <div className="w-1/2 bg-green-100 hover:bg-green-300 rounded-t" style={{ height: `${(d.inquiries / maxVal) * 100}%` }} title={`Inquiries: ${d.inquiries}`}></div>
                        </div>
                        <span className="text-xs font-medium text-slate-500">{d.label}</span>
                    </div>
                ))}
            </div>
             <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-blue-300"></div>
                    <span>Views</span>
                </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-green-300"></div>
                    <span>Inquiries</span>
                </div>
            </div>
        </div>
    );
};

const AgentDashboardHome: React.FC<AgentDashboardHomeProps> = (props) => {
    const { user, allProperties, receivedInquiries, onListPropertyClick } = props;
    
    const userProperties = useMemo(() => {
        return allProperties.filter(p => p.agent.name === user.username);
    }, [allProperties, user.username]);

    const stats = useMemo(() => {
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const activeListings = userProperties.filter(p => p.status === PropertyStatus.ACTIVE).length;
        const pendingApprovals = userProperties.filter(p => p.status === PropertyStatus.PENDING).length;
        // Mocking weekly views as there's no timestamp on views data
        const viewsThisWeek = Math.floor(userProperties.reduce((sum, p) => sum + p.views, 0) / 4);
        const leadsThisWeek = receivedInquiries.length; // Assuming all inquiries are from this week for simplicity
        return { activeListings, pendingApprovals, viewsThisWeek, leadsThisWeek };
    }, [userProperties, receivedInquiries]);
    
    const chartData = [
        { label: 'Mon', views: 34, inquiries: 2 },
        { label: 'Tue', views: 45, inquiries: 3 },
        { label: 'Wed', views: 52, inquiries: 5 },
        { label: 'Thu', views: 48, inquiries: 4 },
        { label: 'Fri', views: 68, inquiries: 7 },
        { label: 'Sat', views: 85, inquiries: 10 },
        { label: 'Sun', views: 76, inquiries: 8 },
    ];
    
    const notifications = [
        { type: 'Urgent', text: 'New inquiry for "Modern Downtown Loft" needs a response.', time: '5m ago' },
        { type: 'Pending', text: 'Your listing "Penthouse with City Views" is pending approval.', time: '2h ago' },
        { type: 'Informational', text: 'You received 5 new listing views in the last hour.', time: '1h ago' },
    ];

    return (
        <div className="p-4 sm:p-8 space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-slate-800">Welcome back, {user.username.split(' ')[0]}!</h2>
                <p className="text-slate-500 mt-1">Here's a snapshot of your activity this week.</p>
            </div>
            
            {/* At-a-glance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Active Listings" value={stats.activeListings} icon={ListingsIcon} />
                <StatCard title="Pending Approvals" value={stats.pendingApprovals} icon={BellIcon} />
                <StatCard title="Views this week" value={stats.viewsThisWeek.toLocaleString()} icon={EyeIcon} change="+12.5%" />
                <StatCard title="Leads this week" value={stats.leadsThisWeek} icon={ChartBarIcon} change="+8.2%" />
            </div>

            {/* Gamification */}
            <AgentGamification 
                achievements={props.achievements}
                userProperties={userProperties}
                agentReviews={props.agentReviews}
            />

            {/* Quick Actions & Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2">
                    <PerformanceChart data={chartData} />
                 </div>
                 <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm transition-all hover:shadow-md">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
                        <div className="flex flex-col space-y-3">
                            <button onClick={onListPropertyClick} className="w-full text-left bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-md transition-colors">Add New Listing</button>
                            <button onClick={() => alert("Scheduling feature coming soon!")} className="w-full text-left bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-md transition-colors">Schedule Viewing</button>
                            <button onClick={() => alert("Lead response feature coming soon!")} className="w-full text-left bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-md transition-colors">Respond to Lead</button>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm transition-all hover:shadow-md">
                         <h3 className="text-lg font-semibold text-slate-800 mb-4">Notifications</h3>
                         <div className="space-y-4">
                            {notifications.map((n, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className={`w-2 h-2 rounded-full mt-1.5 ${n.type === 'Urgent' ? 'bg-red-500' : n.type === 'Pending' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                                    <div>
                                        <p className="text-sm text-slate-600">{n.text}</p>
                                        <p className="text-xs text-slate-400">{n.time}</p>
                                    </div>
                                </div>
                            ))}
                         </div>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default AgentDashboardHome;
