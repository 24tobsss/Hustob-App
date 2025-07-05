import React, { useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  useColorScheme
} from 'react-native';
import { Trash2 } from 'lucide-react-native';
import Card from './Card';
import { useLogStore } from '@/store/logStore';
import colors from '@/constants/colors';
import { SPACING } from '@/constants/theme';

export default function LogViewer() {
  const colorScheme = useColorScheme() || 'light';
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;
  
  const { logs, clearLogs } = useLogStore();
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Auto-scroll to bottom when logs change
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [logs]);
  
  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return theme.error;
      case 'warning':
        return theme.warning;
      case 'info':
        return theme.info;
      case 'debug':
        return theme.inactive;
      default:
        return theme.text;
    }
  };
  
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };
  
  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Logs</Text>
        <TouchableOpacity onPress={clearLogs}>
          <Trash2 size={20} color={theme.error} />
        </TouchableOpacity>
      </View>
      
      <ScrollView
        ref={scrollViewRef}
        style={styles.logContainer}
        contentContainerStyle={styles.logContent}
      >
        {logs.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.inactive }]}>
            No logs available
          </Text>
        ) : (
          logs.map((log) => (
            <View key={log.id} style={styles.logEntry}>
              <Text style={[styles.logTime, { color: theme.inactive }]}>
                {formatTimestamp(log.timestamp)}
              </Text>
              <Text
                style={[
                  styles.logLevel,
                  { color: getLogLevelColor(log.level) },
                ]}
              >
                {log.level.toUpperCase()}
              </Text>
              <Text style={[styles.logMessage, { color: theme.text }]}>
                {log.message}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  logContainer: {
    maxHeight: 200,
  },
  logContent: {
    paddingRight: SPACING.sm,
  },
  emptyText: {
    textAlign: 'center',
    padding: SPACING.md,
  },
  logEntry: {
    flexDirection: 'row',
    marginBottom: SPACING.xs,
    flexWrap: 'wrap',
  },
  logTime: {
    fontSize: 12,
    marginRight: SPACING.xs,
  },
  logLevel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: SPACING.xs,
  },
  logMessage: {
    fontSize: 12,
    flex: 1,
  },
});