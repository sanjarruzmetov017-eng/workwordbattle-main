
import React from 'react';
import { View } from '../types';

interface BottomNavProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  const items = [
    { id: View.DASHBOARD, label: 'Play', icon: '🎮' },
    { id: View.WORDS, label: 'Words', icon: '📖' },
    { id: View.SOCIAL, label: 'Social', icon: '👥' },
    { id: View.SHOP, label: 'Store', icon: '🛒' },
    { id: View.PROFILE, label: 'Me', icon: '👤' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1a1a1a]/95 backdrop-blur-lg border-t border-white/10 z-[100] flex justify-around items-center px-2 py-3 shadow-2xl">
      {items.map((item) => {
        const isActive = currentView === item.id || (item.id === View.DASHBOARD && currentView === View.GAME);
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="flex flex-col items-center justify-center space-y-1 relative px-4"
          >
            <span className={`text-2xl transition-transform ${isActive ? 'scale-110 -translate-y-1' : 'opacity-60'}`}>
              {item.icon}
            </span>
            <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-[#8cc63f]' : 'text-gray-500'}`}>
              {item.label}
            </span>
            {isActive && (
              <div className="absolute -top-3 w-1.5 h-1.5 bg-[#8cc63f] rounded-full shadow-[0_0_10px_#8cc63f]"></div>
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
