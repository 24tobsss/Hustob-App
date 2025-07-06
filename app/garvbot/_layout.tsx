import { Stack } from 'expo-router';

export default function GARVBOTLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="device-scanner" 
        options={{ 
          title: 'Geräte suchen',
          headerStyle: { backgroundColor: '#007AFF' },
          headerTintColor: '#fff',
        }} 
      />
      <Stack.Screen 
        name="robot-controller" 
        options={{ 
          title: 'Roboter Steuerung',
          headerStyle: { backgroundColor: '#4CAF50' },
          headerTintColor: '#fff',
        }} 
      />
      <Stack.Screen 
        name="wifi-setup" 
        options={{ 
          title: 'WiFi Setup',
          headerStyle: { backgroundColor: '#FF9800' },
          headerTintColor: '#fff',
        }} 
      />
    </Stack>
  );
}
