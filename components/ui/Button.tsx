import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../constants/theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  testID?: string;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  testID,
}: ButtonProps) {
  const buttonStyle: ViewStyle[] = [
    styles.button,
    styles[variant],
    styles[size],
    ...(fullWidth ? [styles.fullWidth] : []),
    ...((disabled || loading) ? [styles.disabled] : []),
  ];

  const textStyle: TextStyle[] = [
    styles.text,
    styles[`${variant}Text` as keyof typeof styles] as TextStyle,
    styles[`${size}Text` as keyof typeof styles] as TextStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? colors.primary : colors.white}
        />
      ) : (
        <Text style={textStyle}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },

  // Variants
  primary: {
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primaryDark,
  },
  secondary: {
    backgroundColor: colors.backgroundTertiary,
    borderWidth: 1,
    borderColor: colors.border.default,
    ...shadows.sm,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    shadowOpacity: 0,
    elevation: 0,
  },

  // Sizes
  small: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  medium: {
    paddingHorizontal: spacing['3xl'],
    paddingVertical: spacing.lg,
  },
  large: {
    paddingHorizontal: spacing['4xl'],
    paddingVertical: spacing.xl,
  },

  // Text styles
  text: {
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: 0.3,
  },
  primaryText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.text.primary,
  },
  outlineText: {
    color: colors.primary,
  },
  smallText: {
    fontSize: typography.fontSize.base,
  },
  mediumText: {
    fontSize: typography.fontSize.lg,
  },
  largeText: {
    fontSize: typography.fontSize.xl,
  },
});
