
import React from 'react';

const Premium: React.FC = () => {
  const perks = [
    { icon: '🚫', title: 'Zero Ads', desc: 'Complete immersion, no interruptions.' },
    { icon: '📊', title: 'Game Analysis', desc: 'AI-powered review of every word you play.' },
    { icon: '🎨', title: 'Exclusive Themes', desc: 'Unique skins, trails, and avatars.' },
    { icon: '🏅', title: 'Elite Badge', desc: 'Premium-only profile badge and frame.' },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="bg-gradient-to-br from-[#8cc63f] to-[#4c7e0c] p-12 rounded-[3rem] text-center mb-12 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="text-6xl mb-6">💎</div>
          <h2 className="text-5xl font-black text-black mb-4">Word Battle PRO</h2>
          <p className="text-green-900 text-xl font-bold max-w-lg mx-auto mb-10 leading-relaxed">Elevate your game with advanced tools and exclusive customization.</p>
          <div className="flex justify-center space-x-4">
            <div className="bg-black text-white p-6 rounded-2xl w-48 shadow-xl">
              <div className="text-sm font-bold opacity-60">Monthly</div>
              <div className="text-3xl font-black">$4.99</div>
            </div>
            <div className="bg-white text-black p-6 rounded-2xl w-48 shadow-xl border-4 border-black/10 scale-110">
              <div className="text-xs font-black bg-green-500 px-2 py-0.5 rounded-full inline-block mb-2">BEST VALUE</div>
              <div className="text-sm font-bold opacity-60">Yearly</div>
              <div className="text-3xl font-black">$39.99</div>
            </div>
          </div>
        </div>
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 blur-3xl rounded-full"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {perks.map((p, i) => (
          <div key={i} className="bg-[#242424] p-8 rounded-3xl border border-gray-800 flex items-start space-x-6">
            <div className="text-4xl shrink-0">{p.icon}</div>
            <div>
              <h4 className="text-xl font-black mb-1">{p.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Premium;
