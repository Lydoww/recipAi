import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { LoadingStateProps } from '../../types';
import { colors, spacing, typography } from '../../constants/theme';

export function LoadingState({ message = 'Loading...', testID }: LoadingStateProps) {
  return (
    <View style={styles.container} testID={testID}>
      <ActivityIndicator size='large' color={colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  message: {
    marginTop: spacing.lg,
    fontSize: typography.fontSize.lg,
    color: colors.text.secondary,
  },
});
