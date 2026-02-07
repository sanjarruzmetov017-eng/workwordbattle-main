
import React from 'react';
import { UserStats, View } from '../types';

interface ProfileProps {
  stats: UserStats;
  onNavigate?: (view: View) => void;
}

const Profile: React.FC<ProfileProps> = ({ stats, onNavigate }) => {
  // Mock activity data (similar to GitHub)
  const activity = Array.from({ length: 365 }, (_, i) => Math.floor(Math.random() * 5));

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-[#242424] rounded-3xl p-10 flex flex-col md:flex-row gap-10 border border-gray-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-[120px] rounded-full"></div>
        
        <div className="relative">
          <div className="w-40 h-40 bg-gradient-to-br from-gray-700 to-gray-900 rounded-[40px] flex items-center justify-center text-7xl shadow-2xl border-4 border-gray-800 overflow-hidden">
            {stats.profileImage ? (
              <img src={stats.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              stats.avatarEmoji || '👽'
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 border-4 border-[#242424] rounded-full"></div>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-4xl font-black mb-1">{stats.username}</h2>
              <p className="text-gray-500">Ready to battle!</p>
              <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-2">Joined: 2024.12.14</div>
            </div>
            <button 
              onClick={() => onNavigate && onNavigate(View.SETTINGS)}
              className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-bold transition active:scale-95"
            >
              Settings
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <StatBox label="Total Games" value={stats.wins + stats.losses + stats.draws} />
            <StatBox label="Win Rate" value={`${Math.round((stats.wins / (stats.wins + stats.losses + stats.draws)) * 100)}%`} />
            <StatBox label="Best Streak" value="5" color="text-red-500" />
          </div>
        </div>
      </div>

      <div className="bg-[#242424] rounded-3xl p-8 border border-gray-800">
        <h3 className="text-xl font-bold mb-6">Activity (Last 365 Days)</h3>
        <div className="flex flex-wrap gap-1">
          {activity.map((lvl, i) => (
            <div 
              key={i} 
              className={`w-3 h-3 rounded-sm ${
                lvl === 0 ? 'bg-gray-800' :
                lvl === 1 ? 'bg-green-900' :
                lvl === 2 ? 'bg-green-700' :
                lvl === 3 ? 'bg-green-500' : 'bg-green-300'
              }`}
            />
          ))}
        </div>
        <div className="mt-4 flex items-center justify-end space-x-2 text-[10px] text-gray-500 font-bold">
           <span>Less</span>
           <div className="w-2 h-2 bg-gray-800 rounded-sm"></div>
           <div className="w-2 h-2 bg-green-900 rounded-sm"></div>
           <div className="w-2 h-2 bg-green-700 rounded-sm"></div>
           <div className="w-2 h-2 bg-green-500 rounded-sm"></div>
           <div className="w-2 h-2 bg-green-300 rounded-sm"></div>
           <span>More</span>
        </div>
      </div>
    </div>
  );
};

const StatBox: React.FC<{ label: string, value: string | number, color?: string }> = ({ label, value, color = "text-white" }) => (
  <div className="bg-[#1a1a1a] p-6 rounded-2xl">
    <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">{label}</div>
    <div className={`text-2xl font-black ${color}`}>{value}</div>
  </div>
);

export default Profile;
