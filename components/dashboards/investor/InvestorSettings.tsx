
import React, { useState, useEffect } from 'react';
import type { InvestorSettings, User } from '../../../types';
import { ClipboardDocumentIcon, CheckBadgeIcon } from '../../icons/ActionIcons';

interface InvestorSettingsProps {
    settings: InvestorSettings | null;
    onUpdateSettings: (settings: InvestorSettings) => void;
    user: User;
}

const Section: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
        </div>
        <div className="p-6 space-y-4">
            {children}
        </div>
    </div>
);

const Toggle: React.FC<{ label: string; checked: boolean; onChange: (checked: boolean) => void }> = ({ label, checked, onChange }) => (
    <label className="flex items-center justify-between cursor-pointer">
        <span className="font-medium text-slate-700 dark:text-slate-200">{label}</span>
        <div className="relative">
            <input type="checkbox" className="sr-only" checked={checked} onChange={e => onChange(e.target.checked)} />
            <div className={`block w-14 h-8 rounded-full transition-colors ${checked ? 'bg-brand-primary' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${checked ? 'translate-x-6' : ''}`}></div>
        </div>
    </label>
);


const InvestorSettingsPage: React.FC<InvestorSettingsProps> = ({ settings, onUpdateSettings, user }) => {
    const [localSettings, setLocalSettings] = useState<InvestorSettings | null>(settings);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    if (!localSettings) {
        return (
             <div className="p-8 h-full flex items-center justify-center text-center">
                <p>Loading settings...</p>
            </div>
        );
    }

    const handleWidgetToggle = (id: string, isVisible: boolean) => {
        setLocalSettings(prev => {
            if (!prev) return null;
            return {
                ...prev,
                widgets: prev.widgets.map(w => w.id === id ? { ...w, isVisible } : w),
            };
        });
    };
    
    const handleAlertsToggle = (key: 'priceDrop' | 'rentalVacancy', checked: boolean) => {
        setLocalSettings(prev => {
            if (!prev) return null;
            return {
                ...prev,
                alerts: { ...prev.alerts, [key]: checked }
            };
        });
    };
    
    const handleRoiAlertToggle = (checked: boolean) => {
         setLocalSettings(prev => {
            if (!prev) return null;
            return {
                ...prev,
                alerts: { ...prev.alerts, roiThreshold: { ...prev.alerts.roiThreshold, isEnabled: checked } }
            };
        });
    };

    const handleRoiValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        setLocalSettings(prev => {
            if (!prev) return null;
            return {
                ...prev,
                alerts: { ...prev.alerts, roiThreshold: { ...prev.alerts.roiThreshold, value } }
            };
        });
    };

    const handleSaveChanges = () => {
        if (localSettings) {
            onUpdateSettings(localSettings);
             alert("Settings saved!");
        }
    };
    
    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(localSettings.apiToken);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-8 space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Settings & Personalization</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Customize your dashboard, alerts, and data options.</p>
            </div>

            <Section title="Dashboard Widgets" description="Choose which modules to display on your main dashboard.">
                {localSettings.widgets.map(widget => (
                    <Toggle key={widget.id} label={widget.label} checked={widget.isVisible} onChange={(checked) => handleWidgetToggle(widget.id, checked)} />
                ))}
            </Section>

            <Section title="Alerts & Notifications" description="Get notified about important changes to your portfolio and watchlist.">
                <Toggle label="Price drop on watchlist" checked={localSettings.alerts.priceDrop} onChange={(checked) => handleAlertsToggle('priceDrop', checked)} />
                <Toggle label="Rental vacancy alert" checked={localSettings.alerts.rentalVacancy} onChange={(checked) => handleAlertsToggle('rentalVacancy', checked)} />
                <div className="flex items-center justify-between">
                    <Toggle label="ROI threshold crossed" checked={localSettings.alerts.roiThreshold.isEnabled} onChange={handleRoiAlertToggle} />
                    {localSettings.alerts.roiThreshold.isEnabled && (
                        <div className="relative w-32">
                             <input type="number" value={localSettings.alerts.roiThreshold.value} onChange={handleRoiValueChange} className="w-full pl-3 pr-8 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800" />
                            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500">%</span>
                        </div>
                    )}
                </div>
            </Section>

            <Section title="Data Export & API" description="Export your portfolio data or integrate with your own tools.">
                <div className="flex items-center gap-4">
                    <button onClick={() => alert("Exporting to PDF...")} className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600">Export as PDF</button>
                    <button onClick={() => alert("Exporting to Excel...")} className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600">Export as Excel (CSV)</button>
                </div>
                 <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Your API Key</label>
                    <div className="flex items-center gap-2">
                        <input type="text" readOnly value={localSettings.apiToken} className="w-full bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md text-sm font-mono" />
                        <button onClick={handleCopyToClipboard} className="bg-slate-600 text-white px-3 py-2 rounded-lg font-semibold hover:bg-slate-700 flex items-center gap-2">
                            {copied ? <CheckBadgeIcon className="w-5 h-5"/> : <ClipboardDocumentIcon className="w-5 h-5"/>}
                            <span>{copied ? 'Copied' : 'Copy'}</span>
                        </button>
                    </div>
                 </div>
            </Section>
            
            <div className="flex justify-end">
                <button onClick={handleSaveChanges} className="px-6 py-2.5 font-semibold bg-brand-primary text-white rounded-lg hover:bg-opacity-90">
                    Save Changes
                </button>
            </div>
             <style>{`
                .input { @apply px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-brand-primary focus:border-brand-primary; }
            `}</style>
        </div>
    );
};

export default InvestorSettingsPage;