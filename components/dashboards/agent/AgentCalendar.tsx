
import React, { useState, useMemo } from 'react';
import type { CalendarEvent } from '../../../types';
import { EventType } from '../../../types';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import EventModal from '../../EventModal';
import ShareAvailabilityModal from '../../ShareAvailabilityModal';
import { ShareIcon } from '../../icons/AgentDashboardIcons';

interface AgentCalendarProps {
  calendarEvents: CalendarEvent[];
  onAddEvent: (eventData: Omit<CalendarEvent, 'id'>) => void;
  onUpdateEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: string) => void;
}

const eventColors: Record<EventType, string> = {
  [EventType.SHOWING]: 'bg-blue-500 border-blue-600',
  [EventType.MEETING]: 'bg-green-500 border-green-600',
  [EventType.DEADLINE]: 'bg-red-500 border-red-600',
};

const AgentCalendar: React.FC<AgentCalendarProps> = ({ calendarEvents, onAddEvent, onUpdateEvent, onDeleteEvent }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const daysInMonth = Array.from({ length: lastDayOfMonth.getDate() }, (_, i) => i + 1);
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, ...

    const eventsByDate = useMemo(() => {
        return calendarEvents.reduce((acc, event) => {
            (acc[event.date] = acc[event.date] || []).push(event);
            return acc;
        }, {} as Record<string, CalendarEvent[]>);
    }, [calendarEvents]);

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    const handleOpenEventModal = (event?: CalendarEvent, date?: string) => {
        setSelectedEvent(event || null);
        setSelectedDate(date || null);
        setIsEventModalOpen(true);
    };

    const handleSaveEvent = (eventData: Omit<CalendarEvent, 'id'> | CalendarEvent) => {
        if ('id' in eventData) {
            onUpdateEvent(eventData);
        } else {
            onAddEvent(eventData);
        }
        setIsEventModalOpen(false);
    };
    
    const handleDelete = (eventId: string) => {
        if(window.confirm('Are you sure you want to delete this event?')) {
            onDeleteEvent(eventId);
            setIsEventModalOpen(false);
        }
    }

    return (
        <div className="p-4 sm:p-8 h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Calendar & Scheduling</h2>
                    <p className="text-slate-500 mt-1">Manage your appointments and share your availability.</p>
                </div>
                <div className="flex items-center gap-2">
                     <button onClick={() => setIsShareModalOpen(true)} className="px-4 py-2 text-sm font-semibold bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2">
                        <ShareIcon className="w-4 h-4" /> Share Availability
                    </button>
                    <button onClick={() => handleOpenEventModal(undefined, new Date().toISOString().split('T')[0])} className="px-4 py-2 text-sm font-semibold bg-brand-primary text-white rounded-lg hover:bg-opacity-90">Add Event</button>
                </div>
            </div>

            {/* Calendar Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-3 rounded-t-lg border-b shadow-sm gap-2">
                <div className="flex items-center gap-4">
                     <h3 className="text-lg sm:text-xl font-semibold text-slate-800">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h3>
                    <div className="flex items-center gap-1">
                        <button onClick={() => changeMonth(-1)} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500"><ChevronLeftIcon className="w-5 h-5" /></button>
                        <button onClick={() => setCurrentDate(new Date())} className="text-sm font-semibold px-3 py-1 rounded-md hover:bg-slate-100 text-slate-600 border border-slate-300">Today</button>
                        <button onClick={() => changeMonth(1)} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500"><ChevronRightIcon className="w-5 h-5" /></button>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => alert("Simulating sync with Google Calendar...")} className="text-xs font-semibold px-3 py-1.5 bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200">Sync with Google</button>
                    <button onClick={() => alert("Simulating sync with Outlook Calendar...")} className="text-xs font-semibold px-3 py-1.5 bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200">Sync with Outlook</button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 flex-grow bg-white rounded-b-lg shadow-sm">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-semibold text-xs sm:text-sm text-slate-500 py-1 sm:py-2 border-b border-r">{day}</div>
                ))}
                {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} className="border-b border-r"></div>
                ))}
                {daysInMonth.map(day => {
                    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dayEvents = eventsByDate[dateStr] || [];
                    const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
                    return (
                        <div key={day} className="border-b border-r p-1 sm:p-2 flex flex-col min-h-[80px] sm:min-h-[120px] cursor-pointer hover:bg-slate-50" onClick={() => handleOpenEventModal(undefined, dateStr)}>
                            <span className={`font-semibold text-xs sm:text-sm self-end ${isToday ? 'bg-brand-primary text-white rounded-full w-6 h-6 flex items-center justify-center' : 'text-slate-700'}`}>{day}</span>
                            <div className="mt-1 space-y-1 overflow-y-auto">
                                {dayEvents.map(event => (
                                    <button 
                                        key={event.id}
                                        onClick={(e) => { e.stopPropagation(); handleOpenEventModal(event, dateStr); }}
                                        className={`w-full text-left text-xs text-white p-1 sm:p-1.5 rounded-md truncate ${eventColors[event.type]}`}
                                    >
                                        <span className="font-bold hidden sm:inline">{event.startTime}</span> {event.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {isEventModalOpen && (
                <EventModal 
                    isOpen={isEventModalOpen}
                    onClose={() => setIsEventModalOpen(false)}
                    onSave={handleSaveEvent}
                    onDelete={handleDelete}
                    eventToEdit={selectedEvent}
                    selectedDate={selectedDate}
                />
            )}

            {isShareModalOpen && (
                <ShareAvailabilityModal 
                    isOpen={isShareModalOpen}
                    onClose={() => setIsShareModalOpen(false)}
                />
            )}
        </div>
    );
};

export default AgentCalendar;
