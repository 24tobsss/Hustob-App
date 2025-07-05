import React from 'react';
import { ScrollView, StyleSheet, View, Text, useColorScheme } from 'react-native';
import { useGarbotStore } from '@/store/garbotStore';
import StatusBar from '@/components/StatusBar';
import ControlPanel from '@/components/ControlPanel';
import AdvancedControls from '@/components/AdvancedControls';
import DrawingCanvas from '@/components/DrawingCanvas';
import ServoController from '@/components/ServoController';
import LogViewer from '@/components/LogViewer';
import colors from '@/constants/colors';
import { SPACING } from '@/constants/theme';

export default function ControlScreen() {
  const colorScheme = useColorScheme() || 'light';
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;
  
  const { connectionStatus } = useGarbotStore();
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <StatusBar />
      
      {connectionStatus !== 'connected' ? (
        <View style={styles.notConnectedContainer}>
          <Text style={[styles.notConnectedText, { color: theme.text }]}>
            Device Not Connected
          </Text>
          <Text style={[styles.notConnectedSubtext, { color: theme.inactive }]}>
            Connect to your Garbot in the Setup tab to access control features
          </Text>
        </View>
      ) : (
        <>
          <ControlPanel />
          <AdvancedControls />
          <DrawingCanvas />
          <ServoController />
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
    marginTop: SPACING.xxl,
  },
  notConnectedText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  notConnectedSubtext: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});