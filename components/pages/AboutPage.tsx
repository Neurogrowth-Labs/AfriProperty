import React from 'react';
import { RocketLaunchIcon, TrophyIcon } from '../icons/AgentDashboardIcons';
import { EyeIcon, CpuChipIcon, CheckBadgeIcon, SparklesIcon, UserGroupIcon } from '../icons/ActionIcons';
import { HeartIcon } from '@heroicons/react/24/outline';


const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
    <section className={`py-12 ${className}`}>
        <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-brand-dark dark:text-white mb-3">{title}</h2>
            <div className="w-24 h-1 bg-brand-gold mx-auto mb-10"></div>
            {children}
        </div>
    </section>
);

const ValueCard: React.FC<{ icon: React.ElementType, title: string, children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md text-center border border-slate-200 dark:border-slate-700">
        <div className="inline-block bg-brand-light dark:bg-slate-700 p-4 rounded-full">
            <Icon className="w-8 h-8 text-brand-gold" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-4">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{children}</p>
    </div>
);

const StatCard: React.FC<{ value: string, label: string }> = ({ value, label }) => (
    <div className="bg-brand-light dark:bg-slate-800 p-6 rounded-lg text-center">
        <p className="text-4xl font-extrabold text-brand-primary">{value}</p>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-2">{label}</p>
    </div>
);


const AboutPage: React.FC = () => {
  
  return (
    <div className="animate-fade-in bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <header className="bg-white dark:bg-brand-dark py-20 text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-brand-dark dark:text-white tracking-tight">About AfriProperty</h1>
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Empowering Real Estate Dreams Across Africa with Technology and Trust.
          </p>
        </div>
      </header>
      
      {/* Our Story */}
      <Section title="Our Story">
          <div className="max-w-4xl mx-auto text-center text-slate-600 dark:text-slate-300 leading-relaxed space-y-4">
            <p>AfriProperty was born from a simple yet powerful idea: to make real estate in Africa accessible, transparent, and efficient for everyone. Our founders, deeply rooted in local communities, saw a gap between aspiring homeowners and available properties, particularly in underserved markets like affordable housing, student rentals, and township areas.</p>
            <p>What started as a small project to connect local landlords with tenants has evolved into a sophisticated, AI-powered platform. Our journey has been one of constant innovation, driven by our commitment to solving real-world challenges. Today, we stand as a bridge connecting not just buyers and sellers, but also global investors with tangible opportunities, all while championing security and transparency through technology.</p>
          </div>
      </Section>

      {/* Mission & Vision */}
      <div className="bg-white dark:bg-slate-800 py-16">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 text-center">
                <div>
                    <RocketLaunchIcon className="w-12 h-12 text-brand-gold mx-auto" />
                    <h2 className="text-2xl font-bold text-brand-dark dark:text-white mt-4">Our Mission</h2>
                    <p className="text-slate-600 dark:text-slate-300 mt-2 italic">"To democratize property ownership by creating an inclusive, transparent, and efficient marketplace for everyone."</p>
                </div>
                 <div>
                    <EyeIcon className="w-12 h-12 text-brand-gold mx-auto" />
                    <h2 className="text-2xl font-bold text-brand-dark dark:text-white mt-4">Our Vision</h2>
                    <p className="text-slate-600 dark:text-slate-300 mt-2 italic">"To be Africa's leading real estate platform, powered by AI, where every transaction is secure, every listing is verified, and every user is empowered."</p>
                </div>
            </div>
          </div>
      </div>

      {/* Core Values */}
       <Section title="Our Core Values">
           <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
               <ValueCard icon={CheckBadgeIcon} title="Integrity">We operate with unwavering transparency and honesty in every interaction.</ValueCard>
               <ValueCard icon={SparklesIcon} title="Innovation">We leverage cutting-edge technology to solve real-world problems and simplify complexity.</ValueCard>
               <ValueCard icon={UserGroupIcon} title="Community Focus">We are committed to building bridges and empowering local communities through accessible property solutions.</ValueCard>
               <ValueCard icon={TrophyIcon} title="Excellence">We pursue the highest standards in our platform, our services, and our support for clients.</ValueCard>
           </div>
       </Section>
      
      {/* Leadership */}
      <Section title="Leadership & Team" className="bg-white dark:bg-slate-800">
          <div className="max-w-4xl mx-auto">
              <div className="text-center">
                  <img src="https://i.pravatar.cc/150?u=naledi-radebe" alt="Naledi Radebe" className="w-32 h-32 rounded-full mx-auto shadow-lg" />
                  <h3 className="text-2xl font-bold text-brand-dark dark:text-white mt-4">Naledi Radebe</h3>
                  <p className="font-semibold text-brand-gold">Founder & CEO</p>
                  <p className="mt-4 text-slate-600 dark:text-slate-300 italic max-w-2xl mx-auto">"We didn't just build a platform; we built a promise. A promise that no matter who you are or where you come from, the dream of owning a piece of this continent is within your reach. Technology is our tool, but community is our heart."</p>
              </div>
          </div>
      </Section>
      
       {/* Our Impact */}
       <Section title="Our Impact">
           <div className="grid md:grid-cols-3 gap-8">
               <StatCard value="50+" label="Communities Served" />
               <StatCard value="10,000+" label="Verified Listings" />
               <StatCard value="25,000+" label="Successful Connections Made" />
           </div>
           <div className="max-w-2xl mx-auto mt-12 text-center italic bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
               <p className="text-slate-600 dark:text-slate-300">"AfriProperty made finding our first family home in Soweto a reality. The process was so much easier and more transparent than we ever imagined."</p>
               <p className="font-semibold text-brand-dark dark:text-white mt-2">- The Mokoena Family</p>
           </div>
       </Section>

       {/* Call to Action */}
       <div className="bg-brand-dark py-16">
           <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold text-white">Join Our Journey</h2>
                <p className="mt-3 text-slate-300 max-w-xl mx-auto">Whether you're looking for a home, listing a property, or seeking an investment, partner with us today.</p>
                <button className="mt-6 bg-brand-primary text-white font-semibold px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-lg">
                    Get Started
                </button>
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

export default AboutPage;