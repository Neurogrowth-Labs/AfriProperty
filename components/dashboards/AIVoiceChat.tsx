
import React, { useState, useEffect, useRef } from 'react';
/* Removed non-existent LiveSession import from @google/genai */
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { encode, decode, decodeAudioData } from '../lib/audioUtils';
import { MicrophoneIcon, StopIcon } from './icons/ActionIcons';
import { CloseIcon } from './icons/NavIcons';

interface AIVoiceChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIVoiceChat: React.FC<AIVoiceChatProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [transcripts, setTranscripts] = useState<{ user: string; model: string }[]>([]);
  const [currentUserTranscript, setCurrentUserTranscript] = useState('');
  const [currentModelTranscript, setCurrentModelTranscript] = useState('');
  
  /* Changed sessionPromiseRef type to any as LiveSession is not exported */
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    if (isOpen && status === 'idle') {
      startSession();
    } else if (!isOpen && status !== 'idle') {
      stopSession();
    }

    return () => {
      stopSession();
    };
  }, [isOpen]);
  
  const stopSession = async () => {
    if (sessionPromiseRef.current) {
      try {
        const session = await sessionPromiseRef.current;
        session.close();
      } catch (e) {
        console.error('Error closing session:', e);
      }
    }
    
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    scriptProcessorRef.current?.disconnect();
    audioContextRef.current?.close();
    outputAudioContextRef.current?.close();

    sessionPromiseRef.current = null;
    mediaStreamRef.current = null;
    scriptProcessorRef.current = null;
    audioContextRef.current = null;
    outputAudioContextRef.current = null;
    nextStartTimeRef.current = 0;
    sourcesRef.current.clear();
    
    setStatus('idle');
    setTranscripts([]);
    setCurrentUserTranscript('');
    setCurrentModelTranscript('');
  };

  const startSession = async () => {
    setStatus('connecting');
    setTranscripts([]);
    
    try {
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

      sessionPromiseRef.current = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setStatus('connected');
            const source = audioContextRef.current!.createMediaStreamSource(mediaStreamRef.current!);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = scriptProcessor;

            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                  int16[i] = inputData[i] * 32768;
              }
              const pcmBlob: Blob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };

              sessionPromiseRef.current?.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle transcriptions
            if (message.serverContent?.inputTranscription) {
              setCurrentUserTranscript(prev => prev + message.serverContent!.inputTranscription!.text);
            }
            if (message.serverContent?.outputTranscription) {
              setCurrentModelTranscript(prev => prev + message.serverContent!.outputTranscription!.text);
            }
            if (message.serverContent?.turnComplete) {
                const finalUserInput = currentUserTranscript + (message.serverContent?.inputTranscription?.text || '');
                const finalModelOutput = currentModelTranscript + (message.serverContent?.outputTranscription?.text || '');

                if (finalUserInput || finalModelOutput) {
                    setTranscripts(prev => [...prev, { user: finalUserInput, model: finalModelOutput }]);
                }
                setCurrentUserTranscript('');
                setCurrentModelTranscript('');
            }
            
            // Handle audio output
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && outputAudioContextRef.current) {
              const outputCtx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const audioBuffer = await decodeAudioData(decode(audioData), outputCtx, 24000, 1);
              const sourceNode = outputCtx.createBufferSource();
              sourceNode.buffer = audioBuffer;
              sourceNode.connect(outputCtx.destination);
              sourceNode.addEventListener('ended', () => {
                sourcesRef.current.delete(sourceNode);
              });
              
              sourceNode.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(sourceNode);
            }

            if (message.serverContent?.interrupted) {
                for (const source of sourcesRef.current.values()) {
                    source.stop();
                }
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
            }
          },
          onerror: (e: ErrorEvent) => {
            console.error('Session error:', e);
            setStatus('error');
          },
          onclose: (e: CloseEvent) => {
             // Let the main stopSession function handle cleanup
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: 'You are a friendly and helpful real estate assistant for AfriProperty. Keep your answers concise and helpful.',
        },
      });

    } catch (err) {
      console.error('Failed to start session:', err);
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  let statusText = "Connecting...";
  if (status === 'connected') statusText = "Listening...";
  if (status === 'error') statusText = "Connection Error. Please try again.";

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[150] flex flex-col items-center justify-center p-4 text-white animate-fade-in">
      <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10">
        <CloseIcon className="w-8 h-8"/>
      </button>

      <div className="flex-grow flex flex-col justify-end w-full max-w-3xl overflow-y-auto">
        <div className="space-y-4 p-4">
            {transcripts.map((t, i) => (
                <div key={i}>
                    {t.user && <p className="text-lg text-slate-300"><strong>You:</strong> {t.user}</p>}
                    {t.model && <p className="text-lg text-white"><strong>AI:</strong> {t.model}</p>}
                </div>
            ))}
            {currentUserTranscript && <p className="text-lg text-slate-300"><strong>You:</strong> {currentUserTranscript}</p>}
            {currentModelTranscript && <p className="text-lg text-white"><strong>AI:</strong> {currentModelTranscript}</p>}
        </div>
      </div>
      
      <div className="flex-shrink-0 flex flex-col items-center justify-center py-10">
        <div className={`relative w-24 h-24 flex items-center justify-center rounded-full ${status === 'connected' ? 'bg-blue-500' : 'bg-slate-600'}`}>
          <MicrophoneIcon className="w-10 h-10"/>
          {status === 'connected' && <div className="absolute inset-0 rounded-full border-4 border-blue-400 animate-ping"></div>}
        </div>
        <p className="mt-4 font-semibold">{statusText}</p>
      </div>

      <div className="pb-8">
        <button onClick={onClose} className="bg-red-600 px-6 py-3 rounded-full font-bold flex items-center gap-2 text-lg hover:bg-red-700">
            <StopIcon className="w-6 h-6"/>
            End Session
        </button>
      </div>
       <style>{`
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        `}</style>
    </div>
  );
};

export default AIVoiceChat;
