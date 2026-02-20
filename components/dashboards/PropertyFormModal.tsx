
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import type { Property, User } from '../types';
import { ListingType, PropertyType, PropertyStatus } from '../types';
import { CloseIcon } from './icons/NavIcons';
import { ALL_AMENITIES } from '../constants';
import { SparklesIcon, SpeakerWaveIcon, PauseIcon, MicrophoneIcon, CameraIcon, TrashIcon } from './icons/ActionIcons';
import { decode, decodeAudioData } from '../lib/audioUtils';
import { useCurrency } from '../contexts/CurrencyContext';
import { blobToBase64 } from '../lib/utils';


interface PropertyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (property: Property) => void;
  propertyToEdit: Property | null;
  currentUser: User;
}

const emptyProperty: Omit<Property, 'id' | 'agent' | 'featured' | 'smartContractReady'> = {
  title: '',
  listingType: ListingType.RENT,
  propertyType: PropertyType.APARTMENT,
  address: { street: '', city: '', zip: '' },
  coordinates: { lat: 0, lng: 0 },
  price: 0,
  details: { beds: 1, baths: 1, area: 0 },
  description: '',
  neighborhoodInfo: '',
  amenities: [],
  images: [],
  virtualTourUrl: '',
  vrTourUrl: '',
  verified: false,
  views: 0,
  status: PropertyStatus.DRAFT,
  dateListed: 0, 
  saves: 0,
};

const PropertyFormModal: React.FC<PropertyFormModalProps> = ({ isOpen, onClose, onSave, propertyToEdit, currentUser }) => {
    const [property, setProperty] = useState(emptyProperty);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    
    // Image Upload State
    const [isDragging, setIsDragging] = useState(false);
    const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { currency } = useCurrency();
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    useEffect(() => {
        if (propertyToEdit) {
            setProperty(propertyToEdit);
        } else {
            setProperty({...emptyProperty, dateListed: Date.now()});
        }
    }, [propertyToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const keys = name.split('.');

        if (keys.length === 1) {
            setProperty(prev => ({ ...prev, [name]: value }));
        } else {
            setProperty(prev => {
                const mainKey = keys[0] as keyof typeof prev;
                const subKey = keys[1];
                return {
                    ...prev,
                    [mainKey]: {
                        ...(prev[mainKey] as object),
                        [subKey]: value
                    }
                };
            });
        }
    };
    
    const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const keys = name.split('.');
        const numValue = value === '' ? 0 : parseInt(value, 10);
        
        setProperty(prev => {
            const mainKey = keys[0] as keyof typeof prev;
            const subKey = keys[1];
            return {
                ...prev,
                [mainKey]: {
                    ...(prev[mainKey] as object),
                    [subKey]: numValue
                }
            };
        });
    };
    
    const handleAmenityChange = (amenity: string) => {
      setProperty(prev => {
          const newAmenities = prev.amenities.includes(amenity)
            ? prev.amenities.filter(a => a !== amenity)
            : [...prev.amenities, amenity];
          return { ...prev, amenities: newAmenities };
      });
    };

    // --- Image Upload Handlers ---

    const processFiles = async (files: FileList | null) => {
        if (!files) return;
        
        const newImages: string[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.startsWith('image/')) {
                try {
                    const base64 = await blobToBase64(file);
                    newImages.push(`data:${file.type};base64,${base64}`);
                } catch (err) {
                    console.error("Error converting file to base64", err);
                }
            }
        }

        if (newImages.length > 0) {
            setProperty(prev => ({
                ...prev,
                images: [...prev.images, ...newImages]
            }));
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        await processFiles(e.dataTransfer.files);
    };

    const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        await processFiles(e.target.files);
    };

    const removeImage = (index: number) => {
        setProperty(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    // --- Image Reordering Handlers ---

    const handleImageDragStart = (e: React.DragEvent, index: number) => {
        setDraggedImageIndex(index);
        e.dataTransfer.effectAllowed = "move";
        // Ghost image transparency if needed
    };

    const handleImageDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleImageDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        if (draggedImageIndex === null || draggedImageIndex === dropIndex) return;

        setProperty(prev => {
            const newImages = [...prev.images];
            const [draggedItem] = newImages.splice(draggedImageIndex, 1);
            newImages.splice(dropIndex, 0, draggedItem);
            return { ...prev, images: newImages };
        });
        setDraggedImageIndex(null);
    };


    const handleGenerateDescription = async () => {
        setIsGenerating(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `
                Generate a compelling, professional, and SEO-friendly real estate property description based on these details.
                - Property Title: ${property.title}
                - Property Type: ${property.propertyType}
                - Location: ${property.address.city}
                - Key Features: ${property.details.beds} bedrooms, ${property.details.baths} bathrooms, ${property.details.area} sqft
                - Top Amenities: ${property.amenities.slice(0, 5).join(', ')}
                - Neighborhood Highlights: ${property.neighborhoodInfo}
                
                Keep it engaging and highlight the best features. Write only the description text.
            `;
            const result = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
            });
            setProperty(prev => ({ ...prev, description: result.text || '' }));
        } catch (error) {
            console.error("Error generating description:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleListen = async (text: string) => {
        if (!text.trim() || isListening) return;
        setIsListening(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-preview-tts',
                contents: [{ parts: [{ text }] }],
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
                },
            });
            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
                const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
                const source = outputAudioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputAudioContext.destination);
                source.start();
                source.onended = () => setIsListening(false);
            } else {
                setIsListening(false);
            }
        } catch(e) { console.error(e); setIsListening(false); }
    }

    const toggleRecording = async () => {
        if (isRecording) {
            mediaRecorderRef.current?.stop();
            setIsRecording(false);
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                const chunks: Blob[] = [];

                mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
                mediaRecorder.onstop = async () => {
                    const audioBlob = new Blob(chunks, { type: 'audio/webm' });
                    const base64Audio = await blobToBase64(audioBlob);
                    
                    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                    const response = await ai.models.generateContent({
                        model: 'gemini-3-flash-preview',
                        contents: {
                            parts: [
                                { inlineData: { mimeType: 'audio/webm', data: base64Audio } },
                                { text: "Transcribe this audio exactly as spoken." }
                            ]
                        }
                    });
                    
                    setProperty(prev => ({ 
                        ...prev, 
                        description: (prev.description ? prev.description + ' ' : '') + (response.text || '') 
                    }));
                };

                mediaRecorder.start();
                setIsRecording(true);
            } catch (err) {
                console.error("Error accessing microphone:", err);
            }
        }
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const propertyData: Property = {
            ...property,
            id: propertyToEdit?.id || `prop_${Date.now()}`,
            agent: propertyToEdit?.agent || {
                // FIX: Included missing 'id' for new property agent object
                id: currentUser.id,
                name: currentUser.username,
                phone: 'N/A',
                verified: false,
                rating: 0,
                reviewCount: 0
            },
            featured: propertyToEdit?.featured || false,
            verified: property.verified || false,
        };
        onSave(propertyData);
    };

    if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[110] p-4" onClick={onClose}>
        <div 
            className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" 
            onClick={e => e.stopPropagation()}
        >
            <header className="relative flex justify-center sm:justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                <button onClick={onClose} className="sm:hidden absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-brand-primary hover:underline">&larr; Back</button>
                <h2 className="text-xl font-bold text-brand-dark dark:text-white">{propertyToEdit ? 'Edit Property' : 'List a New Property'}</h2>
                <button onClick={onClose} className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:block">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </header>
            
            <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
                <div className="p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Title</label>
                            <input type="text" name="title" value={property.title} onChange={handleChange} required className="mt-1 w-full input"/>
                        </div>
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Price ({currency} or {currency}/mo)</label>
                            <input type="number" name="price" value={property.price} onChange={(e) => setProperty(p => ({...p, price: Number(e.target.value)}))} required className="mt-1 w-full input"/>
                        </div>
                         <div>
                            <label htmlFor="listingType" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Listing Type</label>
                            <select name="listingType" value={property.listingType} onChange={handleChange} className="mt-1 w-full input">
                                <option value={ListingType.RENT}>For Rent</option>
                                <option value={ListingType.SALE}>For Sale</option>
                                <option value={ListingType.FOR_INVESTMENT}>For Investment</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="propertyType" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Property Type</label>
                            <select name="propertyType" value={property.propertyType} onChange={handleChange} className="mt-1 w-full input">
                                {(Object.values(PropertyType) as string[]).filter(t => t !== PropertyType.ALL).map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                    </div>

                     {/* Verification Checkbox */}
                    <div className="pt-2">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="verified"
                                checked={property.verified || false}
                                onChange={e => setProperty(p => ({...p, verified: e.target.checked}))}
                                className="h-5 w-5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                            />
                            <span className="font-medium text-slate-700 dark:text-slate-200">
                                Mark as Verified Listing
                                <span className="block text-xs text-slate-500 dark:text-slate-400 font-normal">Adds a verification badge to the property card and detail page.</span>
                            </span>
                        </label>
                    </div>

                    {/* Address */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <div>
                            <label htmlFor="address.street" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Street</label>
                            <input type="text" name="address.street" value={property.address.street} onChange={handleChange} required className="mt-1 w-full input"/>
                        </div>
                        <div>
                            <label htmlFor="address.city" className="block text-sm font-medium text-slate-700 dark:text-slate-200">City</label>
                            <input type="text" name="address.city" value={property.address.city} onChange={handleChange} required className="mt-1 w-full input"/>
                        </div>
                        <div>
                            <label htmlFor="address.zip" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Zip Code</label>
                            <input type="text" name="address.zip" value={property.address.zip} onChange={handleChange} required className="mt-1 w-full input"/>
                        </div>
                    </div>
                    
                    {/* Details */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <div>
                            <label htmlFor="details.beds" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Bedrooms</label>
                            <input type="number" name="details.beds" value={property.details.beds} onChange={handleNumericChange} required className="mt-1 w-full input"/>
                        </div>
                        <div>
                            <label htmlFor="details.baths" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Bathrooms</label>
                            <input type="number" name="details.baths" value={property.details.baths} onChange={handleNumericChange} required className="mt-1 w-full input"/>
                        </div>
                        <div>
                            <label htmlFor="details.area" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Area (sqft)</label>
                            <input type="number" name="details.area" value={property.details.area} onChange={handleNumericChange} required className="mt-1 w-full input"/>
                        </div>
                    </div>

                    {/* Descriptions */}
                     <div>
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Description</label>
                            <div className="flex items-center gap-2">
                                <button 
                                    type="button" 
                                    onClick={toggleRecording} 
                                    className={`p-1.5 rounded-full transition-colors ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                                    title="Dictate Description"
                                >
                                    <MicrophoneIcon className="w-4 h-4" />
                                </button>
                                <button type="button" onClick={() => handleListen(property.description)} disabled={isListening || !property.description} className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50">
                                    {isListening ? <PauseIcon className="w-4 h-4"/> : <SpeakerWaveIcon className="w-4 h-4" />}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={handleGenerateDescription} 
                                    disabled={isGenerating} 
                                    className="text-xs font-black uppercase tracking-widest bg-brand-primary text-brand-gold border border-brand-gold px-3 py-1.5 rounded-lg hover:bg-brand-gold hover:text-brand-dark transition-all disabled:opacity-50 flex items-center gap-1 shadow-lg"
                                >
                                    {isGenerating ? (
                                        <div className="w-4 h-4 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <SparklesIcon className="w-4 h-4"/>
                                    )}
                                    Premium Write
                                </button>
                            </div>
                        </div>
                        <textarea name="description" value={property.description} onChange={handleChange} rows={3} className="w-full input"></textarea>
                    </div>
                    <div>
                        <label htmlFor="neighborhoodInfo" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Neighborhood Info</label>
                        <textarea name="neighborhoodInfo" value={property.neighborhoodInfo} onChange={handleChange} rows={2} className="mt-1 w-full input"></textarea>
                    </div>
                    
                    {/* Media Drag and Drop */}
                    <div className="space-y-3">
                         <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Property Images</label>
                            <span className="text-xs text-slate-500 dark:text-slate-400">{property.images.length} images uploaded</span>
                         </div>
                        
                        <div 
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragging ? 'border-brand-primary bg-brand-light/50 dark:bg-slate-800' : 'border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                        >
                            <CameraIcon className={`w-8 h-8 mb-2 ${isDragging ? 'text-brand-primary' : 'text-slate-400'}`} />
                            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Drag & Drop or Click to Upload</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Supports multiple JPG, PNG images</p>
                            <input 
                                type="file" 
                                multiple 
                                accept="image/*" 
                                className="hidden" 
                                ref={fileInputRef} 
                                onChange={handleFileInputChange}
                            />
                        </div>

                        {property.images.length > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-4">
                                {property.images.map((img, index) => (
                                    <div 
                                        key={index} 
                                        draggable
                                        onDragStart={(e) => handleImageDragStart(e, index)}
                                        onDragOver={(e) => handleImageDragOver(e, index)}
                                        onDrop={(e) => handleImageDrop(e, index)}
                                        className="relative aspect-square group rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 cursor-move"
                                    >
                                        <img src={img} alt={`Uploaded ${index}`} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                                        <button 
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                            title="Remove image"
                                        >
                                            <TrashIcon className="w-3 h-3" />
                                        </button>
                                        <div className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none">
                                            {index === 0 ? 'Cover' : `#${index + 1}`}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div>
                            <label htmlFor="vrTourUrl" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Virtual Tour URL</label>
                            <input type="text" name="vrTourUrl" value={property.vrTourUrl || ''} onChange={handleChange} placeholder="https://youtube.com/embed/..." className="mt-1 w-full input"/>
                        </div>
                    </div>

                    
                    {/* Amenities */}
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Amenities</label>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border border-slate-200 dark:border-slate-700 rounded-md">
                            {ALL_AMENITIES.map(amenity => (
                                <label key={amenity} className="flex items-center space-x-2 text-sm">
                                    <input type="checkbox" checked={property.amenities.includes(amenity)} onChange={() => handleAmenityChange(amenity)} className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"/>
                                    <span className="text-slate-700 dark:text-slate-200">{amenity}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                
                 <footer className="bg-slate-50 dark:bg-slate-800 p-4 rounded-b-xl flex justify-end sticky bottom-0">
                    <div className="flex space-x-3">
                         <button type="button" onClick={onClose} className="bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-5 py-2.5 rounded-lg font-semibold border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">Cancel</button>
                         <button type="submit" className="bg-brand-primary text-brand-gold border-2 border-brand-gold px-5 py-2.5 rounded-lg font-bold hover:bg-brand-gold hover:text-brand-dark transition-all shadow-xl uppercase tracking-widest text-xs">Publish Listing</button>
                    </div>
                </footer>
            </form>
        </div>
        <style>{`
            .input {
                @apply px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-brand-gold focus:border-brand-gold;
            }
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

export default PropertyFormModal;
