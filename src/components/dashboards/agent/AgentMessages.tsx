
import React, { useMemo, useState } from 'react';
import type { Message, User } from '../../../types';
import { ChatBubbleLeftRightIcon, SendIcon } from '../../icons/ActionIcons';

interface AgentMessagesProps {
    user: User;
    messages: Message[];
    onSendMessage: (messageData: Omit<Message, 'id' | 'timestamp'>) => Promise<void>;
}

const AgentMessages: React.FC<AgentMessagesProps> = ({ user, messages, onSendMessage }) => {
    const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
    const [sendingStatus, setSendingStatus] = useState<Record<string, boolean>>({});
    
    // Group messages into conversations based on Property + Other User
    const conversations = useMemo(() => {
        const grouped: Record<string, { propertyId: string; propertyTitle: string; otherUser: string; messages: Message[] }> = {};
        
        messages.forEach(msg => {
            // Determine who the "other person" is in this conversation
            const otherUser = msg.senderUsername === user.username ? msg.receiverUsername : msg.senderUsername;
            const key = `${msg.propertyId}-${otherUser}`;
            
            if (!grouped[key]) {
                grouped[key] = {
                    propertyId: msg.propertyId,
                    propertyTitle: msg.propertyTitle,
                    otherUser,
                    messages: []
                };
            }
            grouped[key].messages.push(msg);
        });

        // Sort messages within each conversation by time
        Object.values(grouped).forEach(conv => {
            conv.messages.sort((a, b) => a.timestamp - b.timestamp);
        });

        // Sort conversations by the time of the latest message
        return Object.values(grouped).sort((a, b) => {
            const lastA = a.messages[a.messages.length - 1].timestamp;
            const lastB = b.messages[b.messages.length - 1].timestamp;
            return lastB - lastA;
        });

    }, [messages, user.username]);

    const handleReplyChange = (convKey: string, text: string) => {
        setReplyTexts(prev => ({ ...prev, [convKey]: text }));
    };

    const handleSendReply = async (convKey: string, conv: typeof conversations[0]) => {
        const text = replyTexts[convKey];
        if (!text?.trim() || sendingStatus[convKey]) return;

        setSendingStatus(prev => ({ ...prev, [convKey]: true }));
        try {
            await onSendMessage({
                propertyId: conv.propertyId,
                propertyTitle: conv.propertyTitle,
                senderUsername: user.username,
                receiverUsername: conv.otherUser,
                text: text.trim(),
            });
            setReplyTexts(prev => ({ ...prev, [convKey]: '' }));
        } catch (error) {
            console.error("Chat Error:", error);
            alert("Failed to send message. Please try again.");
        } finally {
            setSendingStatus(prev => ({ ...prev, [convKey]: false }));
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-8 animate-fade-in">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Client Inquiries</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Connect with potential buyers and seekers.</p>
                </div>
                <div className="bg-brand-primary/10 px-4 py-2 rounded-full">
                    <span className="text-brand-primary font-bold text-sm">{conversations.length} Active Threads</span>
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
                 {conversations.length > 0 ? conversations.map((conv) => {
                    const convKey = `${conv.propertyId}-${conv.otherUser}`;
                    return (
                        <div key={convKey} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-[500px]">
                            {/* Chat Header */}
                            <header className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">
                                        Client: <span className="text-brand-primary">{conv.otherUser}</span>
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                        Property: {conv.propertyTitle}
                                    </p>
                                </div>
                                <div className="text-xs text-slate-400 font-medium bg-white dark:bg-slate-800 px-2 py-1 rounded-md border">
                                    {conv.messages.length} messages
                                </div>
                            </header>

                            {/* Chat Body */}
                            <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-slate-50/20 dark:bg-slate-900/10">
                                {conv.messages.map(msg => (
                                    <div key={msg.id} className={`flex ${msg.senderUsername === user.username ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm ${
                                            msg.senderUsername === user.username 
                                                ? 'bg-brand-primary text-white rounded-tr-none' 
                                                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700'
                                        }`}>
                                            <p className="text-sm leading-relaxed">{msg.text}</p>
                                            <p className="text-[10px] opacity-70 mt-2 text-right font-bold uppercase tracking-tighter">
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Chat Footer / Input */}
                            <footer className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="text" 
                                        value={replyTexts[convKey] || ''}
                                        onChange={e => handleReplyChange(convKey, e.target.value)}
                                        onKeyPress={e => e.key === 'Enter' && handleSendReply(convKey, conv)}
                                        placeholder="Type your reply to the client..." 
                                        className="flex-grow px-4 py-3 bg-slate-100 dark:bg-slate-800 border-transparent rounded-xl focus:ring-2 focus:ring-brand-primary focus:bg-white dark:focus:bg-slate-700 transition-all text-sm font-medium" 
                                        disabled={sendingStatus[convKey]}
                                    />
                                    <button 
                                        onClick={() => handleSendReply(convKey, conv)}
                                        disabled={!replyTexts[convKey]?.trim() || sendingStatus[convKey]}
                                        className="bg-brand-primary text-white p-3 rounded-xl hover:bg-brand-secondary transition-all disabled:bg-slate-300 dark:disabled:bg-slate-700 shadow-lg active:scale-95"
                                    >
                                        {sendingStatus[convKey] ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <SendIcon className="w-6 h-6"/>
                                        )}
                                    </button>
                                </div>
                            </footer>
                        </div>
                    );
                }) : (
                    <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                        <div className="bg-slate-100 dark:bg-slate-700 p-6 rounded-full w-fit mx-auto mb-6">
                            <ChatBubbleLeftRightIcon className="w-16 h-16 text-slate-300 dark:text-slate-600" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">No Inquiries Yet</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto font-medium">When property seekers reach out regarding your listings, their messages will appear here.</p>
                    </div>
                )}
            </div>
             <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default AgentMessages;
