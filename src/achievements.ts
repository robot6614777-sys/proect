import { AppState } from './types';
import { getStreak, getToday } from './utils';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (state: AppState) => boolean;
  xp: number;
}

export interface UserProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXp: number;
  achievements: string[];
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_habit',
    name: 'Первый шаг',
    description: 'Создайте свою первую привычку',
    icon: '🌱',
    condition: (state: AppState) => state.habits.length >= 1,
    xp: 10,
  },
  {
    id: 'five_habits',
    name: 'Коллекционер',
    description: 'Создайте 5 привычек',
    icon: '📚',
    condition: (state: AppState) => state.habits.length >= 5,
    xp: 50,
  },
  {
    id: 'first_completion',
    name: 'Начало пути',
    description: 'Выполните первую привычку',
    icon: '✨',
    condition: (state: AppState) => state.habits.some(h => h.completedDates.length > 0),
    xp: 15,
  },
  {
    id: 'streak_3',
    name: 'Три дня подряд',
    description: 'Достигните серии в 3 дня',
    icon: '🔥',
    condition: (state: AppState) => state.habits.some(h => getStreak(h) >= 3),
    xp: 30,
  },
  {
    id: 'streak_7',
    name: 'Недельный воин',
    description: 'Достигните серии в 7 дней',
    icon: '⚔️',
    condition: (state: AppState) => state.habits.some(h => getStreak(h) >= 7),
    xp: 100,
  },
  {
    id: 'streak_30',
    name: 'Мастер дисциплины',
    description: 'Достигните серии в 30 дней',
    icon: '👑',
    condition: (state: AppState) => state.habits.some(h => getStreak(h) >= 30),
    xp: 500,
  },
  {
    id: 'focus_1',
    name: 'Первый фокус',
    description: 'Завершите первую сессию фокуса',
    icon: '🎯',
    condition: (state: AppState) => state.focusSessions.length >= 1,
    xp: 20,
  },
  {
    id: 'focus_10',
    name: 'Мастер концентрации',
    description: 'Завершите 10 сессий фокуса',
    icon: '🧠',
    condition: (state: AppState) => state.focusSessions.length >= 10,
    xp: 100,
  },
  {
    id: 'focus_50',
    name: 'Дзен-мастер',
    description: 'Завершите 50 сессий фокуса',
    icon: '🧘',
    condition: (state: AppState) => state.focusSessions.length >= 50,
    xp: 300,
  },
  {
    id: 'perfect_day',
    name: 'Идеальный день',
    description: 'Выполните все привычки за день',
    icon: '🌟',
    condition: (state: AppState) => {
      const today = getToday();
      return state.habits.length > 0 && state.habits.every(h => h.completedDates.includes(today));
    },
    xp: 50,
  },
  {
    id: 'goals_master',
    name: 'Целеустремлённый',
    description: 'Выполните 10 ежедневных целей',
    icon: '🎪',
    condition: (state: AppState) => state.dailyGoals.filter(g => g.completed).length >= 10,
    xp: 75,
  },
  {
    id: 'century',
    name: 'Сотня',
    description: 'Выполните 100 привычек суммарно',
    icon: '💯',
    condition: (state: AppState) => state.habits.reduce((sum, h) => sum + h.completedDates.length, 0) >= 100,
    xp: 200,
  },
];

export const calculateUserProgress = (state: AppState): UserProgress => {
  const earnedAchievements = ACHIEVEMENTS.filter(a => a.condition(state));
  const totalXp = earnedAchievements.reduce((sum, a) => sum + a.xp, 0);
  
  const habitCompletions = state.habits.reduce((sum, h) => sum + h.completedDates.length, 0);
  const focusMinutes = state.focusSessions.reduce((sum, s) => sum + s.duration, 0);
  const goalsCompleted = state.dailyGoals.filter(g => g.completed).length;
  
  const activityXp = habitCompletions * 5 + Math.floor(focusMinutes / 5) + goalsCompleted * 3;
  const finalXp = totalXp + activityXp;
  
  const level = Math.floor(Math.sqrt(finalXp / 100)) + 1;
  const xpForCurrentLevel = Math.pow(level - 1, 2) * 100;
  const xpForNextLevel = Math.pow(level, 2) * 100;
  const xpToNextLevel = xpForNextLevel - xpForCurrentLevel;
  const currentLevelXp = finalXp - xpForCurrentLevel;
  
  return {
    level,
    xp: currentLevelXp,
    xpToNextLevel,
    totalXp: finalXp,
    achievements: earnedAchievements.map(a => a.id),
  };
};

export const getLevelTitle = (level: number): string => {
  if (level < 3) return 'Новичок';
  if (level < 5) return 'Ученик';
  if (level < 8) return 'Практик';
  if (level < 12) return 'Мастер';
  if (level < 16) return 'Эксперт';
  if (level < 20) return 'Гуру';
  return 'Легенда';
};
