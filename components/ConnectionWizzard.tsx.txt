import React, { useState } from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react-native';
import Card from './Card';
import Button from './Button';
import { useGarbotStore } from '@/store/garbotStore';
import colors from '@/constants/colors';
import { SPACING, BORDER_RADIUS } from '@/constants/theme';

export default function ConnectionWizard() {
  const colorScheme = useColorScheme() || 'light';
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;
  
  const { connectionStatus, connectionType } = useGarbotStore();
  
  const steps = [
    {
      id: 'bluetooth',
      title: 'Bluetooth Pairing',
      description: 'Connect to your Garbot via Bluetooth',
      completed: connectionStatus === 'connected' && connectionType === 'bluetooth',
    },
    {
      id: 'wifi',
      title: 'WiFi Setup',
      description: 'Configure WiFi network settings',
      completed: connectionStatus === 'connected' && connectionType === 'wifi',
    },
    {
      id: 'ready',
      title: 'Ready to Use',
      description: 'Your Garbot is ready for operation',
      completed: connectionStatus === 'connected' && connectionType === 'wifi',
    },
  ];
  
  const getCurrentStep = () => {
    if (connectionStatus !== 'connected') return 0;
    if (connectionType === 'bluetooth') return 1;
    if (connectionType === 'wifi') return 2;
    return 0;
  };
  
  const currentStep = getCurrentStep();
  
  return (
    <Card>
      <Text style={[styles.title, { color: theme.text }]}>Setup Progress</Text>
      
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <View key={step.id} style={styles.stepContainer}>
            <View style={styles.stepIndicator}>
              <View style={[
                styles.stepCircle,
                {
                  backgroundColor: step.completed ? theme.success : 
                    index === currentStep ? theme.primary : theme.inactive,
                }
              ]}>
                {step.completed ? (
                  <CheckCircle size={16} color="#fff" />
                ) : (
                  <Text style={[styles.stepNumber, { color: '#fff' }]}>
                    {index + 1}
                  </Text>
                )}
              </View>
              
              {index < steps.length - 1 && (
                <View style={[
                  styles.stepLine,
                  { backgroundColor: steps[index + 1].completed ? theme.success : theme.inactive }
                ]} />
              )}
            </View>
            
            <View style={styles.stepContent}>
              <Text style={[
                styles.stepTitle,
                { 
                  color: step.completed ? theme.success : 
                    index === currentStep ? theme.text : theme.inactive 
                }
              ]}>
                {step.title}
              </Text>
              <Text style={[styles.stepDescription, { color: theme.inactive }]}>
                {step.description}
              </Text>
            </View>
          </View>
        ))}
      </View>
      
      {currentStep < steps.length - 1 && (
        <View style={styles.actionContainer}>
          <Text style={[styles.actionText, { color: theme.text }]}>
            {currentStep === 0 ? 'Scan for devices to get started' : 
             currentStep === 1 ? 'Configure WiFi to complete setup' : 
             'Setup complete!'}
          </Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.lg,
  },
  stepsContainer: {
    marginBottom: SPACING.md,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  stepIndicator: {
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepLine: {
    width: 2,
    height: 24,
    marginTop: SPACING.xs,
  },
  stepContent: {
    flex: 1,
    paddingTop: SPACING.xs,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  stepDescription: {
    fontSize: 14,
  },
  actionContainer: {
    padding: SPACING.md,
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    borderRadius: BORDER_RADIUS.md,
  },
  actionText: {
    fontSize: 14,
    textAlign: 'center',
  },
});