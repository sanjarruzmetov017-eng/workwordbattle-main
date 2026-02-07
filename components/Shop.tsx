
import React, { useState } from 'react';
import { UserStats, View } from '../types';

interface ShopProps {
  stats: UserStats;
  onUpdateStats: (s: Partial<UserStats>) => void;
  onNavigate?: (view: View) => void;
}

interface ShopItem {
  id: string;
  name: string;
  price: number;
  type: string;
  icon: string;
  desc: string;
}

const Shop: React.FC<ShopProps> = ({ stats, onUpdateStats, onNavigate }) => {
  const [tab, setTab] = useState('AVATARS');
  const [purchasedIds, setPurchasedIds] = useState<string[]>(['0']); // Assume default avatar is owned
  const [equippedIds, setEquippedIds] = useState<Record<string, string>>({
    'AVATARS': '0',
    'THEMES': 'default',
    'EFFECTS': 'default'
  });
  const [showSuccess, setShowSuccess] = useState<string | null>(null);
  
  const items: ShopItem[] = [
    { id: '1', name: 'Cyberpunk Avatar', price: 500, type: 'AVATARS', icon: '🤖', desc: 'A neon-infused robotic identity.' },
    { id: '2', name: 'Golden Frame', price: 1000, type: 'AVATARS', icon: '🖼️', desc: 'The ultimate mark of wealth.' },
    { id: '3', name: 'Matrix Theme', price: 750, type: 'THEMES', icon: '📟', desc: 'Digital rain for your interface.' },
    { id: '4', name: 'Neon Trail', price: 300, type: 'EFFECTS', icon: '✨', desc: 'Words glow as you type them.' },
    { id: '5', name: 'Phoenix Flame', price: 1200, type: 'EFFECTS', icon: '🔥', desc: 'Burn through your opponents.' },
    { id: '6', name: 'Ghost Mode', price: 600, type: 'THEMES', icon: '👻', desc: 'A semi-transparent stealth look.' },
    { id: '7', name: 'Samurai Mask', price: 850, type: 'AVATARS', icon: '🥷', desc: 'Ancient honor in digital form.' },
  ];

  const handlePurchase = (item: ShopItem) => {
    if (stats.coins >= item.price) {
      onUpdateStats({ coins: stats.coins - item.price });
      setPurchasedIds(prev => [...prev, item.id]);
      setShowSuccess(`Purchased ${item.name}!`);
      setTimeout(() => setShowSuccess(null), 3000);
    }
  };

  const handleEquip = (item: ShopItem) => {
    setEquippedIds(prev => ({
      ...prev,
      [item.type]: item.id
    }));
    setShowSuccess(`${item.name} Equipped!`);
    setTimeout(() => setShowSuccess(null), 2000);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-black mb-2 text-white">Item Shop</h2>
          <p className="text-gray-500 text-lg font-medium">Customize your profile and battle experience.</p>
        </div>
        <div className="bg-[#1e1e1e] px-8 py-4 rounded-[2rem] flex items-center space-x-4 border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className="text-3xl animate-bounce">🪙</span>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Your Balance</span>
            <span className="text-2xl font-black text-white">{stats.coins.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex space-x-3 mb-12">
        {['AVATARS', 'THEMES', 'EFFECTS'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-10 py-4 rounded-2xl font-black transition-all transform active:scale-95 text-sm tracking-wider ${
              tab === t 
                ? 'bg-[#8cc63f] text-black shadow-lg shadow-green-900/20' 
                : 'bg-gray-800/50 text-gray-500 hover:text-white border border-transparent hover:border-white/10'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.filter(i => i.type === tab).map(item => {
          const isPurchased = purchasedIds.includes(item.id);
          const isEquipped = equippedIds[item.type] === item.id;
          const canAfford = stats.coins >= item.price;

          return (
            <div 
              key={item.id} 
              className={`bg-[#242424] rounded-[2.5rem] p-6 border-2 transition-all group flex flex-col justify-between h-full relative overflow-hidden ${
                isEquipped 
                  ? 'border-[#8cc63f] shadow-2xl shadow-green-900/10' 
                  : isPurchased 
                    ? 'border-gray-700 hover:border-gray-600' 
                    : 'border-gray-800 hover:border-gray-700'
              }`}
            >
              {isEquipped && (
                <div className="absolute top-4 right-4 bg-[#8cc63f] text-black text-[9px] font-black px-2 py-1 rounded-md">
                  ACTIVE
                </div>
              )}
              
              <div>
                <div className="w-full aspect-square bg-[#1a1a1a] rounded-[2rem] mb-6 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-500 shadow-inner relative">
                   <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-[2rem]"></div>
                   {item.icon}
                </div>
                <h4 className="font-black text-xl text-center mb-1 text-white">{item.name}</h4>
                <p className="text-gray-500 text-xs text-center font-medium mb-8 px-4 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {isPurchased ? (
                <button 
                  onClick={() => handleEquip(item)}
                  disabled={isEquipped}
                  className={`w-full py-4 rounded-2xl font-black transition-all transform active:scale-95 flex items-center justify-center space-x-2 ${
                    isEquipped 
                      ? 'bg-gray-800 text-gray-500 cursor-default' 
                      : 'bg-white text-black hover:bg-gray-200 shadow-xl'
                  }`}
                >
                  {isEquipped ? 'EQUIPPED' : 'EQUIP'}
                </button>
              ) : (
                <button 
                  onClick={() => handlePurchase(item)}
                  disabled={!canAfford}
                  className={`w-full py-4 rounded-2xl font-black transition-all transform active:scale-95 flex items-center justify-center space-x-2 ${
                    canAfford 
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-black shadow-lg shadow-yellow-500/20' 
                      : 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-50 grayscale'
                  }`}
                >
                  <span className="text-lg">🪙</span>
                  <span>{item.price.toLocaleString()}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {items.filter(i => i.type === tab).length === 0 && (
        <div className="py-32 text-center opacity-20">
          <div className="text-8xl mb-6">📦</div>
          <h3 className="text-2xl font-black uppercase tracking-widest">Coming Soon</h3>
        </div>
      )}

      {/* Success Feedback Toast */}
      {showSuccess && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#8cc63f] text-black px-10 py-5 rounded-[2rem] font-black shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-300 z-50 flex items-center space-x-4 border-4 border-black/10">
          <span className="text-2xl">✨</span>
          <span className="text-lg">{showSuccess}</span>
        </div>
      )}
      
      {/* Banner */}
      <div 
        onClick={() => onNavigate && onNavigate(View.PREMIUM)}
        className="mt-20 p-10 bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-white/5 rounded-[3rem] flex flex-col md:flex-row items-center justify-between cursor-pointer hover:border-purple-500/30 transition-colors group"
      >
        <div className="mb-6 md:mb-0">
          <h3 className="text-2xl font-black text-white mb-2 group-hover:text-purple-400 transition-colors">Want 50% Off Everything?</h3>
          <p className="text-gray-500 font-medium">PRO members get exclusive discounts and weekly free items.</p>
        </div>
        <button className="px-10 py-4 bg-white text-black font-black rounded-2xl hover:bg-gray-200 transition-all shadow-xl group-hover:scale-105">
          Upgrade to PRO
        </button>
      </div>
    </div>
  );
};

export default Shop;
