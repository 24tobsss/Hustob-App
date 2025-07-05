import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Text, useColorScheme, RefreshControl } from 'react-native';
import { useGarbotStore } from '@/store/garbotStore';
import { useLogStore } from '@/store/logStore';
import StatusBar from '@/components/StatusBar';
import DeviceCard from '@/components/DeviceCard';
import QuickActions from '@/components/QuickActions';
import StatisticsCard from '@/components/StatisticsCard';
import SystemInfoCard from '@/components/SystemInfoCard';
import CameraPreview from '@/components/CameraPreview';
import LogViewer from '@/components/LogViewer';
import httpService from '@/services/httpService';
import colors from '@/constants/colors';
import { SPACING } from '@/constants/theme';

export default function DashboardScreen() {
  const colorScheme = useColorScheme() || 'light';
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;
  
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const { 
    connectionStatus, 
    connectionType,
    currentDevice,
    systemInfo,
    setSystemInfo
  } = useGarbotStore();
  
  const addLog = useLogStore(state => state.addLog);
  
  const fetchSystemInfo = async () => {
    if (connectionStatus !== 'connected' || !currentDevice) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, we would use the device's IP address
      httpService.setBaseUrl('192.168.1.100');
      const info = await httpService.getSystemInfo();
      setSystemInfo(info);
      
      addLog({
        timestamp: Date.now(),
        message: 'System information updated',
        level: 'info',
      });
    } catch (error) {
      addLog({
        timestamp: Date.now(),
        message: `Failed to fetch system info: ${error}`,
        level: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSystemInfo();
    setRefreshing(false);
  };
  
  useEffect(() => {
    if (connectionStatus === 'connected' && connectionType === 'wifi') {
      fetchSystemInfo();
    }
  }, [connectionStatus, connectionType]);
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.primary}
          colors={[theme.primary]}
        />
      }
    >
      <StatusBar />
      
      {connectionStatus !== 'connected' ? (
        <View style={styles.notConnectedContainer}>
          <Text style={[styles.welcomeTitle, { color: theme.text }]}>
            Welcome to Garbot
          </Text>
          <Text style={[styles.welcomeSubtitle, { color: theme.text }]}>
            Your AI-Powered Garden Assistant
          </Text>
          <Text style={[styles.notConnectedText, { color: theme.text }]}>
            Connect to your Garbot device to get started
          </Text>
          <Text style={[styles.notConnectedSubtext, { color: theme.inactive }]}>
            Go to the Setup tab to scan and connect to your Garbot device. Once connected, you'll be able to control your robot, view camera feeds, and monitor garden maintenance activities.
          </Text>
        </View>
      ) : (
        <>
          <DeviceCard />
          <QuickActions />
          <StatisticsCard />
          <SystemInfoCard systemInfo={systemInfo} isLoading={isLoading} />
          <CameraPreview />
          <LogViewer />
        </>
      )}
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
  notConnectedContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  welcomeSubtitle: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: SPACING.lg,
    opacity: 0.8,
  },
  notConnectedText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  notConnectedSubtext: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: SPACING.md,
  },
});