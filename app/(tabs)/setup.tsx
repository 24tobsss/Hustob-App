import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, useColorScheme } from 'react-native';
import { useGarbotStore } from '@/store/garbotStore';
import { useLogStore } from '@/store/logStore';
import { GarbotDevice } from '@/types/garbot';
import ConnectionWizard from '@/components/ConnectionWizard';
import BluetoothDeviceList from '@/components/BluetoothDeviceList';
import WifiSetupForm from '@/components/WifiSetupForm';
import LogViewer from '@/components/LogViewer';
import Button from '@/components/Button';
import bluetoothService from '@/services/bluetoothService';
import colors from '@/constants/colors';
import { SPACING } from '@/constants/theme';

export default function SetupScreen() {
  const colorScheme = useColorScheme() || 'light';
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;
  
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  const { 
    availableDevices, 
    setAvailableDevices,
    connectionStatus,
    connectionType,
    currentDevice,
    setCurrentDevice,
    setConnectionStatus,
    setConnectionType,
  } = useGarbotStore();
  
  const addLog = useLogStore(state => state.addLog);
  
  useEffect(() => {
    requestPermissions();
  }, []);
  
  const requestPermissions = async () => {
    try {
      const granted = await bluetoothService.requestPermissions();
      setHasPermission(granted);
      
      if (granted) {
        addLog({
          timestamp: Date.now(),
          message: 'Bluetooth permissions granted',
          level: 'info',
        });
      } else {
        addLog({
          timestamp: Date.now(),
          message: 'Bluetooth permissions denied',
          level: 'error',
        });
      }
    } catch (error) {
      addLog({
        timestamp: Date.now(),
        message: `Error requesting permissions: ${error}`,
        level: 'error',
      });
      setHasPermission(false);
    }
  };
  
  const handleScan = async () => {
    if (isScanning) return;
    
    setIsScanning(true);
    
    try {
      const devices = await bluetoothService.startScan();
      setAvailableDevices(devices);
    } catch (error) {
      addLog({
        timestamp: Date.now(),
        message: `Scan error: ${error}`,
        level: 'error',
      });
    } finally {
      setIsScanning(false);
    }
  };
  
  const handleConnect = async (device: GarbotDevice) => {
    setConnectionStatus('connecting');
    
    try {
      const success = await bluetoothService.connect(device.id);
      
      if (success) {
        setCurrentDevice({
          ...device,
          connected: true,
        });
        setConnectionStatus('connected');
        setConnectionType('bluetooth');
        
        addLog({
          timestamp: Date.now(),
          message: `Connected to ${device.name}`,
          level: 'info',
        });
      } else {
        throw new Error('Failed to connect');
      }
    } catch (error) {
      addLog({
        timestamp: Date.now(),
        message: `Connection error: ${error}`,
        level: 'error',
      });
      setConnectionStatus('disconnected');
    }
  };
  
  const handleDisconnect = async () => {
    if (!currentDevice) return;
    
    try {
      await bluetoothService.disconnect(currentDevice.id);
      
      setCurrentDevice(null);
      setConnectionStatus('disconnected');
      setConnectionType(null);
      
      addLog({
        timestamp: Date.now(),
        message: 'Disconnected from device',
        level: 'info',
      });
    } catch (error) {
      addLog({
        timestamp: Date.now(),
        message: `Disconnect error: ${error}`,
        level: 'error',
      });
    }
  };
  
  const handleSetupComplete = () => {
    addLog({
      timestamp: Date.now(),
      message: 'WiFi setup completed successfully',
      level: 'info',
    });
  };
  
  if (hasPermission === false) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.permissionContainer}>
          <Text style={[styles.permissionTitle, { color: theme.text }]}>
            Bluetooth Access Required
          </Text>
          <Text style={[styles.permissionText, { color: theme.text }]}>
            Garbot needs Bluetooth access to connect to your device during initial setup
          </Text>
          <Button 
            title="Grant Permissions" 
            onPress={requestPermissions} 
            style={styles.permissionButton}
          />
        </View>
      </View>
    );
  }
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <ConnectionWizard />
      
      {connectionStatus === 'connected' && currentDevice ? (
        <View style={styles.connectedContainer}>
          <Text style={[styles.connectedText, { color: theme.text }]}>
            Connected to {currentDevice.name}
          </Text>
          
          {connectionType === 'bluetooth' ? (
            <WifiSetupForm onSetupComplete={handleSetupComplete} />
          ) : (
            <View style={styles.completedContainer}>
              <Text style={[styles.completedText, { color: theme.success }]}>
                ✓ Setup Complete!
              </Text>
              <Text style={[styles.completedSubtext, { color: theme.text }]}>
                Your Garbot is connected to WiFi and ready to use
              </Text>
            </View>
          )}
          
          <Button 
            title="Disconnect Device" 
            onPress={handleDisconnect} 
            variant="outline"
            style={styles.disconnectButton}
          />
        </View>
      ) : (
        <BluetoothDeviceList
          devices={availableDevices}
          isScanning={isScanning}
          onScan={handleScan}
          onConnect={handleConnect}
        />
      )}
      
      <LogViewer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: SPACING.xxl,
  },
  permissionContainer: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 24,
  },
  permissionButton: {
    width: '80%',
  },
  connectedContainer: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  connectedText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  completedContainer: {
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  completedText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  completedSubtext: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  disconnectButton: {
    marginTop: SPACING.md,
  },
});