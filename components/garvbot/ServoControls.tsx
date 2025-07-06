import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Slider from 'react-native-slider';
import { useGARVBOTStore } from '../../store/garvbot-store';
import GARVBOTService from '../../services/garvbot-service';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

interface ServoControlsProps {
  disabled?: boolean;
}

export const ServoControls: React.FC<ServoControlsProps> = ({ disabled = false }) => {
  const { servoPositions, updateServoPosition, connectedDevice, connectionMode } = useGARVBOTStore();

  const handleServoChange = async (servo: keyof typeof servoPositions, value: number) => {
    if (disabled) return;

    const angle = Math.round(value);
    updateServoPosition(servo, angle);

    try {
      if (connectionMode === 'bluetooth') {
        const servoMap = { base: 0, shoulder: 1, elbow: 2, wrist: 3, gripper: 4 };
        await GARVBOTService.moveServo(servoMap[servo], angle);
      } else if (connectionMode === 'wifi' && connectedDevice) {
        // WiFi-Modus: HTTP-Request an Roboter
        await GARVBOTService.sendHTTPCommand(connectedDevice.id, {
          command: 'move_servo',
          servo: servo,
          angle: angle
        });
      }
    } catch (error) {
      console.error('Servo control error:', error);
      Alert.alert('Fehler', 'Servo konnte nicht bewegt werden.');
    }
  };

  const servoConfigs = [
    {
      key: 'base' as const,
      name: 'Basis',
      icon: 'refresh',
      color: '#007AFF',
      description: 'Rotation links/rechts'
    },
    {
      key: 'shoulder' as const,
      name: 'Schulter',
      icon: 'arrow-up',
      color: '#4CAF50',
      description: 'Arm heben/senken'
    },
    {
      key: 'elbow' as const,
      name: 'Ellbogen',
      icon: 'chevron-forward',
      color: '#FF9800',
      description: 'Arm ein-/ausfahren'
    },
    {
      key: 'wrist' as const,
      name: 'Handgelenk',
      icon: 'hand-left',
      color: '#9C27B0',
      description: 'Handgelenk drehen'
    },
    {
      key: 'gripper' as const,
      name: 'Greifer',
      icon: 'hand-right',
      color: '#F44336',
      description: 'Öffnen/Schließen'
    }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🦾 Servo-Steuerung</Text>
      
      {disabled && (
        <View style={styles.disabledWarning}>
          <Ionicons name="lock-closed" size={20} color="#FF5722" />
          <Text style={styles.disabledText}>
            Steuerung gesperrt - Notfall-Stopp aktiv
          </Text>
        </View>
      )}

      {servoConfigs.map((config, index) => (
        <Animatable.View 
          key={config.key}
          animation="fadeInUp"
          delay={index * 100}
          style={[styles.servoCard, disabled && styles.servoCardDisabled]}
        >
          <View style={styles.servoHeader}>
            <View style={styles.servoInfo}>
              <Ionicons name={config.icon as any} size={24} color={config.color} />
              <View style={styles.servoLabels}>
                <Text style={styles.servoName}>{config.name}</Text>
                <Text style={styles.servoDescription}>{config.description}</Text>
              </View>
            </View>
            <View style={styles.servoValue}>
              <Text style={[styles.servoAngle, { color: config.color }]}>
                {servoPositions[config.key]}°
              </Text>
            </View>
          </View>

          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>0°</Text>
            <Slider
              style={styles.slider}
              value={servoPositions[config.key]}
              onValueChange={(value) => handleServoChange(config.key, value)}
              minimumValue={0}
              maximumValue={180}
              step={5}
              minimumTrackTintColor={config.color}
              maximumTrackTintColor="#e1e5e9"
              thumbStyle={[styles.sliderThumb, { backgroundColor: config.color }]}
              trackStyle={styles.sliderTrack}
              disabled={disabled}
            />
            <Text style={styles.sliderLabel}>180°</Text>
          </View>
        </Animatable.View>
      ))}

      <View style={styles.servoInfo}>
        <Ionicons name="information-circle" size={20} color="#007AFF" />
        <Text style={styles.infoText}>
          Bewege die Regler um die Servo-Motoren zu steuern. 
          Änderungen werden sofort an den Roboter gesendet.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 15,
  },
  disabledWarning: {
    backgroundColor: '#ffebee',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FF5722',
  },
  disabledText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#FF5722',
    fontWeight: '600',
  },
  servoCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  servoCardDisabled: {
    opacity: 0.5,
  },
  servoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  servoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  servoLabels: {
    marginLeft: 12,
    flex: 1,
  },
  servoName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#343a40',
  },
  servoDescription: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 2,
  },
  servoValue: {
    alignItems: 'center',
  },
  servoAngle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderLabel: {
    fontSize: 12,
    color: '#6c757d',
    width: 30,
    textAlign: 'center',
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  sliderTrack: {
    height: 4,
    borderRadius: 2,
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 12,
    color: '#6c757d',
    lineHeight: 16,
  },
});
