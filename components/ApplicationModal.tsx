import React, { useState } from 'react';
import { CloseIcon } from './icons/NavIcons';
import { ArrowUpTrayIcon } from './icons/ActionIcons';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  onSubmit: () => void;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({ isOpen, onClose, jobTitle, onSubmit }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [coverLetter, setCoverLetter] = useState('');
    const [cvFile, setCvFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCvFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!cvFile) {
            alert('Please upload your CV.');
            return;
        }
        // In a real app, you would handle the form data submission (e.g., via API call)
        console.log({
            name,
            email,
            coverLetter,
            cv: cvFile.name,
        });
        onSubmit();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[110] p-4" onClick={onClose}>
            <div 
                className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" 
                onClick={e => e.stopPropagation()}
            >
                <header className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700">
                    <div>
                        <h2 className="text-xl font-bold text-brand-dark dark:text-white">Apply for Position</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{jobTitle}</p>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </header>
                
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Full Name</label>
                            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-full input" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Email Address</label>
                            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 w-full input" />
                        </div>
                        <div>
                            <label htmlFor="coverLetter" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Cover Letter (Optional)</label>
                            <textarea id="coverLetter" value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} rows={5} className="mt-1 w-full input resize-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Upload CV</label>
                            <div className="mt-1">
                                <label htmlFor="cv-upload" className="relative cursor-pointer bg-white dark:bg-slate-700 rounded-md font-medium text-brand-primary hover:text-brand-dark dark:hover:text-brand-secondary focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-primary border border-slate-300 dark:border-slate-600 p-4 flex justify-center items-center gap-2">
                                    <ArrowUpTrayIcon className="w-6 h-6" />
                                    <span>{cvFile ? 'Change file' : 'Upload a file'}</span>
                                    <input id="cv-upload" name="cv-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx" required />
                                </label>
                                {cvFile && <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Selected file: {cvFile.name}</p>}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">PDF, DOC, DOCX up to 10MB.</p>
                        </div>
                    </div>

                    <footer className="bg-slate-50 dark:bg-slate-900 p-4 rounded-b-xl flex justify-end">
                         <button 
                            type="submit"
                            className="bg-brand-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300"
                        >
                            Submit Application
                        </button>
                    </footer>
                </form>
            </div>
            <style>{`
                .input {
                    @apply px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-brand-primary focus:border-brand-primary;
                }
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

export default ApplicationModal;