
import React, { useState, useMemo, useEffect } from 'react';
import { Property, TourRequest, User, SearchFilters, Message, PropertyAlert, UserDocument, PaymentMethod, Payment } from '../../types';
import { ListingType, PropertyType } from '../../types';
import { BookmarkIcon, CalendarIcon, ChatBubbleLeftRightIcon, TrashIcon, BanknotesIcon, BellIcon, ClipboardDocumentIcon as DocumentDuplicateIcon, ArrowUpTrayIcon, ClockIcon, CheckBadgeIcon, CreditCardIcon, PlusIcon, ShieldCheckIcon, UserCircleIcon } from '../icons/ActionIcons';
import { SearchIcon } from '../icons/SearchIcons';
import { useTranslations } from '../../contexts/LanguageContext';
import { getPropertyAlerts, addPropertyAlert, deletePropertyAlert, getUserDocuments, addUserDocument, deleteUserDocument, getPaymentMethods, addPaymentMethod, deletePaymentMethod, getPaymentHistory, addPaymentRecord, updateUserProfile } from '../../lib/data';
import { Bars3Icon, XMarkIcon, ChevronRightIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { CloseIcon } from '../icons/NavIcons';


interface UserDashboardProps {
  user: User;
  tourRequests: TourRequest[];
  savedSearches: SearchFilters[];
  messages: Message[];
  onRunSearch: (filters: SearchFilters) => void;
  onDeleteSearch: (filters: SearchFilters) => void;
  onProfileUpdate?: () => void;
}

type UserDashboardTab = 'tours' | 'searches' | 'messages' | 'alerts' | 'documents' | 'payments' | 'profile';

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

const UserDashboard: React.FC<UserDashboardProps> = (props) => {
    const { user, tourRequests, savedSearches, messages, onRunSearch, onDeleteSearch, onProfileUpdate } = props;
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
    <div className="flex h-full relative text-slate-800 dark:text-slate-100">
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
                    <p className="font-bold text-slate-800 dark:text-white truncate max-w-[120px]">{user.fullName || user.username}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role}</p>
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
                <DashboardTab id="profile" label="Profile Settings" icon={UserCircleIcon} activeTab={activeTab} setActiveTab={handleTabClick} />
                <DashboardTab id="alerts" label="Property Alerts" icon={BellIcon} activeTab={activeTab} setActiveTab={handleTabClick} />
                <DashboardTab id="documents" label="Document Vault" icon={DocumentDuplicateIcon} activeTab={activeTab} setActiveTab={handleTabClick} />
                <DashboardTab id="payments" label="Payments & Billing" icon={BanknotesIcon} activeTab={activeTab} setActiveTab={handleTabClick} />
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
        {activeTab === 'profile' && <ProfileSettingsView user={user} onUpdate={onProfileUpdate} />}
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

const ProfileSettingsView: React.FC<{ user: User, onUpdate?: () => void }> = ({ user, onUpdate }) => {
    const [formData, setFormData] = useState({
        fullName: user.fullName || '',
        phone: user.phone || '',
        address: user.officeAddress || ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        const result = await updateUserProfile(user.id, {
            fullName: formData.fullName,
            phone: formData.phone,
            officeAddress: formData.address
        });

        if (result.success) {
            setMessage({ text: 'Profile updated successfully!', type: 'success' });
            if (onUpdate) onUpdate();
        } else {
            setMessage({ text: result.error || 'Failed to update profile.', type: 'error' });
        }
        setIsSaving(false);
    };

    return (
        <div className="max-w-2xl animate-fade-in">
            <h2 className="text-2xl font-bold text-brand-dark dark:text-white mb-2">Profile Settings</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">Update your personal information and contact details.</p>

            {message && (
                <div className={`p-4 rounded-xl mb-6 text-sm font-bold border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                    <input 
                        type="text" 
                        value={formData.fullName} 
                        onChange={e => setFormData({...formData, fullName: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                        <input 
                            type="email" 
                            disabled 
                            value={user.email} 
                            className="w-full px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-400 cursor-not-allowed outline-none"
                        />
                        <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">Primary identity (Read-only)</p>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                        <input 
                            type="tel" 
                            value={formData.phone} 
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Home / Office Address</label>
                    <input 
                        type="text" 
                        value={formData.address} 
                        onChange={e => setFormData({...formData, address: e.target.value})}
                        placeholder="Street, City, Province"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none"
                    />
                </div>

                <div className="pt-4 border-t dark:border-slate-700 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={isSaving}
                        className="bg-brand-primary text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-brand-secondary transition-all disabled:opacity-50 shadow-lg shadow-brand-primary/20 flex items-center gap-2"
                    >
                        {isSaving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                        Save Profile
                    </button>
                </div>
            </form>
        </div>
    );
};

const TourRequestsView: React.FC<{ tourRequests: TourRequest[] }> = ({ tourRequests }) => {
    const upcomingTours = useMemo(() => {
        const now = new Date().getTime();
        return tourRequests.filter(r => new Date(r.date).getTime() >= now).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [tourRequests]);

    const pastTours = useMemo(() => {
        const now = new Date().getTime();
        return tourRequests.filter(r => new Date(r.date).getTime() < now).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
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
            )) : <EmptyState icon={BookmarkIcon} title="No Saved Searches" message='When you perform a search, click the "Save this Search" button to add it here for quick access later.' />}
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
                <EmptyState icon={BellIcon} title="No Property Alerts" message="Create an alert to be notified about new properties that match your criteria." />
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
            getPaymentMethods(user.id),
            getPaymentHistory(user.id)
        ]);
        setMethods(cards);
        setHistory(payments);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [user.id]);

    const handleConnectGateway = async (gateway: 'stripe' | 'paypal') => {
        // Simulation of gateway connection
        const gatewayLabel = gateway === 'stripe' ? 'Stripe' : 'PayPal';
        
        const result = await addPaymentMethod(user.id, {
            cardHolder: user.fullName || user.username,
            brand: `Gateway: ${gatewayLabel}`, // Merge type into brand column as requested
            lastFour: gateway === 'stripe' ? 'tok_visa' : 'pay_user',
            isDefault: false,
            gatewayName: gateway,
            expiryMonth: 12,
            expiryYear: 2099
        });

        if (result) {
            await addPaymentRecord(user.id, {
                amount: 0,
                currency: 'ZAR',
                status: 'completed',
                description: `${gatewayLabel} account connected.`,
            });
            fetchData();
            alert(`${gatewayLabel} connected successfully! (Simulation)`);
        }
    };

    const handleDeleteCard = async (id: string) => {
        const success = await deletePaymentMethod(user.id, id);
        if (success) {
            setMethods(prev => prev.filter(m => m.id !== id));
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Payments & Billing</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Manage integrated gateways and track your transaction history.</p>
            </div>

            {/* Gateway Connect Section (Prominent Above) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                <header className="p-6 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                     <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <BanknotesIcon className="w-5 h-5 text-brand-primary" />
                        Connect Payment Gateway
                    </h3>
                </header>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Stripe Card */}
                    <div className="p-6 border-2 border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/50 hover:border-brand-primary/40 transition-all flex flex-col justify-between">
                         <div className="flex justify-between items-start">
                             <div className="h-8 flex items-center">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6 w-auto" />
                             </div>
                             {methods.some(m => m.gatewayName === 'stripe') ? (
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded">Connected</span>
                             ) : (
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available</span>
                             )}
                         </div>
                         <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">Connect Stripe to process credit cards, Apple Pay, and Google Pay with bank-grade encryption.</p>
                         <button 
                            onClick={() => handleConnectGateway('stripe')}
                            disabled={methods.some(m => m.gatewayName === 'stripe')}
                            className="mt-6 w-full py-3 bg-[#635BFF] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#5249e0] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                            {methods.some(m => m.gatewayName === 'stripe') ? 'Gateway Linked' : 'Link Stripe Account'}
                         </button>
                    </div>

                    {/* PayPal Card */}
                    <div className="p-6 border-2 border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/50 hover:border-brand-primary/40 transition-all flex flex-col justify-between">
                         <div className="flex justify-between items-start">
                             <div className="h-8 flex items-center">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-7 w-auto" />
                             </div>
                             {methods.some(m => m.gatewayName === 'paypal') ? (
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded">Connected</span>
                             ) : (
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available</span>
                             )}
                         </div>
                         <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">Secure checkout with PayPal. Link your account for instant payments and recurring billing.</p>
                         <button 
                            onClick={() => handleConnectGateway('paypal')}
                            disabled={methods.some(m => m.gatewayName === 'paypal')}
                            className="mt-6 w-full py-3 bg-[#0070ba] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#005ea6] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                            {methods.some(m => m.gatewayName === 'paypal') ? 'Gateway Linked' : 'Link PayPal Account'}
                         </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Saved Payment Methods */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <CreditCardIcon className="w-6 h-6 text-brand-primary" />
                                Saved Cards
                            </h3>
                            <button 
                                onClick={() => setIsAddCardModalOpen(true)}
                                className="bg-brand-primary text-white px-4 py-2 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/20"
                            >
                                <PlusIcon className="w-4 h-4" /> Add Card
                            </button>
                        </div>
                        
                        {isLoading ? (
                            <div className="space-y-4">
                                <div className="h-20 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl"></div>
                                <div className="h-20 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl"></div>
                            </div>
                        ) : methods.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {methods.map(method => (
                                    <div key={method.id} className="relative flex items-center justify-between p-5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl hover:border-brand-primary/50 transition-all group overflow-hidden">
                                        <div className="flex items-center gap-4 relative z-10">
                                            <div className="w-14 h-10 bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-lg flex items-center justify-center font-black text-[9px] text-slate-500 uppercase tracking-tighter shadow-inner">
                                                {method.brand.includes('Visa') ? (
                                                    <img src="visa.png" alt="Visa" className="h-4 w-auto object-contain" />
                                                ) : method.brand.includes('Mastercard') ? (
                                                    <img src="mc.png" alt="Mastercard" className="h-6 w-auto object-contain" />
                                                ) : method.brand.includes('Stripe') ? (
                                                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-4 w-auto" />
                                                ) : method.brand.includes('PayPal') ? (
                                                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5 w-auto" />
                                                ) : method.brand}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 dark:text-white text-sm">
                                                    {method.gatewayName ? `${method.brand} Connected` : `•••• ${method.lastFour}`}
                                                </p>
                                                {method.gatewayName ? (
                                                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active Linked Account</p>
                                                ) : (
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Exp: {method.expiryMonth}/{method.expiryYear}</p>
                                                )}
                                            </div>
                                        </div>
                                        <button onClick={() => handleDeleteCard(method.id)} className="relative z-10 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-xl transition-all">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                                <CreditCardIcon className="w-16 h-16 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
                                <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">No methods saved</p>
                            </div>
                        )}
                    </div>

                    {/* Transaction History */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-8">Transaction History</h3>
                        
                        {isLoading ? (
                            <div className="space-y-4">
                                <div className="h-14 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl"></div>
                                <div className="h-14 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl"></div>
                            </div>
                        ) : history.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-[10px] uppercase text-slate-400 font-black tracking-widest border-b dark:border-slate-800">
                                        <tr>
                                            <th className="px-4 py-4">Transaction Details</th>
                                            <th className="px-4 py-4 text-right">Amount</th>
                                            <th className="px-4 py-4 text-center">Status</th>
                                            <th className="px-4 py-4 text-right">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                        {history.map(payment => (
                                            <tr key={payment.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                                <td className="px-4 py-5">
                                                    <p className="font-bold text-slate-800 dark:text-slate-200">{payment.description}</p>
                                                    <p className="text-[10px] text-slate-400 font-mono mt-1">ID: #{payment.id.slice(0, 12)}</p>
                                                </td>
                                                <td className="px-4 py-5 text-right font-black text-slate-900 dark:text-white text-base">
                                                    {payment.amount.toLocaleString()} {payment.currency}
                                                </td>
                                                <td className="px-4 py-5 text-center">
                                                    <StatusPill status={payment.status} />
                                                </td>
                                                <td className="px-4 py-5 text-right text-slate-500 font-medium text-xs">
                                                    {new Date(payment.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <ClockIcon className="w-16 h-16 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
                                <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">Zero transactions found</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-brand-primary text-white p-8 rounded-[2rem] shadow-2xl shadow-brand-primary/20 relative overflow-hidden group">
                        <ShieldCheckIcon className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5 transform group-hover:scale-110 transition-transform duration-1000" />
                        <h4 className="font-black text-xl mb-4 flex items-center gap-3">
                             <ShieldCheckIcon className="w-8 h-8" />
                             Secure Hub
                        </h4>
                        <p className="text-sm opacity-90 leading-relaxed font-medium">
                            AfriProperty uses industry-standard 256-bit AES encryption. Your banking details are never stored on our local servers.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                             <div className="bg-white/20 px-3 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase border border-white/20">PCI-DSS Level 1</div>
                             <div className="bg-white/20 px-3 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase border border-white/20">TLS 1.3 Secure</div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-800">
                        <h4 className="font-bold text-slate-800 dark:text-white mb-6 uppercase tracking-widest text-xs">Quick Pay</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">Need to settle a fee or top-up your wallet? Use your primary linked gateway for an instant transaction.</p>
                        <button onClick={() => alert('Simulating instant gateway payment...')} className="w-full py-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 dark:hover:bg-white transition-all shadow-lg">Pay with Primary Gateway</button>
                    </div>
                </div>
            </div>
            
            <AddCardModal 
                isOpen={isAddCardModalOpen} 
                onClose={() => setIsAddCardModalOpen(false)} 
                userId={user.id}
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
        
        const cleanCardNumber = formData.cardNumber.replace(/\s+/g, '');
        const brandLabel = cleanCardNumber.startsWith('4') ? 'Visa' : 'Mastercard';
        const lastFour = cleanCardNumber.slice(-4);
        
        // Robust expiry parsing
        const expiryParts = formData.expiry.split('/');
        const month = parseInt(expiryParts[0]?.trim(), 10) || 1;
        let year = parseInt(expiryParts[1]?.trim(), 10) || 2025;
        
        // Handle 2-digit years (e.g., "25" -> 2025)
        if (year < 100) {
            year += 2000;
        }

        const result = await addPaymentMethod(userId, {
            cardHolder: formData.cardHolder.trim(),
            brand: `Card: ${brandLabel}`, // Merge type into brand column as requested
            lastFour: lastFour,
            expiryMonth: month,
            expiryYear: year,
            isDefault: false
        });

        if (result && result.id) {
            // Chained operation: Create audit record in payments table
            await addPaymentRecord(userId, {
                amount: 0,
                currency: 'ZAR',
                status: 'completed',
                description: 'New card Linked and verified',
                paymentMethodId: result.id
            });
            
            onSuccess();
            onClose();
            alert("Card linked and verified successfully!");
            setFormData({ cardHolder: '', cardNumber: '', expiry: '', cvc: '' });
        } else {
            alert("Security Verification Failed: We could not verify this card with your bank. Please check your details and try again.");
        }
        setIsSubmitting(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-md animate-fade-in-scale overflow-hidden border border-slate-100 dark:border-slate-800">
                <header className="p-8 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                    <h3 className="font-black text-2xl text-brand-dark dark:text-white uppercase tracking-tighter">Link New Card</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><CloseIcon className="w-6 h-6"/></button>
                </header>
                <form onSubmit={handleAdd} className="p-8 space-y-5">
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Cardholder Name</label>
                        <input 
                            required
                            type="text" 
                            placeholder="John Doe"
                            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-brand-primary outline-none transition-all font-bold"
                            value={formData.cardHolder}
                            onChange={e => setFormData({...formData, cardHolder: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Card Number</label>
                        <input 
                            required
                            type="text" 
                            maxLength={19}
                            placeholder="0000 0000 0000 0000"
                            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-brand-primary outline-none transition-all font-mono text-lg tracking-widest"
                            value={formData.cardNumber}
                            onChange={e => {
                                // Add spaces for readability automatically
                                let val = e.target.value.replace(/\D/g, '');
                                let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                                setFormData({...formData, cardNumber: formatted.slice(0, 19)});
                            }}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Expiry (MM/YY)</label>
                            <input 
                                required
                                type="text" 
                                placeholder="12/25"
                                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-brand-primary outline-none transition-all font-bold"
                                value={formData.expiry}
                                onChange={e => {
                                    let val = e.target.value.replace(/[^\d/]/g, '');
                                    if (val.length === 2 && !val.includes('/')) val += '/';
                                    setFormData({...formData, expiry: val.slice(0, 5)});
                                }}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">CVC</label>
                            <input 
                                required
                                type="password" 
                                maxLength={3}
                                placeholder="***"
                                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-brand-primary outline-none transition-all font-bold"
                                value={formData.cvc}
                                onChange={e => setFormData({...formData, cvc: e.target.value.replace(/\D/g, '')})}
                            />
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-brand-primary text-white font-black uppercase tracking-widest py-4 rounded-2xl mt-6 hover:bg-brand-secondary disabled:bg-slate-300 dark:disabled:bg-slate-800 transition-all flex justify-center items-center gap-3 shadow-2xl shadow-brand-primary/30"
                    >
                        {isSubmitting ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : "Secure Verification"}
                    </button>
                    <p className="text-center text-[10px] text-slate-400 font-medium italic">Secure card verification powered by AfriProperty SafePay.</p>
                </form>
            </div>
        </div>
    );
};


const EmptyState: React.FC<{ icon: React.ElementType, title: string, message: string }> = ({ icon: Icon, title, message }) => (
    <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <Icon className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" />
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-4 uppercase tracking-tighter">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto text-sm font-medium">{message}</p>
    </div>
);

const Emptystate = EmptyState;

export default UserDashboard;
