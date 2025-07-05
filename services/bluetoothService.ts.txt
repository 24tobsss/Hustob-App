import { Platform } from 'react-native';
import { GarbotDevice } from '@/types/garbot';
import { useLogStore } from '@/store/logStore';

// Mock data for development
const MOCK_DEVICES: GarbotDevice[] = [
  { id: '1', name: 'Garbot_1234', connected: false },
  { id: '2', name: 'Garbot_5678', connected: false },
  { id: '3', name: 'Garbot_9ABC', connected: false },
];

class BluetoothService {
  private isScanning = false;
  
  async requestPermissions(): Promise<boolean> {
    // In a real app, we would request Bluetooth permissions here
    // For now, we'll just simulate success
    useLogStore.getState().addLog({
      timestamp: Date.now(),
      message: 'Bluetooth permissions granted',
      level: 'info',
    });
    
    return true;
  }
  
  async startScan(): Promise<GarbotDevice[]> {
    if (this.isScanning) {
      return [];
    }
    
    if (Platform.OS === 'web') {
      useLogStore.getState().addLog({
        timestamp: Date.now(),
        message: 'Bluetooth scanning not supported on web',
        level: 'warning',
      });
      return [];
    }
    
    this.isScanning = true;
    
    useLogStore.getState().addLog({
      timestamp: Date.now(),
      message: 'Started scanning for Bluetooth devices',
      level: 'info',
    });
    
    // Simulate a delay for scanning
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    this.isScanning = false;
    
    useLogStore.getState().addLog({
      timestamp: Date.now(),
      message: 'Found ' + MOCK_DEVICES.length + ' Garbot devices',
      level: 'info',
    });
    
    return MOCK_DEVICES;
  }
  
  async stopScan(): Promise<void> {
    if (!this.isScanning) {
      return;
    }
    
    this.isScanning = false;
    
    useLogStore.getState().addLog({
      timestamp: Date.now(),
      message: 'Stopped scanning for Bluetooth devices',
      level: 'info',
    });
  }
  
  async connect(deviceId: string): Promise<boolean> {
    useLogStore.getState().addLog({
      timestamp: Date.now(),
      message: `Connecting to device ${deviceId}...`,
      level: 'info',
    });
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    useLogStore.getState().addLog({
      timestamp: Date.now(),
      message: `Connected to device ${deviceId}`,
      level: 'info',
    });
    
    return true;
  }
  
  async disconnect(deviceId: string): Promise<boolean> {
    useLogStore.getState().addLog({
      timestamp: Date.now(),
      message: `Disconnecting from device ${deviceId}...`,
      level: 'info',
    });
    
    // Simulate disconnection delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    useLogStore.getState().addLog({
      timestamp: Date.now(),
      message: `Disconnected from device ${deviceId}`,
      level: 'info',
    });
    
    return true;
  }
  
  async sendWifiCredentials(deviceId: string, ssid: string, password: string): Promise<boolean> {
    useLogStore.getState().addLog({
      timestamp: Date.now(),
      message: `Sending WiFi credentials to device ${deviceId}...`,
      level: 'info',
    });
    
    // Simulate sending credentials
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    useLogStore.getState().addLog({
      timestamp: Date.now(),
      message: `WiFi credentials sent to device ${deviceId}`,
      level: 'info',
    });
    
    return true;
  }
}

export default new BluetoothService();