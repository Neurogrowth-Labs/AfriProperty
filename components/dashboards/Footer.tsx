
import React, { useState, useRef, useEffect } from 'react';
import { HomeIcon } from './icons/NavIcons';
import { FacebookIcon, TwitterIcon, InstagramIcon } from './icons/SocialIcons';
import { useTranslations } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { currencyOptions } from '../constants';
import { Currency } from '../types';

interface FooterProps {
  onAboutClick: () => void;
  onContactClick: () => void;
  onBlogClick: () => void;
  onPrivacyPolicyClick: () => void;
  onTermsOfServiceClick: () => void;
  onCareersClick: () => void;
  onFindAProClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAboutClick, onContactClick, onBlogClick, onPrivacyPolicyClick, onTermsOfServiceClick, onCareersClick, onFindAProClick }) => {
  const { t } = useTranslations();
  const { currency, setCurrency } = useCurrency();
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const currencyRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
            setIsCurrencyOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, handler: () => void) => {
    e.preventDefault();
    handler();
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      alert(`Thank you for subscribing with ${email}!`);
      setEmail('');
    }
  };

  return (
    <footer className="bg-brand-dark text-slate-300">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <button onClick={(e) => handleLinkClick(e, () => window.scrollTo({ top: 0, behavior: 'smooth' }))} className="flex items-center space-x-2 mb-4">
              <HomeIcon className="w-8 h-8 text-brand-gold" />
              <h2 className="text-2xl font-semibold text-white">AfriProperty</h2>
            </button>
            <p className="text-slate-400">{t.footer.tagline}</p>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4 tracking-wide">{t.footer.quickLinks}</h3>
            <ul className="space-y-2">
              <li><a href="#" onClick={(e) => handleLinkClick(e, onAboutClick)} className="hover:text-brand-gold transition">{t.footer.aboutUs}</a></li>
              <li><a href="#" onClick={(e) => handleLinkClick(e, onContactClick)} className="hover:text-brand-gold transition">{t.footer.contact}</a></li>
              <li><a href="#" onClick={(e) => handleLinkClick(e, onCareersClick)} className="hover:text-brand-gold transition">{t.footer.careers}</a></li>
              <li><a href="#" onClick={(e) => handleLinkClick(e, onBlogClick)} className="hover:text-brand-gold transition">{t.footer.blog}</a></li>
              <li><a href="#" onClick={(e) => handleLinkClick(e, onFindAProClick)} className="hover:text-brand-gold transition">{t.footer.findAPro}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4 tracking-wide">{t.footer.legal}</h3>
            <ul className="space-y-2">
              <li><a href="#" onClick={(e) => handleLinkClick(e, onPrivacyPolicyClick)} className="hover:text-brand-gold transition">{t.footer.privacyPolicy}</a></li>
              <li><a href="#" onClick={(e) => handleLinkClick(e, onTermsOfServiceClick)} className="hover:text-brand-gold transition">{t.footer.termsOfService}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4 tracking-wide">{t.footer.followUs}</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition" aria-label="Facebook">
                <FacebookIcon className="w-6 h-6" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition" aria-label="Twitter">
                <TwitterIcon className="w-6 h-6" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition" aria-label="Instagram">
                <InstagramIcon className="w-6 h-6" />
              </a>
            </div>
             <div className="relative mt-6" ref={currencyRef}>
                <button onClick={() => setIsCurrencyOpen(!isCurrencyOpen)} className="w-full bg-slate-800 hover:bg-slate-700 text-left px-4 py-2 rounded-md flex justify-between items-center transition-colors">
                    <span>{currencyOptions[currency].symbol} {currencyOptions[currency].name}</span>
                    <span>▲</span>
                </button>
                 {isCurrencyOpen && (
                    <div className="absolute bottom-full mb-2 w-full bg-slate-700 rounded-lg shadow-xl border border-slate-600 py-1 z-10">
                        {Object.entries(currencyOptions).map(([code, details]) => (
                             <button 
                                key={code}
                                onClick={() => {
                                    setCurrency(code as Currency);
                                    setIsCurrencyOpen(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-600"
                             >
                                {details.symbol} {details.name}
                             </button>
                        ))}
                    </div>
                )}
            </div>
            <div className="mt-8">
                <h3 className="font-bold text-white mb-2">Stay Updated</h3>
                <p className="text-slate-400 mb-4 text-sm">Get the latest listings and market news.</p>
                <form onSubmit={handleSubscribe}>
                    <div className="flex flex-col gap-2">
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your email" 
                            required 
                            aria-label="Email for newsletter"
                            className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white focus:ring-1 focus:ring-brand-primary focus:border-brand-primary placeholder:text-slate-500 text-sm"
                        />
                        <button 
                            type="submit" 
                            className="bg-brand-primary text-white font-semibold px-4 py-2.5 rounded-lg hover:bg-opacity-90 transition-colors flex-shrink-0 text-sm"
                        >
                            Subscribe
                        </button>
                    </div>
                </form>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-12 pt-8 text-center text-slate-400">
          <p>{t.footer.copyright.replace('{{year}}', String(new Date().getFullYear()))}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;