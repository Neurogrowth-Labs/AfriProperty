import React from 'react';

interface SessionTimeoutModalProps {
  isOpen: boolean;
  onClose: () => void; // This will act as "Stay Logged In"
  onLogout: () => void;
  countdown: number;
}

const SessionTimeoutModal: React.FC<SessionTimeoutModalProps> = ({ isOpen, onClose, onLogout, countdown }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[200] p-4">
      <div 
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale text-center p-8"
      >
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Are you still there?</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          For your security, you will be logged out in <span className="font-bold text-brand-dark dark:text-white">{countdown}</span> seconds due to inactivity.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button 
                onClick={onLogout}
                className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-5 py-2.5 rounded-lg font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
            >
                Log Out
            </button>
            <button 
                onClick={onClose}
                className="flex-1 bg-brand-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
            >
                Stay Logged In
            </button>
        </div>
      </div>
      <style>{`
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

export default SessionTimeoutModal;