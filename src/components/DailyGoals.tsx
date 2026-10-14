import React, { useState } from 'react';
import { DailyGoal } from '../types';
import { getToday, generateId } from '../utils';

interface Props {
  goals: DailyGoal[];
  onUpdate: (goals: DailyGoal[]) => void;
}

export const DailyGoals: React.FC<Props> = ({ goals, onUpdate }) => {
  const [newGoal, setNewGoal] = useState('');
  const today = getToday();
  const todayGoals = goals.filter(g => g.date === today);

  const addGoal = () => {
    if (!newGoal.trim()) return;
    const goal: DailyGoal = {
      id: generateId(),
      text: newGoal.trim(),
      completed: false,
      date: today,
    };
    onUpdate([...goals, goal]);
    setNewGoal('');
  };

  const toggleGoal = (goalId: string) => {
    const updated = goals.map(g =>
      g.id === goalId ? { ...g, completed: !g.completed } : g
    );
    onUpdate(updated);
  };

  const deleteGoal = (goalId: string) => {
    onUpdate(goals.filter(g => g.id !== goalId));
  };

  const completedCount = todayGoals.filter(g => g.completed).length;
  const totalCount = todayGoals.length;
  const allDone = totalCount > 0 && completedCount === totalCount;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Цели на сегодня</h2>
          {totalCount > 0 && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {completedCount} из {totalCount} выполнено
            </p>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Что важно сделать сегодня?"
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            onKeyDown={(e) => e.key === 'Enter' && addGoal()}
          />
          <button
            onClick={addGoal}
            disabled={!newGoal.trim()}
            className="px-5 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {todayGoals.map(goal => (
          <div
            key={goal.id}
            className={`flex items-center gap-3 p-4 rounded-2xl transition-all duration-200 group ${
              goal.completed
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/50'
                : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md'
            }`}
          >
            <button
              onClick={() => toggleGoal(goal.id)}
              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 active:scale-90 ${
                goal.completed
                  ? 'bg-gradient-to-br from-emerald-400 to-green-500 border-emerald-400 text-white'
                  : 'border-gray-300 dark:border-gray-500 hover:border-violet-400 dark:hover:border-violet-500'
              }`}
            >
              {goal.completed && (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <span className={`flex-1 text-sm font-medium ${
              goal.completed
                ? 'text-gray-400 dark:text-gray-500 line-through'
                : 'text-gray-700 dark:text-gray-200'
            }`}>
              {goal.text}
            </span>
            <button
              onClick={() => deleteGoal(goal.id)}
              className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all text-sm w-6 h-6 flex items-center justify-center flex-shrink-0"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {todayGoals.length === 0 && (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
          <p className="text-4xl mb-3">📝</p>
          <p className="text-sm font-medium">Поставьте цели на сегодня</p>
          <p className="text-xs mt-1">Маленькие шаги ведут к большим результатам</p>
        </div>
      )}

      {allDone && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl p-5 border border-emerald-200/60 dark:border-emerald-800/60 text-center animate-slideUp">
          <p className="text-3xl mb-2">🎉</p>
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Все цели выполнены!</p>
          <p className="text-xs text-emerald-500 dark:text-emerald-500/70 mt-1">Отличная работа! Вы молодец!</p>
        </div>
      )}
    </div>
  );
};
