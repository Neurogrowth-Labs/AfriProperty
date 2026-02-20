
import React, { useMemo } from 'react';
import type { Property, TourRequest, User, Message, Achievement, Review } from '../../../types';
import { PropertyStatus } from '../../../types';
import { ChartBarIcon, EyeIcon, BellIcon, ArrowUpIcon, CalendarIcon, ChatBubbleLeftRightIcon } from '../../icons/ActionIcons';
import { ListingsIcon } from '../../icons/AgentDashboardIcons';
import AgentGamification from './AgentGamification';
import type { AgentView } from './AgentDashboard';


interface AgentDashboardHomeProps {
  user: User;
  allProperties: Property[];
  receivedInquiries: TourRequest[];
  onListPropertyClick: () => void;
  achievements: Achievement[];
  agentReviews: Review[];
  onUpdateAchievements: (achievements: Achievement[]) => void;
  onNavigate: (view: AgentView) => void;
}

const StatCard: React.FC<{ 
    title: string; 
    value: string | number; 
    icon: React.ElementType; 
    change?: string; 
    colorClass: string 
}> = ({ title, value, icon: Icon, change, colorClass }) => (
    <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{title}</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-2">{value}</p>
            </div>
            <div className={`p-3 rounded-lg ${colorClass} text-white shadow-md`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
        {change && (
             <div className="mt-4 flex items-center text-sm">
                <span className="flex items-center text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                    <ArrowUpIcon className="w-3 h-3 mr-1 stroke-[3]"/> {change}
                </span>
                <span className="text-slate-400 ml-2 font-medium">vs last week</span>
            </div>
        )}
    </div>
);

const PerformanceChart: React.FC<{ data: { label: string; views: number; inquiries: number }[] }> = ({ data }) => {
    const maxVal = Math.max(1, ...data.flatMap(d => [d.views, d.inquiries]));
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Weekly Performance</h3>
            <div className="h-64 flex items-end gap-3 sm:gap-4">
                {data.map((d, i) => (
                    <div key={i} className="w-full flex flex-col items-center justify-end h-full gap-2 group relative">
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs rounded py-1 px-2 pointer-events-none whitespace-nowrap z-10">
                            {d.views} Views · {d.inquiries} Inquiries
                        </div>
                        <div className="flex items-end justify-center w-full gap-1 h-full">
                             <div className="w-full bg-blue-500 rounded-t-sm transition-all duration-500 group-hover:bg-blue-600" style={{ height: `${(d.views / maxVal) * 100}%` }}></div>
                            <div className="w-full bg-emerald-500 rounded-t-sm transition-all duration-500 group-hover:bg-emerald-600" style={{ height: `${(d.inquiries / maxVal) * 100}%` }}></div>
                        </div>
                        <span className="text-xs font-bold text-slate-400">{d.label}</span>
                    </div>
                ))}
            </div>
             <div className="flex items-center justify-center gap-6 mt-6 text-sm font-medium">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-slate-600">Views</span>
                </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-slate-600">Inquiries</span>
                </div>
            </div>
        </div>
    );
};

const QuickAction: React.FC<{ title: string; subtitle: string; icon: React.ElementType; onClick: () => void; colorClass: string }> = ({ title, subtitle, icon: Icon, onClick, colorClass }) => (
    <button onClick={onClick} className="w-full flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-brand-primary/30 transition-all text-left group">
        <div className={`p-3 rounded-lg ${colorClass} text-white group-hover:scale-110 transition-transform`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <h4 className="font-bold text-slate-800 group-hover:text-brand-primary transition-colors">{title}</h4>
            <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
    </button>
);

const NotificationItem: React.FC<{ type: string; text: string; time: string }> = ({ type, text, time }) => {
    let colorClass = 'bg-blue-500';
    if (type === 'Urgent') colorClass = 'bg-red-500';
    if (type === 'Pending') colorClass = 'bg-amber-500';
    
    return (
        <div className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
            <div className={`w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0 ${colorClass}`}></div>
            <div>
                <p className="text-sm text-slate-700 font-medium">{text}</p>
                <p className="text-xs text-slate-400 mt-1 font-medium">{time}</p>
            </div>
        </div>
    );
};

const AgentDashboardHome: React.FC<AgentDashboardHomeProps> = (props) => {
    const { user, allProperties, receivedInquiries, onListPropertyClick, onNavigate } = props;
    
    const userProperties = useMemo(() => {
        return allProperties.filter(p => p.agent.name === user.username);
    }, [allProperties, user.username]);

    const stats = useMemo(() => {
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const activeListings = userProperties.filter(p => p.status === PropertyStatus.ACTIVE).length;
        const pendingApprovals = userProperties.filter(p => p.status === PropertyStatus.PENDING).length;
        const viewsThisWeek = Math.floor(userProperties.reduce((sum, p) => sum + p.views, 0) / 4);
        const leadsThisWeek = receivedInquiries.length;
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
        <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Dashboard</h2>
                    <p className="text-slate-500 font-medium">Welcome back, {user.username.split(' ')[0]}!</p>
                </div>
                <div className="flex items-center gap-3">
                     <span className="text-sm font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                     </span>
                </div>
            </div>
            
            {/* At-a-glance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Active Listings" 
                    value={stats.activeListings} 
                    icon={ListingsIcon} 
                    colorClass="bg-blue-600"
                />
                <StatCard 
                    title="Pending" 
                    value={stats.pendingApprovals} 
                    icon={BellIcon} 
                    colorClass="bg-amber-500"
                />
                <StatCard 
                    title="Views" 
                    value={stats.viewsThisWeek.toLocaleString()} 
                    icon={EyeIcon} 
                    change="+12.5%" 
                    colorClass="bg-indigo-500"
                />
                <StatCard 
                    title="Leads" 
                    value={stats.leadsThisWeek} 
                    icon={ChartBarIcon} 
                    change="+8.2%" 
                    colorClass="bg-emerald-500"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                 {/* Main Chart Section */}
                 <div className="xl:col-span-2 space-y-8">
                    <PerformanceChart data={chartData} />
                    
                    {/* Gamification */}
                    <AgentGamification 
                        achievements={props.achievements}
                        userProperties={userProperties}
                        agentReviews={props.agentReviews}
                    />
                 </div>

                 {/* Right Column: Actions & Notifications */}
                 <div className="space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-slate-800">Quick Actions</h3>
                        <QuickAction 
                            title="Add New Listing" 
                            subtitle="Create a new property listing"
                            icon={ListingsIcon} 
                            onClick={onListPropertyClick} 
                            colorClass="bg-blue-600"
                        />
                        <QuickAction 
                            title="Schedule Viewing" 
                            subtitle="Manage your calendar events"
                            icon={CalendarIcon} 
                            onClick={() => onNavigate('calendar')} 
                            colorClass="bg-violet-600"
                        />
                        <QuickAction 
                            title="Respond to Leads" 
                            subtitle="View recent inquiries"
                            icon={ChatBubbleLeftRightIcon} 
                            onClick={() => onNavigate('leads')} 
                            colorClass="bg-pink-600"
                        />
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                         <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-800">Notifications</h3>
                            <button className="text-xs font-bold text-brand-primary hover:underline">View All</button>
                         </div>
                         <div className="space-y-1">
                            {notifications.map((n, i) => (
                                <NotificationItem key={i} {...n} />
                            ))}
                         </div>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default AgentDashboardHome;
