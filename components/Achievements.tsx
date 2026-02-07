
import React from 'react';

const Achievements: React.FC = () => {
  const list = [
    { title: 'First Blood', desc: 'Win your first game', completed: true, progress: 100, reward: 'Badge: Novice' },
    { title: 'Scholer', desc: 'Play 500 unique words', completed: false, progress: 40, reward: 'Badge: Lexicist' },
    { title: 'Speed Demon', desc: 'Win a Bullet game in < 45s', completed: false, progress: 0, reward: '100 Coins' },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-4xl font-black mb-2">Achievements</h2>
          <p className="text-gray-500">Complete challenges to earn XP and unique rewards.</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-green-500 mb-1">Total Progress</div>
          <div className="text-2xl font-black">1/12</div>
        </div>
      </div>

      <div className="space-y-4">
        {list.map((item, idx) => (
          <div 
            key={idx} 
            className={`p-6 rounded-3xl border border-gray-800 flex items-center space-x-6 transition ${
              item.completed ? 'bg-green-500/10 border-green-500/30' : 'bg-[#242424]'
            }`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 ${
              item.completed ? 'bg-green-500 text-black' : 'bg-gray-800 text-gray-600'
            }`}>
              {item.completed ? '✓' : '🔒'}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{item.desc}</p>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${item.completed ? 'bg-green-500' : 'bg-yellow-500'}`}
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>
            </div>
            <div className="text-right shrink-0">
               <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Reward</div>
               <div className="text-xs font-bold text-white">{item.reward}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
