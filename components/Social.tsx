
import React, { useState } from 'react';

interface Friend {
  name: string;
  elo: number;
  status: string;
  avatar: string;
}

interface SocialProps {
  onChallenge: (friendName: string) => void;
}

const Social: React.FC<SocialProps> = ({ onChallenge }) => {
  const [friends, setFriends] = useState<Friend[]>([
    { name: 'WordMaster42', elo: 2450, status: 'Online', avatar: '🦁' },
    { name: 'Lexi_Queen', elo: 1820, status: 'In-Game', avatar: '🦊' },
    { name: 'SwiftText', elo: 1200, status: 'Offline', avatar: '🐼' },
    { name: 'BigBrain_Dev', elo: 2990, status: 'Online', avatar: '🦉' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newFriendName, setNewFriendName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [challengingId, setChallengingId] = useState<string | null>(null);

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFriendName.trim()) return;

    setIsAdding(true);

    // Simulate API call
    setTimeout(() => {
      const avatars = ['🐯', '🐨', '🐸', '🦄', '🐝', '🐙', '🦖'];
      const newFriend: Friend = {
        name: newFriendName.trim(),
        elo: Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000,
        status: 'Online',
        avatar: avatars[Math.floor(Math.random() * avatars.length)]
      };

      setFriends([newFriend, ...friends]);
      setNewFriendName('');
      setIsAdding(false);
      setShowAddModal(false);
    }, 800);
  };

  const handleChallengeClick = (friend: Friend) => {
    if (friend.status === 'Offline') {
      alert(`${friend.name} is currently offline.`);
      return;
    }
    
    setChallengingId(friend.name);
    
    // Simulate connection delay
    setTimeout(() => {
      onChallenge(friend.name);
      setChallengingId(null);
    }, 1200);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen relative">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-black mb-2">Social Hub</h2>
          <p className="text-gray-500 text-lg">Connect with friends and join word clubs.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-[#8cc63f] hover:bg-[#7db338] text-black font-black rounded-xl transition-all transform active:scale-95 shadow-lg shadow-green-900/20"
        >
          + Add Friend
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-8">
        <div className="space-y-6">
          <h3 className="text-xl font-bold">Friends List ({friends.length})</h3>
          <div className="bg-[#242424] rounded-3xl border border-gray-800 overflow-hidden shadow-xl">
            {friends.length > 0 ? (
              friends.map((f, i) => (
                <div 
                  key={i} 
                  className="p-6 flex items-center justify-between border-b border-gray-800 last:border-0 hover:bg-[#2a2a2a] transition-colors group animate-in fade-in slide-in-from-left-4 duration-300"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-[#1a1a1a] rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/5">
                      {f.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-lg flex items-center text-white">
                        {f.name}
                        <span className={`ml-2 w-2.5 h-2.5 rounded-full shadow-sm ${
                          f.status === 'Online' ? 'bg-green-500 shadow-green-500/50' : 
                          f.status === 'In-Game' ? 'bg-yellow-500 shadow-yellow-500/50' : 
                          'bg-gray-600'
                        }`}></span>
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        ELO: <span className="text-[#8cc63f] font-mono font-bold">{f.elo}</span> • {f.status}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-all active:scale-90" title="Chat">
                      💬
                    </button>
                    <button 
                      onClick={() => handleChallengeClick(f)}
                      disabled={challengingId !== null || f.status === 'Offline'}
                      className={`min-w-[120px] px-4 py-3 font-bold text-sm rounded-xl transition-all active:scale-90 border flex items-center justify-center space-x-2 ${
                        challengingId === f.name 
                          ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-500' 
                          : f.status === 'Offline'
                            ? 'bg-gray-800/50 border-gray-800 text-gray-600 cursor-not-allowed opacity-50'
                            : 'bg-green-500/10 hover:bg-green-500/20 text-[#8cc63f] border-green-500/20'
                      }`}
                    >
                      {challengingId === f.name ? (
                        <>
                          <div className="w-3 h-3 border-2 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin"></div>
                          <span>Connecting</span>
                        </>
                      ) : (
                        <>
                          <span>⚔️</span>
                          <span>Challenge</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-20 text-center opacity-30">
                <div className="text-6xl mb-4">🏜️</div>
                <div className="font-bold">No friends yet</div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold">Word Clubs</h3>
          <div className="bg-[#242424] p-8 rounded-3xl border border-gray-800 space-y-6 shadow-xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/5 blur-3xl rounded-full"></div>
            <div className="text-center pb-6 border-b border-gray-800">
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">🛡️</div>
              <h4 className="font-black text-xl text-white">Verb Vanguard</h4>
              <p className="text-xs text-gray-500 mt-2 font-bold uppercase tracking-wider">12/50 Members • Top 5%</p>
            </div>
            <div className="space-y-3">
              <button className="w-full py-4 bg-gray-800 hover:bg-gray-700 text-white font-black rounded-xl transition-all active:scale-95 shadow-lg">
                Club Hub
              </button>
              <button className="w-full py-4 bg-transparent border border-gray-800 hover:bg-white/5 text-gray-400 hover:text-white font-bold rounded-xl transition-all">
                Browse Clubs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Friend Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-6 animate-in fade-in duration-200">
          <div className="bg-[#1e1e1e] w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl border border-gray-800 animate-in zoom-in-95 duration-200">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4 border border-green-500/20">
                👤
              </div>
              <h3 className="text-3xl font-black text-white">Add Friend</h3>
              <p className="text-gray-500 text-sm mt-2">Enter the username of your rival.</p>
            </div>

            <form onSubmit={handleAddFriend} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2 px-1">Username</label>
                <input 
                  autoFocus
                  type="text" 
                  value={newFriendName}
                  onChange={(e) => setNewFriendName(e.target.value)}
                  placeholder="e.g. WordSlayer"
                  className="w-full bg-[#161616] border border-gray-800 rounded-2xl px-6 py-4 text-white outline-none focus:border-green-500/50 transition-all font-bold"
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button 
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setNewFriendName('');
                  }}
                  className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 text-white font-black rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isAdding || !newFriendName.trim()}
                  className="flex-1 py-4 bg-[#8cc63f] hover:bg-[#7db338] text-black font-black rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-900/20 flex items-center justify-center"
                >
                  {isAdding ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  ) : (
                    'Add Friend'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Social;
