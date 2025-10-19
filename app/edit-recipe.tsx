import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, SuccessAnimation, AnimatedLoadingState, ErrorState } from '../components';
import {
  borderRadius,
  colors,
  spacing,
  typography,
} from '../constants/theme';
import { Database, Recipe } from '../types/database';
import { supabase } from '../lib/supabase';

export default function EditRecipeScreen() {
  const params = useLocalSearchParams();
  const recipeId = params.id as string;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch recipe data
  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      try {
        const { data, error: fetchError } = await supabase
          .from('recipes')
          .select('*')
          .eq('id', recipeId)
          .single<Recipe>();

        if (fetchError) throw fetchError;
        if (!data) throw new Error('Recipe not found');

        setRecipe(data);
        setTitle(data.title);
        setDuration(data.duration || '');
        setCategory(data.category || '');
        setIngredients(data.ingredients.join('\n'));
        setSteps(data.steps.join('\n'));
      } catch (err: any) {
        setError(err.message || 'Failed to load recipe');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  async function handleSave() {
    setError(null);

    // Validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    const ingredientsArray = ingredients
      .split('\n')
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    const stepsArray = steps
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (ingredientsArray.length === 0) {
      setError('At least one ingredient is required');
      return;
    }

    if (stepsArray.length === 0) {
      setError('At least one step is required');
      return;
    }

    setSaving(true);

    try {
      const { error: updateError } = await supabase
        .from('recipes')
        // @ts-ignore - Supabase type inference issue with update
        .update({
          title: title.trim(),
          duration: duration.trim() || null,
          category: category.trim() || null,
          ingredients: ingredientsArray,
          steps: stepsArray,
          edited_by_user: true,
        })
        .eq('id', recipeId);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      // Show success animation
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        // Just go back - recipe-detail will refetch automatically
        router.back();
      }, 2500);
    } catch (err) {
      setError('Failed to update recipe. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <AnimatedLoadingState message="Loading recipe..." />;
  }

  if (error && !recipe) {
    return (
      <ErrorState
        message={error}
        onRetry={() => router.back()}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SuccessAnimation
        visible={showSuccess}
        onAnimationFinish={() => setShowSuccess(false)}
        message="Recipe edited successfully!"
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Edit Recipe</Text>
          <Text style={styles.subtitle}>
            Modify any details and save your changes
          </Text>
        </View>

        <View style={styles.form}>
          {/* Title */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={[styles.input, error && !title.trim() && styles.inputError]}
              placeholder='Recipe title'
              placeholderTextColor={colors.text.tertiary}
              value={title}
              onChangeText={setTitle}
              editable={!loading}
            />
          </View>

          {/* Duration */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Duration</Text>
            <TextInput
              style={styles.input}
              placeholder='e.g., 30 minutes'
              placeholderTextColor={colors.text.tertiary}
              value={duration}
              onChangeText={setDuration}
              editable={!loading}
            />
          </View>

          {/* Category */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Category</Text>
            <TextInput
              style={styles.input}
              placeholder='e.g., Italian, Japanese, etc.'
              placeholderTextColor={colors.text.tertiary}
              value={category}
              onChangeText={setCategory}
              editable={!loading}
            />
          </View>

          {/* Ingredients */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Ingredients * (one per line)</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                error &&
                  ingredients
                    .split('\n')
                    .filter((i) => i.trim().length > 0).length === 0 &&
                  styles.inputError,
              ]}
              placeholder='400g spaghetti&#10;200g pancetta&#10;4 eggs'
              placeholderTextColor={colors.text.tertiary}
              value={ingredients}
              onChangeText={setIngredients}
              multiline
              numberOfLines={8}
              textAlignVertical='top'
              editable={!loading}
            />
          </View>

          {/* Steps */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Steps * (one per line)</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                error &&
                  steps
                    .split('\n')
                    .filter((s) => s.trim().length > 0).length === 0 &&
                  styles.inputError,
              ]}
              placeholder='Boil water and cook pasta&#10;Fry pancetta until crispy&#10;Mix eggs with cheese'
              placeholderTextColor={colors.text.tertiary}
              value={steps}
              onChangeText={setSteps}
              multiline
              numberOfLines={10}
              textAlignVertical='top'
              editable={!loading}
            />
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <Button
              label='Save Changes'
              onPress={handleSave}
              loading={saving}
              disabled={saving}
              variant='primary'
              size='medium'
            />
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
    marginTop: spacing.lg,
    marginBottom: spacing['2xl'],
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  form: {
    flex: 1,
  },
  fieldContainer: {
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    fontSize: typography.fontSize.lg,
    color: colors.text.primary,
    borderWidth: 2,
    borderColor: colors.border.default,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.base,
    marginBottom: spacing.md,
    fontWeight: typography.fontWeight.medium,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    backgroundColor: colors.backgroundTertiary,
    borderWidth: 2,
    borderColor: colors.border.default,
  },
  cancelButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
  },
});
