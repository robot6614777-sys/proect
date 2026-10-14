import React from 'react';
import { AppState } from '../types';
import { ACHIEVEMENTS, calculateUserProgress, getLevelTitle } from '../achievements';

interface Props {
  state: AppState;
}

export const Achievements: React.FC<Props> = ({ state }) => {
  const progress = calculateUserProgress(state);
  const progressPercent = (progress.xp / progress.xpToNextLevel) * 100;

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-violet-200 dark:shadow-violet-900/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm opacity-90 mb-1">Уровень</p>
            <h2 className="text-4xl font-bold">{progress.level}</h2>
            <p className="text-sm font-semibold mt-1">{getLevelTitle(progress.level)}</p>
          </div>
          <div className="text-6xl">
            {progress.level < 5 ? '🌱' : progress.level < 10 ? '🔥' : progress.level < 15 ? '⚡' : '👑'}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="opacity-90">Опыт до следующего уровня</span>
            <span className="font-bold">{progress.xp} / {progress.xpToNextLevel}</span>
          </div>
          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs opacity-75 text-center">Всего XP: {progress.totalXp}</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
          Достижения ({progress.achievements.length}/{ACHIEVEMENTS.length})
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {ACHIEVEMENTS.map(achievement => {
            const isEarned = progress.achievements.includes(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`rounded-2xl p-4 border transition-all ${
                  isEarned
                    ? 'bg-white dark:bg-gray-800 border-violet-200 dark:border-violet-800 shadow-sm'
                    : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`text-3xl ${!isEarned ? 'grayscale' : ''}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-bold truncate ${
                      isEarned ? 'text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {achievement.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                      {achievement.description}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-xs font-bold text-violet-600 dark:text-violet-400">
                        +{achievement.xp} XP
                      </span>
                      {isEarned && (
                        <span className="text-xs text-emerald-500 font-bold">✓</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Ваш прогресс</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Привычек выполнено</span>
            <span className="text-sm font-bold text-gray-800 dark:text-white">
              {state.habits.reduce((sum, h) => sum + h.completedDates.length, 0)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Минут фокуса</span>
            <span className="text-sm font-bold text-gray-800 dark:text-white">
              {state.focusSessions.reduce((sum, s) => sum + s.duration, 0)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Целей достигнуто</span>
            <span className="text-sm font-bold text-gray-800 dark:text-white">
              {state.dailyGoals.filter(g => g.completed).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
