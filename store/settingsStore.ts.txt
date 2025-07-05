import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  useSystemTheme: boolean;
  autoConnect: boolean;
  
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setUseSystemTheme: (use: boolean) => void;
  setAutoConnect: (auto: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      useSystemTheme: true,
      autoConnect: true,
      
      setTheme: (theme) => set({ theme }),
      setUseSystemTheme: (useSystemTheme) => set({ useSystemTheme }),
      setAutoConnect: (autoConnect) => set({ autoConnect }),
    }),
    {
      name: 'garbot-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);