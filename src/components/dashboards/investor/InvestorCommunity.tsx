

import React, { useState, useMemo } from 'react';
import type { User, ForumPost, CoInvestmentDeal, ProfessionalContact, Property } from '../../../types';
import { FORUM_CATEGORIES, INVESTOR_FORUM_POSTS, CO_INVESTMENT_DEALS, PROFESSIONAL_CONTACTS, ALL_PROPERTIES } from '../../../constants';
import { CommunityIcon, BriefcaseIcon, HandshakeIcon } from '../../icons/InvestorDashboardIcons';
import { StarIcon } from '../../icons/ActionIcons';
import NewPostModal from '../../NewPostModal';
import ForumPostDetailModal from '../../ForumPostDetailModal';
import CoInvestmentDealModal from '../../CoInvestmentDealModal';
import BookConsultationModal from '../../BookConsultationModal';

interface InvestorCommunityProps {
  user: User;
}

type CommunityTab = 'forum' | 'co-invest' | 'advisors';

interface DealWithProperty extends CoInvestmentDeal {
    property: Property;
}

// --- Main Community Page Component ---
// FIX: Changed to a named export to resolve module import issue.
export const InvestorCommunity: React.FC<InvestorCommunityProps> = ({ user }) => {
    const [activeTab, setActiveTab] = useState<CommunityTab>('forum');
    const [posts, setPosts] = useState<ForumPost[]>(INVESTOR_FORUM_POSTS);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);

    const [isDealModalOpen, setIsDealModalOpen] = useState(false);
    const [selectedDeal, setSelectedDeal] = useState<DealWithProperty | null>(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedProfessional, setSelectedProfessional] = useState<ProfessionalContact | null>(null);

    const handleAddPost = (post: { title: string, content: string }) => {
        const newPost: ForumPost = {
            ...post,
            id: `ifp_${Date.now()}`,
            author: user.username,
            timestamp: Date.now(),
            replies: 0,
            views: 0,
            category: 'General', // Default category
        };
        setPosts(prev => [newPost, ...prev]);
        setIsPostModalOpen(false);
    };

    const handleViewDeal = (deal: CoInvestmentDeal) => {
        const property = ALL_PROPERTIES.find(p => p.id === deal.propertyId);
        if (property) {
            setSelectedDeal({ ...deal, property });
            setIsDealModalOpen(true);
        } else {
            alert("Property details for this deal could not be found.");
        }
    };
    
    const handleBookConsultation = (professional: ProfessionalContact) => {
        setSelectedProfessional(professional);
        setIsBookingModalOpen(true);
    };


    const renderContent = () => {
        switch(activeTab) {
            case 'forum': return <InvestorForums posts={posts} onNewPost={() => setIsPostModalOpen(true)} onPostClick={setSelectedPost} />;
            case 'co-invest': return <CoInvestmentOpportunities onViewDeal={handleViewDeal} />;
            case 'advisors': return <AdvisorsConnect onBook={handleBookConsultation} />;
            default: return null;
        }
    };

    return (
        <div className="p-4 md:p-8 h-full flex flex-col dark:text-slate-200">
            <div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Community & Networking</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Discuss, partner, and connect with peers and professionals.</p>
            </div>

            <div className="border-b border-slate-200 dark:border-slate-700 mt-6">
                <nav className="-mb-px flex space-x-4 md:space-x-6 overflow-x-auto">
                    <TabButton id="forum" label="Investor Forums" icon={CommunityIcon} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="co-invest" label="Co-Investment" icon={HandshakeIcon} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="advisors" label="Advisors & Agents" icon={BriefcaseIcon} activeTab={activeTab} setActiveTab={setActiveTab} />
                </nav>
            </div>
            
            <div className="flex-grow mt-6 bg-white dark:bg-slate-800/50 rounded-lg shadow-sm overflow-y-auto">
                {renderContent()}
            </div>
             <NewPostModal 
                isOpen={isPostModalOpen}
                onClose={() => setIsPostModalOpen(false)}
                onAddPost={handleAddPost}
            />
             {selectedPost && (
                <ForumPostDetailModal 
                    isOpen={!!selectedPost}
                    onClose={() => setSelectedPost(null)}
                    post={selectedPost}
                />
            )}
            {selectedDeal && (
                <CoInvestmentDealModal 
                    isOpen={isDealModalOpen}
                    onClose={() => setIsDealModalOpen(false)}
                    deal={selectedDeal}
                />
            )}
            {selectedProfessional && (
                <BookConsultationModal
                    isOpen={isBookingModalOpen}
                    onClose={() => setIsBookingModalOpen(false)}
                    professional={selectedProfessional}
                />
            )}
        </div>
    );
};

// --- Tab Button Component ---
const TabButton: React.FC<{id: CommunityTab, label: string, icon: React.ElementType, activeTab: CommunityTab, setActiveTab: (tab: CommunityTab) => void}> = 
({ id, label, icon: Icon, activeTab, setActiveTab }) => (
    <button 
        onClick={() => setActiveTab(id)} 
        className={`py-3 px-1 border-b-2 font-semibold text-sm flex items-center gap-2 flex-shrink-0 ${activeTab === id ? 'border-brand-primary text-brand-primary' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
    >
        <Icon className="w-5 h-5" /> {label}
    </button>
);

// --- Investor Forums Component ---
const InvestorForums: React.FC<{ posts: ForumPost[], onNewPost: () => void, onPostClick: (post: ForumPost) => void }> = ({ posts, onNewPost, onPostClick }) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const filteredPosts = useMemo(() => {
        if (!selectedCategory) return posts;
        return posts.filter(p => p.category === selectedCategory);
    }, [posts, selectedCategory]);

    return (
        <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Recent Discussions</h3>
                    <button onClick={onNewPost} className="bg-brand-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-opacity-90 text-sm flex-shrink-0">Create Post</button>
                </div>
                 <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm min-w-[600px]">
                            <thead className="bg-slate-50 dark:bg-slate-700">
                                <tr>
                                    <th className="p-3 text-left font-semibold text-slate-600 dark:text-slate-300">Topic</th>
                                    <th className="p-3 text-center font-semibold text-slate-600 dark:text-slate-300">Replies</th>
                                    <th className="p-3 text-center font-semibold text-slate-600 dark:text-slate-300">Views</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {filteredPosts.map(post => (
                                    <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer" onClick={() => onPostClick(post)}>
                                        <td className="p-3">
                                            <span className="font-semibold text-brand-dark dark:text-slate-100 hover:underline">{post.title}</span>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">by {post.author} - {new Date(post.timestamp).toLocaleDateString()}</p>
                                        </td>
                                        <td className="p-3 text-center text-slate-600 dark:text-slate-300">{post.replies}</td>
                                        <td className="p-3 text-center text-slate-600 dark:text-slate-300">{post.views}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="lg:col-span-1">
                 <div className="flex justify-between items-baseline mb-4">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Categories</h3>
                    {selectedCategory && <button onClick={() => setSelectedCategory(null)} className="text-xs font-semibold text-brand-primary hover:underline">Show All</button>}
                </div>
                <div className="space-y-3">
                    {FORUM_CATEGORIES.map(cat => (
                        <button key={cat.id} onClick={() => setSelectedCategory(cat.name)} className={`w-full text-left p-3 rounded-lg transition-colors ${selectedCategory === cat.name ? 'bg-brand-light dark:bg-slate-700 ring-2 ring-brand-primary' : 'bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                            <p className="font-semibold text-slate-700 dark:text-slate-200">{cat.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{cat.description}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};


// --- Co-Investment Component ---
const CoInvestmentOpportunities: React.FC<{ onViewDeal: (deal: CoInvestmentDeal) => void }> = ({ onViewDeal }) => {
    const dealsWithProperties = useMemo(() => CO_INVESTMENT_DEALS.map(deal => ({
        ...deal,
        property: ALL_PROPERTIES.find(p => p.id === deal.propertyId)
    })).filter(d => d.property), []);

    return (
        <div className="p-4 md:p-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Co-Investment Opportunities</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {dealsWithProperties.map(deal => (
                    <div key={deal.id} className="bg-slate-50 dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-slate-200 dark:border-slate-700">
                        <div className="flex flex-col sm:flex-row gap-4">
                             <img src={deal.property?.images[0]} alt={deal.property?.title} className="w-full sm:w-24 h-24 object-cover rounded-md flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-brand-dark dark:text-slate-100">{deal.property?.title}</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{deal.property?.address.city}</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-semibold text-slate-700 dark:text-slate-200">${deal.fundedAmount.toLocaleString()} / ${deal.fundingGoal.toLocaleString()}</span>
                                <span className="text-slate-500 dark:text-slate-400">{deal.investorCount} Investors</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                                <div className="bg-brand-primary h-2.5 rounded-full" style={{ width: `${(deal.fundedAmount / deal.fundingGoal) * 100}%` }}></div>
                            </div>
                            <button onClick={() => onViewDeal(deal)} className="w-full mt-4 bg-brand-primary text-white font-semibold py-2 rounded-lg hover:bg-opacity-90 text-sm">View Deal</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Advisors Connect Component ---
const AdvisorsConnect: React.FC<{ onBook: (pro: ProfessionalContact) => void }> = ({ onBook }) => (
    <div className="p-4 md:p-6">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Connect with Professionals</h3>
        <div className="space-y-4">
            {PROFESSIONAL_CONTACTS.map(pro => (
                <div key={pro.id} className="bg-slate-50 dark:bg-slate-800 rounded-lg shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                        <img src={pro.image} alt={pro.name} className="w-12 h-12 rounded-full" />
                        <div>
                            <p className="font-bold text-slate-800 dark:text-white">{pro.name}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{pro.specialty}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6">
                         <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                            <StarIcon className="w-5 h-5 text-amber-400" />
                            <span className="font-bold">{pro.rating}</span>
                            <span className="text-sm text-slate-400">({pro.reviewCount})</span>
                        </div>
                        <button onClick={() => onBook(pro)} className="bg-brand-primary text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-opacity-90 flex-shrink-0">Book</button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);