
import React from 'react';
import { View } from '../types';

interface LandingProps {
  onNavigate: (view: View) => void;
}

const Landing: React.FC<LandingProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#111111] text-white selection:bg-[#8cc63f] selection:text-black">
      {/* Header / Nav */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center space-x-2">
           <div className="bg-[#8cc63f]/10 text-[#8cc63f] text-[9px] sm:text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-[#8cc63f]/20">
             New: Season 5 🔥
           </div>
        </div>
        <div className="hidden sm:flex items-center space-x-8">
           <a href="#" className="text-sm font-bold text-gray-400 hover:text-white transition">Arena</a>
           <a href="#" className="text-sm font-bold text-gray-400 hover:text-white transition">Rankings</a>
           <a href="#" className="text-sm font-bold text-gray-400 hover:text-white transition">Store</a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 pt-10 pb-20 lg:pb-32 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="animate-in fade-in slide-in-from-left duration-700 text-center lg:text-left">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter leading-tight">
            Battle with <br />
            <span className="text-[#8cc63f]">Words</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg lg:text-xl max-w-lg mx-auto lg:mx-0 mb-10 font-medium leading-relaxed">
            The ultimate real-time word strategy game. Challenge friends, climb the global leaderboards, and improve your vocabulary.
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <button 
              onClick={() => onNavigate(View.AUTH)}
              className="px-8 lg:px-10 py-4 lg:py-5 bg-[#8cc63f] text-black font-black rounded-2xl text-lg hover:scale-105 transition-all shadow-xl shadow-[#8cc63f]/10"
            >
              Play Now - Free
            </button>
            <button 
              onClick={() => onNavigate(View.AUTH)}
              className="px-8 lg:px-10 py-4 lg:py-5 bg-transparent border-2 border-white/10 text-white font-black rounded-2xl text-lg hover:bg-white/5 transition-all"
            >
              Log In
            </button>
          </div>
        </div>

        {/* Game Preview Panel */}
        <div className="relative animate-in fade-in slide-in-from-right duration-700 delay-200 hidden sm:block">
          <div className="bg-[#1a1a1a] rounded-[2.5rem] p-6 lg:p-8 border border-white/5 shadow-2xl relative overflow-hidden">
             <div className="flex justify-between items-center mb-8 lg:mb-12">
               <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-800 rounded-full flex items-center justify-center text-lg lg:text-xl">👤</div>
                  <span className="font-bold text-sm lg:text-base text-gray-400">You</span>
               </div>
               <div className="text-2xl lg:text-3xl font-mono font-black text-white/90">2:45</div>
               <div className="flex items-center space-x-3">
                  <span className="font-bold text-sm lg:text-base text-gray-400">Master</span>
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-800 rounded-full flex items-center justify-center text-lg lg:text-xl">🤖</div>
               </div>
             </div>

             <div className="space-y-4 lg:space-y-6">
                <div className="flex justify-start">
                   <div className="bg-[#8cc63f] text-black font-black px-4 lg:px-6 py-2 lg:py-3 rounded-full text-base lg:text-lg shadow-lg">Dream</div>
                </div>
                <div className="flex justify-end">
                   <div className="bg-gray-800 text-white font-black px-4 lg:px-6 py-2 lg:py-3 rounded-full text-base lg:text-lg">Word</div>
                </div>
                <div className="flex justify-start">
                   <div className="bg-[#8cc63f] text-black font-black px-4 lg:px-6 py-2 lg:py-3 rounded-full text-base lg:text-lg shadow-lg">Cloud</div>
                </div>
             </div>
          </div>
          <div className="absolute -inset-10 bg-[#8cc63f]/5 blur-3xl -z-10 rounded-full"></div>
        </div>
      </header>

      {/* Features Section */}
      <section className="bg-[#0c0c0c] py-20 lg:py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
           <div className="mb-16 lg:mb-20">
              <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Why Word Battle?</h2>
              <p className="text-gray-500 font-medium text-sm md:text-base">More than just a game. It's a mental workout.</p>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              <FeatureCard icon="⚡" title="Real-time PvP" desc="Play against real people in 1v1 battles. No waiting." />
              <FeatureCard icon="🏆" title="Tournaments" desc="Join weekly events to win exclusive badges and prizes." />
              <FeatureCard icon="📊" title="Advanced Stats" desc="Track your progress and improve your vocabulary ELO." />
              <FeatureCard icon="🤖" title="Smart Bots" desc="Train against AI with adaptive difficulty levels." />
              <FeatureCard icon="🌎" title="Community" desc="Chat and compete with players worldwide." />
              <FeatureCard icon="💻" title="Cross-Platform" desc="Play on mobile or desktop. Your stats sync everywhere." />
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 text-center bg-[#111111] px-6">
         <h2 className="text-3xl md:text-5xl font-black mb-10 tracking-tight">Ready to join?</h2>
         <button 
           onClick={() => onNavigate(View.AUTH)}
           className="w-full sm:w-auto px-12 lg:px-16 py-5 lg:py-6 bg-white text-black font-black rounded-2xl text-xl lg:text-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl"
         >
           Create Free Account
         </button>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-600 font-bold uppercase tracking-widest gap-6">
         <p>© 2023 Word Battle Engine.</p>
         <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Contact</a>
         </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: string, title: string, desc: string }> = ({ icon, title, desc }) => (
  <div className="feature-card p-8 lg:p-10 rounded-3xl group text-left">
     <div className="text-3xl lg:text-4xl mb-6 group-hover:scale-110 transition-transform">{icon}</div>
     <h4 className="text-lg lg:text-xl font-black mb-3">{title}</h4>
     <p className="text-gray-500 font-medium leading-relaxed text-sm">{desc}</p>
  </div>
);

export default Landing;
