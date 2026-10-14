import React, { useState, useEffect } from 'react';
import { AppState } from './types';
import { loadState, saveState, getRandomQuote } from './utils';
import { calculateUserProgress, ACHIEVEMENTS } from './achievements';
import { soundManager } from './sounds';
import { HabitTracker } from './components/HabitTracker';
import { FocusTimer } from './components/FocusTimer';
import { DailyGoals } from './components/DailyGoals';
import { Stats } from './components/Stats';
import { Achievements } from './components/Achievements';

type Tab = 'habits' | 'goals' | 'focus' | 'stats' | 'achievements';

function App() {
  const [state, setState] = useState<AppState>(loadState);
  const [activeTab, setActiveTab] = useState<Tab>('habits');
  const [quote, setQuote] = useState(getRandomQuote);
  const [showQuote, setShowQuote] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(soundManager.isEnabled());
  const [prevAchievements, setPrevAchievements] = useState<string[]>([]);
  const [newAchievement, setNewAchievement] = useState<string | null>(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  // Check for new achievements
  useEffect(() => {
    const progress = calculateUserProgress(state);
    const currentAchievements = progress.achievements;
    
    if (prevAchievements.length > 0 && currentAchievements.length > prevAchievements.length) {
      const newOnes = currentAchievements.filter(a => !prevAchievements.includes(a));
      if (newOnes.length > 0) {
        setNewAchievement(newOnes[0]);
        soundManager.playAchievement();
        setTimeout(() => setNewAchievement(null), 3000);
      }
    }
    
    setPrevAchievements(currentAchievements);
  }, [state]);

  const updateHabits = (habits: AppState['habits']) => {
    setState(prev => ({ ...prev, habits }));
  };

  const updateGoals = (dailyGoals: AppState['dailyGoals']) => {
    setState(prev => ({ ...prev, dailyGoals }));
  };

  const updateSessions = (focusSessions: AppState['focusSessions']) => {
    setState(prev => ({ ...prev, focusSessions }));
  };

  const newQuote = () => {
    setQuote(getRandomQuote());
    setShowQuote(true);
  };

  const toggleSound = () => {
    const newState = soundManager.toggle();
    setSoundEnabled(newState);
  };

  const progress = calculateUserProgress(state);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'habits', label: 'Привычки', icon: '🎯' },
    { id: 'goals', label: 'Цели', icon: '📝' },
    { id: 'focus', label: 'Фокус', icon: '⏱' },
    { id: 'stats', label: 'Стата', icon: '📊' },
    { id: 'achievements', label: 'Награды', icon: '🏆' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/40 to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/60 dark:border-gray-800/60">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
              D
            </div>
            <div>
              <h1 className="text-base font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                DisciplineFlow
              </h1>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight">
                {new Date().toLocaleDateString('ru', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSound}
              className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-90"
              title={soundEnabled ? 'Выключить звуки' : 'Включить звуки'}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
            <button
              onClick={newQuote}
              className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-90"
              title="Новая цитата"
            >
              💡
            </button>
          </div>
        </div>
      </header>

      {/* Level indicator */}
      <div className="max-w-lg mx-auto px-4 pt-3">
        <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl px-4 py-2 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
            {progress.level}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Уровень {progress.level}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{progress.xp}/{progress.xpToNextLevel} XP</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-700"
                style={{ width: `${(progress.xp / progress.xpToNextLevel) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Motivational quote */}
      {showQuote && (
        <div className="max-w-lg mx-auto px-4 pt-3 animate-fadeIn">
          <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/40 dark:to-purple-950/40 rounded-2xl p-4 border border-violet-200/50 dark:border-violet-800/50 relative">
            <button
              onClick={() => setShowQuote(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs w-5 h-5 flex items-center justify-center"
            >
              ✕
            </button>
            <p className="text-sm text-gray-700 dark:text-gray-300 italic pr-4 leading-relaxed">
              «{quote.text}»
            </p>
            <p className="text-xs text-violet-500 dark:text-violet-400 mt-1.5 font-medium">— {quote.author}</p>
          </div>
        </div>
      )}

      {/* New achievement notification */}
      {newAchievement && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slideUp">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="text-xs font-bold opacity-90">Новое достижение!</p>
              <p className="text-sm font-bold">{ACHIEVEMENTS.find(a => a.id === newAchievement)?.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-lg mx-auto px-4 py-5 pb-28">
        {activeTab === 'habits' && (
          <HabitTracker habits={state.habits} onUpdate={updateHabits} />
        )}
        {activeTab === 'goals' && (
          <DailyGoals goals={state.dailyGoals} onUpdate={updateGoals} />
        )}
        {activeTab === 'focus' && (
          <FocusTimer sessions={state.focusSessions} onUpdate={updateSessions} />
        )}
        {activeTab === 'stats' && (
          <Stats habits={state.habits} sessions={state.focusSessions} />
        )}
        {activeTab === 'achievements' && (
          <Achievements state={state} />
        )}
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border-t border-gray-200/60 dark:border-gray-800/60">
        <div className="max-w-lg mx-auto px-2 py-2">
          <div className="flex items-center justify-around">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  soundManager.playClick();
                }}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400'
                    : 'text-gray-400 dark:text-gray-500 active:scale-95'
                }`}
              >
                <span className="text-xl leading-none">{tab.icon}</span>
                <span className="text-[10px] font-semibold">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default App;
