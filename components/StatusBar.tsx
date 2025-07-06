import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Wifi, WifiOff, Bluetooth, BluetoothOff, Battery, Signal } from 'lucide-react-native';
import { useGarbotStore } from '@/store/garbotStore';
import colors from '@/constants/colors';
import { SPACING, BORDER_RADIUS } from '@/constants/theme';

export default function StatusBar() {
  const colorScheme = useColorScheme() || 'light';
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;
  
  const { connectionStatus, connectionType, currentDevice, systemInfo } = useGarbotStore();
  
  const getConnectionIcon = () => {
    if (connectionStatus !== 'connected') {
      return <BluetoothOff size={16} color={theme.error} />;
    }
    
    if (connectionType === 'bluetooth') {
      return <Bluetooth size={16} color={theme.primary} />;
    }
    
    if (connectionType === 'wifi') {
      return <Wifi size={16} color={theme.success} />;
    }
    
    return <WifiOff size={16} color={theme.inactive} />;
  };
  
  const getConnectionText = () => {
    if (connectionStatus === 'connecting') return 'Connecting...';
    if (connectionStatus === 'connected' && currentDevice) {
      return connectionType === 'wifi' ? 'WiFi Connected' : 'Bluetooth Connected';
    }
    return 'Disconnected';
  };
  
  const getConnectionColor = () => {
    if (connectionStatus === 'connecting') return theme.warning;
    if (connectionStatus === 'connected') {
      return connectionType === 'wifi' ? theme.success : theme.primary;
    }
    return theme.error;
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.statusItem}>
        {getConnectionIcon()}
        <Text style={[styles.statusText, { color: getConnectionColor() }]}>
          {getConnectionText()}
        </Text>
      </View>
      
      {systemInfo && (
        <>
          <View style={styles.separator} />
          <View style={styles.statusItem}>
            <Signal size={16} color={theme.success} />
            <Text style={[styles.statusText, { color: theme.text }]}>
              {systemInfo.ipAddress}
            </Text>
          </View>
          
          <View style={styles.separator} />
          <View style={styles.statusItem}>
            <Battery size={16} color={theme.success} />
            <Text style={[styles.statusText, { color: theme.text }]}>
              {systemInfo.firmwareVersion}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: SPACING.xs,
  },
  separator: {
    width: 1,
    height: 16,
    backgroundColor: '#ddd',
    marginHorizontal: SPACING.md,
  },
});