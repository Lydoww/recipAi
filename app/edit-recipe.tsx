import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
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
import { Button } from '../components';
import {
  borderRadius,
  colors,
  spacing,
  typography,
} from '../constants/theme';
import { Recipe } from '../types/database';
import { supabase } from '../lib/supabase';

export default function EditRecipeScreen() {
  const params = useLocalSearchParams();
  const recipe: Recipe = JSON.parse(params.recipe as string);

  const [title, setTitle] = useState(recipe.title);
  const [duration, setDuration] = useState(recipe.duration || '');
  const [category, setCategory] = useState(recipe.category || '');
  const [ingredients, setIngredients] = useState(recipe.ingredients.join('\n'));
  const [steps, setSteps] = useState(recipe.steps.join('\n'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    setLoading(true);

    try {
      const { error: updateError } = await supabase
        .from('recipes')
        .update({
          title: title.trim(),
          duration: duration.trim() || null,
          category: category.trim() || null,
          ingredients: ingredientsArray,
          steps: stepsArray,
          edited_by_user: true,
        })
        .eq('id', recipe.id);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      // Success - navigate back to detail with updated recipe
      const updatedRecipe: Recipe = {
        ...recipe,
        title: title.trim(),
        duration: duration.trim() || null,
        category: category.trim() || null,
        ingredients: ingredientsArray,
        steps: stepsArray,
        edited_by_user: true,
      };

      Alert.alert('Success', 'Recipe updated successfully!', [
        {
          text: 'OK',
          onPress: () => {
            router.back();
            router.push({
              pathname: '/recipe-detail',
              params: { recipe: JSON.stringify(updatedRecipe) },
            });
          },
        },
      ]);
    } catch (err) {
      setError('Failed to update recipe. Please try again.');
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
              loading={loading}
              disabled={loading}
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
