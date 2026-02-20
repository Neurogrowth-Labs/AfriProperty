import React from 'react';
import type { Notification } from '../types';
import { NotificationType } from '../types';
import { ListingsIcon } from './icons/AgentDashboardIcons';
import { BellIcon, ChatBubbleLeftRightIcon, TrophyIcon } from './icons/ActionIcons';

interface NotificationsPanelProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
  onMarkAllAsRead: () => void;
}

const NotificationIcon: React.FC<{ type: NotificationType }> = ({ type }) => {
  switch (type) {
    case NotificationType.NEW_LISTING:
      return <ListingsIcon className="w-6 h-6 text-blue-500" />;
    case NotificationType.ADMIN_MESSAGE:
      return <BellIcon className="w-6 h-6 text-slate-500" />;
    case NotificationType.INQUIRY:
      return <ChatBubbleLeftRightIcon className="w-6 h-6 text-green-500" />;
    case NotificationType.ACHIEVEMENT:
      return <TrophyIcon className="w-6 h-6 text-amber-500" />;
    default:
      return <BellIcon className="w-6 h-6 text-slate-500" />;
  }
};

const TimeAgo: React.FC<{ timestamp: number }> = ({ timestamp }) => {
    const now = Date.now();
    const seconds = Math.floor((now - timestamp) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return <span>{Math.floor(interval)}y ago</span>;
    interval = seconds / 2592000;
    if (interval > 1) return <span>{Math.floor(interval)}mo ago</span>;
    interval = seconds / 86400;
    if (interval > 1) return <span>{Math.floor(interval)}d ago</span>;
    interval = seconds / 3600;
    if (interval > 1) return <span>{Math.floor(interval)}h ago</span>;
    interval = seconds / 60;
    if (interval > 1) return <span>{Math.floor(interval)}m ago</span>;
    return <span>{Math.floor(seconds)}s ago</span>;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications, onNotificationClick, onMarkAllAsRead }) => {
  return (
    <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200/80 dark:border-slate-700 z-50 flex flex-col max-h-[80vh]">
      <header className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
        <h3 className="font-bold text-lg text-brand-dark dark:text-white">Notifications</h3>
        <button onClick={onMarkAllAsRead} className="text-sm font-semibold text-brand-primary hover:underline">
          Mark all as read
        </button>
      </header>

      <div className="flex-grow overflow-y-auto">
        {notifications.length > 0 ? (
          <ul className="divide-y divide-slate-100 dark:divide-slate-700">
            {notifications.map(noti => (
              <li key={noti.id}>
                <button
                  onClick={() => onNotificationClick(noti)}
                  className={`w-full text-left p-4 transition-colors ${noti.isRead ? 'bg-white dark:bg-slate-800' : 'bg-blue-50 dark:bg-blue-900/20'} hover:bg-slate-100 dark:hover:bg-slate-700`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <NotificationIcon type={noti.type} />
                    </div>
                    <div>
                      <p className={`font-semibold ${noti.isRead ? 'text-slate-700 dark:text-slate-200' : 'text-brand-dark dark:text-white'}`}>{noti.title}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{noti.message}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        <TimeAgo timestamp={noti.timestamp} />
                      </p>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-10 text-center">
            <BellIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">No new notifications</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;