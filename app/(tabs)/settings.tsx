import React from 'react';
import { 
  ScrollView, 
  StyleSheet, 
  View, 
  Text, 
  Switch,
  useColorScheme,
  Platform,
  Alert
} from 'react-native';
import { 
  Moon, 
  Sun, 
  Bluetooth, 
  Wifi, 
  RefreshCw, 
  Bell, 
  Shield, 
  Info,
  Trash2,
  Download
} from 'lucide-react-native';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useSettingsStore } from '@/store/settingsStore';
import { useGarbotStore } from '@/store/garbotStore';
import { useLogStore } from '@/store/logStore';
import colors from '@/constants/colors';
import { SPACING } from '@/constants/theme';

export default function SettingsScreen() {
  const systemColorScheme = useColorScheme() || 'light';
  const { theme, useSystemTheme, autoConnect, setTheme, setUseSystemTheme, setAutoConnect } = useSettingsStore();
  
  const colorScheme = useSystemTheme ? systemColorScheme : theme;
  const themeColors = colorScheme === 'dark' ? colors.dark : colors.light;
  
  const resetGarbotState = useGarbotStore(state => state.resetState);
  const clearLogs = useLogStore(state => state.clearLogs);
  
  const handleResetApp = () => {
    Alert.alert(
      'Reset App',
      'This will clear all connection data and logs. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            resetGarbotState();
            clearLogs();
          }
        },
      ]
    );
  };
  
  const toggleTheme = () => {
    setTheme(colorScheme === 'dark' ? 'light' : 'dark');
    setUseSystemTheme(false);
  };
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: themeColors.background }]}
      contentContainerStyle={styles.content}
    >
      <Card>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Appearance</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            {colorScheme === 'dark' ? (
              <Moon size={20} color={themeColors.primary} />
            ) : (
              <Sun size={20} color={themeColors.primary} />
            )}
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingLabel, { color: themeColors.text }]}>
                Dark Mode
              </Text>
              <Text style={[styles.settingDescription, { color: themeColors.inactive }]}>
                Use dark theme for better visibility in low light
              </Text>
            </View>
          </View>
          <Switch
            value={colorScheme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: themeColors.primary }}
            thumbColor={Platform.OS === 'ios' ? '#fff' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            <RefreshCw size={20} color={themeColors.primary} />
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingLabel, { color: themeColors.text }]}>
                Use System Theme
              </Text>
              <Text style={[styles.settingDescription, { color: themeColors.inactive }]}>
                Follow system dark/light mode setting
              </Text>
            </View>
          </View>
          <Switch
            value={useSystemTheme}
            onValueChange={setUseSystemTheme}
            trackColor={{ false: '#767577', true: themeColors.primary }}
            thumbColor={Platform.OS === 'ios' ? '#fff' : '#f4f3f4'}
          />
        </View>
      </Card>
      
      <Card>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Connection</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            <Bluetooth size={20} color={themeColors.primary} />
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingLabel, { color: themeColors.text }]}>
                Auto-connect
              </Text>
              <Text style={[styles.settingDescription, { color: themeColors.inactive }]}>
                Automatically connect to last used device
              </Text>
            </View>
          </View>
          <Switch
            value={autoConnect}
            onValueChange={setAutoConnect}
            trackColor={{ false: '#767577', true: themeColors.primary }}
            thumbColor={Platform.OS === 'ios' ? '#fff' : '#f4f3f4'}
          />
        </View>
      </Card>
      
      <Card>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Notifications</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            <Bell size={20} color={themeColors.primary} />
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingLabel, { color: themeColors.text }]}>
                Task Notifications
              </Text>
              <Text style={[styles.settingDescription, { color: themeColors.inactive }]}>
                Get notified when tasks complete
              </Text>
            </View>
          </View>
          <Switch
            value={true}
            onValueChange={() => {}}
            trackColor={{ false: '#767577', true: themeColors.primary }}
            thumbColor={Platform.OS === 'ios' ? '#fff' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            <Shield size={20} color={themeColors.primary} />
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingLabel, { color: themeColors.text }]}>
                Error Alerts
              </Text>
              <Text style={[styles.settingDescription, { color: themeColors.inactive }]}>
                Get alerted about system errors
              </Text>
            </View>
          </View>
          <Switch
            value={true}
            onValueChange={() => {}}
            trackColor={{ false: '#767577', true: themeColors.primary }}
            thumbColor={Platform.OS === 'ios' ? '#fff' : '#f4f3f4'}
          />
        </View>
      </Card>
      
      <Card>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>About</Text>
        
        <View style={styles.aboutRow}>
          <Text style={[styles.aboutLabel, { color: themeColors.text }]}>App Version</Text>
          <Text style={[styles.aboutValue, { color: themeColors.text }]}>1.0.0</Text>
        </View>
        
        <View style={styles.aboutRow}>
          <Text style={[styles.aboutLabel, { color: themeColors.text }]}>Build Number</Text>
          <Text style={[styles.aboutValue, { color: themeColors.text }]}>100</Text>
        </View>
        
        <View style={styles.aboutRow}>
          <Text style={[styles.aboutLabel, { color: themeColors.text }]}>Platform</Text>
          <Text style={[styles.aboutValue, { color: themeColors.text }]}>
            {Platform.OS === 'ios' ? 'iOS' : 'Android'}
          </Text>
        </View>
      </Card>
      
      <Card>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Data & Storage</Text>
        
        <Button
          title="Export Logs"
          onPress={() => {}}
          variant="outline"
          icon={<Download size={16} color={themeColors.primary} />}
          fullWidth
          style={styles.actionButton}
        />
        
        <Button
          title="Clear Cache"
          onPress={() => {}}
          variant="outline"
          icon={<Trash2 size={16} color={themeColors.primary} />}
          fullWidth
          style={styles.actionButton}
        />
        
        <Button
          title="Reset App"
          onPress={handleResetApp}
          variant="danger"
          icon={<RefreshCw size={16} color="#fff" />}
          fullWidth
          style={styles.resetButton}
        />
        
        <Text style={[styles.resetWarning, { color: themeColors.inactive }]}>
          Reset will clear all connection data, logs, and settings
        </Text>
      </Card>
      
      <Card>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Support</Text>
        
        <Button
          title="Help & Documentation"
          onPress={() => {}}
          variant="outline"
          icon={<Info size={16} color={themeColors.primary} />}
          fullWidth
          style={styles.actionButton}
        />
        
        <View style={styles.supportInfo}>
          <Text style={[styles.supportText, { color: themeColors.inactive }]}>
            For technical support, visit our documentation or contact support@garbot.com
          </Text>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: SPACING.xxl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  aboutLabel: {
    fontSize: 16,
  },
  aboutValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  actionButton: {
    marginBottom: SPACING.sm,
  },
  resetButton: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  resetWarning: {
    fontSize: 14,
    textAlign: 'center',
  },
  supportInfo: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    borderRadius: 8,
  },
  supportText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});