import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { useGARVBOTStore } from '../../store/garvbot-store';
import { SensorDisplay } from '../../components/garvbot/SensorDisplay';
import { ServoControls } from '../../components/garvbot/ServoControls';
import { QuickActions } from '../../components/garvbot/QuickActions';
import { Ionicons } from '@expo/vector-icons';

export default function RobotController() {
  const { connectedDevice, sensorData, connectionMode } = useGARVBOTStore();
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);

  useEffect(() => {
    if (!connectedDevice) {
      Alert.alert(
        'Kein Gerät verbunden',
        'Verbinde zuerst einen GARVBOT um ihn zu steuern.',
        [{ text: 'OK' }]
      );
    }
  }, [connectedDevice]);

  const handleEmergencyStop = () => {
    setIsEmergencyActive(true);
    Alert.alert(
      '🛑 Notfall-Stopp aktiviert',
      'Alle Bewegungen wurden gestoppt. Tippe auf "System zurücksetzen" um fortzufahren.',
      [{ text: 'Verstanden' }]
    );
  };

  const resetEmergency = () => {
    setIsEmergencyActive(false);
    Alert.alert('System zurückgesetzt', 'GARVBOT ist wieder einsatzbereit.');
  };

  if (!connectedDevice) {
    return (
      <View style={styles.noDeviceContainer}>
        <Ionicons name="hardware-chip-outline" size={80} color="#ccc" />
        <Text style={styles.noDeviceTitle}>Kein GARVBOT verbunden</Text>
        <Text style={styles.noDeviceText}>
          Gehe zu "Geräte suchen" um einen Roboter zu verbinden
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Device Header */}
      <View style={styles.deviceHeader}>
        <View style={styles.deviceInfo}>
          <Text style={styles.deviceName}>🤖 {connectedDevice.name}</Text>
          <View style={styles.connectionInfo}>
            <View style={[styles.connectionDot, styles.connectionDotConnected]} />
            <Text style={styles.connectionText}>
              Verbunden via {connectionMode === 'bluetooth' ? 'Bluetooth' : 'WiFi'}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.emergencyButton, isEmergencyActive && styles.emergencyButtonActive]}
          onPress={isEmergencyActive ? resetEmergency : handleEmergencyStop}
        >
          <Ionicons 
            name={isEmergencyActive ? "refresh" : "stop"} 
            size={24} 
            color="#fff" 
          />
          <Text style={styles.emergencyButtonText}>
            {isEmergencyActive ? 'Reset' : 'Stopp'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Emergency Warning */}
      {isEmergencyActive && (
        <View style={styles.emergencyWarning}>
          <Ionicons name="warning" size={24} color="#FF5722" />
          <Text style={styles.emergencyWarningText}>
            🛑 Notfall-Stopp aktiv - Alle Bewegungen gestoppt
          </Text>
        </View>
      )}

      {/* Sensor Display */}
      <SensorDisplay data={sensorData} />

      {/* Servo Controls */}
      <ServoControls disabled={isEmergencyActive} />

      {/* Quick Actions */}
      <QuickActions disabled={isEmergencyActive} />

      {/* System Info */}
      <View style={styles.systemInfo}>
        <Text style={styles.systemInfoTitle}>System-Information</Text>
        <View style={styles.systemInfoGrid}>
          <View style={styles.systemInfoItem}>
            <Text style={styles.systemInfoLabel}>Firmware</Text>
            <Text style={styles.systemInfoValue}>{connectedDevice.firmwareVersion}</Text>
          </View>
          <View style={styles.systemInfoItem}>
            <Text style={styles.systemInfoLabel}>Verbindung</Text>
            <Text style={styles.systemInfoValue}>
              {connectionMode === 'bluetooth' ? '📱 Bluetooth' : '📶 WiFi'}
            </Text>
          </View>
          <View style={styles.systemInfoItem}>
            <Text style={styles.systemInfoLabel}>Status</Text>
            <Text style={[
              styles.systemInfoValue,
              { color: isEmergencyActive ? '#FF5722' : '#4CAF50' }
            ]}>
              {isEmergencyActive ? '🛑 Gestoppt' : '✅ Aktiv'}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  deviceHeader: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  connectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  connectionDotConnected: {
    backgroundColor: '#fff',
  },
  connectionText: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  emergencyButton: {
    backgroundColor: '#FF5722',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emergencyButtonActive: {
    backgroundColor: '#FF9800',
  },
  emergencyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  emergencyWarning: {
    backgroundColor: '#ffebee',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    margin: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FF5722',
  },
  emergencyWarningText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#FF5722',
    fontWeight: '600',
  },
  systemInfo: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  systemInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 15,
  },
  systemInfoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  systemInfoItem: {
    alignItems: 'center',
  },
  systemInfoLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 5,
  },
  systemInfoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#343a40',
  },
  noDeviceContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#f8f9fa',
  },
  noDeviceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6c757d',
    marginTop: 20,
    textAlign: 'center',
  },
  noDeviceText: {
    fontSize: 16,
    color: '#adb5bd',
    marginTop: 15,
    textAlign: 'center',
    lineHeight: 24,
  },
});
