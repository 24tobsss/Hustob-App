import { GarbotCommand, SystemInfo, ServoConfig } from '@/types/garbot';
import { useLogStore } from '@/store/logStore';

// Mock system info for development
const MOCK_SYSTEM_INFO: SystemInfo = {
  ssid: 'HomeWiFi',
  ipAddress: '192.168.1.100',
  mqttStatus: 'connected',
  firmwareVersion: '1.2.3',
};

class HttpService {
  private baseUrl: string | null = null;
  
  setBaseUrl(ipAddress: string): void {
    this.baseUrl = `http://${ipAddress}`;
    useLogStore.getState().addLog({
      timestamp: Date.now(),
      message: `API base URL set to ${this.baseUrl}`,
      level: 'info',
    });
  }
  
  async getSystemInfo(): Promise<SystemInfo> {
    if (!this.baseUrl) {
      throw new Error('Base URL not set');
    }
    
    useLogStore.getState().addLog({
      timestamp: Date.now(),
      message: 'Fetching system info...',
      level: 'info',
    });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    useLogStore.getState().addLog({
      timestamp: Date.now(),
      message: 'System info fetched successfully',
      level: 'info',
    });
    
    return MOCK_SYSTEM_INFO;
  }
  
  async sendCommand(command: GarbotCommand): Promise<boolean> {
    if (!this.baseUrl) {
      throw new Error('Base URL not set');
    }
    
    useLogStore.getState().addLog({
      timestamp: Date.now(),
      message: `Sending command: ${command.task}`,
      level: 'info',
    });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    useLogStore.getState().addLog({
      timestamp: Date.now(),
      message: `Command ${command.task} executed successfully`,
      level: 'info',
    });
    
    return true;
  }
  
  async testServo(config: ServoConfig): Promise<boolean> {
    if (!this.baseUrl) {
      throw new Error('Base URL not set');
    }
    
    useLogStore.getState().addLog({
      timestamp: Date.now(),
      message: `Testing servo on channel ${config.channel} with angle ${config.angle}°`,
      level: 'info',
    });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    useLogStore.getState().addLog({
      timestamp: Date.now(),
      message: `Servo test completed for channel ${config.channel}`,
      level: 'info',
    });
    
    return true;
  }
  
  async sendScanArea(points: { x: number; y: number }[]): Promise<boolean> {
    if (!this.baseUrl) {
      throw new Error('Base URL not set');
    }
    
    useLogStore.getState().addLog({
      timestamp: Date.now(),
      message: `Sending scan area with ${points.length} points`,
      level: 'info',
    });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    useLogStore.getState().addLog({
      timestamp: Date.now(),
      message: 'Scan area sent successfully',
      level: 'info',
    });
    
    return true;
  }
}

export default new HttpService();