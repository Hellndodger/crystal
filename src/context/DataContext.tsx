import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  username: string;
  bodyWeight: number;
  selectedStatsExercises: string[];
}

interface WorkoutSet {
  time: number; // seconds
  addedWeight: number; // kg
}

interface WorkoutLog {
  id: string;
  date: string;
  exercises: {
    name: string;
    sets: WorkoutSet[];
  }[];
}

interface AppData {
  user: User;
  availableExercises: string[];
  logs: WorkoutLog[];
}

interface DataContextType {
  data: AppData;
  saveWorkout: (workoutData: Omit<WorkoutLog, 'id'>) => void;
  updateUserStats: (key: keyof User, value: any) => void;
  getLogs: () => WorkoutLog[];
}

const defaultData: AppData = {
  user: {
    username: 'Athlete',
    bodyWeight: 75,
    selectedStatsExercises: [],
  },
  availableExercises: [
    'Planche',
    'Front Lever',
    'Back Lever',
    'L-Sit',
    'Human Flag',
    'Maltese',
    'Iron Cross',
  ],
  logs: [],
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<AppData>(defaultData);

  // Initialize from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('calisthenics-arrow-data');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setData(parsed);
      } catch (error) {
        console.error('Failed to parse stored data:', error);
        localStorage.setItem('calisthenics-arrow-data', JSON.stringify(defaultData));
      }
    } else {
      localStorage.setItem('calisthenics-arrow-data', JSON.stringify(defaultData));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('calisthenics-arrow-data', JSON.stringify(data));
  }, [data]);

  const saveWorkout = (workoutData: Omit<WorkoutLog, 'id'>) => {
    const newLog: WorkoutLog = {
      ...workoutData,
      id: Date.now().toString(),
    };
    setData((prev) => ({
      ...prev,
      logs: [newLog, ...prev.logs],
    }));
  };

  const updateUserStats = (key: keyof User, value: any) => {
    setData((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        [key]: value,
      },
    }));
  };

  const getLogs = () => data.logs;

  return (
    <DataContext.Provider value={{ data, saveWorkout, updateUserStats, getLogs }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
