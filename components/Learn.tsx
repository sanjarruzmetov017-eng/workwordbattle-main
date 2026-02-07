
import React from 'react';

const Learn: React.FC = () => {
  const lessons = [
    { title: 'Greek Roots', words: 12, progress: 80 },
    { title: 'Scientific Terminology', words: 25, progress: 30 },
    { title: 'Obscure Adjectives', words: 15, progress: 0 },
    { title: 'Business Buzzwords', words: 20, progress: 10 },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-10">
        <h2 className="text-4xl font-black mb-2">Learning Lab</h2>
        <p className="text-gray-500 text-lg">Expand your arsenal with new vocab sets.</p>
      </div>

      <div className="bg-[#242424] p-10 rounded-3xl border border-gray-800 mb-10 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl font-black mb-2">Word of the Day</h3>
          <div className="text-4xl font-black text-green-500 mb-4 tracking-tight">Magnanimous</div>
          <p className="text-gray-400 italic mb-6">"Very generous or forgiving, especially toward a rival or someone less powerful."</p>
          <button className="px-8 py-3 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition">Add to Flashcards</button>
        </div>
        <div className="absolute top-0 right-0 p-10 text-8xl opacity-10 font-black">Aa</div>
      </div>

      <h3 className="text-xl font-bold mb-6">Course Path</h3>
      <div className="space-y-4">
        {lessons.map((l, i) => (
          <div key={i} className="bg-[#242424] p-6 rounded-2xl border border-gray-800 flex items-center justify-between hover:bg-[#2a2a2a] transition cursor-pointer">
            <div className="flex items-center space-x-6">
              <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center text-2xl font-black text-green-500">{i + 1}</div>
              <div>
                <h4 className="font-bold text-lg">{l.title}</h4>
                <div className="text-sm text-gray-500">{l.words} essential words</div>
              </div>
            </div>
            <div className="w-40">
              <div className="text-[10px] text-gray-500 font-black uppercase text-right mb-2">{l.progress}% Complete</div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${l.progress}%` }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Learn;
