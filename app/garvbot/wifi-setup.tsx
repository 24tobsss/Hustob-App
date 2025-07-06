import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useGARVBOTStore } from '../../store/garvbot-store';
import GARVBOTService from '../../services/garvbot-service';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

export default function WiFiSetup() {
  const [ssid, setSSID] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [setupStep, setSetupStep] = useState<'input' | 'connecting' | 'success'>('input');
  
  const { connectedDevice, setConnectionMode } = useGARVBOTStore();

  const handleWiFiSetup = async () => {
    if (!ssid.trim()) {
      Alert.alert('Fehler', 'Bitte gib einen WiFi-Namen ein.');
      return;
    }

    if (!connectedDevice) {
      Alert.alert('Fehler', 'Kein GARVBOT verbunden. Verbinde zuerst ein Gerät über Bluetooth.');
      return;
    }

    setIsConnecting(true);
    setSetupStep('connecting');

    try {
      const success = await GARVBOTService.setupWiFi(ssid, password);
      
      if (success) {
        setSetupStep('success');
        setConnectionMode('wifi');
        
        setTimeout(() => {
          Alert.alert(
            'WiFi Setup erfolgreich! 🎉',
            `${connectedDevice.name} ist jetzt mit "${ssid}" verbunden und kann über WiFi gesteuert werden.`,
            [
              {
                text: 'Großartig!',
                onPress: () => setSetupStep('input')
              }
            ]
          );
        }, 2000);
      } else {
        throw new Error('WiFi Setup fehlgeschlagen');
      }
    } catch (error) {
      console.error('WiFi setup failed:', error);
      setSetupStep('input');
      Alert.alert(
        'WiFi Setup fehlgeschlagen',
        'Überprüfe die WiFi-Daten und versuche es erneut.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsConnecting(false);
    }
  };

  const renderInputStep = () => (
    <Animatable.View animation="fadeInUp" style={styles.formContainer}>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>WiFi-Netzwerk Name (SSID)</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="wifi" size={20} color="#6c757d" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            value={ssid}
            onChangeText={setSSID}
            placeholder="Mein WiFi Netzwerk"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>WiFi-Passwort</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed" size={20} color="#6c757d" style={styles.inputIcon} />
          <TextInput
            style={[styles.textInput, styles.passwordInput]}
            value={password}
            onChangeText={setPassword}
            placeholder="Passwort (optional)"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity 
            onPress={() => setShowPassword(!showPassword)}
            style={styles.passwordToggle}
          >
            <Ionicons 
              name={showPassword ? "eye-off" : "eye"} 
              size={20} 
              color="#6c757d" 
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.setupButton, (!ssid.trim() || isConnecting) && styles.setupButtonDisabled]}
        onPress={handleWiFiSetup}
        disabled={!ssid.trim() || isConnecting}
      >
        <Ionicons name="wifi" size={24} color="#fff" />
        <Text style={styles.setupButtonText}>WiFi konfigurieren</Text>
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={24} color="#007AFF" />
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>So funktioniert's:</Text>
          <Text style={styles.infoText}>
            1. Gib deine WiFi-Daten ein{'\n'}
            2. GARVBOT verbindet sich mit deinem Netzwerk{'\n'}
            3. Du kannst den Roboter dann über WiFi steuern
          </Text>
        </View>
      </View>
    </Animatable.View>
  );

  const renderConnectingStep = () => (
    <Animatable.View animation="pulse" iterationCount="infinite" style={styles.connectingContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.connectingTitle}>WiFi wird konfiguriert...</Text>
      <Text style={styles.connectingText}>
        GARVBOT verbindet sich mit "{ssid}"
      </Text>
      <View style={styles.connectingSteps}>
        <Text style={styles.stepText}>📡 Sende WiFi-Daten an Roboter</Text>
        <Text style={styles.stepText}>🔄 Roboter startet neu</Text>
        <Text style={styles.stepText}>✅ Verbindung wird hergestellt</Text>
      </View>
    </Animatable.View>
  );

  const renderSuccessStep = () => (
    <Animatable.View animation="bounceIn" style={styles.successContainer}>
      <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
      <Text style={styles.successTitle}>WiFi Setup erfolgreich! 🎉</Text>
      <Text style={styles.successText}>
        {connectedDevice?.name} ist jetzt mit "{ssid}" verbunden
      </Text>
      <View style={styles.successFeatures}>
        <Text style={styles.featureText}>✅ Remote-Steuerung aktiviert</Text>
        <Text style={styles.featureText}>✅ Cloud-Verbindung möglich</Text>
        <Text style={styles.featureText}>✅ Automatische Updates</Text>
      </View>
    </Animatable.View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>WiFi Setup</Text>
        <Text style={styles.subtitle}>
          {connectedDevice ? 
            `Konfiguriere ${connectedDevice.name}` : 
            'Kein Gerät verbunden'
          }
        </Text>
      </View>

      {!connectedDevice ? (
        <View style={styles.noDeviceContainer}>
          <Ionicons name="bluetooth-outline" size={64} color="#ccc" />
          <Text style={styles.noDeviceTitle}>Kein GARVBOT verbunden</Text>
          <Text style={styles.noDeviceText}>
            Verbinde zuerst einen Roboter über Bluetooth, um WiFi zu konfigurieren.
          </Text>
        </View>
      ) : (
        <View style={styles.content}>
          {setupStep === 'input' && renderInputStep()}
          {setupStep === 'connecting' && renderConnectingStep()}
          {setupStep === 'success' && renderSuccessStep()}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#FF9800',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#343a40',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
  },
  inputIcon: {
    marginLeft: 15,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    paddingVertical: 15,
    paddingRight: 15,
    fontSize: 16,
    color: '#343a40',
  },
  passwordInput: {
    paddingRight: 50,
  },
  passwordToggle: {
    position: 'absolute',
    right: 15,
    padding: 5,
  },
  setupButton: {
    backgroundColor: '#FF9800',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
    marginTop: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  setupButtonDisabled: {
    backgroundColor: '#ccc',
  },
  setupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    padding: 20,
    borderRadius: 12,
    marginTop: 25,
  },
  infoContent: {
    flex: 1,
    marginLeft: 15,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1976d2',
    lineHeight: 20,
  },
  connectingContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 40,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  connectingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#343a40',
    marginTop: 20,
    textAlign: 'center',
  },
  connectingText: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 10,
    textAlign: 'center',
  },
  connectingSteps: {
    marginTop: 30,
    alignItems: 'flex-start',
  },
  stepText: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  successContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 40,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 20,
    textAlign: 'center',
  },
  successText: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 10,
    textAlign: 'center',
  },
  successFeatures: {
    marginTop: 30,
    alignItems: 'flex-start',
  },
  featureText: {
    fontSize: 16,
    color: '#4CAF50',
    marginBottom: 8,
    fontWeight: '600',
  },
  noDeviceContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noDeviceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6c757d',
    marginTop: 20,
    textAlign: 'center',
  },
  noDeviceText: {
    fontSize: 16,
    color: '#adb5bd',
    marginTop: 15,
    textAlign: 'center',
    lineHeight: 24,
  },
});
