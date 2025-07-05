import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput,
  useColorScheme
} from 'react-native';
import { Wifi, Lock } from 'lucide-react-native';
import Card from './Card';
import Button from './Button';
import colors from '@/constants/colors';
import { SPACING } from '@/constants/theme';
import bluetoothService from '@/services/bluetoothService';
import { useGarbotStore } from '@/store/garbotStore';
import { useLogStore } from '@/store/logStore';

interface WifiSetupFormProps {
  onSetupComplete: () => void;
}

export default function WifiSetupForm({ onSetupComplete }: WifiSetupFormProps) {
  const colorScheme = useColorScheme() || 'light';
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;
  
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const currentDevice = useGarbotStore(state => state.currentDevice);
  const setConnectionType = useGarbotStore(state => state.setConnectionType);
  const addLog = useLogStore(state => state.addLog);
  
  const handleSubmit = async () => {
    if (!currentDevice) {
      addLog({
        timestamp: Date.now(),
        message: 'No device connected',
        level: 'error',
      });
      return;
    }
    
    if (!ssid) {
      addLog({
        timestamp: Date.now(),
        message: 'WiFi SSID is required',
        level: 'warning',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await bluetoothService.sendWifiCredentials(
        currentDevice.id,
        ssid,
        password
      );
      
      addLog({
        timestamp: Date.now(),
        message: `WiFi credentials sent to ${currentDevice.name}`,
        level: 'info',
      });
      
      setConnectionType('wifi');
      onSetupComplete();
    } catch (error) {
      addLog({
        timestamp: Date.now(),
        message: `Failed to send WiFi credentials: ${error}`,
        level: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <Text style={[styles.title, { color: theme.text }]}>WiFi Setup</Text>
      <Text style={[styles.subtitle, { color: theme.text }]}>
        Enter your WiFi network details to connect Garbot to your network
      </Text>
      
      <View style={styles.inputContainer}>
        <Wifi size={20} color={theme.primary} style={styles.inputIcon} />
        <TextInput
          style={[
            styles.input,
            { 
              color: theme.text,
              borderColor: theme.border,
              backgroundColor: colorScheme === 'dark' ? '#2c2c2e' : '#f8f9fa',
            },
          ]}
          placeholder="WiFi Network Name (SSID)"
          placeholderTextColor={theme.inactive}
          value={ssid}
          onChangeText={setSsid}
          autoCapitalize="none"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Lock size={20} color={theme.primary} style={styles.inputIcon} />
        <TextInput
          style={[
            styles.input,
            { 
              color: theme.text,
              borderColor: theme.border,
              backgroundColor: colorScheme === 'dark' ? '#2c2c2e' : '#f8f9fa',
            },
          ]}
          placeholder="WiFi Password"
          placeholderTextColor={theme.inactive}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
      </View>
      
      <Button
        title="Connect to WiFi"
        onPress={handleSubmit}
        loading={isSubmitting}
        disabled={!ssid}
        fullWidth
        style={styles.button}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: SPACING.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  inputIcon: {
    marginRight: SPACING.md,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
  },
  button: {
    marginTop: SPACING.md,
  },
});