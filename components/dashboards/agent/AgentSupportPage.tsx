
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { User, KnowledgeBaseArticle, ForumPost } from '../../../types';
import { KNOWLEDGE_BASE_ARTICLES, FORUM_POSTS } from '../../../constants';
import { BookOpenIcon, UsersIcon, ChatBubbleLeftRightIcon } from '../../icons/AgentDashboardIcons';
import { CpuChipIcon } from '../../icons/ActionIcons';
import { SearchIcon } from '../../icons/SearchIcons';
import { SendIcon } from '../../icons/NavIcons';
import NewPostModal from '../../NewPostModal';
import ForumPostDetailModal from '../../ForumPostDetailModal';

interface AgentSupportPageProps {
  user: User;
}

type SupportTab = 'chat' | 'kb' | 'forum';

interface ChatMessage {
    sender: 'agent' | 'support';
    text: string;
}

// --- Main Support Page Component ---
const AgentSupportPage: React.FC<AgentSupportPageProps> = ({ user }) => {
    const [activeTab, setActiveTab] = useState<SupportTab>('kb');
    
    // State for Community Forum
    const [forumPosts, setForumPosts] = useState<ForumPost[]>(FORUM_POSTS);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);

    const handleAddPost = (post: { title: string, content: string }) => {
        const newPost: ForumPost = {
            ...post,
            id: `fp_${Date.now()}`,
            author: user.username,
            timestamp: Date.now(),
            replies: 0,
            views: 0,
        };
        setForumPosts(prev => [newPost, ...prev]);
        setIsPostModalOpen(false);
    };

    const renderContent = () => {
        switch(activeTab) {
            case 'chat': return <ChatSupport />;
            case 'kb': return <KnowledgeBase />;
            case 'forum': return <CommunityForum posts={forumPosts} onNewPost={() => setIsPostModalOpen(true)} onPostClick={setSelectedPost} />;
            default: return null;
        }
    };

    return (
        <div className="p-4 sm:p-8 h-full flex flex-col">
            <div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Support & Resources</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Get help, expand your knowledge, and connect with peers.</p>
            </div>

            <div className="border-b border-slate-200 dark:border-slate-700 mt-6">
                <nav className="-mb-px flex space-x-6">
                    <TabButton id="chat" label="Chat Support" icon={ChatBubbleLeftRightIcon} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="kb" label="Knowledge Base" icon={BookOpenIcon} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="forum" label="Community Forum" icon={UsersIcon} activeTab={activeTab} setActiveTab={setActiveTab} />
                </nav>
            </div>
            
            <div className="flex-grow mt-6 bg-white dark:bg-slate-800/50 rounded-lg shadow-sm overflow-y-auto">
                {renderContent()}
            </div>
            
            <NewPostModal 
                isOpen={isPostModalOpen}
                onClose={() => setIsPostModalOpen(false)}
                onAddPost={handleAddPost}
            />

            {selectedPost && (
                <ForumPostDetailModal 
                    isOpen={!!selectedPost}
                    onClose={() => setSelectedPost(null)}
                    post={selectedPost}
                />
            )}
        </div>
    );
};

// --- Tab Button Component ---
const TabButton: React.FC<{id: SupportTab, label: string, icon: React.ElementType, activeTab: SupportTab, setActiveTab: (tab: SupportTab) => void}> = 
({ id, label, icon: Icon, activeTab, setActiveTab }) => (
    <button 
        onClick={() => setActiveTab(id)} 
        className={`py-3 px-1 border-b-2 font-semibold text-sm flex items-center gap-2 ${activeTab === id ? 'border-brand-primary text-brand-primary' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
    >
        <Icon className="w-5 h-5" /> {label}
    </button>
);

// --- Chat Support Component ---
const ChatSupport: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { sender: 'support', text: 'Hello! Welcome to AfriProperty Admin Support. How can I assist you today?' }
    ]);
    const [input, setInput] = useState('');
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        const newMessages: ChatMessage[] = [...messages, { sender: 'agent', text: input }];
        setMessages(newMessages);
        setInput('');

        setTimeout(() => {
            setMessages(prev => [...prev, { sender: 'support', text: 'Thank you for your message. An admin will review your query and get back to you shortly. Our current response time is 2-4 hours.' }]);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow p-6 space-y-4 overflow-y-auto">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex items-end gap-2 ${msg.sender === 'agent' ? 'justify-end' : ''}`}>
                        {msg.sender === 'support' && <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">S</div>}
                        <div className={`max-w-md p-3 rounded-lg ${msg.sender === 'agent' ? 'bg-brand-primary text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200'}`}>
                            <p className="text-sm">{msg.text}</p>
                        </div>
                    </div>
                ))}
                <div ref={endOfMessagesRef} />
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-b-lg">
                <div className="flex items-center gap-2">
                    <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} placeholder="Type your message..." className="w-full input" />
                    <button onClick={handleSend} className="bg-brand-primary text-white p-2.5 rounded-full hover:bg-opacity-90"><SendIcon className="w-5 h-5"/></button>
                </div>
            </div>
             <style>{`.input { @apply px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-brand-primary focus:border-brand-primary; }`}</style>
        </div>
    );
};

// --- Knowledge Base Component ---
const KnowledgeBase: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [aiTopic, setAiTopic] = useState('');
    const [generatedArticle, setGeneratedArticle] = useState<{ title: string; content: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const filteredArticles = useMemo(() => 
        KNOWLEDGE_BASE_ARTICLES.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()) || a.content.toLowerCase().includes(searchTerm.toLowerCase()))
    , [searchTerm]);
    
    const handleGenerateArticle = async () => {
        if (!aiTopic.trim()) return;
        setIsLoading(true);
        setError('');
        setGeneratedArticle(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `You are a real estate expert and content creator. Write a helpful knowledge base article for real estate agents on the topic of: "${aiTopic}". The article should be well-structured, informative, and provide actionable tips. Use a professional but approachable tone. Format the response with clear headings and paragraphs.`;
            const result = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setGeneratedArticle({ title: `AI-Generated Article: ${aiTopic}`, content: result.text });
        } catch (err) {
            console.error(err);
            setError('Failed to generate article. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">AI Article Generator</h3>
            <div className="p-4 bg-brand-light dark:bg-slate-900/50 rounded-lg flex items-center gap-2">
                <input type="text" value={aiTopic} onChange={e => setAiTopic(e.target.value)} placeholder="e.g., Tips for virtual tours..." className="w-full input" />
                <button onClick={handleGenerateArticle} disabled={isLoading} className="bg-brand-primary text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 disabled:bg-slate-400">
                    {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <CpuChipIcon className="w-5 h-5"/>}
                    Generate
                </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {generatedArticle && (
                <div className="mt-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <h4 className="font-bold text-lg mb-2 text-slate-800 dark:text-white">{generatedArticle.title}</h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{generatedArticle.content}</p>
                </div>
            )}

            <hr className="my-6 dark:border-slate-700"/>

            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Browse Articles</h3>
            <div className="relative mb-4">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search articles..." className="w-full pl-10 input" />
            </div>
            <div className="space-y-3">
                {filteredArticles.map(article => (
                    <details key={article.id} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg cursor-pointer">
                        <summary className="font-semibold text-slate-700 dark:text-slate-200">{article.title}</summary>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 pt-2 border-t border-slate-200 dark:border-slate-600">{article.content}</p>
                    </details>
                ))}
            </div>
             <style>{`.input { @apply px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-brand-primary focus:border-brand-primary; }`}</style>
        </div>
    );
};

// --- Community Forum Component ---
const CommunityForum: React.FC<{ posts: ForumPost[], onNewPost: () => void, onPostClick: (post: ForumPost) => void }> = ({ posts, onNewPost, onPostClick }) => {
    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Community Discussions</h3>
                <button onClick={onNewPost} className="bg-brand-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-opacity-90 flex-shrink-0">Create New Post</button>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[600px]">
                        <thead className="bg-slate-50 dark:bg-slate-700">
                            <tr>
                                <th className="p-3 text-left font-semibold text-slate-600 dark:text-slate-300">Topic</th>
                                <th className="p-3 text-center font-semibold text-slate-600 dark:text-slate-300">Replies</th>
                                <th className="p-3 text-center font-semibold text-slate-600 dark:text-slate-300">Views</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {posts.map(post => (
                                <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <td className="p-3">
                                        <button onClick={() => onPostClick(post)} className="font-semibold text-brand-dark dark:text-slate-100 cursor-pointer hover:underline text-left">{post.title}</button>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">by {post.author} - {new Date(post.timestamp).toLocaleDateString()}</p>
                                    </td>
                                    <td className="p-3 text-center text-slate-600 dark:text-slate-300">{post.replies}</td>
                                    <td className="p-3 text-center text-slate-600 dark:text-slate-300">{post.views}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AgentSupportPage;
