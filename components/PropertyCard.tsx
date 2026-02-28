
import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { Property } from '../types';
import { BedIcon, BathIcon, AreaIcon } from './icons/PropertyIcons';
import { LocationPinIcon } from './icons/NavIcons';
import { HeartIcon, HeartIconSolid, CalculatorIcon, CalendarIcon, CheckBadgeIcon, StarIcon, SparklesIcon, Square2StackIcon, PencilIcon, TrashIcon, CubeTransparentIcon, EyeIcon, ShareIcon, LinkIcon, CheckIcon, VrHeadsetIcon } from './icons/ActionIcons';
import { FacebookIcon, TwitterIcon, WhatsAppIcon } from './icons/SocialIcons';
import { ListingType, PropertyType } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';
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
            <FacebookIcon className="w-5 h-5 text-blue-600" /><span>Facebook</span>
        </button>
        <button onClick={(e) => handleSocialClick(e, socialLinks.twitter)} className="share-button">
            <TwitterIcon className="w-5 h-5 text-sky-400" /><span>Twitter</span>
        </button>
        <button onClick={(e) => handleSocialClick(e, socialLinks.whatsapp)} className="share-button">
            <WhatsAppIcon className="w-5 h-5 text-green-500" /><span>WhatsApp</span>
        </button>
        <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
        <button onClick={handleCopy} className="share-button">
            {copied ? <><CheckIcon className="w-5 h-5 text-green-500"/><span>Copied!</span></> : <><LinkIcon className="w-5 h-5 text-slate-500" /><span>Copy Link</span></>}
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

interface PropertyCardProps {
  property: Property;
  isSaved: boolean;
  isCompared: boolean;
  isOwner: boolean;
  onSaveToggle: (propertyId: string) => void;
  onOpenCalculator: (property: Property) => void;
  onOpenTourModal: (property: Property) => void;
  onFindSimilar: (property: Property) => void;
  onOpenDetailModal: (property: Property) => void;
  onOpenVRTour: (url: string) => void;
  onToggleCompare: (property: Property) => void;
  onEdit: (property: Property) => void;
  onDelete: (propertyId: string) => void;
}


const PropertyCard: React.FC<PropertyCardProps> = (props) => {
    const { property, isSaved, isCompared, isOwner, onSaveToggle, onOpenCalculator, onOpenTourModal, onFindSimilar, onOpenDetailModal, onOpenVRTour, onToggleCompare, onEdit, onDelete } = props;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
    const shareRef = useRef<HTMLDivElement>(null);
    const { formatCurrency } = useCurrency();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (shareRef.current && !shareRef.current.contains(event.target as Node)) {
                setIsShareMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
    const priceSuffix = useMemo(() => {
        if (property.propertyType === PropertyType.TRANSPORT) return '/day';
        if (property.perNightPrice) return '/night';
        if (property.listingType === ListingType.RENT) return '/mo';
        return '';
    }, [property.listingType, property.perNightPrice, property.propertyType]);

    const formattedPrice = `${formatCurrency(property.price)}${priceSuffix}`;

    const handleActionClick = (e: React.MouseEvent, action: (p: Property) => void) => {
        e.stopPropagation();
        e.preventDefault();
        action(property);
    };
    
    const handleIdActionClick = (e: React.MouseEvent, action: (id: string) => void) => {
        e.stopPropagation();
        e.preventDefault();
        action(property.id);
    };

    const handlePrevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex(prev => (prev === 0 ? property.images.length - 1 : prev - 1));
    };

    const handleNextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex(prev => (prev === property.images.length - 1 ? 0 : prev + 1));
    };

    const handleVrTourClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if(property.vrTourUrl) {
            onOpenVRTour(property.vrTourUrl);
        }
    };
    
    const showStandardActions = property.propertyType !== PropertyType.TRANSPORT && property.propertyType !== PropertyType.WELLNESS;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group flex flex-col border border-slate-200 dark:border-slate-700">
      <div className="relative overflow-hidden group/image">
        <button onClick={() => onOpenDetailModal(property)} className="absolute inset-0 z-0"></button>
        <img src={property.images[currentImageIndex] || 'https://picsum.photos/seed/placeholder/800/600'} alt={property.title} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105" />
        
        {property.images.length > 1 && (
            <>
                <button onClick={handlePrevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm text-white p-1.5 rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity z-10 hover:bg-black/60">
                    <ChevronLeftIcon className="w-4 h-4" />
                </button>
                <button onClick={handleNextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm text-white p-1.5 rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity z-10 hover:bg-black/60">
                    <ChevronRightIcon className="w-4 h-4" />
                </button>
                 <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {property.images.map((_, index) => (
                        <div key={index} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'bg-white w-3' : 'bg-white/50'}`} />
                    ))}
                </div>
            </>
        )}

        <div className="absolute top-3 right-3 flex flex-col space-y-2" ref={shareRef}>
            <button
                onClick={(e) => handleIdActionClick(e, onSaveToggle)}
                className="bg-white/90 backdrop-blur-sm p-2 rounded-full text-slate-700 hover:text-brand-accent hover:bg-white shadow-sm transition-all duration-300 z-10"
                aria-label={isSaved ? "Unsave property" : "Save property"}
            >
                {isSaved ? (
                    <HeartIconSolid className="w-5 h-5 text-brand-accent animate-pulse" />
                ) : (
                    <HeartIcon className="w-5 h-5" />
                )}
            </button>
            <button
                onClick={(e) => handleActionClick(e, onToggleCompare)}
                className={`bg-white/90 backdrop-blur-sm p-2 rounded-full text-slate-700 hover:bg-white shadow-sm transition-all duration-300 z-10 ${isCompared ? 'text-brand-primary' : ''}`}
                aria-label={isCompared ? "Remove from comparison" : "Add to comparison"}
            >
                <Square2StackIcon className="w-5 h-5" />
            </button>
            {property.vrTourUrl && (
                <button
                    onClick={handleVrTourClick}
                    className="bg-brand-primary text-white p-2 rounded-full shadow-lg hover:scale-105 transition-all duration-300 z-10"
                    aria-label="Open VR Tour"
                >
                    <VrHeadsetIcon className="w-5 h-5" />
                </button>
            )}
             <div className="relative">
                <button
                    onClick={(e) => {e.stopPropagation(); setIsShareMenuOpen(prev => !prev);}}
                    className="bg-white/90 backdrop-blur-sm p-2 rounded-full text-slate-700 hover:text-brand-primary hover:bg-white shadow-sm transition-all duration-300 z-10"
                    aria-label="Share property"
                >
                    <ShareIcon className="w-5 h-5" />
                </button>
                {isShareMenuOpen && (
                    <ShareMenu propertyTitle={property.title} propertyUrl={`${window.location.href.split('?')[0]}?propertyId=${property.id}`} />
                )}
            </div>
        </div>

        {isOwner && (
            <div className="absolute bottom-3 left-3 flex space-x-2 z-10">
                <button onClick={(e) => handleActionClick(e, onEdit)} className="bg-white/90 text-blue-600 p-2 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-all">
                    <PencilIcon className="w-4 h-4" />
                </button>
                <button onClick={(e) => handleIdActionClick(e, onDelete)} className="bg-white/90 text-brand-accent p-2 rounded-full shadow-lg hover:bg-brand-accent hover:text-white transition-all">
                    <TrashIcon className="w-4 h-4" />
                </button>
            </div>
        )}

        <div className="absolute top-3 left-3 flex flex-col items-start gap-y-1.5">
            <div className="flex items-center gap-x-1.5">
                <div className={`px-2.5 py-0.5 text-[10px] font-bold text-white rounded-full shadow-sm uppercase tracking-wider ${property.listingType === 'For Sale' ? 'bg-emerald-600' : 'bg-brand-secondary'}`}>
                    {property.listingType}
                </div>
                {property.verified && (
                    <div className="flex items-center gap-0.5 bg-brand-primary text-white px-2 py-0.5 text-[10px] font-bold rounded-full shadow-sm uppercase tracking-wider">
                        <CheckBadgeIcon className="w-3 h-3" />
                        <span>Verified</span>
                    </div>
                )}
            </div>
            {property.smartContractReady && (
                <div className="flex items-center gap-0.5 bg-brand-dark/90 backdrop-blur-sm text-white px-2 py-0.5 text-[10px] font-bold rounded-full shadow-sm uppercase tracking-wider">
                    <CubeTransparentIcon className="w-3 h-3 text-brand-accent" />
                    <span>Smart Ready</span>
                </div>
            )}
        </div>
      </div>
      <div onClick={() => onOpenDetailModal(property)} className="p-4 flex-grow flex flex-col text-left cursor-pointer">
        <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">{property.propertyType}</span>
            <p className="text-xl font-bold text-brand-dark dark:text-white">{formattedPrice}</p>
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1 truncate group-hover:text-brand-primary transition-colors">{property.title}</h3>
        <div className="flex items-center text-slate-500 dark:text-slate-400 mb-4 text-xs">
          <LocationPinIcon className="w-3.5 h-3.5 mr-1 text-slate-400 flex-shrink-0" />
          <span className="truncate">{property.address.street}, {property.address.city}</span>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/30 p-3 rounded-lg mb-4 text-xs">
            <div className="flex flex-col items-center border-r border-slate-200 dark:border-slate-600">
                <BedIcon className="w-4 h-4 text-brand-primary mb-1"/>
                <span className="font-semibold">{property.details.beds} Beds</span>
            </div>
            <div className="flex flex-col items-center border-r border-slate-200 dark:border-slate-600">
                <BathIcon className="w-4 h-4 text-brand-primary mb-1"/>
                <span className="font-semibold">{property.details.baths} Baths</span>
            </div>
            <div className="flex flex-col items-center">
                <AreaIcon className="w-4 h-4 text-brand-primary mb-1"/>
                <span className="font-semibold">{property.details.area.toLocaleString()} sqft</span>
            </div>
        </div>

        <div className="mt-auto pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-brand-light dark:bg-slate-700 flex items-center justify-center text-brand-primary font-bold text-[10px] uppercase">
                    {property.agent.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-700 dark:text-white truncate max-w-[80px]">{property.agent.name}</span>
                </div>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
                <EyeIcon className="w-3.5 h-3.5"/>
                <span className="text-[10px] font-bold">{property.views}</span>
            </div>
        </div>

        {showStandardActions && (
            <div className="mt-4 flex items-center gap-2">
                <button 
                    onClick={(e) => handleActionClick(e, onOpenTourModal)}
                    className="flex-1 bg-brand-primary text-white text-xs font-bold py-2.5 rounded-lg hover:bg-brand-secondary transition-all shadow-sm"
                >
                    Book Tour
                </button>
                <button 
                    onClick={(e) => handleActionClick(e, onFindSimilar)}
                    className="p-2.5 bg-brand-light dark:bg-slate-700 text-brand-primary rounded-lg hover:bg-brand-primary hover:text-white transition-all"
                    title="Find Similar"
                >
                    <SparklesIcon className="w-4 h-4" />
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;