
import React, { useState } from 'react';
import { BanknotesIcon, ShieldCheckIcon, TruckIcon, HomeIcon as HomeServiceIcon, CpuChipIcon, CheckBadgeIcon, UserGroupIcon } from '../icons/ActionIcons';
import { TrophyIcon } from '../icons/AgentDashboardIcons';

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

interface ServicesPageProps {
  onServiceClick: (service: string) => void;
}

const ServiceDetailCard: React.FC<{
    icon: React.ElementType;
    title: string;
    subheading: string;
    description: string;
    features: string[];
    ctaText: string;
    serviceKey: string;
    onCtaClick: (service: string) => void;
}> = ({ icon: Icon, title, subheading, description, features, ctaText, serviceKey, onCtaClick }) => (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
        <Icon className="w-10 h-10 text-brand-gold mb-4" />
        <h3 className="text-2xl font-bold text-brand-dark dark:text-white">{title}</h3>
        <p className="text-sm font-semibold text-brand-primary mt-1">{subheading}</p>
        <p className="text-slate-600 dark:text-slate-300 mt-4">{description}</p>
        <ul className="mt-4 space-y-2">
            {features.map((feature, i) => (
                <li key={i} className="flex items-start">
                    <CheckBadgeIcon className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-300">{feature}</span>
                </li>
            ))}
        </ul>
        <button onClick={() => onCtaClick(serviceKey)} className="mt-6 w-full bg-brand-primary text-white font-semibold py-2.5 rounded-lg hover:bg-opacity-90 transition-colors">
            {ctaText}
        </button>
    </div>
);

const ProcessStep: React.FC<{ number: string, title: string, description: string }> = ({ number, title, description }) => (
    <div className="relative pl-8">
        <div className="absolute top-0 left-0 w-8 h-8 bg-brand-light dark:bg-slate-700 text-brand-primary dark:text-brand-gold font-bold text-lg rounded-full flex items-center justify-center">
            {number}
        </div>
        <h3 className="font-bold text-slate-800 dark:text-white">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
    </div>
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

const ServicesPage: React.FC<ServicesPageProps> = ({ onServiceClick }) => {
  return (
    <div className="animate-fade-in bg-slate-50 dark:bg-slate-900">
      {/* H1 and Intro */}
      <section className="bg-white dark:bg-brand-dark py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark dark:text-white">Our Services</h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            At AfriProperty, we go beyond listings. Our goal is to provide a comprehensive suite of services that empower you at every stage of your real estate journey, ensuring a seamless, secure, and successful experience.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="py-16">
        <div className="container mx-auto px-6 space-y-20">
          
          {/* What We Offer */}
          <section>
            <h2 className="text-3xl font-bold text-center text-brand-dark dark:text-white mb-4">What We Offer</h2>
            <p className="text-center text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12">
              From securing financing to managing your rental, our integrated services are designed to simplify complexity and maximize your opportunities.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <ServiceDetailCard
                icon={BanknotesIcon}
                title="Home Loans & Mortgages"
                subheading="What This Service Does"
                description="We connect you with trusted lenders to find competitive mortgage rates, helping you get pre-approved to make your offer stronger and your purchase smoother."
                features={[
                  "Access to a network of verified lenders.",
                  "Get pre-approved to understand your budget.",
                  "Streamline your application process."
                ]}
                ctaText="Explore Lenders"
                serviceKey="Financial Services"
                onCtaClick={onServiceClick}
              />
              <ServiceDetailCard
                icon={HomeServiceIcon}
                title="Comprehensive Rental Services"
                subheading="Why It Matters"
                description="Our services for tenants and landlords ensure a safe and reliable rental experience, from secure deposit management to streamlined online rent payments and tenant verification."
                features={[
                  "Secure digital deposit management.",
                  "Automated and easy online rent collection.",
                  "Reliable tenant screening and verification."
                ]}
                ctaText="Find Property Managers"
                serviceKey="Property Management"
                onCtaClick={onServiceClick}
              />
              <ServiceDetailCard
                icon={ShieldCheckIcon}
                title="Property & Contents Insurance"
                subheading="The Results We Deliver"
                description="Protect your most valuable asset. Our network of insurance partners provides competitive quotes for home and contents insurance, giving you peace of mind from day one."
                features={[
                  "Compare quotes from top insurers.",
                  "Protect your property and belongings.",
                  "Ensure financial security against the unexpected."
                ]}
                ctaText="Get an Insurance Quote"
                serviceKey="Insurance"
                onCtaClick={onServiceClick}
              />
              <ServiceDetailCard
                icon={TruckIcon}
                title="Professional Moving Services"
                subheading="Making Your Move Easy"
                description="The journey doesn't end with the transaction. We help you get settled by providing access to quotes from reliable, vetted moving companies to make your transition seamless."
                features={[
                  "Get quotes from trusted moving partners.",
                  "Ensure a stress-free moving day.",
                  "Services for local and long-distance moves."
                ]}
                ctaText="Find Movers"
                serviceKey="Moving Services"
                onCtaClick={onServiceClick}
              />
            </div>
          </section>

          {/* Our Process */}
          <section>
            <h2 className="text-3xl font-bold text-center text-brand-dark dark:text-white mb-12">Our Process</h2>
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-x-12 gap-y-10 relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
              <ProcessStep number="1" title="Discovery" description="We start by understanding your unique needs, goals, and financial situation through an initial consultation."/>
              <ProcessStep number="2" title="Strategy & Planning" description="We develop a customized plan, whether it's finding the right loan, managing a property, or planning your move."/>
              <ProcessStep number="3" title="Execution" description="Our network of professionals gets to work, handling applications, verifications, and logistics with efficiency."/>
              <ProcessStep number="4" title="Delivery & Support" description="We ensure a smooth final delivery of the service and provide ongoing support to guarantee your satisfaction."/>
            </div>
          </section>

          {/* Why Choose Us */}
          <section>
            <h2 className="text-3xl font-bold text-center text-brand-dark dark:text-white mb-12">Why Choose AfriProperty</h2>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                    <TrophyIcon className="w-8 h-8 text-brand-gold mb-3"/>
                    <h3 className="font-bold text-lg">Experience & Credibility</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Our platform is built on years of real estate expertise, featuring a curated network of vetted professionals and verified listings to ensure you're in safe hands.</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                    <CpuChipIcon className="w-8 h-8 text-brand-gold mb-3"/>
                    <h3 className="font-bold text-lg">Innovation-Driven</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">We use cutting-edge AI to provide personalized property matches, market insights, and tools that give you a competitive edge in the market.</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                    <UserGroupIcon className="w-8 h-8 text-brand-gold mb-3"/>
                    <h3 className="font-bold text-lg">Client-Centric Approach</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Your success is our success. Our platform and services are designed from the ground up to be user-friendly, transparent, and supportive.</p>
                </div>
            </div>
          </section>

          {/* Client Results */}
          <section className="bg-brand-primary text-white rounded-lg p-10">
              <h2 className="text-3xl font-bold text-center mb-8">Client Results</h2>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                  <div>
                      <p className="text-5xl font-extrabold">30%</p>
                      <p className="mt-2 font-semibold">Faster Transaction Time</p>
                  </div>
                  <div>
                      <p className="text-5xl font-extrabold">2,500+</p>
                      <p className="mt-2 font-semibold">Verified Professionals</p>
                  </div>
                  <div>
                      <p className="text-5xl font-extrabold">98%</p>
                      <p className="mt-2 font-semibold">Client Satisfaction Rate</p>
                  </div>
              </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-3xl font-bold text-center text-brand-dark dark:text-white mb-8">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                <FaqItem question="Are your service providers vetted?">
                    Yes, absolutely. Every professional in our network undergoes a thorough verification process, including credential checks and reviews, to ensure they meet our high standards of quality and reliability.
                </FaqItem>
                <FaqItem question="How do I get started with a home loan application?">
                    Simply use our "Explore Lenders" tool. You can compare rates and start a pre-approval process directly through our platform, which streamlines the initial application for you.
                </FaqItem>
                <FaqItem question="What are the fees for using your services?">
                    Browsing and connecting with providers is free. The providers themselves have their own fee structures. For services like rental management, we offer transparent, competitive pricing which is clearly outlined.
                </FaqItem>
                 <FaqItem question="Can I use my own service providers?">
                    Of course. Our network is here for your convenience, but you are always free to use your own preferred professionals for any part of your real estate journey.
                </FaqItem>
                <FaqItem question="Is my data secure when using your financial services?">
                    Yes. We use industry-standard encryption and security protocols to protect all sensitive information shared through our platform. Your privacy and security are our top priorities.
                </FaqItem>
            </div>
          </section>
          
          {/* CTA */}
          <section className="text-center">
            <h2 className="text-3xl font-bold text-brand-dark dark:text-white">Ready to work with us?</h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400">Contact our team today to get started.</p>
            <button onClick={() => onServiceClick('Legal Services')} className="mt-6 bg-brand-primary text-white font-semibold px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-lg">
                Book a Consultation
            </button>
          </section>

        </div>
      </div>
       <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
          }
        `}</style>
    </div>
  );
};

export default ServicesPage;