
import React, { useState, useMemo } from 'react';
import type { ProfessionalContact } from '../types';
import { CloseIcon } from './icons/NavIcons';
import { CalendarIcon, ClockIcon, CheckBadgeIcon } from './icons/ActionIcons';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

interface BookConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  professional: ProfessionalContact;
}

const BookConsultationModal: React.FC<BookConsultationModalProps> = ({ isOpen, onClose, professional }) => {
    const [step, setStep] = useState(1);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [duration, setDuration] = useState(30);
    const [topic, setTopic] = useState('');
    const [meetingType, setMeetingType] = useState('Video Call');

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const daysInMonth = Array.from({ length: lastDayOfMonth.getDate() }, (_, i) => i + 1);
    const startingDayOfWeek = firstDayOfMonth.getDay();

    const availableSlots = useMemo(() => {
        if (!selectedDate) return [];
        const dayOfWeek = selectedDate.getDay();
        // Mock different availability for weekends vs weekdays
        if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday or Saturday
            return ["10:00", "11:00", "12:00"];
        }
        return ["09:00", "09:30", "10:00", "11:00", "14:00", "15:00", "16:00"];
    }, [selectedDate]);
    
    const changeMonth = (offset: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev.getFullYear(), prev.getMonth() + offset, 1);
            setSelectedDate(null); // Reset selected day when month changes
            setSelectedTime('');
            return newDate;
        });
    };

    const handleDateSelect = (day: number) => {
        const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(newSelectedDate);
        setSelectedTime(''); // Reset time when date changes
    };

    const handleConfirm = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(3); // Go to confirmation
    };
    
    const resetAndClose = () => {
        setStep(1);
        setSelectedDate(null);
        setSelectedTime('');
        setTopic('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[120] p-4" onClick={resetAndClose}>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
                    <div>
                        <h2 className="text-xl font-bold text-brand-dark dark:text-white">Book Consultation</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">with {professional.name}</p>
                    </div>
                    <button onClick={resetAndClose} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><CloseIcon className="w-6 h-6" /></button>
                </header>
                
                {step === 1 && (
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Calendar */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => changeMonth(-1)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><ChevronLeftIcon className="w-5 h-5"/></button>
                                    <button onClick={() => changeMonth(1)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><ChevronRightIcon className="w-5 h-5"/></button>
                                </div>
                            </div>
                            <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-500 mb-2">
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d}>{d}</div>)}
                            </div>
                            <div className="grid grid-cols-7">
                                {Array.from({ length: startingDayOfWeek }).map((_, i) => <div key={`empty-${i}`}></div>)}
                                {daysInMonth.map(day => {
                                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                                    return <button key={day} onClick={() => handleDateSelect(day)} className={`w-9 h-9 mx-auto rounded-full text-sm font-semibold transition-colors ${isSelected ? 'bg-brand-primary text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`}>{day}</button>
                                })}
                            </div>
                        </div>
                        {/* Time Slots & Duration */}
                        <div className="border-l border-slate-200 dark:border-slate-700 pl-6">
                            {selectedDate ? (
                                <>
                                    <h3 className="font-semibold mb-3">{selectedDate.toDateString()}</h3>
                                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-2">
                                        {availableSlots.map(time => <button key={time} onClick={() => setSelectedTime(time)} className={`p-2 rounded-lg text-sm font-semibold transition-colors ${selectedTime === time ? 'bg-brand-primary text-white' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>{time}</button>)}
                                    </div>
                                    <div className="mt-4">
                                        <label className="font-semibold text-sm text-slate-700 dark:text-slate-200">Duration:</label>
                                        <div className="flex gap-2 mt-2">
                                            {[15, 30, 60].map(d => <button key={d} onClick={() => setDuration(d)} className={`px-4 py-1.5 rounded-full text-sm font-semibold ${duration === d ? 'bg-brand-primary text-white' : 'bg-slate-100 dark:bg-slate-700'}`}>{d} min</button>)}
                                        </div>
                                    </div>
                                    <div className="text-right mt-6">
                                        <button onClick={() => setStep(2)} disabled={!selectedTime} className="bg-brand-primary text-white font-semibold px-6 py-2 rounded-lg hover:bg-opacity-90 disabled:bg-slate-400">Next</button>
                                    </div>
                                </>
                            ) : <p className="text-sm text-slate-500 text-center pt-10">Please select a date.</p>}
                        </div>
                    </div>
                )}
                
                {step === 2 && (
                    <form onSubmit={handleConfirm}>
                        <div className="p-6 space-y-4">
                            <h3 className="font-semibold text-lg">Confirm Your Details</h3>
                            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-2"><CalendarIcon className="w-5 h-5 text-slate-500 dark:text-slate-400"/> <span className="font-semibold">{selectedDate?.toDateString()}</span></div>
                                <div className="flex items-center gap-2"><ClockIcon className="w-5 h-5 text-slate-500 dark:text-slate-400"/> <span className="font-semibold">{selectedTime} ({duration} min)</span></div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">Meeting Type</label>
                                <select value={meetingType} onChange={e => setMeetingType(e.target.value)} className="mt-1 w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800">
                                    <option>Video Call</option><option>Phone Call</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="topic" className="block text-sm font-medium text-slate-600 dark:text-slate-300">What would you like to discuss?</label>
                                <textarea id="topic" value={topic} onChange={e => setTopic(e.target.value)} required rows={3} className="mt-1 w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800"/>
                            </div>
                             <div className="flex justify-between items-center pt-4">
                                <button type="button" onClick={() => setStep(1)} className="text-sm font-semibold hover:underline text-slate-600 dark:text-slate-300">Back</button>
                                <button type="submit" className="bg-brand-primary text-white font-semibold px-6 py-2 rounded-lg hover:bg-opacity-90">Confirm Booking</button>
                             </div>
                        </div>
                    </form>
                )}

                {step === 3 && (
                    <div className="p-8 text-center">
                        <CheckBadgeIcon className="w-16 h-16 text-green-500 mx-auto"/>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-4">Consultation Booked!</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Your {meetingType} with {professional.name} is confirmed for <br/><span className="font-semibold text-brand-dark dark:text-white">{selectedDate?.toDateString()} at {selectedTime}</span>.</p>
                        <div className="mt-6 flex justify-center gap-3">
                            <button onClick={() => alert('Adding to calendar...')} className="px-5 py-2.5 font-semibold bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600">Add to Calendar</button>
                            <button onClick={resetAndClose} className="px-5 py-2.5 font-semibold bg-brand-primary text-white rounded-lg hover:bg-opacity-90">Done</button>
                        </div>
                    </div>
                )}
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

export default BookConsultationModal;
