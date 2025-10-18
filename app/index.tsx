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
    padding: spacing.lg,
    paddingBottom: 80,
  },
  fab: {
    position: 'absolute',
    right: spacing.xl,
    bottom: spacing.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  fabText: {
    color: colors.white,
    fontSize: 32,
    fontWeight: '300',
  },
});
