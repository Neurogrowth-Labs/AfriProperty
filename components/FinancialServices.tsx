import React from 'react';
import { BanknotesIcon, ShieldCheckIcon, TruckIcon, HomeIcon } from './icons/ActionIcons';
import { useTranslations } from '../contexts/LanguageContext';

const FinancialServices: React.FC = () => {
    const { t } = useTranslations();

    const services = [
        {
            title: t.financialServices.homeLoans,
            description: t.financialServices.homeLoansDesc,
            Icon: BanknotesIcon,
            color: 'bg-brand-primary',
            shadow: 'shadow-brand-primary/20'
        },
        {
            title: t.financialServices.rentalServices,
            description: t.financialServices.rentalServicesDesc,
            Icon: HomeIcon,
            color: 'bg-brand-secondary',
            shadow: 'shadow-brand-secondary/20'
        },
        {
            title: t.financialServices.insurance,
            description: t.financialServices.insuranceDesc,
            Icon: ShieldCheckIcon,
            color: 'bg-brand-accent',
            shadow: 'shadow-brand-accent/20'
        },
        {
            title: t.financialServices.movingServices,
            description: t.financialServices.movingServicesDesc,
            Icon: TruckIcon,
            color: 'bg-brand-gold',
            shadow: 'shadow-brand-gold/20'
        }
    ];

    return (
        <section id="financial-services" className="py-24 bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-brand-dark dark:text-white uppercase tracking-tighter">{t.financialServices.title}</h2>
                    <div className="w-24 h-2 bg-brand-primary mx-auto mt-4 mb-6 rounded-full"></div>
                    <p className="text-center text-slate-500 dark:text-slate-400 text-xl font-medium max-w-2xl mx-auto">{t.financialServices.subtitle}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <div key={index} className={`bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-xl hover:shadow-2xl ${service.shadow} hover:-translate-y-3 transition-all duration-500 text-center border border-slate-100 dark:border-slate-700 group`}>
                            <div className="flex justify-center mb-8">
                                <div className={`${service.color} text-white p-6 rounded-3xl transform transition-transform group-hover:rotate-12 duration-500`}>
                                    <service.Icon className="w-10 h-10" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-brand-dark dark:text-white mb-4 tracking-tight">{service.title}</h3>
                            <p className="text-slate-500 dark:text-slate-300 text-sm leading-relaxed font-medium">{service.description}</p>
                            <button className="mt-8 text-xs font-black uppercase tracking-widest text-brand-primary hover:text-brand-dark transition-colors flex items-center justify-center gap-2 mx-auto">
                                Learn More <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FinancialServices;