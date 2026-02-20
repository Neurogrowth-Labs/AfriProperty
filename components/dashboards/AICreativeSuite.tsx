
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { blobToBase64 } from '../lib/utils';
import { VideoCameraIcon, CameraIcon, SparklesIcon, CpuChipIcon } from './icons/ActionIcons';

type AITab = 'videoAnalysis' | 'imageGen' | 'videoGen';

const AICreativeSuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AITab>('videoAnalysis');

  const tabs: { id: AITab; label: string; icon: React.ElementType }[] = [
    { id: 'videoAnalysis', label: 'Video Analysis', icon: CpuChipIcon },
    { id: 'imageGen', label: 'Image Generation', icon: CameraIcon },
    { id: 'videoGen', label: 'Video Generation', icon: VideoCameraIcon },
  ];

  return (
    <section id="ai-suite" className="py-20 bg-brand-light dark:bg-brand-dark">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-brand-dark dark:text-white">AI Creative Suite</h2>
          <p className="text-center text-slate-500 dark:text-slate-400 mt-4 max-w-2xl mx-auto">
            Leverage the power of Gemini to analyze video, generate images, and create compelling video content.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="p-2 bg-slate-100 dark:bg-slate-900/50 rounded-t-xl">
            <div className="flex items-center gap-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-slate-700 text-brand-primary shadow'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="p-6">
            {activeTab === 'videoAnalysis' && <VideoAnalysis />}
            {activeTab === 'imageGen' && <Placeholder title="Image Generation" description="This tool will allow you to generate high-quality images from text prompts using Imagen." />}
            {activeTab === 'videoGen' && <Placeholder title="Video Generation" description="This tool will allow you to create stunning videos from text prompts or images using Veo." />}
          </div>
        </div>
      </div>
    </section>
  );
};

const VideoAnalysis: React.FC = () => {
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('Describe what is happening in this video.');
    const [analysis, setAnalysis] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const videoRef = useRef<HTMLVideoElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('video/')) {
            setVideoSrc(URL.createObjectURL(file));
            setAnalysis('');
            setError('');
        } else {
            setError('Please select a valid video file.');
        }
    };

    const handleAnalyze = async () => {
        if (!videoRef.current || !prompt) {
            setError('Please upload a video and enter a prompt.');
            return;
        }

        setIsLoading(true);
        setError('');
        setAnalysis('');

        try {
            const video = videoRef.current;
            await video.play();
            video.pause();

            const duration = video.duration;
            const numFrames = 8; // Extract 8 frames
            const framePromises: Promise<string>[] = [];

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (!context) throw new Error('Canvas context not available');

            for (let i = 0; i < numFrames; i++) {
                const time = (i / (numFrames -1)) * duration;
                framePromises.push(extractFrame(video, canvas, context, time));
            }
            
            const base64Frames = await Promise.all(framePromises);
            
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

            const contents = [
                { text: prompt },
                ...base64Frames.map(frame => ({
                    inlineData: { mimeType: 'image/jpeg', data: frame },
                }))
            ];
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: [{ parts: contents }],
            });

            setAnalysis(response.text);

        } catch (err) {
            console.error(err);
            setError('Failed to analyze video. The file may be too large or in an unsupported format. Please try again.');
        } finally {
            setIsLoading(false);
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

    return (
        <div className="space-y-4">
            <div>
                <h4 className="text-lg font-bold text-slate-800 dark:text-white">Analyze Video Content</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">Upload a video and ask Gemini to describe it, summarize it, or identify key elements.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                     <div className="aspect-video bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                        {videoSrc ? (
                            <video ref={videoRef} src={videoSrc} controls className="w-full h-full rounded-lg" />
                        ) : (
                            <div className="text-center text-slate-400">
                                <VideoCameraIcon className="w-12 h-12 mx-auto" />
                                <p className="mt-2 text-sm font-semibold">Your video will appear here</p>
                            </div>
                        )}
                     </div>
                     <input type="file" accept="video/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
                     <button onClick={() => fileInputRef.current?.click()} className="w-full text-center px-4 py-2.5 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-500 dark:text-slate-400 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-brand-primary">
                        {videoSrc ? 'Change Video' : 'Upload a Video'}
                     </button>
                </div>
                <div className="flex flex-col">
                    <div>
                        <label htmlFor="prompt" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Your Question</label>
                        <textarea id="prompt" value={prompt} onChange={e => setPrompt(e.target.value)} rows={3} className="mt-1 w-full input" />
                    </div>
                     <button onClick={handleAnalyze} disabled={isLoading || !videoSrc} className="mt-3 w-full btn-primary">
                        {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <CpuChipIcon className="w-5 h-5"/>}
                        {isLoading ? 'Analyzing...' : 'Analyze Video'}
                    </button>
                    <div className="mt-4 flex-grow bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                         <h5 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Analysis Result</h5>
                         {isLoading ? (
                            <div className="space-y-2 animate-pulse">
                                <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-5/6"></div>
                                <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-full"></div>
                                <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-3/4"></div>
                            </div>
                         ) : error ? (
                            <p className="text-sm text-red-500">{error}</p>
                         ) : analysis ? (
                            <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{analysis}</p>
                         ): (
                            <p className="text-sm text-slate-400">AI analysis will appear here.</p>
                         )}
                    </div>
                </div>
            </div>
             <style>{`
                .input { @apply px-3 py-2 bg-white dark:bg-slate-700/80 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-brand-primary focus:border-brand-primary; }
                .btn-primary { @apply w-full bg-brand-primary text-white font-semibold py-2.5 rounded-lg hover:bg-opacity-90 flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed; }
            `}</style>
        </div>
    );
};

const Placeholder: React.FC<{ title: string, description: string }> = ({ title, description }) => (
    <div className="text-center p-8 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
        <SparklesIcon className="w-12 h-12 text-slate-300 dark:text-slate-500 mx-auto" />
        <h4 className="text-lg font-bold text-slate-800 dark:text-white mt-4">{title}</h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{description}</p>
        <p className="text-xs font-semibold text-brand-primary mt-4">Coming Soon</p>
    </div>
);


export default AICreativeSuite;
