import { AppState } from './types';

export const getToday = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const getStreak = (habit: { completedDates: string[] }): number => {
  const today = getToday();
  let streak = 0;
  let currentDate = new Date();
  
  // Check if completed today
  if (habit.completedDates.includes(today)) {
    streak = 1;
    currentDate.setDate(currentDate.getDate() - 1);
  } else {
    // Check if completed yesterday
    currentDate.setDate(currentDate.getDate() - 1);
    const yesterday = currentDate.toISOString().split('T')[0];
    if (habit.completedDates.includes(yesterday)) {
      streak = 1;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      return 0;
    }
  }
  
  // Count backwards
  while (true) {
    const dateStr = currentDate.toISOString().split('T')[0];
    if (habit.completedDates.includes(dateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
};

export const getLast7Days = (): string[] => {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().split('T')[0]);
  }
  return days;
};

export const getDayName = (dateStr: string): string => {
  const date = new Date(dateStr);
  const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  return days[date.getDay()];
};

export const getRandomQuote = () => {
  const quotes = [
    { text: "Дисциплина — это мост между целями и достижениями.", author: "Джим Рон" },
    { text: "Мы то, что мы делаем постоянно. Совершенство — не действие, а привычка.", author: "Аристотель" },
    { text: "Единственный способ делать великую работу — любить то, что делаешь.", author: "Стив Джобс" },
    { text: "Маленькие ежедневные улучшения ведут к поразительным результатам.", author: "Робин Шарма" },
    { text: "Успех — это сумма небольших усилий, повторяемых день за днём.", author: "Роберт Кольер" },
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
};

export const loadState = (): AppState => {
  const saved = localStorage.getItem('discipline-flow-state');
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    habits: [],
    dailyGoals: [],
    focusSessions: [],
  };
};

export const saveState = (state: AppState): void => {
  localStorage.setItem('discipline-flow-state', JSON.stringify(state));
};

export const getWeekStats = (habits: { completedDates: string[] }[]): { completed: number; total: number } => {
  const last7Days = getLast7Days();
  let completed = 0;
  const total = habits.length * 7;

  habits.forEach(habit => {
    last7Days.forEach(day => {
      if (habit.completedDates.includes(day)) {
        completed++;
      }
    });
  });

  return { completed, total };
};
