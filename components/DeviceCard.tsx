import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Cpu, Wifi, Activity, HardDrive } from 'lucide-react-native';
import Card from './Card';
import { useGarbotStore } from '@/store/garbotStore';
import colors from '@/constants/colors';
import { SPACING } from '@/constants/theme';

export default function DeviceCard() {
  const colorScheme = useColorScheme() || 'light';
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;
  
  const { currentDevice, systemInfo, connectionStatus } = useGarbotStore();
  
  if (connectionStatus !== 'connected' || !currentDevice) {
    return null;
  }
  
  return (
    <Card>
      <View style={styles.header}>
        <View>
          <Text style={[styles.deviceName, { color: theme.text }]}>
            {currentDevice.name}
          </Text>
          <Text style={[styles.deviceStatus, { color: theme.success }]}>
            Connected
          </Text>
        </View>
        <View style={[styles.statusIndicator, { backgroundColor: theme.success }]} />
      </View>
      
      {systemInfo && (
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Wifi size={16} color={theme.primary} />
            <Text style={[styles.infoLabel, { color: theme.text }]}>Network</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              {systemInfo.ssid}
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Activity size={16} color={theme.primary} />
            <Text style={[styles.infoLabel, { color: theme.text }]}>MQTT</Text>
            <Text style={[
              styles.infoValue, 
              { color: systemInfo.mqttStatus === 'connected' ? theme.success : theme.error }
            ]}>
              {systemInfo.mqttStatus}
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Cpu size={16} color={theme.primary} />
            <Text style={[styles.infoLabel, { color: theme.text }]}>IP</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              {systemInfo.ipAddress}
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <HardDrive size={16} color={theme.primary} />
            <Text style={[styles.infoLabel, { color: theme.text }]}>Firmware</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              v{systemInfo.firmwareVersion}
            </Text>
          </View>
        </View>
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
  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deviceStatus: {
    fontSize: 14,
    marginTop: 2,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  infoLabel: {
    fontSize: 12,
    marginLeft: SPACING.xs,
    flex: 1,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '500',
  },
});