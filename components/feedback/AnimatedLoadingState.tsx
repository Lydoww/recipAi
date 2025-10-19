import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { LoadingStateProps } from '../../types';
import { colors, spacing, typography } from '../../constants/theme';

export function AnimatedLoadingState({ message = 'Loading...', testID }: LoadingStateProps) {
  return (
    <View style={styles.container} testID={testID}>
      <LottieView
        source={require('../../assets/animations/sandy_loading.json')}
        autoPlay
        loop
        style={styles.animation}
      />
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
  animation: {
    width: 300,
    height: 300,
  },
  message: {
    marginTop: spacing.lg,
    fontSize: typography.fontSize.lg,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
