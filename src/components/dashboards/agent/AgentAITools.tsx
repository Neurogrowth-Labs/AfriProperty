import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { blobToBase64 } from '../../../lib/utils';
import { VideoCameraIcon, CameraIcon, SparklesIcon, CpuChipIcon, PencilIcon } from '../../icons/ActionIcons';
import { PropertyType } from '../../../types';

type AITab = 'descGen' | 'priceRec' | 'contentAnalyzer' | 'imageGen' | 'videoGen';

const AgentAITools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AITab>('descGen');

  const tools: { id: AITab; label: string; icon: React.ElementType }[] = [
    { id: 'descGen', label: 'Description Generator', icon: SparklesIcon },
    { id: 'priceRec', label: 'Pricing Recommender', icon: CpuChipIcon },
    { id: 'contentAnalyzer', label: 'Content Analyzer', icon: CpuChipIcon },
    { id: 'imageGen', label: 'Image Studio', icon: CameraIcon },
    { id: 'videoGen', label: 'Video Studio', icon: VideoCameraIcon },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">AI-Powered Tools</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Optimize your listings and marketing content with intelligent assistance.</p>
      </div>
      
      <div className="mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="p-2 bg-slate-100 dark:bg-slate-900/50 rounded-t-xl">
          <div className="flex items-center gap-2 flex-wrap">
            {tools.map(tool => (
              <button
                key={tool.id}
                onClick={() => setActiveTab(tool.id)}
                className={`flex-grow md:flex-1 flex items-center justify-center gap-2 px-3 py-3 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === tool.id
                    ? 'bg-white dark:bg-slate-700 text-brand-primary shadow'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <tool.icon className="w-5 h-5" />
                {tool.label}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6">
          {activeTab === 'descGen' && <DescriptionGenerator />}
          {activeTab === 'priceRec' && <PricingRecommender />}
          {activeTab === 'contentAnalyzer' && <ContentAnalyzer />}
          {activeTab === 'imageGen' && <ImageGenerator />}
          {activeTab === 'videoGen' && <VideoGenerator />}
        </div>
      </div>
    </div>
  );
};

// --- Sub-components for each tool ---

const pricingRecommenderSchema = {
    type: Type.OBJECT,
    properties: {
        recommended_price: { type: Type.NUMBER },
        confidence_score: { type: Type.NUMBER, description: "A score from 0 to 100." },
        market_analysis: { type: Type.STRING, description: "A brief analysis of the recommendation." },
    },
    required: ["recommended_price", "confidence_score", "market_analysis"],
};

const DescriptionGenerator: React.FC = () => {
    const [descInputs, setDescInputs] = useState({ title: '', type: PropertyType.APARTMENT, location: '', beds: 1, baths: 1, area: 1000, amenities: '', neighborhood: '' });
    const [generatedDesc, setGeneratedDesc] = useState('');
    const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

    const handleDescChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setDescInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleGenerateDescription = async () => {
        setIsGeneratingDesc(true);
        setGeneratedDesc('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Generate a compelling, professional, and SEO-friendly real estate property description based on these details. Write only the description text.
                - Property Title: ${descInputs.title}
                - Property Type: ${descInputs.type}
                - Location: ${descInputs.location}
                - Key Features: ${descInputs.beds} bed, ${descInputs.baths} bath, ${descInputs.area} sqft
                - Top Amenities: ${descInputs.amenities}
                - Neighborhood Highlights: ${descInputs.neighborhood}`;
            const result = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
            setGeneratedDesc(result.text || '');
        } catch (error) {
            console.error(error);
            setGeneratedDesc('Error generating description. Please try again.');
        } finally {
            setIsGeneratingDesc(false);
        }
    };

    return (
        <div className="space-y-4">
            <h4 className="text-lg font-bold text-slate-800 dark:text-white">AI Property Description Generator</h4>
            <div className="grid grid-cols-2 gap-4">
                <input name="title" onChange={handleDescChange} placeholder="Property Title" className="input col-span-2" />
                <select name="type" onChange={handleDescChange} value={descInputs.type} className="input">
                    {(Object.values(PropertyType) as string[]).filter(t => t !== PropertyType.ALL).map(t => <option key={t}>{t}</option>)}
                </select>
                <input name="location" onChange={handleDescChange} placeholder="City" className="input" />
                <input name="beds" type="number" onChange={handleDescChange} placeholder="Beds" className="input" />
                <input name="baths" type="number" onChange={handleDescChange} placeholder="Baths" className="input" />
                <input name="area" type="number" onChange={handleDescChange} placeholder="Area (sqft)" className="input" />
                <input name="amenities" onChange={handleDescChange} placeholder="Key Amenities (e.g., Pool, Gym)" className="input" />
                <textarea name="neighborhood" onChange={handleDescChange} placeholder="Neighborhood highlights" rows={2} className="input col-span-2" />
            </div>
            <button onClick={handleGenerateDescription} disabled={isGeneratingDesc} className="w-full btn-primary">
                {isGeneratingDesc ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Generate Description'}
            </button>
            <textarea value={generatedDesc} readOnly placeholder="Generated description will appear here..." rows={6} className="w-full input bg-slate-50 dark:bg-slate-700" />
            <style>{`.input { @apply px-3 py-2 border border-slate-300 rounded-md focus:ring-brand-primary focus:border-brand-primary dark:bg-slate-700/80; } .btn-primary { @apply w-full bg-brand-primary text-white font-semibold py-2.5 rounded-lg hover:bg-opacity-90 flex items-center justify-center gap-2 disabled:bg-slate-400; }`}</style>
        </div>
    );
};

const PricingRecommender: React.FC = () => {
    const [priceInputs, setPriceInputs] = useState({ type: PropertyType.APARTMENT, location: 'Urbanville', beds: 2, baths: 2, area: 1200, condition: 'Good' });
    const [priceRec, setPriceRec] = useState<any>(null);
    const [isRecommendingPrice, setIsRecommendingPrice] = useState(false);

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setPriceInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleRecommendPrice = async () => {
        setIsRecommendingPrice(true);
        setPriceRec(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `You are an expert real estate market analyst AI. Based on these property details, provide a JSON object with a recommended listing price, a confidence score (0-100), and a brief market analysis.
                - Property Type: ${priceInputs.type}
                - Location: ${priceInputs.location}
                - Size: ${priceInputs.beds} beds, ${priceInputs.baths} baths, ${priceInputs.area} sqft
                - Condition: ${priceInputs.condition}`;
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { responseMimeType: 'application/json', responseSchema: pricingRecommenderSchema }
            });
            setPriceRec(JSON.parse(response.text?.trim() || '{}'));
        } catch (error) {
            console.error(error);
        } finally {
            setIsRecommendingPrice(false);
        }
    };

    return (
        <div className="space-y-4">
            <h4 className="text-lg font-bold text-slate-800 dark:text-white">Dynamic Pricing Recommender</h4>
            <div className="grid grid-cols-2 gap-4">
                <select name="type" onChange={handlePriceChange} value={priceInputs.type} className="input">
                     {(Object.values(PropertyType) as string[]).filter(t => t !== PropertyType.ALL).map(t => <option key={t}>{t}</option>)}
                </select>
                <input name="location" onChange={handlePriceChange} placeholder="City" className="input" value={priceInputs.location}/>
                <input name="beds" type="number" onChange={handlePriceChange} placeholder="Beds" className="input" value={priceInputs.beds}/>
                <input name="baths" type="number" onChange={handlePriceChange} placeholder="Baths" className="input" value={priceInputs.baths}/>
                <input name="area" type="number" onChange={handlePriceChange} placeholder="Area (sqft)" className="input" value={priceInputs.area}/>
                <select name="condition" onChange={handlePriceChange} value={priceInputs.condition} className="input">
                    <option>Good</option><option>Excellent</option><option>Needs work</option>
                </select>
            </div>
            <button onClick={handleRecommendPrice} disabled={isRecommendingPrice} className="w-full btn-primary">
                 {isRecommendingPrice ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Recommend Price'}
            </button>
            {priceRec && (
                <div className="p-4 bg-brand-light dark:bg-slate-700/50 rounded-lg space-y-3">
                    <p className="text-sm text-slate-600 dark:text-slate-300">Recommended Price</p>
                    <p className="text-4xl font-bold text-brand-dark dark:text-white">${priceRec.recommended_price.toLocaleString()}</p>
                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${priceRec.confidence_score}%` }}></div>
                    </div>
                    <p className="text-xs font-semibold text-right">Confidence: {priceRec.confidence_score}%</p>
                    <p className="text-sm text-slate-700 dark:text-slate-200 pt-2 border-t border-blue-200 dark:border-slate-600">{priceRec.market_analysis}</p>
                </div>
            )}
            <style>{`.input { @apply px-3 py-2 border border-slate-300 rounded-md focus:ring-brand-primary focus:border-brand-primary dark:bg-slate-700/80; } .btn-primary { @apply w-full bg-brand-primary text-white font-semibold py-2.5 rounded-lg hover:bg-opacity-90 flex items-center justify-center gap-2 disabled:bg-slate-400; }`}</style>
        </div>
    );
};

const ContentAnalyzer: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [fileType, setFileType] = useState<'image' | 'video' | null>(null);
    const [goal, setGoal] = useState<'sell' | 'rent' | 'investors'>('sell');
    const [prompt, setPrompt] = useState<string>('');
    const [analysis, setAnalysis] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const videoRef = useRef<HTMLVideoElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!fileType) {
            setPrompt('');
            return;
        }
        const mediaType = fileType === 'image' ? 'image' : 'video';
        const goalText = {
            sell: 'selling the property',
            rent: 'renting out the property',
            investors: 'attracting investors'
        }[goal];

        setPrompt(`Analyze this ${mediaType} for its effectiveness in ${goalText}. Provide a detailed analysis and actionable suggestions to improve it, focusing on aspects like lighting, composition, staging, and overall appeal to the target audience.`);
    }, [fileType, goal]);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setFilePreview(URL.createObjectURL(selectedFile));
        setAnalysis('');
        setError('');

        if (selectedFile.type.startsWith('video/')) {
            setFileType('video');
        } else if (selectedFile.type.startsWith('image/')) {
            setFileType('image');
        } else {
            setError('Please select a valid image or video file.');
            setFile(null);
            setFilePreview(null);
            setFileType(null);
        }
    };
    
    const extractFrame = (video: HTMLVideoElement, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, time: number): Promise<string> => {
        return new Promise((resolve, reject) => {
            const onSeeked = () => {
                video.removeEventListener('seeked', onSeeked);
                try {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                    canvas.toBlob(async (blob) => {
                        if (blob) {
                            const base64 = await blobToBase64(blob);
                            resolve(base64);
                        } else {
                            reject(new Error('Canvas toBlob failed'));
                        }
                    }, 'image/jpeg');
                } catch (e) {
                    reject(e);
                }
            };
            video.addEventListener('seeked', onSeeked);
            video.currentTime = time;
        });
    };

    const handleAnalyze = async () => {
        if (!file || !prompt) {
            setError('Please upload a file and ensure the prompt is filled.');
            return;
        }

        setIsLoading(true);
        setError('');
        setAnalysis('');
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const contentParts: any[] = [{ text: prompt }];

            if (fileType === 'image') {
                const base64Data = await blobToBase64(file);
                contentParts.push({
                    inlineData: { mimeType: file.type, data: base64Data }
                });
            } else if (fileType === 'video' && videoRef.current) {
                const video = videoRef.current;
                
                if (video.readyState < 1) {
                    await new Promise(resolve => video.addEventListener('loadedmetadata', resolve, { once: true }));
                }

                const duration = video.duration;
                const numFrames = 8;
                const framePromises: Promise<string>[] = [];

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                if (!context) throw new Error('Canvas context not available');

                for (let i = 0; i < numFrames; i++) {
                    const time = (i / (numFrames -1)) * duration;
                    framePromises.push(extractFrame(video, canvas, context, time));
                }
                
                const base64Frames = await Promise.all(framePromises);
                
                base64Frames.forEach(frame => {
                    contentParts.push({
                        inlineData: { mimeType: 'image/jpeg', data: frame }
                    });
                });
            } else {
                 throw new Error("Unsupported file type or media element not ready.");
            }
            
            // Use gemini-3-pro-preview for advanced video/image analysis
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: [{ parts: contentParts }],
            });

            setAnalysis(response.text || '');

        } catch (err: any) {
            console.error(err);
            setError(`Failed to analyze content: ${err.message}. Please try again.`);
        } finally {
           setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <h4 className="text-lg font-bold text-slate-800 dark:text-white">Content Analyzer</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">Upload a property image or video to get AI-powered feedback and suggestions using Gemini 3 Pro.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                     <div className="aspect-video bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden border-2 border-brand-gold/20">
                        {fileType === 'video' && filePreview && <video ref={videoRef} src={filePreview} controls className="w-full h-full rounded-lg" />}
                        {fileType === 'image' && filePreview && <img src={filePreview} alt="Property preview" className="w-full h-full object-contain rounded-lg" />}
                        {!filePreview && (
                            <div className="text-center text-slate-400">
                                <CameraIcon className="w-12 h-12 mx-auto" />
                                <p className="mt-2 text-sm font-semibold">Your image/video will appear here</p>
                            </div>
                        )}
                     </div>
                     <input type="file" accept="video/*,image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
                     <button onClick={() => fileInputRef.current?.click()} className="w-full text-center px-4 py-2.5 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-500 dark:text-slate-400 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-brand-primary">
                        {filePreview ? 'Change Media' : 'Upload Image or Video'}
                     </button>
                </div>
                <div className="flex flex-col">
                    <div>
                        <label htmlFor="goal" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Analysis Goal</label>
                        <select id="goal" value={goal} onChange={e => setGoal(e.target.value as any)} className="mt-1 w-full input">
                            <option value="sell">Sell the property</option>
                            <option value="rent">Rent the property</option>
                            <option value="investors">Attract investors</option>
                        </select>
                    </div>
                    <div className="mt-4">
                        <label htmlFor="prompt" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Your Prompt</label>
                        <textarea id="prompt" value={prompt} onChange={e => setPrompt(e.target.value)} rows={4} className="mt-1 w-full input" />
                    </div>
                     <button onClick={handleAnalyze} disabled={isLoading || !file} className="mt-3 w-full btn-write">
                        {isLoading ? <div className="w-5 h-5 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div> : <CpuChipIcon className="w-5 h-5"/>}
                        {isLoading ? 'Analyzing...' : 'Analyze Content'}
                    </button>
                </div>
            </div>
            <div className="mt-4">
                 <h5 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Analysis & Suggestions</h5>
                 <div className="w-full min-h-[150px] bg-brand-primary dark:bg-slate-900 rounded-xl p-6 border border-brand-gold/30 text-white shadow-xl">
                     {isLoading ? (
                        <div className="space-y-2 animate-pulse">
                            <div className="h-3 bg-white/20 rounded w-5/6"></div>
                            <div className="h-3 bg-white/20 rounded w-full"></div>
                            <div className="h-3 bg-white/20 rounded w-3/4"></div>
                        </div>
                     ) : error ? (
                        <p className="text-sm text-red-400 font-bold">{error}</p>
                     ) : analysis ? (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{analysis}</p>
                     ): (
                        <p className="text-sm text-white/40">AI analysis will appear here.</p>
                     )}
                </div>
            </div>
             <style>{`
                .input { @apply px-3 py-2 bg-white dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-brand-primary focus:border-brand-primary; }
                .btn-primary { @apply w-full bg-brand-primary text-white font-semibold py-2.5 rounded-lg hover:bg-opacity-90 flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed; }
            `}</style>
        </div>
    );
};

const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('A modern, eco-friendly house in a lush South African forest at sunset');
    const [images, setImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [mode, setMode] = useState<'generate' | 'edit'>('generate');
    const [sourceImage, setSourceImage] = useState<File | null>(null);
    const [sourceImagePreview, setSourceImagePreview] = useState<string | null>(null);
    const [aspectRatio, setAspectRatio] = useState('16:9');
    const [imageSize, setImageSize] = useState('1K');
    const [hasKey, setHasKey] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const checkKey = async () => {
             if ((window as any).aistudio && typeof (window as any).aistudio.hasSelectedApiKey === 'function') {
                const hasApiKey = await (window as any).aistudio.hasSelectedApiKey();
                setHasKey(hasApiKey);
            }
        };
        checkKey();
    }, []);


    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSourceImage(file);
            setSourceImagePreview(URL.createObjectURL(file));
        }
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setError('');
        setImages([]);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            if (mode === 'edit' && sourceImage) {
                // Use gemini-2.5-flash-image for editing
                const base64Data = await blobToBase64(sourceImage);
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: {
                        parts: [
                            { inlineData: { mimeType: sourceImage.type, data: base64Data } },
                            { text: prompt },
                        ],
                    },
                });

                 // Parse response for image
                const parts = response.candidates?.[0]?.content?.parts;
                if (parts) {
                    for (const part of parts) {
                        if (part.inlineData) {
                            const imageUrl = `data:image/png;base64,${part.inlineData.data}`;
                            setImages([imageUrl]);
                            break;
                        }
                    }
                }
                if (images.length === 0 && !response.candidates?.[0]?.content?.parts?.find(p => p.inlineData)) {
                    // Fallback if no image returned
                     console.warn("No image returned from edit request");
                     setError('No edited image returned. The model might have refused the edit.');
                }

            } else {
                // Use gemini-3-pro-image-preview for high quality generation
                 if (!hasKey) {
                    await (window as any).aistudio.openSelectKey();
                    setHasKey(true);
                }

                 // Must create new instance for updated key if selected
                 const aiWithKey = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

                const response = await aiWithKey.models.generateContent({
                    model: 'gemini-3-pro-image-preview',
                    contents: { parts: [{ text: prompt }] },
                    config: {
                        imageConfig: {
                            aspectRatio: aspectRatio,
                            imageSize: imageSize
                        }
                    },
                });
                
                const parts = response.candidates?.[0]?.content?.parts;
                if (parts) {
                    for (const part of parts) {
                        if (part.inlineData) {
                            const imageUrl = `data:image/png;base64,${part.inlineData.data}`;
                            setImages([imageUrl]);
                            break;
                        }
                    }
                }
            }

        } catch (err: any) {
            console.error(err);
            if (err.message?.includes("Requested entity was not found")) {
                setError("API Key error. Please select a valid API key.");
                setHasKey(false);
            } else {
                setError('Failed to generate image. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <h4 className="text-lg font-bold text-slate-800 dark:text-white">AI Image Studio</h4>
             <p className="text-sm text-slate-500 dark:text-slate-400">Generate high-quality images or edit existing ones using advanced Gemini models.</p>
             
             <div className="flex gap-4 border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">
                <button onClick={() => setMode('generate')} className={`text-sm font-semibold pb-2 ${mode === 'generate' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-slate-500'}`}>Generate New</button>
                <button onClick={() => setMode('edit')} className={`text-sm font-semibold pb-2 ${mode === 'edit' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-slate-500'}`}>Edit Image</button>
             </div>

             {mode === 'edit' && (
                 <div className="mb-4">
                    <input type="file" accept="image/*" onChange={handleImageUpload} ref={imageInputRef} className="hidden" />
                    <button onClick={() => imageInputRef.current?.click()} className="w-full py-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-sm font-semibold text-slate-500 hover:border-brand-primary transition-colors">
                        {sourceImage ? 'Change Image' : 'Upload Source Image'}
                    </button>
                    {sourceImagePreview && <img src={sourceImagePreview} alt="Source" className="mt-2 h-32 object-contain rounded-lg border border-slate-200" />}
                 </div>
             )}

             <div className="flex flex-col gap-3">
                 {mode === 'generate' && (
                    <div className="flex gap-4">
                        <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="input text-sm">
                            <option value="1:1">1:1 (Square)</option>
                            <option value="16:9">16:9 (Landscape)</option>
                            <option value="9:16">9:16 (Portrait)</option>
                            <option value="4:3">4:3</option>
                            <option value="3:4">3:4</option>
                        </select>
                         <select value={imageSize} onChange={(e) => setImageSize(e.target.value)} className="input text-sm">
                            <option value="1K">1K Resolution</option>
                            <option value="2K">2K Resolution</option>
                            <option value="4K">4K Resolution</option>
                        </select>
                    </div>
                 )}
                <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={mode === 'generate' ? "Describe the image you want to create..." : "Describe the edits (e.g., 'Add a pool', 'Make it sunset')..."} rows={3} className="w-full input" />
                <button onClick={handleGenerate} disabled={isLoading || (mode === 'edit' && !sourceImage)} className="btn-write w-full">
                    {isLoading ? <div className="w-5 h-5 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div> : (mode === 'edit' ? <PencilIcon className="w-5 h-5"/> : <SparklesIcon className="w-5 h-5" />)} 
                    {mode === 'edit' ? 'Edit Image' : 'Generate Image'}
                </button>
             </div>
             {error && <p className="text-sm text-red-500 text-center">{error}</p>}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {isLoading && <div className="aspect-video bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse border-2 border-brand-gold/10"></div>}
                {images.map((src, i) => <img key={i} src={src} alt={`Result ${i + 1}`} className="w-full aspect-video object-contain rounded-lg border-2 border-brand-gold shadow-xl bg-black"/>)}
             </div>
              <style>{`.input { @apply px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-brand-gold focus:border-brand-gold dark:bg-slate-700/80; } .btn-write { @apply bg-brand-primary text-brand-gold border-2 border-brand-gold font-black uppercase tracking-widest py-2.5 rounded-xl hover:bg-brand-gold hover:text-brand-dark transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg; }`}</style>
        </div>
    );
};

const VideoGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('A drone flying through a modern luxury apartment with city views at sunset');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState('');
    const [hasKey, setHasKey] = useState(false);
    const [sourceImage, setSourceImage] = useState<File | null>(null);
    const [sourceImagePreview, setSourceImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadingMessages = [ "Warming up the virtual cameras...", "Scouting digital locations...", "Rendering the first few frames...", "This can take a few minutes, hang tight...", "Applying cinematic color grading...", "Almost there, finalizing the video file..." ];

    useEffect(() => {
        const checkKey = async () => {
             if ((window as any).aistudio && typeof (window as any).aistudio.hasSelectedApiKey === 'function') {
                const hasApiKey = await (window as any).aistudio.hasSelectedApiKey();
                setHasKey(hasApiKey);
            }
        };
        checkKey();
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSourceImage(file);
            setSourceImagePreview(URL.createObjectURL(file));
        }
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setError('');
        setVideoUrl(null);
        setLoadingMessage(loadingMessages[0]);

        try {
            if (!hasKey) {
                await (window as any).aistudio.openSelectKey();
                setHasKey(true);
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            let imagePart = undefined;
            if (sourceImage) {
                const base64Data = await blobToBase64(sourceImage);
                imagePart = {
                    imageBytes: base64Data,
                    mimeType: sourceImage.type
                };
            }

            let operation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt: prompt,
                image: imagePart,
                config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
            });

            let messageIndex = 1;
            const interval = setInterval(() => {
                setLoadingMessage(loadingMessages[messageIndex % loadingMessages.length]);
                messageIndex++;
            }, 8000);

            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 10000));
                operation = await ai.operations.getVideosOperation({ operation: operation });
            }
            clearInterval(interval);
            
            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (downloadLink) {
                const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
                const videoBlob = await response.blob();
                setVideoUrl(URL.createObjectURL(videoBlob));
            } else {
                throw new Error("Video generation failed to return a valid link.");
            }

        } catch (err: any) {
            console.error(err);
            if (err.message?.includes("Requested entity was not found")) {
                setError("API Key error. Please select a valid API key from the dialog.");
                setHasKey(false);
            } else {
                setError('Failed to generate video. Please try again.');
            }
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    };
    
    return (
        <div className="space-y-4">
            <h4 className="text-lg font-bold text-slate-800 dark:text-white">AI Video Studio (Veo)</h4>
             <p className="text-sm text-slate-500 dark:text-slate-400">Create stunning video clips from text or animate an existing image. Requires API Key selection.</p>
             
             <div className="mb-4">
                <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="w-full py-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-sm font-semibold text-slate-500 hover:border-brand-primary transition-colors">
                    {sourceImage ? 'Change Input Image' : 'Upload Image to Animate (Optional)'}
                </button>
                {sourceImagePreview && <img src={sourceImagePreview} alt="Source for video" className="mt-2 h-32 object-contain rounded-lg border border-slate-200" />}
             </div>

             <div className="flex items-center gap-2">
                <input value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Enter a detailed video prompt..." className="w-full input" />
                <button onClick={handleGenerate} disabled={isLoading} className="btn-write w-auto flex-shrink-0 px-6">
                    {isLoading ? <div className="w-5 h-5 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div> : <SparklesIcon className="w-5 h-5" />} Generate
                </button>
             </div>
             {error && <p className="text-sm text-red-500 text-center">{error}</p>}
             <div className="aspect-video bg-brand-primary dark:bg-slate-950 rounded-xl flex items-center justify-center mt-4 border-2 border-brand-gold shadow-2xl relative">
                 {isLoading && (
                    <div className="text-center z-10">
                        <div className="w-10 h-10 border-4 border-white/20 border-t-brand-gold rounded-full animate-spin mx-auto shadow-[0_0_15px_rgba(212,175,55,0.5)]"></div>
                        <p className="mt-4 text-sm font-black text-brand-gold uppercase tracking-widest animate-pulse">{loadingMessage}</p>
                    </div>
                 )}
                 {videoUrl && <video src={videoUrl} controls autoPlay loop className="w-full h-full rounded-lg" />}
                 {!isLoading && !videoUrl && !error && <p className="text-white/30 font-bold uppercase tracking-widest">Premium AI Studio</p>}
             </div>
              <style>{`.input { @apply px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-brand-gold focus:border-brand-gold dark:bg-slate-700/80; } .btn-write { @apply bg-brand-primary text-brand-gold border-2 border-brand-gold font-black uppercase tracking-widest py-2.5 rounded-xl hover:bg-brand-gold hover:text-brand-dark transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg; }`}</style>
        </div>
    );
};


export default AgentAITools;
