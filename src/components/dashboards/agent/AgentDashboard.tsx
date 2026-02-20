
import React, { useState } from 'react';
import type { Property, TourRequest, User, Message, CalendarEvent, AgentProfile, Review, Lead, Achievement, InvestmentRequest } from '../../../types';
import AgentDashboardHome from './agent/AgentDashboardHome';
import AgentListingsManagement from './agent/AgentListingsManagement';
import AgentCalendar from './agent/AgentCalendar';
// FIX: Corrected import path. AgentAnalytics is in the same directory, not the 'agent/' subfolder.
import { AgentAnalytics } from './AgentAnalytics';
import AgentProfilePage from './agent/AgentProfilePage';
import AgentSupportPage from './agent/AgentSupportPage';
import AgentLeadsManagement from './agent/AgentLeadsManagement';
import AgentAITools from './agent/AgentAITools';
import AgentTeamHub from './agent/AgentTeamHub';
import { DashboardIcon, ListingsIcon, LeadsIcon, AnalyticsIcon, CalendarIcon as NavCalendarIcon, ProfileIcon, SupportIcon, SparklesIcon, HandshakeIcon, BanknotesIcon, CreditCardIcon } from '../../icons/AgentDashboardIcons';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import AgentInvestmentRequests from './agent/AgentInvestmentRequests';
import AgentEarnings from './agent/AgentEarnings';
import AgentBilling from './agent/AgentBilling';
import { ChatBubbleLeftRightIcon } from '../../icons/ActionIcons';
// FIX: Corrected import path. AgentMessages is in the same directory, not the 'agent/' subfolder.
import AgentMessages from './AgentMessages';


interface AgentDashboardProps {
  user: User;
  allProperties: Property[];
  receivedInquiries: TourRequest[];
  messages: Message[];
  calendarEvents: CalendarEvent[];
  agentProfile: AgentProfile | null;
  agentReviews: Review[];
  leads: Lead[];
  achievements: Achievement[];
  investmentRequests: InvestmentRequest[];
  onEditProperty: (property: Property) => void;
  onDeleteProperty: (propertyId: string) => void;
  onDraftReply: (inquiry: TourRequest) => void;
  onListPropertyClick: () => void;
  onAddEvent: (eventData: Omit<CalendarEvent, 'id'>) => void;
  onUpdateEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  onOpenAIImprovementModal: (property: Property) => void;
  onUpdateAgentProfile: (profile: AgentProfile) => void;
  onUpdateAchievements: (achievements: Achievement[]) => void;
  // Added onSendMessage to props
  onSendMessage: (messageData: Omit<Message, 'id' | 'timestamp'>) => Promise<void>;
}

export type AgentView = 'dashboard' | 'listings' | 'leads' | 'analytics' | 'calendar' | 'profile' | 'support' | 'aiTools' | 'teamHub' | 'investmentRequests' | 'earnings' | 'billing' | 'messages';

const Sidebar: React.FC<{ activeView: AgentView; setActiveView: (view: AgentView) => void; closeSidebar: () => void; }> = ({ activeView, setActiveView, closeSidebar }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
        { id: 'listings', label: 'Listings', icon: ListingsIcon },
        { id: 'leads', label: 'Leads & Inquiries', icon: LeadsIcon },
        { id: 'messages', label: 'Messages', icon: ChatBubbleLeftRightIcon },
        { id: 'investmentRequests', label: 'Investment Requests', icon: HandshakeIcon },
        { id: 'analytics', label: 'Analytics', icon: AnalyticsIcon },
        { id: 'earnings', label: 'Earnings', icon: BanknotesIcon },
        { id: 'calendar', label: 'Calendar', icon: NavCalendarIcon },
        { id: 'aiTools', label: 'AI Tools', icon: SparklesIcon },
        { id: 'profile', label: 'Profile & Branding', icon: ProfileIcon },
    ] as const;

    const bottomNavItems = [
        { id: 'billing', label: 'Subscription & Billing', icon: CreditCardIcon },
        { id: 'teamHub', label: 'Team Hub', icon: LeadsIcon },
        { id: 'support', label: 'Support & Resources', icon: SupportIcon }
    ] as const;
    
    const handleItemClick = (view: AgentView) => {
        setActiveView(view);
        closeSidebar();
    };


    return (
        <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col p-4 flex-shrink-0 h-full">
            <div className="flex-grow">
                 <h3 className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 mb-4 px-3">Agent Tools</h3>
                <nav className="flex flex-col space-y-1">
                    {navItems.map(item => (
                        <button 
                            key={item.id}
                            onClick={() => handleItemClick(item.id)} 
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-md font-semibold text-sm transition-colors ${activeView === item.id ? 'bg-brand-light text-brand-primary dark:bg-slate-800' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="flex-shrink-0 space-y-1 pt-4 border-t border-slate-200 dark:border-slate-700 mt-4">
                 {bottomNavItems.map(item => (
                    <button 
                        key={item.id}
                        onClick={() => handleItemClick(item.id)} 
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md font-semibold text-sm transition-colors ${activeView === item.id ? 'bg-brand-light text-brand-primary dark:bg-slate-800' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </button>
                 ))}
            </div>
        </aside>
    );
};


const AgentDashboard: React.FC<AgentDashboardProps> = (props) => {
    const [activeView, setActiveView] = useState<AgentView>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const renderContent = () => {
        switch(activeView) {
            case 'dashboard':
                return <AgentDashboardHome {...props} onNavigate={setActiveView} />;
            case 'listings':
                return <AgentListingsManagement {...props} />;
            case 'analytics':
                return <AgentAnalytics {...props} />;
            case 'calendar':
                return <AgentCalendar {...props} />;
            case 'profile':
                return <AgentProfilePage {...props} />;
            case 'support':
                return <AgentSupportPage user={props.user} />;
            case 'leads':
                return <AgentLeadsManagement {...props} />;
            case 'messages':
                // FIX: Pass onSendMessage to AgentMessages
                return <AgentMessages user={props.user} messages={props.messages} onSendMessage={props.onSendMessage} />;
            case 'aiTools':
                return <AgentAITools />;
            case 'teamHub':
                return <AgentTeamHub />;
            case 'investmentRequests':
                return <AgentInvestmentRequests investmentRequests={props.investmentRequests} />;
            case 'earnings':
                return <AgentEarnings {...props} />;
            case 'billing':
                return <AgentBilling />;
            default:
                return <AgentDashboardHome {...props} onNavigate={setActiveView} />;
        }
    }

    return (
    <div className="flex h-full font-sans text-slate-800 dark:text-slate-200 relative">
      {/* Mobile Header */}
        <div className="lg:hidden p-4 border-b border-slate-200 dark:border-slate-700 w-full flex justify-between items-center absolute top-0 left-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-20">
            <h3 className="font-semibold capitalize text-slate-800 dark:text-white">{activeView.replace(/([A-Z])/g, ' $1')}</h3>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-800 dark:text-white">
                {isSidebarOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
        </div>

        {/* Sidebar */}
        <div className={`
            absolute lg:relative top-0 left-0 h-full z-10 transition-transform transform 
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            lg:translate-x-0
        `}>
            <Sidebar activeView={activeView} setActiveView={setActiveView} closeSidebar={() => setIsSidebarOpen(false)} />
        </div>
      <main className="flex-1 bg-slate-50 dark:bg-slate-800/50 overflow-y-auto lg:pt-0 pt-[69px]">
        {renderContent()}
      </main>
    </div>
  );
};

export default AgentDashboard;
