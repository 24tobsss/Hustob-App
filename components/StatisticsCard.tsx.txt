import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { TrendingUp, Clock, Target, Zap } from 'lucide-react-native';
import Card from './Card';
import colors from '@/constants/colors';
import { SPACING } from '@/constants/theme';

export default function StatisticsCard() {
  const colorScheme = useColorScheme() || 'light';
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;
  
  const stats = [
    {
      icon: <Target size={20} color={theme.success} />,
      label: 'Weeds Removed',
      value: '247',
      change: '+12%',
    },
    {
      icon: <Clock size={20} color={theme.primary} />,
      label: 'Runtime Today',
      value: '2.5h',
      change: '+0.5h',
    },
    {
      icon: <TrendingUp size={20} color={theme.warning} />,
      label: 'Efficiency',
      value: '94%',
      change: '+2%',
    },
    {
      icon: <Zap size={20} color={theme.info} />,
      label: 'Battery',
      value: '87%',
      change: '-13%',
    },
  ];
  
  return (
    <Card>
      <Text style={[styles.title, { color: theme.text }]}>Today's Statistics</Text>
      
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <View style={styles.statHeader}>
              {stat.icon}
              <Text style={[styles.statChange, { color: theme.success }]}>
                {stat.change}
              </Text>
            </View>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {stat.value}
            </Text>
            <Text style={[styles.statLabel, { color: theme.inactive }]}>
              {stat.label}
            </Text>
          </View>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    marginBottom: SPACING.md,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
  },
  statChange: {
    fontSize: 12,
    fontWeight: '500',
  },
});