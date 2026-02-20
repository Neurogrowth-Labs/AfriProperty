
import React, { useState, useEffect } from 'react';
import { CloseIcon } from './icons/NavIcons';
// FIX: Corrected import path from '../lib/data' to '../../lib/data'
import { authenticateUser, addUser } from '../../lib/data';
import type { User } from '../types';
import { GoogleIcon, AppleIcon } from './icons/SocialIcons';
import { EyeIcon, EyeSlashIcon, CheckIcon, ArrowUpTrayIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import { BuildingStorefrontIcon, UserIcon } from '@heroicons/react/24/solid';
import { BanknotesIcon } from './icons/ActionIcons';


export type AuthView = 'login' | 'signup' | 'userSignup' | 'agentSignup' | 'investorSignup' | 'pendingVerificationAgent' | 'pendingVerificationInvestor' | 'forgotPassword' | 'resetConfirmation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  initialView?: AuthView;
  onSwitchToPricing?: () => void;
}

// --- Helper Components ---
const InputField: React.FC<{label: string, id?: string, type?: string, value: string, name?: string, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void, icon?: React.ElementType, onIconClick?: () => void, disabled?: boolean, placeholder?: string, containerClassName?: string, note?: string, required?: boolean}> = ({ label, id, type = 'text', value, name, onChange, icon: Icon, onIconClick, disabled, placeholder, containerClassName, note, required=true }) => (
    <div className={containerClassName}>
        <label htmlFor={id || name} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
        <div className="relative">
            {type === 'textarea' ? ( <textarea id={id || name} name={name || id} value={value} onChange={onChange} disabled={disabled} placeholder={placeholder} required={required} className="input-base" rows={2}></textarea>
            ) : ( <input id={id || name} name={name || id} type={type} value={value} onChange={onChange} disabled={disabled} placeholder={placeholder} required={required} className="input-base" /> )}
            {Icon && <button type="button" onClick={onIconClick} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500"><Icon className="h-5 w-5" /></button>}
        </div>
        {note && <p className="text-xs text-slate-400 mt-1">{note}</p>}
    </div>
);

const FileInput: React.FC<{ label: string; file: File | null; onFileChange: (file: File | null) => void; acceptedTypes: string, required?: boolean }> = ({ label, file, onFileChange, acceptedTypes, required=false }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</label>
        <div className="mt-1">
            <label htmlFor={label} className="relative cursor-pointer bg-white dark:bg-slate-800 rounded-lg font-medium text-brand-primary hover:text-brand-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-slate-800 focus-within:ring-brand-primary border border-slate-300 dark:border-slate-600 p-3 flex justify-center items-center gap-2">
                <ArrowUpTrayIcon className="w-5 h-5" />
                <span className="text-sm">{file ? 'Change file' : 'Upload file'}</span>
                <input id={label} name={label} type="file" className="sr-only" onChange={(e) => onFileChange(e.target.files ? e.target.files[0] : null)} accept={acceptedTypes} required={required} />
            </label>
            {file && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">Selected: {file.name}</p>}
        </div>
    </div>
);

const Checkbox: React.FC<{id: string, name: string, checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, children: React.ReactNode}> = ({id, name, checked, onChange, children}) => (
    <label htmlFor={id} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
        <input type="checkbox" id={id} name={name} checked={checked} onChange={onChange} className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
        {children}
    </label>
);

const SocialButton: React.FC<{onClick: () => void, icon: React.ElementType, children: React.ReactNode}> = ({ onClick, icon: Icon, children }) => (
    <button type="button" onClick={onClick} className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
        <Icon className="w-5 h-5"/>{children}
    </button>
);

const SocialLogins: React.FC<{onLoginSuccess: (user: User) => void}> = ({ onLoginSuccess }) => (
    <div className="grid grid-cols-2 gap-3">
        {/* FIX: Added missing id property to fix assignability error */}
        <SocialButton onClick={() => onLoginSuccess({id: 'mock-google-id', username: 'google@example.com', fullName: 'Google User', email: 'google@example.com', role: 'user'})} icon={GoogleIcon}>Google</SocialButton>
        <SocialButton onClick={() => onLoginSuccess({id: 'mock-apple-id', username: 'apple@example.com', fullName: 'Apple User', email: 'apple@example.com', role: 'user'})} icon={AppleIcon}>Apple</SocialButton>
    </div>
);

const SignupOptionCard: React.FC<{icon: React.ElementType, title: string, description: string, onClick: () => void}> = ({ icon: Icon, title, description, onClick }) => (
    <button onClick={onClick} className="w-full text-left p-4 border border-slate-300 dark:border-slate-700 rounded-lg flex items-center gap-4 hover:bg-brand-light dark:hover:bg-slate-800 hover:border-brand-primary transition-all">
        <div className="bg-brand-light dark:bg-slate-700 p-3 rounded-lg"><Icon className="w-6 h-6 text-brand-primary"/></div>
        <div>
            <h3 className="font-bold text-slate-800 dark:text-white">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
    </button>
);

const FormSection: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <fieldset className="space-y-4">
        <legend className="text-base font-semibold text-brand-dark dark:text-white border-b border-slate-200 dark:border-slate-700 w-full pb-2 mb-2">{title}</legend>
        {children}
    </fieldset>
);

const ProgressBar: React.FC<{currentStep: number, totalSteps: number}> = ({ currentStep, totalSteps }) => (
    <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Step {currentStep} of {totalSteps}</p>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
            <div className="bg-brand-primary h-1.5 rounded-full transition-all duration-300" style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
        </div>
    </div>
);

interface PasswordCriteria { length: boolean; uppercase: boolean; lowercase: boolean; number: boolean; special: boolean; all: boolean; }
const isPasswordStrong = (password: string): PasswordCriteria => {
    const criteria = { length: password.length >= 8, uppercase: /[A-Z]/.test(password), lowercase: /[a-z]/.test(password), number: /[0-9]/.test(password), special: /[!@#$%^&*]/.test(password) };
    return { ...criteria, all: Object.values(criteria).every(v => v) };
};

const CriteriaItem: React.FC<{ label: string, met: boolean }> = ({ label, met }) => (
    <div className={`flex items-center gap-1.5 transition-colors ${met ? 'text-green-600 dark:text-green-500' : 'text-slate-400'}`}>
        <div className={`w-3.5 h-3.5 flex-shrink-0 rounded-full flex items-center justify-center ${met ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
            {met && <CheckIcon className="w-2.5 h-2.5 text-white stroke-2" />}
        </div>
        {label}
    </div>
);

const PasswordStrengthMeter: React.FC<{ criteria: PasswordCriteria }> = ({ criteria }) => (
    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <CriteriaItem label="8+ characters" met={criteria.length} />
        <CriteriaItem label="1 uppercase" met={criteria.uppercase} />
        <CriteriaItem label="1 lowercase" met={criteria.lowercase} />
        <CriteriaItem label="1 number" met={criteria.number} />
        <CriteriaItem label="1 special" met={criteria.special} />
    </div>
);

// --- Sub-components for each view ---

const LoginView: React.FC<{onLoginSuccess: (user: User) => void, onSwitchToSignup: () => void, onSwitchToForgotPassword: () => void, setError: (e: string) => void}> = ({ onLoginSuccess, onSwitchToSignup, onSwitchToForgotPassword, setError }) => {
    const [email, setEmail] = useState('peter.vdm@example.com');
    const [password, setPassword] = useState('Password123!');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const { user, error } = await authenticateUser(email, password);
        if (user) {
            onLoginSuccess(user);
        } else {
            if (error === 'pending_verification_agent' || error === 'pending_verification_investor') {
                setError("Your account is pending verification. We'll notify you upon approval.");
            } else {
                setError("Invalid email or password.");
            }
        }
    };

    return (
        <div className="space-y-4 animate-fade-in">
            <p className="text-sm text-center text-slate-500 dark:text-slate-400">Log in with a pre-created account or sign up.</p>
            <form onSubmit={handleLogin} className="space-y-4">
                 <InputField label="Email Address" id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                 <InputField label="Password" id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} icon={showPassword ? EyeSlashIcon : EyeIcon} onIconClick={() => setShowPassword(!showPassword)} />
                 
                 <div className="flex items-center justify-between">
                     <Checkbox id="rememberMe" name="rememberMe" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}>Remember me</Checkbox>
                     <button type="button" onClick={onSwitchToForgotPassword} className="text-sm font-semibold text-brand-primary hover:underline">Forgot password?</button>
                 </div>
                 
                 <button type="submit" className="btn-primary">Log In</button>
            </form>
            <div className="flex items-center text-xs text-slate-400"><div className="flex-grow border-t dark:border-slate-700"></div><span className="flex-shrink mx-4">OR</span><div className="flex-grow border-t dark:border-slate-700"></div></div>
            <SocialLogins onLoginSuccess={onLoginSuccess} />
            <p className="text-center text-sm text-slate-500 dark:text-slate-400">Don't have an account? <button onClick={onSwitchToSignup} className="font-semibold text-brand-primary hover:underline">Sign up</button></p>
        </div>
    );
};

const SignupView: React.FC<{ onSwitchToLogin: () => void; onSwitchToUserSignup: () => void; onSwitchToAgentSignup: () => void; onSwitchToInvestorSignup: () => void; }> = ({ onSwitchToLogin, onSwitchToUserSignup, onSwitchToAgentSignup, onSwitchToInvestorSignup }) => (
    <div className="animate-fade-in space-y-4">
        <p className="text-center text-slate-500 dark:text-slate-400">Choose your account type to get started.</p>
        <div className="space-y-3">
            <SignupOptionCard icon={UserIcon} title="Property Seeker" description="Browse, save, and tour properties." onClick={onSwitchToUserSignup} />
            <SignupOptionCard icon={BuildingStorefrontIcon} title="Agent / Agency" description="List and manage your properties." onClick={onSwitchToAgentSignup} />
            <SignupOptionCard icon={BanknotesIcon} title="Investor" description="Access exclusive investment deals." onClick={onSwitchToInvestorSignup} />
        </div>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 pt-2">Already have an account? <button onClick={onSwitchToLogin} className="font-semibold text-brand-primary hover:underline">Log In</button></p>
    </div>
);

const UserSignupView: React.FC<{onSignupSuccess: (user: User) => void, onSwitchToLogin: () => void, setError: (e: string) => void}> = ({ onSignupSuccess, onSwitchToLogin, setError }) => {
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', agreeToTerms: false });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting || cooldown > 0) return;
        
        setError('');
        if (!isPasswordStrong(formData.password).all) { setError("Password doesn't meet requirements."); return; }
        if (!formData.agreeToTerms) { setError("You must agree to the Terms & Conditions."); return; }

        setIsSubmitting(true);
        // FIX: Added missing id property to fix assignability error
        const newUser: User = { id: Math.random().toString(), username: formData.email, fullName: formData.fullName, email: formData.email, password: formData.password, role: 'user' };
        const result = await addUser(newUser);
        setIsSubmitting(false);

        if (result.success) {
            onSignupSuccess(newUser);
        } else {
            setError(result.message);
            // If it's a rate limit error, set a cooldown
            if (result.message.toLowerCase().includes('rate limit')) {
                setCooldown(60); // 1 minute cooldown
            }
        }
    };

    return (
        <form onSubmit={handleSignup} className="space-y-4 animate-fade-in">
             <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} disabled={isSubmitting} />
             <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} disabled={isSubmitting} />
             <InputField label="Password" name="password" type="password" value={formData.password} onChange={handleInputChange} disabled={isSubmitting} />
             <PasswordStrengthMeter criteria={isPasswordStrong(formData.password)} />
             <Checkbox id="agreeToTerms" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleInputChange}>I agree to the <a href="#" target="_blank" className="font-semibold text-brand-primary hover:underline">Terms & Conditions</a>.</Checkbox>
            <button type="submit" className="btn-primary" disabled={isSubmitting || cooldown > 0}>
                {isSubmitting ? 'Creating Account...' : cooldown > 0 ? `Please wait ${cooldown}s` : 'Create Account'}
            </button>
            <p className="text-center text-sm text-slate-500 dark:text-slate-400">Already have an account? <button type="button" onClick={onSwitchToLogin} className="font-semibold text-brand-primary hover:underline">Log In</button></p>
        </form>
    );
};

const AgentSignupView: React.FC<{ onSignupSuccess: () => void, onSwitchToLogin: () => void, setError: (e: string) => void }> = ({ onSignupSuccess, onSwitchToLogin, setError }) => {
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', phone: '', officeAddress: '', businessRegNumber: '', agentLicense: '', agreeToTerms: false });
    const [idDoc, setIdDoc] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting || cooldown > 0) return;

        setError('');
        if (!isPasswordStrong(formData.password).all) { setError("Password doesn't meet requirements."); return; }
        if (!idDoc) { setError("Please upload your ID or Business Certificate for verification."); return; }
        if (!formData.agreeToTerms) { setError("You must agree to the Agent Terms & Conditions."); return; }
        
        setIsSubmitting(true);
        // FIX: Added missing id property to fix assignability error
        const newAgent: User = { id: Math.random().toString(), username: formData.email, fullName: formData.fullName, email: formData.email, password: formData.password, role: 'agent', phone: formData.phone, officeAddress: formData.officeAddress, businessRegNumber: formData.businessRegNumber, agentLicense: formData.agentLicense, idDocumentUrl: idDoc.name };
        const result = await addUser(newAgent);
        setIsSubmitting(false);

        if (result.success) {
            onSignupSuccess();
        } else {
            setError(result.message);
            if (result.message.toLowerCase().includes('rate limit')) {
                setCooldown(60);
            }
        }
    };
    
    return (
         <form onSubmit={handleSignup} className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 animate-fade-in">
            <FormSection title="Account Details">
                <InputField label="Full Name / Agency Name" name="fullName" value={formData.fullName} onChange={handleInputChange} disabled={isSubmitting} />
                <InputField label="Contact Email" name="email" type="email" value={formData.email} onChange={handleInputChange} disabled={isSubmitting} />
                <InputField label="Password" name="password" type="password" value={formData.password} onChange={handleInputChange} disabled={isSubmitting} />
                <PasswordStrengthMeter criteria={isPasswordStrong(formData.password)} />
            </FormSection>
            <FormSection title="Business Information">
                <InputField label="Contact Phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} disabled={isSubmitting} />
                <InputField label="Office Address" name="officeAddress" value={formData.officeAddress} onChange={handleInputChange} disabled={isSubmitting} />
                <InputField label="Business Reg. Number" name="businessRegNumber" value={formData.businessRegNumber} onChange={handleInputChange} note="(Optional for individuals)" required={false} disabled={isSubmitting} />
            </FormSection>
            <FormSection title="Verification">
                <FileInput label="ID or Business Certificate" file={idDoc} onFileChange={setIdDoc} acceptedTypes=".pdf,.jpg,.png" required />
            </FormSection>
            
            <Checkbox id="agreeToTerms" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleInputChange}>I agree to the <a href="#" target="_blank" className="font-semibold text-brand-primary hover:underline">Agent Terms & Conditions</a>.</Checkbox>
            <button type="submit" className="w-full btn-primary" disabled={isSubmitting || cooldown > 0}>
                {isSubmitting ? 'Submitting...' : cooldown > 0 ? `Please wait ${cooldown}s` : 'Submit for Verification'}
            </button>
            <p className="text-center text-sm text-slate-500 dark:text-slate-400">Already have an account? <button type="button" onClick={onSwitchToLogin} className="font-semibold text-brand-primary hover:underline">Log In</button></p>
        </form>
    );
};

const InvestorSignupView: React.FC<{ onSignupSuccess: () => void, setError: (e: string) => void, onSwitchToLogin: () => void }> = ({ onSignupSuccess, setError, onSwitchToLogin }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', phone: '', investmentType: 'Individual', companyName: '', agreeToTerms: false });
    const [idDoc, setIdDoc] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleNext = () => {
        if (step === 1 && !isPasswordStrong(formData.password).all) { setError("Password doesn't meet requirements."); return; }
        setError('');
        setStep(step + 1);
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting || cooldown > 0) return;

        setError('');
        if (!idDoc) { setError("Please upload your Proof of Identity."); return; }
        if (!formData.agreeToTerms) { setError("You must agree to the Investor Terms & Conditions."); return; }

        setIsSubmitting(true);
        // FIX: Added missing id property to fix assignability error
        const newInvestor: User = { id: Math.random().toString(), username: formData.email, fullName: formData.fullName, email: formData.email, password: formData.password, role: 'investor', phone: formData.phone, investmentType: formData.investmentType as 'Individual' | 'Corporate', companyName: formData.companyName, proofOfIdentityUrl: idDoc.name };
        const result = await addUser(newInvestor);
        setIsSubmitting(false);

        if (result.success) {
            onSignupSuccess();
        } else {
            setError(result.message);
            if (result.message.toLowerCase().includes('rate limit')) {
                setCooldown(60);
                setStep(1); // Go back to step 1 so they can see the error clearly if they scroll
            }
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} disabled={isSubmitting} />
                        <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} disabled={isSubmitting} />
                        <InputField label="Password" name="password" type="password" value={formData.password} onChange={handleInputChange} disabled={isSubmitting} />
                        <PasswordStrengthMeter criteria={isPasswordStrong(formData.password)} />
                        <div className="flex justify-end"><button type="button" onClick={handleNext} className="btn-primary w-auto" disabled={isSubmitting}>Next</button></div>
                    </div>
                );
            case 2:
                return (
                     <div className="space-y-4">
                        <InputField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} disabled={isSubmitting} />
                        <div><label className="block text-sm font-medium dark:text-slate-300">Investment Type</label><select name="investmentType" value={formData.investmentType} onChange={handleInputChange} disabled={isSubmitting} className="w-full input-base mt-1"><option>Individual</option><option>Corporate</option></select></div>
                        {formData.investmentType === 'Corporate' && <InputField label="Company Name" name="companyName" value={formData.companyName} onChange={handleInputChange} disabled={isSubmitting} />}
                        <div className="flex justify-between"><button type="button" onClick={() => setStep(1)} className="btn-secondary w-auto" disabled={isSubmitting}>Back</button><button type="button" onClick={() => setStep(3)} className="btn-primary w-auto" disabled={isSubmitting}>Next</button></div>
                    </div>
                );
            case 3:
                return (
                     <div className="space-y-4">
                        <FileInput label="Proof of Identity (ID/Passport)" file={idDoc} onFileChange={setIdDoc} acceptedTypes=".pdf,.jpg,.png" required />
                        <Checkbox id="agreeToTerms" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleInputChange}>I agree to the <a href="#" target="_blank" className="font-semibold text-brand-primary hover:underline">Investor Terms & Conditions</a>.</Checkbox>
                        <div className="flex justify-between"><button type="button" onClick={() => setStep(2)} className="btn-secondary w-auto" disabled={isSubmitting}>Back</button><button type="submit" className="btn-primary w-auto" disabled={isSubmitting || !formData.agreeToTerms || cooldown > 0}>
                            {isSubmitting ? 'Submitting...' : cooldown > 0 ? `Wait ${cooldown}s` : 'Submit Application'}
                        </button></div>
                    </div>
                );
        }
    }

    return (
        <form onSubmit={handleSignup} className="max-h-[60vh] overflow-y-auto pr-2">
            <ProgressBar currentStep={step} totalSteps={3} />
            <div key={step} className="animate-fade-in mt-6">
                {renderStep()}
            </div>
            <p className="text-center text-sm mt-6 text-slate-500 dark:text-slate-400">Already have an account? <button type="button" onClick={onSwitchToLogin} className="font-semibold text-brand-primary hover:underline">Log In</button></p>
        </form>
    );
};

const PendingVerificationView: React.FC<{ onSwitchToLogin: () => void, userType: 'agent' | 'investor' }> = ({ onSwitchToLogin, userType }) => (
    <div className="text-center space-y-4 animate-fade-in">
        <CheckBadgeIcon className="w-16 h-16 text-green-500 mx-auto" />
        <p className="text-slate-600 dark:text-slate-300">Thank you for registering as an {userType}! Your application is now under review. We will notify you via email once your account has been approved. This typically takes 1-2 business days.</p>
        <button onClick={onSwitchToLogin} className="w-full btn-primary">Back to Login</button>
    </div>
);

const ForgotPasswordView: React.FC<{ onResetSent: () => void, onBackToLogin: () => void }> = ({ onResetSent, onBackToLogin }) => {
    const [email, setEmail] = useState('');
    const handleReset = (e: React.FormEvent) => { e.preventDefault(); onResetSent(); };

    return (
        <div className="space-y-4 animate-fade-in">
            <p className="text-sm text-slate-500 dark:text-slate-400">Enter your email and we'll send a link to reset your password.</p>
            <form onSubmit={handleReset} className="space-y-4">
                <InputField label="Email Address" id="reset-email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                <button type="submit" className="w-full btn-primary">Send Reset Link</button>
            </form>
            <p className="text-center"><button onClick={onBackToLogin} className="text-sm font-semibold text-brand-primary hover:underline">&larr; Back to Login</button></p>
        </div>
    );
};

const ResetConfirmationView: React.FC<{ onSwitchToLogin: () => void }> = ({ onSwitchToLogin }) => (
    <div className="space-y-4 text-center animate-fade-in">
        <p className="text-slate-600 dark:text-slate-300">If an account with that email exists, a password reset link has been sent. Please check your inbox.</p>
        <button onClick={onSwitchToLogin} className="font-semibold text-brand-primary hover:underline">&larr; Back to Login</button>
    </div>
);

// Main AuthModal component
export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, initialView, onSwitchToPricing }) => {
    const [view, setView] = useState<AuthView>(initialView || 'login');
    const [error, setError] = useState('');
    
    const handleLoginSuccess = (user: User) => {
        onLogin(user);
    };
    
    const switchView = (targetView: AuthView) => {
        setError('');
        setView(targetView);
    };
    
    useEffect(() => {
        if(isOpen) {
            setView(initialView || 'login');
            setError('');
        }
    }, [isOpen, initialView]);

    if (!isOpen) return null;
    
    const titles: Record<AuthView, string> = {
        login: 'Welcome Back',
        signup: 'Join AfriProperty',
        userSignup: 'Create Your Account',
        agentSignup: 'Agent & Agency Registration',
        investorSignup: 'Investor Registration',
        pendingVerificationAgent: 'Application Received',
        pendingVerificationInvestor: 'Application Received',
        forgotPassword: 'Reset Your Password',
        resetConfirmation: 'Check Your Email'
    };
    
    const currentTitle = titles[view] || 'Welcome';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] p-4 animate-fade-in" onClick={onClose}>
        <div 
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 opacity-0 animate-fade-in-scale" 
            onClick={e => e.stopPropagation()}
        >
            <header className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-bold text-brand-dark dark:text-white">
                    {currentTitle}
                </h2>
                <button onClick={onClose} className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </header>
            
            <div className="p-6 max-h-[75vh] overflow-y-auto">
                {error && (
                    <div className={`px-4 py-3 rounded-md relative mb-4 text-sm font-medium ${error.toLowerCase().includes('rate limit') ? 'bg-amber-100 border border-amber-400 text-amber-800' : 'bg-red-100 border border-red-400 text-red-700'}`} role="alert">
                        {error}
                    </div>
                )}

                {view === 'login' && <LoginView onLoginSuccess={handleLoginSuccess} onSwitchToSignup={() => switchView('signup')} onSwitchToForgotPassword={() => switchView('forgotPassword')} setError={setError} />}
                {view === 'signup' && <SignupView onSwitchToLogin={() => switchView('login')} onSwitchToUserSignup={() => switchView('userSignup')} onSwitchToAgentSignup={() => switchView('agentSignup')} onSwitchToInvestorSignup={() => switchView('investorSignup')} />}
                {view === 'userSignup' && <UserSignupView onSignupSuccess={handleLoginSuccess} onSwitchToLogin={() => switchView('login')} setError={setError} />}
                {view === 'agentSignup' && <AgentSignupView onSignupSuccess={() => switchView('pendingVerificationAgent')} onSwitchToLogin={() => switchView('login')} setError={setError} />}
                {view === 'investorSignup' && <InvestorSignupView onSignupSuccess={() => switchView('pendingVerificationInvestor')} setError={setError} onSwitchToLogin={() => switchView('login')} />}
                {view === 'pendingVerificationAgent' && <PendingVerificationView onSwitchToLogin={() => switchView('login')} userType="agent" />}
                {view === 'pendingVerificationInvestor' && <PendingVerificationView onSwitchToLogin={() => switchView('login')} userType="investor" />}
                {view === 'forgotPassword' && <ForgotPasswordView onResetSent={() => switchView('resetConfirmation')} onBackToLogin={() => switchView('login')} />}
                {/* FIX: Fixed typo in component call where extraneous text was causing a type error. */}
                {view === 'resetConfirmation' && <ResetConfirmationView onSwitchToLogin={() => switchView('login')} />}
            </div>
        </div>
        <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes fadeInScale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
            .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
            .animate-fade-in-scale { animation: fadeInScale 0.3s ease-out forwards; }
            
            .input-base {
                @apply w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-slate-800 dark:text-slate-200 transition-colors placeholder:text-slate-400 disabled:bg-slate-100 dark:disabled:bg-slate-800;
            }
            .btn-primary {
                @apply w-full bg-brand-primary text-white px-5 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed transform hover:scale-[1.02];
            }
            .btn-secondary {
                @apply bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-5 py-3 rounded-lg font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all;
            }
        `}</style>
    </div>
  );
};
