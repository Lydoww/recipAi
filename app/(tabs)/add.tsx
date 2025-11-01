import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Button, SuccessAnimation } from '../../components';
import {
  borderRadius,
  colors,
  spacing,
  typography,
} from '../../constants/theme';
import { processRecipeFromUrl, validateVideoUrl } from '../../lib';

export default function AddRecipeScreen() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function handleSubmit() {
    setError(null);

    const validation = validateVideoUrl(url);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid URL');
      return;
    }

    setLoading(true);

    try {
      const result = await processRecipeFromUrl(url);

      if (result.error) {
        setError(result.error.message);
        return;
      }

      if (result.data) {
        const { recipe } = result.data;

        setShowSuccess(true);

        timeoutRef.current = setTimeout(() => {
          setShowSuccess(false);
          router.push({
            pathname: '/recipe-detail',
            params: { id: recipe.id },
          });
        }, 2500);
      }
    } catch (err) {
      setError('Unexpected error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SuccessAnimation
        visible={showSuccess}
        onAnimationFinish={() => setShowSuccess(false)}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerIcon}>🎥</Text>
          <Text style={styles.title}>Add Recipe from Video</Text>
          <Text style={styles.subtitle}>
            Paste a TikTok or Instagram recipe video URL
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={[styles.input, error && styles.inputError]}
            placeholder='https://www.tiktok.com/@user/video/...'
            placeholderTextColor={colors.text.tertiary}
            value={url}
            onChangeText={(text) => {
              setUrl(text);
              setError(null);
            }}
            autoCapitalize='none'
            autoCorrect={false}
            multiline
            numberOfLines={3}
            editable={!loading}
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Button
            label='✨ Generate Recipe'
            onPress={handleSubmit}
            loading={loading}
            disabled={!url.trim() || loading}
            fullWidth
          />

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>💡 How it works:</Text>
            <Text style={styles.infoText}>
              1. Find a recipe video on TikTok or Instagram{'\n'}
              2. Copy the video link{'\n'}
              3. Paste it here{'\n'}
              4. AI will extract the recipe automatically!
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing['3xl'],
  },
  headerIcon: {
    fontSize: 60,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  input: {
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    fontSize: typography.fontSize.lg,
    color: colors.text.primary,
    borderWidth: 2,
    borderColor: colors.border.default,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: spacing.lg,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.base,
    marginBottom: spacing.md,
    marginTop: -spacing.sm,
    fontWeight: typography.fontWeight.medium,
  },
  infoBox: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginTop: spacing['3xl'],
    borderWidth: 1,
    borderColor: colors.border.accent,
  },
  infoTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  infoText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.relaxed,
  },
});
