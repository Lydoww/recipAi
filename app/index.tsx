import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { useRecipes } from '../hooks';
import { RecipeCard, LoadingState, EmptyState } from '../components';
import { Recipe } from '../types';
import { colors, spacing } from '../constants/theme';

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
        onAction={() => router.push('/add-recipe')}
      />
    );
  }

  return (
    <View style={styles.container}>
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

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/add-recipe')}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.xl,
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    right: spacing['2xl'],
    bottom: spacing['3xl'],
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primaryDark,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  fabText: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '400',
    marginTop: -2,
  },
});
