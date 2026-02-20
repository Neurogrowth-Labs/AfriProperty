import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { NeighborhoodGuide } from '../types';
import { NEIGHBORHOOD_GUIDES } from '../constants';
import { CloseIcon, LocationPinIcon } from './icons/NavIcons';
import { BanknotesIcon, ShieldCheckIcon, AcademicCapIcon, MoonIcon, UserGroupIcon, BuildingStorefrontIcon, SparklesIcon, MapIcon, VrHeadsetIcon, ShareIcon, LinkIcon, CheckIcon, HeartIcon, HeartIconSolid, ClockIcon, TicketIcon, BikeIcon, CalendarIcon } from './icons/ActionIcons';
import LifestyleMatcherModal from './LifestyleMatcherModal';
import { FacebookIcon, TwitterIcon, WhatsAppIcon } from './icons/SocialIcons';

interface NeighborhoodExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialNeighborhoodId?: string;
  savedNeighborhoodIds: Set<string>;
  onSaveToggle: (id: string) => void;
}

type Tab = 'overview' | 'community' | 'utilities';

// --- Share Menu Component ---
const ShareMenu: React.FC<{ neighborhood: NeighborhoodGuide }> = ({ neighborhood }) => {
  const [copied, setCopied] = useState(false);
  const url = `${window.location.href.split('?')[0]}?neighborhood=${neighborhood.id}`;
  const shareText = `Check out the ${neighborhood.name} neighborhood on AfriProperty!`;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200/80 dark:border-slate-700 py-2 z-20 animate-fade-in-up-sm">
      <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" className="share-button">
        <TwitterIcon className="w-5 h-5" /><span>Twitter</span>
      </a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" className="share-button">
        <FacebookIcon className="w-5 h-5" /><span>Facebook</span>
      </a>
      <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${url}`)}`} target="_blank" rel="noopener noreferrer" className="share-button">
        <WhatsAppIcon className="w-5 h-5" /><span>WhatsApp</span>
      </a>
      <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
      <button onClick={handleCopy} className="share-button">
        {copied ? <CheckIcon className="w-5 h-5 text-green-500"/> : <LinkIcon className="w-5 h-5" />}
        <span>{copied ? 'Copied!' : 'Copy Link'}</span>
      </button>
    </div>
  );
};

// --- Main Modal Component ---
const NeighborhoodExplorerModal: React.FC<NeighborhoodExplorerModalProps> = ({ isOpen, onClose, initialNeighborhoodId, savedNeighborhoodIds, onSaveToggle }) => {
    const [selectedId, setSelectedId] = useState<string>(initialNeighborhoodId || NEIGHBORHOOD_GUIDES[0].id);
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [isLifestyleMatcherOpen, setIsLifestyleMatcherOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const shareRef = useRef<HTMLDivElement>(null);
    
    const selectedNeighborhood = useMemo(() => {
        return NEIGHBORHOOD_GUIDES.find(n => n.id === selectedId)!;
    }, [selectedId]);

    useEffect(() => {
        if(isOpen) {
            setSelectedId(initialNeighborhoodId || NEIGHBORHOOD_GUIDES[0].id);
            setActiveTab('overview');
        }
    }, [isOpen, initialNeighborhoodId]);
    
     useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (shareRef.current && !shareRef.current.contains(event.target as Node)) {
                setIsShareOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMatchFound = (id: string) => {
        setSelectedId(id);
        setIsLifestyleMatcherOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[110] p-4" onClick={onClose}>
            <div className="bg-slate-50 dark:bg-brand-dark rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" onClick={e => e.stopPropagation()}>
                <header className="relative flex justify-center sm:justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <button onClick={onClose} className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-brand-primary hover:underline sm:hidden">&larr; Back</button>
                    <div className="flex items-center gap-3">
                        <MapIcon className="w-7 h-7 text-brand-primary" />
                        <h2 className="text-2xl font-bold text-brand-dark dark:text-white">Neighborhood Explorer</h2>
                    </div>
                     <div className="flex items-center gap-2">
                        <button onClick={() => onSaveToggle(selectedId)} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
                           {savedNeighborhoodIds.has(selectedId) ? <HeartIconSolid className="w-6 h-6 text-red-500"/> : <HeartIcon className="w-6 h-6"/>}
                        </button>
                        <div className="relative" ref={shareRef}>
                            <button onClick={() => setIsShareOpen(prev => !prev)} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
                                <ShareIcon className="w-6 h-6"/>
                            </button>
                            {isShareOpen && <ShareMenu neighborhood={selectedNeighborhood} />}
                        </div>
                        <button onClick={onClose} className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors hidden sm:block">
                            <CloseIcon className="w-6 h-6" />
                        </button>
                    </div>
                </header>
                
                <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
                    {/* Sidebar */}
                    <aside className="w-full md:w-1/3 lg:w-1/4 bg-white dark:bg-slate-900/50 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 p-4 overflow-y-auto flex-shrink-0">
                        <button onClick={() => setIsLifestyleMatcherOpen(true)} className="w-full bg-brand-primary text-white font-semibold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 mb-4">
                            <SparklesIcon className="w-5 h-5"/> Find My Best Fit
                        </button>
                        <div className="space-y-2">
                            {NEIGHBORHOOD_GUIDES.map(n => (
                                <button key={n.id} onClick={() => setSelectedId(n.id)} className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${selectedId === n.id ? 'bg-brand-light dark:bg-slate-700' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                                    <img src={n.image} alt={n.name} className="w-12 h-12 object-cover rounded-md flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-sm text-slate-800 dark:text-white">{n.name}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{n.description}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="w-full md:w-2/3 lg:w-3/4 overflow-y-auto">
                        <div className="border-b border-slate-200 dark:border-slate-700 px-6">
                            <nav className="-mb-px flex space-x-6">
                                <TabButton id="overview" label="Overview" activeTab={activeTab} setActiveTab={setActiveTab} />
                                <TabButton id="community" label="Community & Culture" activeTab={activeTab} setActiveTab={setActiveTab} />
                                <TabButton id="utilities" label="Utilities & Transport" activeTab={activeTab} setActiveTab={setActiveTab} />
                            </nav>
                        </div>
                         <div className="p-6">
                            {activeTab === 'overview' && <OverviewTab neighborhood={selectedNeighborhood} />}
                            {activeTab === 'community' && <CommunityTab neighborhood={selectedNeighborhood} />}
                            {activeTab === 'utilities' && <UtilitiesTab neighborhood={selectedNeighborhood} />}
                        </div>
                    </main>
                </div>
            </div>
             {isLifestyleMatcherOpen && (
                <LifestyleMatcherModal 
                    isOpen={isLifestyleMatcherOpen}
                    onClose={() => setIsLifestyleMatcherOpen(false)}
                    onMatchFound={handleMatchFound}
                />
            )}
            <style>{`
                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in-scale { animation: fadeInScale 0.3s ease-out forwards; }
                .line-clamp-2 { overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
                .share-button { @apply w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3; }
                @keyframes fadeInUpSm { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up-sm { animation: fadeInUpSm 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};

// --- Tab Button Component ---
const TabButton: React.FC<{id: Tab, label: string, activeTab: Tab, setActiveTab: (tab: Tab) => void}> = 
({ id, label, activeTab, setActiveTab }) => (
    <button 
        onClick={() => setActiveTab(id)} 
        className={`py-3 px-1 border-b-2 font-semibold text-sm ${activeTab === id ? 'border-brand-primary text-brand-primary' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
    >
        {label}
    </button>
);

// --- Overview Tab Component ---
const OverviewTab: React.FC<{ neighborhood: NeighborhoodGuide }> = ({ neighborhood }) => (
    <div className="space-y-6">
        <div className="grid grid-cols-5 gap-6">
            <div className="col-span-3">
                <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white">{neighborhood.name}</h3>
                <p className="text-slate-600 dark:text-slate-300 mt-2">{neighborhood.profile.history}</p>
                 <div className="mt-4 flex gap-2">
                    <a href={neighborhood.virtualTourUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm font-semibold bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 flex items-center gap-2">
                        <VrHeadsetIcon className="w-5 h-5"/> 360° Virtual Tour
                    </a>
                </div>
            </div>
            <div className="col-span-2 aspect-[4/3] rounded-lg overflow-hidden border dark:border-slate-700">
                <iframe className="w-full h-full" loading="lazy" allowFullScreen src={`https://maps.google.com/maps?q=${neighborhood.coordinates.lat},${neighborhood.coordinates.lng}&hl=es;z=14&output=embed`}></iframe>
            </div>
        </div>
        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
            <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Livability Scores</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <ScoreBar icon={ShieldCheckIcon} label="Safety" score={neighborhood.scores.safety} />
                <ScoreBar icon={BanknotesIcon} label="Affordability" score={neighborhood.scores.affordability} />
                <ScoreBar icon={AcademicCapIcon} label="Schools" score={neighborhood.scores.schools} />
                <ScoreBar icon={MoonIcon} label="Nightlife" score={neighborhood.scores.nightlife} />
                <ScoreBar icon={UserGroupIcon} label="Family Friendly" score={neighborhood.scores.familyFriendly} />
            </div>
        </div>
    </div>
);

// --- Community Tab Component ---
const CommunityTab: React.FC<{ neighborhood: NeighborhoodGuide }> = ({ neighborhood }) => (
    <div className="space-y-8">
        <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">What Locals Say</h3>
            <div className="flex gap-6 overflow-x-auto pb-4">
                {neighborhood.reviews?.map((review, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 flex-shrink-0 w-80">
                        <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{review.quote}"</p>
                        <div className="flex items-center gap-3 mt-3">
                            <img src={review.image} alt={review.author} className="w-10 h-10 rounded-full" />
                            <span className="font-semibold text-sm text-slate-800 dark:text-white">{review.author}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Upcoming Events</h3>
                <div className="space-y-3">
                    {neighborhood.events?.map((event, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                            <p className="font-semibold text-brand-primary">{event.date}</p>
                            <p className="font-bold text-slate-800 dark:text-white">{event.name}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{event.description}</p>
                        </div>
                    ))}
                </div>
            </div>
             <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Hidden Gems</h3>
                <div className="space-y-3">
                    {neighborhood.hiddenGems?.map((gem, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-4">
                            <img src={gem.image} alt={gem.name} className="w-20 h-20 object-cover rounded-md" />
                            <div>
                                <span className="text-xs font-bold bg-brand-secondary text-brand-dark px-2 py-0.5 rounded-full">{gem.category}</span>
                                <p className="font-bold text-slate-800 dark:text-white mt-1">{gem.name}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{gem.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

// --- Utilities Tab Component ---
const UtilitiesTab: React.FC<{ neighborhood: NeighborhoodGuide }> = ({ neighborhood }) => {
    const [destination, setDestination] = useState('');
    const [commuteTimes, setCommuteTimes] = useState<{ drive: number, transit: number, bike: number } | null>(null);

    const handleCalculate = () => {
        if (!destination) return;
        setCommuteTimes({
            drive: Math.floor(Math.random() * 20) + 15,
            transit: Math.floor(Math.random() * 25) + 30,
            bike: Math.floor(Math.random() * 30) + 40,
        });
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Commute Calculator</h3>
                <div className="flex items-center gap-2">
                    <input type="text" value={destination} onChange={e => setDestination(e.target.value)} placeholder="Enter workplace, school, etc." className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800" />
                    <button onClick={handleCalculate} className="bg-brand-primary text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 flex-shrink-0">
                        <ClockIcon className="w-5 h-5"/> Calculate
                    </button>
                </div>
                 {commuteTimes && (
                    <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                        <div><p className="text-2xl font-bold">{commuteTimes.drive} <span className="text-base font-normal">min</span></p><p className="text-sm text-slate-500">by Car</p></div>
                        <div><p className="text-2xl font-bold">{commuteTimes.transit} <span className="text-base font-normal">min</span></p><p className="text-sm text-slate-500">by Transit</p></div>
                        <div><p className="text-2xl font-bold">{commuteTimes.bike} <span className="text-base font-normal">min</span></p><p className="text-sm text-slate-500">by Bike</p></div>
                    </div>
                )}
            </div>
            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Getting Around</h3>
                 <div className="space-y-3">
                    <div className="flex items-start gap-3"><LocationPinIcon className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5"/><p className="text-sm text-slate-600 dark:text-slate-300">{neighborhood.profile.publicTransport}</p></div>
                    <div className="flex items-start gap-3"><BikeIcon className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5"/><p className="text-sm text-slate-600 dark:text-slate-300">{neighborhood.accessibility?.bikePaths}</p></div>
                    <div className="flex items-start gap-3"><TicketIcon className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5"/><p className="text-sm text-slate-600 dark:text-slate-300">{neighborhood.accessibility?.parking}</p></div>
                 </div>
            </div>
        </div>
    );
};

const ScoreBar: React.FC<{ icon: React.ElementType, label: string; score: number; }> = ({ icon: Icon, label, score }) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
            </div>
            <span className="text-sm font-bold text-slate-800 dark:text-white">{score}/10</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
            <div className="bg-brand-primary h-2.5 rounded-full" style={{ width: `${score * 10}%` }}></div>
        </div>
    </div>
);


export default NeighborhoodExplorerModal;