
import React, { useState } from 'react';

interface Notification {
  type: string;
  title: string;
  time: string;
  icon: string;
  unread: boolean;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    { type: 'Update', title: 'Season 5 Live!', time: '2 hours ago', icon: '🚀', unread: true },
    { type: 'Challenge', title: 'Lexi_Queen challenged you!', time: '5 hours ago', icon: '⚔️', unread: true },
    { type: 'Reward', title: 'Daily Streak Maintained (Day 5)', time: '12 hours ago', icon: '🔥', unread: false },
    { type: 'System', title: 'Scheduled maintenance at 02:00 UTC', time: '1 day ago', icon: '⚙️', unread: false },
  ]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const markAsRead = (index: number) => {
    setNotifications(prev => prev.map((n, i) => i === index ? { ...n, unread: false } : n));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="p-8 max-w-3xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-10 animate-in fade-in duration-500">
        <div>
          <h2 className="text-4xl font-black text-white">Notifications</h2>
          {unreadCount > 0 && (
            <p className="text-[#8cc63f] text-xs font-black uppercase tracking-widest mt-1">
              You have {unreadCount} unread message{unreadCount > 1 ? 's' : ''}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="text-sm font-bold text-[#8cc63f] hover:text-[#a3d95a] hover:underline transition-all active:scale-95"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((a, i) => (
          <div 
            key={i} 
            onClick={() => markAsRead(i)}
            className={`p-6 rounded-3xl border flex items-center space-x-6 hover:bg-[#2a2a2a] transition-all cursor-pointer group animate-in slide-in-from-bottom-2 duration-300 ${
              a.unread 
                ? 'bg-[#242424] border-[#8cc63f]/30 shadow-lg shadow-[#8cc63f]/5' 
                : 'bg-[#1e1e1e] border-gray-800/50 opacity-70'
            }`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 transition-transform group-hover:scale-110 ${
              a.unread ? 'bg-[#8cc63f]/10 text-[#8cc63f]' : 'bg-gray-800 text-gray-500'
            }`}>
              {a.icon}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                  a.unread ? 'text-[#8cc63f]' : 'text-gray-500'
                }`}>
                  {a.type}
                </span>
                <span className="text-[10px] text-gray-600 font-bold">{a.time}</span>
              </div>
              <h4 className={`font-bold text-lg transition-colors ${a.unread ? 'text-white' : 'text-gray-400'}`}>
                {a.title}
              </h4>
            </div>
            {a.unread && (
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8cc63f] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8cc63f]"></span>
              </div>
            )}
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="py-20 text-center opacity-20">
            <div className="text-6xl mb-4">📭</div>
            <p className="font-black uppercase tracking-widest">No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
