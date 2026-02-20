
import type { Property, NeighborhoodGuide, KnowledgeBaseArticle, ForumPost, Achievement, ForumCategory, CoInvestmentDeal, ProfessionalContact, ExclusiveDeal, ServiceProvider, Notification } from './types';
import { ListingType, PropertyType, Language, PropertyStatus, DealType, Currency, NotificationType } from './types';
import { StudentIcon, AffordableIcon, TownshipIcon, RuralIcon, StayIcon, TransportIcon, WellnessIcon } from './components/icons/CategoryIcons';
import React from 'react';
import { StarIcon, TrophyIcon } from './components/icons/ActionIcons';
import { RocketLaunchIcon } from './components/icons/AgentDashboardIcons';

export const ALL_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Modern Downtown Loft',
    listingType: ListingType.RENT,
    propertyType: PropertyType.APARTMENT,
    address: { street: '123 Main St', city: 'Urbanville', zip: '10001' },
    coordinates: { lat: 40.7128, lng: -74.0060 },
    price: 3500,
    purchasePrice: 450000,
    details: { beds: 2, baths: 2, area: 1200 },
    description: 'A stunning loft in the heart of the city. Features high ceilings, large windows, and a modern kitchen. Perfect for young professionals who want to be in the center of the action.',
    neighborhoodInfo: "Located in the vibrant Arts District, you're steps away from top-rated restaurants, theaters, and public transport.",
    amenities: ['Gym', 'Rooftop Deck', 'In-unit Laundry', 'Doorman', 'Pet Friendly'],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2070&auto=format&fit=crop',
    ],
    // FIX: Added agent.id
    agent: { id: 'agent_peter', name: 'Peter Van der Merwe', phone: '555-123-4567', verified: true, rating: 4.9, reviewCount: 82 },
    featured: true,
    verified: true,
    smartContractReady: true,
    views: 1284,
    status: PropertyStatus.ACTIVE,
    dateListed: Date.now() - 10 * 24 * 60 * 60 * 1000,
    saves: 102,
  },
  {
    id: '2',
    title: 'Cozy Student Room near Campus',
    listingType: ListingType.RENT,
    propertyType: PropertyType.STUDENT_HOUSING,
    address: { street: '456 University Ave', city: 'Collegia', zip: '20002' },
    coordinates: { lat: 34.0522, lng: -118.2437 },
    price: 850,
    purchasePrice: 90000,
    details: { beds: 1, baths: 1, area: 300 },
    description: 'Fully furnished room, just a 5-minute walk from the main campus. All utilities included.',
    neighborhoodInfo: "The University Park neighborhood is bustling with student life.",
    amenities: ['Furnished', 'Utilities Included', 'High-speed Internet'],
    images: [
        'https://images.unsplash.com/photo-1555854817-5b2260d1bd64?q=80&w=2070&auto=format&fit=crop',
    ],
    // FIX: Added agent.id
    agent: { id: 'agent_campus', name: 'Campus Rentals', phone: '555-987-6543', verified: true, rating: 4.7, reviewCount: 150 },
    featured: true,
    verified: true,
    views: 2543,
    status: PropertyStatus.ACTIVE,
    dateListed: Date.now() - 5 * 24 * 60 * 60 * 1000,
    saves: 230,
  },
  {
    id: '3',
    title: 'Spacious Township Family Home',
    listingType: ListingType.SALE,
    propertyType: PropertyType.TOWNSHIP,
    address: { street: '789 Hope St', city: 'Soweto', zip: '1804' },
    coordinates: { lat: -26.2661, lng: 27.8587 },
    price: 850000,
    purchasePrice: 600000,
    details: { beds: 4, baths: 2, area: 1800 },
    description: 'A beautiful and spacious family home in a vibrant township. Features a large yard and modern finishes.',
    neighborhoodInfo: "A family-friendly area with a strong sense of community.",
    amenities: ['Garden', 'Secure Parking', 'Alarm System'],
    images: [
        'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2000&auto=format&fit=crop',
    ],
    // FIX: Added agent.id
    agent: { id: 'agent_admin', name: 'Admin', phone: '555-222-3333', verified: true, rating: 4.8, reviewCount: 45 },
    featured: true,
    verified: false,
    views: 3102,
    status: PropertyStatus.ACTIVE,
    dateListed: Date.now() - 30 * 24 * 60 * 60 * 1000,
    saves: 150,
  }
];

export const CATEGORIES = [
  {
    titleKey: "shortTermStays",
    descriptionKey: "shortTermStaysDescription",
    Icon: StayIcon
  },
  {
    titleKey: "transportRentals",
    descriptionKey: "transportRentalsDescription",
    Icon: TransportIcon
  },
  {
    titleKey: "wellnessRetreats",
    descriptionKey: "wellnessRetreatsDescription",
    Icon: WellnessIcon
  },
  {
    titleKey: "longTermRentals",
    descriptionKey: "longTermRentalsDescription",
    Icon: StudentIcon
  }
];


export const ALL_AMENITIES: string[] = [
    'Swimming Pool', 'Gym', 'Pet Friendly', 'In-unit Laundry', 'Secure Parking',
    'Garden', 'Rooftop Deck', 'Doorman', 'Furnished', 'Utilities Included', 
    'High-speed Internet', 'Study Lounge', 'Patio', 'Fireplace', 'Garage',
    'Ocean View', 'Gated Community', 'Private Theater', 'Wine Cellar', 'Acreage',
    'Zoned Commercial'
];

export const NEIGHBORHOOD_GUIDES: NeighborhoodGuide[] = [
    {
        id: 'urbanville_arts_district',
        name: 'Urbanville Arts District',
        description: 'Vibrant, creative, and always buzzing. The perfect spot for those who love city life.',
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2070&auto=format&fit=crop',
        coordinates: { lat: 40.7128, lng: -74.0060 },
        profile: {
            history: "Once a warehouse district, the area was revitalized in the late 90s by artists seeking large, affordable spaces.",
            demographics: "Primarily young professionals, artists, and students.",
            publicTransport: "Excellent connectivity with access to major subway lines.",
            localBusinesses: ["The Daily Grind Cafe", "Canvas & Clay Art Supplies"],
        },
        scores: { safety: 7, affordability: 5, schools: 6, nightlife: 10, familyFriendly: 5 },
        marketTrends: [],
        gallery: [],
        virtualTourUrl: '',
    }
];

export const LIFESTYLE_QUIZ_QUESTIONS = [
    {
        question: "What's your primary reason for moving?",
        options: ["Starting a family", "For my career or studies", "A quieter lifestyle", "To be in the center of the action"],
        key: 'reason'
    }
];

export const KNOWLEDGE_BASE_ARTICLES: KnowledgeBaseArticle[] = [
    {
        id: 'kb1',
        title: 'How to Write a Listing Description that Sells',
        category: 'Listings',
        content: "Start with a compelling headline that grabs attention..."
    }
];

export const FORUM_POSTS: ForumPost[] = [
    {
        id: 'fp1',
        title: 'Best CRM for new agents?',
        author: 'Jane Doe',
        timestamp: Date.now() - 2 * 60 * 60 * 1000,
        content: "Hey everyone, I'm looking for recommendations...",
        replies: 5,
        views: 45
    }
];

export const AGENT_ACHIEVEMENTS: Omit<Achievement, 'id'>[] = [
    {
        title: 'First Listing',
        description: 'List your first property on the platform.',
        goal: 1,
        badge: RocketLaunchIcon,
    }
];

export const FORUM_CATEGORIES: ForumCategory[] = [
    { id: 'fc1', name: 'Market Trends', description: 'Discuss the latest market shifts.' }
];

export const INVESTOR_FORUM_POSTS: ForumPost[] = [];
export const CO_INVESTMENT_DEALS: CoInvestmentDeal[] = [];
export const PROFESSIONAL_CONTACTS: ProfessionalContact[] = [];
export const EXCLUSIVE_DEALS: ExclusiveDeal[] = [];

export const INVESTOR_ACHIEVEMENTS: Omit<Achievement, 'id'>[] = [
    {
        title: 'First Investment',
        description: 'Acquire your first property.',
        goal: 1,
        badge: RocketLaunchIcon,
    }
];

export const SERVICE_PROVIDERS: ServiceProvider[] = [
  { id: 'sp1', name: 'John\'s Plumbing', service: 'Plumbing', rating: 4.8, reviewCount: 120, phone: '+27821234567', email: 'john@plumbing.co.za', image: 'https://i.pravatar.cc/150?u=john' }
];

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
    [Currency.USD]: '$',
    [Currency.EUR]: '€',
    [Currency.ZAR]: 'R',
    [Currency.POUND]: '£',
    [Currency.FRANC]: 'Fr',
};

export const CURRENCY_CONVERSION_RATES: Record<Currency, number> = {
    [Currency.USD]: 1,
    [Currency.EUR]: 0.92,
    [Currency.ZAR]: 18.50,
    [Currency.POUND]: 0.79,
    [Currency.FRANC]: 0.91,
};

export const languageOptions: Record<Language, { name: string; flag: string }> = {
    [Language.EN]: { name: 'English', flag: '🇬🇧' },
    [Language.FR]: { name: 'Français', flag: '🇫🇷' },
    [Language.PT]: { name: 'Português', flag: '🇵🇹' },
    [Language.ES]: { name: 'Español', flag: '🇪🇸' },
    [Language.AR]: { name: 'العربية', flag: '🇸🇦' },
};

export const currencyOptions: Record<Currency, { name: string; symbol: string }> = {
    [Currency.USD]: { name: 'US Dollar', symbol: '$' },
    [Currency.EUR]: { name: 'Euro', symbol: '€' },
    [Currency.ZAR]: { name: 'South African Rand', symbol: 'R' },
    [Currency.POUND]: { name: 'British Pound', symbol: '£' },
    [Currency.FRANC]: { name: 'Swiss Franc', symbol: 'Fr' },
};

export const countryOptions = [
  { code: 'ZA', name: 'South Africa' },
  { code: 'US', name: 'United States' },
];

export const MOCK_NOTIFICATIONS: Omit<Notification, 'isRead'>[] = [
  {
    id: 'noti_2',
    type: NotificationType.ADMIN_MESSAGE,
    title: 'Platform Maintenance',
    message: 'We will be undergoing scheduled maintenance this Sunday.',
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
  }
];
