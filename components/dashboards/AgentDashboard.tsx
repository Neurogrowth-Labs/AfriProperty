
import React, { useState } from 'react';
import type { Property, TourRequest, User, Message, CalendarEvent, AgentProfile, Review, Lead, Achievement, InvestmentRequest } from '../../types';
import AgentDashboardHome from './agent/AgentDashboardHome';
import AgentListingsManagement from './agent/AgentListingsManagement';
import AgentCalendar from './agent/AgentCalendar';
import { AgentAnalytics } from './agent/AgentAnalytics';
import AgentProfilePage from './agent/AgentProfilePage';
import AgentSupportPage from './agent/AgentSupportPage';
import AgentLeadsManagement from './agent/AgentLeadsManagement';
import AgentAITools from './agent/AgentAITools';
import AgentTeamHub from './agent/AgentTeamHub';
import { DashboardIcon, ListingsIcon, LeadsIcon, AnalyticsIcon, CalendarIcon as NavCalendarIcon, ProfileIcon, SupportIcon, SparklesIcon, HandshakeIcon, BanknotesIcon, CreditCardIcon } from '../icons/AgentDashboardIcons';
import AgentInvestmentRequests from './agent/AgentInvestmentRequests';
import AgentEarnings from './agent/AgentEarnings';
import AgentBilling from './agent/AgentBilling';
import { ChatBubbleLeftRightIcon } from '../icons/ActionIcons';
import AgentMessages from './agent/AgentMessages';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';


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
  // Added onSendMessage to props interface
  onSendMessage: (messageData: Omit<Message, 'id' | 'timestamp'>) => Promise<void>;
}

type AgentView = 'dashboard' | 'listings' | 'leads' | 'analytics' | 'calendar' | 'profile' | 'support' | 'aiTools' | 'teamHub' | 'investmentRequests' | 'earnings' | 'billing' | 'messages';

const Sidebar: React.FC<{ 
    activeView: AgentView; 
    setActiveView: (view: AgentView) => void; 
    width: number;
    startResizing: (e: React.MouseEvent) => void;
    isSidebarOpen: boolean;
    closeSidebar: () => void;
}> = ({ activeView, setActiveView, width, startResizing, isSidebarOpen, closeSidebar }) => {
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
        <aside 
            style={{ width: isSidebarOpen ? '100%' : `${width}px` }}
            className="relative bg-white border-r border-slate-200 flex flex-col p-4 overflow-y-auto flex-shrink-0 h-full"
        >
            <div className="flex-grow">
                 <h3 className="text-xs font-semibold uppercase text-slate-400 mb-4 px-3">Agent Tools</h3>
                <nav className="flex flex-col space-y-1">
                    {navItems.map(item => (
                        <button 
                            key={item.id}
                            onClick={() => handleItemClick(item.id)} 
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-md font-semibold text-sm transition-colors ${activeView === item.id ? 'bg-brand-light text-brand-primary' : 'text-slate-600 hover:bg-slate-100'}`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="flex-shrink-0 space-y-1 pt-4 border-t mt-4">
                 {bottomNavItems.map(item => (
                    <button 
                        key={item.id}
                        onClick={() => handleItemClick(item.id)} 
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md font-semibold text-sm transition-colors ${activeView === item.id ? 'bg-brand-light text-brand-primary' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </button>
                 ))}
            </div>

            {/* Resizer Handle */}
            <div 
                onMouseDown={startResizing}
                className="hidden lg:block absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-brand-primary/30 transition-colors z-20"
            />
        </aside>
    );
};


const AgentDashboard: React.FC<AgentDashboardProps> = (props) => {
    const [activeView, setActiveView] = useState<AgentView>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(256);
    const [isResizing, setIsResizing] = useState(false);

    const startResizing = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
    };

    const stopResizing = () => {
        setIsResizing(false);
    };

    const resize = (e: MouseEvent) => {
        if (isResizing) {
            const newWidth = e.clientX;
            if (newWidth >= 160 && newWidth <= 480) {
                setSidebarWidth(newWidth);
            }
        }
    };

    React.useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResizing);
        } else {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        }
        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        };
    }, [isResizing]);

    const renderContent = () => {
        switch(activeView) {
            case 'dashboard':
                return <AgentDashboardHome {...props} />;
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
                // FIX: Pass onSendMessage to satisfy AgentMessagesProps requirement
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
                return <AgentBilling user={props.user} />;
            default:
                return <AgentDashboardHome {...props} />;
        }
    }

    return (
    <div className="flex h-full font-sans relative">
      {/* Mobile Header */}
      <div className="lg:hidden p-4 border-b border-slate-200 w-full flex justify-between items-center absolute top-0 left-0 bg-white/80 backdrop-blur-sm z-20">
          <h3 className="font-semibold capitalize text-slate-800">{activeView}</h3>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-800">
              {isSidebarOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
      </div>

      {/* Sidebar */}
      <div 
        style={{ width: isSidebarOpen ? '100%' : `${sidebarWidth}px` }}
        className={`
            absolute lg:relative top-0 left-0 h-full z-10 transition-all duration-200
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            lg:translate-x-0
        `}
      >
        <Sidebar 
            activeView={activeView} 
            setActiveView={setActiveView} 
            width={sidebarWidth}
            startResizing={startResizing}
            isSidebarOpen={isSidebarOpen}
            closeSidebar={() => setIsSidebarOpen(false)}
        />
      </div>

      <main className="flex-1 bg-slate-50 overflow-y-auto lg:pt-0 pt-[65px]">
        {renderContent()}
      </main>
    </div>
  );
};

export default AgentDashboard;
