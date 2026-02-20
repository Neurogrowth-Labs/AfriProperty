

import React, { useState } from 'react';
import { CloseIcon } from './icons/NavIcons';
import { ArrowUpTrayIcon } from './icons/ActionIcons';

interface ServiceRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const availableServices = [
    'Plumbing', 'Electrical Work', 'Landscaping', 'Moving Services',
    'Home Inspection', 'Legal Services', 'Interior Design', 'Pest Control',
    'Painting', 'Roofing', 'HVAC Services', 'General Contractor'
];

const FileInput: React.FC<{ label: string; file: File | null; onFileChange: (file: File | null) => void; acceptedTypes: string }> = ({ label, file, onFileChange, acceptedTypes }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</label>
        <div className="mt-1">
            <label htmlFor={label} className="relative cursor-pointer bg-white dark:bg-slate-700 rounded-md font-medium text-brand-primary hover:text-brand-dark dark:hover:text-brand-secondary focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-primary border border-slate-300 dark:border-slate-600 p-3 flex justify-center items-center gap-2">
                <ArrowUpTrayIcon className="w-5 h-5" />
                <span>{file ? 'Change file' : 'Upload file'}</span>
                <input id={label} name={label} type="file" className="sr-only" onChange={(e) => onFileChange(e.target.files ? e.target.files[0] : null)} accept={acceptedTypes} />
            </label>
            {file && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">Selected: {file.name}</p>}
        </div>
    </div>
);

const ServiceRegistrationModal: React.FC<ServiceRegistrationModalProps> = ({ isOpen, onClose }) => {
    const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
    const [files, setFiles] = useState<Record<string, File | null>>({
        credentials: null,
        licenses: null,
        qualifications: null
    });

    const handleServiceToggle = (service: string) => {
        setSelectedServices(prev => {
            const newSet = new Set(prev);
            if (newSet.has(service)) {
                newSet.delete(service);
            } else {
                newSet.add(service);
            }
            return newSet;
        });
    };

    const handleFileChange = (key: string, file: File | null) => {
        setFiles(prev => ({ ...prev, [key]: file }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Thank you for registering! Your application will be reviewed and we will get back to you shortly.');
        onClose();
    };

    if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[110] p-4" onClick={onClose}>
        <div 
            className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" 
            onClick={e => e.stopPropagation()}
        >
            <header className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                <div>
                    <h2 className="text-xl font-bold text-brand-dark dark:text-white">Register as a Service Provider</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Join our network of trusted professionals.</p>
                </div>
                <button onClick={onClose} className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </header>
            
            <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
                <div className="p-6 space-y-6">
                    {/* Personal Details */}
                    <section>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">Personal Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Full Name</label>
                                <input type="text" required className="mt-1 w-full input" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">ID/Passport Number</label>
                                <input type="text" required className="mt-1 w-full input" />
                            </div>
                        </div>
                    </section>
                    
                    {/* Company Details */}
                     <section>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">Company Details (Optional)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Company Name</label>
                                <input type="text" className="mt-1 w-full input" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Registration Number</label>
                                <input type="text" className="mt-1 w-full input" />
                            </div>
                        </div>
                    </section>

                    {/* Contact Details */}
                    <section>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">Contact Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Phone Number</label>
                                <input type="tel" required className="mt-1 w-full input" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Email Address</label>
                                <input type="email" required className="mt-1 w-full input" />
                            </div>
                        </div>
                    </section>

                    {/* Service Selection */}
                    <section>
                         <h3 className="text-lg font-semibold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">Services Offered</h3>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {availableServices.map(service => (
                                <label key={service} className="flex items-center gap-2 p-3 border border-slate-300 dark:border-slate-600 rounded-md cursor-pointer has-[:checked]:bg-brand-light has-[:checked]:border-brand-primary">
                                    <input type="checkbox" checked={selectedServices.has(service)} onChange={() => handleServiceToggle(service)} className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"/>
                                    <span className="text-sm font-medium">{service}</span>
                                </label>
                            ))}
                         </div>
                    </section>
                    
                     {/* File Uploads */}
                    <section>
                         <h3 className="text-lg font-semibold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">Documentation</h3>
                         <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Please upload relevant documents to verify your expertise. (PDF, JPG, PNG)</p>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FileInput label="Credentials" file={files.credentials} onFileChange={(f) => handleFileChange('credentials', f)} acceptedTypes=".pdf,.jpg,.png" />
                            <FileInput label="Licenses" file={files.licenses} onFileChange={(f) => handleFileChange('licenses', f)} acceptedTypes=".pdf,.jpg,.png" />
                            <FileInput label="Qualifications" file={files.qualifications} onFileChange={(f) => handleFileChange('qualifications', f)} acceptedTypes=".pdf,.jpg,.png" />
                         </div>
                    </section>
                </div>
                <footer className="bg-slate-50 dark:bg-slate-900 p-4 rounded-b-xl flex justify-end sticky bottom-0 border-t border-slate-200 dark:border-slate-700">
                     <button type="submit" className="bg-brand-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-opacity-90 transition-all">
                        Submit Application
                    </button>
                </footer>
            </form>
        </div>
        <style>{`
            .input {
                @apply px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-brand-primary focus:border-brand-primary text-slate-800 dark:text-slate-200;
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

export default ServiceRegistrationModal;