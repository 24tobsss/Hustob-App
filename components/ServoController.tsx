import React, { useState } from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import Slider from '@react-native-community/slider';
import { Settings } from 'lucide-react-native';
import Card from './Card';
import Button from './Button';
import colors from '@/constants/colors';
import { SPACING } from '@/constants/theme';
import httpService from '@/services/httpService';
import { useLogStore } from '@/store/logStore';

export default function ServoController() {
  const colorScheme = useColorScheme() || 'light';
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;
  
  const [channel, setChannel] = useState(0);
  const [angle, setAngle] = useState(90);
  const [isTesting, setIsTesting] = useState(false);
  
  const addLog = useLogStore(state => state.addLog);
  
  const handleTest = async () => {
    setIsTesting(true);
    
    try {
      await httpService.testServo({ channel, angle });
      addLog({
        timestamp: Date.now(),
        message: `Servo test successful: Channel ${channel}, Angle ${angle}°`,
        level: 'info',
      });
    } catch (error) {
      addLog({
        timestamp: Date.now(),
        message: `Servo test failed: ${error}`,
        level: 'error',
      });
    } finally {
      setIsTesting(false);
    }
  };
  
  return (
    <Card>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Servo Test</Text>
        <Settings size={20} color={theme.primary} />
      </View>
      
      <View style={styles.controlGroup}>
        <Text style={[styles.label, { color: theme.text }]}>Channel</Text>
        <View style={styles.channelContainer}>
          {[0, 1, 2, 3, 4].map((ch) => (
            <Button
              key={`ch-${ch}`}
              title={ch.toString()}
              variant={channel === ch ? 'primary' : 'outline'}
              size="small"
              onPress={() => setChannel(ch)}
              style={styles.channelButton}
            />
          ))}
        </View>
        <View style={styles.channelContainer}>
          {[5, 6, 7, 8, 9].map((ch) => (
            <Button
              key={`ch-${ch}`}
              title={ch.toString()}
              variant={channel === ch ? 'primary' : 'outline'}
              size="small"
              onPress={() => setChannel(ch)}
              style={styles.channelButton}
            />
          ))}
        </View>
        <View style={styles.channelContainer}>
          {[10, 11, 12, 13, 14, 15].map((ch) => (
            <Button
              key={`ch-${ch}`}
              title={ch.toString()}
              variant={channel === ch ? 'primary' : 'outline'}
              size="small"
              onPress={() => setChannel(ch)}
              style={styles.channelButton}
            />
          ))}
        </View>
      </View>
      
      <View style={styles.controlGroup}>
        <Text style={[styles.label, { color: theme.text }]}>Angle: {angle}°</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={180}
          step={1}
          value={angle}
          onValueChange={setAngle}
          minimumTrackTintColor={theme.primary}
          maximumTrackTintColor={theme.inactive}
          thumbTintColor={theme.primary}
        />
        <View style={styles.sliderLabels}>
          <Text style={{ color: theme.text }}>0°</Text>
          <Text style={{ color: theme.text }}>90°</Text>
          <Text style={{ color: theme.text }}>180°</Text>
        </View>
      </View>
      
      <Button
        title="Test Servo"
        onPress={handleTest}
        loading={isTesting}
        fullWidth
      />
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
  controlGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 16,
    marginBottom: SPACING.sm,
  },
  channelContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.xs,
  },
  channelButton: {
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
    minWidth: 40,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -SPACING.sm,
  },
});