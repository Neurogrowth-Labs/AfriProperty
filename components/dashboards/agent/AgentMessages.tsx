
import React, { useMemo } from 'react';
import type { Message, User } from '../../../types';
import { ChatBubbleLeftRightIcon } from '../../icons/ActionIcons';

interface AgentMessagesProps {
    user: User;
    messages: Message[];
    // FIX: Added onSendMessage to props interface
    onSendMessage: (messageData: Omit<Message, 'id' | 'timestamp'>) => Promise<void>;
}

const AgentMessages: React.FC<AgentMessagesProps> = ({ user, messages, onSendMessage }) => {
    
    const conversations = useMemo(() => {
        const grouped: Record<string, { propertyTitle: string; otherUser: string; messages: Message[] }> = {};
        
        messages.forEach(msg => {
            const otherUser = msg.senderUsername === user.username ? msg.receiverUsername : msg.senderUsername;
            const key = `${msg.propertyId}-${otherUser}`;
            
            if (!grouped[key]) {
                grouped[key] = {
                    propertyTitle: msg.propertyTitle,
                    otherUser,
                    messages: []
                };
            }
            grouped[key].messages.push(msg);
        });

        // Sort messages within each conversation
        Object.values(grouped).forEach(conv => {
            conv.messages.sort((a, b) => a.timestamp - b.timestamp);
        });

        return Object.values(grouped).sort((a, b) => b.messages[b.messages.length - 1].timestamp - a.messages[a.messages.length - 1].timestamp);

    }, [messages, user.username]);

    return (
        <div className="p-4 md:p-8">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Client Messages</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">All your communications with clients and investors in one place.</p>
            
            <div className="mt-6 space-y-6">
                 {conversations.length > 0 ? conversations.map((conv, index) => (
                    <div key={index} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                        <h3 className="font-bold text-brand-dark dark:text-white mb-3 border-b border-slate-200 dark:border-slate-700 pb-2">
                           Conversation with <span className="text-brand-primary">{conv.otherUser}</span> about "{conv.propertyTitle}"
                        </h3>
                        <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                            {conv.messages.map(msg => (
                                <div key={msg.id} className={`flex items-end gap-2 ${msg.senderUsername === user.username ? 'justify-end' : 'justify-start'}`}>
                                    {msg.senderUsername !== user.username && <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-bold flex-shrink-0">{msg.senderUsername.charAt(0)}</div>}
                                    <div className={`px-3 py-2 rounded-lg max-w-lg ${msg.senderUsername === user.username ? 'bg-brand-primary text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200'}`}>
                                        <p className="text-sm">{msg.text}</p>
                                        <p className="text-xs opacity-70 mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                        <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
                        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mt-4">No Messages Yet</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">When clients send you messages, conversations will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgentMessages;
