import React, { useState, useMemo, useEffect } from 'react';
import { Property, TourRequest, User, SearchFilters, Message, PropertyAlert, UserDocument, PaymentMethod, Payment } from '../../types';
import { ListingType, PropertyType } from '../../types';
// Add ShieldCheckIcon to imports
import { BookmarkIcon, CalendarIcon, ChatBubbleLeftRightIcon, TrashIcon, BanknotesIcon, BellIcon, ClipboardDocumentIcon as DocumentDuplicateIcon, ArrowUpTrayIcon, ClockIcon, CheckBadgeIcon, CreditCardIcon, PlusIcon, ShieldCheckIcon } from '../icons/ActionIcons';
import { SearchIcon } from '../icons/SearchIcons';
import { useTranslations } from '../../contexts/LanguageContext';
import { getPropertyAlerts, addPropertyAlert, deletePropertyAlert, getUserDocuments, addUserDocument, deleteUserDocument, getPaymentMethods, addPaymentMethod, deletePaymentMethod, getPaymentHistory, addPaymentRecord } from '../../lib/data';
import { Bars3Icon, XMarkIcon, ChevronRightIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { CloseIcon } from '../icons/NavIcons';


interface UserDashboardProps {
  user: User;
  tourRequests: TourRequest[];
  savedSearches: SearchFilters[];
  messages: Message[];
  onRunSearch: (filters: SearchFilters) => void;
  onDeleteSearch: (filters: SearchFilters) => void;
}

type UserDashboardTab = 'tours' | 'searches' | 'messages' | 'alerts' | 'documents' | 'payments';

const UserDashboard: React.FC<UserDashboardProps> = (props) => {
    const { user, tourRequests, savedSearches, messages, onRunSearch, onDeleteSearch } = props;
    const [activeTab, setActiveTab] = useState<UserDashboardTab>('tours');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { t } = useTranslations();

    const groupedMessages = useMemo(() => {
        return messages.reduce((acc: Record<string, Message[]>, msg) => {
            if (!acc[msg.propertyId]) {
                acc[msg.propertyId] = [];
            }
            acc[msg.propertyId].push(msg);
            return acc;
        }, {} as Record<string, Message[]>);
    }, [messages]);
    
    const handleTabClick = (tab: UserDashboardTab) => {
        setActiveTab(tab);
        setIsSidebarOpen(false);
    };

  return (
    <div className="flex h-full relative">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 border-b border-slate-200 dark:border-slate-700 w-full flex justify-between items-center absolute top-0 left-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-20">
            <h3 className="font-semibold capitalize text-slate-800 dark:text-white">{activeTab}</h3>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-800 dark:text-white">
                {isSidebarOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
        </div>

      <div className={`
            absolute lg:relative top-0 left-0 h-full z-10 transition-transform transform 
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            lg:translate-x-0
        `}>
        <nav className="w-64 p-5 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-y-auto h-full flex-shrink-0">
            <div className="flex items-center gap-3 mb-6">
                <img src={user.profilePicture || `https://i.pravatar.cc/150?u=${user.username}`} alt="Profile" className="w-10 h-10 rounded-full object-cover"/>
                <div>
                    <p className="font-bold text-slate-800 dark:text-white truncate">{user.fullName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Property Seeker</p>
                </div>
            </div>
            <h3 className="text-xs font-semibold uppercase text-slate-400 mb-2">My Journey</h3>
            <ul className="space-y-1">
                <DashboardTab id="tours" label="Tour Tracking" icon={CalendarIcon} activeTab={activeTab} setActiveTab={handleTabClick} />
                <DashboardTab id="searches" label="Saved Searches" icon={BookmarkIcon} activeTab={activeTab} setActiveTab={handleTabClick} />
                <DashboardTab id="messages" label="Agent Messages" icon={ChatBubbleLeftRightIcon} activeTab={activeTab} setActiveTab={handleTabClick} />
            </ul>
            <h3 className="text-xs font-semibold uppercase text-slate-400 mt-6 mb-2">My Profile</h3>
            <ul className="space-y-1">
                <DashboardTab id="alerts" label="Property Alerts" icon={BellIcon} activeTab={activeTab} setActiveTab={handleTabClick} />
                <DashboardTab id="documents" label="Document Vault" icon={DocumentDuplicateIcon} activeTab={activeTab} setActiveTab={handleTabClick} />
                <DashboardTab id="payments" label="Payments" icon={BanknotesIcon} activeTab={activeTab} setActiveTab={handleTabClick} />
            </ul>
        </nav>
      </div>
      <main className="flex-1 p-6 bg-slate-50 dark:bg-slate-800/50 overflow-y-auto lg:pt-6 pt-[70px]">
        {activeTab === 'tours' && <TourRequestsView tourRequests={tourRequests} />}
        {activeTab === 'searches' && <SavedSearchesView savedSearches={savedSearches} onRunSearch={onRunSearch} onDeleteSearch={onDeleteSearch} />}
        {activeTab === 'messages' && <MessagesView groupedMessages={groupedMessages} user={user} />}
        {activeTab === 'alerts' && <PropertyAlertsView user={user} />}
        {activeTab === 'documents' && <DocumentVaultView user={user} />}
        {activeTab === 'payments' && <PaymentsView user={user} />}
      </main>
    </div>
  );
};

const DashboardTab: React.FC<{id: UserDashboardTab, label: string, icon: React.ElementType, activeTab: UserDashboardTab, setActiveTab: (tab: UserDashboardTab) => void}> = ({ id, label, icon: Icon, activeTab, setActiveTab }) => (
    <li>
        <button onClick={() => setActiveTab(id)} className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === id ? 'bg-brand-primary/10 text-brand-primary dark:bg-slate-700' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}>
            <Icon className="w-5 h-5"/> {label}
        </button>
    </li>
);

const StatusPill: React.FC<{ status: string }> = ({ status }) => {
    let colorClasses = 'bg-slate-100 text-slate-800';
    if (status === 'Confirmed' || status === 'completed') colorClasses = 'bg-emerald-100 text-emerald-800';
    if (status === 'Pending' || status === 'pending') colorClasses = 'bg-amber-100 text-amber-800';
    if (status === 'Cancelled' || status === 'failed') colorClasses = 'bg-red-100 text-red-800';

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${colorClasses}`}>
            {status}
        </span>
    );
};

const TourRequestsView: React.FC<{ tourRequests: TourRequest[] }> = ({ tourRequests }) => {
    const upcomingTours = useMemo(() => {
        const now = new Date().getTime();
        return tourRequests.filter(r => new Date(r.date).getTime() >= now).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [tourRequests]);

    const pastTours = useMemo(() => {
        const now = new Date().getTime();
        return tourRequests.filter(r => new Date(r.date).getTime() < now).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [tourRequests]);

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h2 className="text-2xl font-bold text-brand-dark dark:text-white">Upcoming Tours & Tracking</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Track your property viewing schedule and booking status.</p>
            </div>

            {upcomingTours.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                    {upcomingTours.map(r => (
                        <div key={r.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="flex gap-4">
                                    <div className="bg-brand-light dark:bg-slate-700 p-3 rounded-xl flex-shrink-0">
                                        <CalendarIcon className="w-8 h-8 text-brand-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-slate-900 dark:text-white">{r.propertyTitle}</h4>
                                        <div className="flex items-center gap-3 mt-1 text-sm text-slate-500 dark:text-slate-400">
                                            <span className="flex items-center gap-1"><ClockIcon className="w-4 h-4"/> {r.date} at {r.time}</span>
                                            <span className="hidden sm:inline">&middot;</span>
                                            <span className="text-xs font-mono">Ref: #{r.id.slice(0, 8)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                                    <StatusPill status={r.status} />
                                    <button className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1">
                                        View Details <ChevronRightIcon className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="bg-slate-50 dark:bg-slate-900/50 px-5 py-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center overflow-x-auto no-scrollbar">
                                <TimelineStep active={true} label="Requested" subLabel={new Date(r.timestamp).toLocaleDateString()} />
                                <div className="flex-grow h-0.5 bg-slate-200 dark:bg-slate-700 mx-4 min-w-[20px]"></div>
                                <TimelineStep active={r.status === 'Confirmed'} label="Confirmed" subLabel="Agent Review" />
                                <div className="flex-grow h-0.5 bg-slate-200 dark:bg-slate-700 mx-4 min-w-[20px]"></div>
                                <TimelineStep active={false} label="Tour Day" subLabel="Viewing" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState icon={CalendarIcon} title="No Upcoming Tours" message="Explore our listings and book a viewing to start tracking your property journey." />
            )}

            {pastTours.length > 0 && (
                <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Past Viewings</h3>
                    <div className="space-y-3 opacity-60">
                        {pastTours.map(r => (
                            <div key={r.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CheckBadgeIcon className="w-5 h-5 text-slate-400" />
                                    <div>
                                        <p className="font-semibold text-sm text-slate-800 dark:text-white">{r.propertyTitle}</p>
                                        <p className="text-xs text-slate-500">{r.date}</p>
                                    </div>
                                </div>
                                <StatusPill status={r.status} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const TimelineStep: React.FC<{ active: boolean; label: string; subLabel: string }> = ({ active, label, subLabel }) => (
    <div className="flex flex-col items-center text-center min-w-[80px]">
        <div className={`w-3 h-3 rounded-full mb-1 ${active ? 'bg-brand-primary ring-4 ring-brand-primary/20' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
        <p className={`text-[10px] font-bold uppercase tracking-tight ${active ? 'text-brand-primary' : 'text-slate-400'}`}>{label}</p>
        <p className="text-[9px] text-slate-400 truncate w-full">{subLabel}</p>
    </div>
);

// FIX: Added formatSearchFilters helper function
const formatSearchFilters = (filters: SearchFilters) => {
    const parts = [];
    if(filters.location) parts.push(filters.location);
    if(filters.listingType !== ListingType.ALL) parts.push(filters.listingType);
    if(filters.propertyType !== PropertyType.ALL) parts.push(filters.propertyType);
    if(filters.bedrooms > 0) parts.push(`${filters.bedrooms}+ beds`);
    if(filters.bathrooms > 0) parts.push(`${filters.bathrooms}+ baths`);
    if(filters.amenities && filters.amenities.length > 0) parts.push(`${filters.amenities.length} amenities`);
    return parts.join(', ') || 'Any property';
};

const SavedSearchesView: React.FC<{ savedSearches: SearchFilters[], onRunSearch: (f: SearchFilters) => void, onDeleteSearch: (f: SearchFilters) => void }> = ({ savedSearches, onRunSearch, onDeleteSearch }) => (
     <div>
        <h2 className="text-2xl font-bold text-brand-dark dark:text-white mb-4">Saved Searches ({savedSearches?.length || 0})</h2>
        <div className="space-y-4">
            {savedSearches && Array.isArray(savedSearches) && savedSearches.length > 0 ? (savedSearches as SearchFilters[]).map((search, index) => (
                <div key={index} className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                        <BookmarkIcon className="w-6 h-6 text-brand-primary flex-shrink-0" />
                        <p className="text-sm text-slate-700 dark:text-slate-200">{formatSearchFilters(search)}</p>
                    </div>
                    <div className="flex items-center gap-3 self-end sm:self-center">
                        <button onClick={() => onRunSearch(search)} className="bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2">
                            <SearchIcon className="w-4 h-4" /> Run
                        </button>
                        <button onClick={() => onDeleteSearch(search)} className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10"><TrashIcon className="w-5 h-5"/></button>
                    </div>
                </div>
            )) : <Emptystate icon={BookmarkIcon} title="No Saved Searches" message='When you perform a search, click the "Save this Search" button to add it here for quick access later.' />}
        </div>
    </div>
);

const MessagesView: React.FC<{ groupedMessages: Record<string, Message[]>, user: User }> = ({ groupedMessages, user }) => (
    <div>
        <h2 className="text-2xl font-bold text-brand-dark dark:text-white mb-4">Agent Messages</h2>
        <div className="space-y-6">
            {Object.keys(groupedMessages).length > 0 ? Object.entries(groupedMessages).map(([propertyId, msgs]: [string, Message[]]) => (
                <div key={propertyId} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                    <h3 className="font-bold text-brand-dark dark:text-white mb-3 border-b pb-2 dark:border-slate-700">{msgs[0].propertyTitle}</h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {msgs.map(msg => (
                            <div key={msg.id} className={`flex ${msg.senderUsername === user.username ? 'justify-end' : 'justify-start'}`}>
                                <div className={`px-3 py-2 rounded-lg max-w-sm ${msg.senderUsername === user.username ? 'bg-brand-primary text-white' : 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200'}`}>
                                    <p className="text-sm">{msg.text}</p>
                                    <p className="text-xs opacity-70 mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )) : <Emptystate icon={ChatBubbleLeftRightIcon} title="No Messages" message="Messages you send to agents about properties will appear here." />}
        </div>
    </div>
);

const PropertyAlertsView: React.FC<{ user: User }> = ({ user }) => {
    const [alerts, setAlerts] = useState<PropertyAlert[]>([]);
    const [newAlertName, setNewAlertName] = useState('');

    useEffect(() => {
        const fetchAlerts = async () => {
            const data = await getPropertyAlerts(user.username);
            setAlerts(Array.isArray(data) ? (data as PropertyAlert[]) : []);
        };
        fetchAlerts();
    }, [user.username]);

    const handleAddAlert = async (e: React.FormEvent) => {
        e.preventDefault();
        const newAlert = await addPropertyAlert(user.username, { name: newAlertName, criteria: {} });
        setAlerts(prev => [newAlert, ...prev]);
        setNewAlertName('');
    };

    const handleDeleteAlert = async (id: string) => {
        await deletePropertyAlert(user.username, id);
        setAlerts(prev => prev.filter(a => a.id !== id));
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-brand-dark dark:text-white mb-4">Property Alerts</h2>
            <form onSubmit={handleAddAlert} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row items-center gap-2">
                <input type="text" value={newAlertName} onChange={e => setNewAlertName(e.target.value)} placeholder="e.g., '2-bed Apt in Urbanville'" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-brand-primary focus:border-brand-primary dark:bg-slate-700 dark:border-slate-600" required />
                <button type="submit" className="w-full sm:w-auto bg-brand-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-opacity-90 flex-shrink-0">Create Alert</button>
            </form>
             {alerts.length > 0 ? (
                <div className="space-y-3">
                    {alerts.map(alert => (
                        <div key={alert.id} className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm flex items-center justify-between">
                            <p className="font-semibold text-slate-700 dark:text-slate-200">{alert.name}</p>
                            <button onClick={() => handleDeleteAlert(alert.id)} className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10"><TrashIcon className="w-5 h-5"/></button>
                        </div>
                    ))}
                </div>
             ) : (
                <Emptystate icon={BellIcon} title="No Property Alerts" message="Create an alert to be notified about new properties that match your criteria." />
             )}
        </div>
    );
};

const DocumentVaultView: React.FC<{ user: User }> = ({ user }) => {
    const [docs, setDocs] = useState<UserDocument[]>([]);

    useEffect(() => {
        const fetchDocs = async () => {
            const data = await getUserDocuments(user.username);
            setDocs(Array.isArray(data) ? (data as UserDocument[]) : []);
        };
        fetchDocs();
    }, [user.username]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const newDoc = await addUserDocument(user.username, file);
            setDocs(prev => [newDoc, ...prev]);
        }
    };
    
    const handleDeleteDoc = async (id: string) => {
        await deleteUserDocument(user.username, id);
        setDocs(prev => prev.filter(d => d.id !== id));
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-brand-dark dark:text-white mb-4">Document Vault</h2>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-sm text-slate-600 dark:text-slate-300">Securely store documents like KYC, proof of funds, and rental applications.</p>
                <label htmlFor="doc-upload" className="bg-brand-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-opacity-90 cursor-pointer flex items-center gap-2 w-full sm:w-auto justify-center">
                    <ArrowUpTrayIcon className="w-5 h-5" /> Upload
                </label>
                <input type="file" id="doc-upload" className="hidden" onChange={handleFileChange} />
            </div>
             {docs.length > 0 ? (
                <div className="space-y-3">
                    {docs.map(doc => (
                        <div key={doc.id} className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm flex items-center justify-between">
                            <p className="font-semibold text-slate-700 dark:text-slate-200 truncate pr-4">{doc.name}</p>
                            <button onClick={() => handleDeleteDoc(doc.id)} className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 flex-shrink-0"><TrashIcon className="w-5 h-5"/></button>
                        </div>
                    ))}
                </div>
            ): <Emptystate icon={DocumentDuplicateIcon} title="Document Vault is Empty" message="Upload important documents here for easy access when you're ready to make an offer or apply for a rental." />}
        </div>
    );
};

const PaymentsView: React.FC<{ user: User }> = ({ user }) => {
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [history, setHistory] = useState<Payment[]>([]);
    const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        const [cards, payments] = await Promise.all([
            getPaymentMethods(user.username),
            getPaymentHistory(user.username)
        ]);
        setMethods(cards);
        setHistory(payments);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [user.username]);

    const handleDeleteCard = async (id: string) => {
        const success = await deletePaymentMethod(user.username, id);
        if (success) {
            setMethods(prev => prev.filter(m => m.id !== id));
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-brand-dark dark:text-white">Payments & Billing</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your payment methods and view history.</p>
                </div>
                <button 
                    onClick={() => setIsAddCardModalOpen(true)}
                    className="bg-brand-primary text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-opacity-90 transition-all"
                >
                    <PlusIcon className="w-4 h-4" /> Add a Card
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                            <CreditCardIcon className="w-5 h-5 text-brand-primary" />
                            Saved Payment Methods
                        </h3>
                        
                        {isLoading ? (
                            <div className="space-y-3">
                                <div className="h-16 bg-slate-100 dark:bg-slate-700 animate-pulse rounded-lg"></div>
                                <div className="h-16 bg-slate-100 dark:bg-slate-700 animate-pulse rounded-lg"></div>
                            </div>
                        ) : methods.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {methods.map(method => (
                                    <div key={method.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl hover:border-brand-primary/30 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-8 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center font-bold text-[10px] text-slate-500 uppercase tracking-tighter">
                                                {method.brand}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 dark:text-white">•••• {method.lastFour}</p>
                                                <p className="text-[10px] text-slate-500">Exp: {method.expiryMonth}/{method.expiryYear}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDeleteCard(method.id)} className="text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-full transition-all">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                                <CreditCardIcon className="w-12 h-12 text-slate-300 mx-auto mb-2 opacity-50" />
                                <p className="text-slate-500 dark:text-slate-400 text-sm">No payment methods saved.</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Transaction History</h3>
                        
                        {isLoading ? (
                            <div className="space-y-3">
                                <div className="h-12 bg-slate-100 dark:bg-slate-700 animate-pulse rounded-lg"></div>
                                <div className="h-12 bg-slate-100 dark:bg-slate-700 animate-pulse rounded-lg"></div>
                            </div>
                        ) : history.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs uppercase text-slate-500 font-bold border-b dark:border-slate-700">
                                        <tr>
                                            <th className="px-4 py-3">Description</th>
                                            <th className="px-4 py-3 text-right">Amount</th>
                                            <th className="px-4 py-3 text-center">Status</th>
                                            <th className="px-4 py-3 text-right">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {history.map(payment => (
                                            <tr key={payment.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                                <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">{payment.description}</td>
                                                <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white">{payment.amount} {payment.currency}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <StatusPill status={payment.status} />
                                                </td>
                                                <td className="px-4 py-3 text-right text-slate-500 text-xs">{new Date(payment.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                                <ClockIcon className="w-12 h-12 text-slate-300 mx-auto mb-2 opacity-50" />
                                <p className="text-slate-500 dark:text-slate-400 text-sm">No transactions yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-brand-primary text-white p-6 rounded-xl shadow-lg shadow-brand-primary/20 relative overflow-hidden">
                        <ShieldCheckIcon className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10" />
                        <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                             <ShieldCheckIcon className="w-5 h-5" />
                             Verified Secure
                        </h4>
                        <p className="text-sm opacity-90 leading-relaxed">
                            Your payment information is protected by industry-standard encryption and processed through secure, bank-grade infrastructure.
                        </p>
                        <div className="mt-6 flex gap-3">
                             <div className="bg-white/20 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase">PCI Compliant</div>
                             <div className="bg-white/20 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase">SSL Encrypted</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <AddCardModal 
                isOpen={isAddCardModalOpen} 
                onClose={() => setIsAddCardModalOpen(false)} 
                userId={user.username}
                onSuccess={fetchData}
            />
        </div>
    );
}

const AddCardModal: React.FC<{ isOpen: boolean; onClose: () => void; userId: string; onSuccess: () => void }> = ({ isOpen, onClose, userId, onSuccess }) => {
    const [formData, setFormData] = useState({
        cardHolder: '',
        cardNumber: '',
        expiry: '',
        cvc: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const brand = formData.cardNumber.startsWith('4') ? 'Visa' : 'Mastercard';
        const lastFour = formData.cardNumber.slice(-4);
        const [month, year] = formData.expiry.split('/');

        // FIX: Added missing providerType property to the addPaymentMethod call in AddCardModal to satisfy the type requirement of Omit<PaymentMethod, "id">.
        const result = await addPaymentMethod(userId, {
            cardHolder: formData.cardHolder,
            brand: brand,
            lastFour: lastFour,
            expiryMonth: parseInt(month, 10) || 12,
            expiryYear: parseInt(year, 10) || 25,
            isDefault: false,
            providerType: 'card'
        });

        if (result) {
            // Log an initial activation transaction
            await addPaymentRecord(userId, {
                amount: 0,
                currency: 'ZAR',
                status: 'completed',
                description: 'Card Verification & Integration',
            });
            onSuccess();
            onClose();
            setFormData({ cardHolder: '', cardNumber: '', expiry: '', cvc: '' });
        } else {
            alert("Failed to add card. Please check your data.");
        }
        setIsSubmitting(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-scale overflow-hidden">
                <header className="p-5 border-b dark:border-slate-800 flex justify-between items-center">
                    <h3 className="font-bold text-xl text-brand-dark dark:text-white">Add a New Card</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><CloseIcon className="w-6 h-6"/></button>
                </header>
                <form onSubmit={handleAdd} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cardholder Name</label>
                        <input 
                            required
                            type="text" 
                            placeholder="John Doe"
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            value={formData.cardHolder}
                            onChange={e => setFormData({...formData, cardHolder: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Card Number</label>
                        <input 
                            required
                            type="text" 
                            maxLength={16}
                            placeholder="0000 0000 0000 0000"
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                            value={formData.cardNumber}
                            onChange={e => setFormData({...formData, cardNumber: e.target.value.replace(/\D/g, '')})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Expiry (MM/YY)</label>
                            <input 
                                required
                                type="text" 
                                placeholder="12/25"
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                value={formData.expiry}
                                onChange={e => setFormData({...formData, expiry: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">CVC</label>
                            <input 
                                required
                                type="password" 
                                maxLength={3}
                                placeholder="***"
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                value={formData.cvc}
                                onChange={e => setFormData({...formData, cvc: e.target.value})}
                            />
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-brand-primary text-white font-bold py-3 rounded-xl mt-4 hover:bg-opacity-90 disabled:bg-slate-400 transition-all flex justify-center items-center gap-2 shadow-lg"
                    >
                        {isSubmitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Securely Save Card"}
                    </button>
                </form>
            </div>
        </div>
    );
};


const EmptyState: React.FC<{ icon: React.ElementType, title: string, message: string }> = ({ icon: Icon, title, message }) => (
    <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <Icon className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
        <h3 className="text-xl font-semibold text-slate-800 dark:text-white mt-4">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto text-sm">{message}</p>
    </div>
);

const Emptystate = EmptyState;

export default UserDashboard;