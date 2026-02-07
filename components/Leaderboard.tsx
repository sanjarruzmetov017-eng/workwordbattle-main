
import React, { useState } from 'react';

interface Tournament {
  id: number;
  title: string;
  isLive: boolean;
  players: string;
  format: string;
  reward: string;
  time: string;
  description: string;
}

interface LeaderboardProps {
  onJoinArena?: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ onJoinArena }) => {
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);

  const tournaments: Tournament[] = [
    {
      id: 1,
      title: 'Weekly Championship',
      isLive: true,
      players: '1,200 Players',
      format: 'KNOCKOUT',
      reward: '$500',
      time: 'Live',
      description: 'The premier weekly event for the best word smiths. Fight through 10 rounds of knockout action to claim the grand prize.'
    },
    {
      id: 2,
      title: 'Hourly Blitz Arena',
      isLive: false,
      players: '142 Players',
      format: 'ARENA',
      reward: '🏆 Badge',
      time: '10 min',
      description: 'Fast-paced action every hour. Score as many points as possible in 60 minutes to climb the leaderboard.'
    },
    {
      id: 3,
      title: 'Suffix Survival',
      isLive: false,
      players: '85 Players',
      format: 'SURVIVAL',
      reward: '500 Coins',
      time: '2 hours',
      description: 'Can you survive when every word must end with -TION? Special rule tournament for experts.'
    }
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-white/90 uppercase tracking-tight">Active Tournaments</h2>
          <div className="flex space-x-2">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Global Servers Online</span>
          </div>
        </div>
        
        <div className="bg-[#242424] rounded-[2.5rem] p-8 shadow-2xl border border-white/5 space-y-4">
          {tournaments.map((t) => (
            <div 
              key={t.id} 
              className="bg-[#1a1a1a] rounded-[1.5rem] p-7 flex items-center justify-between border border-transparent hover:border-white/5 transition-all group relative overflow-hidden"
            >
              {t.isLive && (
                <div className="absolute top-0 left-0 w-1 h-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
              )}
              
              <div className="flex flex-col">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-black text-white group-hover:text-[#8cc63f] transition-colors">{t.title}</h3>
                  {t.isLive && (
                    <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase flex items-center shadow-lg shadow-red-600/20">
                      LIVE
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <span className="flex items-center">
                    <span className="text-red-500 mr-2">⏰</span> {t.time}
                  </span>
                  <span className="flex items-center">
                    <span className="text-blue-500 mr-2">👥</span> {t.players}
                  </span>
                  <span className="bg-gray-800/50 px-2.5 py-1 rounded-lg text-[9px] text-gray-400">
                    {t.format}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-10">
                <div className="text-right">
                  <div className={`text-xl font-black ${t.reward.includes('$') ? 'text-[#ffcc33]' : 'text-gray-300'}`}>
                    {t.reward}
                  </div>
                  <div className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter">PRIZE POOL</div>
                </div>
                <button 
                  onClick={() => setSelectedTournament(t)}
                  className="bg-[#333] hover:bg-[#444] text-white font-black px-10 py-3.5 rounded-2xl transition-all shadow-lg active:scale-95 border border-white/5"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tournament Details Modal */}
      {selectedTournament && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-6 animate-in fade-in duration-300">
          <div className="bg-[#1e1e1e] w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl border border-gray-800 relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setSelectedTournament(null)}
              className="absolute top-8 right-8 text-gray-500 hover:text-white transition text-2xl"
            >
              ✕
            </button>

            <div className="flex items-start space-x-8 mb-10">
              <div className="w-24 h-24 bg-gradient-to-br from-[#8cc63f] to-[#4c7e0c] rounded-[2rem] flex items-center justify-center text-5xl shadow-xl shadow-green-900/20">
                🏆
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-4xl font-black text-white uppercase tracking-tight">{selectedTournament.title}</h3>
                  {selectedTournament.isLive && (
                    <span className="bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase">LIVE</span>
                  )}
                </div>
                <p className="text-gray-400 font-medium leading-relaxed">{selectedTournament.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-12">
              <div className="bg-[#161616] p-6 rounded-3xl border border-white/5">
                <div className="text-[10px] font-black text-gray-600 uppercase mb-2 tracking-widest">Participants</div>
                <div className="text-2xl font-black text-white">{selectedTournament.players.split(' ')[0]}</div>
              </div>
              <div className="bg-[#161616] p-6 rounded-3xl border border-white/5">
                <div className="text-[10px] font-black text-gray-600 uppercase mb-2 tracking-widest">Entry Fee</div>
                <div className="text-2xl font-black text-[#8cc63f]">FREE</div>
              </div>
              <div className="bg-[#161616] p-6 rounded-3xl border border-white/5">
                <div className="text-[10px] font-black text-gray-600 uppercase mb-2 tracking-widest">Rewards</div>
                <div className="text-2xl font-black text-[#ffcc33]">{selectedTournament.reward}</div>
              </div>
            </div>

            <div className="bg-[#161616] rounded-3xl p-8 mb-10 border border-white/5">
               <div className="flex justify-between items-center mb-6">
                 <h4 className="font-black uppercase tracking-widest text-xs text-gray-500">Live Bracket</h4>
                 <span className="text-[10px] font-bold text-green-500">Auto-updating...</span>
               </div>
               <div className="space-y-4 opacity-40">
                 <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="font-bold">Player_One</span>
                    <span className="text-[#8cc63f] font-black">2,450</span>
                 </div>
                 <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="font-bold">GrandMaster_X</span>
                    <span className="text-[#8cc63f] font-black">2,410</span>
                 </div>
                 <div className="flex items-center justify-center pt-2">
                    <span className="text-[10px] font-bold text-gray-600 uppercase">View All Standings</span>
                 </div>
               </div>
            </div>

            <div className="flex space-x-4">
              <button 
                onClick={() => setSelectedTournament(null)}
                className="flex-1 py-5 bg-[#333] hover:bg-[#444] text-white font-black rounded-[1.5rem] transition-all"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  setSelectedTournament(null);
                  if (onJoinArena) onJoinArena();
                }}
                className="flex-[2] py-5 bg-[#8cc63f] hover:bg-[#7db338] text-black font-black rounded-[1.5rem] transition-all shadow-xl shadow-green-900/20 active:scale-95 flex items-center justify-center space-x-3"
              >
                <span className="text-xl">⚔️</span>
                <span>JOIN ARENA</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
