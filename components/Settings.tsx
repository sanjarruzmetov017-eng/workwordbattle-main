
import React, { useState, useRef } from 'react';
import { UserStats } from '../types';

interface SettingsProps {
  stats: UserStats;
  onUpdateStats: (s: Partial<UserStats>) => void;
}

const Settings: React.FC<SettingsProps> = ({ stats, onUpdateStats }) => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [username, setUsername] = useState(stats.username || 'Player_One');
  const [bio, setBio] = useState('Ready to battle!');
  const [avatar, setAvatar] = useState(stats.avatarEmoji || '👽');
  const [profileImage, setProfileImage] = useState<string | undefined>(stats.profileImage);
  
  // Account States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Password Visibility States
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs = [
    { id: 'Profile', label: 'Profile', icon: '👤' },
    { id: 'Account', label: 'Account & Security', icon: '🔒' },
    { id: 'Privacy', label: 'Privacy', icon: '👁️' },
    { id: 'Preferences', label: 'Preferences', icon: '⚙️' },
  ];

  const handleSave = () => {
    setErrorMsg(null);
    
    if (activeTab === 'Account') {
      if (newPassword && newPassword !== confirmPassword) {
        setErrorMsg("Yangi parollar mos kelmadi!");
        return;
      }
      if (newPassword && !currentPassword) {
        setErrorMsg("Parolni o'zgartirish uchun joriy parolni kiriting.");
        return;
      }
    }

    setIsSaving(true);
    // Simulate API save
    setTimeout(() => {
      onUpdateStats({
        username: username,
        avatarEmoji: avatar,
        profileImage: profileImage
      });
      setIsSaving(false);
      setShowSuccess(true);
      
      // Clear password fields after save
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
      
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const changeAvatar = () => {
    const emojis = ['👽', '🤖', '👾', '👻', '🤡', '🦊', '🦁', '🦉', '🥷'];
    const currentIdx = emojis.indexOf(avatar);
    const nextIdx = (currentIdx + 1) % emojis.length;
    setAvatar(emojis[nextIdx]);
    setProfileImage(undefined); // Clear custom image if switching back to emoji
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-10 max-w-5xl mx-auto min-h-screen">
      <h2 className="text-4xl font-black mb-12 text-white">Settings</h2>

      <div className="grid md:grid-cols-[280px_1fr] gap-10">
        {/* Sidebar Navigation */}
        <nav className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setErrorMsg(null);
              }}
              className={`w-full flex items-center space-x-3 px-5 py-4 rounded-xl font-bold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-[#8cc63f] text-black shadow-lg shadow-green-900/10'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-sm tracking-wide">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Main Content Area */}
        <div className="bg-[#242424] rounded-3xl p-10 border border-white/5 shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col">
          <div className="flex-1">
            {activeTab === 'Profile' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-2xl font-black text-white mb-8">Edit Profile</h3>
                
                <div className="space-y-10">
                  {/* Avatar Section */}
                  <div className="flex flex-col sm:flex-row items-center gap-8">
                    <div className="relative group">
                      <div className="w-24 h-24 bg-[#1a1a1a] rounded-full flex items-center justify-center text-4xl border-2 border-[#8cc63f] shadow-lg shadow-green-500/10 overflow-hidden">
                        {profileImage ? (
                          <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          avatar
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 w-full sm:w-auto">
                      <div className="flex gap-2">
                        <button 
                          onClick={changeAvatar}
                          className="flex-1 sm:flex-none px-5 py-2.5 bg-[#333] hover:bg-[#444] text-gray-200 rounded-xl text-xs font-bold transition-colors border border-white/5"
                        >
                          Change Emoji
                        </button>
                        <button 
                          onClick={triggerFileUpload}
                          className="flex-1 sm:flex-none px-5 py-2.5 bg-[#8cc63f] hover:bg-[#7db338] text-black rounded-xl text-xs font-bold transition-all border border-white/5"
                        >
                          Upload Photo
                        </button>
                      </div>
                      {profileImage && (
                        <button 
                          onClick={() => setProfileImage(undefined)}
                          className="text-[10px] text-red-500 font-bold uppercase tracking-widest text-left px-1 hover:underline"
                        >
                          Remove Photo
                        </button>
                      )}
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                      />
                    </div>
                  </div>

                  {/* Input Fields */}
                  <div className="space-y-8">
                    <div>
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-3 px-1">Bio</label>
                      <textarea 
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={4}
                        className="w-full bg-[#161616] border border-white/5 rounded-xl px-6 py-4 text-white font-bold outline-none focus:border-[#8cc63f]/50 transition-all resize-none shadow-inner"
                        placeholder="Tell us about yourself..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Account' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-2xl font-black text-white mb-8">Account & Security</h3>
                
                <div className="space-y-8">
                  <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-3 px-1">Username</label>
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-[#161616] border border-white/5 rounded-xl px-6 py-4 text-white font-bold outline-none focus:border-[#8cc63f]/50 transition-all shadow-inner"
                    />
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Change Password</h4>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-3 px-1">Current Password</label>
                        <div className="relative">
                          <input 
                            type={showCurrent ? "text" : "password"} 
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-[#161616] border border-white/5 rounded-xl px-6 py-4 pr-14 text-white font-bold outline-none focus:border-[#8cc63f]/50 transition-all shadow-inner"
                          />
                          <button 
                            type="button"
                            onClick={() => setShowCurrent(!showCurrent)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                          >
                            {showCurrent ? "👁️‍🗨️" : "👁️"}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-3 px-1">New Password</label>
                          <div className="relative">
                            <input 
                              type={showNew ? "text" : "password"} 
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full bg-[#161616] border border-white/5 rounded-xl px-6 py-4 pr-14 text-white font-bold outline-none focus:border-[#8cc63f]/50 transition-all shadow-inner"
                            />
                            <button 
                              type="button"
                              onClick={() => setShowNew(!showNew)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                            >
                              {showNew ? "👁️‍🗨️" : "👁️"}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-3 px-1">Confirm Password</label>
                          <div className="relative">
                            <input 
                              type={showConfirm ? "text" : "password"} 
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full bg-[#161616] border border-white/5 rounded-xl px-6 py-4 pr-14 text-white font-bold outline-none focus:border-[#8cc63f]/50 transition-all shadow-inner"
                            />
                            <button 
                              type="button"
                              onClick={() => setShowConfirm(!showConfirm)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                            >
                              {showConfirm ? "👁️‍🗨️" : "👁️"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(activeTab === 'Privacy' || activeTab === 'Preferences') && (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-40 animate-in fade-in duration-500">
                 <div className="text-6xl mb-6">🛠️</div>
                 <h3 className="text-2xl font-black text-white">{activeTab} coming soon</h3>
                 <p className="text-gray-500 max-w-xs mt-2">This section is currently being updated for the new season.</p>
              </div>
            )}
          </div>

          {/* Save Button (Fixed at bottom for consistency) */}
          {(activeTab === 'Profile' || activeTab === 'Account') && (
            <div className="flex items-center justify-between pt-10 mt-6 border-t border-white/5">
              <div className="flex flex-col">
                <div className={`transition-opacity duration-300 ${showSuccess ? 'opacity-100' : 'opacity-0'}`}>
                  <span className="text-[#8cc63f] font-bold text-sm flex items-center">
                    <span className="mr-2">✓</span> O'zgarishlar muvaffaqiyatli saqlandi!
                  </span>
                </div>
                {errorMsg && (
                  <span className="text-red-500 font-bold text-sm animate-pulse">
                    ⚠️ {errorMsg}
                  </span>
                )}
              </div>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="px-10 py-4 bg-[#8cc63f] hover:bg-[#7db338] text-black font-black rounded-xl transition-all transform active:scale-95 shadow-xl shadow-green-900/20 disabled:opacity-50 min-w-[180px] flex items-center justify-center"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
