import React, { useRef, useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  PanResponder, 
  Dimensions, 
  Text,
  TouchableOpacity,
  useColorScheme
} from 'react-native';
import { Trash2 } from 'lucide-react-native';
import Card from './Card';
import Button from './Button';
import colors from '@/constants/colors';
import { SPACING } from '@/constants/theme';
import { useGarbotStore } from '@/store/garbotStore';
import httpService from '@/services/httpService';
import { useLogStore } from '@/store/logStore';

const { width } = Dimensions.get('window');
const CANVAS_SIZE = width - 48; // Accounting for padding

export default function DrawingCanvas() {
  const colorScheme = useColorScheme() || 'light';
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;
  
  const { scanArea, setScanArea, clearScanArea } = useGarbotStore();
  const addLog = useLogStore(state => state.addLog);
  
  const [isSending, setIsSending] = useState(false);
  const [canvasPoints, setCanvasPoints] = useState<{ x: number; y: number }[]>([]);
  
  // Convert normalized points to canvas coordinates
  useEffect(() => {
    const points = scanArea.points.map(point => ({
      x: point.x * CANVAS_SIZE,
      y: point.y * CANVAS_SIZE,
    }));
    setCanvasPoints(points);
  }, [scanArea.points]);
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        
        // Normalize coordinates (0-1 range)
        const normalizedX = locationX / CANVAS_SIZE;
        const normalizedY = locationY / CANVAS_SIZE;
        
        // Add point to store
        setScanArea({
          points: [...scanArea.points, { x: normalizedX, y: normalizedY }],
        });
        
        addLog({
          timestamp: Date.now(),
          message: `Added point (${normalizedX.toFixed(2)}, ${normalizedY.toFixed(2)})`,
          level: 'debug',
        });
      },
      onPanResponderMove: () => {
        // We're not tracking continuous movement, just taps
      },
      onPanResponderRelease: () => {
        // Nothing to do on release
      },
    })
  ).current;
  
  const handleClear = () => {
    clearScanArea();
    addLog({
      timestamp: Date.now(),
      message: 'Cleared scan area',
      level: 'info',
    });
  };
  
  const handleSend = async () => {
    if (scanArea.points.length < 3) {
      addLog({
        timestamp: Date.now(),
        message: 'Need at least 3 points to define a scan area',
        level: 'warning',
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      await httpService.sendScanArea(scanArea.points);
      addLog({
        timestamp: Date.now(),
        message: `Scan area with ${scanArea.points.length} points sent successfully`,
        level: 'info',
      });
    } catch (error) {
      addLog({
        timestamp: Date.now(),
        message: `Failed to send scan area: ${error}`,
        level: 'error',
      });
    } finally {
      setIsSending(false);
    }
  };
  
  // Draw lines between points
  const renderLines = () => {
    if (canvasPoints.length < 2) return null;
    
    return canvasPoints.map((point, index) => {
      if (index === 0) return null;
      
      const prevPoint = canvasPoints[index - 1];
      
      return (
        <View
          key={`line-${index}`}
          style={[
            styles.line,
            {
              left: prevPoint.x,
              top: prevPoint.y,
              width: Math.sqrt(
                Math.pow(point.x - prevPoint.x, 2) + 
                Math.pow(point.y - prevPoint.y, 2)
              ),
              transform: [
                {
                  rotate: `${Math.atan2(
                    point.y - prevPoint.y,
                    point.x - prevPoint.x
                  )}rad`,
                },
              ],
              backgroundColor: theme.primary,
            },
          ]}
        />
      );
    });
  };
  
  // Draw a line from the last point to the first point to close the polygon
  const renderClosingLine = () => {
    if (canvasPoints.length < 3) return null;
    
    const firstPoint = canvasPoints[0];
    const lastPoint = canvasPoints[canvasPoints.length - 1];
    
    return (
      <View
        style={[
          styles.line,
          {
            left: lastPoint.x,
            top: lastPoint.y,
            width: Math.sqrt(
              Math.pow(firstPoint.x - lastPoint.x, 2) + 
              Math.pow(firstPoint.y - lastPoint.y, 2)
            ),
            transform: [
              {
                rotate: `${Math.atan2(
                  firstPoint.y - lastPoint.y,
                  firstPoint.x - lastPoint.x
                )}rad`,
              },
            ],
            backgroundColor: theme.primary,
            opacity: 0.5, // Make the closing line semi-transparent
          },
        ]}
      />
    );
  };
  
  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Scan Area</Text>
        <TouchableOpacity onPress={handleClear} disabled={canvasPoints.length === 0}>
          <Trash2 
            size={20} 
            color={canvasPoints.length === 0 ? theme.inactive : theme.error} 
          />
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.instructions, { color: theme.text }]}>
        Tap to add points and define the scan area
      </Text>
      
      <View
        style={[
          styles.canvas,
          { 
            backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#f0f0f0',
            borderColor: theme.border,
          },
        ]}
        {...panResponder.panHandlers}
      >
        {/* Draw points */}
        {canvasPoints.map((point, index) => (
          <View
            key={`point-${index}`}
            style={[
              styles.point,
              {
                left: point.x - 5,
                top: point.y - 5,
                backgroundColor: index === 0 ? theme.success : theme.primary,
              },
            ]}
          />
        ))}
        
        {/* Draw lines */}
        {renderLines()}
        {renderClosingLine()}
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Send Scan Area"
          onPress={handleSend}
          disabled={canvasPoints.length < 3}
          loading={isSending}
          fullWidth
        />
      </View>
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
  instructions: {
    fontSize: 14,
    marginBottom: SPACING.md,
  },
  canvas: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    borderWidth: 1,
    borderRadius: 8,
    position: 'relative',
  },
  point: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
  },
  line: {
    height: 2,
    position: 'absolute',
    transformOrigin: 'left',
  },
  buttonContainer: {
    marginTop: SPACING.md,
  },
});