
import React from 'react';
import { StayIcon, TransportIcon, WellnessIcon } from './icons/CategoryIcons';
import { PropertyType } from '../types';

interface NewOfferingsProps {
    onSelectCategory: (type: PropertyType) => void;
}

const OfferingCard: React.FC<{
    title: string;
    description: string;
    image: string;
    icon: React.ElementType;
    colorClass: string;
    onClick: () => void;
}> = ({ title, description, image, icon: Icon, colorClass, onClick }) => (
    <div className="relative rounded-2xl overflow-hidden group cursor-pointer shadow-xl h-[450px]" onClick={onClick}>
        <img src={image} alt={title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000" />
        <div className={`absolute inset-0 bg-gradient-to-t ${colorClass} via-brand-dark/20 to-transparent opacity-90`}></div>
        <div className="absolute bottom-0 left-0 p-8 text-white w-full">
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl w-fit mb-6 border border-white/30 transform group-hover:rotate-12 transition-transform">
                <Icon className="w-8 h-8" />
            </div>
            <h3 className="text-4xl font-black tracking-tight">{title}</h3>
            <p className="mt-3 text-lg font-medium text-white/90 max-w-xs">{description}</p>
            <div className="mt-6 w-12 h-1.5 bg-white rounded-full group-hover:w-24 transition-all duration-500"></div>
        </div>
    </div>
);


const NewOfferings: React.FC<NewOfferingsProps> = ({ onSelectCategory }) => {
    const offerings = [
        {
            title: 'Book a Stay',
            description: 'From chic city lofts to beachfront villas, find your perfect short-term rental.',
            image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1980&auto=format&fit=crop',
            icon: StayIcon,
            colorClass: 'from-brand-secondary/80',
            onClick: () => onSelectCategory(PropertyType.SHORT_TERM_RENTAL)
        },
        {
            title: 'Rent a Car',
            description: 'Explore with freedom. Choose from our fleet of SUVs, sedans, and luxury vehicles.',
            image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop',
            icon: TransportIcon,
            colorClass: 'from-brand-accent/80',
            onClick: () => onSelectCategory(PropertyType.TRANSPORT)
        },
        {
            title: 'Find Wellness',
            description: 'Recharge your mind and body with our curated yoga, spa, and nature retreats.',
            image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop',
            icon: WellnessIcon,
            colorClass: 'from-brand-gold/80',
            onClick: () => onSelectCategory(PropertyType.WELLNESS)
        },
    ];

    return (
        <section className="py-24 bg-white dark:bg-slate-950">
            <div className="container mx-auto px-6">
                 <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-brand-dark dark:text-white uppercase tracking-tighter">Beyond the Home</h2>
                    <div className="w-24 h-1.5 bg-brand-primary mx-auto mt-4 mb-6 rounded-full"></div>
                    <p className="text-center text-slate-500 dark:text-slate-400 text-xl font-medium max-w-2xl mx-auto">
                        Your entire lifestyle, curated in one place. Discover unique stays, transport, and rejuvenation.
                    </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {offerings.map(offering => (
                        <OfferingCard key={offering.title} {...offering} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewOfferings;
