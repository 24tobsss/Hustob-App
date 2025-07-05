import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  GarbotDevice, 
  SystemInfo, 
  ConnectionStatus, 
  ConnectionType,
  ScanArea
} from '@/types/garbot';

interface GarbotState {
  // Connection state
  connectionStatus: ConnectionStatus;
  connectionType: ConnectionType | null;
  availableDevices: GarbotDevice[];
  currentDevice: GarbotDevice | null;
  
  // System info
  systemInfo: SystemInfo | null;
  
  // Scan area
  scanArea: ScanArea;
  
  // Actions
  setConnectionStatus: (status: ConnectionStatus) => void;
  setConnectionType: (type: ConnectionType | null) => void;
  setAvailableDevices: (devices: GarbotDevice[]) => void;
  setCurrentDevice: (device: GarbotDevice | null) => void;
  setSystemInfo: (info: SystemInfo | null) => void;
  setScanArea: (area: ScanArea) => void;
  clearScanArea: () => void;
  resetState: () => void;
}

const initialState = {
  connectionStatus: 'disconnected' as ConnectionStatus,
  connectionType: null,
  availableDevices: [],
  currentDevice: null,
  systemInfo: null,
  scanArea: { points: [] },
};

export const useGarbotStore = create<GarbotState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setConnectionStatus: (status) => set({ connectionStatus: status }),
      setConnectionType: (type) => set({ connectionType: type }),
      setAvailableDevices: (devices) => set({ availableDevices: devices }),
      setCurrentDevice: (device) => set({ currentDevice: device }),
      setSystemInfo: (info) => set({ systemInfo: info }),
      setScanArea: (area) => set({ scanArea: area }),
      clearScanArea: () => set({ scanArea: { points: [] } }),
      resetState: () => set(initialState),
    }),
    {
      name: 'garbot-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        currentDevice: state.currentDevice,
        systemInfo: state.systemInfo,
      }),
    }
  )
);