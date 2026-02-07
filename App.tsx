
import React, { useEffect, useState } from 'react';
import { View, GameMode, UserStats } from './types';
import { clearTokens, fetchMe, updateProfile } from './api';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import GameView from './components/GameView';
import Sidebar from './components/Sidebar';
import AuthView from './components/AuthView';
import DailyBonusModal from './components/DailyBonusModal';
import Leaderboard from './components/Leaderboard';
import Shop from './components/Shop';
import Profile from './components/Profile';
import Achievements from './components/Achievements';
import Settings from './components/Settings';
import Puzzles from './components/Puzzles';
import Learn from './components/Learn';
import Social from './components/Social';
import Premium from './components/Premium';
import Support from './components/Support';
import Notifications from './components/Notifications';
import ThemeView from './components/ThemeView';
import BottomNav from './components/BottomNav';
import WordHistory from './components/WordHistory';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.LANDING);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDailyBonus, setShowDailyBonus] = useState(false);
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode | null>(null);
  const [stats, setStats] = useState<UserStats>({
    username: 'Player_One',
    elo: 1200,
    wins: 12,
    losses: 8,
    draws: 2,
    streak: 1,
    coins: 250,
    avatarEmoji: '👽'
  });

  const handleLogin = (profile: UserStats) => {
    setIsLoggedIn(true);
    setCurrentView(View.DASHBOARD);
    setShowDailyBonus(true);
    setStats(profile);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView(View.LANDING);
    setSelectedGameMode(null);
    clearTokens();
  };

  const startGame = (mode: GameMode) => {
    setSelectedGameMode(mode);
    setCurrentView(View.GAME);
  };

  const navigateTo = (view: View) => {
    setCurrentView(view);
  };

  const updateStats = (newStats: Partial<UserStats>) => {
    setStats(prev => ({ ...prev, ...newStats }));
    if (!isLoggedIn) return;
    updateProfile(newStats)
      .then((updated) => setStats(updated))
      .catch((err) => {
        console.error('Profile update failed', err);
      });
  };

  useEffect(() => {
    let mounted = true;
    fetchMe()
      .then((profile) => {
        if (!mounted) return;
        setStats(profile);
        setIsLoggedIn(true);
        setCurrentView(View.DASHBOARD);
      })
      .catch(() => {
        // ignore if not logged in
      });
    return () => {
      mounted = false;
    };
  }, []);

  const isMainApp = isLoggedIn && currentView !== View.LANDING && currentView !== View.GAME && currentView !== View.AUTH;

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col md:flex-row">
      {isMainApp && (
        <Sidebar 
          currentView={currentView} 
          onNavigate={navigateTo} 
          onLogout={handleLogout}
          stats={stats} 
        />
      )}
      
      <main className={`flex-1 overflow-y-auto ${isMainApp ? 'mobile-padding-bottom' : ''}`}>
        {currentView === View.LANDING && (
          <Landing 
            onNavigate={navigateTo}
          />
        )}

        {currentView === View.AUTH && (
          <AuthView 
            onBack={() => navigateTo(View.LANDING)} 
            onSuccess={handleLogin} 
          />
        )}
        
        {currentView === View.DASHBOARD && (
          <Dashboard 
            stats={stats} 
            onStartGame={startGame} 
            onNavigate={navigateTo}
          />
        )}
        
        {currentView === View.GAME && selectedGameMode && (
          <GameView 
            mode={selectedGameMode} 
            playerElo={stats.elo}
            stats={stats}
            onBack={() => navigateTo(View.DASHBOARD)} 
            onUpdateStats={updateStats}
          />
        )}

        {currentView === View.WORDS && <WordHistory />}
        {currentView === View.PUZZLES && <Puzzles />}
        {currentView === View.LEARN && <Learn />}
        {currentView === View.TOURNAMENTS && <Leaderboard onJoinArena={() => startGame(GameMode.BLITZ)} />}
        {currentView === View.SOCIAL && <Social onChallenge={() => startGame(GameMode.FRIEND)} />}
        {currentView === View.PROFILE && <Profile stats={stats} onNavigate={navigateTo} />}
        {currentView === View.SHOP && <Shop stats={stats} onUpdateStats={updateStats} onNavigate={navigateTo} />}
        {currentView === View.ACHIEVEMENTS && <Achievements />}
        {currentView === View.SETTINGS && <Settings stats={stats} onUpdateStats={updateStats} />}
        {currentView === View.PREMIUM && <Premium />}
        {currentView === View.SUPPORT && <Support />}
        {currentView === View.NOTIFICATIONS && <Notifications />}
        {currentView === View.THEME && <ThemeView />}
      </main>

      {isMainApp && (
        <BottomNav currentView={currentView} onNavigate={navigateTo} />
      )}

      {showDailyBonus && (
        <DailyBonusModal 
          onClose={() => setShowDailyBonus(false)} 
          onClaim={(amount) => updateStats({ coins: stats.coins + amount })}
        />
      )}
    </div>
  );
};

export default App;
