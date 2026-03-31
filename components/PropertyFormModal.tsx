
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
                    console.error("Error converting file to base64", err instanceof Error ? err.message : err);
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
            console.error("Error generating description:", error instanceof Error ? error.message : error);
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
        } catch(e) { console.error('Voice synthesis error:', e instanceof Error ? e.message : e); setIsListening(false); }
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
                console.error("Error accessing microphone:", err instanceof Error ? err.message : err);
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
            
            <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto custom-scrollbar">
                <div className="p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-2">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label htmlFor="title" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Property Title <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    name="title" 
                                    id="title"
                                    placeholder="e.g. Modern Luxury Villa with Sea View"
                                    value={property.title} 
                                    onChange={handleChange} 
                                    required 
                                    className="w-full input-field"
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="price" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Price ({currency}) <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">{currency}</span>
                                    <input 
                                        type="number" 
                                        name="price" 
                                        id="price"
                                        value={property.price} 
                                        onChange={(e) => setProperty(p => ({...p, price: Number(e.target.value)}))} 
                                        required 
                                        className="w-full input-field pl-12"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                             <div className="space-y-1">
                                <label htmlFor="listingType" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Listing Type</label>
                                <select name="listingType" id="listingType" value={property.listingType} onChange={handleChange} className="w-full input-field">
                                    <option value={ListingType.RENT}>For Rent</option>
                                    <option value={ListingType.SALE}>For Sale</option>
                                    <option value={ListingType.FOR_INVESTMENT}>For Investment</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="propertyType" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Property Type</label>
                                <select name="propertyType" id="propertyType" value={property.propertyType} onChange={handleChange} className="w-full input-field">
                                    {(Object.values(PropertyType) as string[]).filter(t => t !== PropertyType.ALL).map(type => <option key={type} value={type}>{type}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                     {/* Verification Checkbox */}
                    <div className="bg-brand-light/20 dark:bg-slate-800/50 p-4 rounded-lg border border-brand-light dark:border-slate-700">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="verified"
                                checked={property.verified || false}
                                onChange={e => setProperty(p => ({...p, verified: e.target.checked}))}
                                className="mt-1 h-5 w-5 rounded border-slate-300 dark:border-slate-600 text-brand-primary focus:ring-brand-primary bg-white dark:bg-slate-700"
                            />
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-800 dark:text-white text-sm">
                                    Mark as Verified Listing
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Adds a verification badge to the property card and detail page. This increases trust and visibility.
                                </span>
                            </div>
                        </label>
                    </div>

                    {/* Address */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-2">Location Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <div className="space-y-1 md:col-span-1">
                                <label htmlFor="address.street" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Street Address</label>
                                <input type="text" name="address.street" id="address.street" value={property.address.street} onChange={handleChange} required className="w-full input-field" placeholder="123 Main St"/>
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="address.city" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">City</label>
                                <input type="text" name="address.city" id="address.city" value={property.address.city} onChange={handleChange} required className="w-full input-field" placeholder="City Name"/>
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="address.zip" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Zip Code</label>
                                <input type="text" name="address.zip" id="address.zip" value={property.address.zip} onChange={handleChange} required className="w-full input-field" placeholder="Postal Code"/>
                            </div>
                        </div>
                    </div>
                    
                    {/* Details */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-2">Property Specifications</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <div className="space-y-1">
                                <label htmlFor="details.beds" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Bedrooms</label>
                                <input type="number" name="details.beds" id="details.beds" value={property.details.beds} onChange={handleNumericChange} required className="w-full input-field" min="0"/>
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="details.baths" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Bathrooms</label>
                                <input type="number" name="details.baths" id="details.baths" value={property.details.baths} onChange={handleNumericChange} required className="w-full input-field" min="0" step="0.5"/>
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="details.area" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Area (sqft)</label>
                                <input type="number" name="details.area" id="details.area" value={property.details.area} onChange={handleNumericChange} required className="w-full input-field" min="0"/>
                            </div>
                        </div>
                    </div>

                    {/* Descriptions */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-2">Description & Insights</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label htmlFor="description" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Property Description</label>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            type="button" 
                                            onClick={toggleRecording} 
                                            className={`p-2 rounded-lg transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'}`}
                                            title="Dictate Description"
                                        >
                                            <MicrophoneIcon className="w-4 h-4" />
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => handleListen(property.description)} 
                                            disabled={isListening || !property.description} 
                                            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 disabled:opacity-50 transition-all"
                                            title="Listen to Description"
                                        >
                                            {isListening ? <PauseIcon className="w-4 h-4"/> : <SpeakerWaveIcon className="w-4 h-4" />}
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={handleGenerateDescription} 
                                            disabled={isGenerating} 
                                            className="flex items-center gap-2 px-3 py-1.5 bg-brand-primary text-white text-xs font-bold rounded-lg hover:bg-brand-primary/90 transition-all shadow-md disabled:opacity-50"
                                        >
                                            {isGenerating ? (
                                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <SparklesIcon className="w-3 h-3"/>
                                            )}
                                            AI Write
                                        </button>
                                    </div>
                                </div>
                                <textarea 
                                    name="description" 
                                    id="description"
                                    value={property.description} 
                                    onChange={handleChange} 
                                    rows={4} 
                                    placeholder="Tell potential buyers/renters what makes this property special..."
                                    className="w-full input-field resize-none"
                                ></textarea>
                            </div>
                            <div>
                                <label htmlFor="neighborhoodInfo" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Neighborhood Highlights</label>
                                <textarea 
                                    name="neighborhoodInfo" 
                                    id="neighborhoodInfo"
                                    value={property.neighborhoodInfo} 
                                    onChange={handleChange} 
                                    rows={2} 
                                    placeholder="Schools, parks, transport, shopping nearby..."
                                    className="w-full input-field resize-none"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    
                    {/* Media Drag and Drop */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-2">Media & Visuals</h3>
                        <div className="space-y-3">
                             <div className="flex justify-between items-center">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Property Images</label>
                                <span className="text-xs font-medium text-brand-primary bg-brand-light dark:bg-slate-800 px-2 py-1 rounded-full">{property.images.length} images</span>
                             </div>
                            
                            <div 
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${isDragging ? 'border-brand-primary bg-brand-light/30 dark:bg-slate-800/50 scale-[1.01]' : 'border-slate-300 dark:border-slate-700 hover:border-brand-primary hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}
                            >
                                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full mb-3">
                                    <CameraIcon className={`w-8 h-8 ${isDragging ? 'text-brand-primary' : 'text-slate-400'}`} />
                                </div>
                                <p className="text-sm text-slate-700 dark:text-slate-200 font-bold">Drag & Drop or Click to Upload</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">High quality JPG or PNG (Max 5MB each)</p>
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
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-4">
                                    {property.images.map((img, index) => (
                                        <div 
                                            key={index} 
                                            draggable
                                            onDragStart={(e) => handleImageDragStart(e, index)}
                                            onDragOver={(e) => handleImageDragOver(e, index)}
                                            onDrop={(e) => handleImageDrop(e, index)}
                                            className="relative aspect-square group rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 cursor-move shadow-sm hover:shadow-md transition-all"
                                        >
                                            <img src={img} alt={`Uploaded ${index}`} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                                                <button 
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                                                    className="bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 scale-75 group-hover:scale-100"
                                                    title="Remove image"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                            {index === 0 && (
                                                <div className="absolute top-1 left-1 bg-brand-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                                                    COVER
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="pt-2">
                                <label htmlFor="vrTourUrl" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Virtual Tour URL (Optional)</label>
                                <input 
                                    type="text" 
                                    name="vrTourUrl" 
                                    id="vrTourUrl"
                                    value={property.vrTourUrl || ''} 
                                    onChange={handleChange} 
                                    placeholder="e.g. https://my.matterport.com/show/?m=..." 
                                    className="w-full input-field"
                                />
                            </div>
                        </div>
                    </div>

                    
                    {/* Amenities */}
                     <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-2">Amenities & Features</h3>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3 max-h-56 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-xl custom-scrollbar">
                            {ALL_AMENITIES.map(amenity => (
                                <label key={amenity} className="flex items-center space-x-3 text-sm cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input 
                                            type="checkbox" 
                                            checked={property.amenities.includes(amenity)} 
                                            onChange={() => handleAmenityChange(amenity)} 
                                            className="h-5 w-5 rounded border-slate-300 dark:border-slate-600 text-brand-primary focus:ring-brand-primary bg-white dark:bg-slate-700 transition-all cursor-pointer"
                                        />
                                    </div>
                                    <span className="text-slate-700 dark:text-slate-200 group-hover:text-brand-primary transition-colors">{amenity}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                
                 <footer className="bg-white dark:bg-slate-900 p-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 sticky bottom-0 z-10">
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                        * Required fields must be completed before publishing.
                    </p>
                    <div className="flex space-x-3 w-full sm:w-auto">
                         <button 
                            type="button" 
                            onClick={onClose} 
                            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-transparent"
                        >
                            Cancel
                        </button>
                         <button 
                            type="submit" 
                            className="flex-1 sm:flex-none px-8 py-2.5 rounded-xl font-bold text-sm text-white bg-brand-primary hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20 uppercase tracking-wider"
                        >
                            {propertyToEdit ? 'Update Listing' : 'Publish Listing'}
                        </button>
                    </div>
                </footer>
            </form>
        </div>
        <style>{`
            .input-field {
                @apply px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all outline-none;
            }
            .input-field:focus {
                @apply border-brand-primary ring-2 ring-brand-primary/20 bg-white dark:bg-slate-800;
            }
            .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                @apply bg-transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                @apply bg-slate-200 dark:bg-slate-700 rounded-full;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                @apply bg-slate-300 dark:bg-slate-600;
            }
            @keyframes fadeInScale {
                from { opacity: 0; transform: scale(0.98) translateY(10px); }
                to { opacity: 1; transform: scale(1) translateY(0); }
            }
            .animate-fade-in-scale {
                animation: fadeInScale 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
        `}</style>
    </div>
  );
};

export default PropertyFormModal;
