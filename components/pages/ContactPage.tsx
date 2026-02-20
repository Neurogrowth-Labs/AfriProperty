import React, { useState } from 'react';
import { LocationPinIcon } from '../icons/NavIcons';
import { EnvelopeIcon, PhoneIcon } from '../icons/ActionIcons';
import { FacebookIcon, TwitterIcon, InstagramIcon, LinkedInIcon } from '../icons/SocialIcons';
import { useTranslations } from '../../contexts/LanguageContext';

const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const ChevronUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
  </svg>
);

const FaqItem: React.FC<{ question: string, children: React.ReactNode }> = ({ question, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-slate-200 dark:border-slate-700">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left py-4">
                <h4 className="font-semibold text-slate-800 dark:text-white">{question}</h4>
                {isOpen ? <ChevronUpIcon className="w-5 h-5 text-brand-primary" /> : <ChevronDownIcon className="w-5 h-5 text-slate-400" />}
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <div className="pb-4 text-slate-600 dark:text-slate-300 text-sm">
                    {children}
                </div>
            </div>
        </div>
    );
};


const ContactInfoItem: React.FC<{ icon: React.ElementType, title: string, children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
    <div>
        <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-brand-primary flex-shrink-0" />
            <h4 className="font-semibold text-slate-700 dark:text-slate-200">{title}</h4>
        </div>
        <div className="pl-8 text-sm text-slate-500 dark:text-slate-400">
            {children}
        </div>
    </div>
);

const ContactPage: React.FC = () => {
  const { t } = useTranslations();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you shortly.');
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="animate-fade-in bg-slate-50 dark:bg-slate-900">
        <header className="bg-white dark:bg-brand-dark py-16">
            <div className="container mx-auto px-6 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark dark:text-white">Contact Us</h1>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                    We’re here to support you. Connect with our team for inquiries, collaborations, bookings, or service requests.
                </p>
            </div>
        </header>

        <section className="py-16">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-12">
                    {/* Left side: Form */}
                    <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-brand-dark dark:text-white mb-6">Send Us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Full Name</label>
                                    <input type="text" id="name" required className="mt-1 w-full input" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Email Address</label>
                                    <input type="email" id="email" required className="mt-1 w-full input" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Phone Number</label>
                                <input type="tel" id="phone" className="mt-1 w-full input" />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Subject</label>
                                    <input type="text" id="subject" required className="mt-1 w-full input" />
                                </div>
                                <div>
                                     <label htmlFor="requestType" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Type of Request</label>
                                     <select id="requestType" className="mt-1 w-full input">
                                        <option>General Inquiry</option>
                                        <option>Booking a Tour</option>
                                        <option>Partnership</option>
                                        <option>Media Request</option>
                                     </select>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-200">Message / Inquiry</label>
                                <textarea id="message" required rows={5} className="mt-1 w-full input resize-none"></textarea>
                            </div>
                            <div className="text-right">
                                <button type="submit" className="bg-brand-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300">
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right side: Contact Info, Hours, Socials */}
                    <div className="lg:col-span-2 space-y-10">
                        <div>
                            <h2 className="text-2xl font-bold text-brand-dark dark:text-white mb-4">Get in Touch</h2>
                            <div className="space-y-4">
                                <ContactInfoItem icon={PhoneIcon} title="Phone">
                                    <a href="tel:+27233442564" className="hover:text-brand-primary">+27 23 344 2564</a>
                                </ContactInfoItem>
                                <ContactInfoItem icon={EnvelopeIcon} title="Email">
                                    <a href="mailto:info@afriproperty.co.za" className="block hover:text-brand-primary">info@afriproperty.co.za</a>
                                    <a href="mailto:support@afriproperty.co.za" className="block hover:text-brand-primary">support@afriproperty.co.za</a>
                                </ContactInfoItem>
                                <ContactInfoItem icon={LocationPinIcon} title="Office Address">
                                    123 Main Street, The Hub Building<br/>Urbanville, Gauteng, South Africa
                                </ContactInfoItem>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-brand-dark dark:text-white mb-4">Business Hours</h2>
                            <ul className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
                                <li><strong>Monday – Friday:</strong> 08:00 – 17:00</li>
                                <li><strong>Saturday:</strong> By appointment</li>
                                <li><strong>Sunday & Public Holidays:</strong> Closed</li>
                            </ul>
                        </div>
                        
                        <div>
                            <h2 className="text-2xl font-bold text-brand-dark dark:text-white mb-4">Connect With Us Online</h2>
                             <div className="flex space-x-4">
                                <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-brand-primary transition-colors"><FacebookIcon className="w-6 h-6" /></a>
                                <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-brand-primary transition-colors"><TwitterIcon className="w-6 h-6" /></a>
                                <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-brand-primary transition-colors"><InstagramIcon className="w-6 h-6" /></a>
                                <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-brand-primary transition-colors"><LinkedInIcon className="w-6 h-6" /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="bg-white dark:bg-slate-800">
            <div className="container mx-auto px-6 py-16">
                 <h2 className="text-3xl font-bold text-center text-brand-dark dark:text-white mb-8">Map & Location</h2>
                 <div className="aspect-video rounded-lg overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
                    <iframe className="w-full h-full" loading="lazy" allowFullScreen src="https://maps.google.com/maps?q=-26.2041,28.0473&hl=es;z=14&output=embed"></iframe>
                 </div>
            </div>
        </section>

        <section className="py-16">
            <div className="container mx-auto px-6 max-w-4xl mx-auto">
                 <div className="grid md:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-2xl font-bold text-brand-dark dark:text-white mb-4">Why Reach Out to Us?</h2>
                        <p className="text-slate-600 dark:text-slate-300">Our team is dedicated to providing prompt response times, professional support, and expert guidance. We believe in creating custom solutions for your needs and are committed to guiding you every step of the way in your real estate journey.</p>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-brand-dark dark:text-white mb-4">Frequently Asked Questions</h2>
                        <FaqItem question="What is your average response time?">Our team typically responds to all inquiries within 24 business hours.</FaqItem>
                        <FaqItem question="How can I book an appointment?">You can book an appointment by filling out the contact form, calling us, or through our agent's calendar links found on their profiles.</FaqItem>
                        <FaqItem question="What are your cancellation policies for service bookings?">For any paid service bookings, we generally require at least 48 hours notice for a full refund on any deposits made.</FaqItem>
                    </div>
                 </div>
            </div>
        </section>
        
        <section className="py-16 bg-brand-dark text-center">
            <div className="container mx-auto px-6">
                 <h2 className="text-3xl font-bold text-white">We look forward to hearing from you.</h2>
                 <p className="mt-3 text-slate-300 max-w-xl mx-auto">Let’s create something impactful together.</p>
                 <button className="mt-6 bg-brand-primary text-white font-semibold px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-lg">
                    Book a Consultation
                </button>
            </div>
        </section>

       <style>{`
          .input { @apply px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-brand-primary focus:border-brand-primary text-slate-800 dark:text-slate-200; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        `}</style>
    </div>
  );
};

export default ContactPage;
