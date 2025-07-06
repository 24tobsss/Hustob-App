import React from 'react';
import { View, Text, StyleSheet, Image, useColorScheme, Platform } from 'react-native';
import { Camera } from 'lucide-react-native';
import Card from './Card';
import colors from '@/constants/colors';
import { SPACING } from '@/constants/theme';

export default function CameraPreview() {
  const colorScheme = useColorScheme() || 'light';
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;
  
  return (
    <Card noPadding>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Camera Preview</Text>
        <Camera size={20} color={theme.primary} />
      </View>
      
      <View style={styles.previewContainer}>
        {Platform.OS === 'web' ? (
          <View style={[styles.placeholderContainer, { backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#f0f0f0' }]}>
            <Camera size={48} color={theme.inactive} />
            <Text style={[styles.placeholderText, { color: theme.text }]}>
              Camera preview not available on web
            </Text>
          </View>
        ) : (
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }}
            style={styles.previewImage}
            resizeMode="cover"
          />
        )}
      </View>
      
      <View style={[styles.footer, { backgroundColor: colorScheme === 'dark' ? '#2c2c2e' : '#f8f9fa' }]}>
        <Text style={[styles.footerText, { color: theme.text }]}>
          AI-powered weed detection
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  previewContainer: {
    width: '100%',
    height: 200,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  footer: {
    padding: SPACING.md,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  footerText: {
    textAlign: 'center',
  },
});