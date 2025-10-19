import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Recipe } from '../types/database';
import { colors, spacing, typography, borderRadius, shadows } from '../constants/theme';

export default function RecipeDetailScreen() {
  const params = useLocalSearchParams();
  const recipe: Recipe = JSON.parse(params.recipe as string);

  const handleEdit = () => {
    router.push({
      pathname: '/edit-recipe',
      params: { recipe: JSON.stringify(recipe) },
    });
  };

  return (
    <ScrollView style={styles.container}>
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
        <View style={styles.titleRow}>
          <Text style={styles.title}>{recipe.title}</Text>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Ionicons name='pencil' size={20} color={colors.white} />
          </TouchableOpacity>
        </View>

        {recipe.edited_by_user && (
          <View style={styles.editedBadge}>
            <Ionicons name='checkmark-circle' size={16} color={colors.white} />
            <Text style={styles.editedText}>Edited by you</Text>
          </View>
        )}

        {recipe.duration && (
          <View style={styles.metaRow}>
            <Text style={styles.metaItem}>⏱️ {recipe.duration}</Text>
            {recipe.category && (
              <Text style={styles.metaItem}>• {recipe.category}</Text>
            )}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🥘 Ingredients</Text>
          {recipe.ingredients.map((ingredient, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{ingredient}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👨‍🍳 Steps</Text>
          {recipe.steps.map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {recipe.source_url && (
          <TouchableOpacity style={styles.sourceButton}>
            <Text style={styles.sourceButtonText}>🔗 View Original Video</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  image: {
    width: '100%',
    height: 320,
    backgroundColor: colors.gray[100],
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary,
  },
  placeholderText: {
    fontSize: 80,
  },
  content: {
    padding: spacing.xl,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    lineHeight: 36,
    marginRight: spacing.md,
  },
  editButton: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  editedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
  },
  editedText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.white,
    marginLeft: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing['3xl'],
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  metaItem: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginRight: spacing.lg,
    fontWeight: typography.fontWeight.medium,
  },
  section: {
    marginBottom: spacing['4xl'],
  },
  sectionTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
  },
  bullet: {
    fontSize: typography.fontSize.lg,
    color: colors.primary,
    marginRight: spacing.md,
    fontWeight: typography.fontWeight.bold,
    marginTop: 2,
  },
  listText: {
    fontSize: typography.fontSize.lg,
    color: colors.text.primary,
    flex: 1,
    lineHeight: 26,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
    ...shadows.sm,
  },
  stepNumberText: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  stepText: {
    fontSize: typography.fontSize.lg,
    color: colors.text.primary,
    flex: 1,
    lineHeight: 26,
    paddingTop: 6,
  },
  sourceButton: {
    backgroundColor: colors.secondary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.accent,
  },
  sourceButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
});
