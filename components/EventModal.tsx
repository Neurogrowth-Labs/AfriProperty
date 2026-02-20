
import React, { useState, useEffect } from 'react';
import type { CalendarEvent } from '../types';
import { EventType } from '../types';
import { CloseIcon } from './icons/NavIcons';
import { TrashIcon } from './icons/ActionIcons';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'> | CalendarEvent) => void;
  onDelete: (eventId: string) => void;
  eventToEdit?: CalendarEvent | null;
  selectedDate?: string | null;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, onDelete, eventToEdit, selectedDate }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('10:00');
    const [type, setType] = useState<EventType>(EventType.SHOWING);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (eventToEdit) {
            setTitle(eventToEdit.title);
            setDate(eventToEdit.date);
            setStartTime(eventToEdit.startTime);
            setEndTime(eventToEdit.endTime);
            setType(eventToEdit.type);
            setNotes(eventToEdit.notes || '');
        } else {
            setTitle('');
            setDate(selectedDate || new Date().toISOString().split('T')[0]);
            setStartTime('09:00');
            setEndTime('10:00');
            setType(EventType.SHOWING);
            setNotes('');
        }
    }, [eventToEdit, selectedDate, isOpen]);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const eventData = { title, date, startTime, endTime, type, notes };
        if (eventToEdit) {
            onSave({ ...eventData, id: eventToEdit.id });
        } else {
            onSave(eventData);
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[110] p-4" onClick={onClose}>
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" 
                onClick={e => e.stopPropagation()}
            >
                <header className="flex justify-between items-center p-5 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-brand-dark">{eventToEdit ? 'Edit Event' : 'Add New Event'}</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 transition-colors">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </header>
                
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Event Title</label>
                            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full input"/>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                                <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full input"/>
                            </div>
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-1">Event Type</label>
                                <select id="type" value={type} onChange={e => setType(e.target.value as EventType)} className="w-full input">
                                    {Object.values(EventType).map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="startTime" className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                                <input type="time" id="startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className="w-full input"/>
                            </div>
                             <div>
                                <label htmlFor="endTime" className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
                                <input type="time" id="endTime" value={endTime} onChange={(e) => setEndTime(e.target.value)} required className="w-full input"/>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">Notes (optional)</label>
                            <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full input"></textarea>
                        </div>
                    </div>

                    <footer className="bg-slate-50 p-4 rounded-b-xl flex justify-between items-center">
                        <div>
                        {eventToEdit && (
                            <button 
                                type="button" 
                                onClick={() => onDelete(eventToEdit.id)}
                                className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50"
                            >
                                <TrashIcon className="w-5 h-5"/>
                            </button>
                        )}
                        </div>
                        <div className="flex space-x-3">
                             <button type="button" onClick={onClose} className="bg-white text-slate-700 px-5 py-2.5 rounded-lg font-semibold border border-slate-300 hover:bg-slate-50">Cancel</button>
                             <button type="submit" className="bg-brand-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-opacity-90">Save Event</button>
                        </div>
                    </footer>
                </form>
            </div>
             <style>{`
                .input {
                    @apply px-3 py-2 border border-slate-300 rounded-md focus:ring-brand-primary focus:border-brand-primary;
                }
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

export default EventModal;
