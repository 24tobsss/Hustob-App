import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Platform
} from 'react-native';
import { BORDER_RADIUS, SPACING } from '@/constants/theme';
import colors from '@/constants/colors';
import { useColorScheme } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  fullWidth = false,
}: ButtonProps) {
  const colorScheme = useColorScheme() || 'light';
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;
  
  const getBackgroundColor = () => {
    if (disabled) return theme.inactive;
    
    switch (variant) {
      case 'primary':
        return theme.primary;
      case 'secondary':
        return theme.secondary;
      case 'outline':
        return 'transparent';
      case 'danger':
        return theme.error;
      default:
        return theme.primary;
    }
  };
  
  const getTextColor = () => {
    if (disabled) return colorScheme === 'dark' ? '#666' : '#999';
    
    switch (variant) {
      case 'outline':
        return theme.primary;
      case 'primary':
      case 'secondary':
      case 'danger':
        return '#fff';
      default:
        return '#fff';
    }
  };
  
  const getBorderColor = () => {
    if (disabled) return theme.inactive;
    
    switch (variant) {
      case 'outline':
        return theme.primary;
      default:
        return 'transparent';
    }
  };
  
  const getButtonSize = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: SPACING.xs,
          paddingHorizontal: SPACING.md,
          borderRadius: BORDER_RADIUS.md,
        };
      case 'large':
        return {
          paddingVertical: SPACING.md,
          paddingHorizontal: SPACING.xl,
          borderRadius: BORDER_RADIUS.lg,
        };
      case 'medium':
      default:
        return {
          paddingVertical: SPACING.sm,
          paddingHorizontal: SPACING.lg,
          borderRadius: BORDER_RADIUS.md,
        };
    }
  };
  
  const getTextSize = (): TextStyle => {
    switch (size) {
      case 'small':
        return { fontSize: 14 };
      case 'large':
        return { fontSize: 18 };
      case 'medium':
      default:
        return { fontSize: 16 };
    }
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonSize(),
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1 : 0,
          width: fullWidth ? '100%' : undefined,
          opacity: disabled ? 0.7 : 1,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          color={getTextColor()} 
          size="small" 
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text
            style={[
              styles.text,
              getTextSize(),
              { color: getTextColor() },
              icon ? { marginLeft: SPACING.sm } : {},
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});