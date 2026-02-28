
import React from 'react';

export enum ListingType {
  ALL = 'All',
  RENT = 'For Rent',
  SALE = 'For Sale',
  FOR_INVESTMENT = 'For Investment',
}

export enum PropertyType {
  ALL = 'All Types',
  APARTMENT = 'Apartment',
  HOUSE = 'House',
  COMMERCIAL = 'Commercial',
  STUDENT_HOUSING = 'Student Housing',
  TOWNSHIP = 'Township Home',
  RURAL = 'Rural Property',
  LAND = 'Land',
  LUXURY_ESTATE = 'Luxury Estate',
  IN_CONSTRUCTION = 'In Construction',
  SHORT_TERM_RENTAL = 'Short-term Stay',
  HOTEL = 'Hotel',
  TRANSPORT = 'Transport Rental',
  WELLNESS = 'Wellness Retreat',
}

export enum PropertyStatus {
  ACTIVE = 'Active',
  DRAFT = 'Draft',
  PENDING = 'Pending Approval',
  EXPIRED = 'Expired',
  SOLD = 'Sold',
}

export interface PaymentMethod {
    id: string;
    cardHolder: string;
    brand: string; // e.g., 'Visa', 'Mastercard', 'Stripe', 'PayPal'
    lastFour: string;
    expiryMonth?: number;
    expiryYear?: number;
    isDefault: boolean;
    gatewayName?: 'stripe' | 'paypal';
}

export interface Payment {
    id: string;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    description: string;
    createdAt: string;
    propertyId?: string;
    paymentMethodId?: string;
}

export interface FinancialEvent {
    date: number; // timestamp
    type: 'Income' | 'Expense';
    description: string;
    amount: number;
}

export interface Property {
  id: string;
  title: string;
  listingType: ListingType;
  propertyType: PropertyType;
  address: {
    street: string;
    city: string;
    zip: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  price: number;
  purchasePrice?: number;
  details: {
    beds: number;
    baths: number;
    area: number; // in sqft
  };
  description: string;
  neighborhoodInfo: string;
  amenities: string[];
  images: string[];
  virtualTourUrl?: string;
  vrTourUrl?: string;
  agent: {
    id: string;
    name: string;
    phone: string;
    verified: boolean;
    rating: number;
    reviewCount: number;
  };
  featured: boolean;
  verified: boolean;
  smartContractReady?: boolean;
  views: number;
  status: PropertyStatus;
  dateListed: number; // timestamp
  saves: number;
  priceHistory?: { date: number; price: number }[];
  occupancyRate?: number;
  marketROI?: number;
  financials?: FinancialEvent[];
  guests?: number;
  vehicleType?: 'Sedan' | 'SUV' | 'Van' | 'Luxury';
  packageIncludes?: string[];
  perNightPrice?: boolean;
}

export interface SearchFilters {
  location: string;
  listingType: ListingType;
  propertyType: PropertyType;
  priceMin: number;
  priceMax: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  vehicleType?: string;
  wellnessType?: string;
}

export interface User {
  id: string;
  username: string; 
  fullName: string;
  email: string;
  password?: string;
  role: 'user' | 'agent' | 'investor';
  phone?: string;
  profilePicture?: string;
  isVerified?: boolean;
  locationPreference?: string;
  budgetMin?: number;
  budgetMax?: number;
  country?: string;
  currency?: Currency;
  has2FAEnabled?: boolean;
  agencyName?: string;
  businessRegNumber?: string;
  officeAddress?: string;
  agentLicense?: string;
  investmentType?: 'Individual' | 'Corporate';
  companyName?: string;
  idDocumentUrl?: string;
  proofOfIdentityUrl?: string;
  planId?: string;
  planPrice?: number;
  planDuration?: string;
}

export interface PropertyAlert {
    id: string;
    name: string;
    criteria: Partial<SearchFilters>;
}

export interface UserDocument {
    id: string;
    name: string;
    type: 'pdf' | 'doc' | 'image';
    uploadDate: number;
    url: string;
}

export interface TourRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  userId: string;
  username: string;
  date: string;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  timestamp: number;
}

export interface Message {
  id: string;
  propertyId: string;
  propertyTitle: string;
  senderUsername: string;
  receiverUsername: string;
  text: string;
  timestamp: number;
}

export interface ValuationResult {
    estimated_value: number;
    confidence: 'Low' | 'Medium' | 'High';
    rationale: string;
}

export enum Language {
    EN = 'en',
    FR = 'fr',
    PT = 'pt',
    ES = 'es',
    AR = 'ar',
}

export interface NeighborhoodReview {
    author: string;
    quote: string;
    image: string;
}

export interface NeighborhoodEvent {
    name: string;
    date: string;
    description: string;
}

export interface HiddenGem {
    name: string;
    category: 'Cafe' | 'Park' | 'Art' | 'Shop' | 'Other';
    description: string;
    image: string;
}

export interface NeighborhoodGuide {
    id: string;
    name: string;
    description: string;
    image: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    profile: {
        history: string;
        demographics: string;
        publicTransport: string;
        localBusinesses: string[];
    };
    accessibility?: {
        bikePaths: string;
        parking: string;
    };
    scores: {
        safety: number;
        affordability: number;
        schools: number;
        nightlife: number;
        familyFriendly: number;
    };
    marketTrends: { month: string; avgRent: number; avgSalePrice: number }[];
    gallery: string[];
    virtualTourUrl: string;
    reviews?: NeighborhoodReview[];
    events?: NeighborhoodEvent[];
    hiddenGems?: HiddenGem[];
}


export interface BlogPost {
    title: string;
    author: string;
    date: string;
    image: string;
    summary: string;
    content: string;
}

export interface Review {
  id: string;
  agentName: string;
  reviewerUsername: string;
  rating: number;
  comment: string;
  timestamp: number;
}

export enum EventType {
  SHOWING = 'Property Showing',
  MEETING = 'Client Meeting',
  DEADLINE = 'Deadline',
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  type: EventType;
  notes?: string;
}

export interface AgentProfile {
  username: string;
  bio: string;
  email: string;
  phone: string;
  profilePicture: string;
  socials: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
}

export enum ActivityType {
    MESSAGE_SENT = 'Message Sent',
    TOUR_REQUESTED = 'Tour Requested',
}

export interface LeadActivity {
    type: ActivityType;
    timestamp: number;
    propertyTitle: string;
    detail: string;
}

export interface Lead {
    id: string;
    username: string;
    email: string;
    phone: string;
    score: number;
    lastContact: number;
    activity: LeadActivity[];
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  category: string;
  content: string;
}

export interface ForumPost {
  id: string;
  title: string;
  author: string;
  timestamp: number;
  content: string;
  replies: number;
  views: number;
  category?: string;
}

export interface ForumCategory {
    id: string;
    name: string;
    description: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  goal: number;
  badge: React.ElementType;
}

export interface InvestmentMetrics {
  roi: number;
  annualYield: number;
}

export interface MarketHotspot {
  location: string;
  risk_reward_profile: string;
  analysis: string;
}

export interface DashboardWidget {
    id: 'total_investment' | 'portfolio_value' | 'asset_appreciation' | 'monthly_income' | 'global_map' | 'watchlist_properties';
    label: string;
    isVisible: boolean;
}

export interface InvestorSettings {
    widgets: DashboardWidget[];
    alerts: {
        priceDrop: boolean;
        roiThreshold: {
            isEnabled: boolean;
            value: number;
        };
        rentalVacancy: boolean;
    };
    apiToken: string;
}

export interface CoInvestmentDeal {
    id: string;
    propertyId: string;
    fundingGoal: number;
    fundedAmount: number;
    investorCount: number;
}

export interface ProfessionalContact {
    id: string;
    name: string;
    specialty: 'Financial Advisor' | 'Real Estate Lawyer' | 'Property Manager';
    rating: number;
    reviewCount: number;
    image: string;
}

export enum DealType {
    PREMIUM = 'Premium Early Access',
    AUCTION = 'Auction',
    OFF_MARKET = 'Off-Market Deal',
}

export interface ExclusiveDeal {
    id: string;
    propertyId: string;
    type: DealType;
    auctionEnds?: number;
}

export interface MarketComparison {
    country_a: {
        name: string;
        summary: string;
        pros: string[];
        cons: string[];
    };
    country_b: {
        name: string;
        summary: string;
        pros: string[];
        cons: string[];
    };
}

export interface TaxLegalInfo {
    tax_benefits: string[];
    legal_restrictions: string[];
    ownership_structures: string[];
}

export interface InvestmentRequest {
  id: string;
  investorUsername: string;
  requestDetails: string;
  timestamp: number;
  status: 'Open' | 'Contacted' | 'Closed';
}

export enum Currency {
    USD = 'USD',
    EUR = 'EUR',
    ZAR = 'ZAR',
    POUND = 'POUND',
    FRANC = 'FRANC',
}

export interface ServiceProvider {
  id: string;
  name: string;
  service: string;
  rating: number;
  reviewCount: number;
  phone: string;
  email: string;
  image: string;
}

export enum NotificationType {
  NEW_LISTING = 'New Listing',
  ADMIN_MESSAGE = 'Admin Message',
  INQUIRY = 'New Inquiry',
  ACHIEVEMENT = 'Achievement',
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  isRead: boolean;
  propertyId?: string;
}
