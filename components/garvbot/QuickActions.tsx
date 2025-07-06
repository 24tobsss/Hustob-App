import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useGARVBOTStore } from '../../store/garvbot-store';
import GARVBOTService from '../../services/garvbot-service';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

interface QuickActionsProps {
  disabled?: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ disabled = false }) => {
  const { updateServoPosition, connectedDevice, connectionMode } = useGARVBOTStore();

  const executeAction = async (actionName: string, servoCommands: Array<{servo: string, angle: number, delay?: number}>) => {
    if (disabled) {
      Alert.alert('Aktion gesperrt', 'Notfall-Stopp ist aktiv.');
      return;
    }

    try {
      for (const command of servoCommands) {
        // Update local state
        updateServoPosition(command.servo as any, command.angle);

        // Send to robot
        if (connectionMode === 'bluetooth') {
          const servoMap = { base: 0, shoulder: 1, elbow: 2, wrist: 3, gripper: 4 };
          await GARVBOTService.moveServo(servoMap[command.servo as keyof typeof servoMap], command.angle);
        } else if (connectionMode === 'wifi' && connectedDevice) {
          await GARVBOTService.sendHTTPCommand(connectedDevice.id, {
            command: 'move_servo',
            servo: command.servo,
            angle: command.angle
          });
        }

        // Wait if delay specified
        if (command.delay) {
          await new Promise(resolve => setTimeout(resolve, command.delay));
        }
      }

      Alert.alert('Aktion abgeschlossen', `${actionName} wurde erfolgreich ausgeführt.`);
    } catch (error) {
      console.error('Action execution error:', error);
      Alert.alert('Fehler', `${actionName} konnte nicht ausgeführt werden.`);
    }
  };

  const actions = [
    {
      id: 'home',
      name: 'Home Position',
      icon: 'home',
      color: '#4CAF50',
      description: 'Alle Servos in Startposition',
      commands: [
        { servo: 'base', angle: 90, delay: 500 },
        { servo: 'shoulder', angle: 90, delay: 500 },
        { servo: 'elbow', angle: 90, delay: 500 },
        { servo: 'wrist', angle: 90, delay: 500 },
        { servo: 'gripper', angle: 0, delay: 500 }
      ]
    },
    {
      id: 'grab',
      name: 'Greifen',
      icon: 'hand-right',
      color: '#FF9800',
      description: 'Unkraut greifen',
      commands: [
        { servo: 'shoulder', angle: 45, delay: 1000 },
        { servo: 'elbow', angle:
