import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import type { Property, ValuationResult, User, Review } from '../types';
import { Language, ListingType } from '../types';
import { CloseIcon, LocationPinIcon, GlobeAltIcon } from './icons/NavIcons';
import { BedIcon, BathIcon, AreaIcon } from './icons/PropertyIcons';
import { CheckBadgeIcon, StarIcon, CpuChipIcon, VrHeadsetIcon, ChatBubbleLeftRightIcon, VideoCameraIcon, CubeTransparentIcon, ShareIcon, LinkIcon, CheckIcon } from './icons/ActionIcons';
import AgentReviews from './AgentReviews';
import { getReviewsForAgent } from '../lib/data';
import { useTranslations } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { FacebookIcon, TwitterIcon, WhatsAppIcon } from './icons/SocialIcons';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

interface ShareMenuProps {
  propertyTitle: string;
  propertyUrl: string;
}

const ShareMenu: React.FC<ShareMenuProps> = ({ propertyTitle, propertyUrl }) => {
  const [copied, setCopied] = useState(false);

  const shareText = `Check out this amazing property I found on AfriProperty: ${propertyTitle}`;
  
  const socialLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(propertyUrl)}&quote=${encodeURIComponent(shareText)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(propertyUrl)}&text=${encodeURIComponent(shareText)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${propertyUrl}`)}`
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(propertyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleSocialClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200/80 dark:border-slate-700 py-2 z-20 animate-fade-in-up-sm">
        <button onClick={(e) => handleSocialClick(e, socialLinks.facebook)} className="share-button">
            <FacebookIcon className="w-5 h-5" /><span>Facebook</span>
        </button>
        <button onClick={(e) => handleSocialClick(e, socialLinks.twitter)} className="share-button">
            <TwitterIcon className="w-5 h-5" /><span>Twitter</span>
        </button>
        <button onClick={(e) => handleSocialClick(e, socialLinks.whatsapp)} className="share-button">
            <WhatsAppIcon className="w-5 h-5" /><span>WhatsApp</span>
        </button>
        <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
        <button onClick={handleCopy} className="share-button">
            {copied ? <><CheckIcon className="w-5 h-5 text-green-500"/><span>Copied!</span></> : <><LinkIcon className="w-5 h-5" /><span>Copy Link</span></>}
        </button>
        <style>{`
            .share-button {
                @apply w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3;
            }
             @keyframes fadeInUpSm {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-up-sm {
                animation: fadeInUpSm 0.2s ease-out forwards;
            }
        `}</style>
    </div>
  );
};


interface PropertyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  currentUser: User | null;
  onOpenAgentContact: (mode: 'chat' | 'video', agentName: string) => void;
  onOpenVRTour: (url: string) => void;
  onMessageAgent: (property: Property) => void;
  onLeaveReview: (agent: Property['agent']) => void;
}

const valuationSchema = {
    type: Type.OBJECT,
    properties: {
        estimated_value: { type: Type.NUMBER, description: "The estimated market value of the property as a number." },
        confidence: { type: Type.STRING, description: "Confidence level of the estimation: 'Low', 'Medium', or 'High'." },
        rationale: { type: Type.STRING, description: "A brief, 2-3 sentence rationale explaining the valuation." },
    },
    required: ["estimated_value", "confidence", "rationale"]
};

const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({ isOpen, onClose, property, currentUser, onOpenAgentContact, onOpenVRTour, onMessageAgent, onLeaveReview }) => {
  const [activeImage, setActiveImage] = useState(property.images[0]);
  const [isValuating, setIsValuating] = useState(false);
  const [valuation, setValuation] = useState<ValuationResult | null>(null);
  const [valuationError, setValuationError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);
  const { formatCurrency } = useCurrency();

  const { language } = useTranslations();
  const [translatedDescription, setTranslatedDescription] = useState<string | null>(null);
  const [translatedNeighborhood, setTranslatedNeighborhood] = useState<string | null>(null);
  const [isTranslatingDesc, setIsTranslatingDesc] = useState(false);
  const [isTranslatingNeighborhood, setIsTranslatingNeighborhood] = useState(false);
  const [showTranslatedDesc, setShowTranslatedDesc] = useState(false);
  const [showTranslatedNeighborhood, setShowTranslatedNeighborhood] = useState(false);
  
  const formattedPrice = property.listingType === 'For Rent' 
      ? `${formatCurrency(property.price)}/mo` 
      : formatCurrency(property.price);

  useEffect(() => {
    const initModal = async () => {
      if (isOpen) {
        setActiveImage(property.images[0]);
        // FIX: getReviewsForAgent is an async function. We need to await its result before setting state.
        const agentReviews = await getReviewsForAgent(property.agent.name);
        setReviews(agentReviews);
        // Reset translation state
        setTranslatedDescription(null);
        setTranslatedNeighborhood(null);
        setShowTranslatedDesc(false);
        setShowTranslatedNeighborhood(false);
      }
    };
    initModal();
  }, [isOpen, property]);
  
  const handlePrevImage = () => {
      const currentIndex = property.images.indexOf(activeImage);
      const prevIndex = currentIndex === 0 ? property.images.length - 1 : currentIndex - 1;
      setActiveImage(property.images[prevIndex]);
  };

  const handleNextImage = () => {
      const currentIndex = property.images.indexOf(activeImage);
      const nextIndex = currentIndex === property.images.length - 1 ? 0 : currentIndex + 1;
      setActiveImage(property.images[nextIndex]);
  };

   useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (shareRef.current && !shareRef.current.contains(event.target as Node)) {
            setIsShareMenuOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGetValuation = async () => {
    setIsValuating(true);
    setValuation(null);
    setValuationError(null);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const prompt = `
            Based on the following property details, provide a market valuation.
            Property:
            - Type: ${property.propertyType}
            - Location: ${property.address.city}
            - Price: $${property.price.toLocaleString()}
            - Beds: ${property.details.beds}, Baths: ${property.details.baths}
            - Area: ${property.details.area} sqft
            - Key Amenities: ${property.amenities.slice(0,3).join(', ')}
            
            Provide your response as a JSON object with "estimated_value" (number), "confidence" ('Low', 'Medium', or 'High'), and a "rationale" (string).
        `;
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: valuationSchema
            }
        });
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        setValuation(result);
    } catch (err) {
        console.error("Valuation Error:", err);
        setValuationError("Could not generate valuation at this time.");
    } finally {
        setIsValuating(false);
    }
  };

  const handleTranslate = async (text: string, type: 'description' | 'neighborhood') => {
    if (language === Language.EN) return;

    if (type === 'description') {
        if (translatedDescription) {
            setShowTranslatedDesc(!showTranslatedDesc);
            return;
        }
        setIsTranslatingDesc(true);
    } else {
        if (translatedNeighborhood) {
            setShowTranslatedNeighborhood(!showTranslatedNeighborhood);
            return;
        }
        setIsTranslatingNeighborhood(true);
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const languageMap: Record<string, string> = {
            [Language.FR]: 'French',
            [Language.PT]: 'Portuguese',
            [Language.ES]: 'Spanish',
            [Language.AR]: 'Arabic',
        };
        const targetLanguageName = languageMap[language];
        if (!targetLanguageName) throw new Error("Unsupported language");

        const prompt = `Translate the following real estate text to ${targetLanguageName}. Keep the meaning and tone professional and appealing. Return ONLY the translated text, with no additional commentary or quotation marks.

Text to translate:
"${text}"`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const translatedText = response.text;

        if (type === 'description') {
            setTranslatedDescription(translatedText);
            setShowTranslatedDesc(true);
        } else {
            setTranslatedNeighborhood(translatedText);
            setShowTranslatedNeighborhood(true);
        }
    } catch (error) {
        console.error("Translation error:", error);
        alert('Sorry, there was an error translating the text.');
    } finally {
        if (type === 'description') {
            setIsTranslatingDesc(false);
        } else {
            setIsTranslatingNeighborhood(false);
        }
    }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100] sm:p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-900 w-full h-full sm:h-auto sm:rounded-2xl shadow-2xl sm:max-w-3xl sm:max-h-[90vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" 
        onClick={e => e.stopPropagation()}
      >
        <header className="relative flex justify-center sm:justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <button onClick={onClose} className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-brand-primary hover:underline sm:hidden">&larr; Back</button>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-brand-dark dark:text-white truncate">{property.title}</h2>
            <div className="flex items-center justify-center sm:justify-start text-slate-500 dark:text-slate-400 text-sm">
              <LocationPinIcon className="w-4 h-4 mr-1.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">{property.address.street}, {property.address.city}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:block">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        
        <div className="flex-grow overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* Left Column: Media & Agent */}
            <div className="space-y-6">
                <div className="space-y-4">
                    <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-slate-200 relative group">
                        {property.images.length > 1 && (
                            <>
                                <button onClick={handlePrevImage} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <ChevronLeftIcon className="w-6 h-6" />
                                </button>
                                <button onClick={handleNextImage} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <ChevronRightIcon className="w-6 h-6" />
                                </button>
                            </>
                        )}
                        <img src={activeImage} alt="Main property view" className="w-full h-full object-cover" />
                        {property.vrTourUrl && (
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => onOpenVRTour(property.vrTourUrl as string)}
                                    className="bg-white/80 backdrop-blur-sm text-brand-dark font-bold py-3 px-6 rounded-lg flex items-center gap-2 transform hover:scale-105 transition-transform"
                                >
                                    <VrHeadsetIcon className="w-6 h-6" />
                                    Enter VR Tour
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                        {property.images.slice(0, 5).map((img, index) => (
                            <button key={index} onClick={() => setActiveImage(img)} className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden ring-2 ring-offset-2 transition-all ${activeImage === img ? 'ring-brand-primary' : 'ring-transparent'}`}>
                                 <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                    <h3 className="text-lg font-semibold text-brand-dark dark:text-white mb-3">Listed By</h3>
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="font-bold text-slate-800 dark:text-white">{property.agent.name}</p>
                                {property.agent.verified && <CheckBadgeIcon className="w-5 h-5 text-green-500" />}
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{property.agent.phone}</p>
                        </div>
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                            <StarIcon className="w-5 h-5 text-amber-400" />
                            <span className="font-bold">{property.agent.rating}</span>
                            <span className="text-slate-400">({property.agent.reviewCount} reviews)</span>
                        </div>
                    </div>
                </div>

                 <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                    <AgentReviews reviews={reviews} agent={property.agent} currentUser={currentUser} onLeaveReview={onLeaveReview} />
                 </div>
            </div>

            {/* Right Column: Details */}
            <div className="space-y-6">
                <div>
                    <span className="text-sm font-semibold text-brand-primary">{property.propertyType}</span>
                    <div className="flex items-baseline gap-4 mt-1">
                        <p className="text-4xl font-bold text-brand-dark dark:text-white">{formattedPrice}</p>
                        {property.verified && (
                            <div className="flex items-center gap-1 bg-brand-gold text-brand-dark px-2.5 py-1 text-xs font-bold rounded-full">
                                <CheckBadgeIcon className="w-4 h-4" />
                                <span>Verified</span>
                            </div>
                        )}
                    </div>
                    {property.smartContractReady && (
                        <div className="mt-3 flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                            <CubeTransparentIcon className="w-6 h-6 text-brand-primary flex-shrink-0"/>
                            <p className="text-sm font-medium">This property supports secure, smart contract-based transactions.</p>
                        </div>
                    )}
                </div>
                
                <div className="border-t border-b border-slate-200 dark:border-slate-700 py-4 flex flex-col sm:flex-row items-center gap-2">
                    <button onClick={() => onMessageAgent(property)} className="w-full sm:w-auto flex-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold py-3 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                        <ChatBubbleLeftRightIcon className="w-5 h-5" />
                        Message
                    </button>
                    <button onClick={() => onOpenAgentContact('video', property.agent.name)} className="w-full sm:w-auto flex-1 bg-brand-primary text-white font-semibold py-3 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2">
                         <VideoCameraIcon className="w-5 h-5" />
                         Video Call
                    </button>
                     <div className="relative w-full sm:w-auto" ref={shareRef}>
                        <button 
                            onClick={() => setIsShareMenuOpen(prev => !prev)}
                            className="w-full sm:w-auto flex-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold py-3 px-4 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <ShareIcon className="w-5 h-5" />
                            Share
                        </button>
                        {isShareMenuOpen && (
                            <ShareMenu propertyTitle={property.title} propertyUrl={`${window.location.href.split('?')[0]}?propertyId=${property.id}`} />
                        )}
                    </div>
                </div>

                {/* AI Valuation Section */}
                {(property.listingType === ListingType.SALE || property.listingType === ListingType.FOR_INVESTMENT) && (
                    <div className="bg-brand-light dark:bg-slate-800 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-brand-dark dark:text-white">AI Property Valuation</h3>
                            <button onClick={handleGetValuation} disabled={isValuating} className="bg-brand-primary text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all disabled:bg-slate-400 flex items-center gap-2">
                                {isValuating ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                     <CpuChipIcon className="w-5 h-5"/>
                                )}
                                <span>{isValuating ? 'Analyzing...' : 'Get AI Valuation'}</span>
                            </button>
                        </div>
                        {valuation && (
                            <div className="mt-4 border-t border-blue-200 dark:border-slate-700 pt-4 space-y-2">
                                <p className="text-3xl font-bold text-brand-dark dark:text-white">{formatCurrency(valuation.estimated_value)}</p>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">Confidence:</span>
                                    <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${valuation.confidence === 'High' ? 'bg-green-100 text-green-800' : valuation.confidence === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{valuation.confidence}</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{valuation.rationale}</p>
                            </div>
                        )}
                        {valuationError && <p className="text-sm text-red-500 mt-2">{valuationError}</p>}
                    </div>
                )}
                
                <div className="flex justify-around text-center text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <BedIcon className="w-6 h-6 text-slate-500 dark:text-slate-400"/>
                        <span className="font-medium">{property.details.beds} Beds</span>
                    </div>
                    <div className="text-slate-200 dark:text-slate-700">|</div>
                    <div className="flex items-center space-x-2">
                        <BathIcon className="w-6 h-6 text-slate-500 dark:text-slate-400"/>
                        <span className="font-medium">{property.details.baths} Baths</span>
                    </div>
                    <div className="text-slate-200 dark:text-slate-700">|</div>
                    <div className="flex items-center space-x-2">
                        <AreaIcon className="w-6 h-6 text-slate-500 dark:text-slate-400"/>
                        <span className="font-medium">{property.details.area.toLocaleString()} sqft</span>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold text-brand-dark dark:text-white">Description</h3>
                        {language !== Language.EN && (
                            <button 
                                onClick={() => handleTranslate(property.description, 'description')}
                                disabled={isTranslatingDesc}
                                className="text-xs font-semibold text-brand-primary hover:text-brand-dark flex items-center gap-1 disabled:opacity-50"
                            >
                                {isTranslatingDesc ? (
                                    <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <GlobeAltIcon className="w-4 h-4" />
                                )}
                                <span>
                                    {isTranslatingDesc ? 'Translating...' : (showTranslatedDesc ? 'Show Original' : 'Translate')}
                                </span>
                            </button>
                        )}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                        {showTranslatedDesc ? translatedDescription : property.description}
                    </p>
                    {showTranslatedDesc && <p className="text-xs text-slate-400 mt-1 italic">Translated by AI</p>}
                </div>
                
                 <div>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold text-brand-dark dark:text-white">Neighborhood</h3>
                        {language !== Language.EN && (
                            <button 
                                onClick={() => handleTranslate(property.neighborhoodInfo, 'neighborhood')}
                                disabled={isTranslatingNeighborhood}
                                className="text-xs font-semibold text-brand-primary hover:text-brand-dark flex items-center gap-1 disabled:opacity-50"
                            >
                                {isTranslatingNeighborhood ? (
                                    <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <GlobeAltIcon className="w-4 h-4" />
                                )}
                                <span>
                                    {isTranslatingNeighborhood ? 'Translating...' : (showTranslatedNeighborhood ? 'Show Original' : 'Translate')}
                                </span>
                            </button>
                        )}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                        {showTranslatedNeighborhood ? translatedNeighborhood : property.neighborhoodInfo}
                    </p>
                    {showTranslatedNeighborhood && <p className="text-xs text-slate-400 mt-1 italic">Translated by AI</p>}
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-brand-dark dark:text-white mb-2">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                        {property.amenities.map(amenity => (
                            <span key={amenity} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-full">
                                {amenity}
                            </span>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-brand-dark dark:text-white mb-2">Location</h3>
                     <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border">
                       <iframe
                          className="w-full h-full"
                          loading="lazy"
                          allowFullScreen
                          src={`https://maps.google.com/maps?q=${property.coordinates.lat},${property.coordinates.lng}&hl=es;z=14&output=embed`}>
                        </iframe>
                    </div>
                </div>
            </div>
          </div>
        </div>

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

export default PropertyDetailModal;