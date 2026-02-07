
import React, { useState, useEffect } from 'react';

interface VocabEntry {
  en: string;
  uz: string;
}

const WordHistory: React.FC = () => {
  const [words, setWords] = useState<VocabEntry[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('word_battle_vocab_history');
    if (saved) {
      setWords(JSON.parse(saved));
    }
  }, []);

  const deleteWord = (en: string) => {
    const updated = words.filter(w => w.en !== en);
    setWords(updated);
    localStorage.setItem('word_battle_vocab_history', JSON.stringify(updated));
  };

  const filteredWords = words.filter(w => 
    w.en.toLowerCase().includes(search.toLowerCase()) || 
    w.uz.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto min-h-screen animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-black mb-2 text-white tracking-tight">Mening So'zlarim</h2>
          <p className="text-gray-500 font-medium">Siz kiritgan barcha so'zlar va ularning tarjimalari.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
          <input 
            type="text" 
            placeholder="So'zlarni qidirish..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#242424] border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white outline-none focus:border-[#8cc63f] transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredWords.length > 0 ? (
          filteredWords.map((word, idx) => (
            <div 
              key={idx} 
              className="bg-[#242424] p-6 rounded-[2rem] border border-white/5 group hover:border-[#8cc63f]/30 transition-all shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-[#8cc63f] opacity-20"></div>
              
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Dictionary Entry</span>
                <button 
                  onClick={() => deleteWord(word.en)}
                  className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-125"
                >
                  🗑️
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🇬🇧</span>
                  <h3 className="text-2xl font-black text-white">{word.en}</h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">🇺🇿</span>
                  <p className="text-xl font-bold text-gray-400">{word.uz}</p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                 <div className="bg-white/5 px-3 py-1 rounded-lg text-[9px] font-bold text-gray-500 uppercase tracking-tighter">
                   Level: {word.en.length > 7 ? 'Advanced' : 'Common'}
                 </div>
                 <span className="text-xs text-green-500 font-black opacity-0 group-hover:opacity-100 transition-opacity">
                    READY FOR QUIZ
                 </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-32 text-center opacity-20">
             <div className="text-8xl mb-6">📖</div>
             <h3 className="text-2xl font-black uppercase tracking-[0.4em]">Ro'yxat bo'sh</h3>
             <p className="mt-2 font-bold uppercase tracking-widest text-xs">Play bo'limida Vocab Quiz orqali so'zlar qo'shing</p>
          </div>
        )}
      </div>

      <div className="mt-20 p-10 bg-gradient-to-r from-[#8cc63f]/5 to-transparent border border-white/5 rounded-[3rem] text-center">
         <h4 className="text-2xl font-black mb-4 tracking-tight">Bilimingizni sinab ko'ring</h4>
         <p className="text-gray-500 mb-8 max-w-md mx-auto">Kiritgan so'zlaringiz asosida test topshirish uchun Play bo'limiga o'ting.</p>
         <div className="flex justify-center gap-4">
            <div className="bg-[#1a1a1a] px-6 py-3 rounded-2xl border border-white/5">
               <span className="text-xs font-black text-gray-500 block uppercase tracking-widest mb-1">Jami so'zlar</span>
               <span className="text-2xl font-black text-white">{words.length}</span>
            </div>
            <div className="bg-[#1a1a1a] px-6 py-3 rounded-2xl border border-white/5">
               <span className="text-xs font-black text-gray-500 block uppercase tracking-widest mb-1">Testlar</span>
               <span className="text-2xl font-black text-white">2 ta tur</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default WordHistory;
