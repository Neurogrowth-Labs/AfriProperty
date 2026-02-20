
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { ChatIcon, CloseIcon, SendIcon } from './icons/NavIcons';
import { useTranslations } from '../contexts/LanguageContext';

interface ChatbotMessage {
  sender: 'ai' | 'user';
  text: string;
}

const systemInstruction = `You are "AfriProperty AI Assistant," a helpful chatbot for a South African online property listing marketplace called "AfriProperty." Your users include landlords, real estate agents, developers, tenants, buyers, and investors. The platform focuses on affordable housing, student rentals, and township/rural properties, but also serves general residential and commercial markets.

Your goal is to help users:
1.  Find or list properties easily.
2.  Write clear, attractive, and trustworthy property descriptions.
3.  Answer questions about properties, neighborhoods, pricing, and the rental/buying process.
4.  Suggest relevant services (e.g., movers, financing, rent-to-own, tenant verification).

Your tone and style must be:
- Friendly, professional, and trustworthy.
- Use simple, clear South African English. Be culturally inclusive.
- Keep answers concise but informative.

Your core instructions are:
1.  **Always ask clarifying questions first.** Before giving an answer, get context. Examples: "Are you looking to rent or buy?", "Which city are you interested in?", "Can you tell me more about the property you want to list?".
2.  **When creating property descriptions,** emphasize location, affordability, unique features, and trust/safety.
3.  **When suggesting services** (like mortgage providers, movers, etc.), provide practical guidance and options but **NEVER give financial or legal advice.** Start with a disclaimer like, "While I can't give financial advice, here are some popular options you could look into...".
4.  **Do not make up property details.** Use only verified information provided by the platform or the user in the current conversation. If you don't know, say so.
5.  Start the conversation with a friendly greeting and offer help. For example: "Hello! I'm the AfriProperty AI Assistant. How can I help you find a home or list a property today? You can ask me things like 'Help me find a 2-bedroom house to rent in Durban' or 'Help me write a description for my apartment'."
`;

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslations();
    const [messages, setMessages] = useState<ChatbotMessage[]>([
        {
            sender: 'ai',
            text: t.chatbot.greeting
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initChat = async () => {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                const newChat = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: {
                        systemInstruction: systemInstruction,
                    },
                });
                chatRef.current = newChat;
            } catch (error) {
                console.error("Failed to initialize chatbot:", error);
                setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
            }
        };
        initChat();
    }, []);

    // Update greeting if language changes while chatbot is closed
    useEffect(() => {
        if (!isOpen) {
            setMessages([{ sender: 'ai', text: t.chatbot.greeting }]);
        }
    }, [t, isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading || !chatRef.current) return;

        const userMessage: ChatbotMessage = { sender: 'user', text: inputValue };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const stream = await chatRef.current.sendMessageStream({ message: userMessage.text });
            let aiResponse = '';
            setMessages(prev => [...prev, { sender: 'ai', text: '' }]);

            for await (const chunk of stream) {
                aiResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { sender: 'ai', text: aiResponse };
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Chatbot API error:", error);
            const errorMessage: ChatbotMessage = { sender: 'ai', text: "Oops! Something went wrong. Please try asking again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <>
            <div className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 transition-all duration-300 ${isOpen ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}>
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-brand-primary text-white rounded-full p-4 shadow-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 animate-pulse"
                    aria-label="Open Chat Assistant"
                >
                    <ChatIcon className="w-8 h-8" />
                </button>
            </div>

            <div className={`fixed bottom-0 right-0 w-full h-full sm:m-6 z-[60] sm:h-auto sm:max-h-[80vh] sm:w-96 bg-white dark:bg-slate-900 sm:rounded-xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                {/* Header */}
                <header className="bg-gradient-to-r from-brand-dark to-slate-800 text-white p-4 flex justify-between items-center sm:rounded-t-xl">
                    <h3 className="font-bold text-lg">AfriProperty AI Assistant</h3>
                    <button onClick={() => setIsOpen(false)} aria-label="Close Chat" className="p-1 rounded-full hover:bg-white/20 transition-colors">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </header>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-slate-50 dark:bg-slate-800">
                    <div className="space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-brand-dark flex items-center justify-center text-white font-bold text-sm flex-shrink-0">AI</div>}
                                <div className={`max-w-[80%] px-4 py-2.5 rounded-xl ${msg.sender === 'user' ? 'bg-brand-primary text-white rounded-br-lg' : 'bg-white dark:bg-slate-700 text-brand-dark dark:text-slate-200 rounded-bl-lg shadow-sm'}`}>
                                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && messages[messages.length-1]?.sender === 'user' && (
                             <div className="flex items-end gap-2 justify-start">
                                <div className="w-8 h-8 rounded-full bg-brand-dark flex items-center justify-center text-white font-bold text-sm flex-shrink-0">AI</div>
                                <div className="max-w-xs px-4 py-3 rounded-xl bg-white dark:bg-slate-700 text-brand-dark shadow-sm">
                                    <div className="flex items-center space-x-1">
                                        <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input */}
                <div className="p-3 border-t bg-white dark:bg-slate-900 dark:border-slate-700 sm:rounded-b-xl">
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask me anything..."
                            className="w-full px-4 py-2 bg-slate-100 border-transparent rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent dark:bg-slate-800 dark:text-white"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={isLoading || !inputValue.trim()}
                            className="bg-brand-primary text-white p-2.5 rounded-full disabled:bg-slate-400 disabled:cursor-not-allowed hover:bg-opacity-90 transition-all transform hover:scale-110"
                            aria-label="Send Message"
                        >
                            <SendIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Chatbot;
