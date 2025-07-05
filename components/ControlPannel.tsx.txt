import React, { useState } from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Wand2, Leaf, StopCircle, Scan } from 'lucide-react-native';
import Card from './Card';
import Button from './Button';
import colors from '@/constants/colors';
import { SPACING } from '@/constants/theme';
import httpService from '@/services/httpService';
import { useLogStore } from '@/store/logStore';

export default function ControlPanel() {
  const colorScheme = useColorScheme() || 'light';
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;
  
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const addLog = useLogStore(state => state.addLog);
  
  const handleCommand = async (task: 'start_weed' | 'start_moss' | 'stop' | 'scan') => {
    setIsLoading(task);
    
    try {
      await httpService.sendCommand({ task });
      
      addLog({
        timestamp: Date.now(),
        message: `Command ${task} executed successfully`,
        level: 'info',
      });
    } catch (error) {
      addLog({
        timestamp: Date.now(),
        message: `Failed to execute command ${task}: ${error}`,
        level: 'error',
      });
    } finally {
      setIsLoading(null);
    }
  };
  
  return (
    <Card>
      <Text style={[styles.title, { color: theme.text }]}>Control Panel</Text>
      
      <View style={styles.buttonGrid}>
        <View style={styles.buttonRow}>
          <Button
            title="Remove Weeds"
            onPress={() => handleCommand('start_weed')}
            loading={isLoading === 'start_weed'}
            icon={<Leaf size={18} color="#fff" />}
            style={styles.gridButton}
          />
          
          <Button
            title="Remove Moss"
            onPress={() => handleCommand('start_moss')}
            loading={isLoading === 'start_moss'}
            icon={<Wand2 size={18} color="#fff" />}
            style={styles.gridButton}
          />
        </View>
        
        <View style={styles.buttonRow}>
          <Button
            title="Start Scan"
            onPress={() => handleCommand('scan')}
            loading={isLoading === 'scan'}
            icon={<Scan size={18} color="#fff" />}
            style={styles.gridButton}
          />
          
          <Button
            title="Stop"
            onPress={() => handleCommand('stop')}
            loading={isLoading === 'stop'}
            variant="danger"
            icon={<StopCircle size={18} color="#fff" />}
            style={styles.gridButton}
          />
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
  buttonGrid: {
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  gridButton: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
});