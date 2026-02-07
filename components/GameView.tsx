
import React, { useState, useEffect, useRef } from 'react';
import { GameMode, UserStats, WordEntry } from '../types';
import { aiHint, aiWord, validateWord } from '../api';

interface VocabEntry {
  en: string;
  uz: string;
}

interface GameViewProps {
  mode: GameMode;
  playerElo: number;
  stats: UserStats;
  onBack: () => void;
  onUpdateStats: (s: Partial<UserStats>) => void;
}

interface ExtendedWordEntry extends WordEntry {
  level?: string;
}

const GameView: React.FC<GameViewProps> = ({ mode, playerElo, stats, onBack, onUpdateStats }) => {
  // Vocabulary Quiz States
  const [customVocab, setCustomVocab] = useState<VocabEntry[]>([]);
  const [setupStep, setSetupStep] = useState<'START_TYPE' | 'WORDS' | 'MODE'>('START_TYPE');
  const [setupMode, setSetupMode] = useState(mode === GameMode.VOCAB_QUIZ);
  const [quizDirection, setQuizDirection] = useState<'EN_TO_UZ' | 'UZ_TO_EN'>('EN_TO_UZ');
  
  const [enInput, setEnInput] = useState('');
  const [uzInput, setUzInput] = useState('');
  
  const [currentClue, setCurrentClue] = useState<string | null>(null);
  const [targetWord, setTargetWord] = useState<string | null>(null);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [quizScore, setQuizScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  
  // Quiz progress tracking
  const [quizQueue, setQuizQueue] = useState<number[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Standard Word Chain States
  const [words, setWords] = useState<ExtendedWordEntry[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [opponentTime, setOpponentTime] = useState(60);
  const [opponentElo, setOpponentElo] = useState(1200); // Default opponent ELO
  const [eloChange, setEloChange] = useState(0);

  const [isMyTurn, setIsMyTurn] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [isFetchingHint, setIsFetchingHint] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showResignConfirm, setShowResignConfirm] = useState(false);
  
  const timerRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Elo Calculation Logic (Standard Elo Formula like Chess.com)
  const calculateEloChange = (pElo: number, oElo: number, result: number) => {
    const K = 32;
    const expectedScore = 1 / (1 + Math.pow(10, (oElo - pElo) / 400));
    return Math.round(K * (result - expectedScore));
  };

  // Load saved vocab from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('word_battle_vocab_history');
    if (saved) {
      setCustomVocab(JSON.parse(saved));
    }
    
    // Set bot elo based on level or mode
    if (mode === GameMode.BULLET) setOpponentElo(1100);
    if (mode === GameMode.BLITZ) setOpponentElo(1300);
    if (mode === GameMode.COMPUTER) setOpponentElo(1500);
  }, [mode]);

  // Taymer mantiqi
  useEffect(() => {
    if (!gameOver && !showResignConfirm && mode !== GameMode.VOCAB_QUIZ) {
      timerRef.current = setInterval(() => {
        if (isMyTurn) {
          setTimeLeft(t => t > 0 ? t - 1 : (handleGameOver('Bot (Level 1)'), 0));
        } else {
          setOpponentTime(t => t > 0 ? t - 1 : (handleGameOver('You'), 0));
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isMyTurn, gameOver, showResignConfirm, mode]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [words]);

  // --- VOCAB QUIZ LOGIC ---

  const handleAddVocab = () => {
    if (!enInput.trim() || !uzInput.trim()) {
      setErrorMsg("Ikkala maydonni ham to'ldiring!");
      setTimeout(() => setErrorMsg(null), 2000);
      return;
    }
    const entry: VocabEntry = {
      en: enInput.trim().toLowerCase(),
      uz: uzInput.trim().toLowerCase()
    };
    
    if (customVocab.some(v => v.en === entry.en)) {
      setErrorMsg("Bu so'z allaqachon qo'shilgan!");
      setTimeout(() => setErrorMsg(null), 2000);
      return;
    }

    const updatedVocab = [...customVocab, entry];
    setCustomVocab(updatedVocab);
    localStorage.setItem('word_battle_vocab_history', JSON.stringify(updatedVocab));
    setEnInput('');
    setUzInput('');
  };

  const handleUseHistory = () => {
    const saved = localStorage.getItem('word_battle_vocab_history');
    const history = saved ? JSON.parse(saved) : [];
    
    if (history.length < 4) {
      setErrorMsg("Tarixda so'zlar yetarli emas (kamida 4 ta kerak)!");
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }
    
    setCustomVocab(history);
    setSetupStep('MODE');
  };

  const proceedToModeSelect = () => {
    if (customVocab.length < 4) {
      setErrorMsg("Variantlar uchun kamida 4 ta so'z juftligini kiriting!");
      setTimeout(() => setErrorMsg(null), 2000);
      return;
    }
    setSetupStep('MODE');
  };

  const startVocabQuiz = (direction: 'EN_TO_UZ' | 'UZ_TO_EN') => {
    setQuizDirection(direction);
    setSetupMode(false);
    setQuizFinished(false);
    setQuizScore(0);
    
    // Create a shuffled queue of all indices
    const indices = Array.from({ length: customVocab.length }, (_, i) => i);
    const shuffled = indices.sort(() => Math.random() - 0.5);
    
    setQuizQueue(shuffled);
    setCurrentQuestionIdx(0);
    generateQuestion(shuffled[0], direction);
  };

  const generateQuestion = (vocabIndex: number, direction: 'EN_TO_UZ' | 'UZ_TO_EN') => {
    setIsValidating(true);
    setFeedback(null);
    
    const entry = customVocab[vocabIndex];
    let correct: string;
    let clue: string;

    if (direction === 'EN_TO_UZ') {
      clue = entry.en;
      correct = entry.uz;
    } else {
      clue = entry.uz;
      correct = entry.en;
    }

    // Generate 3 random incorrect options from the rest of the pool
    const others = customVocab
      .filter((_, idx) => idx !== vocabIndex)
      .map(v => direction === 'EN_TO_UZ' ? v.uz : v.en);
    
    const shuffledOthers = others.sort(() => 0.5 - Math.random()).slice(0, 3);
    const allOptions = [...shuffledOthers, correct].sort(() => 0.5 - Math.random());

    setCurrentClue(clue);
    setTargetWord(correct);
    setQuizOptions(allOptions);
    setIsValidating(false);
  };

  const handleOptionSelect = (option: string) => {
    if (isValidating || feedback || quizFinished) return;

    if (option === targetWord) {
      setQuizScore(s => s + 10);
      setFeedback("Ajoyib!");
      
      setTimeout(() => {
        const nextIdx = currentQuestionIdx + 1;
        if (nextIdx < quizQueue.length) {
          setCurrentQuestionIdx(nextIdx);
          generateQuestion(quizQueue[nextIdx], quizDirection);
        } else {
          setQuizFinished(true);
          onUpdateStats({ coins: stats.coins + quizScore + 10 }); // End of game bonus
        }
      }, 1000);
    } else {
      setFeedback("Xato! Qayta urinib ko'ring.");
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  // --- WORD CHAIN LOGIC ---

  const handleGameOver = (winPlayer: string) => {
    setGameOver(true);
    setWinner(winPlayer);
    if (timerRef.current) clearInterval(timerRef.current);
    
    const result = winPlayer === 'You' ? 1 : 0;
    const change = calculateEloChange(playerElo, opponentElo, result);
    setEloChange(change);
    
    if (winPlayer === 'You') {
      onUpdateStats({ 
        wins: stats.wins + 1, 
        elo: playerElo + change, 
        coins: stats.coins + 50 + (mode === GameMode.COMPUTER ? 20 : 0) 
      });
    } else {
      onUpdateStats({ 
        losses: stats.losses + 1, 
        elo: playerElo + change 
      });
    }
  };

  const getAIResponse = async (lastWord: string) => {
    const lastChar = lastWord[lastWord.length - 1];
    const usedWords = words.map(w => w.word);
    
    try {
      const response = await aiWord(lastWord, usedWords);
      const wordValue = typeof response?.word === 'string' ? response.word.trim().toLowerCase() : '';
      if (!wordValue) {
        throw new Error(response?.reason || 'Invalid AI response');
      }
      if (!/^[a-z]+$/.test(wordValue)) {
        throw new Error('Invalid AI word characters');
      }
      if (wordValue[0] !== lastChar || usedWords.includes(wordValue)) {
        throw new Error('Invalid AI word chain');
      }
      setWords(prev => [...prev, {
        word: wordValue,
        player: 'Bot (Level 1)',
        points: wordValue.length * 10,
        timestamp: Date.now(),
        level: response.level || 'A2'
      }]);
      setIsMyTurn(true);
      return;
    } catch (e) {
      console.error("AI Error:", e);
      if (gameOver) return;
      setErrorMsg("Bot so'z topolmadi. Siz g'olibsiz!");
      setTimeout(() => setErrorMsg(null), 2500);
      handleGameOver('You');
    }
  };

  const handleChainSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMyTurn || !currentInput.trim() || gameOver || isValidating) return;

    const input = currentInput.trim().toLowerCase();
    const lastWord = words.length > 0 ? words[words.length - 1].word : null;
    
    if (words.length > 0) {
      if (input[0] !== lastWord[lastWord.length - 1]) {
        setErrorMsg(`"${lastWord[lastWord.length - 1].toUpperCase()}" BILAN BOSHLANG!`);
        setTimeout(() => setErrorMsg(null), 2000);
        return;
      }
      if (words.some(w => w.word === input)) {
        setErrorMsg("BU SO'Z ISHLATILGAN!");
        setTimeout(() => setErrorMsg(null), 2000);
        return;
      }
    }

    let validation: any = null;
    setIsValidating(true);
    try {
      validation = await validateWord(
        input,
        lastWord ? lastWord[lastWord.length - 1] : undefined,
        words.map(w => w.word)
      );
      if (!validation?.valid) {
        if (validation?.reason === 'invalid_chars') {
          setErrorMsg("Faqat harflardan iborat so'z yozing!");
        } else if (validation?.reason === 'not_english') {
          setErrorMsg("Faqat inglizcha so'zlar qabul qilinadi!");
        } else if (validation?.reason === 'wrong_start' && lastWord) {
          setErrorMsg(`"${lastWord[lastWord.length - 1].toUpperCase()}" BILAN BOSHLANG!`);
        } else if (validation?.reason === 'already_used') {
          setErrorMsg("BU SO'Z ISHLATILGAN!");
        } else {
          setErrorMsg("So'z noto'g'ri.");
        }
        setTimeout(() => setErrorMsg(null), 2000);
        setIsValidating(false);
        return;
      }
    } catch (err) {
      console.error("Validation Error:", err);
      setErrorMsg("So'zni tekshirib bo'lmadi.");
      setTimeout(() => setErrorMsg(null), 2000);
      setIsValidating(false);
      return;
    }

    const userLevel = typeof validation?.level === 'string'
      ? validation.level
      : (input.length > 7 ? 'B2' : input.length > 5 ? 'B1' : 'A2');

    setWords(prev => [...prev, {
      word: input,
      player: 'You',
      points: input.length * 10,
      timestamp: Date.now(),
      level: userLevel
    }]);
    
    setCurrentInput('');
    setIsMyTurn(false);
    setIsValidating(false);

    setTimeout(() => {
      if (!gameOver) getAIResponse(input);
    }, 1200);
  };

  const confirmResign = () => {
    setShowResignConfirm(false);
    handleGameOver('Bot (Level 1)');
  };

  const handleHint = async () => {
    if (!isMyTurn || gameOver || isFetchingHint) return;
    setIsFetchingHint(true);
    const lastWord = words.length > 0 ? words[words.length - 1].word : null;
    const startChar = lastWord ? lastWord[lastWord.length - 1] : 'a';
    const usedWords = words.map(w => w.word);

    try {
      const response = await aiHint(startChar, usedWords);
      const hint = response?.hint?.trim().toLowerCase().replace(/[^a-z]/g, '');
      if (hint) {
        setCurrentInput(hint);
        // Toast style notification
        setErrorMsg(`HINT: ${hint.toUpperCase()}`);
        setTimeout(() => setErrorMsg(null), 3000);
      }
    } catch (e) {
      console.error("Hint Error:", e);
      setErrorMsg("Hint unavailable right now.");
      setTimeout(() => setErrorMsg(null), 2000);
    } finally {
      setIsFetchingHint(false);
    }
  };

  // --- VOCAB QUIZ RENDER ---
  if (mode === GameMode.VOCAB_QUIZ) {
    return (
      <div className="h-screen bg-[#111] text-white flex flex-col p-6 md:p-12 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
           <button onClick={onBack} className="text-gray-500 hover:text-white transition font-bold flex items-center gap-2">
             <span className="text-xl">←</span> Chiqish
           </button>
           <div className="flex items-center space-x-4">
              <span className="text-xs font-black uppercase tracking-widest text-gray-600">Vocab Quiz Mode</span>
              <div className="bg-[#8cc63f] text-black px-4 py-1 rounded-full font-black text-sm shadow-lg shadow-green-500/20">
                Score: {quizScore}
              </div>
           </div>
        </div>

        {setupMode ? (
          <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full space-y-8 animate-in fade-in zoom-in duration-500">
            {setupStep === 'START_TYPE' ? (
              <div className="w-full space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-10">
                  <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">Test turini tanlang</h2>
                  <p className="text-gray-500 text-sm md:text-base">Qanday so'zlar bilan bilimingizni sinamoqchisiz?</p>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <button 
                    onClick={() => setSetupStep('WORDS')}
                    className="group p-8 bg-[#1a1a1a] border border-white/5 rounded-3xl hover:border-[#8cc63f] transition-all flex items-center justify-between text-left"
                  >
                    <div>
                      <div className="text-2xl font-black text-white group-hover:text-[#8cc63f]">Hozir yangi ro'yxat tuzish</div>
                      <div className="text-gray-500 text-xs mt-1">Hozir kiritadigan so'zlaringiz bo'yicha test.</div>
                    </div>
                    <span className="text-3xl">✍️</span>
                  </button>

                  <button 
                    onClick={handleUseHistory}
                    className="group p-8 bg-[#1a1a1a] border border-white/5 rounded-3xl hover:border-[#8cc63f] transition-all flex items-center justify-between text-left"
                  >
                    <div>
                      <div className="text-2xl font-black text-white group-hover:text-[#8cc63f]">Mening so'zlarim (Tarix)</div>
                      <div className="text-gray-500 text-xs mt-1">Avval saqlangan barcha so'zlar bo'yicha test.</div>
                    </div>
                    <span className="text-3xl">📚</span>
                  </button>
                </div>
              </div>
            ) : setupStep === 'WORDS' ? (
              <>
                <div className="text-center">
                   <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">Lug'atni shakllantirish</h2>
                   <p className="text-gray-500 text-sm md:text-base">Har bir kiritilgan so'z testda bir marta so'raladi (Kamida 4 ta so'z).</p>
                </div>

                <div className="w-full space-y-4">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input 
                        type="text"
                        value={enInput}
                        onChange={(e) => setEnInput(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                        placeholder="English word..."
                        className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-4 text-lg font-black focus:border-[#8cc63f] outline-none transition-all"
                      />
                      <input 
                        type="text"
                        value={uzInput}
                        onChange={(e) => setUzInput(e.target.value)}
                        placeholder="O'zbekcha tarjimasi..."
                        className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-4 text-lg font-black focus:border-[#8cc63f] outline-none transition-all"
                      />
                   </div>
                   <button 
                    onClick={handleAddVocab}
                    className="w-full py-4 bg-[#8cc63f]/10 text-[#8cc63f] border border-[#8cc63f]/30 rounded-2xl font-black text-lg hover:bg-[#8cc63f] hover:text-black transition-all"
                  >
                    + Ro'yxatga qo'shish
                  </button>

                   <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-4 bg-black/20 rounded-2xl border border-white/5 no-scrollbar">
                      {customVocab.length === 0 && <p className="text-gray-600 italic mx-auto">Ro'yxat bo'sh...</p>}
                      {customVocab.map((v, i) => (
                        <span key={i} className="bg-white/5 px-4 py-2 rounded-xl text-xs font-bold flex items-center group border border-white/5">
                          <span className="text-green-500 mr-1">{v.en}</span> - {v.uz}
                          <button onClick={() => {
                            const updated = customVocab.filter((_, idx) => idx !== i);
                            setCustomVocab(updated);
                            localStorage.setItem('word_battle_vocab_history', JSON.stringify(updated));
                          }} className="ml-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                        </span>
                      ))}
                   </div>
                </div>

                <div className="w-full flex flex-col gap-3">
                  <button 
                    onClick={proceedToModeSelect}
                    disabled={customVocab.length < 4}
                    className="w-full py-5 bg-white text-black font-black rounded-2xl text-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-20 shadow-2xl"
                  >
                    Keyingi bosqich ({customVocab.length} so'z)
                  </button>
                  <button 
                    onClick={() => setSetupStep('START_TYPE')}
                    className="w-full text-gray-500 font-bold hover:text-white transition text-sm"
                  >
                    ← Orqaga
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full space-y-10 animate-in slide-in-from-right-10 duration-500">
                <div className="text-center">
                   <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">Tilni tanlang</h2>
                   <p className="text-gray-500 text-sm md:text-base">Siz jami {customVocab.length} ta savolga javob berasiz.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <button 
                    onClick={() => startVocabQuiz('EN_TO_UZ')}
                    className="group p-8 bg-[#1a1a1a] border border-white/5 rounded-3xl hover:border-[#8cc63f] transition-all flex items-center justify-between"
                  >
                    <div className="text-left">
                      <div className="text-2xl font-black text-white group-hover:text-[#8cc63f]">Inglizcha → O'zbekcha</div>
                      <div className="text-gray-500 text-sm">So'z inglizcha beriladi, tarjimasini topasiz.</div>
                    </div>
                    <span className="text-4xl">🇬🇧</span>
                  </button>

                  <button 
                    onClick={() => startVocabQuiz('UZ_TO_EN')}
                    className="group p-8 bg-[#1a1a1a] border border-white/5 rounded-3xl hover:border-[#8cc63f] transition-all flex items-center justify-between"
                  >
                    <div className="text-left">
                      <div className="text-2xl font-black text-white group-hover:text-[#8cc63f]">O'zbekcha → Inglizcha</div>
                      <div className="text-gray-500 text-sm">So'z o'zbekcha beriladi, inglizchasini topasiz.</div>
                    </div>
                    <span className="text-4xl">🇺🇿</span>
                  </button>
                </div>

                <button 
                  onClick={() => setSetupStep('START_TYPE')}
                  className="w-full text-gray-500 font-bold hover:text-white transition"
                >
                  ← Test turini o'zgartirish
                </button>
              </div>
            )}
            {errorMsg && <p className="text-red-500 font-bold animate-pulse text-center">{errorMsg}</p>}
          </div>
        ) : quizFinished ? (
          <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full animate-in zoom-in duration-500">
             <div className="bg-[#1e1e1e] w-full p-12 rounded-[3rem] border border-white/5 shadow-2xl text-center">
                <div className="text-7xl mb-8">🎉</div>
                <h2 className="text-4xl font-black mb-4">Test Yakunlandi!</h2>
                <p className="text-gray-400 mb-8 text-lg">Barcha {quizQueue.length} ta so'zni muvaffaqiyatli topshirdingiz.</p>
                
                <div className="bg-black/20 rounded-2xl p-8 mb-10 border border-white/5 grid grid-cols-2 gap-8">
                   <div>
                     <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Jami Ball</div>
                     <div className="text-4xl font-black text-[#8cc63f]">{quizScore}</div>
                   </div>
                   <div>
                     <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Coinlar</div>
                     <div className="text-4xl font-black text-yellow-500">+{quizScore + 10}</div>
                   </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => {
                        setSetupMode(true);
                        setSetupStep('START_TYPE');
                    }}
                    className="flex-1 py-5 bg-white text-black font-black rounded-2xl text-xl hover:scale-105 active:scale-95 transition-all shadow-xl"
                  >
                    Qayta O'ynash
                  </button>
                  <button 
                    onClick={onBack}
                    className="flex-1 py-5 bg-[#333] text-white font-black rounded-2xl text-xl hover:bg-[#444] transition-all"
                  >
                    Bosh Sahifa
                  </button>
                </div>
             </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-6 duration-500">
             <div className="w-full mb-6 flex justify-between items-end px-2">
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                   Savol {currentQuestionIdx + 1} / {quizQueue.length}
                </div>
                <div className="h-1.5 flex-1 mx-4 bg-white/5 rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-[#8cc63f] transition-all duration-500" 
                    style={{ width: `${((currentQuestionIdx + 1) / quizQueue.length) * 100}%` }}
                   ></div>
                </div>
             </div>

             <div className="bg-[#1e1e1e] w-full p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[#8cc63f]"></div>
                
                <div className="text-center mb-8 md:mb-12">
                   <div className="text-5xl md:text-6xl mb-6">
                     {quizDirection === 'EN_TO_UZ' ? '🇬🇧' : '🇺🇿'}
                   </div>
                   <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">
                     {quizDirection === 'EN_TO_UZ' ? "Tarjimasini toping:" : "Inglizchasini toping:"}
                   </h3>
                   <div className="min-h-[100px] flex items-center justify-center">
                     {isValidating ? (
                        <div className="w-8 h-8 md:w-10 md:h-10 border-4 border-[#8cc63f] border-t-transparent rounded-full animate-spin"></div>
                     ) : (
                        <p className="text-3xl md:text-5xl font-black text-white tracking-tight">
                          {currentClue}
                        </p>
                     )}
                   </div>
                </div>

                {feedback && (
                  <div className={`text-center font-black text-2xl mb-6 animate-bounce ${feedback === 'Ajoyib!' ? 'text-[#8cc63f]' : 'text-red-500'}`}>
                    {feedback}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quizOptions.map((option, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleOptionSelect(option)}
                      className="py-4 md:py-6 bg-white/5 border-2 border-white/10 rounded-2xl text-lg md:text-xl font-black hover:bg-white/10 hover:border-[#8cc63f]/50 transition-all text-center active:scale-95"
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {errorMsg && <p className="mt-6 text-center text-red-500 font-black animate-bounce">{errorMsg}</p>}
             </div>
             
             <div className="mt-8 flex items-center gap-10">
                <div className="text-center">
                  <p className="text-gray-600 font-black uppercase tracking-[0.2em] text-[10px] mb-1">Pool hajmi</p>
                  <p className="text-white font-black">{customVocab.length} so'z</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 font-black uppercase tracking-[0.2em] text-[10px] mb-1">Yo'nalish</p>
                  <p className="text-white font-black text-xs">
                    {quizDirection === 'EN_TO_UZ' ? 'EN → UZ' : 'UZ → EN'}
                  </p>
                </div>
             </div>
          </div>
        )}
      </div>
    );
  }

  // --- STANDARD RENDER ---
  return (
    <div className="h-screen bg-[#121212] text-white flex overflow-hidden font-sans">
      <div className="flex-1 flex flex-col relative border-r border-white/5">
        
        {/* Game Header */}
        <div className="p-4 bg-[#1a1a1a] flex justify-between items-center border-b border-white/5 shadow-md z-30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#2a2a2a] rounded-lg flex items-center justify-center text-xl md:text-2xl shadow-lg border border-white/5">🤖</div>
            <div>
              <div className="font-black text-xs md:text-sm flex items-center uppercase tracking-tighter">
                Bot (Level 1) <span className="ml-2 text-[8px] md:text-[10px] text-gray-500 font-bold">({opponentElo})</span>
              </div>
              <div className="text-[8px] md:text-[10px] text-green-500 font-bold animate-pulse flex items-center">
                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span> ONLINE
              </div>
            </div>
          </div>
          <div className="text-xl md:text-3xl font-mono font-black text-gray-500 bg-black/20 px-3 md:px-4 py-1 rounded-lg">
            {Math.floor(opponentTime / 60)}:{String(opponentTime % 60).padStart(2, '0')}
          </div>
        </div>

        {/* Board */}
        <div className="flex-1 relative overflow-hidden bg-[#161616]">
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <div className="text-center">
               <div className="text-[100px] md:text-[180px] mb-4">📖</div>
               <div className="text-2xl md:text-4xl font-black uppercase tracking-[1em]">Word Battle</div>
            </div>
          </div>
          
          <div className="p-4 text-center relative z-10">
             <span className="text-[8px] md:text-[10px] font-black text-gray-600 bg-white/5 px-3 md:px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/5">
               || Word Chain Mode - {mode.toUpperCase()}
             </span>
          </div>

          <div ref={scrollRef} className="h-full overflow-y-auto p-4 md:p-8 space-y-4 md:space-y-6 no-scrollbar pb-44 flex flex-col">
            {words.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 md:space-y-6 opacity-30 my-auto">
                <div className="text-5xl md:text-7xl animate-bounce">✍️</div>
                <div className="text-white font-black uppercase tracking-[0.4em] text-[10px] md:text-xs px-10">Boshlash uchun so'z yozing</div>
              </div>
            )}
            {words.map((w, i) => (
              <div key={i} className={`flex flex-col w-full ${w.player === 'You' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-4 duration-500`}>
                <div className={`px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl text-xl md:text-2xl font-black shadow-xl flex items-center space-x-2 md:space-x-3 transition-all transform hover:scale-[1.02] ${
                  w.player === 'You' 
                    ? 'bg-[#8cc63f] text-black rounded-tr-none' 
                    : 'bg-[#2a2a2a] text-white border border-white/10 rounded-tl-none'
                }`}>
                  <span className="tracking-tight">{w.word}</span>
                  <span className={`text-[8px] md:text-[10px] px-2 py-0.5 rounded font-black ${w.player === 'You' ? 'bg-black/10' : 'bg-white/10 text-[#8cc63f]'}`}>
                    {w.level || 'A1'}
                  </span>
                </div>
                <div className="text-[8px] md:text-[10px] text-gray-600 font-black mt-1 md:mt-2 uppercase tracking-widest px-2">
                  {w.points} pts • {w.player === 'You' ? 'Siz' : 'Bot'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Game Input */}
        <div className="p-4 md:p-8 bg-[#1a1a1a] border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-20">
          {errorMsg && (
            <div className="absolute bottom-36 md:bottom-44 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[9px] md:text-[10px] font-black px-6 md:px-8 py-2 md:py-3 rounded-full z-50 shadow-2xl animate-in slide-in-from-bottom-2">
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleChainSubmit} className="flex space-x-2 md:space-x-4 mb-4 md:mb-6 relative">
            <div className="relative flex-1">
              <input 
                autoFocus
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value.replace(/[^a-zA-Z]/g, ''))}
                placeholder={isMyTurn ? (words.length === 0 ? "Boshlang..." : "Yozing...") : "O'ylamoqda..."}
                className={`w-full bg-black/40 border-2 rounded-xl px-4 md:px-8 py-3 md:py-5 text-lg md:text-2xl font-black outline-none transition-all ${
                  isMyTurn ? 'focus:border-[#8cc63f] border-[#8cc63f]/30 text-white' : 'border-transparent opacity-20 cursor-not-allowed text-gray-500'
                }`}
                disabled={!isMyTurn || isValidating || gameOver}
              />
              {isValidating && (
                <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2">
                   <div className="w-5 h-5 md:w-6 h-6 border-4 border-[#8cc63f] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <button 
              type="submit"
              disabled={!isMyTurn || isValidating || currentInput.length < 2 || gameOver}
              className="px-6 md:px-12 bg-[#333] hover:bg-[#444] text-white font-black rounded-xl transition-all uppercase text-[10px] md:text-sm tracking-widest disabled:opacity-20 border border-white/5 active:scale-95 shadow-lg"
            >
              Enter
            </button>
          </form>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-[#2a2a2a] rounded-xl flex items-center justify-center text-xl md:text-2xl border border-white/5 shadow-inner">👤</div>
              <div>
                <div className="font-black text-[10px] text-gray-400 uppercase tracking-widest leading-none mb-1">Siz <span className="text-gray-600">({playerElo})</span></div>
                <div className={`text-xl md:text-2xl font-mono font-black ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-[#8cc63f]'}`}>
                   {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2 md:space-x-3">
              <button onClick={() => setShowResignConfirm(true)} disabled={gameOver} className="px-4 md:px-6 py-2 md:py-3 bg-[#251b1b] text-red-500 border border-red-500/20 rounded-xl font-black text-[8px] md:text-[10px] uppercase hover:bg-red-500 hover:text-white transition-all active:scale-95 disabled:opacity-20">Resign</button>
              <button 
                onClick={handleHint} 
                disabled={!isMyTurn || isFetchingHint || gameOver} 
                className="px-4 md:px-6 py-2 md:py-3 bg-[#1b251b] text-[#8cc63f] border border-[#8cc63f]/20 rounded-xl font-black text-[8px] md:text-[10px] uppercase hover:bg-[#8cc63f] hover:text-black transition-all active:scale-95 disabled:50 flex items-center space-x-1"
              >
                {isFetchingHint ? (
                  <div className="w-3 h-3 border-2 border-[#8cc63f] border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <><span>💡</span><span>Hint</span></>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Resign Confirm Modal */}
        {showResignConfirm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
            <div className="bg-[#1e1e1e] border border-white/5 rounded-[2.5rem] p-10 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-200">
               <div className="text-5xl mb-6">🏳️</div>
               <h3 className="text-2xl font-black text-white mb-2">Taslim bo'lasizmi?</h3>
               <p className="text-gray-500 text-sm mb-8">Bu o'yin uchun ELO ballaringiz kamayishi mumkin.</p>
               <div className="flex space-x-3">
                  <button onClick={() => setShowResignConfirm(false)} className="flex-1 py-4 bg-gray-800 text-white font-black rounded-xl hover:bg-gray-700 transition">Yo'q</button>
                  <button onClick={confirmResign} className="flex-1 py-4 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-900/20">Ha, taslim</button>
               </div>
            </div>
          </div>
        )}

        {/* Game Over Screen */}
        {gameOver && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-[100] flex items-center justify-center p-6 animate-in fade-in duration-500">
             <div className="bg-[#1e1e1e] border border-white/5 rounded-[3rem] p-12 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-2 ${winner === 'You' ? 'bg-[#8cc63f]' : 'bg-red-600'}`}></div>
                <div className="text-7xl mb-6">{winner === 'You' ? '🏆' : '💔'}</div>
                <h3 className="text-4xl font-black text-white mb-2">{winner === 'You' ? 'YOU WIN!' : 'GAME OVER'}</h3>
                <p className="text-gray-500 mb-8">{winner === 'You' ? 'Bot taslim bo\'ldi yoki vaqti tugadi.' : 'Afsus, bu safar bot g\'olib chiqdi.'}</p>
                
                <div className="bg-black/20 rounded-2xl p-6 mb-8 border border-white/5 grid grid-cols-2 gap-4">
                   <div>
                     <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">ELO CHANGE</div>
                     <div className={`text-2xl font-black ${winner === 'You' ? 'text-green-500' : 'text-red-500'}`}>
                        {eloChange > 0 ? `+${eloChange}` : eloChange}
                     </div>
                   </div>
                   <div>
                     <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">NEW RATING</div>
                     <div className="text-2xl font-black text-white">
                        {playerElo + eloChange}
                     </div>
                   </div>
                </div>

                <button onClick={onBack} className="w-full py-5 bg-white text-black font-black rounded-2xl text-xl hover:scale-105 transition-all shadow-xl active:scale-95">GO TO DASHBOARD</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameView;
