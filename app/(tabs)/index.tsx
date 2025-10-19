import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { EmptyState, LoadingState, RecipeCard } from '../../components';
import {
  borderRadius,
  colors,
  shadows,
  spacing,
  typography,
} from '../../constants/theme';
import { useRecipes, useDebounce } from '../../hooks';
import { Recipe } from '../../types';

export default function HomeScreen() {
  const { recipes, loading, refetch } = useRecipes();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

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

  const filteredRecipes = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return recipes;

    const query = debouncedSearchQuery.toLowerCase();
    return recipes.filter((recipe) => {
      const titleMatch = recipe.title.toLowerCase().includes(query);
      const ingredientsMatch = recipe.ingredients.some((ingredient) =>
        ingredient.toLowerCase().includes(query)
      );
      const categoryMatch = recipe.category?.toLowerCase().includes(query);

      return titleMatch || ingredientsMatch || categoryMatch;
    });
  }, [recipes, debouncedSearchQuery]);

  if (loading) {
    return <LoadingState message='Loading recipes...' />;
  }

  if (recipes.length === 0 && !loading) {
    return (
      <EmptyState
        icon='📱'
        title='No recipes yet'
        subtitle='Add your first recipe from TikTok or Instagram!'
        actionLabel='+ Add Recipe'
        onAction={() => router.push('/(tabs)/add')}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recipes</Text>

        <View
          style={[
            styles.searchContainer,
            isSearchFocused && styles.searchContainerFocused,
          ]}
        >
          <Ionicons
            name='search'
            size={20}
            color={isSearchFocused ? colors.primary : colors.text.tertiary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder='Search recipes, ingredients...'
            placeholderTextColor={colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            autoCapitalize='none'
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Ionicons
              name='close-circle'
              size={20}
              color={colors.text.tertiary}
              style={styles.clearIcon}
              onPress={() => setSearchQuery('')}
            />
          )}
        </View>
      </View>

      {filteredRecipes.length === 0 ? (
        <View style={styles.emptySearch}>
          <Text style={styles.emptySearchIcon}>🔍</Text>
          <Text style={styles.emptySearchTitle}>No recipes found</Text>
          <Text style={styles.emptySearchSubtitle}>
            Try a different search term
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredRecipes}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <RecipeCard recipe={item} onPress={() => handleRecipePress(item)} />
            </View>
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
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
    marginBottom: spacing.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderWidth: 2,
    borderColor: colors.border.default,
    ...shadows.sm,
    transition: 'all 0.2s ease',
  },
  searchContainerFocused: {
    borderColor: colors.primary,
    ...shadows.md,
    backgroundColor: colors.white,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.lg,
    color: colors.text.primary,
    paddingVertical: spacing.sm,
  },
  clearIcon: {
    marginLeft: spacing.sm,
  },
  list: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  cardWrapper: {
    flex: 1,
    margin: spacing.sm,
  },
  emptySearch: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['3xl'],
  },
  emptySearchIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptySearchTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  emptySearchSubtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
