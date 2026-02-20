
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
// FIX: Corrected import paths from './lib/data' to '../lib/data' and './lib/supabase' to '../lib/supabase'
import { 
    getProperties, 
    saveProperties, 
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
} from '../lib/data';
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
import { supabase } from '../lib/supabase';

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
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [postLoginDestination, setPostLoginDestination] = useState<'dashboard' | 'stay'>('dashboard');

  useEffect(() => {
    getCurrentUser().then(user => { if (user) setCurrentUser(user); });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
            const user = await getCurrentUser();
            setCurrentUser(user);
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
            // RELATIONAL DATA FETCHING START
            const uname = currentUser.username;
            const uid = currentUser.id;
            
            const [savedIds, tours, searches, msgs, notifs, readNotifIds] = await Promise.all([
                getSavedPropertiesForUser(uname),
                getTourRequests(uid), // Use ID here
                getSavedSearchesForUser(uname),
                getMessagesForUser(uname),
                getNotifications(currentUser),
                getReadNotificationIds(uname)
            ]);

            setSavedPropertyIds(savedIds);
            setTourRequests(tours);
            setSavedSearches(searches);
            setMessages(msgs);
            setNotifications(notifs.map(n => ({...n, isRead: readNotifIds.has(n.id) })));
            setReadNotificationIds(readNotifIds);
            // RELATIONAL DATA FETCHING END

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
          // Relational fix: pass the UUID from currentUser.id
          const newRequest = await addTourRequest(currentUser.id, request.propertyId, request.propertyTitle, request.date, request.time);
          setTourRequests(prev => [...prev, newRequest]);
          setIsTourModalOpen(false);
          alert("Tour requested successfully!");
      }
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
        onListPropertyClick={() => {}}
        onNotificationClick={() => {}}
        onMarkAllNotificationsAsRead={() => {}}
        onHomeClick={() => setPage('home')}
        onAboutClick={() => setPage('about')}
        onServicesClick={() => setPage('services')}
        onContactClick={() => setPage('contact')}
      />
      <main className="flex-grow">
        {page === 'home' && (
            <>
                <Hero onSearch={() => {}} isSearchingAI={false} filters={filters} onFilterChange={() => {}} />
                <NewOfferings onSelectCategory={() => {}} />
                <section className="py-12 bg-white dark:bg-slate-900">
                    <div className="container mx-auto px-6">
                        <PropertyList 
                            properties={allProperties.slice(0, 6)} 
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
                            onEdit={() => {}} 
                            onDelete={() => {}} 
                        />
                    </div>
                </section>
                <MarketInsights />
            </>
        )}
      </main>
      <Footer onAboutClick={() => {}} onContactClick={() => {}} onBlogClick={() => {}} onPrivacyPolicyClick={() => {}} onTermsOfServiceClick={() => {}} onCareersClick={() => {}} onFindAProClick={() => {}} />
      <Chatbot />
      <AIVoiceChat isOpen={isAIVoiceChatOpen} onClose={() => setIsAIVoiceChatOpen(false)} />
      {/* FIX: Passed userId to ScheduleTourModal */}
      {selectedProperty && <ScheduleTourModal isOpen={isTourModalOpen} onClose={() => setIsTourModalOpen(false)} propertyTitle={selectedProperty.title} propertyId={selectedProperty.id} agentName={selectedProperty.agent.name} userId={currentUser?.id || ''} onSubmit={handleScheduleTour} />}
      {selectedProperty && <PropertyDetailModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} property={selectedProperty} currentUser={currentUser} onOpenAgentContact={() => {}} onOpenVRTour={() => {}} onMessageAgent={(p) => { setSelectedProperty(p); setIsMessageModalOpen(true); }} onLeaveReview={() => {}} />}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLogin={() => {}} initialView={authModalView} />
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
            onEditProperty={() => {}} 
            onDeleteProperty={() => {}} 
            onDraftReply={() => {}} 
            onRunSearch={() => {}} 
            onDeleteSearch={() => {}} 
            onListPropertyClick={() => {}} 
            onAddEvent={() => {}} 
            onUpdateEvent={() => {}} 
            onDeleteEvent={() => {}} 
            onOpenAIImprovementModal={() => {}} 
            onUpdateAgentProfile={() => {}} 
            onUpdateAgentAchievements={() => {}} 
            onUpdateInvestorAchievements={() => {}} 
            onUpdateInvestorSettings={() => {}} 
            onThemeToggle={() => {}} 
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
          />
      )}
      {selectedProperty && <MessageModal isOpen={isMessageModalOpen} onClose={() => setIsMessageModalOpen(false)} property={selectedProperty} onSend={(text) => handleSendMessage({ propertyId: selectedProperty.id, propertyTitle: selectedProperty.title, receiverUsername: selectedProperty.agent.name, senderUsername: currentUser!.username, text })} />}
    </div>
  );
};

export default App;
