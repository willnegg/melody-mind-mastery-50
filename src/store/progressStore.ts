import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressData {
  completed: boolean;
  lastPracticed: string;
  timesCompleted: number;
}

interface EarTrainingScore {
  score: number;
  totalQuestions: number;
  lastAttempt: string;
}

interface ProgressStore {
  scales: Record<string, ProgressData>;
  chords: Record<string, ProgressData>;
  earTraining: {
    intervals: EarTrainingScore;
    chords: EarTrainingScore;
    scales: EarTrainingScore;
    progressions: EarTrainingScore;
  };
  streakDays: number;
  lastPracticeDate: string;
  totalPracticeTime: number;
  
  // Actions
  completeScale: (scaleId: string) => void;
  completeChord: (chordId: string) => void;
  updateEarTrainingScore: (type: keyof ProgressStore['earTraining'], score: number, total: number) => void;
  recordPracticeSession: () => void;
  getCompletionPercentage: () => number;
  getStreakDays: () => number;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      scales: {},
      chords: {},
      earTraining: {
        intervals: { score: 0, totalQuestions: 0, lastAttempt: '' },
        chords: { score: 0, totalQuestions: 0, lastAttempt: '' },
        scales: { score: 0, totalQuestions: 0, lastAttempt: '' },
        progressions: { score: 0, totalQuestions: 0, lastAttempt: '' },
      },
      streakDays: 0,
      lastPracticeDate: '',
      totalPracticeTime: 0,

      completeScale: (scaleId: string) => {
        const today = new Date().toDateString();
        set((state) => ({
          scales: {
            ...state.scales,
            [scaleId]: {
              completed: true,
              lastPracticed: today,
              timesCompleted: (state.scales[scaleId]?.timesCompleted || 0) + 1,
            },
          },
        }));
        get().recordPracticeSession();
      },

      completeChord: (chordId: string) => {
        const today = new Date().toDateString();
        set((state) => ({
          chords: {
            ...state.chords,
            [chordId]: {
              completed: true,
              lastPracticed: today,
              timesCompleted: (state.chords[chordId]?.timesCompleted || 0) + 1,
            },
          },
        }));
        get().recordPracticeSession();
      },

      updateEarTrainingScore: (type, score, total) => {
        const today = new Date().toDateString();
        set((state) => ({
          earTraining: {
            ...state.earTraining,
            [type]: {
              score: score,
              totalQuestions: total,
              lastAttempt: today,
            },
          },
        }));
        get().recordPracticeSession();
      },

      recordPracticeSession: () => {
        const today = new Date().toDateString();
        const state = get();
        
        if (state.lastPracticeDate === today) {
          return; // Already practiced today
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const wasYesterday = state.lastPracticeDate === yesterday.toDateString();

        set({
          lastPracticeDate: today,
          streakDays: wasYesterday ? state.streakDays + 1 : 1,
          totalPracticeTime: state.totalPracticeTime + 1,
        });
      },

      getCompletionPercentage: () => {
        const state = get();
        const totalScales = Object.keys(state.scales).length;
        const totalChords = Object.keys(state.chords).length;
        const completedScales = Object.values(state.scales).filter(s => s.completed).length;
        const completedChords = Object.values(state.chords).filter(c => c.completed).length;
        
        const total = totalScales + totalChords;
        const completed = completedScales + completedChords;
        
        return total > 0 ? Math.round((completed / total) * 100) : 0;
      },

      getStreakDays: () => {
        const state = get();
        const today = new Date().toDateString();
        
        if (state.lastPracticeDate === today) {
          return state.streakDays;
        }
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (state.lastPracticeDate === yesterday.toDateString()) {
          return state.streakDays;
        }
        
        return 0; // Streak broken
      },
    }),
    {
      name: 'music-theory-progress',
    }
  )
);