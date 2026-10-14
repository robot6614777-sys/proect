import React, { useState, useEffect, useRef } from 'react';
import { FocusSession } from '../types';
import { generateId } from '../utils';
import { soundManager } from '../sounds';

interface Props {
  sessions: FocusSession[];
  onUpdate: (sessions: FocusSession[]) => void;
}

export const FocusTimer: React.FC<Props> = ({ sessions, onUpdate }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [focusDuration, setFocusDuration] = useState(25);
  const intervalRef = useRef<number | null>(null);

  const totalSeconds = mode === 'focus' ? focusDuration * 60 : 5 * 60;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (mode === 'focus') {
        const newSession: FocusSession = {
          id: generateId(),
          duration: focusDuration,
          completedAt: new Date().toISOString(),
        };
        onUpdate([...sessions, newSession]);
        soundManager.playTimerComplete();
      }
      setIsRunning(false);
      const nextMode = mode === 'focus' ? 'break' : 'focus';
      setMode(nextMode);
      setTimeLeft(nextMode === 'focus' ? focusDuration * 60 : 5 * 60);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? focusDuration * 60 : 5 * 60);
  };

  const switchMode = (newMode: 'focus' | 'break') => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'focus' ? focusDuration * 60 : 5 * 60);
  };

  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const todaySessions = sessions.filter(s => {
    const sessionDate = new Date(s.completedAt).toISOString().split('T')[0];
    return sessionDate === new Date().toISOString().split('T')[0];
  });

  const totalFocusToday = todaySessions.reduce((acc, s) => acc + s.duration, 0);

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">Таймер фокусировки</h2>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => switchMode('focus')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
              mode === 'focus'
                ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md shadow-violet-200 dark:shadow-violet-900/30'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            🎯 Фокус
          </button>
          <button
            onClick={() => switchMode('break')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
              mode === 'break'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900/30'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            ☕ Перерыв
          </button>
        </div>

        <div className="relative w-52 h-52 mx-auto mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="44"
              fill="none"
              stroke="currentColor"
              className="text-gray-100 dark:text-gray-700"
              strokeWidth="5"
            />
            <circle
              cx="50" cy="50" r="44"
              fill="none"
              stroke={mode === 'focus' ? '#8B5CF6' : '#10B981'}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 44}`}
              strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress / 100)}`}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-gray-800 dark:text-white font-mono tracking-tight">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-wide">
              {mode === 'focus' ? 'фокус' : 'перерыв'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mb-5">
          <button
            onClick={resetTimer}
            className="w-11 h-11 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all active:scale-90 text-lg"
          >
            ↺
          </button>
          <button
            onClick={toggleTimer}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all active:scale-95 text-2xl ${
              mode === 'focus'
                ? 'bg-gradient-to-br from-violet-500 to-purple-600 shadow-violet-200 dark:shadow-violet-900/40'
                : 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-200 dark:shadow-emerald-900/40'
            }`}
          >
            {isRunning ? '⏸' : '▶'}
          </button>
          <div className="w-11 h-11"></div>
        </div>

        {mode === 'focus' && (
          <div className="flex items-center justify-center gap-2">
            {[15, 25, 45, 60].map(d => (
              <button
                key={d}
                onClick={() => {
                  setFocusDuration(d);
                  if (!isRunning) setTimeLeft(d * 60);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  focusDuration === d
                    ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 ring-1 ring-violet-300 dark:ring-violet-700'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}
              >
                {d} мин
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl p-5 border border-emerald-200/60 dark:border-emerald-800/60">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Сегодня сфокусирован</p>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{totalFocusToday} <span className="text-lg font-medium">мин</span></p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Сессий</p>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{todaySessions.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">💡 Советы</h3>
        <ul className="space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-violet-400 mt-0.5">•</span>
            Начните с 25 минут фокуса — это оптимально для большинства задач
          </li>
          <li className="flex items-start gap-2">
            <span className="text-violet-400 mt-0.5">•</span>
            Во время перерыва встаньте и пройдитесь
          </li>
          <li className="flex items-start gap-2">
            <span className="text-violet-400 mt-0.5">•</span>
            Уберите телефон и уведомления перед фокусом
          </li>
        </ul>
      </div>
    </div>
  );
};
