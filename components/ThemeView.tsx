
import React, { useState, useEffect } from 'react';

const ThemeView: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState('Midnight');
  const [selectedTrail, setSelectedTrail] = useState('Green Glow');
  const [isApplying, setIsApplying] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  const themes = [
    { name: 'Midnight', primary: '#1a1a1a', accent: '#8cc63f', desc: 'The classic battle look.' },
    { name: 'Cyber', primary: '#0f0c29', accent: '#00d2ff', desc: 'Futuristic neon vibes.' },
    { name: 'Lava', primary: '#1a0f0f', accent: '#ff4b2b', desc: 'Intense and energetic.' },
    { name: 'Ocean', primary: '#0f172a', accent: '#38bdf8', desc: 'Calm and steady focus.' },
  ];

  const trails = [
    { name: 'Green Glow', color: '#8cc63f' },
    { name: 'Smoke', color: '#666666' },
    { name: 'Pixels', color: '#ffcc33' }
  ];

  const handleApply = () => {
    setIsApplying(true);
    // Simulate applying theme to system
    setTimeout(() => {
      setIsApplying(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 800);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-4xl font-black mb-2 text-white">Interface Theme</h2>
          <p className="text-gray-500 text-lg">Personalize your visual experience across the platform.</p>
        </div>
        <button 
          onClick={handleApply}
          disabled={isApplying}
          className="px-8 py-4 bg-[#8cc63f] hover:bg-[#7db338] text-black font-black rounded-2xl transition-all transform active:scale-95 shadow-xl shadow-green-900/20 disabled:opacity-50 flex items-center space-x-2"
        >
          {isApplying ? (
            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
          ) : (
            <>
              <span>💾</span>
              <span>Apply Changes</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {themes.map((t) => (
          <div 
            key={t.name}
            onClick={() => setSelectedTheme(t.name)}
            className={`p-8 rounded-[2.5rem] border-4 transition-all cursor-pointer relative overflow-hidden group h-64 flex flex-col justify-between ${
              selectedTheme === t.name 
                ? 'border-white shadow-2xl scale-[1.02] z-10' 
                : 'border-gray-800 hover:border-gray-700 opacity-60 hover:opacity-100'
            }`}
            style={{ backgroundColor: t.primary }}
          >
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-white">{t.name}</h3>
                {selectedTheme === t.name && (
                  <span className="bg-white text-black text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center">
                    <span className="mr-1">✓</span> ACTIVE
                  </span>
                )}
              </div>
              <p className="text-white/60 text-sm mb-4 max-w-[200px] font-medium leading-relaxed">{t.desc}</p>
            </div>
            
            <div className="relative z-10 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-white/20 shadow-inner" style={{ backgroundColor: t.primary }}></div>
              <div className="w-10 h-10 rounded-full shadow-lg" style={{ backgroundColor: t.accent }}></div>
              <div className="flex-1"></div>
              {selectedTheme === t.name && <div className="text-white/20 font-black text-4xl">SELECTED</div>}
            </div>

            {/* Background decorative elements */}
            <div className="absolute -bottom-6 -right-6 p-8 opacity-10 transform group-hover:rotate-12 transition-transform duration-500">
              <div className="w-32 h-32 rounded-3xl border-8 border-white"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#242424] p-10 rounded-[3rem] border border-gray-800 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#8cc63f] to-transparent opacity-20"></div>
        <div className="mb-6 md:mb-0">
          <h3 className="text-2xl font-black mb-2 text-white">Word Trails</h3>
          <p className="text-sm text-gray-500 font-medium">Select the visual effect when submitting a word chain.</p>
        </div>
        <div className="flex bg-[#1a1a1a] p-2 rounded-2xl border border-white/5 space-x-2">
          {trails.map((trail) => (
            <button 
              key={trail.name}
              onClick={() => setSelectedTrail(trail.name)}
              className={`px-6 py-3 rounded-xl font-black transition-all text-sm ${
                selectedTrail === trail.name 
                  ? 'bg-white text-black shadow-lg scale-105' 
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: trail.color }}></div>
                <span>{trail.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#8cc63f] text-black px-8 py-4 rounded-2xl font-black shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 z-50 flex items-center space-x-3">
          <span className="text-xl">✨</span>
          <span>Theme applied successfully!</span>
        </div>
      )}

      {/* Preview Section */}
      <div className="mt-12 text-center opacity-30">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Live Preview Simulation</p>
        <div className="mt-6 flex justify-center space-x-4">
           <div className={`w-32 h-16 rounded-xl border-2 border-dashed border-gray-700 flex items-center justify-center font-bold text-xs`}>
             Sidebar
           </div>
           <div className={`w-48 h-16 rounded-xl border-2 border-dashed border-gray-700 flex items-center justify-center font-bold text-xs`}>
             Header Content
           </div>
           <div className={`w-32 h-16 rounded-xl border-2 border-dashed border-gray-700 flex items-center justify-center font-bold text-xs`}>
             Buttons
           </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeView;
