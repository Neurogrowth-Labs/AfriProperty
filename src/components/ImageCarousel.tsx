
import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

interface ImageCarouselProps {
    images: string[];
    alt: string;
    className?: string;
    onImageClick?: () => void;
    children?: React.ReactNode;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, alt, className = "", onImageClick, children }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const displayImages = images.length > 0 ? images : ['https://picsum.photos/seed/placeholder/800/600'];

    return (
        <div className={`relative overflow-hidden group/carousel ${className}`}>
             <img 
                src={displayImages[currentIndex]} 
                alt={alt} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover/carousel:scale-105 cursor-pointer"
                onClick={onImageClick}
            />
            
            {/* Navigation Arrows */}
            {displayImages.length > 1 && (
                <>
                    <button 
                        onClick={handlePrev} 
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm text-white p-1.5 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity z-20 hover:bg-black/60"
                        aria-label="Previous image"
                    >
                        <ChevronLeftIcon className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={handleNext} 
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm text-white p-1.5 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity z-20 hover:bg-black/60"
                        aria-label="Next image"
                    >
                        <ChevronRightIcon className="w-4 h-4" />
                    </button>
                     <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                        {displayImages.map((_, index) => (
                            <div key={index} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white w-3' : 'bg-white/50'}`} />
                        ))}
                    </div>
                </>
            )}

            {/* Overlays (Badges, Buttons) */}
            {children}
        </div>
    );
};

export default ImageCarousel;
