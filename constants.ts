
import type { Property, NeighborhoodGuide, KnowledgeBaseArticle, ForumPost, Achievement, ForumCategory, CoInvestmentDeal, ProfessionalContact, ExclusiveDeal, ServiceProvider, Notification } from './types';
import { ListingType, PropertyType, Language, PropertyStatus, DealType, Currency, NotificationType } from './types';
import { StudentIcon, AffordableIcon, TownshipIcon, RuralIcon, StayIcon, TransportIcon, WellnessIcon } from './components/icons/CategoryIcons';
import React from 'react';
// FIX: RocketLaunchIcon is not in ActionIcons, it is in AgentDashboardIcons. Split the import.
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
    neighborhoodInfo: "Located in the vibrant Arts District, you're steps away from top-rated restaurants, theaters, and public transport. The neighborhood is known for its lively atmosphere and creative energy.",
    amenities: ['Gym', 'Rooftop Deck', 'In-unit Laundry', 'Doorman', 'Pet Friendly'],
    images: [
      'https://picsum.photos/seed/prop1/800/600',
      'https://picsum.photos/seed/prop1-2/800/600',
      'https://picsum.photos/seed/prop1-3/800/600',
    ],
    virtualTourUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    vrTourUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&autoplay=1&mute=1&loop=1',
    // FIX: Added agent.id
    agent: { id: 'agent_peter', name: 'Peter Van der Merwe', phone: '555-123-4567', verified: true, rating: 4.9, reviewCount: 82 },
    featured: true,
    verified: true,
    smartContractReady: true,
    views: 1284,
    status: PropertyStatus.ACTIVE,
    dateListed: Date.now() - 10 * 24 * 60 * 60 * 1000,
    saves: 102,
    priceHistory: [
        { date: Date.now() - 365 * 24 * 60 * 60 * 1000, price: 420000 },
        { date: Date.now() - 180 * 24 * 60 * 60 * 1000, price: 435000 },
        { date: Date.now() - 30 * 24 * 60 * 60 * 1000, price: 445000 },
        { date: Date.now(), price: 450000 },
    ],
    occupancyRate: 95,
    marketROI: 6.5,
    financials: [
        { date: Date.now() + 2 * 24 * 60 * 60 * 1000, type: 'Income', description: 'Rent Payment', amount: 3500 },
        { date: Date.now() + 4 * 24 * 60 * 60 * 1000, type: 'Expense', description: 'Mortgage', amount: -1800 },
        { date: Date.now() + 12 * 24 * 60 * 60 * 1000, type: 'Expense', description: 'Property Tax', amount: -400 },
    ]
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
    description: 'Fully furnished room, just a 5-minute walk from the main campus. All utilities included. Ideal for students looking for convenience and a quiet study environment.',
    neighborhoodInfo: "The University Park neighborhood is bustling with student life. You'll find plenty of cafes, libraries, and late-night eateries. The campus shuttle stop is right outside the building.",
    amenities: ['Furnished', 'Utilities Included', 'High-speed Internet', 'Study Lounge'],
    images: [
        'https://picsum.photos/seed/prop2/800/600',
        'https://picsum.photos/seed/prop2-2/800/600',
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
    description: 'A beautiful and spacious family home in a vibrant township. Features a large yard, modern finishes, and is close to schools and shops.',
    neighborhoodInfo: "A family-friendly area with a strong sense of community. The property is near the newly built community center, which features a library and sports facilities.",
    amenities: ['Garden', 'Secure Parking', 'Patio', 'Alarm System'],
    images: [
        'https://picsum.photos/seed/prop3/800/600',
        'https://picsum.photos/seed/prop3-2/800/600',
        'https://picsum.photos/seed/prop3-3/800/600',
    ],
    // FIX: Added agent.id
    agent: { id: 'agent_peter', name: 'Peter Van der Merwe', phone: '555-222-3333', verified: true, rating: 4.8, reviewCount: 45 },
    featured: true,
    verified: false,
    views: 3102,
    status: PropertyStatus.ACTIVE,
    dateListed: Date.now() - 30 * 24 * 60 * 60 * 1000,
    saves: 150,
    priceHistory: [
        { date: Date.now() - 730 * 24 * 60 * 60 * 1000, price: 600000 },
        { date: Date.now() - 365 * 24 * 60 * 60 * 1000, price: 710000 },
        { date: Date.now() - 90 * 24 * 60 * 60 * 1000, price: 820000 },
        { date: Date.now(), price: 850000 },
    ],
    marketROI: 18.5,
  },
  {
    id: '4',
    title: 'Affordable Starter Apartment',
    listingType: ListingType.SALE,
    propertyType: PropertyType.APARTMENT,
    address: { street: '101 Opportunity Ln', city: 'New Dawn', zip: '30003' },
    coordinates: { lat: 33.7490, lng: -84.3880 },
    price: 120000,
    purchasePrice: 95000,
    details: { beds: 1, baths: 1, area: 650 },
    description: 'A fantastic opportunity for first-time buyers. This affordable apartment is in a well-maintained building with great community features.',
    neighborhoodInfo: "New Dawn is an up-and-coming neighborhood with significant investment in public parks and infrastructure. A new light rail station is planned to open next year just two blocks away.",
    amenities: ['Community Pool', 'Playground', 'On-site Security', 'Gym'],
    images: [
      'https://picsum.photos/seed/prop4/800/600',
    ],
    // FIX: Added agent.id
    agent: { id: 'agent_future', name: 'Future Homes Inc.', phone: '555-444-5555', verified: false, rating: 4.5, reviewCount: 112 },
    featured: false,
    verified: true,
    views: 890,
    status: PropertyStatus.PENDING,
    dateListed: Date.now() - 2 * 24 * 60 * 60 * 1000,
    saves: 45,
  },
  {
    id: '5',
    title: 'Quiet Rural Farmhouse',
    listingType: ListingType.SALE,
    propertyType: PropertyType.RURAL,
    address: { street: '222 Country Rd', city: 'Stellenbosch', zip: '7600' },
    coordinates: { lat: -33.9321, lng: 18.8602 },
    price: 3200000,
    purchasePrice: 2500000,
    details: { beds: 5, baths: 3, area: 3500 },
    description: 'Escape the city to this beautiful farmhouse on 10 acres of land. Perfect for a large family or for agricultural pursuits. Breathtaking views of the surrounding vineyards.',
    neighborhoodInfo: "Nestled in the heart of the Cape Winelands, this property offers tranquility and privacy, yet is only a 15-minute drive from the historic town of Stellenbosch.",
    amenities: ['Acreage', 'Barn', 'Fireplace', 'Mountain View', 'Swimming Pool'],
    images: [
        'https://picsum.photos/seed/prop5/800/600',
        'https://picsum.photos/seed/prop5-2/800/600',
        'https://picsum.photos/seed/prop5-3/800/600',
        'https://picsum.photos/seed/prop5-4/800/600',
    ],
    // FIX: Added agent.id
    agent: { id: 'agent_peter', name: 'Peter Van der Merwe', phone: '555-666-7777', verified: true, rating: 4.9, reviewCount: 38 },
    featured: false,
    verified: true,
    views: 4510,
    status: PropertyStatus.ACTIVE,
    dateListed: Date.now() - 60 * 24 * 60 * 60 * 1000,
    saves: 412,
  },
  {
    id: '6',
    title: 'Prime Commercial Retail Space',
    listingType: ListingType.RENT,
    propertyType: PropertyType.COMMERCIAL,
    address: { street: '333 Business Blvd', city: 'Urbanville', zip: '10005' },
    coordinates: { lat: 40.7061, lng: -73.9969 },
    price: 12000,
    purchasePrice: 2000000,
    details: { beds: 0, baths: 2, area: 2500 },
    description: 'High-traffic retail space in the central business district. Large storefront windows and an open floor plan. Ready for your business.',
    neighborhoodInfo: "Situated on the busiest commercial street in Urbanville, this location guarantees high foot traffic and visibility. It's surrounded by corporate offices and luxury condos.",
    amenities: ['High-traffic Area', 'Storefront', 'Ample Parking', 'Central AC'],
    images: [
        'https://picsum.photos/seed/prop6/800/600',
        'https://picsum.photos/seed/prop6-2/800/600',
    ],
    // FIX: Added agent.id
    agent: { id: 'agent_commercial', name: 'Commercial Kings', phone: '555-888-9999', verified: true, rating: 4.6, reviewCount: 91 },
    featured: false,
    verified: true,
    smartContractReady: true,
    views: 1982,
    status: PropertyStatus.ACTIVE,
    dateListed: Date.now() - 15 * 24 * 60 * 60 * 1000,
    saves: 33,
  },
   {
    id: '7',
    title: 'Suburban Family Dream Home',
    listingType: ListingType.SALE,
    propertyType: PropertyType.HOUSE,
    address: { street: '45 Green Valley Dr', city: 'Suburbia', zip: '50005' },
    coordinates: { lat: 41.5868, lng: -93.6250 },
    price: 550000,
    purchasePrice: 420000,
    details: { beds: 4, baths: 3, area: 2400 },
    description: 'Perfect family home in a quiet, safe suburb. Features a large backyard with a pool, a modern kitchen, and a two-car garage. Close to top-rated schools.',
    neighborhoodInfo: "Green Valley is known for its excellent school district, numerous parks, and family-friendly community events. The local grocery store and community center are just a short walk away.",
    amenities: ['Swimming Pool', 'Fenced Yard', 'Garage', 'Modern Kitchen', 'Patio'],
    images: [
        'https://picsum.photos/seed/prop7/800/600',
        'https://picsum.photos/seed/prop7-2/800/600',
        'https://picsum.photos/seed/prop7-3/800/600',
    ],
    // FIX: Added agent.id
    agent: { id: 'agent_susan', name: 'Susan Miller', phone: '555-111-2222', verified: false, rating: 4.8, reviewCount: 67 },
    featured: false,
    verified: false,
    views: 5678,
    status: PropertyStatus.SOLD,
    dateListed: Date.now() - 1 * 24 * 60 * 60 * 1000,
    saves: 5,
  },
  {
    id: '8',
    title: 'Student Studio near Tech Campus',
    listingType: ListingType.RENT,
    propertyType: PropertyType.STUDENT_HOUSING,
    address: { street: '808 Binary Blvd', city: 'Collegia', zip: '20004' },
    coordinates: { lat: 34.0422, lng: -118.2537 },
    price: 1100,
    purchasePrice: 130000,
    details: { beds: 1, baths: 1, area: 450 },
    description: 'Modern studio apartment perfect for a tech student. Includes a built-in desk, fiber internet, and access to a shared study lounge.',
    neighborhoodInfo: "Located in the 'Silicon Triangle' district of Collegia, this building is surrounded by tech startups and incubators, making it ideal for networking and internships.",
    amenities: ['High-speed Internet', 'Study Lounge', 'Bike Storage', 'In-unit Laundry'],
    images: [
      'https://picsum.photos/seed/prop8/800/600',
    ],
    // FIX: Added agent.id
    agent: { id: 'agent_campus', name: 'Campus Rentals', phone: '555-987-6543', verified: true, rating: 4.7, reviewCount: 150 },
    featured: false,
    verified: true,
    views: 1120,
    status: PropertyStatus.EXPIRED,
    dateListed: Date.now() - 90 * 24 * 60 * 60 * 1000,
    saves: 88,
  },
  {
    id: '9',
    title: 'Waterfront Luxury Estate',
    listingType: ListingType.SALE,
    propertyType: PropertyType.LUXURY_ESTATE,
    address: { street: '1 Ocean View', city: 'Malibu', zip: '90265' },
    coordinates: { lat: 34.0305, lng: -118.7845 },
    price: 22500000,
    purchasePrice: 18000000,
    details: { beds: 6, baths: 8, area: 9500 },
    description: 'An architectural masterpiece with panoramic ocean views. This estate features an infinity pool, a private theater, a wine cellar, and direct beach access. Unparalleled luxury and privacy.',
    neighborhoodInfo: "Located in the exclusive Carbon Beach area, this property is surrounded by celebrity homes and offers the ultimate in coastal living. World-class dining and shopping are just moments away.",
    amenities: ['Swimming Pool', 'Ocean View', 'Private Theater', 'Wine Cellar', 'Garage', 'Gated Community'],
    images: [
      'https://picsum.photos/seed/prop9/800/600',
      'https://picsum.photos/seed/prop9-2/800/600',
      'https://picsum.photos/seed/prop9-3/800/600',
    ],
    vrTourUrl: 'https://www.youtube.com/embed/A45gAEQRd_A?rel=0&autoplay=1&mute=1&loop=1',
    // FIX: Added agent.id
    agent: { id: 'agent_luxury', name: 'Luxury Living', phone: '555-101-2020', verified: true, rating: 5.0, reviewCount: 25 },
    featured: true,
    verified: true,
    smartContractReady: true,
    views: 9854,
    status: PropertyStatus.ACTIVE,
    dateListed: Date.now() - 25 * 24 * 60 * 60 * 1000,
    saves: 998,
  },
  {
    id: '10',
    title: 'Vast Commercial Land Parcel',
    listingType: ListingType.SALE,
    propertyType: PropertyType.LAND,
    address: { street: '555 Development Way', city: 'New Dawn', zip: '30008' },
    coordinates: { lat: 33.7990, lng: -84.4880 },
    price: 4500000,
    purchasePrice: 3000000,
    details: { beds: 0, baths: 0, area: 435600 }, // 10 acres in sqft
    description: 'A 10-acre parcel of undeveloped land zoned for commercial use. Ideal for a shopping center, office park, or logistics hub. All utilities are available at the lot line.',
    neighborhoodInfo: "This rapidly growing area is seeing significant commercial and residential development. A new highway interchange is planned a mile away, promising excellent future accessibility.",
    amenities: ['Acreage', 'Zoned Commercial', 'Utilities Available'],
    images: [
      'https://picsum.photos/seed/prop10/800/600',
    ],
    // FIX: Added agent.id
    agent: { id: 'agent_future', name: 'Future Homes Inc.', phone: '555-444-5555', verified: false, rating: 4.5, reviewCount: 112 },
    featured: false,
    verified: false,
    views: 750,
    status: PropertyStatus.PENDING,
    dateListed: Date.now() - 3 * 24 * 60 * 60 * 1000,
    saves: 12,
  },
  {
    id: '11',
    title: 'Penthouse with City Views',
    listingType: ListingType.SALE,
    propertyType: PropertyType.APARTMENT,
    address: { street: '77 Sky High Rd', city: 'Urbanville', zip: '10001' },
    coordinates: { lat: 40.7138, lng: -74.0070 },
    price: 2800000,
    purchasePrice: 2100000,
    details: { beds: 3, baths: 3, area: 2100 },
    description: 'A luxurious penthouse with breathtaking panoramic views of the city skyline. Private elevator access, floor-to-ceiling windows, and a gourmet kitchen make this an entertainer\'s dream.',
    neighborhoodInfo: "Located in the prestigious financial district, enjoy close proximity to fine dining, luxury shopping, and cultural landmarks. Unmatched convenience and status.",
    amenities: ['Rooftop Deck', 'Doorman', 'Gym', 'Mountain View', 'Private Elevator'],
    images: [
        'https://picsum.photos/seed/prop11/800/600',
    ],
    // FIX: Added agent.id
    agent: { id: 'agent_jane', name: 'Jane Doe', phone: '555-123-4567', verified: true, rating: 4.9, reviewCount: 82 },
    featured: false,
    verified: true,
    smartContractReady: true,
    views: 2100,
    status: PropertyStatus.SOLD,
    dateListed: Date.now() - 1 * 24 * 60 * 60 * 1000,
    saves: 250,
  },
  {
    id: '12',
    title: 'Luxury Hotel Development',
    listingType: ListingType.FOR_INVESTMENT,
    propertyType: PropertyType.IN_CONSTRUCTION,
    address: { street: '505 Waterfront Plaza', city: 'Urbanville', zip: '10007' },
    coordinates: { lat: 40.7100, lng: -74.0100 },
    price: 15000000,
    purchasePrice: 15000000,
    details: { beds: 150, baths: 150, area: 120000 },
    description: 'A unique opportunity to invest in a 5-star hotel development in the bustling waterfront district. Construction is underway with completion scheduled for Q4 2025. Projected ROI of 12% annually. Full investment prospectus available.',
    neighborhoodInfo: "The waterfront is Urbanville's premier destination for tourism and business, ensuring high occupancy rates and premium room prices.",
    amenities: ['Water View', 'Conference Center', 'Rooftop Pool', 'Fine Dining Restaurant', 'Spa & Wellness Center'],
    images: ['https://picsum.photos/seed/prop12/800/600'],
    // FIX: Added agent.id
    agent: { id: 'agent_peter', name: 'Peter Van der Merwe', phone: '555-123-4567', verified: true, rating: 4.9, reviewCount: 82 },
    featured: false,
    verified: true,
    smartContractReady: true,
    views: 850,
    status: PropertyStatus.ACTIVE,
    dateListed: Date.now() - 20 * 24 * 60 * 60 * 1000,
    saves: 95,
    marketROI: 12.0,
  },
  {
    id: '13',
    title: 'Downtown Office Block',
    listingType: ListingType.FOR_INVESTMENT,
    propertyType: PropertyType.COMMERCIAL,
    address: { street: '88 Business Core', city: 'Urbanville', zip: '10005' },
    coordinates: { lat: 40.7075, lng: -74.0095 },
    price: 8200000,
    purchasePrice: 7000000,
    details: { beds: 0, baths: 20, area: 50000 },
    description: 'Fully tenanted commercial office building in the heart of the financial district. Long-term leases with AAA-rated corporate tenants provide a stable and secure income stream. Low maintenance and professionally managed.',
    neighborhoodInfo: "Located in the central business district, this property is surrounded by major corporate headquarters, premium retail, and excellent transport links.",
    amenities: ['24/7 Security', 'Underground Parking', 'Fiber Internet', 'LEED Certified', 'On-site Cafe'],
    images: ['https://picsum.photos/seed/prop13/800/600'],
    // FIX: Added agent.id
    agent: { id: 'agent_peter', name: 'Peter Van der Merwe', phone: '555-123-4567', verified: true, rating: 4.9, reviewCount: 82 },
    featured: false,
    verified: true,
    views: 430,
    status: PropertyStatus.ACTIVE,
    dateListed: Date.now() - 45 * 24 * 60 * 60 * 1000,
    saves: 68,
    marketROI: 7.5,
    occupancyRate: 100,
  },
  {
    id: '14',
    title: 'Charming Parisian Apartment',
    listingType: ListingType.SALE,
    propertyType: PropertyType.APARTMENT,
    address: { street: '15 Rue de Rivoli', city: 'Paris', zip: '75001' },
    coordinates: { lat: 48.8615, lng: 2.3431 },
    price: 1200000,
    details: { beds: 2, baths: 1, area: 850 },
    description: 'A beautiful apartment in a historic building, overlooking the Tuileries Garden. Features classic Parisian charm with modern amenities.',
    neighborhoodInfo: 'Located in the 1st arrondissement, steps from the Louvre Museum and luxury shopping.',
    amenities: ['Hardwood Floors', 'Fireplace', 'Elevator', 'City View'],
    images: ['https://picsum.photos/seed/prop14/800/600'],
    // FIX: Added agent.id
    agent: { id: 'agent_parisian', name: 'Parisian Homes', phone: '555-111-3333', verified: true, rating: 4.8, reviewCount: 50 },
    featured: false,
    verified: true,
    views: 1800,
    status: PropertyStatus.ACTIVE,
    dateListed: Date.now() - 40 * 24 * 60 * 60 * 1000,
    saves: 210,
  },
  {
    id: '15',
    title: 'Modern Tokyo Micro-Loft',
    listingType: ListingType.RENT,
    propertyType: PropertyType.APARTMENT,
    address: { street: '7-1, Dogenzaka 2-chome', city: 'Tokyo', zip: '150-0043' },
    coordinates: { lat: 35.6595, lng: 139.6983 },
    price: 1500,
    details: { beds: 1, baths: 1, area: 350 },
    description: 'A sleek and efficient micro-loft in the heart of Shibuya. Perfect for a single professional. Features smart home technology and minimalist design.',
    neighborhoodInfo: 'Experience the energy of Shibuya Crossing, with endless dining, shopping, and entertainment options at your doorstep.',
    amenities: ['Smart Home', 'High-speed Internet', 'In-unit Laundry', 'Security System'],
    images: ['https://picsum.photos/seed/prop15/800/600'],
    // FIX: Added agent.id
    agent: { id: 'agent_tokyo', name: 'Tokyo Living', phone: '555-222-4444', verified: true, rating: 4.9, reviewCount: 120 },
    featured: false,
    verified: true,
    views: 2200,
    status: PropertyStatus.ACTIVE,
    dateListed: Date.now() - 12 * 24 * 60 * 60 * 1000,
    saves: 305,
  },
  {
    id: '16',
    title: 'Sydney Harbour View House',
    listingType: ListingType.SALE,
    propertyType: PropertyType.HOUSE,
    address: { street: '22 Kirribilli Ave', city: 'Sydney', zip: '2061' },
    coordinates: { lat: -33.8479, lng: 151.2133 },
    price: 8500000,
    details: { beds: 5, baths: 4, area: 4500 },
    description: 'A stunning modern house with direct, unobstructed views of the Sydney Opera House and Harbour Bridge. Features a private pool and expansive terrace.',
    neighborhoodInfo: "Kirribilli is one of Sydney's most prestigious suburbs, offering an exclusive lifestyle with easy access to the CBD via ferry.",
    amenities: ['Swimming Pool', 'Ocean View', 'Garage', 'Modern Kitchen', 'Patio'],
    images: ['https://picsum.photos/seed/prop16/800/600'],
    // FIX: Added agent.id
    agent: { id: 'agent_sydney', name: 'Sydney Luxury', phone: '555-333-5555', verified: true, rating: 5.0, reviewCount: 40 },
    featured: true,
    verified: true,
    views: 3500,
    status: PropertyStatus.ACTIVE,
    dateListed: Date.now() - 50 * 24 * 60 * 60 * 1000,
    saves: 450,
  },
  {
    id: '17',
    title: 'Chic City Studio for Weekend Getaway',
    listingType: ListingType.RENT,
    propertyType: PropertyType.SHORT_TERM_RENTAL,
    address: { street: '205 Bree Street', city: 'Cape Town', zip: '8001' },
    coordinates: { lat: -33.9224, lng: 18.4168 },
    price: 150,
    perNightPrice: true,
    details: { beds: 1, baths: 1, area: 450 },
    description: 'A stylish, modern studio in the heart of Cape Town\'s vibrant Bree Street. Perfect for solo travelers or couples. Features a fully-equipped kitchenette, high-speed Wi-Fi, and a small balcony with city views. Walking distance to the best cafes, restaurants, and art galleries.',
    neighborhoodInfo: "Bree Street is Cape Town's foodie and design hotspot, known for its trendy bars, art galleries, and artisanal shops. Experience the city's creative pulse right at your doorstep.",
    amenities: ['Wi-Fi', 'Kitchenette', 'Air Conditioning', 'Smart TV', 'Balcony'],
    images: ['https://picsum.photos/seed/prop17/800/600'],
    // FIX: Added agent.id
    agent: { id: 'agent_capestays', name: 'Cape Stays', phone: '555-303-4040', verified: true, rating: 4.9, reviewCount: 125 },
    featured: true,
    verified: true,
    views: 3500,
    status: PropertyStatus.ACTIVE,
    dateListed: Date.now() - 10 * 24 * 60 * 60 * 1000,
    saves: 450,
    guests: 2,
  },
  {
    id: '18',
    title: 'Luxury SUV Rental - Cape Town',
    listingType: ListingType.RENT,
    propertyType: PropertyType.TRANSPORT,
    address: { street: 'Cape Town International Airport', city: 'Cape Town', zip: '7525' },
    coordinates: { lat: -33.9648, lng: 18.6017 },
    price: 80,
    perNightPrice: true,
    details: { beds: 0, baths: 0, area: 0 },
    description: 'Explore the Cape in style with our premium SUV rental. Perfect for families or adventurers. Includes comprehensive insurance, unlimited mileage, and GPS. Pick up and drop off at the airport or your hotel.',
    neighborhoodInfo: "Conveniently located at Cape Town International Airport, providing easy access to the city and the beautiful surrounding regions like the Winelands and the Cape Peninsula.",
    amenities: ['Automatic', 'Air Conditioning', 'GPS', 'Unlimited Mileage', 'Insurance Included'],
    images: ['https://picsum.photos/seed/prop18/800/600'],
    // FIX: Added agent.id
    agent: { id: 'agent_capedrive', name: 'Cape Drive', phone: '555-505-6060', verified: true, rating: 4.8, reviewCount: 210 },
    featured: false,
    verified: true,
    views: 1800,
    status: PropertyStatus.ACTIVE,
    dateListed: Date.now() - 5 * 24 * 60 * 60 * 1000,
    saves: 150,
    vehicleType: 'SUV',
  },
  {
    id: '19',
    title: 'Winelands Wellness & Yoga Retreat',
    listingType: ListingType.RENT,
    propertyType: PropertyType.WELLNESS,
    address: { street: 'Stellenbosch Mountains', city: 'Stellenbosch', zip: '7600' },
    coordinates: { lat: -33.9358, lng: 18.8587 },
    price: 450,
    perNightPrice: true,
    details: { beds: 1, baths: 1, area: 0 },
    description: 'A 3-day all-inclusive wellness retreat in the serene Stellenbosch mountains. Reconnect with nature and yourself. Daily yoga, guided meditations, organic farm-to-table meals, and vineyard walks.',
    neighborhoodInfo: "Located in the tranquil mountains overlooking the Stellenbosch valley, this retreat offers a peaceful escape surrounded by nature, hiking trails, and world-renowned vineyards.",
    amenities: ['All-inclusive', 'Daily Yoga', 'Meditation Sessions', 'Organic Meals', 'Spa Access'],
    images: ['https://picsum.photos/seed/prop19/800/600'],
    // FIX: Added agent.id
    agent: { id: 'agent_zen', name: 'Zen Escapes', phone: '555-707-8080', verified: true, rating: 5.0, reviewCount: 95 },
    featured: false,
    verified: true,
    views: 2900,
    status: PropertyStatus.ACTIVE,
    dateListed: Date.now() - 20 * 24 * 60 * 60 * 1000,
    saves: 320,
    packageIncludes: ['Accommodation', 'All Meals', 'Yoga Classes', 'Guided Hikes'],
  },
  {
    id: '20',
    title: 'The Grand Urban Hotel - Executive Suite',
    listingType: ListingType.RENT,
    propertyType: PropertyType.HOTEL,
    address: { street: '1 Sandton Drive', city: 'Johannesburg', zip: '2196' },
    coordinates: { lat: -26.1076, lng: 28.0567 },
    price: 250,
    perNightPrice: true,
    details: { beds: 1, baths: 1, area: 600 },
    description: 'Experience luxury in the heart of Sandton. Our Executive Suite offers stunning city views, a king-sized bed, and access to our rooftop pool and 5-star restaurant. Perfect for business or leisure.',
    neighborhoodInfo: "Situated in Sandton, Johannesburg's premier business and shopping district. You'll be minutes away from Nelson Mandela Square, Sandton City Mall, and the Gautrain station for easy airport access.",
    amenities: ['Room Service', 'Rooftop Pool', 'Gym', 'Restaurant', 'Concierge'],
    images: ['https://picsum.photos/seed/prop20/800/600'],
    // FIX: Added agent.id
    agent: { id: 'agent_grandurban', name: 'The Grand Urban', phone: '555-909-1010', verified: true, rating: 4.7, reviewCount: 540 },
    featured: true,
    verified: true,
    views: 4100,
    status: PropertyStatus.ACTIVE,
    dateListed: Date.now() - 15 * 24 * 60 * 60 * 1000,
    saves: 610,
    guests: 2,
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
        image: 'https://picsum.photos/seed/neigh1/400/300',
        coordinates: { lat: 40.7128, lng: -74.0060 },
        profile: {
            history: "Once a warehouse district, the area was revitalized in the late 90s by artists seeking large, affordable spaces. It's now a protected cultural hub.",
            demographics: "Primarily young professionals, artists, and students. Median age is 29. Highly diverse and international.",
            publicTransport: "Excellent connectivity with access to the A, C, E, and 1, 2, 3 subway lines, plus numerous bus routes.",
            localBusinesses: ["The Daily Grind Cafe", "Canvas & Clay Art Supplies", "The Indie Theater", "Rooftop Bar & Grill"],
        },
        accessibility: {
            bikePaths: "Good network of dedicated bike lanes on major avenues.",
            parking: "Parking is limited and mostly paid street parking or private garages."
        },
        scores: { safety: 7, affordability: 5, schools: 6, nightlife: 10, familyFriendly: 5 },
        marketTrends: [
            { month: 'Jan', avgRent: 3400, avgSalePrice: 950000 },
            { month: 'Feb', avgRent: 3450, avgSalePrice: 960000 },
            { month: 'Mar', avgRent: 3500, avgSalePrice: 980000 },
            { month: 'Apr', avgRent: 3520, avgSalePrice: 995000 },
        ],
        gallery: ['https://picsum.photos/seed/ng1_1/800/600', 'https://picsum.photos/seed/ng1_2/800/600', 'https://picsum.photos/seed/ng1_3/800/600'],
        virtualTourUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&autoplay=1&mute=1&loop=1',
        reviews: [
            { author: 'Chloe R.', quote: "Living here is an inspiration. There's always a new gallery opening or a street performance to see. The energy is unmatched!", image: 'https://i.pravatar.cc/150?u=chloe' }
        ],
        events: [
            { name: 'First Friday Art Walk', date: 'First Friday of every month', description: 'Galleries stay open late, offering free wine and showcasing new exhibits.' }
        ],
        hiddenGems: [
            { name: 'The Speakeasy Scribe', category: 'Cafe', description: 'A hidden basement coffee shop with vintage typewriters for patrons to use.', image: 'https://picsum.photos/seed/gem1/400/300' }
        ]
    },
    {
        id: 'suburbia_green_valley',
        name: 'Suburbia Green Valley',
        description: 'Family-friendly with top-rated schools, parks, and a strong sense of community.',
        image: 'https://picsum.photos/seed/neigh2/400/300',
        coordinates: { lat: 41.5868, lng: -93.6250 },
        profile: {
            history: "Developed in the 1980s as a planned community, Green Valley was designed to be a peaceful suburban oasis with plenty of green space.",
            demographics: "Mostly families with children. Median age is 42. Predominantly homeowners.",
            publicTransport: "Limited public transport, a car is recommended. Commuter rail station is a 10-minute drive.",
            localBusinesses: ["The Family Diner", "Green Valley Community Center", "Oakwood Elementary School", "The Local Butcher"],
        },
        accessibility: {
            bikePaths: "Well-maintained, family-friendly bike paths connecting parks and schools.",
            parking: "Ample residential street parking and private driveways."
        },
        scores: { safety: 9, affordability: 7, schools: 9, nightlife: 3, familyFriendly: 10 },
        marketTrends: [
            { month: 'Jan', avgRent: 2200, avgSalePrice: 520000 },
            { month: 'Feb', avgRent: 2200, avgSalePrice: 525000 },
            { month: 'Mar', avgRent: 2250, avgSalePrice: 535000 },
            { month: 'Apr', avgRent: 2300, avgSalePrice: 550000 },
        ],
        gallery: ['https://picsum.photos/seed/ng2_1/800/600', 'https://picsum.photos/seed/ng2_2/800/600', 'https://picsum.photos/seed/ng2_3/800/600'],
        virtualTourUrl: 'https://www.youtube.com/embed/A45gAEQRd_A?rel=0&autoplay=1&mute=1&loop=1',
        reviews: [
            { author: 'The Miller Family', quote: "It's the perfect place to raise our kids. The schools are fantastic, and we feel so safe. We love the weekend farmers' market!", image: 'https://i.pravatar.cc/150?u=millers' }
        ],
        events: [
            { name: "Green Valley Farmers' Market", date: 'Every Saturday, 9am - 1pm', description: 'Fresh local produce, baked goods, and crafts at the community park.' }
        ],
        hiddenGems: [
            { name: 'Willow Creek Duck Pond', category: 'Park', description: 'A serene little pond hidden behind the community center, perfect for a quiet afternoon.', image: 'https://picsum.photos/seed/gem2/400/300' }
        ]
    },
    {
        id: 'stellenbosch_winelands',
        name: 'Stellenbosch Winelands',
        description: 'Breathtaking scenery, world-class vineyards, and a tranquil, luxurious lifestyle.',
        image: 'https://picsum.photos/seed/neigh3/400/300',
        coordinates: { lat: -33.9321, lng: 18.8602 },
        profile: {
            history: "Established in 1679, Stellenbosch is the second oldest town in South Africa. It's renowned for its Cape Dutch architecture and prestigious university.",
            demographics: "A mix of affluent retirees, established families, and university students. Significant international population.",
            publicTransport: "A car is essential for exploring the region. Ride-sharing services are readily available.",
            localBusinesses: ["De Morgenzon Wine Estate", "Overture Restaurant", "Stellenbosch University", "The Slow Market"],
        },
        accessibility: {
            bikePaths: "Numerous scenic cycling routes through vineyards, though dedicated lanes are rare.",
            parking: "Parking is generally available at wineries and in the town center, but can be busy on weekends."
        },
        scores: { safety: 8, affordability: 4, schools: 8, nightlife: 7, familyFriendly: 8 },
        marketTrends: [
            { month: 'Jan', avgRent: 1500, avgSalePrice: 3000000 },
            { month: 'Feb', avgRent: 1550, avgSalePrice: 3050000 },
            { month: 'Mar', avgRent: 1600, avgSalePrice: 3100000 },
            { month: 'Apr', avgRent: 1600, avgSalePrice: 3200000 },
        ],
        gallery: ['https://picsum.photos/seed/ng3_1/800/600', 'https://picsum.photos/seed/ng3_2/800/600', 'https://picsum.photos/seed/ng3_3/800/600'],
        virtualTourUrl: 'https://www.youtube.com/embed/IyFLAz5_1I8?rel=0&autoplay=1&mute=1&loop=1',
        reviews: [
            { author: 'James B.', quote: "Retiring here was the best decision I've ever made. The views are incredible, the food is world-class, and there's a new wine to discover every weekend.", image: 'https://i.pravatar.cc/150?u=james' }
        ],
        events: [
            { name: 'Stellenbosch Wine Festival', date: 'Annually in February', description: 'A celebration of the regions finest wines, with tastings, food pairings, and live music.' }
        ],
        hiddenGems: [
            { name: 'Jonkershoek Nature Reserve', category: 'Park', description: 'Stunning hiking and mountain biking trails just a short drive from the town center.', image: 'https://picsum.photos/seed/gem3/400/300' }
        ]
    },
    {
        id: 'soweto_cultural_hub',
        name: 'Soweto Cultural Hub',
        description: 'Rich in history and culture, offering a unique and vibrant community experience.',
        image: 'https://picsum.photos/seed/neigh4/400/300',
        coordinates: { lat: -26.2661, lng: 27.8587 },
        profile: {
            history: "Soweto's history is inextricably linked to the struggle against apartheid. It was home to Nelson Mandela and Desmond Tutu. Today it's a symbol of resilience and a center of vibrant culture.",
            demographics: "A diverse and dynamic population with a strong sense of community and entrepreneurship. A blend of all age groups.",
            publicTransport: "Well-served by minibus taxis and the Metrorail train system, connecting it to Johannesburg.",
            localBusinesses: ["Vilakazi Street", "Soweto Brewing Company", "Mandela House Museum", "Chaf Pozi"],
        },
        accessibility: {
            bikePaths: "Bicycle tours are popular, but dedicated bike lanes for commuting are limited.",
            parking: "Street parking is generally available, but can be crowded in popular areas like Vilakazi Street."
        },
        scores: { safety: 6, affordability: 9, schools: 6, nightlife: 8, familyFriendly: 7 },
        marketTrends: [
            { month: 'Jan', avgRent: 250, avgSalePrice: 750000 },
            { month: 'Feb', avgRent: 250, avgSalePrice: 780000 },
            { month: 'Mar', avgRent: 260, avgSalePrice: 820000 },
            { month: 'Apr', avgRent: 270, avgSalePrice: 850000 },
        ],
        gallery: ['https://picsum.photos/seed/ng4_1/800/600', 'https://picsum.photos/seed/ng4_2/800/600', 'https://picsum.photos/seed/ng4_3/800/600'],
        virtualTourUrl: 'https://www.youtube.com/embed/0uY8_ALH5Vw?rel=0&autoplay=1&mute=1&loop=1',
        reviews: [
            { author: 'Thabo M.', quote: "There is no place like Soweto. The sense of community, the history, the music... it's a place with a soul. I'm proud to call it home.", image: 'https://i.pravatar.cc/150?u=thabo' }
        ],
        events: [
            { name: 'Soweto Festival of Light', date: 'Annually in December', description: 'A festive celebration with lights, music, and food, bringing the community together.' }
        ],
        hiddenGems: [
            { name: 'Credo Mutwa Cultural Village', category: 'Art', description: 'An outdoor exhibition of sculptures and buildings depicting African folklore and culture.', image: 'https://picsum.photos/seed/gem4/400/300' }
        ]
    }
];

export const LIFESTYLE_QUIZ_QUESTIONS = [
    {
        question: "What's your primary reason for moving?",
        options: ["Starting a family", "For my career or studies", "A quieter lifestyle", "To be in the center of the action"],
        key: 'reason'
    },
    {
        question: "Which best describes your ideal weekend?",
        options: ["Family time at the park", "Exploring cafes and art galleries", "Quiet time at home or in nature", "Going to bars and live music venues"],
        key: 'vibe'
    },
    {
        question: "What's your approximate monthly housing budget (USD)?",
        options: ["Under $1,000", "$1,000 - $2,500", "$2,500 - $4,000", "$4,000+"],
        key: 'budget'
    }
];

export const KNOWLEDGE_BASE_ARTICLES: KnowledgeBaseArticle[] = [
    {
        id: 'kb1',
        title: 'How to Write a Listing Description that Sells',
        category: 'Listings',
        content: "Start with a compelling headline that grabs attention. Use high-quality, professional photos to showcase the property's best features. In your description, tell a story. Describe what it's like to live in the home. Highlight unique features like a renovated kitchen or a beautiful backyard. Be honest, transparent, and always double-check for typos."
    },
    {
        id: 'kb2',
        title: '5 Tips for Working with First-Time Home Buyers',
        category: 'Clients',
        content: '1. Be patient and educational. First-time buyers have a lot of questions. 2. Help them get pre-approved for a mortgage early on. 3. Clearly define their needs vs. wants. 4. Guide them through the inspection and closing process. 5. Celebrate their big win with them!'
    },
    {
        id: 'kb3',
        title: 'Optimizing Your Agent Profile for More Leads',
        category: 'Profile',
        content: 'A great profile builds trust and attracts clients. Use a professional, high-resolution headshot. Write a detailed bio that highlights your expertise and personality. Ask past clients for reviews and display them prominently. Keep your contact information up-to-date.'
    },
    {
        id: 'kb4',
        title: 'Understanding Rental Yield: A Guide for Investors',
        category: 'Investors',
        content: 'Rental yield is a key metric for property investors. It is calculated by taking the total annual rent received and dividing it by the total amount invested in the property (usually the purchase price). A higher yield indicates a better return on investment. Gross yield does not account for expenses like maintenance or taxes, while net yield does.'
    }
];

export const FORUM_POSTS: ForumPost[] = [
    {
        id: 'fp1',
        title: 'Best CRM for new agents?',
        author: 'Jane Doe',
        timestamp: Date.now() - 2 * 60 * 60 * 1000,
        content: "Hey everyone, I'm looking for recommendations on a good, affordable CRM to manage my leads. What's everyone using?",
        replies: 5,
        views: 45
    },
    {
        id: 'fp2',
        title: 'Tips for hosting a successful open house?',
        author: 'Susan Miller',
        timestamp: Date.now() - 24 * 60 * 60 * 1000,
        content: 'I have a big open house coming up for a suburban property. Any tips to maximize foot traffic and capture leads?',
        replies: 12,
        views: 152
    },
    {
        id: 'fp3',
        title: 'Navigating new short-term rental regulations in Urbanville',
        author: 'Peter Van der Merwe',
        timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
        content: "Has anyone had experience with the new STR regulations? Looking to advise a client on an investment property.",
        replies: 8,
        views: 98
    }
];

export const AGENT_ACHIEVEMENTS: Omit<Achievement, 'id'>[] = [
    {
        title: 'First Listing',
        description: 'List your first property on the platform.',
        goal: 1,
        badge: RocketLaunchIcon,
    },
    {
        title: 'Sales Pro',
        description: 'Mark 3 properties as sold.',
        goal: 3,
        badge: TrophyIcon,
    },
    {
        title: 'Review Star',
        description: 'Receive 5 client reviews.',
        goal: 5,
        badge: StarIcon,
    },
];

export const FORUM_CATEGORIES: ForumCategory[] = [
    { id: 'fc1', name: 'Market Trends', description: 'Discuss the latest market shifts and economic indicators.' },
    { id: 'fc2', name: 'Investment Strategies', description: 'Share and critique different approaches to real estate investing.' },
    { id: 'fc3', name: 'Emerging Markets', description: 'Explore and analyze new opportunities in up-and-coming locations.' },
    { id: 'fc4', name: 'Property Management', description: 'Tips and tricks for managing your rental portfolio effectively.' },
];

export const INVESTOR_FORUM_POSTS: ForumPost[] = [
    {
        id: 'ifp1',
        title: 'Thoughts on the Urbanville rental market for the next 5 years?',
        author: 'Peter Van der Merwe',
        timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
        content: 'With the new tech campus opening, I\'m bullish on rental demand, but concerned about rising property taxes. What are others thinking?',
        replies: 15,
        views: 210,
        category: 'Market Trends',
    },
    {
        id: 'ifp2',
        title: 'Best way to structure a multi-family property investment?',
        author: 'Investor_Alex',
        timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
        content: 'Looking at my first duplex. Should I go with an LLC? Any legal advice welcome, though I know this isn\'t official counsel.',
        replies: 8,
        views: 150,
        category: 'Investment Strategies',
    }
];

export const CO_INVESTMENT_DEALS: CoInvestmentDeal[] = [
    {
        id: 'cid1',
        propertyId: '6',
        fundingGoal: 2000000,
        fundedAmount: 1250000,
        investorCount: 12,
    },
    {
        id: 'cid2',
        propertyId: '10',
        fundingGoal: 4500000,
        fundedAmount: 4000000,
        investorCount: 4,
    }
];

export const PROFESSIONAL_CONTACTS: ProfessionalContact[] = [
    { id: 'pc1', name: 'Sarah Chen', specialty: 'Financial Advisor', rating: 4.9, reviewCount: 120, image: 'https://i.pravatar.cc/150?u=sarahchen' },
    { id: 'pc2', name: 'David Rodriguez', specialty: 'Real Estate Lawyer', rating: 4.8, reviewCount: 95, image: 'https://i.pravatar.cc/150?u=davidrodriguez' },
    { id: 'pc3', name: 'Emily White', specialty: 'Property Manager', rating: 5.0, reviewCount: 210, image: 'https://i.pravatar.cc/150?u=emilywhite' },
];

export const EXCLUSIVE_DEALS: ExclusiveDeal[] = [
    {
        id: 'ed1',
        propertyId: '9',
        type: DealType.PREMIUM,
    },
    {
        id: 'ed2',
        propertyId: '5',
        type: DealType.AUCTION,
        auctionEnds: Date.now() + 3 * 24 * 60 * 60 * 1000, // 3 days from now
    },
    {
        id: 'ed3',
        propertyId: '10',
        type: DealType.OFF_MARKET,
    }
];

export const INVESTOR_ACHIEVEMENTS: Omit<Achievement, 'id'>[] = [
    {
        title: 'First Investment',
        description: 'Acquire your first property.',
        goal: 1,
        badge: RocketLaunchIcon,
    },
    {
        title: 'Diversified',
        description: 'Own properties in 3+ different cities.',
        goal: 3,
        badge: TrophyIcon,
    },
    {
        title: 'Cashflow King',
        description: 'Reach $5,000 in monthly rental income.',
        goal: 5000,
        badge: StarIcon,
    },
];

export const SERVICE_PROVIDERS: ServiceProvider[] = [
  { id: 'sp1', name: 'John\'s Plumbing', service: 'Plumbing', rating: 4.8, reviewCount: 120, phone: '+27821234567', email: 'john@plumbing.co.za', image: 'https://i.pravatar.cc/150?u=johnplumb' },
  { id: 'sp2', name: 'Sparky Electrical', service: 'Electrical Work', rating: 4.9, reviewCount: 215, phone: '+27831234568', email: 'contact@sparky.co.za', image: 'https://i.pravatar.cc/150?u=sparky' },
  { id: 'sp3', name: 'Green Leaf Landscaping', service: 'Landscaping', rating: 4.7, reviewCount: 88, phone: '+27841234569', email: 'info@greenleaf.com', image: 'https://i.pravatar.cc/150?u=greenleaf' },
  { id: 'sp4', name: 'Swift Movers', service: 'Moving Services', rating: 4.9, reviewCount: 301, phone: '+27721234561', email: 'support@swiftmovers.co.za', image: 'https://i.pravatar.cc/150?u=swiftmove' },
  { id: 'sp5', name: 'Eagle Eye Home Inspectors', service: 'Home Inspection', rating: 5.0, reviewCount: 95, phone: '+27731234562', email: 'inspect@eagleeye.com', image: 'https://i.pravatar.cc/150?u=eagleeye' },
  { id: 'sp6', name: 'The Legal Eagles', service: 'Legal Services', rating: 4.8, reviewCount: 56, phone: '+27741234563', email: 'consult@legaleagles.co.za', image: 'https://i.pravatar.cc/150?u=legal' },
  { id: 'sp7', name: 'Prestige Painters', service: 'Painting', rating: 4.8, reviewCount: 74, phone: '+27741234564', email: 'quote@prestigepainters.co.za', image: 'https://i.pravatar.cc/150?u=prestige' },
  { id: 'sp8', name: 'FinSecure Mortgages', service: 'Financial Services', rating: 4.9, reviewCount: 150, phone: '+27821112222', email: 'loans@finsecure.co.za', image: 'https://i.pravatar.cc/150?u=finsecure' },
  { id: 'sp9', name: 'CoverRight Insurance', service: 'Insurance', rating: 4.8, reviewCount: 210, phone: '+27845556666', email: 'quotes@coverright.co.za', image: 'https://i.pravatar.cc/150?u=coverright' },
  { id: 'sp10', name: 'ProManage Rentals', service: 'Property Management', rating: 4.7, reviewCount: 95, phone: '+27833334444', email: 'manage@promanage.co.za', image: 'https://i.pravatar.cc/150?u=promanage' }
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
  { code: 'NG', name: 'Nigeria' },
  { code: 'KE', name: 'Kenya' },
  { code: 'GH', name: 'Ghana' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'PT', name: 'Portugal' },
  { code: 'DE', name: 'Germany' },
];

export const MOCK_NOTIFICATIONS: Omit<Notification, 'isRead'>[] = [
  {
    id: 'noti_1',
    // FIX: Added required userId
    userId: 'mock-user-123',
    type: NotificationType.NEW_LISTING,
    title: 'New Loft in Urbanville!',
    message: 'A new 2-bedroom loft has just been listed in your saved search area.',
    timestamp: Date.now() - 5 * 60 * 1000,
    propertyId: '1',
  },
  {
    id: 'noti_2',
    // FIX: Added required userId
    userId: 'mock-user-123',
    type: NotificationType.ADMIN_MESSAGE,
    title: 'Platform Maintenance',
    message: 'We will be undergoing scheduled maintenance this Sunday from 2 AM to 3 AM.',
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
  },
  {
    id: 'noti_3',
    // FIX: Added required userId
    userId: 'mock-user-123',
    type: NotificationType.INQUIRY,
    title: 'New Tour Request',
    message: 'You have a new tour request for "Suburban Family Dream Home".',
    timestamp: Date.now() - 5 * 60 * 60 * 1000,
  },
   {
    id: 'noti_4',
    // FIX: Added required userId
    userId: 'mock-user-123',
    type: NotificationType.ACHIEVEMENT,
    title: 'Achievement Unlocked!',
    message: 'Congratulations! You\'ve earned the "Sales Pro" badge.',
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
  },
];
