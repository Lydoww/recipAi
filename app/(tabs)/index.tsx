import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import { useRecipes } from '../../hooks';
import { RecipeCard, LoadingState, EmptyState } from '../../components';
import { Recipe } from '../../types';
import { colors, spacing, typography } from '../../constants/theme';

export default function HomeScreen() {
  const { recipes, loading, refetch } = useRecipes();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleRecipePress = (recipe: Recipe) => {
    router.push({
      pathname: '/recipe-detail',
      params: { recipe: JSON.stringify(recipe) },
    });
  };

  if (loading) {
    return <LoadingState message="Loading recipes..." />;
  }

  if (recipes.length === 0) {
    return (
      <EmptyState
        icon="📱"
        title="No recipes yet"
        subtitle="Add your first recipe from TikTok or Instagram!"
        actionLabel="+ Add Recipe"
        onAction={() => router.push('/(tabs)/add')}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recipes</Text>
      </View>
      <FlatList
        data={recipes}
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item}
            onPress={() => handleRecipePress(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: spacing['3xl'],
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    backgroundColor: colors.backgroundTertiary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerTitle: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  list: {
    padding: spacing.xl,
    paddingBottom: spacing.xl,
  },
});
