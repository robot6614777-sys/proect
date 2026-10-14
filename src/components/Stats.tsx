import React from 'react';
import { Habit, FocusSession } from '../types';
import { getStreak, getLast7Days, getWeekStats } from '../utils';

interface Props {
  habits: Habit[];
  sessions: FocusSession[];
}

export const Stats: React.FC<Props> = ({ habits, sessions }) => {
  const weekStats = getWeekStats(habits);
  const weekPercentage = weekStats.total > 0 ? Math.round((weekStats.completed / weekStats.total) * 100) : 0;

  const totalFocusMinutes = sessions.reduce((acc, s) => acc + s.duration, 0);
  const totalSessions = sessions.length;

  const bestStreak = habits.reduce((max, h) => {
    const streak = getStreak(h);
    return streak > max ? streak : max;
  }, 0);

  const last7Days = getLast7Days();
  const dailyCompletion = last7Days.map(day => {
    const completed = habits.filter(h => h.completedDates.includes(day)).length;
    return { day, completed, total: habits.length };
  });

  const last30Days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    last30Days.push(date.toISOString().split('T')[0]);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Статистика</h2>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="text-2xl mb-2">🔥</div>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{bestStreak}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">Лучшая серия</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="text-2xl mb-2">📊</div>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{weekPercentage}<span className="text-lg">%</span></p>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">За неделю</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="text-2xl mb-2">⏱</div>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{totalFocusMinutes}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">Минут фокуса</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="text-2xl mb-2">✅</div>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{totalSessions}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">Сессий всего</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Активность за неделю</h3>
        <div className="flex items-end justify-between gap-2 h-32">
          {dailyCompletion.map((d, i) => {
            const percentage = d.total > 0 ? (d.completed / d.total) * 100 : 0;
            const dayName = new Date(d.day + 'T00:00:00').toLocaleDateString('ru', { weekday: 'short' });
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                  {d.total > 0 ? `${d.completed}/${d.total}` : '—'}
                </span>
                <div className="w-full flex flex-col justify-end h-20">
                  <div
                    className="w-full rounded-lg bg-gradient-to-t from-violet-500 to-purple-400 transition-all duration-500"
                    style={{ height: `${Math.max(percentage, 4)}%`, minHeight: '4px' }}
                  />
                </div>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium capitalize">
                  {dayName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Последние 30 дней</h3>
        <div className="flex flex-wrap gap-1.5">
          {last30Days.map(day => {
            const completed = habits.filter(h => h.completedDates.includes(day)).length;
            const ratio = habits.length > 0 ? completed / habits.length : 0;
            let bgClass = 'bg-gray-100 dark:bg-gray-700';
            if (ratio > 0 && ratio < 0.5) bgClass = 'bg-violet-200 dark:bg-violet-900/50';
            if (ratio >= 0.5 && ratio < 0.75) bgClass = 'bg-violet-400 dark:bg-violet-700';
            if (ratio >= 0.75 && ratio < 1) bgClass = 'bg-violet-500 dark:bg-violet-600';
            if (ratio >= 1) bgClass = 'bg-violet-600 dark:bg-violet-500';

            return (
              <div
                key={day}
                className={`w-7 h-7 rounded-md ${bgClass} transition-all`}
                title={`${day}: ${completed}/${habits.length}`}
              />
            );
          })}
        </div>
        <div className="flex items-center gap-1.5 mt-3 justify-end">
          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">Меньше</span>
          <div className="w-4 h-4 rounded-sm bg-gray-100 dark:bg-gray-700" />
          <div className="w-4 h-4 rounded-sm bg-violet-200 dark:bg-violet-900/50" />
          <div className="w-4 h-4 rounded-sm bg-violet-400 dark:bg-violet-700" />
          <div className="w-4 h-4 rounded-sm bg-violet-600 dark:bg-violet-500" />
          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">Больше</span>
        </div>
      </div>
    </div>
  );
};
