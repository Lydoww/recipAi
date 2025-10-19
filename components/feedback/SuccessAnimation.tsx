import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react';
import { Modal, StyleSheet, View, Text } from 'react-native';
import { colors, typography, spacing } from '../../constants/theme';

interface SuccessAnimationProps {
  visible: boolean;
  onAnimationFinish?: () => void;
  duration?: number;
  message?: string;
}

export function SuccessAnimation({
  visible,
  onAnimationFinish,
  duration = 2000,
  message = 'Recipe added to your library',
}: SuccessAnimationProps) {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    if (visible && animationRef.current) {
      animationRef.current.play();

      const timer = setTimeout(() => {
        onAnimationFinish?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onAnimationFinish]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType='fade'>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.animationContainer}>
            <LottieView
              ref={animationRef}
              source={require('../../assets/animations/Trophy.json')}
              autoPlay
              loop={false}
              style={styles.animation}
            />
          </View>
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  content: {
    alignItems: 'center',
  },
  animationContainer: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: '100%',
    height: '100%',
  },
  message: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    marginTop: spacing.lg,
    textAlign: 'center',
    paddingHorizontal: spacing['3xl'],
  },
});
