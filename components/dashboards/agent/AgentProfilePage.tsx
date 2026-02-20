import React, { useState, useEffect, useMemo } from 'react';
import type { Property, User, Review, AgentProfile } from '../../../types';
import { PropertyStatus } from '../../../types';
import { TwitterIcon, LinkedInIcon, FacebookIcon } from '../../icons/SocialIcons';
import { StarIcon, UserCircleIcon, StarIconOutline } from '../../icons/ActionIcons';

interface AgentProfilePageProps {
  user: User;
  allProperties: Property[];
  agentProfile: AgentProfile | null;
  agentReviews: Review[];
  onUpdateAgentProfile: (profile: AgentProfile) => void;
}

const socialIcons: Record<string, React.ElementType> = {
    twitter: TwitterIcon,
    linkedin: LinkedInIcon,
    facebook: FacebookIcon,
};

const StarRating: React.FC<{ rating: number, className?: string }> = ({ rating, className = 'w-5 h-5' }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) =>
                i < Math.round(rating) ? (
                    <StarIcon key={i} className={`${className} text-amber-400`} />
                ) : (
                    <StarIconOutline key={i} className={`${className} text-slate-300`} />
                )
            )}
        </div>
    );
};

const AgentProfilePage: React.FC<AgentProfilePageProps> = ({ user, allProperties, agentProfile, agentReviews, onUpdateAgentProfile }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<AgentProfile | null>(agentProfile);

    useEffect(() => {
        setFormData(agentProfile);
    }, [agentProfile]);

    const userProperties = useMemo(() => {
        return allProperties.filter(p => p.agent.name === user.username);
    }, [allProperties, user.username]);
    
    const activeProperties = useMemo(() => userProperties.filter(p => p.status === PropertyStatus.ACTIVE), [userProperties]);
    const soldProperties = useMemo(() => userProperties.filter(p => p.status === PropertyStatus.SOLD), [userProperties]);

    // FIX: Calculate average rating and review count from agentReviews prop
    const { averageRating, reviewCount } = useMemo(() => {
        const count = agentReviews.length;
        if (count === 0) {
            return { averageRating: 0, reviewCount: 0 };
        }
        const totalRating = agentReviews.reduce((sum, review) => sum + review.rating, 0);
        return {
            averageRating: parseFloat((totalRating / count).toFixed(1)),
            reviewCount: count,
        };
    }, [agentReviews]);

    const [activePropertyTab, setActivePropertyTab] = useState<'active' | 'sold'>('active');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!formData) return;
        const { name, value } = e.target;
        if (name.startsWith('socials.')) {
            const socialKey = name.split('.')[1] as keyof AgentProfile['socials'];
            setFormData({ ...formData, socials: { ...formData.socials, [socialKey]: value }});
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSave = () => {
        if (formData) {
            onUpdateAgentProfile(formData);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData(agentProfile);
        setIsEditing(false);
    };

    if (!agentProfile || !formData) {
        return <div className="p-8">Loading profile...</div>;
    }

    return (
        <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Profile Card */}
            <div className="lg:col-span-1 bg-white rounded-lg shadow-sm p-6 space-y-4 lg:sticky top-8">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-slate-800">Agent Profile</h3>
                    {!isEditing && <button onClick={() => setIsEditing(true)} className="text-sm font-semibold text-brand-primary hover:text-brand-dark">Edit</button>}
                </div>

                <div className="text-center">
                    <img src={formData.profilePicture} alt={formData.username} className="w-24 h-24 rounded-full mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-800">{formData.username}</h2>
                </div>

                <div>
                    <label className="text-xs font-semibold text-slate-500">BIO</label>
                    {isEditing ? (
                        <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows={5} className="w-full text-sm text-slate-600 mt-1 p-2 border rounded-md" />
                    ) : (
                        <p className="text-sm text-slate-600 mt-1">{formData.bio}</p>
                    )}
                </div>

                <div className="border-t pt-4 space-y-3">
                    <div>
                        <label className="text-xs font-semibold text-slate-500">EMAIL</label>
                        {isEditing ? <input name="email" value={formData.email} onChange={handleInputChange} className="w-full text-sm text-slate-600 mt-1 p-2 border rounded-md" /> : <p className="text-sm text-slate-600 mt-1">{formData.email}</p>}
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-500">PHONE</label>
                        {isEditing ? <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full text-sm text-slate-600 mt-1 p-2 border rounded-md" /> : <p className="text-sm text-slate-600 mt-1">{formData.phone}</p>}
                    </div>
                </div>

                <div className="border-t pt-4">
                    <label className="text-xs font-semibold text-slate-500">SOCIALS</label>
                    <div className="mt-2 space-y-2">
                    {Object.keys(socialIcons).map(key => (
                         isEditing ? (
                            <input key={key} name={`socials.${key}`} value={formData.socials[key as keyof typeof formData.socials] || ''} onChange={handleInputChange} placeholder={`${key.charAt(0).toUpperCase() + key.slice(1)} URL`} className="w-full text-sm text-slate-600 p-2 border rounded-md" />
                         ) : (
                           formData.socials[key as keyof typeof formData.socials] &&
                            <a key={key} href={formData.socials[key as keyof typeof formData.socials]} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-brand-primary hover:underline">
                                {React.createElement(socialIcons[key], { className: "w-5 h-5" })} {formData.socials[key as keyof typeof formData.socials]?.split('/').pop()}
                            </a>
                         )
                    ))}
                    </div>
                </div>

                {isEditing && (
                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <button onClick={handleCancel} className="px-4 py-2 text-sm font-semibold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">Cancel</button>
                        <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold bg-brand-primary text-white rounded-lg hover:bg-opacity-90">Save Changes</button>
                    </div>
                )}
            </div>

            {/* Right Column: Listings & Reviews */}
            <div className="lg:col-span-2 space-y-8">
                {/* My Listings */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">My Listings</h3>
                    <div className="border-b border-slate-200 mb-4">
                        <nav className="-mb-px flex space-x-6">
                            <button onClick={() => setActivePropertyTab('active')} className={`py-2 px-1 border-b-2 font-semibold ${activePropertyTab === 'active' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                                Active ({activeProperties.length})
                            </button>
                            <button onClick={() => setActivePropertyTab('sold')} className={`py-2 px-1 border-b-2 font-semibold ${activePropertyTab === 'sold' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                                Sold ({soldProperties.length})
                            </button>
                        </nav>
                    </div>
                    <div className="space-y-3">
                        {(activePropertyTab === 'active' ? activeProperties : soldProperties).map(prop => (
                            <div key={prop.id} className="flex items-center gap-4 p-2 rounded-md hover:bg-slate-50">
                                <img src={prop.images[0]} alt={prop.title} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                                <div className="flex-grow">
                                    <p className="font-semibold text-slate-800 text-sm truncate">{prop.title}</p>
                                    <p className="text-xs text-slate-500 truncate">{prop.address.street}, {prop.address.city}</p>
                                </div>
                                <p className="text-sm font-bold text-brand-dark flex-shrink-0">
                                    ${prop.price.toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Client Reviews */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Client Reviews</h3>
                    {agentReviews.length > 0 ? (
                        <div className="space-y-4">
                            <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-center gap-4">
                                <span className="text-4xl font-bold text-slate-800">{averageRating}</span>
                                <div className="text-center">
                                    <StarRating rating={averageRating} className="w-6 h-6" />
                                    <p className="text-sm text-slate-500 mt-1">Based on {reviewCount} reviews</p>
                                </div>
                            </div>
                            {agentReviews.map(review => (
                                <div key={review.id} className="border-t pt-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <UserCircleIcon className="w-6 h-6 text-slate-400"/>
                                            <span className="font-semibold text-sm text-slate-800">{review.reviewerUsername}</span>
                                        </div>
                                        <StarRating rating={review.rating} />
                                    </div>
                                    <p className="text-sm text-slate-600 mt-2 pl-8">{review.comment}</p>
                                    <p className="text-xs text-slate-400 mt-1 text-right">{new Date(review.timestamp).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500 text-center py-4">No reviews yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AgentProfilePage;