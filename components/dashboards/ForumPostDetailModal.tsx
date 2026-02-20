

import React, { useState, useEffect, useRef } from 'react';
import type { ForumPost } from '../types';
import { CloseIcon, SendIcon } from './icons/NavIcons';
import { HeartIcon, HeartIconSolid, ChatBubbleLeftRightIcon, ShareIcon, LinkIcon, CheckIcon } from './icons/ActionIcons';
import { FacebookIcon, TwitterIcon, WhatsAppIcon } from './icons/SocialIcons';


interface Comment {
    author: string;
    text: string;
    timestamp: number;
}

interface ForumPostDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: ForumPost;
}

const ShareMenu: React.FC<{ postTitle: string }> = ({ postTitle }) => {
  const [copied, setCopied] = useState(false);
  const postUrl = window.location.href; // Mock URL for sharing

  const shareText = `Check out this discussion on AfriProperty: ${postTitle}`;
  
  const socialLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}&quote=${encodeURIComponent(shareText)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(shareText)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${postUrl}`)}`
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(postUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleSocialClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200/80 dark:border-slate-700 py-2 z-20 animate-fade-in-up-sm">
        <button onClick={(e) => handleSocialClick(e, socialLinks.facebook)} className="share-button">
            <FacebookIcon className="w-5 h-5" /><span>Facebook</span>
        </button>
        <button onClick={(e) => handleSocialClick(e, socialLinks.twitter)} className="share-button">
            <TwitterIcon className="w-5 h-5" /><span>Twitter</span>
        </button>
        <button onClick={(e) => handleSocialClick(e, socialLinks.whatsapp)} className="share-button">
            <WhatsAppIcon className="w-5 h-5" /><span>WhatsApp</span>
        </button>
        <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
        <button onClick={handleCopy} className="share-button">
            {copied ? <><CheckIcon className="w-5 h-5 text-green-500"/><span>Copied!</span></> : <><LinkIcon className="w-5 h-5" /><span>Copy Link</span></>}
        </button>
    </div>
  );
};

const ForumPostDetailModal: React.FC<ForumPostDetailModalProps> = ({ isOpen, onClose, post }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50)); // Mock initial likes
    const [comments, setComments] = useState<Comment[]>([ // Mock comments
        { author: 'Jane Doe', text: 'Great question! I\'ve had good luck with Hubspot\'s free tier.', timestamp: Date.now() - 1 * 60 * 60 * 1000 },
        { author: 'Susan Miller', text: 'I agree with Jane, but also check out Zoho. It has a pretty generous free plan as well.', timestamp: Date.now() - 30 * 60 * 1000 }
    ]);
    const [newComment, setNewComment] = useState('');
    const [isShareOpen, setIsShareOpen] = useState(false);
    const shareRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (shareRef.current && !shareRef.current.contains(event.target as Node)) {
                setIsShareOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!isOpen) return null;

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    };

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        const comment: Comment = {
            author: 'You', // In a real app, this would be the current user
            text: newComment,
            timestamp: Date.now(),
        };
        setComments(prev => [...prev, comment]);
        setNewComment('');
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[120] p-4" onClick={onClose}>
            <div 
                className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" 
                onClick={e => e.stopPropagation()}
            >
                <header className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-brand-dark dark:text-white">{post.title}</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">by {post.author} on {new Date(post.timestamp).toLocaleDateString()}</p>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </header>
                
                <div className="flex-grow p-6 space-y-6 overflow-y-auto">
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{post.content}</p>

                    <div className="flex items-center gap-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <button onClick={handleLike} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-brand-secondary">
                            {isLiked ? <HeartIconSolid className="w-5 h-5 text-red-500" /> : <HeartIcon className="w-5 h-5" />}
                            <span className="font-semibold text-sm">{likeCount} Likes</span>
                        </button>
                        <button className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-brand-secondary">
                            <ChatBubbleLeftRightIcon className="w-5 h-5" />
                            <span className="font-semibold text-sm">{comments.length} Comments</span>
                        </button>
                         <div className="relative" ref={shareRef}>
                            <button onClick={() => setIsShareOpen(p => !p)} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-brand-secondary">
                                <ShareIcon className="w-5 h-5" />
                                <span className="font-semibold text-sm">Share</span>
                            </button>
                            {isShareOpen && <ShareMenu postTitle={post.title} />}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold text-slate-800 dark:text-white">Comments</h3>
                        {comments.map((comment, i) => (
                             <div key={i} className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-bold flex-shrink-0">{comment.author.charAt(0)}</div>
                                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg flex-grow">
                                    <p className="font-semibold text-sm text-slate-800 dark:text-white">{comment.author}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{comment.text}</p>
                                    <p className="text-xs text-slate-400 mt-2 text-right">{new Date(comment.timestamp).toLocaleTimeString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <footer className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-b-xl border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
                     <form onSubmit={handleAddComment} className="flex items-center gap-2">
                        <input 
                            type="text" 
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            placeholder="Write a comment..." 
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-brand-primary focus:border-brand-primary bg-white dark:bg-slate-900" 
                        />
                        <button type="submit" className="bg-brand-primary text-white p-2.5 rounded-full hover:bg-opacity-90 disabled:bg-slate-400" disabled={!newComment.trim()}>
                            <SendIcon className="w-5 h-5"/>
                        </button>
                    </form>
                </footer>
            </div>
            <style>
                {`@keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                  }
                  .animate-fade-in-scale {
                    animation: fadeInScale 0.3s ease-out forwards;
                  }
                  .share-button { @apply w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3; }
                  @keyframes fadeInUpSm { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                  .animate-fade-in-up-sm { animation: fadeInUpSm 0.2s ease-out forwards; }
                  `}
            </style>
        </div>
    );
};

export default ForumPostDetailModal;