export interface GarbotDevice {
  id: string;
  name: string;
  connected: boolean;
}

export interface SystemInfo {
  ssid: string;
  ipAddress: string;
  mqttStatus: 'connected' | 'disconnected';
  firmwareVersion: string;
}

export interface LogEntry {
  id: string;
  timestamp: number;
  message: string;
  level: 'info' | 'warning' | 'error' | 'debug';
}

export interface ScanArea {
  points: { x: number; y: number }[];
}

export interface ServoConfig {
  channel: number;
  angle: number;
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';
export type ConnectionType = 'bluetooth' | 'wifi';

export interface GarbotCommand {
  task: 'start_weed' | 'start_moss' | 'stop' | 'scan' | 'servo_test';
  params?: Record<string, any>;
}