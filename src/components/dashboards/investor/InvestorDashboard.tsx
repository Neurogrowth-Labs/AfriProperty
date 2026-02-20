
import React, { useState } from 'react';
import type { User, Property, Achievement, InvestorSettings, Currency } from '../../../types';
import { DashboardIcon, PortfolioIcon, DiscoveryIcon, ToolsIcon, MarketplaceIcon, CommunityIcon, SettingsIcon, Bars3Icon, XMarkIcon } from '../../icons/InvestorDashboardIcons';
import InvestorDashboardHome from './InvestorDashboardHome';
import InvestorPortfolio from './InvestorPortfolio';
import InvestorPropertyDiscovery from './InvestorPropertyDiscovery';
import InvestorFinancialTools from './InvestorFinancialTools';
import InvestorGlobalMarketplace from './InvestorGlobalMarketplace';
// FIX: Corrected named import path for InvestorCommunity
import { InvestorCommunity } from './InvestorCommunity';
import InvestorSettingsPage from './InvestorSettings';
import { ChartBarIcon, DocumentTextIcon, ChatBubbleLeftRightIcon } from '../../icons/ActionIcons';
import InvestorReturns from './InvestorReturns';
import InvestorDocuments from './InvestorDocuments';
import InvestorMessages from './InvestorMessages';
import type { Message } from '../../../types';


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

type InvestorView = 'dashboard' | 'portfolio' | 'discovery' | 'tools' | 'marketplace' | 'community' | 'settings' | 'returns' | 'documents' | 'messages';

const Sidebar: React.FC<{ activeView: InvestorView; setActiveView: (view: InvestorView) => void; closeSidebar: () => void; }> = ({ activeView, setActiveView, closeSidebar }) => {
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
        { id: 'community', label: 'Community & Networking', icon: CommunityIcon },
        { id: 'settings', label: 'Settings', icon: SettingsIcon }
    ] as const;

    const handleItemClick = (view: InvestorView) => {
        setActiveView(view);
        closeSidebar();
    };

    return (
        <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col p-4 flex-shrink-0 h-full">
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
        </aside>
    );
};


const InvestorDashboard: React.FC<InvestorDashboardProps> = (props) => {
    const [activeView, setActiveView] = useState<InvestorView>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
            case 'settings':
                return <InvestorSettingsPage settings={props.investorSettings} onUpdateSettings={props.onUpdateInvestorSettings} user={props.user} />;
            default:
                return <InvestorDashboardHome {...props} />;
        }
    }

    return (
    <div className="flex h-full font-sans text-slate-800 dark:text-slate-200 relative">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 border-b border-slate-200 dark:border-slate-700 w-full flex justify-between items-center absolute top-0 left-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-20">
            <h3 className="font-semibold capitalize">{activeView}</h3>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
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

export default InvestorDashboard;
