import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';
import { Wifi, Server, Info } from 'lucide-react-native';
import Card from './Card';
import { SystemInfo } from '@/types/garbot';
import colors from '@/constants/colors';
import { SPACING } from '@/constants/theme';

interface SystemInfoCardProps {
  systemInfo: SystemInfo | null;
  isLoading?: boolean;
}

export default function SystemInfoCard({ 
  systemInfo, 
  isLoading = false 
}: SystemInfoCardProps) {
  const colorScheme = useColorScheme() || 'light';
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;
  
  if (isLoading) {
    return (
      <Card>
        <Text style={[styles.title, { color: theme.text }]}>
          Loading system information...
        </Text>
      </Card>
    );
  }
  
  if (!systemInfo) {
    return (
      <Card>
        <Text style={[styles.title, { color: theme.text }]}>
          No system information available
        </Text>
        <Text style={[styles.subtitle, { color: theme.text }]}>
          Connect to your Garbot to view system information
        </Text>
      </Card>
    );
  }
  
  return (
    <Card>
      <Text style={[styles.title, { color: theme.text }]}>System Information</Text>
      
      <View style={styles.infoRow}>
        <Wifi size={20} color={theme.primary} />
        <View style={styles.infoContent}>
          <Text style={[styles.infoLabel, { color: theme.text }]}>WiFi Network</Text>
          <Text style={[styles.infoValue, { color: theme.text }]}>{systemInfo.ssid}</Text>
        </View>
      </View>
      
      <View style={styles.infoRow}>
        <Server size={20} color={theme.primary} />
        <View style={styles.infoContent}>
          <Text style={[styles.infoLabel, { color: theme.text }]}>IP Address</Text>
          <Text style={[styles.infoValue, { color: theme.text }]}>{systemInfo.ipAddress}</Text>
        </View>
      </View>
      
      <View style={styles.infoRow}>
        <Info size={20} color={theme.primary} />
        <View style={styles.infoContent}>
          <Text style={[styles.infoLabel, { color: theme.text }]}>MQTT Status</Text>
          <Text 
            style={[
              styles.infoValue, 
              { 
                color: systemInfo.mqttStatus === 'connected' 
                  ? theme.success 
                  : theme.error 
              }
            ]}
          >
            {systemInfo.mqttStatus === 'connected' ? 'Connected' : 'Disconnected'}
          </Text>
        </View>
      </View>
      
      <View style={styles.infoRow}>
        <Info size={20} color={theme.primary} />
        <View style={styles.infoContent}>
          <Text style={[styles.infoLabel, { color: theme.text }]}>Firmware Version</Text>
          <Text style={[styles.infoValue, { color: theme.text }]}>{systemInfo.firmwareVersion}</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  infoContent: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
});