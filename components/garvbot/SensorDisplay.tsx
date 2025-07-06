import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';
import * as Animatable from 'react-native-animatable';
import type { SensorData } from '../../types/garvbot';

interface SensorDisplayProps {
  data: SensorData | null;
}

export const SensorDisplay: React.FC<SensorDisplayProps> = ({ data }) => {
  if (!data) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>📊 Sensor-Daten</Text>
        <View style={styles.noDataContainer}>
          <Ionicons name="analytics-outline" size={48} color="#ccc" />
          <Text style={styles.noDataText}>Keine Sensor-Daten verfügbar</Text>
        </View>
      </View>
    );
  }

  const getDistanceColor = (distance: number) => {
    if (distance < 10) return '#FF5722';
    if (distance < 25) return '#FF9800';
    if (distance < 50) return '#FFC107';
    return '#4CAF50';
  };

  const getDistanceStatus = (distance: number) => {
    if (distance < 10) return '🔴 SEHR NAH';
    if (distance < 25) return '🟡 NAH';
    if (distance < 50) return '🟢 MITTEL';
    return '🔵 WEIT';
  };

  const getTiltStatus = (tilt: number) => {
    const absTilt = Math.abs(tilt);
    if (absTilt < 0.5) return '✅ Stabil';
    if (absTilt < 1.0) return '⚠️ Geneigt';
    return '🔴 Stark geneigt';
  };

  const distanceProgress = Math.min(data.distance / 100, 1);
  const tiltProgress = Math.min(Math.abs(data.tiltX) / 2, 1);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Live Sensor-Daten</Text>
      
      {/* Ultraschall-Sensor */}
      <Animatable.View animation="fadeInLeft" style={styles.sensorCard}>
        <View style={styles.sensorHeader}>
          <Ionicons name="radio-outline" size={24} color="#007AFF" />
          <Text style={styles.sensorTitle}>Ultraschall-Sensor</Text>
        </View>
        
        <View style={styles.sensorContent}>
          <Text style={[styles.sensorValue, { color: getDistanceColor(data.distance) }]}>
            {data.distance.toFixed(1)} cm
          </Text>
          
          <Progress.Bar
            progress={distanceProgress}
            width={null}
            height={8}
            color={getDistanceColor(data.distance)}
            unfilledColor="#e1e5e9"
            borderWidth={0}
            style={styles.progressBar}
          />
          
          <Text style={styles.sensorStatus}>
            {getDistanceStatus(data.distance)}
          </Text>
        </View>
      </Animatable.View>

      {/* Neigungssensor */}
      <Animatable.View animation="fadeInRight" delay={200} style={styles.sensorCard}>
        <View style={styles.sensorHeader}>
          <Ionicons name="compass-outline" size={24} color="#4CAF50" />
          <Text style={styles.sensorTitle}>Neigungssensor (X-Achse)</Text>
        </View>
        
        <View style={styles.sensorContent}>
          <Text style={[styles.sensorValue, { color: Math.abs(data.tiltX) > 1 ? '#FF5722' : '#4CAF50' }]}>
            {data.tiltX.toFixed(2)} V
          </Text>
          
          <Progress.Bar
            progress={tiltProgress}
            width={null}
            height={8}
            color={Math.abs(data.tiltX) > 1 ? '#FF5722' : '#4CAF50'}
            unfilledColor="#e1e5e9"
            borderWidth={0}
            style={styles.progressBar}
          />
          
          <Text style={styles.sensorStatus}>
            {getTiltStatus(data.tiltX)}
          </Text>
        </View>
      </Animatable.View>

      {/* Hindernis-Status */}
      <Animatable.View 
        animation={data.obstacle ? "pulse" : "fadeIn"} 
        iterationCount={data.obstacle ? "infinite" : 1}
        style={[styles.obstacleCard, data.obstacle && styles.obstacleCardActive]}
      >
        <View style={styles.obstacleHeader}>
          <Ionicons 
            name={data.obstacle ? "warning" : "checkmark-circle"} 
            size={32} 
            color={data.obstacle ? "#FF5722" : "#4CAF50"} 
          />
          <View style={styles.obstacleInfo}>
            <Text style={[styles.obstacleTitle, data.obstacle && styles.obstacleTitleActive]}>
              {data.obstacle ? '⚠️ HINDERNIS ERKANNT' : '✅ FREIE FAHRT'}
            </Text>
            <Text style={styles.obstacleSubtitle}>
              {data.obstacle ? 
                'Roboter gestoppt - Hindernis im Weg' : 
                'Kein Hindernis erkannt - Fahrt möglich'
              }
            </Text>
          </View>
        </View>
      </Animatable.View>

      {/* Timestamp */}
      <View style={styles.timestampContainer}>
        <Text style={styles.timestampText}>
          Letzte Aktualisierung: {new Date(data.timestamp).toLocaleTimeString()}
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
  noDataContainer: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  noDataText: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 15,
    textAlign: 'center',
  },
  sensorCard: {
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
  sensorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sensorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#343a40',
    marginLeft: 10,
  },
  sensorContent: {
    alignItems: 'center',
  },
  sensorValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  progressBar: {
    width: '100%',
    marginBottom: 10,
  },
  sensorStatus: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '600',
  },
  obstacleCard: {
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
  obstacleCardActive: {
    backgroundColor: '#ffebee',
    borderWidth: 2,
    borderColor: '#FF5722',
  },
  obstacleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  obstacleInfo: {
    flex: 1,
    marginLeft: 15,
  },
  obstacleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  obstacleTitleActive: {
    color: '#FF5722',
  },
  obstacleSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 5,
  },
  timestampContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  timestampText: {
    fontSize: 12,
    color: '#adb5bd',
    fontStyle: 'italic',
  },
});
