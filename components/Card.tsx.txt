import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useColorScheme } from 'react-native';
import colors from '@/constants/colors';
import { BORDER_RADIUS, SHADOWS } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  noPadding?: boolean;
}

export default function Card({ children, style, noPadding = false }: CardProps) {
  const colorScheme = useColorScheme() || 'light';
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;
  
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          padding: noPadding ? 0 : 16,
        },
        colorScheme === 'dark' ? styles.cardDark : styles.cardLight,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    marginVertical: 8,
    overflow: 'hidden',
  },
  cardLight: {
    ...SHADOWS.light,
  },
  cardDark: {
    // No shadows in dark mode for better contrast
  },
});