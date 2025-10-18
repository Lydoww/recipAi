import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Button } from '../components';
import { validateVideoUrl } from '../lib/validation';
import { colors, spacing, typography, borderRadius } from '../constants/theme';

export default function AddRecipeScreen() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);

    const validation = validateVideoUrl(url);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid URL');
      return;
    }

    setLoading(true);

    try {
      alert(
        `Recipe processing not implemented yet!\n\n` +
        `Platform detected: ${validation.platform}\n` +
        `Coming in next step 🚀`
      );
    } catch (err) {
      setError('Error processing recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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
            placeholder="https://www.tiktok.com/@user/video/..."
            placeholderTextColor={colors.text.tertiary}
            value={url}
            onChangeText={(text) => {
              setUrl(text);
              setError(null);
            }}
            autoCapitalize="none"
            autoCorrect={false}
            multiline
            numberOfLines={3}
            editable={!loading}
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Button
            label="✨ Generate Recipe"
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
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    fontSize: typography.fontSize.lg,
    color: colors.text.primary,
    borderWidth: 2,
    borderColor: colors.border.default,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: spacing.md,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.base,
    marginBottom: spacing.md,
    marginTop: -spacing.sm,
  },
  infoBox: {
    backgroundColor: '#f0fdf4',
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginTop: spacing['2xl'],
    borderWidth: 1,
    borderColor: '#d1fae5',
  },
  infoTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: '#065f46',
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: typography.fontSize.base,
    color: '#047857',
    lineHeight: typography.lineHeight.relaxed,
  },
});
