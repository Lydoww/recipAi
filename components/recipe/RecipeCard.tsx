import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Recipe } from '../../types';
import { colors, spacing, borderRadius, typography, shadows } from '../../constants/theme';

interface RecipeCardProps {
  recipe: Recipe;
  onPress: (recipe: Recipe) => void;
}

export const RecipeCard = React.memo(({ recipe, onPress }: RecipeCardProps) => {
  const handlePress = () => onPress(recipe);
  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.7}>
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
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    flex: 1,
  },
  image: {
    width: '100%',
    height: 140,
    backgroundColor: colors.gray[100],
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary,
  },
  placeholderText: {
    fontSize: 48,
  },
  content: {
    padding: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  duration: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    fontWeight: typography.fontWeight.medium,
  },
  category: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    textTransform: 'uppercase',
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: 0.5,
  },
});
