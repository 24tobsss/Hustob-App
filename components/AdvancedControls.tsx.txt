import React, { useState } from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Settings2, Target, MapPin, Zap } from 'lucide-react-native';
import Card from './Card';
import Button from './Button';
import colors from '@/constants/colors';
import { SPACING } from '@/constants/theme';
import httpService from '@/services/httpService';
import { useLogStore } from '@/store/logStore';

export default function AdvancedControls() {
  const colorScheme = useColorScheme() || 'light';
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;
  
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const addLog = useLogStore(state => state.addLog);
  
  const handleAdvancedCommand = async (command: string, params?: any) => {
    setIsLoading(command);
    
    try {
      await httpService.sendCommand({ task: command as any, params });
      
      addLog({
        timestamp: Date.now(),
        message: `Advanced command ${command} executed`,
        level: 'info',
      });
    } catch (error) {
      addLog({
        timestamp: Date.now(),
        message: `Advanced command failed: ${error}`,
        level: 'error',
      });
    } finally {
      setIsLoading(null);
    }
  };
  
  return (
    <Card>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Advanced Controls</Text>
        <Settings2 size={20} color={theme.primary} />
      </View>
      
      <View style={styles.controlsGrid}>
        <Button
          title="Calibrate Position"
          onPress={() => handleAdvancedCommand('calibrate')}
          loading={isLoading === 'calibrate'}
          icon={<Target size={16} color="#fff" />}
          style={styles.controlButton}
          size="small"
        />
        
        <Button
          title="Return to Base"
          onPress={() => handleAdvancedCommand('return_home')}
          loading={isLoading === 'return_home'}
          icon={<MapPin size={16} color="#fff" />}
          style={styles.controlButton}
          size="small"
        />
        
        <Button
          title="System Check"
          onPress={() => handleAdvancedCommand('system_check')}
          loading={isLoading === 'system_check'}
          icon={<Zap size={16} color="#fff" />}
          style={styles.controlButton}
          size="small"
        />
        
        <Button
          title="Emergency Stop"
          onPress={() => handleAdvancedCommand('emergency_stop')}
          loading={isLoading === 'emergency_stop'}
          variant="danger"
          style={styles.controlButton}
          size="small"
        />
      </View>
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
  controlsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  controlButton: {
    width: '48%',
    marginBottom: SPACING.sm,
  },
});