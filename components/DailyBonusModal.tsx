
import React, { useState } from 'react';

interface DailyBonusModalProps {
  onClose: () => void;
  onClaim: (amount: number) => void;
}

const DailyBonusModal: React.FC<DailyBonusModalProps> = ({ onClose, onClaim }) => {
  const [claimed, setClaimed] = useState(false);
  
  const rewards = [
    { day: 1, amount: 100, type: 'coins' },
    { day: 2, amount: 150, type: 'coins', current: true },
    { day: 3, amount: 200, type: 'coins' },
    { day: 4, amount: 250, type: 'coins' },
    { day: 5, amount: 300, type: 'coins' },
    { day: 6, amount: 400, type: 'coins' },
    { day: 7, amount: 1000, type: 'grand' },
  ];

  const handleClaim = () => {
    setClaimed(true);
    onClaim(150);
    setTimeout(onClose, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[200] p-6">
      <div className="bg-[#1e1e1e] w-full max-w-4xl rounded-[40px] p-12 shadow-2xl border border-gray-800 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-yellow-500"></div>
        
        <h2 className="text-4xl font-black mb-2">Daily Login Bonus</h2>
        <p className="text-gray-500 mb-12">Come back every day to earn more coins!</p>

        <div className="grid grid-cols-7 gap-4 mb-12">
          {rewards.map(r => (
            <div 
              key={r.day}
              className={`p-4 rounded-2xl flex flex-col items-center justify-center transition ${
                r.current 
                  ? 'bg-green-500/10 border-2 border-green-500 scale-110 shadow-2xl' 
                  : r.day < 2 
                    ? 'bg-gray-800/50 opacity-50 grayscale' 
                    : 'bg-gray-800'
              }`}
            >
              <div className="text-[10px] font-black text-gray-500 uppercase mb-2">Day {r.day}</div>
              <div className="text-2xl mb-2">{r.type === 'grand' ? '💎' : '🪙'}</div>
              <div className="font-black text-lg">{r.amount}</div>
            </div>
          ))}
        </div>

        <button 
          onClick={handleClaim}
          disabled={claimed}
          className={`px-16 py-5 rounded-2xl font-black text-xl transition transform active:scale-95 ${
            claimed 
              ? 'bg-green-500/20 text-green-500 cursor-default' 
              : 'bg-green-500 text-black hover:bg-green-600 shadow-xl shadow-green-500/20'
          }`}
        >
          {claimed ? 'Claimed!' : 'CLAIM REWARD'}
        </button>

        {claimed && (
           <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="animate-ping text-8xl">✨</div>
           </div>
        )}
      </div>
    </div>
  );
};

export default DailyBonusModal;
