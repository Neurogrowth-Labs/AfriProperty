import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { blobToBase64 } from '../../../lib/utils';
import { VideoCameraIcon, CameraIcon, SparklesIcon, CpuChipIcon } from '../../icons/ActionIcons';
import { PropertyType } from '../../../types';

type AITab = 'descGen' | 'priceRec' | 'contentAnalyzer' | 'imageGen' | 'videoGen';

const AgentAITools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AITab>('descGen');

  const tools: { id: AITab; label: string; icon: React.ElementType }[] = [
    { id: 'descGen', label: 'Description Generator', icon: SparklesIcon },
    { id: 'priceRec', label: 'Pricing Recommender', icon: CpuChipIcon },
    { id: 'contentAnalyzer', label: 'Content Analyzer', icon: CpuChipIcon },
    { id: 'imageGen', label: 'Image Generation', icon: CameraIcon },
    { id: 'videoGen', label: 'Video Generation', icon: VideoCameraIcon },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">AI-Powered Tools</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Optimize your listings and marketing content with intelligent assistance.</p>
      </div>
      
      <div className="mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-2 bg-brand-primary rounded-t-xl">
          <div className="flex items-center gap-2 flex-wrap">
            {tools.map(tool => (
              <button
                key={tool.id}
                onClick={() => setActiveTab(tool.id)}
                className={`flex-grow md:flex-1 flex items-center justify-center gap-2 px-3 py-3 text-xs font-bold rounded-lg transition-all duration-300 ${
                  activeTab === tool.id
                    ? 'bg-brand-gold text-brand-dark shadow-lg scale-105'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
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
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="bg-brand-gold p-2 rounded-lg">
                    <SparklesIcon className="w-6 h-6 text-brand-dark" />
                </div>
                <h4 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">AI Write Agent</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="title" onChange={handleDescChange} placeholder="Property Title" className="input col-span-2" />
                <select name="type" onChange={handleDescChange} value={descInputs.type} className="input">
                    {Object.values(PropertyType).filter(t => t !== PropertyType.ALL).map(t => <option key={t}>{t}</option>)}
                </select>
                <input name="location" onChange={handleDescChange} placeholder="City" className="input" />
                <input name="beds" type="number" onChange={handleDescChange} placeholder="Beds" className="input" />
                <input name="baths" type="number" onChange={handleDescChange} placeholder="Baths" className="input" />
                <input name="area" type="number" onChange={handleDescChange} placeholder="Area (sqft)" className="input" />
                <input name="amenities" onChange={handleDescChange} placeholder="Key Amenities (e.g., Pool, Gym)" className="input" />
                <textarea name="neighborhood" onChange={handleDescChange} placeholder="Neighborhood highlights" rows={2} className="input col-span-2" />
            </div>
            
            <button onClick={handleGenerateDescription} disabled={isGeneratingDesc} className="w-full btn-write">
                {isGeneratingDesc ? <div className="w-5 h-5 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div> : (
                    <><SparklesIcon className="w-5 h-5" /> Generate Premium Copy</>
                )}
            </button>
            
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-gold to-brand-primary rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <textarea 
                    value={generatedDesc} 
                    readOnly 
                    placeholder="Premium generated description will appear here..." 
                    rows={8} 
                    className="relative w-full input bg-white dark:bg-slate-900 border-2 border-brand-gold/30 font-medium leading-relaxed" 
                />
            </div>
            
            <style>{`
                .input { @apply px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-brand-gold focus:border-brand-gold dark:bg-slate-700/80 transition-all; }
                .btn-write { 
                    @apply w-full bg-brand-primary text-brand-gold border-2 border-brand-gold font-black uppercase tracking-widest py-4 rounded-xl 
                    hover:bg-brand-gold hover:text-brand-dark transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl; 
                }
            `}</style>
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
                     {Object.values(PropertyType).filter(t => t !== PropertyType.ALL).map(t => <option key={t}>{t}</option>)}
                </select>
                <input name="location" onChange={handlePriceChange} placeholder="City" className="input" value={priceInputs.location}/>
                <input name="beds" type="number" onChange={handlePriceChange} placeholder="Beds" className="input" value={priceInputs.beds}/>
                <input name="baths" type="number" onChange={handlePriceChange} placeholder="Baths" className="input" value={priceInputs.baths}/>
                <input name="area" type="number" onChange={handlePriceChange} placeholder="Area (sqft)" className="input" value={priceInputs.area}/>
                <select name="condition" onChange={handlePriceChange} value={priceInputs.condition} className="input">
                    <option>Good</option><option>Excellent</option><option>Needs work</option>
                </select>
            </div>
            <button onClick={handleRecommendPrice} disabled={isRecommendingPrice} className="w-full btn-write">
                 {isRecommendingPrice ? <div className="w-5 h-5 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div> : 'Recommend Price'}
            </button>
            {priceRec && (
                <div className="p-6 bg-brand-primary dark:bg-slate-900 border-l-4 border-brand-gold rounded-r-xl space-y-3">
                    <p className="text-sm text-white/70">Recommended Price</p>
                    <p className="text-4xl font-black text-brand-gold">${priceRec.recommended_price?.toLocaleString()}</p>
                    <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-brand-gold h-2 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]" style={{ width: `${priceRec.confidence_score}%` }}></div>
                    </div>
                    <p className="text-xs font-bold text-brand-gold text-right uppercase tracking-widest">Confidence: {priceRec.confidence_score}%</p>
                    <p className="text-sm text-white leading-relaxed pt-2 border-t border-white/10">{priceRec.market_analysis}</p>
                </div>
            )}
            <style>{`.input { @apply px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-brand-gold focus:border-brand-gold dark:bg-slate-700/80; } .btn-write { @apply w-full bg-brand-primary text-brand-gold border-2 border-brand-gold font-black uppercase tracking-widest py-3 rounded-xl hover:bg-brand-gold hover:text-brand-dark transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50; }`}</style>
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
                <p className="text-sm text-slate-500 dark:text-slate-400">Upload a property image or video to get AI-powered feedback and suggestions for improvement.</p>
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
                     <button onClick={() => fileInputRef.current?.click()} className="w-full text-center px-4 py-2.5 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-500 dark:text-slate-400 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-brand-gold transition-all">
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
                .input { @apply px-3 py-2 bg-white dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-brand-gold focus:border-brand-gold; }
                .btn-write { @apply w-full bg-brand-primary text-brand-gold border-2 border-brand-gold font-black uppercase tracking-widest py-3 rounded-xl hover:bg-brand-gold hover:text-brand-dark transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50; }
            `}</style>
        </div>
    );
};

const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('A cinematic, photorealistic image of a modern, eco-friendly house in a lush South African forest at sunset');
    const [images, setImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setError('');
        setImages([]);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: prompt,
                config: {
                    numberOfImages: 2,
                    outputMimeType: 'image/jpeg',
                    aspectRatio: '16:9',
                },
            });

            const imageUrls = response.generatedImages.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
            setImages(imageUrls);
        } catch (err: any) {
            console.error(err);
            setError('Failed to generate images. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <h4 className="text-lg font-bold text-slate-800 dark:text-white">AI Image Generation</h4>
             <p className="text-sm text-slate-500 dark:text-slate-400">Generate high-quality, realistic images for your property listings or marketing materials from a simple text description.</p>
             <div className="flex items-center gap-2">
                <input value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Enter a detailed prompt..." className="w-full input" />
                <button onClick={handleGenerate} disabled={isLoading} className="btn-write w-auto flex-shrink-0 px-6">
                    {isLoading ? <div className="w-5 h-5 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div> : <SparklesIcon className="w-5 h-5" />} Generate
                </button>
             </div>
             {error && <p className="text-sm text-red-500 text-center">{error}</p>}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {isLoading && [...Array(2)].map((_, i) => <div key={i} className="aspect-video bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse border-2 border-brand-gold/10"></div>)}
                {images.map((src, i) => <img key={i} src={src} alt={`Generated image ${i + 1}`} className="w-full aspect-video object-cover rounded-lg border-2 border-brand-gold shadow-xl"/>)}
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

    const loadingMessages = [ "Warming up the virtual cameras...", "Scouting digital locations...", "Rendering the first few frames...", "This can take a few minutes, hang tight...", "Applying cinematic color grading...", "Almost there, finalizing the video file..." ];

    useEffect(() => {
        const checkKey = async () => {
             if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
                const hasApiKey = await window.aistudio.hasSelectedApiKey();
                setHasKey(hasApiKey);
            }
        };
        checkKey();
    }, []);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setError('');
        setVideoUrl(null);
        setLoadingMessage(loadingMessages[0]);

        try {
            if (!hasKey) {
                await window.aistudio.openSelectKey();
                setHasKey(true);
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            let operation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt: prompt,
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
            <h4 className="text-lg font-bold text-slate-800 dark:text-white">AI Video Generation</h4>
             <p className="text-sm text-slate-500 dark:text-slate-400">Create stunning, short video clips for social media or property listings. This feature requires selecting an API key. <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-brand-gold underline">Learn about billing</a>.</p>
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