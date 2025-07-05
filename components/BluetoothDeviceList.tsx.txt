import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  useColorScheme
} from 'react-native';
import { Bluetooth } from 'lucide-react-native';
import Card from './Card';
import { GarbotDevice } from '@/types/garbot';
import colors from '@/constants/colors';
import { SPACING } from '@/constants/theme';

interface BluetoothDeviceListProps {
  devices: GarbotDevice[];
  isScanning: boolean;
  onScan: () => void;
  onConnect: (device: GarbotDevice) => void;
}

export default function BluetoothDeviceList({
  devices,
  isScanning,
  onScan,
  onConnect,
}: BluetoothDeviceListProps) {
  const colorScheme = useColorScheme() || 'light';
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;
  
  return (
    <Card>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Available Devices</Text>
        <TouchableOpacity 
          onPress={onScan} 
          disabled={isScanning}
          style={styles.scanButton}
        >
          {isScanning ? (
            <ActivityIndicator size="small" color={theme.primary} />
          ) : (
            <Text style={{ color: theme.primary }}>Scan</Text>
          )}
        </TouchableOpacity>
      </View>
      
      {devices.length === 0 && !isScanning ? (
        <Text style={[styles.emptyText, { color: theme.inactive }]}>
          No devices found. Tap Scan to search for Garbot devices.
        </Text>
      ) : (
        devices.map((device) => (
          <TouchableOpacity
            key={device.id}
            style={[
              styles.deviceItem,
              { borderBottomColor: theme.border },
            ]}
            onPress={() => onConnect(device)}
          >
            <Bluetooth size={20} color={theme.primary} />
            <View style={styles.deviceInfo}>
              <Text style={[styles.deviceName, { color: theme.text }]}>
                {device.name}
              </Text>
              <Text style={[styles.deviceId, { color: theme.inactive }]}>
                ID: {device.id}
              </Text>
            </View>
            <Text style={{ color: theme.primary }}>Connect</Text>
          </TouchableOpacity>
        ))
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scanButton: {
    padding: SPACING.xs,
  },
  emptyText: {
    textAlign: 'center',
    padding: SPACING.md,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  deviceInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '500',
  },
  deviceId: {
    fontSize: 12,
  },
});