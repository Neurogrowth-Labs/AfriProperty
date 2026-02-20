
import React from 'react';
import type { BlogPost } from '../types';
import { useTranslations } from '../contexts/LanguageContext';

interface BlogSectionProps {
    posts: BlogPost[];
    onPostClick: (post: BlogPost) => void;
    isLoading: boolean;
    // FIX: Added missing error prop to BlogSectionProps
    error?: string | null;
}

const BlogCardSkeleton: React.FC = () => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden animate-pulse border border-slate-200 dark:border-white">
        <div className="w-full h-56 bg-slate-200 dark:bg-slate-700"></div>
        <div className="p-6">
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-full mb-1"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4"></div>
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
        </div>
    </div>
);

const BlogSection: React.FC<BlogSectionProps> = ({ posts, onPostClick, isLoading, error }) => {
    const { t } = useTranslations();

    return (
        <section id="blog" className="py-12 lg:py-16 bg-white dark:bg-slate-900">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-brand-dark dark:text-white">{t.blog.title}</h2>
                    <p className="text-center text-slate-500 dark:text-slate-400 mt-4 max-w-2xl mx-auto">
                        {t.blog.subtitle}
                    </p>
                </div>
                
                {/* FIX: Added error display to BlogSection component */}
                {error ? (
                    <div className="max-w-2xl mx-auto p-6 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800 text-center">
                        <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {isLoading ? (
                            [...Array(3)].map((_, i) => <BlogCardSkeleton key={i} />)
                        ) : (
                            posts.map((post) => (
                                <div key={post.title} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col border border-slate-200 dark:border-white">
                                    <div className="relative overflow-hidden">
                                        <img src={post.image} alt={post.title} className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-lg font-bold text-brand-dark dark:text-white mb-2">{post.title}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">By {post.author} on {post.date}</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-300 flex-grow">{post.summary}</p>
                                        <button onClick={() => onPostClick(post)} className="font-semibold text-brand-primary hover:text-brand-dark dark:hover:text-brand-secondary transition-colors mt-4 self-start">
                                            Read More &rarr;
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default BlogSection;
