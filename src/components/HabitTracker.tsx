import React, { useState } from 'react';
import { Habit } from '../types';
import { getToday, getLast7Days, getDayName, getStreak, generateId } from '../utils';
import { soundManager } from '../sounds';

interface Props {
  habits: Habit[];
  onUpdate: (habits: Habit[]) => void;
}

const habitIcons = ['🧘', '📚', '💪', '⏰', '🏃', '💧', '🍎', '✍️', '🎯', '🧠', '💤', '🎨', '🌿', '🎵', '🧹', '💊'];

interface ColorScheme {
  name: string;
  gradient: string;
  solid: string;
  light: string;
}

const colorSchemes: ColorScheme[] = [
  { name: 'violet', gradient: 'linear-gradient(135deg, #8B5CF6, #9333EA)', solid: '#8B5CF6', light: '#F5F3FF' },
  { name: 'blue', gradient: 'linear-gradient(135deg, #3B82F6, #4F46E5)', solid: '#3B82F6', light: '#EFF6FF' },
  { name: 'red', gradient: 'linear-gradient(135deg, #EF4444, #E11D48)', solid: '#EF4444', light: '#FEF2F2' },
  { name: 'amber', gradient: 'linear-gradient(135deg, #F59E0B, #EA580C)', solid: '#F59E0B', light: '#FFFBEB' },
  { name: 'emerald', gradient: 'linear-gradient(135deg, #10B981, #059669)', solid: '#10B981', light: '#ECFDF5' },
  { name: 'pink', gradient: 'linear-gradient(135deg, #EC4899, #D946EF)', solid: '#EC4899', light: '#FDF2F8' },
  { name: 'cyan', gradient: 'linear-gradient(135deg, #06B6D4, #0D9488)', solid: '#06B6D4', light: '#ECFEFF' },
  { name: 'indigo', gradient: 'linear-gradient(135deg, #6366F1, #2563EB)', solid: '#6366F1', light: '#EEF2FF' },
];

const getColorScheme = (habit: Habit): ColorScheme => {
  const found = colorSchemes.find(c => c.name === habit.color);
  return found || colorSchemes[0];
};

export const HabitTracker: React.FC<Props> = ({ habits, onUpdate }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🎯');
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);

  const today = getToday();
  const last7Days = getLast7Days();

  const toggleHabit = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    const wasCompleted = habit?.completedDates.includes(today);
    
    const updated = habits.map(h => {
      if (h.id === habitId) {
        const isCompleted = h.completedDates.includes(today);
        return {
          ...h,
          completedDates: isCompleted
            ? h.completedDates.filter(d => d !== today)
            : [...h.completedDates, today],
        };
      }
      return h;
    });
    onUpdate(updated);
    
    if (!wasCompleted) {
      soundManager.playComplete();
    }
  };

  const addHabit = () => {
    if (!newHabitName.trim()) return;
    const newHabit: Habit = {
      id: generateId(),
      name: newHabitName.trim(),
      icon: selectedIcon,
      color: colorSchemes[selectedColorIdx].name,
      completedDates: [],
      createdAt: today,
    };
    onUpdate([...habits, newHabit]);
    setNewHabitName('');
    setShowAddForm(false);
  };

  const deleteHabit = (habitId: string) => {
    onUpdate(habits.filter(h => h.id !== habitId));
  };

  const completedToday = habits.filter(h => h.completedDates.includes(today)).length;
  const totalHabits = habits.length;
  const progressPercent = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Привычки</h2>
          {totalHabits > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {completedToday === totalHabits ? '🎉 Все выполнены!' : `${completedToday} из ${totalHabits} сегодня`}
            </p>
          )}
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-11 h-11 rounded-2xl text-white flex items-center justify-center text-xl font-bold shadow-lg transition-all active:scale-90"
          style={{ background: colorSchemes[0].gradient }}
        >
          {showAddForm ? '−' : '+'}
        </button>
      </div>

      {totalHabits > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Прогресс дня</span>
            <span className="text-sm font-bold" style={{ color: colorSchemes[0].solid }}>{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%`, background: colorSchemes[0].gradient }}
            />
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700 animate-fadeIn">
          <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Новая привычка</h3>
          <input
            type="text"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder="Например: Медитация 10 минут"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white mb-4 focus:outline-none focus:ring-2 text-sm placeholder:text-gray-400"
            onKeyDown={(e) => e.key === 'Enter' && addHabit()}
            autoFocus
          />
          <div className="mb-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-semibold uppercase tracking-wide">Иконка</p>
            <div className="flex flex-wrap gap-2">
              {habitIcons.map(icon => (
                <button
                  key={icon}
                  onClick={() => setSelectedIcon(icon)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
                    selectedIcon === icon
                      ? 'bg-gray-100 dark:bg-gray-700'
                      : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  style={{
                    boxShadow: selectedIcon === icon ? `0 0 0 2px ${colorSchemes[selectedColorIdx].solid}` : undefined,
                    transform: selectedIcon === icon ? 'scale(1.1)' : undefined,
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-5">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-semibold uppercase tracking-wide">Цвет</p>
            <div className="flex flex-wrap gap-2.5">
              {colorSchemes.map((scheme, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColorIdx(idx)}
                  className="w-9 h-9 rounded-full transition-all"
                  style={{
                    background: scheme.gradient,
                    boxShadow: selectedColorIdx === idx ? `0 0 0 3px white, 0 0 0 5px ${scheme.solid}` : undefined,
                    transform: selectedColorIdx === idx ? 'scale(1.15)' : undefined,
                  }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={addHabit}
              disabled={!newHabitName.trim()}
              className="flex-1 py-3 text-white rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: colorSchemes[selectedColorIdx].gradient }}
            >
              Создать
            </button>
            <button
              onClick={() => { setShowAddForm(false); setNewHabitName(''); }}
              className="px-5 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all active:scale-95"
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {habits.map(habit => {
          const streak = getStreak(habit);
          const isCompletedToday = habit.completedDates.includes(today);
          const scheme = getColorScheme(habit);

          return (
            <div
              key={habit.id}
              className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 group"
              style={{
                borderColor: isCompletedToday ? `${scheme.solid}40` : undefined,
              }}
            >
              <div
                className="absolute top-0 left-0 w-1.5 h-full"
                style={{ background: scheme.gradient }}
              />

              <div className="pl-5 pr-4 py-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-gray-100 dark:bg-gray-700"
                    style={{ boxShadow: `inset 0 0 0 1px ${scheme.solid}20` }}
                  >
                    {habit.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-base font-bold truncate ${
                        isCompletedToday
                          ? 'text-gray-400 dark:text-gray-500 line-through'
                          : 'text-gray-800 dark:text-white'
                      }`}
                    >
                      {habit.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-0.5">
                      {streak > 0 && (
                        <span className="inline-flex items-center gap-0.5 text-xs font-bold text-orange-500">
                          🔥 {streak} {streak === 1 ? 'день' : streak < 5 ? 'дня' : 'дней'}
                        </span>
                      )}
                      {isCompletedToday && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500">
                          ✓ Готово
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleHabit(habit.id)}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 active:scale-90 ${
                      !isCompletedToday ? 'border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500' : ''
                    }`}
                    style={
                      isCompletedToday
                        ? { background: scheme.gradient, boxShadow: `0 4px 12px ${scheme.solid}40` }
                        : undefined
                    }
                  >
                    {isCompletedToday ? (
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: `${scheme.solid}40` }} />
                    )}
                  </button>
                </div>

                <div className="flex items-end gap-1 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                  {last7Days.map(day => {
                    const isCompleted = habit.completedDates.includes(day);
                    const isToday = day === today;
                    return (
                      <div key={day} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className={`w-full aspect-square max-w-[28px] rounded-lg flex items-center justify-center transition-all duration-200 ${
                            !isCompleted && !isToday ? 'bg-gray-100 dark:bg-gray-700/50' : ''
                          }`}
                          style={
                            isCompleted
                              ? { background: scheme.gradient, color: 'white' }
                              : isToday
                              ? { border: `2px dashed ${scheme.solid}50`, background: 'transparent' }
                              : undefined
                          }
                        >
                          {isCompleted && (
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span
                          className={`text-[9px] font-semibold ${
                            isToday ? '' : 'text-gray-400 dark:text-gray-500'
                          }`}
                          style={isToday ? { color: scheme.solid } : undefined}
                        >
                          {getDayName(day)}
                        </span>
                      </div>
                    );
                  })}

                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="ml-1 w-6 h-6 rounded-md flex items-center justify-center text-gray-300 hover:text-red-400 dark:text-gray-600 dark:hover:text-red-400 transition-all opacity-60 group-hover:opacity-100 flex-shrink-0 text-xs self-center"
                    title="Удалить привычку"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {habits.length === 0 && !showAddForm && (
        <div className="text-center py-16">
          <div
            className="w-20 h-20 mx-auto mb-4 rounded-3xl flex items-center justify-center"
            style={{ background: colorSchemes[0].light }}
          >
            <span className="text-4xl">🎯</span>
          </div>
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-1">Нет привычек</h3>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-5">Начните формировать полезные привычки прямо сейчас</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 text-white rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95"
            style={{ background: colorSchemes[0].gradient }}
          >
            + Создать первую привычку
          </button>
        </div>
      )}
    </div>
  );
};
