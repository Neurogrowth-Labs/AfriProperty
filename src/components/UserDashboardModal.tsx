
import React from 'react';
import type { Property, TourRequest, User, SearchFilters, Message, CalendarEvent, AgentProfile, Review, Lead, Achievement, InvestorSettings, Currency, InvestmentRequest } from '../types';
import { CloseIcon } from './icons/NavIcons';
import UserDashboard from './dashboards/UserDashboard';
import AgentDashboard from './dashboards/AgentDashboard';
import InvestorDashboard from './dashboards/InvestorDashboard';
import { MoonIcon, SunIcon } from './icons/AgentDashboardIcons';
import { CURRENCY_SYMBOLS } from '../constants';

interface UserDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  allProperties: Property[];
  investmentProperties: Property[];
  tourRequests: TourRequest[];
  receivedInquiries: TourRequest[];
  savedSearches: SearchFilters[];
  savedProperties: Property[];
  propertiesToCompare: Property[];
  messages: Message[];
  calendarEvents: CalendarEvent[];
  agentProfile: AgentProfile | null;
  agentReviews: Review[];
  leads: Lead[];
  agentAchievements: Achievement[];
  investorAchievements: Achievement[];
  investmentRequests: InvestmentRequest[];
  investorSettings: InvestorSettings | null;
  currency: Currency;
  theme: 'light' | 'dark';
  onLogout: () => void;
  onEditProperty: (property: Property) => void;
  onDeleteProperty: (propertyId: string) => void;
  onDraftReply: (inquiry: TourRequest) => void;
  onRunSearch: (filters: SearchFilters) => void;
  onDeleteSearch: (filters: SearchFilters) => void;
  onListPropertyClick: () => void;
  onAddEvent: (eventData: Omit<CalendarEvent, 'id'>) => void;
  onUpdateEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  onOpenAIImprovementModal: (property: Property) => void;
  onUpdateAgentProfile: (profile: AgentProfile) => void;
  onUpdateAgentAchievements: (achievements: Achievement[]) => void;
  onUpdateInvestorAchievements: (achievements: Achievement[]) => void;
  onUpdateInvestorSettings: (settings: InvestorSettings) => void;
  onThemeToggle: () => void;
  onCompareClick: () => void;
  onCurrencyChange: (currency: Currency) => void;
  onUpgradeAccountRequest: () => void;
  onSendMessage: (messageData: Omit<Message, 'id' | 'timestamp'>) => Promise<void>;
  // Props for PropertyList, to be passed down
  onSaveToggle: (propertyId: string) => void;
  savedPropertyIds: Set<string>;
  onOpenCalculator: (property: Property) => void;
  onOpenTourModal: (property: Property) => void;
  onFindSimilar: (property: Property) => void;
  onOpenDetailModal: (property: Property) => void;
  onOpenVRTour: (url: string) => void;
  onToggleCompare: (property: Property) => void;
}

const UserDashboardModal: React.FC<UserDashboardModalProps> = (props) => {
    const { isOpen, onClose, user, theme, onThemeToggle, currency, onCurrencyChange } = props;
    
    if (!isOpen) return null;

    const renderDashboard = () => {
        switch (user.role) {
            case 'agent':
                return <AgentDashboard {...props} achievements={props.agentAchievements} onUpdateAchievements={props.onUpdateAgentAchievements} />;
            case 'investor':
                return <InvestorDashboard {...props} />;
            case 'user':
            default:
                return <UserDashboard {...props} />;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] sm:p-4" onClick={onClose}>
            <div 
                className="bg-white dark:bg-slate-900 w-full h-full sm:h-auto sm:rounded-xl shadow-2xl sm:max-w-6xl sm:max-h-[90vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" 
                onClick={e => e.stopPropagation()}
            >
                <header className="flex justify-between items-center p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-brand-dark dark:text-white">My Dashboard</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Welcome back, <span className="font-semibold">{user.username}</span>! 
                            <span className="ml-2 text-xs font-bold bg-brand-primary/10 text-brand-primary px-2 py-1 rounded-full capitalize">{user.role}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {user.role === 'investor' && (
                            <div className="relative">
                                <select
                                    value={currency}
                                    onChange={(e) => onCurrencyChange(e.target.value as Currency)}
                                    className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm rounded-md py-2 pl-3 pr-8 border-transparent focus:ring-2 focus:ring-brand-primary appearance-none"
                                >
                                    {Object.keys(CURRENCY_SYMBOLS).map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <button 
                            onClick={onThemeToggle} 
                            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? <MoonIcon className="w-5 h-5"/> : <SunIcon className="w-5 h-5"/>}
                        </button>
                        <button onClick={onClose} className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <CloseIcon className="w-6 h-6" />
                        </button>
                    </div>
                </header>
                
                <div className="flex-grow overflow-y-auto bg-slate-50 dark:bg-slate-800/50">
                   {renderDashboard()}
                </div>
                
                <footer className="bg-white dark:bg-slate-900 p-4 rounded-b-none sm:rounded-b-xl border-t dark:border-slate-700 flex justify-end">
                     <button 
                        onClick={props.onLogout}
                        className="bg-slate-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-slate-700 transition-all duration-300"
                    >
                        Log Out
                    </button>
                </footer>
            </div>
             <style>{`
                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in-scale {
                    animation: fadeInScale 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default UserDashboardModal;
