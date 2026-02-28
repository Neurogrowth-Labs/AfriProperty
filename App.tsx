
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import PropertyList from './components/PropertyList';
import { CATEGORIES, AGENT_ACHIEVEMENTS, INVESTOR_ACHIEVEMENTS } from './constants';
import type { Property, SearchFilters, TourRequest, User, Message, Review, CalendarEvent, AgentProfile, Lead, Achievement, InvestorSettings, InvestmentRequest, BlogPost, Notification } from './types';
import { ListingType, PropertyType, PropertyStatus, NotificationType } from './types';
import CategoryCard from './components/CategoryCard';
import Chatbot from './components/Chatbot';
import MortgageCalculator from './components/MortgageCalculator';
import ScheduleTourModal from './components/ScheduleTourModal';
import MarketInsights from './components/MarketInsights';
import RecommendedProperties from './components/RecommendedProperties';
import PropertyDetailModal from './components/PropertyDetailModal';
import CompareBar from './components/CompareBar';
import CompareModal from './components/CompareModal';
import { AuthModal } from './components/AuthModal';
import UserDashboardModal from './components/UserDashboardModal';
import PropertyFormModal from './components/PropertyFormModal';
import FinancialServices from './components/FinancialServices';
import AIResponseModal from './components/AIResponseModal';
import { 
    getProperties, 
    saveProperties, 
    deleteProperty,
    getTourRequests, 
    addTourRequest, 
    getSavedPropertiesForUser, 
    savePropertiesForUser, 
    getInquiriesForSeller, 
    getSavedSearchesForUser, 
    saveSearchesForUser, 
    incrementPropertyView, 
    getMessagesForUser, 
    sendMessage, 
    addReview, 
    getEvents, 
    addEvent, 
    updateEvent, 
    deleteEvent, 
    getAgentProfile, 
    updateAgentProfile, 
    getReviewsForAgent as getAllReviewsForAgent, 
    getLeadsForAgent, 
    getInvestorSettings, 
    saveInvestorSettings, 
    getInvestmentRequests, 
    addInvestmentRequest, 
    getNotifications, 
    getReadNotificationIds, 
    markNotificationsAsRead,
    getCurrentUser, 
    logoutUser      
} from './lib/data';
import PersonalizedMatches from './components/PersonalizedMatches';
import AgentContactModal from './components/AgentContactModal';
import VRTourModal from './components/VRTourModal';
import NeighborhoodSection from './components/NeighborhoodSection';
import BlogSection from './components/BlogSection';
import { BookmarkIcon, ChatBubbleLeftRightIcon } from './components/icons/ActionIcons';
import MessageModal from './components/MessageModal';
import AgentReviewModal from './components/AgentReviewModal';
import AIImprovementModal from './components/AIImprovementModal';
import { useTranslations } from './contexts/LanguageContext';
import InvestmentRequestModal from './components/InvestmentRequestModal';
import { useCurrency } from './contexts/CurrencyContext';
import UpgradeToInvestorModal from './components/UpgradeToInvestorModal';
import { GoogleGenAI, Type } from "@google/genai";
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import TermsOfServiceModal from './components/TermsOfServiceModal';
import CareersModal from './components/CareersModal';
import ApplicationModal from './components/ApplicationModal';
import NeighborhoodExplorerModal from './components/NeighborhoodExplorerModal';
import ServiceRegistrationModal from './components/ServiceRegistrationModal';
import BlogDetailModal from './components/BlogDetailModal';
import ProviderServicesModal from './components/ProviderServicesModal';
import SessionTimeoutModal from './components/SessionTimeoutModal';
import RealTimeNews from './components/RealTimeNews';
import AIVoiceChat from './components/AIVoiceChat';
import NewOfferings from './components/NewOfferings';
import { supabase } from './lib/supabase';

// Page components
import AboutPage from './components/pages/AboutPage';
import ContactPage from './components/pages/ContactPage';
import ServicesPage from './components/pages/ServicesPage';
import PricingPage from './components/pages/PricingPage';


type AuthView = 'login' | 'signup' | 'userSignup' | 'agentSignup' | 'investorSignup' | 'pendingVerificationAgent' | 'pendingVerificationInvestor' | 'forgotPassword' | 'resetConfirmation';
type Page = 'home' | 'about' | 'services' | 'contact' | 'pricing';

const initialFilters: SearchFilters = {
    location: '',
    listingType: ListingType.ALL,
    propertyType: PropertyType.ALL,
    priceMin: 0,
    priceMax: 10000000,
    bedrooms: 0,
    bathrooms: 0,
    amenities: [],
    checkIn: '',
    checkOut: '',
    guests: 0,
    vehicleType: '',
    wellnessType: '',
};

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [investmentProperties, setInvestmentProperties] = useState<Property[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [postLoginDestination, setPostLoginDestination] = useState<'dashboard' | 'stay'>('dashboard');

  const propertyListRef = useRef<HTMLDivElement>(null);

  const refreshUser = async () => {
    const user = await getCurrentUser();
    setCurrentUser(user);
  };

  useEffect(() => {
    refreshUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
            await refreshUser();
        } else if (event === 'SIGNED_OUT') {
            setCurrentUser(null);
        }
    });
    return () => subscription.unsubscribe();
  }, []);

  const [savedPropertyIds, setSavedPropertyIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');
  const [tourRequests, setTourRequests] = useState<TourRequest[]>([]);
  const [savedSearches, setSavedSearches] = useState<SearchFilters[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [investmentRequests, setInvestmentRequests] = useState<InvestmentRequest[]>([]);
  const [agentProfile, setAgentProfile] = useState<AgentProfile | null>(null);
  const [agentReviews, setAgentReviews] = useState<Review[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [agentAchievements, setAgentAchievements] = useState<Achievement[]>(AGENT_ACHIEVEMENTS.map((a, i) => ({...a, id: `ach_${i}`})));
  const [investorAchievements, setInvestorAchievements] = useState<Achievement[]>(INVESTOR_ACHIEVEMENTS.map((a, i) => ({...a, id: `inv_ach_${i}`})));
  const [investorSettings, setInvestorSettings] = useState<InvestorSettings | null>(null);

  const { currency, setCurrency } = useCurrency();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.theme === 'dark' ? 'dark' : 'light'));
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<AuthView>('login');
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isPropertyFormOpen, setIsPropertyFormOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);
  const [isAIResponseModalOpen, setIsAIResponseModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isAIVoiceChatOpen, setIsAIVoiceChatOpen] = useState(false);
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [readNotificationIds, setReadNotificationIds] = useState<Set<string>>(new Set());
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoadingBlog, setIsLoadingBlog] = useState(true);

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [compareList, setCompareList] = useState<Property[]>([]);
  const [inquiryForResponse, setInquiryForResponse] = useState<TourRequest | null>(null);
  const [agentForReview, setAgentForReview] = useState<Property['agent'] | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
        setIsLoadingProperties(true);
        const allProps = await getProperties();
        setAllProperties(allProps);
        setInvestmentProperties(allProps.filter(p => p.listingType === ListingType.FOR_INVESTMENT));
        setIsLoadingProperties(false);

        if (currentUser) {
            const uname = currentUser.username;
            const uid = currentUser.id;
            
            const [savedIds, tours, searches, msgs, notifs, readNotifIds] = await Promise.all([
                getSavedPropertiesForUser(uname),
                getTourRequests(uid),
                getSavedSearchesForUser(uname),
                getMessagesForUser(uname),
                getNotifications(currentUser),
                getReadNotificationIds(uid)
            ]);

            setSavedPropertyIds(savedIds);
            setTourRequests(tours);
            setSavedSearches(searches);
            setMessages(msgs);
            setNotifications(notifs);
            setReadNotificationIds(readNotifIds);

            if(currentUser.role === 'agent') {
                setCalendarEvents(await getEvents(uname));
                setAgentProfile(await getAgentProfile(uname));
                setAgentReviews(await getAllReviewsForAgent(uname));
                setLeads(await getLeadsForAgent(uname));
                setInvestmentRequests(await getInvestmentRequests());
            }
            if (currentUser.role === 'investor') {
                setInvestorSettings(await getInvestorSettings(uname));
            }
        }
    }
    fetchData();
  }, [currentUser]);

  const filteredProperties = useMemo(() => {
    const stayKeywords = ["apartment", "property", "commercial", "housing", "home", "house", "land", "stay", "hotel"];

    return allProperties.filter(p => {
        // Broaden the "Short-term Stay" category to include anything matching your requested keywords
        let matchesType = filters.propertyType === PropertyType.ALL || p.propertyType === filters.propertyType;
        
        if (filters.propertyType === PropertyType.SHORT_TERM_RENTAL) {
            const searchPool = `${p.title} ${p.description} ${p.propertyType}`.toLowerCase();
            const hasKeyword = stayKeywords.some(kw => searchPool.includes(kw));
            if (hasKeyword) matchesType = true;
        }

        const matchesListing = filters.listingType === ListingType.ALL || p.listingType === filters.listingType;
        const matchesLocation = !filters.location || 
            p.address.city.toLowerCase().includes(filters.location.toLowerCase()) ||
            p.address.street.toLowerCase().includes(filters.location.toLowerCase());
        const matchesPrice = p.price >= filters.priceMin && p.price <= filters.priceMax;
        const matchesBeds = p.details.beds >= filters.bedrooms;
        const matchesBaths = p.details.baths >= filters.bathrooms;

        return matchesType && matchesListing && matchesLocation && matchesPrice && matchesBeds && matchesBaths;
    });
  }, [allProperties, filters]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.theme = newTheme;
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleSendMessage = async (msgData: Omit<Message, 'id' | 'timestamp'>) => {
      if(currentUser) {
          const newMessage = await sendMessage({
              ...msgData,
              senderUsername: currentUser.username
          });
          setMessages(prev => [...prev, newMessage]);
          setIsMessageModalOpen(false);
      }
  };

  const handleScheduleTour = async (request: Omit<TourRequest, 'id' | 'username' | 'status' | 'timestamp'>) => {
      if(currentUser) {
          const newRequest = await addTourRequest(currentUser.id, request.propertyId, request.propertyTitle, request.date, request.time);
          setTourRequests(prev => [...prev, newRequest]);
          setIsTourModalOpen(false);
          alert("Tour requested successfully!");
      }
  };

  const handleNotificationClick = async (noti: Notification) => {
       if (currentUser && !noti.isRead) {
           await markNotificationsAsRead(currentUser.id, [noti.id]);
           setNotifications(prev => prev.map(n => n.id === n.id ? { ...n, isRead: true } : n));
           setReadNotificationIds(prev => new Set([...Array.from(prev), noti.id]));
       }
       
       if (noti.propertyId) {
           const prop = allProperties.find(p => p.id === noti.propertyId);
           if (prop) {
               setSelectedProperty(prop);
               setIsDetailModalOpen(true);
           }
       }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    if (postLoginDestination === 'dashboard') {
        setIsDashboardOpen(true);
    }
  };

  const handleListProperty = () => {
      if (!currentUser) {
          setPostLoginDestination('stay');
          setAuthModalView('login');
          setIsAuthModalOpen(true);
          return;
      }
      setPropertyToEdit(null);
      setIsPropertyFormOpen(true);
  };

  const handleSaveProperty = async (property: Property) => {
      const savedProperty = await saveProperties(property);
      if (!savedProperty || Array.isArray(savedProperty)) {
          alert("Failed to save property. Please try again.");
          return;
      }

      const updatedProperties = [...allProperties];
      const index = updatedProperties.findIndex(p => p.id === property.id || p.id === savedProperty.id);
      if (index > -1) {
          updatedProperties[index] = savedProperty;
      } else {
          updatedProperties.unshift(savedProperty);
      }
      setAllProperties(updatedProperties);
      setIsPropertyFormOpen(false);
      setPropertyToEdit(null);
      alert("Property listing updated successfully!");
  };

  const handleEditPropertyFromDashboard = (property: Property) => {
      setPropertyToEdit(property);
      setIsPropertyFormOpen(true);
  }

  const handleDeleteProperty = async (id: string) => {
      if (window.confirm("Are you sure you want to delete this listing?")) {
          const updated = allProperties.filter(p => p.id !== id);
          setAllProperties(updated);
          await deleteProperty(id);
      }
  }

  const handleSelectOffering = (type: PropertyType) => {
    setFilters(prev => ({
        ...initialFilters,
        propertyType: type
    }));
    
    // Smooth scroll to property list
    setTimeout(() => {
        propertyListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
      setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePlanSelect = (role: 'user' | 'agent' | 'investor') => {
      setAuthModalView(`${role}Signup` as AuthView);
      setIsAuthModalOpen(true);
  };

  return (
    <div className={`font-sans min-h-screen flex flex-col ${theme}`}>
      <Header
        currentUser={currentUser}
        notifications={notifications}
        readNotificationIds={readNotificationIds}
        onLoginClick={() => { setPostLoginDestination('dashboard'); setAuthModalView('login'); setIsAuthModalOpen(true); }}
        onSignUpClick={() => setPage('pricing')}
        onDashboardClick={() => setIsDashboardOpen(true)}
        onListPropertyClick={handleListProperty}
        onNotificationClick={handleNotificationClick}
        onMarkAllNotificationsAsRead={() => {}}
        onHomeClick={() => setPage('home')}
        onAboutClick={() => setPage('about')}
        onServicesClick={() => setPage('services')}
        onContactClick={() => setPage('contact')}
        theme={theme}
        onThemeToggle={toggleTheme}
      />
      <main className="flex-grow">
        {page === 'home' && (
            <>
                <Hero onSearch={() => {}} isSearchingAI={false} filters={filters} onFilterChange={handleFilterChange} />
                <NewOfferings onSelectCategory={handleSelectOffering} />
                <section ref={propertyListRef} className="py-12 bg-white dark:bg-slate-900 scroll-mt-20">
                    <div className="container mx-auto px-6">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                    {filters.propertyType === PropertyType.ALL ? 'All Listings' : `${filters.propertyType} Listings`}
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">
                                    {filteredProperties.length} results found matching your criteria.
                                </p>
                            </div>
                        </div>
                        <PropertyList 
                            properties={filteredProperties} 
                            currentUser={currentUser} 
                            onSaveToggle={() => {}} 
                            savedPropertyIds={savedPropertyIds} 
                            onOpenCalculator={() => {}} 
                            onOpenTourModal={(p) => { setSelectedProperty(p); setIsTourModalOpen(true); }} 
                            onFindSimilar={() => {}} 
                            onOpenDetailModal={(p) => { setSelectedProperty(p); setIsDetailModalOpen(true); }} 
                            onToggleCompare={() => {}} 
                            onOpenVRTour={() => {}} 
                            compareList={[]} 
                            onEdit={handleEditPropertyFromDashboard} 
                            onDelete={handleDeleteProperty} 
                            isLoading={isLoadingProperties}
                        />
                    </div>
                </section>
                <MarketInsights />
            </>
        )}
        {page === 'about' && <AboutPage />}
        {page === 'contact' && <ContactPage />}
        {page === 'services' && <ServicesPage onServiceClick={() => {}} />}
        {page === 'pricing' && <PricingPage onPlanSelect={handlePlanSelect} />}
      </main>
      <Footer onAboutClick={() => setPage('about')} onContactClick={() => setPage('contact')} onBlogClick={() => {}} onPrivacyPolicyClick={() => {}} onTermsOfServiceClick={() => {}} onCareersClick={() => {}} onFindAProClick={() => {}} />
      <Chatbot />
      <AIVoiceChat isOpen={isAIVoiceChatOpen} onClose={() => setIsAIVoiceChatOpen(false)} />
      {selectedProperty && <ScheduleTourModal isOpen={isTourModalOpen} onClose={() => setIsTourModalOpen(false)} propertyTitle={selectedProperty.title} propertyId={selectedProperty.id} agentName={selectedProperty.agent.name} userId={currentUser?.id || ''} onSubmit={handleScheduleTour} />}
      {selectedProperty && <PropertyDetailModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} property={selectedProperty} currentUser={currentUser} onOpenAgentContact={() => {}} onOpenVRTour={() => {}} onMessageAgent={(p) => { setSelectedProperty(p); setIsMessageModalOpen(true); }} onLeaveReview={() => {}} />}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLogin={handleLogin} initialView={authModalView} />
      {currentUser && (
          <UserDashboardModal 
            isOpen={isDashboardOpen} 
            onClose={() => setIsDashboardOpen(false)} 
            user={currentUser} 
            allProperties={allProperties} 
            investmentProperties={investmentProperties} 
            tourRequests={tourRequests} 
            receivedInquiries={tourRequests} 
            savedSearches={savedSearches} 
            savedProperties={[]} 
            propertiesToCompare={[]} 
            messages={messages} 
            calendarEvents={calendarEvents} 
            agentProfile={agentProfile} 
            agentReviews={agentReviews} 
            leads={leads} 
            agentAchievements={agentAchievements} 
            investorAchievements={investorAchievements} 
            investmentRequests={investmentRequests} 
            investorSettings={investorSettings} 
            currency={currency} 
            theme={theme} 
            onLogout={() => { logoutUser(); setCurrentUser(null); setIsDashboardOpen(false); }} 
            onEditProperty={handleEditPropertyFromDashboard} 
            onDeleteProperty={handleDeleteProperty} 
            onDraftReply={() => {}} 
            onRunSearch={() => {}} 
            onDeleteSearch={() => {}} 
            onListPropertyClick={handleListProperty} 
            onAddEvent={() => {}} 
            onUpdateEvent={() => {}} 
            onDeleteEvent={() => {}} 
            onOpenAIImprovementModal={() => {}} 
            onUpdateAgentProfile={() => {}} 
            onUpdateAgentAchievements={() => {}} 
            onUpdateInvestorAchievements={() => {}} 
            onUpdateInvestorSettings={() => {}} 
            onThemeToggle={toggleTheme} 
            onCompareClick={() => {}} 
            onCurrencyChange={() => {}} 
            onUpgradeAccountRequest={() => {}} 
            onSendMessage={handleSendMessage}
            onSaveToggle={() => {}}
            savedPropertyIds={savedPropertyIds}
            onOpenCalculator={() => {}}
            onOpenTourModal={() => {}}
            onFindSimilar={() => {}}
            onOpenDetailModal={() => {}}
            onOpenVRTour={() => {}}
            onToggleCompare={(p) => {}}
            onProfileUpdate={refreshUser}
          />
      )}
      {selectedProperty && <MessageModal isOpen={isMessageModalOpen} onClose={() => setIsMessageModalOpen(false)} property={selectedProperty} onSend={(text) => handleSendMessage({ propertyId: selectedProperty.id, propertyTitle: selectedProperty.title, receiverUsername: selectedProperty.agent.name, senderUsername: currentUser!.username, text })} />}
      
      {currentUser && isPropertyFormOpen && (
          <PropertyFormModal 
            isOpen={isPropertyFormOpen} 
            onClose={() => { setIsPropertyFormOpen(false); setPropertyToEdit(null); }} 
            onSave={handleSaveProperty} 
            propertyToEdit={propertyToEdit} 
            currentUser={currentUser} 
          />
      )}
    </div>
  );
};

export default App;
