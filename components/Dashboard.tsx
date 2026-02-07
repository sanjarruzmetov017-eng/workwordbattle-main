
import React from 'react';
import { GameMode, View, UserStats } from '../types';

interface DashboardProps {
  stats: UserStats;
  onStartGame: (mode: GameMode) => void;
  onNavigate: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, onStartGame, onNavigate }) => {
  const winRate = Math.round((stats.wins / (stats.wins + stats.losses + stats.draws)) * 100) || 0;

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-[1400px] mx-auto space-y-6 md:space-y-10 animate-in fade-in duration-700">
      
      {/* Top Banner Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div 
          onClick={() => onNavigate(View.ACHIEVEMENTS)}
          className="md:col-span-1 bg-gradient-to-br from-[#ff4b2b] to-[#ff416c] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 flex justify-between items-center relative overflow-hidden group shadow-2xl cursor-pointer"
        >
          <div className="relative z-10">
            <div className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Current Streak</div>
            <div className="text-3xl md:text-5xl font-black text-white">{stats.streak} Days</div>
            <p className="text-white/80 text-[10px] font-bold mt-2">Don't let the fire go out!</p>
          </div>
          <div className="text-6xl md:text-8xl opacity-20 absolute -right-4 -bottom-4 transform group-hover:scale-110 transition-all duration-500">🔥</div>
        </div>
        
        <div className="md:col-span-2 bg-gradient-to-r from-[#6a11cb] via-[#2575fc] to-[#00d2ff] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 flex flex-col sm:flex-row justify-between items-center group relative overflow-hidden shadow-2xl">
          <div className="relative z-10 text-center sm:text-left mb-4 sm:mb-0">
            <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-[9px] font-black text-white uppercase tracking-widest mb-2 backdrop-blur-md">New Feature</div>
            <div className="text-2xl md:text-3xl font-black text-white mb-1 tracking-tight">Vocabulary Quiz</div>
            <div className="text-white/70 text-xs md:text-sm font-medium">Add your own words and let AI test your knowledge.</div>
          </div>
          <button 
            onClick={() => onStartGame(GameMode.VOCAB_QUIZ)}
            className="relative z-10 w-full sm:w-auto px-8 py-3 bg-white text-blue-700 font-black rounded-xl hover:bg-gray-100 hover:scale-105 transition-all text-sm md:text-base"
          >
            Start Quiz
          </button>
          <div className="text-[10rem] opacity-10 absolute -right-10 -top-10 transform rotate-12 pointer-events-none">🎓</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 md:gap-10">
        
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6 md:space-y-10">
          
          {/* Game Mode Selector */}
          <div className="bg-[#1e1e1e]/60 backdrop-blur-xl rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 border border-white/5 shadow-2xl">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-4xl font-black mb-2 tracking-tighter">Choose Your Battle</h2>
              <p className="text-gray-500 text-xs md:text-sm font-medium max-w-xs mx-auto">Fast-paced word duels. Real people, real stakes.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <ModeCard title="Bullet" time="1 min" icon="⚡" color="from-yellow-400 to-orange-500" onClick={() => onStartGame(GameMode.BULLET)} />
              <ModeCard title="Blitz" time="3 min" icon="🔥" popular color="from-green-400 to-emerald-600" onClick={() => onStartGame(GameMode.BLITZ)} />
              <ModeCard title="Rapid" time="10 min" icon="⏱️" color="from-blue-400 to-indigo-600" onClick={() => onStartGame(GameMode.RAPID)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mt-8 md:mt-10">
              <SecondaryModeButton icon="🤖" label="Vs Computer" sub="Levels 1-10" onClick={() => onStartGame(GameMode.COMPUTER)} />
              <SecondaryModeButton icon="🎓" label="Vocab Practice" sub="Test yourself" onClick={() => onStartGame(GameMode.VOCAB_QUIZ)} />
            </div>
          </div>

          {/* Daily Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div 
              onClick={() => onNavigate(View.LEARN)}
              className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] p-6 md:p-8 rounded-[2rem] border border-white/5 group cursor-pointer hover:border-green-500/30 transition shadow-xl"
            >
               <div className="flex items-center justify-between mb-4 md:mb-6">
                  <div className="px-3 py-1 bg-green-500/10 text-green-500 text-[9px] font-black uppercase tracking-widest rounded-full">Word of the Day</div>
                  <span className="text-xl group-hover:scale-125 transition">📖</span>
               </div>
               <div className="text-3xl md:text-4xl font-black mb-1 tracking-tighter group-hover:text-green-500 transition">Ephemeral</div>
               <p className="text-gray-400 text-sm italic mb-6 leading-relaxed">"Lasting for a very short time."</p>
               <div className="flex items-center space-x-2 text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span>Practice for +10XP</span>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-rows-2 gap-4">
               <DailyMiniCard icon="🧩" title="Daily Puzzle" sub="Solve challenge" coins="+50" onClick={() => onNavigate(View.PUZZLES)} />
               <DailyMiniCard icon="🏆" title="Daily Mission" sub="Win 3 games" progress="2/3" onClick={() => onNavigate(View.ACHIEVEMENTS)} />
            </div>
          </div>
        </div>

        {/* Right Sidebar Stats */}
        <div className="lg:col-span-4 space-y-6 md:space-y-8">
          <div className="bg-[#242424] rounded-[2rem] p-6 md:p-8 border border-white/5 shadow-2xl relative overflow-hidden">
             <div className="flex items-center justify-between mb-6 md:mb-8">
               <div onClick={() => onNavigate(View.PROFILE)} className="flex items-center space-x-3 md:space-x-4 cursor-pointer group">
                 <div className="relative">
                   <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-2xl md:text-3xl border border-white/10 overflow-hidden">
                    {stats.profileImage ? (
                      <img src={stats.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      stats.avatarEmoji || '👽'
                    )}
                   </div>
                   <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#242424] rounded-full"></div>
                 </div>
                 <div>
                   <div className="font-black text-lg md:text-xl tracking-tight group-hover:text-[#8cc63f] transition-colors leading-tight">{stats.username}</div>
                   <div className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Veteran S5</div>
                 </div>
               </div>
               <button onClick={() => onNavigate(View.SETTINGS)} className="w-8 h-8 md:w-10 md:h-10 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition">⚙️</button>
             </div>

             <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
               <StatMetric label="Blitz ELO" value={stats.elo} color="text-green-500" />
               <StatMetric label="Win Rate" value={`${winRate}%`} color="text-white" />
             </div>

             <div className="space-y-3">
               <div className="flex justify-between items-center text-[9px] font-black text-gray-500 uppercase tracking-widest">
                 <span>Level 12</span>
                 <span className="text-white">65%</span>
               </div>
               <div className="h-2 bg-black/40 rounded-full w-full overflow-hidden p-[1px]">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" style={{ width: '65%' }}></div>
               </div>
             </div>
          </div>

          <div className="hidden sm:block bg-[#1a1a1a] rounded-[2rem] p-6 md:p-8 border border-white/5 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-black uppercase tracking-widest text-[10px] text-gray-500">Friends Activity</h4>
              <button onClick={() => onNavigate(View.SOCIAL)} className="text-[9px] font-bold text-green-500">See All</button>
            </div>
            <div className="space-y-5">
               <ActivityItem name="WordMaster" action="Playing Blitz" time="Now" online onClick={() => onNavigate(View.SOCIAL)} />
               <ActivityItem name="Lexi_Queen" action="Won +15 ELO" time="10m" online onClick={() => onNavigate(View.SOCIAL)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ModeCard: React.FC<{ title: string, time: string, icon: string, color: string, popular?: boolean, onClick: () => void }> = ({ title, time, icon, color, popular, onClick }) => (
  <button 
    onClick={onClick}
    className="relative bg-white/5 hover:bg-white/10 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] transition-all group flex flex-col items-center border border-white/5 active:scale-95 shadow-lg"
  >
    {popular && (
      <div className="absolute -top-2 md:-top-3 left-1/2 transform -translate-x-1/2 bg-red-600 text-[8px] md:text-[9px] font-black px-2 md:px-3 py-1 rounded-full text-white tracking-widest">TOP</div>
    )}
    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-3xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl md:text-3xl mb-3 md:mb-4 shadow-2xl transition-transform group-hover:scale-110`}>
      {icon}
    </div>
    <div className="font-black text-lg text-white tracking-tight">{title}</div>
    <div className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{time}</div>
  </button>
);

const SecondaryModeButton: React.FC<{ icon: string, label: string, sub: string, onClick: () => void }> = ({ icon, label, sub, onClick }) => (
  <button onClick={onClick} className="flex items-center justify-between p-4 md:p-6 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl md:rounded-[2rem] transition-all active:scale-95">
    <div className="flex items-center space-x-3 md:space-x-4">
      <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-800 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl">{icon}</div>
      <div className="text-left">
        <div className="font-black text-sm md:text-base text-white">{label}</div>
        <div className="text-[8px] md:text-[9px] text-gray-500 font-black uppercase tracking-widest">{sub}</div>
      </div>
    </div>
    <span className="text-gray-600">→</span>
  </button>
);

const DailyMiniCard: React.FC<{ icon: string, title: string, sub: string, coins?: string, progress?: string, onClick: () => void }> = ({ icon, title, sub, coins, progress, onClick }) => (
  <div onClick={onClick} className="bg-[#242424] p-4 md:p-5 rounded-2xl md:rounded-3xl border border-white/5 hover:bg-[#2a2a2a] transition cursor-pointer flex items-center justify-between">
    <div className="flex items-center space-x-3 md:space-x-4">
      <div className="text-2xl md:text-3xl">{icon}</div>
      <div>
        <div className="font-black text-sm md:text-base">{title}</div>
        <div className="text-[10px] text-gray-500">{sub}</div>
      </div>
    </div>
    <div className={`font-black text-xs ${coins ? 'text-yellow-500' : 'text-blue-500'}`}>{coins ? `${coins} 🪙` : progress}</div>
  </div>
);

const StatMetric: React.FC<{ label: string, value: string | number, color: string }> = ({ label, value, color }) => (
  <div className="bg-black/20 p-4 rounded-2xl border border-white/5 text-center">
    <div className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1">{label}</div>
    <div className={`text-xl md:text-2xl font-black ${color}`}>{value}</div>
  </div>
);

const ActivityItem: React.FC<{ name: string, action: string, time: string, online?: boolean, onClick: () => void }> = ({ name, action, online, time, onClick }) => (
  <div onClick={onClick} className="flex items-center justify-between group cursor-pointer">
    <div className="flex items-center space-x-3">
      <div className="relative">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gray-800 flex items-center justify-center text-xs border border-white/5">👤</div>
        {online && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[#1a1a1a] rounded-full"></div>}
      </div>
      <div>
        <div className="text-[11px] font-black text-white group-hover:text-green-500 transition">{name}</div>
        <div className="text-[9px] text-gray-600 font-medium">{action}</div>
      </div>
    </div>
    <div className="text-[8px] text-gray-700 font-bold uppercase">{time}</div>
  </div>
);

export default Dashboard;
