
import React, { useState, useEffect, useRef } from 'react';
import type { BlogPost } from '../types';
import { CloseIcon } from './icons/NavIcons';
import { EnvelopeIcon, SpeakerWaveIcon, PauseIcon } from './icons/ActionIcons';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { GoogleGenAI, Modality } from '@google/genai';
import { decode, decodeAudioData } from '../lib/audioUtils';

interface BlogDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: BlogPost;
  onContactClick: () => void;
}

const BlogDetailModal: React.FC<BlogDetailModalProps> = ({ isOpen, onClose, post, onContactClick }) => {
  const [speechState, setSpeechState] = useState<'stopped' | 'loading' | 'playing'>('stopped');
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const stopSpeech = () => {
    if (audioSourceRef.current) {
        audioSourceRef.current.onended = null; // Prevent onended from firing on manual stop
        audioSourceRef.current.stop();
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
    }
    setSpeechState('stopped');
  };

  useEffect(() => {
    // Cleanup on unmount or when modal closes
    return () => {
      stopSpeech();
    };
  }, []);
  
  const handleToggleSpeech = async () => {
    if (speechState === 'loading') return;
    if (speechState === 'playing') {
      stopSpeech();
      return;
    }
    
    setSpeechState('loading');
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        
        // Strip markdown for cleaner speech
        const cleanContent = post.content
            .replace(/#+\s*/g, '')
            .replace(/\*/g, '')
            .replace(/\[(.*?)\]\(.*?\)/g, '$1');

        const textToSpeak = `${post.title}. By ${post.author}. ${cleanContent}`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-tts',
            contents: [{ parts: [{ text: textToSpeak }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            const audioBuffer = await decodeAudioData(decode(base64Audio), audioContextRef.current, 24000, 1);
            
            audioSourceRef.current = audioContextRef.current.createBufferSource();
            audioSourceRef.current.buffer = audioBuffer;
            audioSourceRef.current.connect(audioContextRef.current.destination);
            audioSourceRef.current.start();
            setSpeechState('playing');
            audioSourceRef.current.onended = () => {
                setSpeechState('stopped');
            };
        } else {
             throw new Error("No audio data received");
        }
    } catch (e) {
        console.error("TTS Error:", e);
        alert("Sorry, text-to-speech is currently unavailable.");
        setSpeechState('stopped');
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[110] p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" 
        onClick={e => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
            <h2 className="text-xl font-bold text-brand-dark dark:text-white truncate pr-4">From the Blog</h2>
            <button onClick={onClose} className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <CloseIcon className="w-6 h-6" />
            </button>
        </header>
        
        <article className="flex-grow overflow-y-auto">
            <div className="relative w-full h-64">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                    <h1 className="text-3xl font-extrabold">{post.title}</h1>
                     <div className="flex items-center justify-between">
                        <p className="text-sm opacity-90 mt-2">By {post.author} on {post.date}</p>
                        <button onClick={handleToggleSpeech} title={speechState === 'playing' ? "Pause article" : "Listen to article"} className="mt-2 p-2 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50" disabled={speechState === 'loading'}>
                            {speechState === 'loading' ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : speechState === 'playing' ? <PauseIcon className="w-6 h-6" /> : <SpeakerWaveIcon className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>
            <div className="p-8 prose dark:prose-invert max-w-none">
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {post.content}
                </ReactMarkdown>
            </div>
        </article>
        
        <footer className="bg-slate-50 dark:bg-slate-800 p-6 rounded-b-xl border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-bold text-slate-800 dark:text-white">Have Questions?</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Our team is here to help you with your real estate journey.</p>
                </div>
                <button onClick={onContactClick} className="bg-brand-primary text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2">
                    <EnvelopeIcon className="w-5 h-5"/>
                    Contact Us
                </button>
            </div>
        </footer>
      </div>
       <style>{`
          .prose h2 { @apply text-2xl font-bold mb-4 mt-6; }
          .prose p { @apply my-4 leading-relaxed; }
          .prose ul { @apply list-disc list-inside my-4; }
          .prose li { @apply my-2; }
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

export default BlogDetailModal;