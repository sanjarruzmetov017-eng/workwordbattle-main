
import React from 'react';

const Puzzles: React.FC = () => {
  const puzzles = [
    { id: 1, title: 'Word Chain Master', difficulty: 'Medium', reward: '50 🪙', status: 'Available' },
    { id: 2, title: 'Reverse Chain', difficulty: 'Hard', reward: '100 🪙', status: 'Locked' },
    { id: 3, title: 'Suffix Survival', difficulty: 'Easy', reward: '25 🪙', status: 'Completed' },
    { id: 4, title: 'Vowel Vanish', difficulty: 'Expert', reward: '200 🪙', status: 'Locked' },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-10">
        <h2 className="text-4xl font-black mb-2">Puzzles</h2>
        <p className="text-gray-500 text-lg">Sharpen your mind with tactical word challenges.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {puzzles.map((p) => (
          <div key={p.id} className="bg-[#242424] border border-gray-800 p-8 rounded-3xl group hover:border-green-500/50 transition cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition">🧩</div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                p.status === 'Available' ? 'bg-blue-500/20 text-blue-400' : 
                p.status === 'Completed' ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-500'
              }`}>
                {p.status}
              </span>
            </div>
            <h3 className="text-2xl font-black mb-2">{p.title}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-400 mb-8">
              <span>{p.difficulty}</span>
              <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
              <span className="text-yellow-500 font-bold">{p.reward} Reward</span>
            </div>
            <button className={`w-full py-4 rounded-xl font-black transition ${
              p.status === 'Locked' ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-green-500 text-black hover:bg-green-600'
            }`}>
              {p.status === 'Completed' ? 'REPLAY' : p.status === 'Locked' ? 'LOCKED' : 'START PUZZLE'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Puzzles;
