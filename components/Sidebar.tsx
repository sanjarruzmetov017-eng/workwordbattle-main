
import React from 'react';
import { View, UserStats } from '../types';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  onLogout: () => void;
  stats: UserStats;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, onLogout, stats }) => {
  const primaryItems = [
    { id: View.DASHBOARD, label: 'Play', icon: '🎮' },
    { id: View.WORDS, label: 'Words', icon: '📖' },
    { id: View.PUZZLES, label: 'Puzzles', icon: '🧩' },
    { id: View.LEARN, label: 'Learn', icon: '🎓' },
    { id: View.TOURNAMENTS, label: 'Tournaments', icon: '🏆' },
    { id: View.SOCIAL, label: 'Social', icon: '👥' },
    { id: View.PROFILE, label: 'Profile', icon: '👤' },
    { id: View.SHOP, label: 'Store', icon: '🛒' },
    { id: View.ACHIEVEMENTS, label: 'Awards', icon: '🏅' },
    { id: View.SETTINGS, label: 'Settings', icon: '⚙️' },
    { id: View.PREMIUM, label: 'Premium', icon: '💎' },
  ];

  const secondaryItems = [
    { id: View.SUPPORT, label: 'Support', icon: '💬' },
    { id: View.NOTIFICATIONS, label: 'Notifications', icon: '🔔', badge: 1 },
    { id: View.THEME, label: 'Theme', icon: '☀️' },
  ];

  const NavButton: React.FC<{ item: any; onClick: () => void; isActive: boolean }> = ({ item, onClick, isActive }) => {
    return (
      <button
        onClick={onClick}
        className={`w-full flex items-center px-6 py-3 transition-all duration-200 group relative ${
          isActive 
            ? 'bg-[#262626]' 
            : 'hover:bg-[#222222]'
        }`}
      >
        {isActive && (
          <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#8cc63f] shadow-[2px_0_10px_rgba(140,198,63,0.3)]"></div>
        )}
        <span className="text-xl mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
          {item.icon}
        </span>
        <span className={`font-bold text-[15px] tracking-tight ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
          {item.label}
        </span>
        {item.badge && (
          <span className="ml-auto bg-[#ff3b30] text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-[#1a1a1a]">
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside className="hidden md:flex w-64 bg-[#1a1a1a] flex-col h-screen sticky top-0 border-r border-white/5 shadow-2xl z-50">
      {/* Logo Area */}
      <div className="p-7 mb-4 flex items-center space-x-4">
        <div className="text-4xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">⚔️</div>
        <div className="flex flex-col text-white">
          <span className="font-black text-xl leading-none uppercase tracking-tighter">WORD</span>
          <span className="font-black text-xl leading-none uppercase tracking-tighter">BATTLE</span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-2">
        <div className="space-y-0.5">
          {primaryItems.map((item) => (
            <NavButton 
              key={item.id} 
              item={item} 
              onClick={() => onNavigate(item.id)}
              isActive={currentView === item.id || (item.id === View.DASHBOARD && currentView === View.GAME)}
            />
          ))}
        </div>

        <div className="h-10"></div>

        <div className="space-y-0.5 mb-8">
          {secondaryItems.map((item) => (
            <NavButton 
              key={item.id} 
              item={item} 
              onClick={() => onNavigate(item.id)}
              isActive={currentView === item.id}
            />
          ))}
          
          <button
            onClick={onLogout}
            className="w-full flex items-center px-6 py-3 text-gray-400 hover:bg-[#222222] transition-all group"
          >
            <span className="text-xl mr-4 group-hover:scale-110 transition-transform">🚪</span>
            <span className="font-bold text-[15px] tracking-tight group-hover:text-gray-200">Log Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
