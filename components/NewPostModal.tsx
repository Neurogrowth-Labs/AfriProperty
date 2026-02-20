

import React, { useState } from 'react';
import { CloseIcon } from './icons/NavIcons';

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPost: (post: { title: string, content: string }) => void;
}

const NewPostModal: React.FC<NewPostModalProps> = ({ isOpen, onClose, onAddPost }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;
        onAddPost({ title, content });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[120] p-4" onClick={onClose}>
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" 
                onClick={e => e.stopPropagation()}
            >
                <header className="flex justify-between items-center p-5 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-brand-dark">Create New Forum Post</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 transition-colors">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </header>
                
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="post-title" className="block text-sm font-medium text-slate-700 mb-1">Post Title</label>
                            <input
                                type="text"
                                id="post-title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"
                            />
                        </div>
                        <div>
                            <label htmlFor="post-content" className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                            <textarea
                                id="post-content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                rows={5}
                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-brand-primary focus:border-brand-primary resize-none"
                            />
                        </div>
                    </div>

                    <footer className="bg-slate-50 p-4 rounded-b-xl flex justify-end">
                         <button 
                            type="submit"
                            className="bg-brand-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-opacity-90"
                        >
                            Publish Post
                        </button>
                    </footer>
                </form>
            </div>
            <style>{`
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

export default NewPostModal;