import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Play, Square, RotateCcw, Zap } from 'lucide-react-native';
import Card from './Card';
import colors from '@/constants/colors';
import { SPACING, BORDER_RADIUS } from '@/constants/theme';
import httpService from '@/services/httpService';
import { useLogStore } from '@/store/logStore';

export default function QuickActions() {
  const colorScheme = useColorScheme() || 'light';
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;
  
  const addLog = useLogStore(state => state.addLog);
  
  const handleQuickAction = async (action: string) => {
    try {
      await httpService.sendCommand({ task: action as any });
      addLog({
        timestamp: Date.now(),
        message: `Quick action: ${action}`,
        level: 'info',
      });
    } catch (error) {
      addLog({
        timestamp: Date.now(),
        message: `Quick action failed: ${error}`,
        level: 'error',
      });
    }
  };
  
  const quickActions = [
    {
      id: 'start_weed',
      title: 'Start',
      subtitle: 'Weed Removal',
      icon: <Play size={20} color="#fff" />,
      color: theme.success,
    },
    {
      id: 'stop',
      title: 'Stop',
      subtitle: 'All Tasks',
      icon: <Square size={20} color="#fff" />,
      color: theme.error,
    },
    {
      id: 'scan',
      title: 'Scan',
      subtitle: 'Area',
      icon: <RotateCcw size={20} color="#fff" />,
      color: theme.primary,
    },
    {
      id: 'servo_test',
      title: 'Test',
      subtitle: 'Servos',
      icon: <Zap size={20} color="#fff" />,
      color: theme.warning,
    },
  ];
  
  return (
    <Card>
      <Text style={[styles.title, { color: theme.text }]}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[styles.actionButton, { backgroundColor: action.color }]}
            onPress={() => handleQuickAction(action.id)}
            activeOpacity={0.8}
          >
            {action.icon}
            <Text style={styles.actionTitle}>{action.title}</Text>
            <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
          </TouchableOpacity>
        ))}
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
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: SPACING.sm,
  },
  actionSubtitle: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.9,
  },
});