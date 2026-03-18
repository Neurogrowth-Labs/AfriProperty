
import React, { useState, useEffect } from 'react';
import { CloseIcon } from './icons/NavIcons';
import { authenticateUser, addUser, resendConfirmationEmail } from '../lib/data';
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
        <label htmlFor={id || name} className="block text-sm font-bold text-slate-800 dark:text-slate-100 mb-1.5">{label}</label>
        <div className="relative">
            {type === 'textarea' ? ( 
                <textarea id={id || name} name={name || id} value={value} onChange={onChange} disabled={disabled} placeholder={placeholder} required={required} className="input-base" rows={2}></textarea>
            ) : ( 
                <input id={id || name} name={name || id} type={type} value={value} onChange={onChange} disabled={disabled} placeholder={placeholder} required={required} className="input-base" /> 
            )}
            {Icon && <button type="button" onClick={onIconClick} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-brand-primary transition-colors"><Icon className="h-5 w-5" /></button>}
        </div>
        {note && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">{note}</p>}
    </div>
);

const FileInput: React.FC<{ label: string; file: File | null; onFileChange: (file: File | null) => void; acceptedTypes: string, required?: boolean }> = ({ label, file, onFileChange, acceptedTypes, required=false }) => (
    <div>
        <label className="block text-sm font-bold text-slate-800 dark:text-slate-100 mb-1.5">{label}</label>
        <div className="mt-1">
            <label htmlFor={label} className="relative cursor-pointer bg-white dark:bg-slate-800 rounded-lg font-bold text-brand-primary hover:text-brand-secondary focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-primary border-2 border-slate-300 dark:border-slate-600 p-4 flex justify-center items-center gap-2 transition-all">
                <ArrowUpTrayIcon className="w-5 h-5" />
                <span className="text-sm">{file ? 'Change file' : 'Upload file'}</span>
                <input id={label} name={label} type="file" className="sr-only" onChange={(e) => onFileChange(e.target.files ? e.target.files[0] : null)} accept={acceptedTypes} required={required} />
            </label>
            {file && <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium truncate">Selected: {file.name}</p>}
        </div>
    </div>
);

const Checkbox: React.FC<{id: string, name: string, checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, children: React.ReactNode}> = ({id, name, checked, onChange, children}) => (
    <label htmlFor={id} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
        <input type="checkbox" id={id} name={name} checked={checked} onChange={onChange} className="h-4.5 w-4.5 rounded border-slate-300 text-brand-primary focus:ring-brand-primary transition-all cursor-pointer" />
        {children}
    </label>
);

const SocialButton: React.FC<{onClick: () => void, icon: React.ElementType, children: React.ReactNode}> = ({ onClick, icon: Icon, children }) => (
    <button type="button" onClick={onClick} className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all">
        <Icon className="w-5 h-5"/>{children}
    </button>
);

const SocialLogins: React.FC<{onLoginSuccess: (user: User) => void}> = ({ onLoginSuccess }) => (
    <div className="grid grid-cols-2 gap-3">
        <SocialButton onClick={() => onLoginSuccess({id: 'mock-google-id', username: 'google@example.com', fullName: 'Google User', email: 'google@example.com', role: 'user'})} icon={GoogleIcon}>Google</SocialButton>
        <SocialButton onClick={() => onLoginSuccess({id: 'mock-apple-id', username: 'apple@example.com', fullName: 'Apple User', email: 'apple@example.com', role: 'user'})} icon={AppleIcon}>Apple</SocialButton>
    </div>
);

const SignupOptionCard: React.FC<{icon: React.ElementType, title: string, description: string, onClick: () => void}> = ({ icon: Icon, title, description, onClick }) => (
    <button onClick={onClick} className="w-full text-left p-5 border-2 border-slate-200 dark:border-slate-700 rounded-xl flex items-center gap-4 hover:bg-brand-light dark:hover:bg-slate-800 hover:border-brand-primary transition-all group">
        <div className="bg-brand-light dark:bg-slate-700 p-3 rounded-xl group-hover:bg-brand-primary group-hover:text-white transition-colors">
            <Icon className="w-6 h-6 text-brand-primary group-hover:text-white"/>
        </div>
        <div>
            <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{description}</p>
        </div>
    </button>
);

const FormSection: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <fieldset className="space-y-4">
        <legend className="text-sm font-bold text-brand-primary dark:text-brand-accent uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 w-full pb-2 mb-4">{title}</legend>
        {children}
    </fieldset>
);

const ProgressBar: React.FC<{currentStep: number, totalSteps: number}> = ({ currentStep, totalSteps }) => (
    <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
            <p className="text-xs font-black text-brand-primary uppercase tracking-tighter">Registration Progress</p>
            <p className="text-xs font-bold text-slate-500">Step {currentStep} of {totalSteps}</p>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div className="bg-brand-primary h-2 rounded-full transition-all duration-500 ease-out shadow-sm shadow-brand-primary/20" style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
        </div>
    </div>
);

interface PasswordCriteria { length: boolean; uppercase: boolean; lowercase: boolean; number: boolean; special: boolean; all: boolean; }
const isPasswordStrong = (password: string): PasswordCriteria => {
    const criteria = { length: password.length >= 8, uppercase: /[A-Z]/.test(password), lowercase: /[a-z]/.test(password), number: /[0-9]/.test(password), special: /[!@#$%^&*]/.test(password) };
    return { ...criteria, all: Object.values(criteria).every(v => v) };
};

const CriteriaItem: React.FC<{ label: string, met: boolean }> = ({ label, met }) => (
    <div className={`flex items-center gap-1.5 transition-colors ${met ? 'text-emerald-600 dark:text-emerald-500' : 'text-slate-400'}`}>
        <div className={`w-4 h-4 flex-shrink-0 rounded-full flex items-center justify-center ${met ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
            {met && <CheckIcon className="w-2.5 h-2.5 text-white stroke-[4]" />}
        </div>
        <span className="font-semibold">{label}</span>
    </div>
);

const PasswordStrengthMeter: React.FC<{ criteria: PasswordCriteria }> = ({ criteria }) => (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Password Security</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
            <CriteriaItem label="8+ characters" met={criteria.length} />
            <CriteriaItem label="1 uppercase" met={criteria.uppercase} />
            <CriteriaItem label="1 lowercase" met={criteria.lowercase} />
            <CriteriaItem label="1 number" met={criteria.number} />
            <CriteriaItem label="1 special" met={criteria.special} />
        </div>
    </div>
);

// --- Sub-components for each view ---

const LoginView: React.FC<{onLoginSuccess: (user: User) => void, onSwitchToSignup: () => void, onSwitchToForgotPassword: () => void, setError: (e: string) => void}> = ({ onLoginSuccess, onSwitchToSignup, onSwitchToForgotPassword, setError }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setResendSuccess('');

        const { user, error, errorCode } = await authenticateUser(email, password);
        if (user) {
            onLoginSuccess(user);
        } else {
            const isUnconfirmed = errorCode === 'email_not_confirmed' || 
                                (error && error.toLowerCase().includes('email not confirmed'));
            
            if (isUnconfirmed) {
                setError("Your email is not confirmed. Please check your inbox or click below to resend.");
            } else {
                setError(error || "Invalid email or password.");
            }
        }
    };

    const handleResendEmail = async () => {
        if (!email) {
            setError("Please enter your email address first.");
            return;
        }
        setIsResending(true);
        setError('');
        const { success, message } = await resendConfirmationEmail(email);
        if (success) {
            setResendSuccess(message);
        } else {
            setError(message);
        }
        setIsResending(false);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Log in with your credentials or social account.</p>
            </div>
            
            {resendSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckIcon className="w-4 h-4" />
                    {resendSuccess}
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
                 <InputField label="Email Address" id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" />
                 <InputField label="Password" id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} icon={showPassword ? EyeSlashIcon : EyeIcon} onIconClick={() => setShowPassword(!showPassword)} placeholder="••••••••" />
                 
                 <div className="flex items-center justify-between">
                     <Checkbox id="rememberMe" name="rememberMe" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}>Remember me</Checkbox>
                     <button type="button" onClick={onSwitchToForgotPassword} className="text-sm font-bold text-brand-primary hover:text-brand-secondary transition-colors">Forgot password?</button>
                 </div>
                 
                 <button type="submit" className="btn-primary py-3.5">Log In</button>
            </form>

            <div className="text-center">
                <button 
                    type="button" 
                    onClick={handleResendEmail} 
                    disabled={isResending}
                    className="text-xs font-bold text-slate-500 hover:text-brand-primary transition-colors underline underline-offset-4"
                >
                    {isResending ? 'Sending...' : "Didn't receive confirmation email? Resend"}
                </button>
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-900 px-3 text-slate-500 font-bold tracking-widest">OR</span></div>
            </div>
            <SocialLogins onLoginSuccess={onLoginSuccess} />
            <p className="text-center text-sm text-slate-600 dark:text-slate-400 font-medium">Don't have an account? <button onClick={onSwitchToSignup} className="font-bold text-brand-primary hover:text-brand-secondary underline decoration-2 underline-offset-4">Create Account</button></p>
        </div>
    );
};

const SignupView: React.FC<{ onSwitchToLogin: () => void; onSwitchToUserSignup: () => void; onSwitchToAgentSignup: () => void; onSwitchToInvestorSignup: () => void; }> = ({ onSwitchToLogin, onSwitchToUserSignup, onSwitchToAgentSignup, onSwitchToInvestorSignup }) => (
    <div className="animate-fade-in space-y-6">
        <p className="text-center font-medium text-slate-500 dark:text-slate-400">Select the account type that best describes you.</p>
        <div className="space-y-3">
            <SignupOptionCard icon={UserIcon} title="Property Seeker" description="Browse, save, and schedule tours." onClick={onSwitchToUserSignup} />
            <SignupOptionCard icon={BuildingStorefrontIcon} title="Real Estate Agent" description="List properties and manage leads." onClick={onSwitchToAgentSignup} />
            <SignupOptionCard icon={BanknotesIcon} title="Investor" description="Access high-yield exclusive deals." onClick={onSwitchToInvestorSignup} />
        </div>
        <p className="text-center text-sm text-slate-600 dark:text-slate-400 pt-2 font-medium">Already registered? <button onClick={onSwitchToLogin} className="font-bold text-brand-primary hover:text-brand-secondary transition-colors">Log In</button></p>
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting || cooldown > 0) return;
        
        setError('');
        if (!isPasswordStrong(formData.password).all) { setError("Password doesn't meet security requirements."); return; }
        if (!formData.agreeToTerms) { setError("You must agree to the Terms & Conditions."); return; }

        setIsSubmitting(true);
        const newUser: User = { 
            id: '00000000-0000-0000-0000-000000000000', // Temporary valid UUID
            username: formData.email, 
            fullName: formData.fullName, 
            email: formData.email, 
            password: formData.password, 
            role: 'user',
            planId: 'user',
            planPrice: 0,
            planDuration: '1 month'
        };
        const result = await addUser(newUser);
        setIsSubmitting(false);

        if (result.success) {
            onSignupSuccess({ ...newUser, id: result.userId || newUser.id });
        } else {
            setError(result.message);
            if (result.message.toLowerCase().includes('rate limit')) {
                setCooldown(60);
            }
        }
    };

    return (
        <form onSubmit={handleSignup} className="space-y-5 animate-fade-in">
             <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} disabled={isSubmitting} placeholder="e.g. John Doe" />
             <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} disabled={isSubmitting} placeholder="name@example.com" />
             <InputField label="Password" name="password" type="password" value={formData.password} onChange={handleInputChange} disabled={isSubmitting} placeholder="••••••••" />
             <PasswordStrengthMeter criteria={isPasswordStrong(formData.password)} />
             <Checkbox id="agreeToTerms" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleInputChange}>I agree to the <a href="#" target="_blank" className="font-bold text-brand-primary hover:underline">Terms & Conditions</a>.</Checkbox>
            <button type="submit" className="btn-primary py-3.5" disabled={isSubmitting || cooldown > 0}>
                {isSubmitting ? 'Creating Account...' : cooldown > 0 ? `Wait ${cooldown}s` : 'Create Free Account'}
            </button>
            <p className="text-center text-sm text-slate-600 dark:text-slate-400 font-medium">Already registered? <button type="button" onClick={onSwitchToLogin} className="font-bold text-brand-primary hover:underline">Log In</button></p>
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
        if (!isPasswordStrong(formData.password).all) { setError("Password is too weak."); return; }
        if (!idDoc) { setError("Identification document is required for verification."); return; }
        if (!formData.agreeToTerms) { setError("Agreement to terms is required."); return; }
        
        setIsSubmitting(true);
        const newAgent: User = { 
            id: '00000000-0000-0000-0000-000000000000', // Temporary valid UUID
            username: formData.email, 
            fullName: formData.fullName, 
            email: formData.email, 
            password: formData.password, 
            role: 'agent', 
            phone: formData.phone, 
            officeAddress: formData.officeAddress, 
            agencyName: formData.fullName, // Explicitly set agency name
            businessRegNumber: formData.businessRegNumber, 
            agentLicense: formData.agentLicense, 
            idDocumentUrl: idDoc.name,
            planId: 'agent',
            planPrice: 250,
            planDuration: '1 month'
        };
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
         <form onSubmit={handleSignup} className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 animate-fade-in custom-scrollbar">
            <FormSection title="Account Setup">
                <InputField label="Name / Agency Name" name="fullName" value={formData.fullName} onChange={handleInputChange} disabled={isSubmitting} placeholder="e.g. Royal Realty" />
                <InputField label="Work Email" name="email" type="email" value={formData.email} onChange={handleInputChange} disabled={isSubmitting} placeholder="agent@agency.com" />
                <InputField label="Secure Password" name="password" type="password" value={formData.password} onChange={handleInputChange} disabled={isSubmitting} placeholder="••••••••" />
                <PasswordStrengthMeter criteria={isPasswordStrong(formData.password)} />
            </FormSection>
            <FormSection title="Business Data">
                <InputField label="Contact Phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} disabled={isSubmitting} placeholder="+27 ..." />
                <InputField label="Head Office Address" name="officeAddress" value={formData.officeAddress} onChange={handleInputChange} disabled={isSubmitting} placeholder="Street, City, Province" />
                <InputField label="Registration Number" name="businessRegNumber" value={formData.businessRegNumber} onChange={handleInputChange} note="(Optional for freelance agents)" required={false} disabled={isSubmitting} />
            </FormSection>
            <FormSection title="Verify Identity">
                <FileInput label="ID, Passport or Business Cert" file={idDoc} onFileChange={setIdDoc} acceptedTypes=".pdf,.jpg,.png" required />
            </FormSection>
            
            <div className="space-y-4 pt-2">
                <Checkbox id="agreeToTerms" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleInputChange}>Accept <a href="#" target="_blank" className="font-bold text-brand-primary">Agent Terms of Service</a>.</Checkbox>
                <button type="submit" className="w-full btn-primary py-3.5 shadow-xl shadow-brand-primary/20" disabled={isSubmitting || cooldown > 0}>
                    {isSubmitting ? 'Processing...' : cooldown > 0 ? `Wait ${cooldown}s` : 'Submit for Verification'}
                </button>
            </div>
            <p className="text-center text-sm text-slate-600 dark:text-slate-400 font-medium">Back to <button type="button" onClick={onSwitchToLogin} className="font-bold text-brand-primary hover:underline">Log In</button></p>
        </form>
    );
};

const InvestorSignupView: React.FC<{ onSignupSuccess: () => void, setError: (e: string) => void, onSwitchToLogin: () => void }> = ({ onSignupSuccess, setError, onSwitchToLogin }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', phone: '', address: '', investmentType: 'Individual', companyName: '', agreeToTerms: false });
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

    const handleNext = () => {
        if (step === 1 && !isPasswordStrong(formData.password).all) { setError("Password criteria not met."); return; }
        setError('');
        setStep(step + 1);
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting || cooldown > 0) return;

        setError('');
        if (!idDoc) { setError("Please upload proof of identity."); return; }
        if (!formData.agreeToTerms) { setError("Terms must be accepted."); return; }

        setIsSubmitting(true);
        const newInvestor: User = { 
            id: '00000000-0000-0000-0000-000000000000', // Temporary valid UUID
            username: formData.email, 
            fullName: formData.fullName, 
            email: formData.email, 
            password: formData.password, 
            role: 'investor', 
            phone: formData.phone, 
            officeAddress: formData.address,
            investmentType: formData.investmentType as 'Individual' | 'Corporate', 
            companyName: formData.companyName, 
            proofOfIdentityUrl: idDoc.name,
            planId: 'investor',
            planPrice: 1490,
            planDuration: '1 month'
        };
        const result = await addUser(newInvestor);
        setIsSubmitting(false);

        if (result.success) {
            onSignupSuccess();
        } else {
            setError(result.message);
            if (result.message.toLowerCase().includes('rate limit')) {
                setCooldown(60);
                setStep(1);
            }
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} disabled={isSubmitting} placeholder="e.g. Peter Smith" />
                        <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} disabled={isSubmitting} placeholder="investor@funds.com" />
                        <InputField label="Secure Password" name="password" type="password" value={formData.password} onChange={handleInputChange} disabled={isSubmitting} placeholder="••••••••" />
                        <PasswordStrengthMeter criteria={isPasswordStrong(formData.password)} />
                        <div className="flex justify-end pt-2"><button type="button" onClick={handleNext} className="btn-primary w-auto px-10" disabled={isSubmitting}>Next Step</button></div>
                    </div>
                );
            case 2:
                return (
                     <div className="space-y-4">
                        <InputField label="Mobile Number" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} disabled={isSubmitting} placeholder="+27 ..." />
                        <InputField label="Home / Office Address" name="address" value={formData.address} onChange={handleInputChange} disabled={isSubmitting} placeholder="Street, City, Province" />
                        <div><label className="block text-sm font-bold text-slate-800 dark:text-slate-100 mb-1.5">Investment Structure</label><select name="investmentType" value={formData.investmentType} onChange={handleInputChange} disabled={isSubmitting} className="w-full input-base"><option>Individual</option><option>Corporate</option></select></div>
                        {formData.investmentType === 'Corporate' && <InputField label="Legal Company Name" name="companyName" value={formData.companyName} onChange={handleInputChange} disabled={isSubmitting} placeholder="Global Holdings Ltd" />}
                        <div className="flex justify-between pt-2"><button type="button" onClick={() => setStep(1)} className="btn-secondary w-auto px-8" disabled={isSubmitting}>Back</button><button type="button" onClick={() => setStep(3)} className="btn-primary w-auto px-10" disabled={isSubmitting}>Next Step</button></div>
                    </div>
                );
            case 3:
                return (
                     <div className="space-y-4">
                        <FileInput label="Proof of ID (Passport/ID)" file={idDoc} onFileChange={setIdDoc} acceptedTypes=".pdf,.jpg,.png" required />
                        <Checkbox id="agreeToTerms" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleInputChange}>Accept Investor <a href="#" target="_blank" className="font-bold text-brand-primary hover:underline">Guidelines</a>.</Checkbox>
                        <div className="flex justify-between pt-2"><button type="button" onClick={() => setStep(2)} className="btn-secondary w-auto px-8" disabled={isSubmitting}>Back</button><button type="submit" className="btn-primary w-auto px-10" disabled={isSubmitting || !formData.agreeToTerms || cooldown > 0}>
                            {isSubmitting ? 'Submitting...' : 'Complete Application'}
                        </button></div>
                    </div>
                );
            default: return null;
        }
    }

    return (
        <form onSubmit={handleSignup} className="max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
            <ProgressBar currentStep={step} totalSteps={3} />
            <div key={step} className="animate-fade-in">
                {renderStep()}
            </div>
            <p className="text-center text-sm mt-8 text-slate-600 dark:text-slate-400 font-medium">Back to <button type="button" onClick={onSwitchToLogin} className="font-bold text-brand-primary hover:underline">Log In</button></p>
        </form>
    );
};

const PendingVerificationView: React.FC<{ onSwitchToLogin: () => void, userType: 'agent' | 'investor' }> = ({ onSwitchToLogin, userType }) => (
    <div className="text-center py-4 space-y-6 animate-fade-in">
        <div className="mx-auto w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center border-4 border-emerald-100 dark:border-emerald-800">
            <CheckBadgeIcon className="w-12 h-12 text-emerald-500" />
        </div>
        <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Application Submitted</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Thank you for joining AfriProperty! Your {userType} verification is currently in progress. We typically approve accounts within <strong>24-48 business hours</strong>. Check your email for status updates.</p>
        </div>
        <button onClick={onSwitchToLogin} className="w-full btn-primary py-3.5">Return to Login</button>
    </div>
);

const ForgotPasswordView: React.FC<{ onResetSent: () => void, onBackToLogin: () => void }> = ({ onResetSent, onBackToLogin }) => {
    const [email, setEmail] = useState('');
    const handleReset = (e: React.FormEvent) => { e.preventDefault(); onResetSent(); };

    return (
        <div className="space-y-6 animate-fade-in">
            <p className="text-sm text-center text-slate-500 dark:text-slate-400 font-medium">Enter the email associated with your account.</p>
            <form onSubmit={handleReset} className="space-y-5">
                <InputField label="Account Email" id="reset-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" />
                <button type="submit" className="w-full btn-primary py-3.5">Send Recovery Link</button>
            </form>
            <p className="text-center pt-2"><button onClick={onBackToLogin} className="text-sm font-bold text-slate-600 hover:text-brand-primary transition-colors flex items-center justify-center mx-auto gap-2"><span>&larr;</span> Back to Login</button></p>
        </div>
    );
};

const ResetConfirmationView: React.FC<{ onSwitchToLogin: () => void }> = ({ onSwitchToLogin }) => (
    <div className="space-y-6 text-center animate-fade-in py-4">
        <div className="mx-auto w-16 h-16 bg-brand-light dark:bg-slate-800 rounded-full flex items-center justify-center">
             <EnvelopeIcon className="w-8 h-8 text-brand-primary" />
        </div>
        <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Email Sent</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">A password recovery link has been sent to your inbox. Please follow the instructions to reset your access.</p>
        </div>
        <button onClick={onSwitchToLogin} className="font-bold text-brand-primary hover:underline underline-offset-4 decoration-2">Return to Login Screen</button>
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
        userSignup: 'Seeker Account',
        agentSignup: 'Agent Verification',
        investorSignup: 'Investor Onboarding',
        pendingVerificationAgent: 'Success',
        pendingVerificationInvestor: 'Success',
        forgotPassword: 'Account Recovery',
        resetConfirmation: 'Check Email'
    };
    
    const currentTitle = titles[view] || 'Welcome';

  return (
    <div className="fixed inset-0 bg-brand-dark/60 backdrop-blur-sm flex items-center justify-center z-[150] p-4 animate-fade-in" onClick={onClose}>
        <div 
            className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl w-full max-w-md transform transition-all duration-300 animate-fade-in-scale border border-slate-100 dark:border-slate-800 overflow-hidden" 
            onClick={e => e.stopPropagation()}
        >
            <header className="flex justify-between items-center p-6 border-b border-slate-50 dark:border-slate-800">
                <h2 className="text-2xl font-black text-brand-dark dark:text-white tracking-tight uppercase">
                    {currentTitle}
                </h2>
                <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </header>
            
            <div className="p-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
                {error && (
                    <div className={`px-4 py-3 rounded-xl relative mb-6 text-xs font-bold border flex items-center gap-3 ${error.toLowerCase().includes('rate limit') ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-red-50 border-red-200 text-red-700'}`} role="alert">
                         <div className={`w-2 h-2 rounded-full flex-shrink-0 ${error.toLowerCase().includes('rate limit') ? 'bg-amber-500' : 'bg-red-500'}`}></div>
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
                {view === 'resetConfirmation' && <ResetConfirmationView onSwitchToLogin={() => switchView('login')} />}
            </div>
        </div>
        <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes fadeInScale { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
            .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
            .animate-fade-in-scale { animation: fadeInScale 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            
            .custom-scrollbar::-webkit-scrollbar { width: 4px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { @apply bg-slate-200 dark:bg-slate-700 rounded-full; }

            .input-base {
                @apply w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white transition-all font-medium placeholder:text-slate-400 placeholder:font-normal outline-none;
            }
            .btn-primary {
                @apply w-full bg-brand-primary text-white px-5 rounded-xl font-black uppercase tracking-widest hover:bg-brand-secondary transition-all duration-300 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed shadow-lg shadow-brand-primary/20 hover:shadow-xl active:scale-[0.98];
            }
            .btn-secondary {
                @apply bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-5 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700;
            }
        `}</style>
    </div>
  );
};

// Internal icons helper
const EnvelopeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
  </svg>
);
