import { create } from 'zustand';
import { LogEntry } from '@/types/garbot';

interface LogState {
  logs: LogEntry[];
  addLog: (log: Omit<LogEntry, 'id'>) => void;
  clearLogs: () => void;
}

export const useLogStore = create<LogState>((set) => ({
  logs: [],
  
  addLog: (log) => set((state) => ({
    logs: [
      {
        ...log,
        id: Date.now().toString(),
      },
      ...state.logs,
    ].slice(0, 1000), // Keep only the last 1000 logs
  })),
  
  clearLogs: () => set({ logs: [] }),
}));