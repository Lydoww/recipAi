import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Recipe } from '../types';
import { colors, spacing, borderRadius, typography, shadows } from '../constants/theme';

interface RecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
}

export function RecipeCard({ recipe, onPress }: RecipeCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {recipe.image_url ? (
        <Image
          source={{ uri: recipe.image_url }}
          style={styles.image}
          resizeMode='cover'
        />
      ) : (
        <View style={[styles.image, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>🍳</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {recipe.title}
        </Text>

        {recipe.duration && (
          <Text style={styles.duration}>⏱️ {recipe.duration}</Text>
        )}

        {recipe.category && (
          <Text style={styles.category}>{recipe.category}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.xl,
    overflow: 'hidden',
    ...shadows.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  image: {
    width: '100%',
    height: 240,
    backgroundColor: colors.gray[100],
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary,
  },
  placeholderText: {
    fontSize: 64,
  },
  content: {
    padding: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
    lineHeight: 28,
  },
  duration: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    fontWeight: typography.fontWeight.medium,
  },
  category: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    textTransform: 'uppercase',
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: 0.8,
  },
});
