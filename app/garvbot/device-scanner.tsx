import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useGARVBOTStore } from '../../store/garvbot-store';
import GARVBOTService from '../../services/garvbot-service';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

export default function DeviceScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const { availableDevices, setAvailableDevices, setConnectedDevice, connectedDevice } = useGARVBOTStore();

  useEffect(() => {
    startInitialScan();
  }, []);

  const startInitialScan = async () => {
    await startScan();
  };

  const startScan = async () => {
    setIsScanning(true);
    try {
      const devices = await GARVBOTService.scanForDevices();
      setAvailableDevices(devices);
      
      if (devices.length === 0) {
        Alert.alert(
          'Keine Geräte gefunden',
          'Stelle sicher, dass dein GARVBOT eingeschaltet und in der Nähe ist.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Scan failed:', error);
      Alert.alert('Fehler', 'Bluetooth-Scan fehlgeschlagen. Prüfe die Berechtigung.');
    } finally {
      setIsScanning(false);
    }
  };

  const connectToDevice = async (deviceId: string, deviceName: string) => {
    setIsConnecting(deviceId);
    
    try {
      const success = await GARVBOTService.connectToDevice(deviceId);
      
      if (success) {
        const device = availableDevices.find(d => d.id === deviceId);
        if (device) {
          setConnectedDevice({ ...device, status: 'connected' });
          
          Alert.alert(
            'Verbindung erfolgreich! 🎉',
            `${deviceName} ist jetzt verbunden und einsatzbereit.`,
            [{ text: 'Super!' }]
          );
        }
      } else {
        Alert.alert(
          'Verbindung fehlgeschlagen',
          'Konnte nicht mit dem Gerät verbinden. Versuche es erneut.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Connection failed:', error);
      Alert.alert('Fehler', 'Verbindung fehlgeschlagen.');
    } finally {
      setIsConnecting(null);
    }
  };

  const disconnectDevice = async () => {
    try {
      await GARVBOTService.disconnect();
      setConnectedDevice(null);
      Alert.alert('Getrennt', 'Gerät wurde getrennt.');
    } catch (error) {
      console.error('Disconnect failed:', error);
    }
  };

  const renderDevice = ({ item, index }: { item: any; index: number }) => {
    const isConnected = connectedDevice?.id === item.id;
    const isCurrentlyConnecting = isConnecting === item.id;

    return (
      <Animatable.View 
        animation="fadeInUp" 
        delay={index * 100}
        style={[
          styles.deviceItem,
          isConnected && styles.deviceItemConnected
        ]}
      >
        <View style={styles.deviceInfo}>
          <View style={styles.deviceHeader}>
            <Text style={styles.deviceName}>🤖 {item.name}</Text>
            {isConnected && (
              <View style={styles.connectedBadge}>
                <Text style={styles.connectedBadgeText}>Verbunden</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.deviceId}>ID: {item.id.substring(0, 8)}...</Text>
          <Text style={styles.deviceFirmware}>Firmware: {item.firmwareVersion}</Text>
          
          <View style={styles.deviceActions}>
            {isConnected ? (
              <TouchableOpacity 
                style={styles.disconnectButton}
                onPress={disconnectDevice}
              >
                <Ionicons name="close-circle" size={20} color="#fff" />
                <Text style={styles.disconnectButtonText}>Trennen</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.connectButton, isCurrentlyConnecting && styles.connectButtonDisabled]}
                onPress={() => connectToDevice(item.id, item.name)}
                disabled={isCurrentlyConnecting}
              >
                {isCurrentlyConnecting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="bluetooth" size={20} color="#fff" />
                )}
                <Text style={styles.connectButtonText}>
                  {isCurrentlyConnecting ? 'Verbinde...' : 'Verbinden'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animatable.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>GARVBOT Geräte suchen</Text>
        <Text style={styles.subtitle}>
          {connectedDevice ? 
            `✅ Verbunden mit ${connectedDevice.name}` : 
            'Suche nach verfügbaren Robotern'
          }
        </Text>
      </View>

      <View style={styles.scanSection}>
        <TouchableOpacity
          style={[styles.scanButton, isScanning && styles.scanButtonDisabled]}
          onPress={startScan}
          disabled={isScanning}
        >
          {isScanning ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="refresh" size={24} color="#fff" />
          )}
          <Text style={styles.scanButtonText}>
            {isScanning ? 'Suche läuft...' : 'Erneut suchen'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={availableDevices}
        renderItem={renderDevice}
        keyExtractor={(item) => item.id}
        style={styles.deviceList}
        refreshControl={
          <RefreshControl
            refreshing={isScanning}
            onRefresh={startScan}
            colors={['#007AFF']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {isScanning ? (
              <Animatable.View animation="pulse" iterationCount="infinite">
                <Ionicons name="bluetooth" size={64} color="#ccc" />
                <Text style={styles.emptyText}>Suche nach GARVBOT-Geräten...</Text>
                <Text style={styles.emptySubtext}>Stelle sicher, dass dein Roboter eingeschaltet ist</Text>
              </Animatable.View>
            ) : (
              <View>
                <Ionicons name="search" size={64} color="#ccc" />
                <Text style={styles.emptyText}>Keine Geräte gefunden</Text>
                <Text style={styles.emptySubtext}>Tippe auf "Erneut suchen" um zu wiederholen</Text>
              </View>
            )}
          </View>
        }
      />

      {availableDevices.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {availableDevices.length} Gerät{availableDevices.length !== 1 ? 'e' : ''} gefunden
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.9,
  },
  scanSection: {
    padding: 20,
  },
  scanButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scanButtonDisabled: {
    backgroundColor: '#ccc',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  deviceList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  deviceItem: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  deviceItemConnected: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  deviceInfo: {
    padding: 20,
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343a40',
    flex: 1,
  },
  connectedBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  connectedBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deviceId: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 5,
  },
  deviceFirmware: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 15,
  },
  deviceActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  connectButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  connectButtonDisabled: {
    backgroundColor: '#ccc',
  },
  connectButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  disconnectButton: {
    backgroundColor: '#FF5722',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  disconnectButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#adb5bd',
    textAlign: 'center',
    marginTop: 10,
  },
  footer: {
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e1e5e9',
  },
  footerText: {
    textAlign: 'center',
    color: '#6c757d',
    fontSize: 14,
  },
});
