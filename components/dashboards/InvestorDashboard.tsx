


import React, { useState } from 'react';
import type { User, Property, Achievement, InvestorSettings, Currency } from '../../types';
import { DashboardIcon, PortfolioIcon, DiscoveryIcon, ToolsIcon, MarketplaceIcon, CommunityIcon, SettingsIcon, Bars3Icon, XMarkIcon } from '../icons/InvestorDashboardIcons';
import InvestorDashboardHome from './investor/InvestorDashboardHome';
import InvestorPortfolio from './investor/InvestorPortfolio';
import InvestorPropertyDiscovery from './investor/InvestorPropertyDiscovery';
import InvestorFinancialTools from './investor/InvestorFinancialTools';
import InvestorGlobalMarketplace from './investor/InvestorGlobalMarketplace';
// FIX: Changed to a named import to match the named export from InvestorCommunity.tsx
import { InvestorCommunity } from './investor/InvestorCommunity';
import InvestorSettingsPage from './investor/InvestorSettings';
import { ChartBarIcon, DocumentTextIcon, ChatBubbleLeftRightIcon } from '../icons/ActionIcons';
import { CreditCardIcon } from '../icons/AgentDashboardIcons';
import SubscriptionManagement from './common/SubscriptionManagement';
import InvestorReturns from './investor/InvestorReturns';
import InvestorDocuments from './investor/InvestorDocuments';
import InvestorMessages from './investor/InvestorMessages';
import type { Message } from '../../types';


interface InvestorDashboardProps {
  user: User;
  allProperties: Property[];
  investmentProperties: Property[];
  savedProperties: Property[];
  propertiesToCompare: Property[];
  investorSettings: InvestorSettings | null;
  investorAchievements: Achievement[];
  currency: Currency;
  messages: Message[];
  onCompareClick: () => void;
  onClose: () => void;
  onUpdateInvestorSettings: (settings: InvestorSettings) => void;
  onUpdateInvestorAchievements: (achievements: Achievement[]) => void;
  // Props for PropertyList
  onSaveToggle: (propertyId: string) => void;
  savedPropertyIds: Set<string>;
  onOpenCalculator: (property: Property) => void;
  onOpenTourModal: (property: Property) => void;
  onFindSimilar: (property: Property) => void;
  onOpenDetailModal: (property: Property) => void;
  onOpenVRTour: (url: string) => void;
  onToggleCompare: (property: Property) => void;
}

type InvestorView = 'dashboard' | 'portfolio' | 'discovery' | 'tools' | 'marketplace' | 'community' | 'settings' | 'returns' | 'documents' | 'messages' | 'subscription';

const Sidebar: React.FC<{ 
    activeView: InvestorView; 
    setActiveView: (view: InvestorView) => void; 
    closeSidebar: () => void; 
    width: number;
    startResizing: (e: React.MouseEvent) => void;
    isSidebarOpen: boolean;
}> = ({ activeView, setActiveView, closeSidebar, width, startResizing, isSidebarOpen }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
        { id: 'portfolio', label: 'My Investments', icon: PortfolioIcon },
        { id: 'returns', label: 'Returns & Dividends', icon: ChartBarIcon },
        { id: 'documents', label: 'Contracts & Statements', icon: DocumentTextIcon },
        { id: 'discovery', label: 'Investment Marketplace', icon: DiscoveryIcon },
        { id: 'tools', label: 'Financial Tools', icon: ToolsIcon },
        { id: 'marketplace', label: 'Global Marketplace', icon: MarketplaceIcon },
    ] as const;

    const bottomNavItems = [
        { id: 'messages', label: 'Developer Messages', icon: ChatBubbleLeftRightIcon },
        { id: 'subscription', label: 'Subscription & Billing', icon: CreditCardIcon },
        { id: 'community', label: 'Community & Networking', icon: CommunityIcon },
        { id: 'settings', label: 'Settings', icon: SettingsIcon }
    ] as const;

    const handleItemClick = (view: InvestorView) => {
        setActiveView(view);
        closeSidebar();
    };

    return (
        <aside 
            style={{ width: isSidebarOpen ? '100%' : `${width}px` }}
            className="relative bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col p-4 flex-shrink-0 h-full"
        >
            <div className="flex-grow">
                 <h3 className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500 mb-4 px-3">INVESTOR TOOLS</h3>
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
            <div className="flex-shrink-0 space-y-1">
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

            {/* Resizer Handle */}
            <div 
                onMouseDown={startResizing}
                className="hidden lg:block absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-brand-primary/30 transition-colors z-20"
            />
        </aside>
    );
};


const InvestorDashboard: React.FC<InvestorDashboardProps> = (props) => {
    const [activeView, setActiveView] = useState<InvestorView>('dashboard');
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
                return <InvestorDashboardHome {...props} />;
            case 'portfolio':
                return <InvestorPortfolio {...props} />;
            case 'returns':
                return <InvestorReturns {...props} />;
            case 'documents':
                return <InvestorDocuments {...props} />;
            case 'discovery':
                return <InvestorPropertyDiscovery {...props} />;
            case 'tools':
                return <InvestorFinancialTools currency={props.currency} />;
            case 'marketplace':
                return <InvestorGlobalMarketplace onOpenDetailModal={props.onOpenDetailModal} />;
             case 'messages':
                return <InvestorMessages {...props} />;
            case 'community':
                return <InvestorCommunity {...props} />;
            case 'subscription':
                return (
                    <div className="p-8">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Subscription & Billing</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your investor plan and billing records.</p>
                        </div>
                        <SubscriptionManagement user={props.user} />
                    </div>
                );
            case 'settings':
                return <InvestorSettingsPage settings={props.investorSettings} onUpdateSettings={props.onUpdateInvestorSettings} user={props.user} />;
            default:
                return <InvestorDashboardHome {...props} />;
        }
    }

    return (
    <div className="flex h-full font-sans text-slate-800 dark:text-slate-200 relative">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 border-b border-slate-200 dark:border-slate-700 w-full flex justify-between items-center absolute top-0 left-0 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm z-20">
            <h3 className="font-semibold capitalize">{activeView}</h3>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
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
                closeSidebar={() => setIsSidebarOpen(false)} 
                width={sidebarWidth}
                startResizing={startResizing}
                isSidebarOpen={isSidebarOpen}
            />
        </div>

        <main className="flex-1 bg-slate-50 dark:bg-slate-800/50 overflow-y-auto lg:pt-0 pt-[65px]">
            {renderContent()}
        </main>
    </div>
  );
};

export default InvestorDashboard;