export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  completedDates: string[];
  createdAt: string;
}

export interface DailyGoal {
  id: string;
  text: string;
  completed: boolean;
  date: string;
}

export interface FocusSession {
  id: string;
  duration: number;
  completedAt: string;
}

export interface AppState {
  habits: Habit[];
  dailyGoals: DailyGoal[];
  focusSessions: FocusSession[];
}
